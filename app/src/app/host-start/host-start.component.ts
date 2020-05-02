import { Component, OnInit, OnDestroy } from '@angular/core';

import { flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';

import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';
import { FacebookService } from '../facebook.service';
import { FacebookData, Category } from '../facebook-data';

import { Constants, VisitConsts, ConversationConsts } from '../constants';

import { Visit } from '../visit';
import { Host } from '../host';
import { User } from '../user';
import { Problems } from '../problems';

import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';
import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

import { DialogComponent } from '../dialog/dialog.component';

import { Util } from '../util';

declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-host-start',
  templateUrl: './host-start.component.html',
  styleUrls: ['./host-start.component.css']
})
export class HostStartComponent implements OnInit {

    static readonly Start = 1;
    static readonly MATCH_WITH_VISITOR = 2;
    static readonly WAITING_FOR_VISITOR = 3;

    subscription: Subscription;

    state = HostStartComponent.Start;

    matched_visit: Visit;

    builder: HostDataBuilder;
    host_data = {};

    id: number;
    description: string;
    positive: string;
    negative: string;

    problem = new Problems();

    constructor(
      private apiService: ApiService,
      private userDataService: UserDataService,
      private router: Router,
      public dialog: MatDialog,
      private analyticsService: AnalyticsService,
      private fbService: FacebookService) {
        console.log('constructor');
        this.subscription = this.fbService.getState().subscribe(param => {
          console.log(param);
          let category = Category[param['_category']];
          let content = param['_content'];

          switch(Category[category]){
            case Category.ALREADY_LOGGED_IN:
            case Category.NOT_LOGGED_IN:
              // Nothing to do
              break;
            case Category.SEND_TO_MESSENGER:
              console.log('send_to_message');
              break;
            default:
              break;
          }
      });
    }

    ngOnInit() {
      this.state = HostStartComponent.Start;
    }

    ngAfterViewInit() {
      console.log('ngAfterViewInit');
      if(window.FB != null){
        window.FB.XFBML.parse();
      }
    }

    ngOnDestroy(){
      console.log('HostStartComponent ngOnDestroy');
      if (this.subscription) {
        console.log('unsubscribe');
        this.subscription.unsubscribe();
      }
    }


    onNextButtonClicked() {
        console.log('onNextButtonClicked');

        this.apiService.getVisitData(Constants.ALL_VISITS).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('getVisitData', 'Error'))
          ).subscribe(param => {
            if (param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              let contents = param[Constants.CONTENT];
              console.log(contents);
              // Check if content array is more than 1 (Means some visitor is waiting for you)
              if(contents != null && contents.length >= 1){
                this.matchingWithVisitor(contents);
              } else {
                //If no visitor is waiting
                this.registerToVisitorWaitingQueue();
              }


            } else {
              console.log('getVisitData response error');
              this.openDialog(1, 'Something went wrong. Please try again later', 'OK', null);
            }
          })

        this.sendEvent('body', 'register_as_host', 'click');

    }

    createHostData(): Host {
      this.builder = new HostDataBuilder();
      return this.builder.setUserId(this.userDataService.getUserId()).setUserName(this.userDataService.getUserName()).setThumbUrl(this.userDataService.getThumbUrl()).getResult();
    }

    matchingWithVisitor(contents: any): void {
      console.log('matchingWithVisitor');
      let array = JSON.parse(contents);
      let obj = array[0];
      console.log(obj);

      let start = new Util().createDateForDisplay(obj[VisitConsts.KEY_START]);
      let end = new Util().createDateForDisplay(obj[VisitConsts.KEY_END]);

      let builder = new VisitDataBuilder();
      this.matched_visit = builder.setVisitId(obj[VisitConsts.KEY_VISIT_ID]).setUserId(obj[VisitConsts.KEY_USER_ID]).setUserName(obj[VisitConsts.KEY_USER_NAME]).setThumbUrl(obj[VisitConsts.KEY_THUMB_URL]).setPlace(obj[VisitConsts.KEY_PLACE]).setStart(start).setEnd(end).setComment(obj[VisitConsts.KEY_COMMENT]).setProblems(obj[VisitConsts.KEY_PROBLEMS]).getResult();

      this.state = HostStartComponent.MATCH_WITH_VISITOR;

    }

    registerToVisitorWaitingQueue(): void {
      console.log('registerToVisitorWaitingQueue');

      this.host_data = this.createHostData();

      this.apiService.createHostData(this.host_data).pipe(
        tap(data => console.log(data)),
        catchError(this.apiService.handleError<string>('createHostData', 'Error'))
        ).subscribe(params2 => {
          if (params2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
            // Successfully registered to waiting queue
            this.state = HostStartComponent.WAITING_FOR_VISITOR;
          } else {
            console.log('createHostData response error');
            this.openDialog(2, 'Something went wrong. Please try again later', 'OK', null);
          }
        });
    }


    startConversation(): void {
      console.log('startConversation');

      let builder = new ConversationDataBuilder();
      let conversation = builder.setHostUserId(this.userDataService.getUserId()).setHostUserName(this.userDataService.getUserName()).setHostThumbUrl(this.userDataService.getThumbUrl()).setVisitorUserId(this.matched_visit.getUserId()).setVisitorUserName(this.matched_visit.getUserName()).setVisitorThumbUrl(this.matched_visit.getThumbUrl()).setMessages([]).setVisitId(this.matched_visit.getVisitId()).setCurrentUserId(this.userDataService.getUserId()).getResult();

      this.apiService.createConversationData(conversation).pipe(
        tap(heroes => console.log('fetched users')),
        catchError(this.apiService.handleError<string>('createConversationData', 'Error'))
      ).subscribe(param => {
        if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
          console.log(param);
          let content = param[Constants.CONTENT];
          let conv_id = content[ConversationConsts.KEY_CONVERSATION_ID];
          console.log(conv_id);
          this.router.navigate(['/conversation', conv_id]);
        } else {
            console.log('createHostData response error');
            this.openDialog(3, 'Something went wrong. Please try again later', 'OK', null);
        }
      });

     this.sendEvent('body', 'start_conversation', 'click');

    }

    getUserId(): string {
      return this.userDataService.getUserId();
    }


  openDialog(id: number, description: string, positive_button: string, negative_button: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
        // width: '250px',
      data: {id: id, description: description, positive: positive_button, negative: negative_button}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      // this.description = result;
    });
  }

  getIconName(id: string): string {
    return this.problem.getIconName(id);
  }

  getLabel(id: string): string{
    return this.problem.getLabel(id);
  }

  handleError(id: number, option: number): void {
    if(option == Constants.DIALOG_OPTION_POSITIVE){
      switch(id) {
        case 1:
        case 2:
        case 3:
        // Nothing to do for now.
         break;
      }
    } else {
      console.log('Option negative');
    }
  }

  sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
    console.log('sendEvent');
    this.analyticsService.sendEvent('host-start', eventCategory, eventAction, eventLabel);
  }

}

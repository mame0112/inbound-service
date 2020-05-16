import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';

import { Subscription } from 'rxjs';

import { Router, NavigationEnd } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';
import { FacebookService } from '../facebook.service';
import { FacebookData, Category } from '../facebook-data';

import { Constants, VisitConsts, ConversationConsts, WebhookRefConstants } from '../constants';

import { Visit } from '../visit';
import { Host } from '../host';
import { User } from '../user';
import { Problems } from '../problems';

import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';
import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

import { DialogComponent } from '../dialog/dialog.component';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';

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

    progressDialogRef = null;

    constructor(
      private apiService: ApiService,
      private userDataService: UserDataService,
      private router: Router,
      private matDialog: MatDialog,
      private analyticsService: AnalyticsService,
      private fbService: FacebookService,
      private snackBar: MatSnackBar,
      private zone: NgZone) {
        console.log('constructor');

        this.subscription = this.fbService.getState().subscribe(param => this.onFacebookEventInvoked(param));

    }

    onFacebookEventInvoked(param: FacebookData): void{

      console.log('onFacebookEventInvoked');
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
          this.openSnackbar();
          break;
        default:
          break;
      }
    }

    ngOnInit() {
      if (this.userDataService.hasValidUserData()){
        console.log('Valid data');
        this.state = HostStartComponent.Start;
      } else {
        console.log('Not valid data');
        this.openDialog(DialogIdentifier.INIT_FAILED, 'Something went wrong. Please try again later', 'OK', null);
      }

      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }

        window.scrollTo(0, 0)
      });

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

        this.openProgressDialog(ProgressDialogIdentifier.GET_VISIT_DATA);

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
              this.closeProgressDialog(ProgressDialogIdentifier.GET_VISIT_DATA);
              this.openDialog(DialogIdentifier.NEXT_BUTTON_RESPONSE_FAILED, 'Something went wrong. Please try again later', 'OK', null);
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

      this.closeProgressDialog(ProgressDialogIdentifier.GET_VISIT_DATA);

    }

    registerToVisitorWaitingQueue(): void {
      console.log('registerToVisitorWaitingQueue');

      // this.openProgressDialog(ProgressDialogIdentifier.CREATE_HOST_DATA);

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
            this.openDialog(DialogIdentifier.CREATE_HOST_FAILED, 'Something went wrong. Please try again later', 'OK', null);
          }

          this.closeProgressDialog(ProgressDialogIdentifier.CREATE_HOST_DATA);

        });
    }


    startConversation(): void {
      console.log('startConversation');

      this.openProgressDialog(ProgressDialogIdentifier.START_CONVERSATION);

      let builder = new ConversationDataBuilder();
      let conversation = builder.setHostUserId(this.userDataService.getUserId()).setHostUserName(this.userDataService.getUserName()).setHostThumbUrl(this.userDataService.getThumbUrl()).setVisitorUserId(this.matched_visit.getUserId()).setVisitorUserName(this.matched_visit.getUserName()).setVisitorThumbUrl(this.matched_visit.getThumbUrl()).setMessages([]).setVisitId(this.matched_visit.getVisitId()).setCurrentUserId(this.userDataService.getUserId()).setVisitStart(this.matched_visit.getStart()).setVisitEnd(this.matched_visit.getEnd()).setVisitComment(this.matched_visit.getComment()).setVisitProblems(this.matched_visit.getProblems()).setVisitPlace(this.matched_visit.getPlace()).getResult();

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
            this.openDialog(DialogIdentifier.START_CONVERSATION_FAILED, 'Something went wrong. Please try again later', 'OK', null);
        }

        this.closeProgressDialog(ProgressDialogIdentifier.START_CONVERSATION);

      });

     this.sendEvent('body', 'start_conversation', 'click');

    }

    getUserId(): string {
      return this.userDataService.getUserId();
    }

    openSnackbar(): void {
      console.log('openSnackBar');

      const config = new MatSnackBarConfig();
      config.duration = 3000;
      config.horizontalPosition = 'center';
      config.verticalPosition = 'top';

      this.zone.run(() => {
        const snackbarRef = this.snackBar.open('Thank you very much. Please wait a moment', 'OK', config);

        snackbarRef.afterDismissed().subscribe(() => {
          console.log('snackbar is dismissed');
          this.router.navigate(['/my-page']);
        });

      });

    }


  openDialog(id: number, description: string, positive_button: string, negative_button: string): void {
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '250px',
      data: {id: id, description: description, positive: positive_button, negative: negative_button},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);

      switch(result.id) {
        case DialogIdentifier.INIT_FAILED:
          this.router.navigate(['/landing']);
          break;
        case DialogIdentifier.NEXT_BUTTON_RESPONSE_FAILED:
          break;
        case DialogIdentifier.CREATE_HOST_FAILED:
          break;
        case DialogIdentifier.START_CONVERSATION_FAILED:
          break;
        // Nothing to do for now.
         break;
      }
    });
  }

  openProgressDialog(id: number): void {
    this.progressDialogRef = this.matDialog.open(ProgressDialogComponent, {
      data: {id: id}
    });

    this.progressDialogRef.afterClosed().subscribe(result => {
      console.log('The progress dialog was closed');
      console.log(result);

      switch(result.id) {
        case ProgressDialogIdentifier.GET_VISIT_DATA:
          break;
        case ProgressDialogIdentifier.CREATE_HOST_DATA:
          break;
        case ProgressDialogIdentifier.START_CONVERSATION:
          break;
      }
    });
  }

  closeProgressDialog(id: number): void{
    this.progressDialogRef.close(id);
  }

  getIconName(id: string): string {
    return this.problem.getIconName(id);
  }

  getLabel(id: string): string{
    return this.problem.getLabel(id);
  }

  sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
    console.log('sendEvent');
    this.analyticsService.sendEvent('host-start', eventCategory, eventAction, eventLabel);
  }

  createWebhookRefData(): any {
    return new Util().createWebhookRefData(this.userDataService.getUserId(), WebhookRefConstants.KEY_TYPE_HOST);
  }

}

export enum DialogIdentifier {
  INIT_FAILED,
  NEXT_BUTTON_RESPONSE_FAILED,
  CREATE_HOST_FAILED,
  START_CONVERSATION_FAILED

}

export enum ProgressDialogIdentifier {
  GET_VISIT_DATA,
  CREATE_HOST_DATA,
  START_CONVERSATION,
}


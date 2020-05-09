import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';

import { Subscription } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';
import { FacebookService } from '../facebook.service';
import { FacebookData, Category } from '../facebook-data';

import { Visit } from '../visit';
import { Host } from '../host';
import { Problems } from '../problems';

import { Constants, HostConsts, VisitConsts, ConversationConsts } from '../constants';
import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';
import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

import { DialogComponent } from '../dialog/dialog.component';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';

declare var window: any;
declare var FB: any;

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    subscription: Subscription;

    isOverview = true;
    host: Host;
    user_id: string;

    problems = Problems.problems;

    static readonly Start = 1;
    static readonly Creation = 2;
    static readonly WaitingForHost = 3;
    static readonly MatchedWithHost = 4;

    state = 1;

    visit = new Visit();

    selectedOptions: string[] = [];

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
              this.openSnackbar();
              break;
            default:
              break;
          }
      });

    }

    ngOnInit() {
      if (this.userDataService.hasValidUserData()){
        console.log('Valid data');
        this.createVisitJson();
      } else {
        console.log('Not valid data');
        this.openDialog(DialogIdentifier.INIT_FAILED, 'Something went wrong. Please try again later', 'OK', null);
      }
    }

    ngAfterViewInit() {
      console.log('ngAfterViewInit');
      if(window.FB !== undefined){
        window.FB.XFBML.parse();
      }

    }

    ngOnDestroy(){
      console.log('VisitStartComponent ngOnDestroy');
      if (this.subscription) {
        console.log('unsubscribe');
        this.subscription.unsubscribe();
      }
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');
        // this.isOverview = !this.isOverview;
        this.state = VisitStartComponent.Creation;
        this.sendEvent('body', 'next_button', 'click');
    }

    onClickMenu() {
        console.log('Menu Clicked');
    }

    onSubmit(){
        console.log('Submitted:' + JSON.stringify(this.visit));
        this.openProgressDialog(ProgressDialogIdentifier.CREATE_VISIT_DATA);

        this.apiService.createVisitData(this.visit).pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createVisitData', 'Error'))
        ).subscribe(param => {

          if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
                console.log('createVisitData OK');

                let create_visit_content = param[Constants.CONTENT]
                if(create_visit_content == null || create_visit_content == undefined){
                    console.log('visit_id is null or undefined');
                    return;
                }

                let visit_id = create_visit_content[VisitConsts.KEY_VISIT_ID];
                this.visit.setVisitId(visit_id);
                console.log('visit_id');
                console.log(visit_id);


                this.apiService.getHostData().pipe(
                    tap(heroes2 => console.log('fetched users')),
                    catchError(this.apiService.handleError<string>('getHostData', 'Error'))
                ).subscribe(param2 => {

                if(param2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
                      console.log('getHostData OK');

                    let content = param2[Constants.CONTENT];
                    if(content !== null && content.length >= 1) {
                        // Host is waiting
                        console.log('Matched with Host');

                        let first_host = content[0];
                        console.log(first_host);

                        let builder = new HostDataBuilder();
                        this.host = builder.setUserId(first_host[HostConsts.KEY_USER_ID]).setUserName(first_host[HostConsts.KEY_USER_NAME]).setThumbUrl(first_host[HostConsts.KEY_THUMB_URL]).getResult();

                        this.state = VisitStartComponent.MatchedWithHost;
                    } else {
                        console.log('Host is not waiting');
                        console.log(param2);
                        this.state = VisitStartComponent.WaitingForHost;
                    }
                } else {
                    console.log('Error ocurred');
                    this.openDialog(DialogIdentifier.GET_HOST_FAILED, 'Something went wrong. Please try again later', 'OK', null);
                }

            }
            );
          } else {
            this.openDialog(DialogIdentifier.CREATE_VISIT_FAILED, 'Something went wrong. Please try again later', 'OK', null);
          }

          this.closeProgressDialog();

        });

    }

    startConversation(): void {
      console.log('startConversation');

      this.openProgressDialog(ProgressDialogIdentifier.CREATE_CONVERSATION);

      let builder = new ConversationDataBuilder();
      let conversation = builder.setHostUserId(this.host.getUserId()).setHostUserName(this.host.getUserName()).setHostThumbUrl(this.host.getThumbUrl()).setVisitorUserId(this.visit.getUserId()).setVisitorUserName(this.visit.getUserName()).setVisitorThumbUrl(this.visit.getThumbUrl()).setMessages([]).setVisitId(this.visit.getVisitId()).setCurrentUserId(this.user_id).setVisitStart(this.visit.getStart()).setVisitEnd(this.visit.getEnd()).setVisitComment(this.visit.getComment()).setVisitProblems(this.visit.getProblems()).getResult();

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
            this.openDialog(DialogIdentifier.START_CONVERSATION_FAILED, 'Something went wrong. Please try again later', 'OK', null);
          }

          this.closeProgressDialog();

      });

        this.sendEvent('body', 'start_conversation', 'click');

    }


    createVisitJson(): void {
        //TODO Need to put Start / End / Comment and other information
        this.visit.setUserId(this.userDataService.getUserId());
        this.user_id = this.userDataService.getUserId();
        this.visit.setUserName(this.userDataService.getUserName());
        this.visit.setThumbUrl(this.userDataService.getThumbUrl());
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


    onProblemItemSelected(event){

        let problem_array = [];

        event.forEach(function(value){
            // console.log(value.key);
            problem_array.push(value.key);
        })

        this.visit.problems = problem_array;
    }

    openDialog(id: number, description: string, positive_button: string, negative_button: string): void {
      const dialogRef = this.matDialog.open(DialogComponent, {
        width: '250px',
        data: {id: id, description: description, positive: positive_button, negative: negative_button}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);

        switch(result.id) {
          case DialogIdentifier.INIT_FAILED:
            this.router.navigate(['/landing']);
            break;
          case DialogIdentifier.GET_HOST_FAILED:
            break;
          case DialogIdentifier.CREATE_VISIT_FAILED:
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
          case ProgressDialogIdentifier.CREATE_VISIT_DATA:
            break;
          case ProgressDialogIdentifier.CREATE_CONVERSATION:
            break;
        }


      });
    }

    closeProgressDialog(): void{
      this.progressDialogRef.close();
    }


    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
        console.log('sendEvent');
        this.analyticsService.sendEvent('visit-start', eventCategory, eventAction, eventLabel);
    }
}

export enum DialogIdentifier {
  INIT_FAILED,
  GET_HOST_FAILED,
  CREATE_VISIT_FAILED,
  START_CONVERSATION_FAILED,
}

export enum ProgressDialogIdentifier {
  CREATE_VISIT_DATA,
  CREATE_CONVERSATION,
}

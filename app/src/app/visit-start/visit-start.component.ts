import { Component, OnInit, OnDestroy } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';

import { Subscription } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';

// import { MatListOption } from '@angular/material/list';

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

    constructor(
        private apiService: ApiService,
        private userDataService: UserDataService,
        private router: Router,
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
        this.createVisitJson();
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
                }

            }
            );
          }
        });

    }

    startConversation(): void {
      console.log('startConversation');

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
          }
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


    onProblemItemSelected(event){

        let problem_array = [];

        event.forEach(function(value){
            // console.log(value.key);
            problem_array.push(value.key);
        })

        this.visit.problems = problem_array;
    }
    // onGroupsChange(options: MatListOption[]) {
    //     console.log('onGroupsChange');
    //     // map these MatListOptions to their values
    //     console.log(options.map(o => o.value));
    // }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
        console.log('sendEvent');
        this.analyticsService.sendEvent('visit-start', eventCategory, eventAction, eventLabel);
    }
}

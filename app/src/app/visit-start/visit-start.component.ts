import { Component, OnInit } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';

import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';

import { Visit } from '../visit';
import { Host } from '../host';

import { Constants, HostConsts, VisitConsts, ConversationConsts } from '../constants';
import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';
import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    isOverview = true;
    title = 'Test title';
    host: Host;

    problems = [
        {'id': 'exit', 'icon': 'exit', 'label': 'Exit of big station'},
        {'id': 'language', 'icon': 'language', 'label': 'Japanese language'},
        {'id': 'restaurant', 'icon': 'restaurant', 'label': 'Best restaurant for me'},
        {'id': 'lost', 'icon': 'lost', 'label': 'How to get my destination'},
        {'id': 'train', 'icon': 'train', 'label': 'How to buy ticket & get intrain'},
        {'id': 'menu', 'icon': 'menu', 'label': 'Japanese menu'},
        {'id': 'manner', 'icon': 'manner', 'label': 'Japanese manner'},
        {'id': 'others', 'icon': 'others', 'label': 'Others'}
    ]

    static readonly Start = 1;
    static readonly Creation = 2;
    static readonly WaitingForHost = 3;
    static readonly MatchedWithHost = 4;

    state = 1;

    visit = new Visit();

    constructor(
        private apiService: ApiService,
        private userDataService: UserDataService,
        private router: Router,
        private analyticsService: AnalyticsService) { }

    ngOnInit() {
        this.createVisitJson();
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

        // this.apiService.createVisitData(this.visit).pipe(
        //     flatMap((params1) => this.apiService.getHostData())).subscribe(param2 => {
        //         if(param2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){

        //             let content = param2[Constants.CONTENT];
        //             if(content !== null && content.length >= 1) {
        //                 // Host is waiting
        //                 console.log('Matched with Host');

        //                 let first_host = content[0];
        //                 console.log(first_host);

        //                 let builder = new HostDataBuilder();
        //                 this.host = builder.setUserId(first_host[HostConsts.KEY_USER_ID]).setUserName(first_host[HostConsts.KEY_USER_NAME]).setThumbUrl(first_host[HostConsts.KEY_THUMB_URL]).getResult();

        //                 this.state = VisitStartComponent.MatchedWithHost;
        //             } else {
        //                 console.log('Host is not waiting');
        //                 console.log(param2);
        //                 this.state = VisitStartComponent.WaitingForHost;
        //             }
        //         } else {
        //             console.log('Error ocurred');
        //         }

        //     });

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
      let conversation = builder.setHostUserId(this.host.getUserId()).setHostUserName(this.host.getUserName()).setHostThumbUrl(this.host.getThumbUrl()).setVisitorUserId(this.visit.getUserId()).setVisitorUserName(this.visit.getUserName()).setVisitorThumbUrl(this.visit.getThumbUrl()).setMessages([]).setVisitId(this.visit.getVisitId()).getResult();

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
        this.visit.setUserName(this.userDataService.getUserName());
        this.visit.setThumbUrl(this.userDataService.getThumbUrl());
    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
        console.log('sendEvent');
        this.analyticsService.sendEvent('visit-start', eventCategory, eventAction, eventLabel);
    }
}

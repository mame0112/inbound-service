import { Component, OnInit } from '@angular/core';

import { flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { Constants, VisitConsts } from '../constants';

import { Visit } from '../visit';

import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';

@Component({
  selector: 'app-host-start',
  templateUrl: './host-start.component.html',
  styleUrls: ['./host-start.component.css']
})
export class HostStartComponent implements OnInit {

    static readonly Start = 1;
    static readonly MATCH_WITH_VISITOR = 2;
    static readonly WAITING_FOR_VISITOR = 3;

    state = HostStartComponent.Start;

    matched_visit: Visit;


    isOverview = true;
    builder: HostDataBuilder;
    host_data = {};

    constructor(
      private apiService: ApiService,
      private userDataService: UserDataService
      ) { }

    ngOnInit() {
      this.state = HostStartComponent.Start;
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');

        this.apiService.getVisitData(Constants.ALL_VISITS).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('createUserData', 'Error'))
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
            }
          })


        this.isOverview = !this.isOverview;
    }

    matchingWithVisitor(contents: any): void {
      console.log('matchingWithVisitor');
      let array = JSON.parse(contents);
      let obj = array[0];
      console.log(obj);

      let builder = new VisitDataBuilder();
      this.matched_visit = builder.setVisitId(obj[VisitConsts.KEY_VISIT_ID]).setUserId(obj[VisitConsts.KEY_USER_ID]).setUserName(obj[VisitConsts.KEY_USER_NAME]).setThumbUrl(obj[VisitConsts.KEY_THUMB_URL]).setPlace(obj[VisitConsts.KEY_PLACE]).setStart(obj[VisitConsts.KEY_START]).setEnd(obj[VisitConsts.KEY_END]).setComment(obj[VisitConsts.KEY_COMMENT]).getResult();

      this.state = HostStartComponent.MATCH_WITH_VISITOR;

    }

    registerToVisitorWaitingQueue(): void {
      console.log('registerToVisitorWaitingQueue');
      this.builder = new HostDataBuilder();
      this.host_data = this.builder.setUserId(this.userDataService.getUserId()).setUserName(this.userDataService.getUserName()).setThumbUrl(this.userDataService.getThumbUrl()).getResult();

      this.apiService.createHostData(this.host_data).pipe(
        tap(data => console.log(data)),
        catchError(this.apiService.handleError<string>('createUserData', 'Error'))
        ).subscribe(params2 => {
          if (params2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
            // Successfully registered to waiting queue
            this.isOverview = !this.isOverview;
          } else {
            console.log('createHostData response error');
          }
        });
    }

    startConversation(): void {
      console.log('startConversation');

      //TODO Start conversation (Move visit / host pointer?)

    }

}

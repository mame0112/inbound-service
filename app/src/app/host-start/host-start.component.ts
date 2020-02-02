import { Component, OnInit } from '@angular/core';

import { flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { Constants } from '../constants';

import { HostDataBuilder } from '../data-builder/host-data-builder';

@Component({
  selector: 'app-host-start',
  templateUrl: './host-start.component.html',
  styleUrls: ['./host-start.component.css']
})
export class HostStartComponent implements OnInit {

    isOverview = true;
    builder: HostDataBuilder;
    host_data = {};

    constructor(
      private apiService: ApiService,
      private userDataService: UserDataService
      ) { }

    ngOnInit() {
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');

        this.apiService.getVisitData(Constants.ALL_VISITS).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(param => {
            if (param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              let content = param[Constants.CONTENT];
              console.log(content);
              // Check if content array is more than 1 (Means some visitor is waiting for you)
              if(content.length >= 1){
                this.matchingWithVisitor();
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

    matchingWithVisitor(): void {

    }

    registerToVisitorWaitingQueue(): void {
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

    // onNextButtonClicked() {
    //     console.log('onNextButtonClicked');

    //     this.apiService.getVisitData(Constants.ALL_VISITS).pipe(
    //       tap(data => console.log(data)),
    //       mergeMap(data => {
    //         if(data['responseCode'] == Constants.RESPONSE_OK) {
    //           console.log('RESPONSE_OK');

    //           this.builder = new HostDataBuilder();
    //           this.host_data = this.builder.setUserId(this.userDataService.getUserId()).setUserName(this.userDataService.getUserName()).setThumbUrl(this.userDataService.getThumbUrl()).getResult();

    //           // return this.apiService.createHostData(JSON.stringify(this.host_data)).subscribe(params2 => console.log(params2));

    //           return Promise.resolve(this.apiService.createHostData(this.host_data).subscribe(params2 => console.log(params2)));
    //           // return "True"
    //         } else {
    //           console.log('responseCode:');
    //           console.log(data['responseCode']);
    //           return;
    //         }
    //       })
    //       ).subscribe(res => {
    //         console.log('subscribe');
    //         console.log(res);
    //       })


    // }

}

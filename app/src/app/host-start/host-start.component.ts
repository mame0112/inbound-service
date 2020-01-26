import { Component, OnInit } from '@angular/core';

import { flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { Constants } from '../constants';

import { HostDataBuider } from '../data-builder/host-data-builder';

@Component({
  selector: 'app-host-start',
  templateUrl: './host-start.component.html',
  styleUrls: ['./host-start.component.css']
})
export class HostStartComponent implements OnInit {

    isOverview = true;
    builder: HostDataBuider;
    host_data = {};

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');

        // this.apiService.getVisitData(Constants.ALL_VISITS).subscribe(params => console.log(params));



        this.apiService.getVisitData(Constants.ALL_VISITS).pipe(
          tap(data => console.log(data)),
          mergeMap(data => {
            if(data['responseCode'] == Constants.RESPONSE_OK) {
              console.log('RESPONSE_OK');

              this.builder = new HostDataBuider();
              this.host_data = this.builder.setUserId(1).setUserName("Test user name").setThumbUrl("https://xxxx").getResult();

              // return this.apiService.createHostData(JSON.stringify(this.host_data)).subscribe(params2 => console.log(params2));

              return Promise.resolve(this.apiService.createHostData(this.host_data).subscribe(params2 => console.log(params2)));
              // return "True"
            } else {
              console.log('responseCode:');
              console.log(data['responseCode']);
              return;
            }
          })
          ).subscribe(res => {
            console.log('subscribe');
            console.log(res);
          })


        this.isOverview = !this.isOverview;
    }

}

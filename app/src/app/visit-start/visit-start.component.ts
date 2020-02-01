import { Component, OnInit } from '@angular/core';

import { flatMap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { Visit } from '../visit';
import { Host } from '../host';

import { Constants, HostConsts, VisitConsts, ConversationConsts } from '../constants';
import { VisitDataBuilder } from '../data-builder/visit-data-builder';
import { HostDataBuilder } from '../data-builder/host-data-builder';

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    isOverview = true;
    title = 'Test title';
    host: Host;

    static readonly Start = 1;
    static readonly Creation = 2;
    static readonly WaitingForHost = 3;
    static readonly MatchedWithHost = 4;

    state = 1;

    visit = new Visit();

    constructor(
        private apiService: ApiService,
        private userDataService: UserDataService) { }

    ngOnInit() {
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');
        // this.isOverview = !this.isOverview;
        this.state = VisitStartComponent.Creation;
    }

    onClickMenu() {
        console.log('Menu Clicked');
    }

    onSubmit(){
        this.createVisitJson(this.visit)
        console.log('Submitted:' + JSON.stringify(this.visit));

        this.apiService.createVisitData(this.visit).pipe(
            flatMap((params1) => this.apiService.getHostData())).subscribe(param2 => {
                if(param2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
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

            });

        //     this.apiService.getHostData(params2 => console.log(params2));

        //     const obj = JSON.parse(params);
        //     if(obj.responseCode == 200){
        //         this.apiService.getHostData(params => console.log(params));
        //     } else {
        //         console.log('ResponseCode is not 200')
        //     }
        // });
    }


    createVisitJson(visit: Visit): void {
        this.visit.setUserId(this.userDataService.getUserId());
        this.visit.setUserName(this.userDataService.getUserName());
        this.visit.setThumbUrl(this.userDataService.getThumbUrl());
    }
}

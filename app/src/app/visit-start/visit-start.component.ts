import { Component, OnInit } from '@angular/core';

import { flatMap } from 'rxjs/operators';

import { ApiService} from '../api.service';
import { Visit } from '../visit';

import { Constants } from '../constants';
import { VisitDataBuider } from '../data-builder/visit-data-builder';

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    isOverview = true;
    title = 'Test title';

    static readonly Start = 1;
    static readonly Creation = 2;
    static readonly WaitingForHost = 3;
    static readonly MatchedWithHost = 4;

    state = 1;

    // place: typeof Sample = Sample;

    visit = new Visit();

    constructor(private apiService: ApiService) { }

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

        // let result = this.creteVisitData();

        // this.apiService.createVisitData(this.visit).pipe(
        //     flatMap((params1) => this.apiService.getHostData())).subscribe(params2 => console.log(params2));

        this.apiService.createVisitData(this.visit).pipe(
            flatMap((params1) => this.apiService.getHostData())).subscribe(param2 => {
                if(param2[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
                    let content = param2[Constants.CONTENT];
                    if(content !== null && content.length >= 1) {
                        // Host is waiting
                        console.log('Matched with Host');
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

    // creteVisitData(): any{
    //     this.apiService.createVisitData(this.visit).subscribe(params => {return params});
    // }

    createVisitJson(visit: Visit): void {
        this.visit.setUserId(1);
        this.visit.setThumbUrl('https://xxxx');
        this.visit.setUserName("Test user name");
    }
}

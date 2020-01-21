import { Component, OnInit } from '@angular/core';

import { flatMap } from 'rxjs/operators';

import { ApiService} from '../api.service';

import { Visit } from '../visit';
import { VisitDataBuider } from '../data-builder/visit-data-builder';

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    isOverview = true;
    title = 'Test title';

    visit = new Visit();

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');
        this.isOverview = !this.isOverview;
    }

    onClickMenu() {
        console.log('Menu Clicked');
    }

    onSubmit(){
        this.createVisitJson(this.visit)
        console.log('Submitted:' + JSON.stringify(this.visit));
        // this.apiService.createVisitData(this.visit).subscribe(params => console.log(params));
        // this.apiService.createVisitData(this.visit).pipe(
        //     flatMap((params1) => this.apiService.getHostData())).subscribe(params2 => console.log(params2));

        this.apiService.createVisitData(this.visit).pipe(
            flatMap((params1) => this.apiService.getHostData())).subscribe(params2 => console.log(params2));

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
        this.visit.setUserId(1);
        this.visit.setThumbUrl('https://xxxx');
        this.visit.setUserName("Test user name");
    }
}

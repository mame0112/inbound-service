import { Component, OnInit } from '@angular/core';

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
        this.apiService.createVisitData(this.visit).subscribe(params => console.log(params));
    }

    createVisitJson(visit: Visit): void {
        this.visit.setUserId(1);
        this.visit.setThumbUrl('https://xxxx');
        this.visit.setUserName("Test user name");
    }
}

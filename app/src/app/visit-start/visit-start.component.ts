import { Component, OnInit } from '@angular/core';

import { Visit } from '../visit';

@Component({
  selector: 'app-visit-start',
  templateUrl: './visit-start.component.html',
  styleUrls: ['./visit-start.component.css']
})
export class VisitStartComponent implements OnInit {

    isOverview = true;
    title = 'Test title';

    visit = new Visit("Tokyo", "2020/01/20", "2020/01/22", "I would like to go to xxxx")

    constructor() { }

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
        console.log('Submitted:' + JSON.stringify(this.visit));
    }
}

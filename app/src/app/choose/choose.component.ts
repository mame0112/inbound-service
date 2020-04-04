import { Component, OnInit } from '@angular/core';

import { AnalyticsService } from '../analytics.service';
import { UserDataService } from '../user-data.service';
import { JsExecuteService } from '../js-execute.service';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

    user_name: string;

    constructor(private userDataService: UserDataService,
        private analyticsService: AnalyticsService,
        private jsService: JsExecuteService) { }

    ngOnInit() {
        this.user_name = this.userDataService.getUserName();
        this.jsService.testFunction();
    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('choose', eventCategory, eventAction, eventLabel);
    }

}

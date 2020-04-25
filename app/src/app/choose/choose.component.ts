import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AnalyticsService } from '../analytics.service';
import { UserDataService } from '../user-data.service';
import { FacebookService } from '../facebook.service';

declare var window: any;
declare var FB: any;


@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

    user_name: string;
    user_id: string;

    constructor(private userDataService: UserDataService,
        private analyticsService: AnalyticsService,
        private jsService: FacebookService,
        private router: Router) {
      console.log('constructor');

    }

    ngOnInit() {
        this.user_name = this.userDataService.getUserName();
        this.user_id = this.userDataService.getUserId();
        console.log(this.user_id);
     }

    ngAfterViewInit() {
      console.log('ngAfterViewInit');
      window.FB.XFBML.parse();

    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('choose', eventCategory, eventAction, eventLabel);
    }

    onCreateVisitButtonClicked(): void {
      console.log('onCreateVisitButtonClicked');
      this.sendEvent('body', 'visitor', 'click');
      this.router.navigate(['/visit-start']);
    }

    onRegisterAsHostButtonClicked(): void {
      console.log('onRegisterAsHostButtonClicked');
      this.sendEvent('body', 'host', 'click');
      this.router.navigate(['/host-start']);
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AnalyticsService } from '../analytics.service';
import { UserDataService } from '../user-data.service';
import { FacebookService } from '../facebook.service';

import { FacebookData, Category } from '../facebook-data';

declare var window: any;
declare var FB: any;


@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

  subscription: Subscription;

  user_name: string;
  user_id: string;

  constructor(private userDataService: UserDataService,
    private analyticsService: AnalyticsService,
    private jsService: FacebookService,
    private router: Router,
    private fbService: FacebookService) {

      console.log('constructor');

      this.subscription = this.fbService.getState().subscribe(param => {
        console.log(param);
        let category = Category[param['_category']];
        let content = param['_content'];

        switch(Category[category]){
          case Category.ALREADY_LOGGED_IN:
          case Category.NOT_LOGGED_IN:
            // Nothing to do
            break;
          case Category.SEND_TO_MESSENGER:
            console.log('send_to_message');
            break;
          default:
            break;
      }

    });

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

  ngOnDestroy(){
    console.log('ChooseComponent ngOnDestroy');
    if (this.subscription) {
      console.log('unsubscribe');
      this.subscription.unsubscribe();
    }
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

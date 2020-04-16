import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


import { AnalyticsService } from '../analytics.service';
import { UserDataService } from '../user-data.service';
import { JsExecuteService } from '../js-execute.service';

declare var window: any;
declare var FB: any;


@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

    user_name: string;

    constructor(private userDataService: UserDataService,
        private analyticsService: AnalyticsService,
        private jsService: JsExecuteService,
        private router: Router) {
      console.log('constructor');
        (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = '//connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

      window.fbAsyncInit = function() {
        console.log('fbAsyncInit executed');
        FB.init({
          appId            : '1194303814099473',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v6.0'
        });


        FB.Event.subscribe('send_to_messenger', function(e) {
        // FB.Event.subscribe('send_to_messenger', function(e) {
        // callback for events triggered by the plugin
          console.log('send_to_messenger');
          console.log(e);
        });

      };
    }

    ngOnInit() {
        this.user_name = this.userDataService.getUserName();
        // this.jsService.testFunction();
        // this.load();
    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('choose', eventCategory, eventAction, eventLabel);
    }


    load(): void{
      console.log('load');
      (<any>window).fbAsyncInit = function() {
        console.log('fbAsyncInit executed');
        FB.init({
          appId            : '1194303814099473',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v6.0'
        });


        FB.Event.subscribe('send_to_messenger', function(e) {
        // FB.Event.subscribe('send_to_messenger', function(e) {
        // callback for events triggered by the plugin
            console.log(e);
        });

      };

      // (<any>window).fbloaded = function() {
      //     FB.Event.subscribe('send_to_messenger', function(e) {
      //     // FB.Event.subscribe('send_to_messenger', function(e) {
      //     // callback for events triggered by the plugin
      //         console.log(e);
      //     });
      // }
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

    // (<any>window).fbloaded = function() {
    //     FB.Event.subscribe('send_to_messenger', function(e) {
    //     // FB.Event.subscribe('send_to_messenger', function(e) {
    //     // callback for events triggered by the plugin
    //         console.log(e);
    //     });
    // }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from './analytics.service';
import { FacebookService } from './facebook.service';

// import { TranslateService } from '@ngx-translate/core';

declare var window: any;
declare var FB: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private analyticsService: AnalyticsService,
        private jsService: FacebookService,
        // private translate: TranslateService
    ) {
        // translate.setDefaultLang('en');
        // translate.use('en');

      //   (function(d, s, id){
      //           var js, fjs = d.getElementsByTagName(s)[0];
      //           if (d.getElementById(id)) {return;}
      //           js = d.createElement(s); js.id = id;
      //           js.src = '//connect.facebook.net/en_US/sdk.js';
      //           fjs.parentNode.insertBefore(js, fjs);
      //       }(document, 'script', 'facebook-jssdk'));

      // window.fbAsyncInit = function() {
      //   console.log('fbAsyncInit executed');
      //   FB.init({
      //     appId            : '1194303814099473',
      //     autoLogAppEvents : true,
      //     xfbml            : true,
      //     version          : 'v6.0'
      //   });


      //   FB.Event.subscribe('send_to_messenger', function(e) {
      //     console.log('send_to_messenger');
      //     console.log(e);
      //     if (e.event !== undefined && e.event == 'opt_in'){
      //       console.log(e.event);
      //       console.log(e.ref);
      //     }
      //   });

      // };
    }


    title = 'app';

    ngOnInit() {
        console.log('AppComponent OnInit');
        this.router.events.subscribe((params: any) => {
            this.analyticsService.sendPageView(params.url);
        });

    }

    // loadFBSDK(){
    //     console.log('loadFBSDK');
    //   (<any>window).fbAsyncInit = function() {
    //     FB.init({
    //       appId            : '1194303814099473',
    //       autoLogAppEvents : true,
    //       xfbml            : false,
    //       version          : 'v6.0'
    //     });

    //   };

    // }

    testFunction() {
        console.log('testFunction');

        // (<any>window).fbloaded = function() {
        //     FB.Event.subscribe('send_to_messenger', function(e) {
        //     // FB.Event.subscribe('send_to_messenger', function(e) {
        //     // callback for events triggered by the plugin
        //         console.log(e);
        //     });
        // }

    }

}

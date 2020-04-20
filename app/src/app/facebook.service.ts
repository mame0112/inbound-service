import { Injectable } from '@angular/core';

declare var window: any;
declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

    constructor() {
        console.log('FacebookService');


        (<any>window).fbAsyncInit = () => {
            console.log('fbAsyncInit executed');
            console.log(FB);
            FB.init({
              appId            : '1194303814099473',
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v6.0'
            });

            FB.getLoginStatus(response => {
                this.statusChangeCallback(response); 
            });


            FB.Event.subscribe('send_to_messenger', function(e) {
              console.log('send_to_messenger');
              console.log(e);
              if (e.event !== undefined && e.event == 'opt_in'){
                console.log(e.event);
                console.log(e.ref);
              }
            });

        };


        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }


    statusChangeCallback(response): void{
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') { 
            // The user is logged in and has authenticated
            console.log('Logged in');
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
        } else if (response.status === 'not_authorized'){
            // The user hasn't authorized your application.  They
            // must click the Login button, or you must call FB.login
            // in response to a user gesture, to launch a login dialog.
            console.log('Not authrized');
        }else{
            // The user isn't logged in to Facebook.
            console.log('Not logged in');
        }
    }


    login(): void {

       console.log("submit login to facebook");

        FB.login(function(response) {
            if (response.authResponse) {
             console.log('Welcome!  Fetching your information.... ');
             console.log(response);
             // FB.api('/me', function(response) {
             //   console.log('Good to see you, ' + response.name + '.');
             // });
            } else {
             console.log('User cancelled login or did not fully authorize.');
            }
        });
    }

    testFunction() {
        console.log('testFunction');

        // FB.Event.subscribe('send_to_messenger', function(e) {
        //   console.log('send_to_messenger');
        //   console.log(e);
        //   if (e.event !== undefined && e.event == 'opt_in'){
        //     console.log(e.event);
        //     console.log(e.ref);
        //   }
        // });


    }
}

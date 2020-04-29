import { Injectable } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import { UserConsts } from './constants';

import { FacebookData, Category } from './facebook-data';

declare var window: any;
declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

    private fbSubject: Subject<FacebookData> = new Subject();
    private fbState = this.fbSubject.asObservable();

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


            // FB.Event.subscribe('send_to_messenger', send_to_messenger_callback);
            FB.Event.subscribe('auth.statusChange', response => {
                console.log("auth_status_change_callback: " + response.status);
            });

            FB.Event.subscribe('send_to_messenger', e => {
                if (e.event !== undefined && e.event == 'opt_in'){
                    console.log(e.event);
                    console.log(e.ref);
                    if(this.fbSubject != null){
                        var fbData = new FacebookData(Category.SEND_TO_MESSENGER, null);
                        this.fbSubject.next(fbData);
                        // console.log('Not null');
                    } else {
                        // console.log('Null');
                    }
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

        // var send_to_messenger_callback = function(e) {
        //     console.log('send_to_messenger');
        //     console.log(e);
        //     if (e.event !== undefined && e.event == 'opt_in'){
        //         console.log(e.event);
        //         console.log(e.ref);
        //         if(this.fbSubject != null){
        //             var fbData = new FacebookData(Category.NOT_LOGGED_IN, null);
        //             this.fbSubject.next(fbData);
        //             // console.log('Not null');
        //         } else {
        //             // console.log('Null');
        //         }

        //         if(this.user != null){
        //             console.log('Not null');
        //         } else {
        //             console.log('Null');
        //         }
        //     }
        // }

        // var auth_status_change_callback = function(response) {
        //     console.log("auth_status_change_callback: " + response.status);
        // }

    }

    getState(): Observable<FacebookData>{
        return this.fbState;
    }



    statusChangeCallback(response): void{
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') { 
            // The user is logged in and has authenticated
            console.log('Logged in');
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log(uid);
            console.log(accessToken);

            var content = {};
            content[UserConsts.KEY_USER_ID] = uid;


            var fbData = new FacebookData(Category.ALREADY_LOGGED_IN, content);
            this.fbSubject.next(fbData);

        } else if (response.status === 'not_authorized'){
            // The user hasn't authorized your application.  They
            // must click the Login button, or you must call FB.login
            // in response to a user gesture, to launch a login dialog.
            console.log('Not authrized');
            var fbData = new FacebookData(Category.NOT_LOGGED_IN, null);
            this.fbSubject.next(fbData);
        }else{
            // The user isn't logged in to Facebook.
            console.log('Not logged in');
            var fbData = new FacebookData(Category.NOT_LOGGED_IN, null);
            this.fbSubject.next(fbData);
        }
    }

    login(): Observable<any> {
        console.log('loginAsync');

        let result = {};

        result[UserConsts.KEY_USER_ID] = null;
        result[UserConsts.KEY_USER_NAME] = null;
        result[UserConsts.KEY_THUMB_URL] = null;
        result[UserConsts.KEY_ACCESS_TOKEN] = null;


        return new Observable((observer) => {
            FB.login(function(response) {
                if (response.authResponse) {

                     console.log(response);

                    result[UserConsts.KEY_USER_ID] = response.authResponse.userID;
                    result[UserConsts.KEY_ACCESS_TOKEN] = response.authResponse.accessToken;
                    FB.api('/me', 'GET', {fields: 'name'}, function(response) {
                        console.log(response);
                        let baseUrl = 'https://graph.facebook.com/';
                        let pictureUrl = '/picture?type=large&width=360&height=360';

                        result[UserConsts.KEY_USER_NAME] = response.name;
                        result[UserConsts.KEY_THUMB_URL] = baseUrl + result[UserConsts.KEY_USER_ID] + pictureUrl;
                        console.log(result[UserConsts.KEY_THUMB_URL]);
                        observer.next(result);
                        observer.complete();
                    });

                } else {
                 console.log('User cancelled login or did not fully authorize.');
                 observer.error('User cancelled login or did not fully authorize.');
                }
            });
        });

    }


    // login(): void {
    //     let result = {};
    //     result[UserConsts.KEY_USER_ID] = null;
    //     result[UserConsts.KEY_USER_NAME] = null;
    //     result[UserConsts.KEY_THUMB_URL] = null;
    //     result[UserConsts.KEY_ACCESS_TOKEN] = null;

    //     console.log("submit login to facebook");

    //     FB.login(function(response) {
    //         if (response.authResponse) {
    //              console.log('Welcome!  Fetching your information.... ');
    //              console.log(response);
    //              // console.log(response.authResponse.accessToken);
    //              // console.log(response.authResponse.userID);
    //             result[UserConsts.KEY_USER_ID] = response.authResponse.userID;
    //             result[UserConsts.KEY_ACCESS_TOKEN] = response.authResponse.accessToken;
    //             // FB.api('/me', function(response) {
    //             //     console.log(response);
    //             //     result[UserConsts.KEY_USER_NAME] = response.name;
    //             //     // console.log('Good to see you, ' + response.name + '.');
    //             // });
    //             FB.api('/me', 'GET', {fields: 'name'}, function(response) {
    //                 console.log(response);
    //                 let baseUrl = 'https://graph.facebook.com/';
    //                 let pictureUrl = '/picture?type=large&width=360&height=360';

    //                 result[UserConsts.KEY_USER_NAME] = response.name;
    //                 result[UserConsts.KEY_THUMB_URL] = baseUrl + result[UserConsts.KEY_USER_ID] + pictureUrl;
    //                 console.log(result[UserConsts.KEY_THUMB_URL]);
    //                 // console.log('Good to see you, ' + response.name + '.');
    //             });

    //         } else {
    //          console.log('User cancelled login or did not fully authorize.');
    //         }
    //     });
    // }

    // logout(): void {

    //     console.log('logout');

    //     FB.logout(function(response){
    //         console.log(response);

    //     });

    // }

    logout(): Observable<any>  {
        return new Observable((observer) => {
                FB.logout(function(response){
                    console.log(response);
                    observer.next();
                    observer.complete();
                });
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

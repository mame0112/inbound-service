import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsExecuteService {

    constructor() {
        // this.loadFBSDK();
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
        FB.Event.subscribe('send_to_messenger', function(e) {
        // callback for events triggered by the plugin
            console.log(e);
        });

    }
}

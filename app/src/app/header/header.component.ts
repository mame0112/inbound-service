import { Component, OnInit } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';

import { UserConsts } from '../constants';

import { User } from '../user';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';

import { UserDataBuilder } from '../data-builder/user-data-builder';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    userData: User;

    constructor(private userDataService: UserDataService,
      private analyticsService: AnalyticsService) { }

    ngOnInit() {
        console.log('HeaderComponent OnInit');

        this.userData = this.userDataService.initialize();

        if(this.userData == null){
          this.userDataService.change.subscribe(param => {
            console.log('header info subscribe');
              if (param !== null){
                  this.userData = new UserDataBuilder().setUserId(param[UserConsts.KEY_USER_ID]).setUserName(param[UserConsts.KEY_USER_NAME]).setThumbUrl(param[UserConsts.KEY_THUMB_URL]).getResult();
              } else {
                // No param in returned value

              }
          });
        } else {
          // No user data in userDataService
        }


        this.userDataService.change_signout.subscribe(param => {
          console.log(param);
          //Sign out
          this.userData = null;

        });

    }

    ClearUserData(): void{
      console.log('RemodeUserData');
      // this.userDataService.deleteUserData();
      this.userDataService.deleteUserData().pipe(
          tap(params => console.log(params))
          // catchError(this.apiService.handleError<string>('createUserData', 'Error'))
      ).subscribe(param => {
        console.log(param);
        this.userData = null;

        //TODO Update userinfo in server

      });
    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('header', eventCategory, eventAction, eventLabel);
    }

}

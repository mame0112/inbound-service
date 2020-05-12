import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';

// import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { catchError, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';
import { FacebookService } from '../facebook.service';
// import { TranslateModule } from '@ngx-translate/core';

import { Constants, UserConsts } from '../constants';
import { User } from '../user';
import { FacebookData, Category } from '../facebook-data';

import { UserDataBuilder } from '../data-builder/user-data-builder';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  // user: SocialUser;

  subscription: Subscription;

  userObj: User;
  loggedIn: boolean;

  @Output() userInfo = new EventEmitter<User>();

  constructor(private router: Router,
    private apiService: ApiService,
    private userDataService: UserDataService,
    private analyticsService: AnalyticsService,
    private fbService: FacebookService) {

    this.subscription = this.fbService.getState().subscribe(param => {
      console.log(param);
      let category = Category[param['_category']];
      let content = param['_content'];
      switch(Category[category]){
        case Category.ALREADY_LOGGED_IN:
          console.log('Already logged in');
          // var user_id = content[UserConsts.KEY_USER_ID];
          // console.log(user_id);
          // if (userDataService.isAlreadySignedIn()){

          // }

          break;
        case Category.NOT_LOGGED_IN:
          console.log('Not logged in');
          break;
        case Category.SEND_TO_MESSENGER:
          // Nothing to do
          console.log('send_to_message');
        break;
        default:
        break;
      }

    });

  }

  ngOnInit() {
    console.log('LandingComponent onInit');

    this.userObj = this.userDataService.initialize();
    if(this.userObj != null){
      // this.router.navigate(['/my-page']);
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0)
    });

  }

  ngOnDestroy(){
    console.log('LandingComponent ngOnDestroy');
    if (this.subscription) {
      console.log('unsubscribe');
      this.subscription.unsubscribe();
    }

  }


  signInWithFB(): void {
    console.log('signInWithFB')
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // this.fbService.login();

    this.fbService.login().pipe(
          tap(params => console.log(params))
      ).subscribe(user => {
        console.log(user);
        let builder = new UserDataBuilder();
        this.userObj = builder.setUserId(user[UserConsts.KEY_USER_ID]).setUserName(user[UserConsts.KEY_USER_NAME]).setThumbUrl(user[UserConsts.KEY_THUMB_URL]).setAccessToken(user[UserConsts.KEY_ACCESS_TOKEN]).getResult();

        this.apiService.createUserData(this.userObj)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              console.log('Create user response OK');
              this.userDataService.signin(this.userObj);
              this.broadcastFBUserInfo();

              // Go to next page
              // this.router.navigate(['/choose']);

            } else {
              console.log('Error happens');
              // TODO Show error message
            }
          });
    });

    this.sendEvent('body', 'facebook', 'click');
  }

  signOut(): void {
    console.log('signOut');

    this.fbService.logout().pipe(
          tap(params => console.log(params)),
          catchError(this.apiService.handleError<string>('createUserData', 'Error'))
      ).subscribe(param => {
        console.log(param);

        //TODO Update userinfo in server

      });
  }

  broadcastFBUserInfo(): void {
    console.log('broadcastFBUserInfo');
    this.userInfo.emit(this.userObj);
  }

  sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
    console.log('sendEvent');
    this.analyticsService.sendEvent('landing', eventCategory, eventAction, eventLabel);
  }
}

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { Constants } from '../constants';
import { User } from '../user';

import { UserDataBuilder } from '../data-builder/user-data-builder';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  user: SocialUser;
  userObj: User;
  loggedIn: boolean;

  @Output() userInfo = new EventEmitter<User>();

  constructor(private router: Router,
    private apiService: ApiService,
   private authService: AuthService,
   private userDataService: UserDataService ) { }

  ngOnInit() {
    console.log('LandingComponent onInit');

    this.userObj = this.userDataService.initialize();
    if(this.userObj != null){
      //TODO
      // this.router.navigate(['/my-page']);
    }

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);

      if (user !=null) {
        console.log('User available')
        // let obj = this.createJsonUserData(user)
        let builder = new UserDataBuilder();
        console.log(user.id);
        console.log(Number(user.id));
        this.userObj = builder.setUserId(user.id).setUserName(user.name).setThumbUrl(user.photoUrl).setAccessToken(user.authToken).getResult();
        console.log(this.userObj.user_id);

        this.apiService.createUserData(this.userObj)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              console.log('Create user response OK');
              this.userDataService.signin(this.userObj);

              // Go to next page
              this.router.navigate(['/choose']);

            } else {
              console.log('Error happens');
              // TODO Show error message
            }
          });
      }
    });

  }

  signInWithFB(): void {
    console.log('signInWithFB')
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  broadcastFBUserInfo() {
    this.userInfo.emit(this.userObj);
  }
}

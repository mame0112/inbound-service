import { Component, OnInit, EventEmitter, Output } from '@angular/core';

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

  constructor(private apiService: ApiService,
   private authService: AuthService,
   private userDataService: UserDataService ) { }

  ngOnInit() {
    console.log('LandingComponent onInit');


    // apiService.getUserData().subscribe(params => this.contents = this.dataProcessorServie.parseJson2ContentsData(params));
    // this.apiService.getUserData().subscribe(param => console.log('Data fetched'));

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);

      if (user !=null) {
        console.log('User available')
        // let obj = this.createJsonUserData(user)
        let builder = new UserDataBuilder();
        this.userObj = builder.setUserId(Number(user.id)).setUserName(user.name).setThumbUrl(user.photoUrl).setAccessToken(user.authToken).getResult();

        // this.apiService.createUserData(obj).subscribe(params => console.log(params));
        this.apiService.createUserData(this.userObj)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              console.log('Create user response OK');
              this.userDataService.signin(this.userObj);
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

  // createJsonUserData(input : SocialUser): object {

  //   console.log('createJsonUserData');

  //   return {
  //     user_id : input.id,
  //     user_name : input.name,
  //     thumb_url : input.photoUrl,
  //     access_token : input.authToken
  //   };
  //   // return JSON.stringify(output);
  // }

}

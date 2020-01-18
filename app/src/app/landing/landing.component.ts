import { Component, OnInit } from '@angular/core';

import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

import { ApiService} from '../api.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  user: SocialUser;
  loggedIn: boolean;

  constructor(private apiService: ApiService, private authService: AuthService) { }

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
        let obj = this.createJsonUserData(user)
        this.apiService.createUserData(obj).subscribe(params => console.log(params));
      }
    });



        // this.apiService.createUserData(this.createJsonUserData(this.user));


    // const myObserver = {
    //   next: x => console.log('Observer got a next value: ' + x),
    //   error: err => console.error('Observer got an error: ' + err),
    //   complete: () => console.log('Observer got a complete notification'),
    // };

    // this.authService.authState.subscribe(myObserver);

  }

  signInWithFB(): void {
    console.log('signInWithFB')
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  createJsonUserData(input : SocialUser): object {

    console.log('createJsonUserData');

    return {
      user_id : input.id,
      user_name : input.name,
      thumb_url : input.photoUrl,
      access_token : input.authToken
    };
    // return JSON.stringify(output);
  }

}

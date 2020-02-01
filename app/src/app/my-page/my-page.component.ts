import { Component, OnInit } from '@angular/core';

import { Constants, UserConsts } from '../constants';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { User } from '../user';

import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {

  constructor(
      private apiService: ApiService,
      private userDataService: UserDataService
      ) { }

  ngOnInit() {
      this.apiService.getUserData(this.userDataService.user_id).pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
              console.log(params);
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
                let content = params[Constants.CONTENT];
                let conv_host = content[UserConsts.KEY_CONVERSATIONS_HOST];
                let conv_guest = content[UserConsts.KEY_CONVERSATIONS_GUEST];
                let plan = content[UserConsts.KEY_PLANS];
                console.log(conv_host);
                console.log(conv_guest);
                console.log(plan);
            } else {
                console.log('Error ocurred');
                // TODO Error handling
            }

          });


  }

}

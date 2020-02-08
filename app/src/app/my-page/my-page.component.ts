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

  visits: []

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
                let hosts = content[UserConsts.KEY_CONVERSATIONS_HOST];
                this.visits = content[UserConsts.KEY_CONVERSATIONS_GUEST];
                let plan = content[UserConsts.KEY_PLANS];
                console.log(hosts);
                console.log(this.visits);
                console.log(plan);
            } else {
                console.log('Error ocurred');
                // TODO Error handling
            }

          });


  }

}

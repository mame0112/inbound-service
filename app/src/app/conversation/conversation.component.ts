import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FormControl, Validators } from '@angular/forms';

import { ApiService } from '../api.service';

import { User } from '../user';
import { Constants, UserConsts } from '../constants';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

    host_id: number;
    visitor_id: number;

    host: User;
    visitor: User;

    comment: string;

    comments = []

    // items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private apiService: ApiService) { }

    ngOnInit() {
      console.log('ConversationComponent onInit');
      this.getIds();
      this.createDummyData();
    }

    createDummyData(): void {
      let user = new User();
      user.setUserId(1);
      user.setUserName("user name 1");
      user.setThumbUrl("https://xxxx.com");

      this.comments.push(user);

      let user2 = new User();
      user2.setUserId(2);
      user2.setUserName("user name 2");
      user2.setThumbUrl("https://xxxx.com");

      this.comments.push(user2);

      let user3 = new User();
      user3.setUserId(3);
      user3.setUserName("user name 3");
      user3.setThumbUrl("https://xxxx.com");

      this.comments.push(user3);

      let user4 = new User();
      user4.setUserId(4);
      user4.setUserName("user name 4");
      user4.setThumbUrl("https://xxxx.com");
      this.comments.push(user4);      

      let user5 = new User();
      user5.setUserId(5);
      user5.setUserName("user name 5");
      user5.setThumbUrl("https://xxxx.com");

      this.comments.push(user5);
    }

    getIds(): void {
      this.host_id = +this.route.snapshot.paramMap.get('host_id');
      this.visitor_id = +this.route.snapshot.paramMap.get('visitor_id');

      console.log(this.host_id);
      console.log(this.visitor_id);

      forkJoin(
          this.apiService.getUserData(Number(this.host_id)),
          this.apiService.getUserData(Number(this.visitor_id))
          ).subscribe((res)=> {

            if(res[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
                console.log(res[0]);
                console.log(res[1]);

                this.host = this.createUserData(res[0]);
                this.visitor = this.createUserData(res[1]);
                //TOOD In case of success

                this.apiService.createConversationData({"test": "test"}).pipe(
                      tap(heroes => console.log('fetched users')),
                      catchError(this.apiService.handleError<string>('createConversationData', 'Error'))
                      ).subscribe(param => param);
              } else {

              }
          });

    }

    sendComment(): void {
      console.log('sendComment');
      console.log(this.comment);


    }

    createUserData(data: any): User {
      let user = new User();
      user.setUserId(data[UserConsts.KEY_USER_ID]);
      user.setUserName(data[UserConsts.KEY_USER_NAME]);
      user.setThumbUrl(data[UserConsts.KEY_THUMB_URL]);
      return user;
    }

}

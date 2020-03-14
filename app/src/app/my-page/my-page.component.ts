import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Constants, UserConsts, ConversationConsts, VisitConsts} from '../constants';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { User } from '../user';
import { Host } from '../host';

import { catchError, map, tap } from 'rxjs/operators';

import { Util } from '../util';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css']
})
export class MyPageComponent implements OnInit {

  visits: any[] = [];
  hosts: any[] = [];

  constructor(
      private apiService: ApiService,
      private userDataService: UserDataService,
      private router: Router
      ) { }

  ngOnInit() {
      this.apiService.getUserData(this.userDataService.user_id).pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
              console.log(params);
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
                let content = params[Constants.CONTENT];
                this.hosts = this.validateAndExtractHostData(content[UserConsts.KEY_CONVERSATIONS_HOST]);
                this.visits = this.validateAndExtractVisitData(content[UserConsts.KEY_CONVERSATIONS_GUEST]);
                let plan = content[UserConsts.KEY_PLANS];
                // console.log(hosts);
                // console.log(this.visits);
                // console.log(plan);
            } else {
                console.log('Error ocurred');
                // TODO Error handling
            }
          });
  }

  registerAsHost(): void {
    console.log('registerAsHost');
    this.router.navigate(['/host-start']);
  }

  createPlan(): void {
    console.log('createPlan');
    this.router.navigate(['/visit-start']);

  }

  validateAndExtractHostData(inputs: any): any[]{

    let result: any[] = new Array();

    if(inputs == null){
      return result;
    }

    for(let content of inputs) {
      let conversation_id = content[ConversationConsts.KEY_CONVERSATION_ID];
      let visitor_id = content[ConversationConsts.KEY_VISITOR_ID];
      let visitor_name = content[ConversationConsts.KEY_VISITOR_NAME];
      let visitor_thumb_url = content[ConversationConsts.KEY_VISITOR_THUMB_URL];
      if(conversation_id != undefined && visitor_id != undefined && visitor_name != undefined && visitor_thumb_url != undefined){
        result.push(content);
      } else {
        console.log('Something is null');
      }

    }

    return result;
  }

  validateAndExtractVisitData(inputs: any): any[]{

    let result: any[] = new Array();

    if(inputs == null){
      return result;
    }

    for(let content of inputs) {
      let visit_id = content[VisitConsts.KEY_VISIT_ID];
      let place = content[VisitConsts.KEY_PLACE];

      let start = content[VisitConsts.KEY_START];
      content[VisitConsts.KEY_START] = new Util().createDateForDisplay(start);

      let end = content[VisitConsts.KEY_END];
      content[VisitConsts.KEY_END] = new Util().createDateForDisplay(end);

      // Skip comment because this field is optional
      if(visit_id != undefined && place != undefined && start != undefined && end != undefined){
        result.push(content);
      } else {
        console.log('Something is null');
      }

    }

    return result;
  }

  signout(): void {
    console.log('signout');
    this.userDataService.deleteUserData();
    this.router.navigate(['/landing']);
  }

}

import { Component, OnInit } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';

import { Constants, UserConsts, ConversationConsts } from '../constants';

import { UserDataBuilder } from '../data-builder/user-data-builder';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {

    conversation_dummy = {}

    conversation_id = 1583573947;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
      console.log('DebugComponent ngOnInit');
      // this.conversation_dummy = this.createDummyData1();
    }

    createDummyUserData1(): void {
        let builder = new UserDataBuilder();
        let userObj = builder.setUserId("10221180198043873").setUserName('Kosuke Endo').setThumbUrl('https://graph.facebook.com/10221180198043871/picture?type=normal').setAccessToken("Dummy access token").getResult();

        // this.apiService.createUserData(obj).subscribe(params => console.log(params));
        this.apiService.createUserData(userObj)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              console.log('Create user response OK');
              // this.userDataService.signin(this.userObj);

            } else {
              console.log('Error happens');
              // TODO Show error message
            }
          });
    }

    createDummyUserData2(): void {
        let builder = new UserDataBuilder();
        let userObj = builder.setUserId("10206368047916225").setUserName('Test name').setThumbUrl('https://graph.facebook.com/10206368047916225/picture?type=normal').setAccessToken("Dummy access token2").getResult();

        // this.apiService.createUserData(obj).subscribe(params => console.log(params));
        this.apiService.createUserData(userObj)
        .pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('createUserData', 'Error'))
          ).subscribe(params => {
            if (params[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK) {
              console.log('Create user response OK');
              // this.userDataService.signin(this.userObj);

            } else {
              console.log('Error happens');
              // TODO Show error message
            }
          });
    }

    createDummyData1(): void {
        console.log('createDummyData1');

        let data = {};

        data['conversation_id'] = this.conversation_id;
        data['host_id'] = "10221180198043873";
        data['host_name'] = 'Kosuke Endo';
        data['host_thumb_url'] = 'https://graph.facebook.com/10221180198043871/picture?type=normal';
        data['messages'] = [];
        data['visitor_id'] = "10206368047916225";
        data['visitor_name'] = 'Test name';
        data['visitor_thumb_url'] = 'https://graph.facebook.com/10206368047916225/picture?type=normal';
        data['visit_id'] = 1583060127;
        data['place'] = 'Tokyo';
        data['start'] = '2020/02/03';
        data['end'] = '2020/02/05';
        data['comment'] = 'Test comment';

        console.log(data);

      this.apiService.createConversationData(data).pipe(
        tap(heroes => console.log('fetched users')),
        catchError(this.apiService.handleError<string>('createConversationData', 'Error'))
      ).subscribe(param => {
          if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
            console.log(param);
            let content = param[Constants.CONTENT];
            let conv_id = content[ConversationConsts.KEY_CONVERSATION_ID];
            console.log(conv_id);
            // this.router.navigate(['/conversation', conv_id]);
          }
      });

    }

    updateCommentAsHost(): void {
        console.log('updateCommentAsHost');

        let obj = {}
        obj[ConversationConsts.KEY_CONVERSATION_ID] = this.conversation_id;
        obj[ConversationConsts.KEY_MESSAGES_LATEST_TIMESTAMP] = 0;

        let message = {}
        message[ConversationConsts.KEY_MESSAGES_SENDER_ID] = "10221180198043873";
        message[ConversationConsts.KEY_MESSAGES_SENDER_NAME] = 'Kosuke Endo';
        message[ConversationConsts.KEY_MESSAGES_SENDER_THUMB_URL] = 'https://graph.facebook.com/10221180198043871/picture?type=normal';
        message[ConversationConsts.KEY_MESSAGES_CONTENT] = "Test message";

        obj[ConversationConsts.KEY_MESSAGES] = message;

        this.apiService.updateCommentData(obj).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('updateCommentData', 'Error'))
          ).subscribe(param => {
            console.log(param);
            if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
              let updated_comments = param[Constants.CONTENT];
              for (var i in updated_comments) {
                  console.log('Successfully sent')
                // updated_comments[i].date = this.getDateForDisplay(updated_comments[i].msg_time);
                // this.conversations.messages.push(updated_comments[i]);
              }
            }
          });
    }

    updateCommentAsVisitor(): void {
        console.log('updateCommentAsVisitor');

        let obj = {}
        obj[ConversationConsts.KEY_CONVERSATION_ID] = this.conversation_id;
        obj[ConversationConsts.KEY_MESSAGES_LATEST_TIMESTAMP] = 0;

        let message = {}
        message[ConversationConsts.KEY_MESSAGES_SENDER_ID] = "10206368047916225";
        message[ConversationConsts.KEY_MESSAGES_SENDER_NAME] = 'Test name';
        message[ConversationConsts.KEY_MESSAGES_SENDER_THUMB_URL] = 'https://graph.facebook.com/10206368047916225/picture?type=normal';
        message[ConversationConsts.KEY_MESSAGES_CONTENT] = "Message from visitor";

        obj[ConversationConsts.KEY_MESSAGES] = message;

        this.apiService.updateCommentData(obj).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('updateCommentData', 'Error'))
          ).subscribe(param => {
            console.log(param);
            if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
              let updated_comments = param[Constants.CONTENT];
              for (var i in updated_comments) {
                  console.log('Successfully sent')
                // updated_comments[i].date = this.getDateForDisplay(updated_comments[i].msg_time);
                // this.conversations.messages.push(updated_comments[i]);
              }
            }
          });
        
    }

    getDateForDisplay(timestamp: number): string{
      var a = new Date(timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      // var sec = a.getSeconds();
      var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min;
      return time;
    }

}

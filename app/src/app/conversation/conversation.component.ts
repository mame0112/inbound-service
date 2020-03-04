import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FormControl, Validators } from '@angular/forms';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';

import { User } from '../user';
import { Conversation } from '../conversation';
import { Constants, UserConsts, ConversationConsts } from '../constants';

import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

    conv_id: number;

    host: User;
    visitor: User;

    comment: string;

    comments = []

    user_id: number;
    user_name: string;
    thumb_url: string;

    is_visitor = false;

    conversations: Conversation;
    messages = undefined;


    // items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private apiService: ApiService,
        private userDataService: UserDataService) { }

    ngOnInit() {
      console.log('ConversationComponent onInit');

      this.conv_id = +this.route.snapshot.paramMap.get('conv_id');      

      this.user_id = this.userDataService.getUserId();
      this.user_name = this.userDataService.getUserName();
      this.thumb_url = this.userDataService.getThumbUrl();

      this.getConversationData();

    }

    getConversationData(): void {
      console.log('getConversationData');

      this.apiService.getConversationData(this.conv_id).pipe(
            tap(heroes => console.log('fetched users')),
            catchError(this.apiService.handleError<string>('getConversationData', 'Error'))
            ).subscribe(param => {
              console.log(param);
              if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
                let content = param[Constants.CONTENT]
                console.log(content);

                let builder = new ConversationDataBuilder();
                this.conversations = builder.setConversationId(content[ConversationConsts.KEY_CONVERSATION_ID]).setHostUserId(content[ConversationConsts.KEY_HOST_ID]).setHostUserName(content[ConversationConsts.KEY_HOST_NAME]).setHostThumbUrl(content[ConversationConsts.KEY_HOST_THUMB_URL]).setVisitorUserId(content[ConversationConsts.KEY_VISITOR_ID]).setVisitorUserName(content[ConversationConsts.KEY_VISITOR_NAME]).setVisitorThumbUrl(content[ConversationConsts.KEY_VISITOR_THUMB_URL]).setMessages(content[ConversationConsts.KEY_MESSAGES]).getResult();
                this.messages = this.conversations.getMessages();

                for (var i = 0; i < this.messages.length; i++) {
                  this.messages[i].date = this.getDateForDisplay(this.messages[i].msg_time);
                }

                if(this.user_id == this.conversations.getVisitorUserId()){
                  console.log('This is Visitor');
                  this.is_visitor = true;
                } else {
                  console.log('This is host');
                  this.is_visitor = false;
                }
              } else {
              // TODO Error handling
              }
            });
    }


    sendComment(): void {
      console.log('sendComment');

      let obj = {}
      obj[ConversationConsts.KEY_CONVERSATION_ID] = this.conversations.conversation_id;

      if(this.messages.length != 0){
        let latest_message = this.messages[this.messages.length-1]
        obj[ConversationConsts.KEY_MESSAGES_LATEST_TIMESTAMP] = latest_message[ConversationConsts.KEY_MESSAGES_TIMESTAMP];
      } else {
        obj[ConversationConsts.KEY_MESSAGES_LATEST_TIMESTAMP] = 0;
      }

      let message = {}
      message[ConversationConsts.KEY_MESSAGES_SENDER_ID] = this.user_id;
      message[ConversationConsts.KEY_MESSAGES_SENDER_NAME] = this.user_name;
      message[ConversationConsts.KEY_MESSAGES_SENDER_THUMB_URL] = this.thumb_url;
      message[ConversationConsts.KEY_MESSAGES_CONTENT] = this.comment;

      obj[ConversationConsts.KEY_MESSAGES] = message;

      // this.conversations.addMessage(message);

      // console.log(this.conversations);

      this.apiService.updateCommentData(obj).pipe(
          tap(data => console.log(data)),
          catchError(this.apiService.handleError<string>('updateCommentData', 'Error'))
          ).subscribe(param => {
            console.log(param);
            if(param[Constants.RESPONSE_CODE] == Constants.RESPONSE_OK){
              let updated_comments = param[Constants.CONTENT];
              for (var i in updated_comments) {
                updated_comments[i].date = this.getDateForDisplay(updated_comments[i].msg_time);
                this.conversations.messages.push(updated_comments[i]);
              }

              // Clear text
              this.comment = '';
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

import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewChildren, AfterViewInit, QueryList, NgZone } from '@angular/core';

import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FormControl, Validators } from '@angular/forms';

import { ApiService } from '../api.service';
import { UserDataService } from '../user-data.service';
import { AnalyticsService } from '../analytics.service';

import { User } from '../user';
import { Conversation } from '../conversation';
import { Constants, UserConsts, ConversationConsts } from '../constants';

import { ConversationInfoComponent } from '../conversation-info/conversation-info.component';

import { MatDialog } from '@angular/material/dialog';

import { ConversationDataBuilder } from '../data-builder/conversation-data-builder';

import { ScrollableDirective } from '../directive/scrollable.directive';
import { OffsetTopDirective } from '../directive/offset-top.directive';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, AfterViewInit {

    @ViewChildren(OffsetTopDirective) listItem: QueryList<OffsetTopDirective>;
    @ViewChild(ScrollableDirective, {static: false}) list: ScrollableDirective;

    conv_id: number;

    host: User;
    visitor: User;

    comment: string;

    comments = []

    user_id: string;
    user_name: string;
    thumb_url: string;

    is_visitor = false;

    conversations: Conversation;
    messages = undefined;

    container: HTMLElement;

    title: string;


    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private apiService: ApiService,
        private userDataService: UserDataService,
        private analyticsService: AnalyticsService,
        private router: Router,
        private matDialog: MatDialog,
        private zone: NgZone) { }

    ngOnInit() {
      console.log('ConversationComponent onInit');

      this.conv_id = +this.activatedRoute.snapshot.paramMap.get('conv_id');
      console.log('conv_id');
      console.log(this.conv_id);

      if (this.userDataService.hasValidUserData()){
        console.log('Valid user data');

        let user = this.userDataService.initialize();

        this.user_id = user.getUserId();
        this.user_name = user.getUserName();
        this.thumb_url = user.getThumbUrl();

        // this.user_id = this.userDataService.getUserId();
        // this.user_name = this.userDataService.getUserName();
        // this.thumb_url = this.userDataService.getThumbUrl();

        console.log(this.user_id);

        this.getConversationData();
      } else {
        // Some error happens. Show error dialog
        console.log('Not valid user data');
      }

      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }

        window.scrollTo(0, 0)
      });

    }

    ngAfterViewInit() {
      console.log('ngAfterViewInit')
      this.listItem.changes.subscribe((queryChange)=> {
        this.list.scrollTop = this.listItem.last.offsetTop;
      });
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
                this.conversations = builder.setConversationId(content[ConversationConsts.KEY_CONVERSATION_ID]).setHostUserId(content[ConversationConsts.KEY_HOST_ID]).setHostUserName(content[ConversationConsts.KEY_HOST_NAME]).setHostThumbUrl(content[ConversationConsts.KEY_HOST_THUMB_URL]).setVisitorUserId(content[ConversationConsts.KEY_VISITOR_ID]).setVisitorUserName(content[ConversationConsts.KEY_VISITOR_NAME]).setVisitorThumbUrl(content[ConversationConsts.KEY_VISITOR_THUMB_URL]).setMessages(content[ConversationConsts.KEY_MESSAGES]).setVisitComment(content[ConversationConsts.KEY_COMMENT]).setVisitStart(content[ConversationConsts.KEY_START]).setVisitEnd(content[ConversationConsts.KEY_END]).setVisitProblems(content[ConversationConsts.KEY_PROBLEMS]).setVisitPlace(content[ConversationConsts.KEY_PLACE]).getResult();
                this.messages = this.conversations.getMessages();

                this.getPageTitle();

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

    showConversationInformation(): void {
      console.log('showConversationInformation');
      const dialogRef = this.matDialog.open(ConversationInfoComponent, {
        width: '80%',
        data: {id: 1, conversation: this.conversations},
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);

      });
    }

    getPageTitle(): void {

      if (this.conversations != undefined){
        this.zone.run(() => {
          if (this.user_id == this.conversations.host_id) {
            console.log('Host');
            console.log(this.conversations.host_name);
            this.title = '< ' + this.conversations.host_name;
          } else {
            console.log('Visitor');
            console.log(this.conversations.place);
            this.title = '< ' + this.conversations.place;
          }
        });
      }

    }

    backToPreviousPage(): void {
      this.location.back();
    }


    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('conversation', eventCategory, eventAction, eventLabel);
    }


}

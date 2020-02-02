import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { forkJoin, Observable, of } from 'rxjs';

import { FormControl, Validators } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

    host_id: number;
    visitor_id: number;

    comment: string;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private apiService: ApiService) { }

    ngOnInit() {
      console.log('ConversationComponent onInit');
      this.getIds();
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
              console.log(res[0]);
              console.log(res[1]);
          });

    }

    sendComment(): void {
      console.log('sendComment');
      console.log(this.comment);
    }

}

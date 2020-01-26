import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private location: Location) { }

    ngOnInit() {
      console.log('ConversationComponent onInit');
      this.getIds();
    }

    getIds(): void {
      const host_id = +this.route.snapshot.paramMap.get('host_id');
      const visitor_id = +this.route.snapshot.paramMap.get('visitor_id');
      console.log(host_id)
      console.log(visitor_id)
    }

}

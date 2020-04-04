import { Component, OnInit } from '@angular/core';

import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit() {
    }

    sendEvent(eventCategory: string, eventAction: string, eventLabel: any): void {
      console.log('sendEvent');
      this.analyticsService.sendEvent('footer', eventCategory, eventAction, eventLabel);
    }

}

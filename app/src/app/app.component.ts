import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private analyticsService: AnalyticsService
    ) {}


    title = 'app';

    ngOnInit() {
        console.log('AppComponent OnInit');
        this.router.events.subscribe((params: any) => {
            this.analyticsService.sendPageView(params.url);
        });
    }

}

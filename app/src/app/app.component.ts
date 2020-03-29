import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from './analytics.service';

// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private analyticsService: AnalyticsService
        // private translate: TranslateService
    ) {
        // translate.setDefaultLang('en');
        // translate.use('en');
    }


    title = 'app';

    ngOnInit() {
        console.log('AppComponent OnInit');
        this.router.events.subscribe((params: any) => {
            this.analyticsService.sendPageView(params.url);
        });
    }

}

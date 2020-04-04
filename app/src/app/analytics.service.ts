import { Injectable } from '@angular/core';
import { Environment } from './environment';

declare let gtag: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

    constructor() { }

    private useGA(): boolean {
        return typeof gtag !== undefined;
    }

    sendPageView(url: string): void {
        if (!this.useGA()) {
            return;
        }

        if(url == undefined){
            return;
        }

        if (!url.startsWith('/')) {
          url = `/${url}`;
        }
        if (Environment.production) {
          gtag('config', Environment.analytics.id, {
            page_path: url
          });
        }
    }

    sendEvent(eventName: string, eventCategory: string, eventAction: string, eventLabel: any): void {
        console.log('sendEvent');
        if (!this.useGA()) {
          return;
        }
        if (Environment.production) {
            gtag('event', eventName, {
                event_category: eventCategory,
                event_action: eventAction,
                event_label: eventLabel
            });
        }
    }

}

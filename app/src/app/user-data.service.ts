import { Injectable, Output, EventEmitter } from '@angular/core'

import { CookieService } from 'ngx-cookie-service';

import { Constants } from './constants';

import { User } from './user';

import { UserDataBuilder } from './data-builder/user-data-builder';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    user_id: number;
    user_name: string;
    thumb_url: string;

    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor(private cookieService: CookieService) { }

    initialize(): User{
        console.log('initialize');
        this.user_id = Number(this.cookieService.get(Constants.COOKIE_USER_ID));
        console.log(this.user_id);
        this.user_name = this.cookieService.get(Constants.COOKIE_USER_NAME);
        this.thumb_url = this.cookieService.get(Constants.COOKIE_THUMB_URL);

        return new UserDataBuilder().setUserId(this.user_id).setUserName(this.user_name).setThumbUrl(this.thumb_url).getResult();
    }

    signin(userData: any) {
        console.log('UserDataService signin');
        this.change.emit(userData);
        this.user_id = userData.user_id;
        this.user_name = userData.user_name;
        this.thumb_url = userData.thumb_url;

        this.cookieService.set(Constants.COOKIE_USER_ID, String(this.user_id));
        this.cookieService.set(Constants.COOKIE_USER_NAME, this.user_name);
        this.cookieService.set(Constants.COOKIE_THUMB_URL, this.thumb_url);
    }

    getUserId(): number {
        return this.user_id;
    }

    getUserName(): string {
        return this.user_name;
    }

    getThumbUrl(): string{
        return this.thumb_url;
    }

    deleteUserData(): void {
        this.user_id = Constants.NO_USER;
        this.user_name = null;
        this.thumb_url = null;
        this.cookieService.deleteAll();
    }


}

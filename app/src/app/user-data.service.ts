import { Injectable, Output, EventEmitter } from '@angular/core'
import { Observable, of } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { FacebookService } from './facebook.service';

import { tap } from 'rxjs/operators';

import { Constants } from './constants';

import { User } from './user';

import { UserDataBuilder } from './data-builder/user-data-builder';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    user_id: string;
    user_name: string;
    thumb_url: string;

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() change_signout: EventEmitter<any> = new EventEmitter();

    constructor(private cookieService: CookieService,
        private fbService: FacebookService) { }

    initialize(): User{
        console.log('initialize');
        this.user_id = this.cookieService.get(Constants.COOKIE_USER_ID);
        if(this.user_id == null || this.user_id.length <= 1){
            return null;
        }
        this.user_name = this.cookieService.get(Constants.COOKIE_USER_NAME);
        this.thumb_url = this.cookieService.get(Constants.COOKIE_THUMB_URL);

        return new UserDataBuilder().setUserId(this.user_id).setUserName(this.user_name).setThumbUrl(this.thumb_url).getResult();
    }

    // isAlreadySignedIn(): boolean {
    //     if (this.user_id != null && this.user_id != String(Constants.NO_USER) && this.user_name != null && this.thumb_url != null){
    //         return true;
    //     }

    //     return false;
    // }

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

    getUserId(): string {
        return this.user_id;
    }

    getUserName(): string {
        return this.user_name;
    }

    getThumbUrl(): string{
        return this.thumb_url;
    }

    deleteUserData(): Observable<any> {
        console.log('deleteUserData');

        this.change_signout.emit(null);

        return new Observable((observer) => {
            this.fbService.logout().pipe(
                    tap(params => console.log(params))
                ).subscribe(result => {
                    this.user_id = null;
                    this.user_name = null;
                    this.thumb_url = null;
                    this.cookieService.deleteAll();
                    observer.next(result);
                    observer.complete();
                });
            });

    }


}

import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    user_id: number;
    user_name: string;

    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor() { }

    signin(userData: any) {
        console.log('UserDataService signin');
        this.change.emit(userData);
        this.user_id = userData.user_id;
        this.user_name = userData.user_name;
    }

    getUserId(): number {
        return this.user_id;
    }

    getUserName(): string {
        return this.user_name;
    }

}

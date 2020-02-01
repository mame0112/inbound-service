import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    @Output() change: EventEmitter<any> = new EventEmitter();

    constructor() { }

    signin(userData: any) {
        console.log('UserDataService signin');
        this.change.emit(userData);
    }
}

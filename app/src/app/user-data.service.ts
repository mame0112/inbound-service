import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

    isOpen = false;

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    signin() {
        console.log('UserDataService signin');
        this.change.emit(this.isOpen);
    }
}

import { Component, OnInit } from '@angular/core';

import { UserConsts } from '../constants';

import { User } from '../user';
import { UserDataService } from '../user-data.service';

import { UserDataBuilder } from '../data-builder/user-data-builder';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    userData: User;

    constructor(private userDataService: UserDataService) { }

    ngOnInit() {
        console.log('HeaderComponent OnInit');
        this.userDataService.change.subscribe(param => {
            if (param !== null){
                this.userData = new UserDataBuilder().setUserId(param[UserConsts.KEY_USER_ID]).setUserName(param[UserConsts.KEY_USER_NAME]).setThumbUrl(param[UserConsts.KEY_THUMB_URL]).getResult();
            }
        });
    }

}

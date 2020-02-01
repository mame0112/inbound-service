import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {

    user_name: string;

    constructor(private userDataService: UserDataService) { }

    ngOnInit() {
        this.user_name = this.userDataService.getUserName();
    }

}

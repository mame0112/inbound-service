import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
      console.log('HeaderComponent OnInit');
      this.userDataService.change.subscribe(userData => console.log(userData));
  }

}

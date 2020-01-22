import { Component, OnInit } from '@angular/core';

import { flatMap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { Constants } from '../constants';

@Component({
  selector: 'app-host-start',
  templateUrl: './host-start.component.html',
  styleUrls: ['./host-start.component.css']
})
export class HostStartComponent implements OnInit {

    isOverview = true;

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    onNextButtonClicked() {
        console.log('onNextButtonClicked');

        this.apiService.getVisitData(Constants.ALL_VISITS).subscribe(params => console.log(params));
        this.isOverview = !this.isOverview;
    }

}

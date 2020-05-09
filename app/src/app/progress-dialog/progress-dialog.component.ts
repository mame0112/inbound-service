import { Component, Inject, OnInit  } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Constants } from '../constants';

import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.css']
})
export class ProgressDialogComponent implements OnInit {

    color: ThemePalette = 'primary';
    mode: ProgressSpinnerMode = 'determinate';
    value = 50;

    // constructor(
    //     public dialogRef: MatDialogRef<ProgressDialogComponent>,
    //     @Inject(MAT_DIALOG_DATA) public data: DialogData){}

  ngOnInit() {
  }

}

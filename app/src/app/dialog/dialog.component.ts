import { Component, Inject, OnInit  } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    dialog_description: string;
    dialog_positive: string;
    dialog_negative: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData){}


    ngOnInit() {
        console.log('ngOnInit');

    }

    onPositiveClick(): void {
        console.log('onPositiveClick');
        this.dialogRef.close('Positive');
    }

    onNegativeClick(): void {
        console.log('onPositiveClick');
        this.dialogRef.close('Negative');
    }

}

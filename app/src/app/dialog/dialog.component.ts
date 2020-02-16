import { Component, Inject, OnInit  } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Constants } from '../constants';

export interface DialogData {
    id: number;
    description: string;
    positive: string;
    negative: string;
}

// export interface DialogResult {
//     id: number;
//     option: number;
// }

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    result = {
        id: 0,
        option: Constants.DIALOG_OPTION_POSITIVE
    };


    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData){}


    ngOnInit() {
        console.log('ngOnInit');
    }

    onPositiveClick(): void {
        console.log('onPositiveClick');


        this.result.id = this.data.id;
        this.result.option = Constants.DIALOG_OPTION_POSITIVE;

        this.dialogRef.close(this.result);
    }

    onNegativeClick(): void {
        console.log('onPositiveClick');

        this.result.id = this.data.id;
        this.result.option = Constants.DIALOG_OPTION_NEGATIVE;

        this.dialogRef.close(this.result);
    }

}

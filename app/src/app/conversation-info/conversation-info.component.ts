import { Component, Inject, OnInit  } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Constants } from '../constants';

export interface DialogData {
    id: number;
    conversation: any;
}

@Component({
  selector: 'app-conversation-info',
  templateUrl: './conversation-info.component.html',
  styleUrls: ['./conversation-info.component.css']
})
export class ConversationInfoComponent implements OnInit {

    id: number;
    conversation: any;

    constructor(
        public dialogRef: MatDialogRef<ConversationInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData){}


    ngOnInit() {
        console.log('ConversationInfoComponent OnInit');
        this.id = this.data.id;
        this.conversation = this.data.conversation;
        console.log(this.id);
        console.log(this.conversation);
    }

    onPositiveClick(): void {
        console.log('onPositiveClick');


        // this.result.id = this.data.id;
        // this.result.option = Constants.DIALOG_OPTION_POSITIVE;

        this.dialogRef.close();
    }

}
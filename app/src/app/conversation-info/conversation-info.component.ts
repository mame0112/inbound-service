import { Component, Inject, OnInit  } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Constants, ConversationConsts } from '../constants';

import { Problems } from '../problems';

import { Util } from '../util';

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

    problem = new Problems();
    start: string;
    end: string;

    constructor(
        public dialogRef: MatDialogRef<ConversationInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData){}


    ngOnInit() {
        console.log('ConversationInfoComponent OnInit');
        this.id = this.data.id;
        this.conversation = this.data.conversation;
        this.start = new Util().createDateForDisplay(this.conversation.start);
        this.end = new Util().createDateForDisplay(this.conversation.end);
    }

    onPositiveClick(): void {
        console.log('onPositiveClick');


        // this.result.id = this.data.id;
        // this.result.option = Constants.DIALOG_OPTION_POSITIVE;

        this.dialogRef.close();
    }

    getIconName(id: string): string {
        return this.problem.getIconName(id);
    }

    getLabel(id: string): string{
        return this.problem.getLabel(id);
    }

}

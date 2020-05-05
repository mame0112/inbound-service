import { Component, Input, ElementRef, ViewChild, ViewChildren, AfterViewInit, QueryList } from '@angular/core';

import { ScrollableDirective } from '../directive/scrollable.directive';
import { OffsetTopDirective } from '../directive/offset-top.directive';

@Component({
    selector: 'app-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css']
})

export class ChatComponent implements AfterViewInit {
    @ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective>;
    @ViewChild(ScrollableDirective, {static: false}) list: ScrollableDirective;

    selectedItem = Math.floor(Math.random() * 500);
    items = new Array(500).fill(0).map((_, i) => `Item ${i}`);

    constructor() { }

    ngAfterViewInit() {
        this.list.scrollTop = this.listItems.find((_, i) => i === this.selectedItem).offsetTop;
    }
}
import { Component, AfterViewInit, Input, ViewChild,  ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss'],
})
export class ExpandableComponent implements AfterViewInit {
  @ViewChild('expandWrapper', {read: ElementRef, static: false}) expandWrapper: ElementRef;
  @Input() expanded = false;
  @Input() expandHeight = '150px';
  @Input() itemlist = [];

  constructor(public renderer: Renderer2) {}

  /**
   * imposto l'altezza massima del render del componente expandable
   */
  ngAfterViewInit() {
    if (this.itemlist !== undefined && this.itemlist.length > 0) {
      this.renderer.setStyle(this.expandWrapper.nativeElement, 'max-height', this.expandHeight);
    }
  }
}

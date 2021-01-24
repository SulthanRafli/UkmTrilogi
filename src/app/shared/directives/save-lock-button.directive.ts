import { Directive, ElementRef, HostListener, Renderer2, Output, EventEmitter } from "@angular/core";
import { MatButton } from "@angular/material/button";

@Directive({
  selector: `[submitClick]`,
})
export class SaveLockButtonDirective {
  private buttonElement: MatButton;
  private oldElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.buttonElement = el.nativeElement;
  }

  @Output() readonly submitClick: EventEmitter<any> = new EventEmitter<any>();

  private complete() {
    if (this.oldElement) {
      const btnChildren = this.el.nativeElement.children;

      for (let child of btnChildren) {
        this.renderer.removeChild(this.el.nativeElement, child);
      }

      const oldNodes = this.oldElement.childNodes;
      const docFrag = document.createDocumentFragment();

      for (var i = 0; i < oldNodes.length; i) {
        docFrag.appendChild(oldNodes[i]);
      }

      this.renderer.appendChild(this.el.nativeElement, docFrag);
      this.buttonElement.disabled = false;
    }
  }

  @HostListener('click', ['$event']) onButtonClick(ev) {
    const spinnerContent = `
      <ngx-loading
      [show]="true"
      [config]="{        
        primaryColour: primaryColour,
        secondaryColour: secondaryColour,
        tertiaryColour: primaryColour,
        backdropBorderRadius: '3px'
      }"
      [template]="loadingTemplate"
    ></ngx-loading>
    `;
    this.buttonElement.disabled = true;

    const btnChildren = this.el.nativeElement.children;
    this.oldElement = this.el.nativeElement.cloneNode(true);

    for (let child of btnChildren) {
      this.renderer.removeChild(this.el.nativeElement, child);
    }
    this.el.nativeElement.innerHTML = spinnerContent;

    this.submitClick.emit({
      complete: () => this.complete(),
      target: ev.target,
      path: ev.path,
      srcElement: ev.srcElement,
    });
  }

}
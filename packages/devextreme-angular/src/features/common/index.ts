import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
    standalone: true,
    selector: '[dx-content-insertion]',
})
export class InsertionDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}

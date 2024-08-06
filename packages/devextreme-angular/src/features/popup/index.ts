import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import { DxComponent } from "devextreme-angular/core";
import { InsertionDirective } from "devextreme-angular/features/common";

@Component({
    template: '',
})
export abstract class DxPopupComponentExtender extends DxComponent {
    @ViewChild(InsertionDirective) insertionPoint: InsertionDirective;

    @Output() afterViewInit$: EventEmitter<void>

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.afterViewInit$.emit();
    }

    _getAdditionalEmitters() {
        return [{ emit: 'afterViewInit$' }];
    }
}

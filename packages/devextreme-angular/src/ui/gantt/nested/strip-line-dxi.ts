/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-gantt-strip-line',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiGanttStripLineComponent extends CollectionNestedOption {
    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get end(): Date | (() => Date | number | string) | number | string {
        return this._getOption('end');
    }
    set end(value: Date | (() => Date | number | string) | number | string) {
        this._setOption('end', value);
    }

    @Input()
    get start(): Date | (() => Date | number | string) | number | string {
        return this._getOption('start');
    }
    set start(value: Date | (() => Date | number | string) | number | string) {
        this._setOption('start', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    protected get _optionPath() {
        return 'stripLines';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiGanttStripLineComponent
  ],
  exports: [
    DxiGanttStripLineComponent
  ],
})
export class DxiGanttStripLineModule { }

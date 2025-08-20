/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_stripLines } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-gantt-strip-line',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_stripLines,
           useExisting: DxiGanttStripLineComponent,
        }
    ]
})
export class DxiGanttStripLineComponent extends CollectionNestedOption {

    
    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get end(): Date | (() => Date | number | string) | number | string | undefined {
        return this._getOption('end');
    }
    set end(value: Date | (() => Date | number | string) | number | string | undefined) {
        this._setOption('end', value);
    }

    @Input()
    get start(): Date | (() => Date | number | string) | number | string | undefined {
        return this._getOption('start');
    }
    set start(value: Date | (() => Date | number | string) | number | string | undefined) {
        this._setOption('start', value);
    }

    @Input()
    get title(): string | undefined {
        return this._getOption('title');
    }
    set title(value: string | undefined) {
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
  imports: [
    DxiGanttStripLineComponent
  ],
  exports: [
    DxiGanttStripLineComponent
  ],
})
export class DxiGanttStripLineModule { }

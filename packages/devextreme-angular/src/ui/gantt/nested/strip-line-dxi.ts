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
    selector: 'dxi-strip-line',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiStripLineComponent extends CollectionNestedOption {
    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get end(): Date | number | Function | string | undefined {
        return this._getOption('end');
    }
    set end(value: Date | number | Function | string | undefined) {
        this._setOption('end', value);
    }

    @Input()
    get start(): Date | number | Function | string | undefined {
        return this._getOption('start');
    }
    set start(value: Date | number | Function | string | undefined) {
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
  declarations: [
    DxiStripLineComponent
  ],
  exports: [
    DxiStripLineComponent
  ],
})
export class DxiStripLineModule { }

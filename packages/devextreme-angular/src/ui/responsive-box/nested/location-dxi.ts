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
    selector: 'dxi-location',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiLocationComponent extends CollectionNestedOption {
    @Input()
    get col(): number {
        return this._getOption('col');
    }
    set col(value: number) {
        this._setOption('col', value);
    }

    @Input()
    get colspan(): number | undefined {
        return this._getOption('colspan');
    }
    set colspan(value: number | undefined) {
        this._setOption('colspan', value);
    }

    @Input()
    get row(): number {
        return this._getOption('row');
    }
    set row(value: number) {
        this._setOption('row', value);
    }

    @Input()
    get rowspan(): number | undefined {
        return this._getOption('rowspan');
    }
    set rowspan(value: number | undefined) {
        this._setOption('rowspan', value);
    }

    @Input()
    get screen(): string | undefined {
        return this._getOption('screen');
    }
    set screen(value: string | undefined) {
        this._setOption('screen', value);
    }


    protected get _optionPath() {
        return 'location';
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
    DxiLocationComponent
  ],
  exports: [
    DxiLocationComponent
  ],
})
export class DxiLocationModule { }

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
    selector: 'dxi-card-view-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiCardViewColumnComponent extends CollectionNestedOption {
    @Input()
    get fieldCaptionTemplate(): any {
        return this._getOption('fieldCaptionTemplate');
    }
    set fieldCaptionTemplate(value: any) {
        this._setOption('fieldCaptionTemplate', value);
    }

    @Input()
    get fieldTemplate(): any {
        return this._getOption('fieldTemplate');
    }
    set fieldTemplate(value: any) {
        this._setOption('fieldTemplate', value);
    }

    @Input()
    get fieldValueTemplate(): any {
        return this._getOption('fieldValueTemplate');
    }
    set fieldValueTemplate(value: any) {
        this._setOption('fieldValueTemplate', value);
    }

    @Input()
    get headerItemCssClass(): string {
        return this._getOption('headerItemCssClass');
    }
    set headerItemCssClass(value: string) {
        this._setOption('headerItemCssClass', value);
    }

    @Input()
    get headerItemTemplate(): any {
        return this._getOption('headerItemTemplate');
    }
    set headerItemTemplate(value: any) {
        this._setOption('headerItemTemplate', value);
    }


    protected get _optionPath() {
        return 'columns';
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
    DxiCardViewColumnComponent
  ],
  exports: [
    DxiCardViewColumnComponent
  ],
})
export class DxiCardViewColumnModule { }

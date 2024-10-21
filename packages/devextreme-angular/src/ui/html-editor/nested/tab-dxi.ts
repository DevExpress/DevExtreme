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
    selector: 'dxi-html-editor-tab',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiHtmlEditorTabComponent extends CollectionNestedOption {
    @Input()
    get name(): "url" | "file" {
        return this._getOption('name');
    }
    set name(value: "url" | "file") {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'tabs';
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
    DxiHtmlEditorTabComponent
  ],
  exports: [
    DxiHtmlEditorTabComponent
  ],
})
export class DxiHtmlEditorTabModule { }

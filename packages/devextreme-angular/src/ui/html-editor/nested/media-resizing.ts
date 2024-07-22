/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-media-resizing-html-editor',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMediaResizingHtmlEditorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowedTargets(): Array<string> {
        return this._getOption('allowedTargets');
    }
    set allowedTargets(value: Array<string>) {
        this._setOption('allowedTargets', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }


    protected get _optionPath() {
        return 'mediaResizing';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoMediaResizingHtmlEditorComponent
  ],
  exports: [
    DxoMediaResizingHtmlEditorComponent
  ],
})
export class DxoMediaResizingHtmlEditorModule { }

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
    selector: 'dxo-file-manager-item-view',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFileManagerItemViewComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get details(): Record<string, any> {
        return this._getOption('details');
    }
    set details(value: Record<string, any>) {
        this._setOption('details', value);
    }

    @Input()
    get mode(): "details" | "thumbnails" {
        return this._getOption('mode');
    }
    set mode(value: "details" | "thumbnails") {
        this._setOption('mode', value);
    }

    @Input()
    get showFolders(): boolean {
        return this._getOption('showFolders');
    }
    set showFolders(value: boolean) {
        this._setOption('showFolders', value);
    }

    @Input()
    get showParentFolder(): boolean {
        return this._getOption('showParentFolder');
    }
    set showParentFolder(value: boolean) {
        this._setOption('showParentFolder', value);
    }


    protected get _optionPath() {
        return 'itemView';
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
    DxoFileManagerItemViewComponent
  ],
  exports: [
    DxoFileManagerItemViewComponent
  ],
})
export class DxoFileManagerItemViewModule { }

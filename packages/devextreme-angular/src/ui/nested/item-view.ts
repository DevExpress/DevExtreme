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




import DevExpress from 'devextreme/bundles/dx.all';
import { FileManagerItemViewMode } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-item-view',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoItemViewComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get details(): { columns?: Array<DevExpress.ui.dxFileManagerDetailsColumn | string> } {
        return this._getOption('details');
    }
    set details(value: { columns?: Array<DevExpress.ui.dxFileManagerDetailsColumn | string> }) {
        this._setOption('details', value);
    }

    @Input()
    get mode(): FileManagerItemViewMode {
        return this._getOption('mode');
    }
    set mode(value: FileManagerItemViewMode) {
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
    DxoItemViewComponent
  ],
  exports: [
    DxoItemViewComponent
  ],
})
export class DxoItemViewModule { }

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
    selector: 'dxo-editing-scheduler',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoEditingSchedulerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowAdding(): boolean {
        return this._getOption('allowAdding');
    }
    set allowAdding(value: boolean) {
        this._setOption('allowAdding', value);
    }

    @Input()
    get allowDeleting(): boolean {
        return this._getOption('allowDeleting');
    }
    set allowDeleting(value: boolean) {
        this._setOption('allowDeleting', value);
    }

    @Input()
    get allowDragging(): boolean {
        return this._getOption('allowDragging');
    }
    set allowDragging(value: boolean) {
        this._setOption('allowDragging', value);
    }

    @Input()
    get allowResizing(): boolean {
        return this._getOption('allowResizing');
    }
    set allowResizing(value: boolean) {
        this._setOption('allowResizing', value);
    }

    @Input()
    get allowTimeZoneEditing(): boolean {
        return this._getOption('allowTimeZoneEditing');
    }
    set allowTimeZoneEditing(value: boolean) {
        this._setOption('allowTimeZoneEditing', value);
    }

    @Input()
    get allowUpdating(): boolean {
        return this._getOption('allowUpdating');
    }
    set allowUpdating(value: boolean) {
        this._setOption('allowUpdating', value);
    }


    protected get _optionPath() {
        return 'editing';
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
    DxoEditingSchedulerComponent
  ],
  exports: [
    DxoEditingSchedulerComponent
  ],
})
export class DxoEditingSchedulerModule { }

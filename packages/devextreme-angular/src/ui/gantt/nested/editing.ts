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
    selector: 'dxo-editing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDependencyAdding(): boolean {
        return this._getOption('allowDependencyAdding');
    }
    set allowDependencyAdding(value: boolean) {
        this._setOption('allowDependencyAdding', value);
    }

    @Input()
    get allowDependencyDeleting(): boolean {
        return this._getOption('allowDependencyDeleting');
    }
    set allowDependencyDeleting(value: boolean) {
        this._setOption('allowDependencyDeleting', value);
    }

    @Input()
    get allowResourceAdding(): boolean {
        return this._getOption('allowResourceAdding');
    }
    set allowResourceAdding(value: boolean) {
        this._setOption('allowResourceAdding', value);
    }

    @Input()
    get allowResourceDeleting(): boolean {
        return this._getOption('allowResourceDeleting');
    }
    set allowResourceDeleting(value: boolean) {
        this._setOption('allowResourceDeleting', value);
    }

    @Input()
    get allowResourceUpdating(): boolean {
        return this._getOption('allowResourceUpdating');
    }
    set allowResourceUpdating(value: boolean) {
        this._setOption('allowResourceUpdating', value);
    }

    @Input()
    get allowTaskAdding(): boolean {
        return this._getOption('allowTaskAdding');
    }
    set allowTaskAdding(value: boolean) {
        this._setOption('allowTaskAdding', value);
    }

    @Input()
    get allowTaskDeleting(): boolean {
        return this._getOption('allowTaskDeleting');
    }
    set allowTaskDeleting(value: boolean) {
        this._setOption('allowTaskDeleting', value);
    }

    @Input()
    get allowTaskResourceUpdating(): boolean {
        return this._getOption('allowTaskResourceUpdating');
    }
    set allowTaskResourceUpdating(value: boolean) {
        this._setOption('allowTaskResourceUpdating', value);
    }

    @Input()
    get allowTaskUpdating(): boolean {
        return this._getOption('allowTaskUpdating');
    }
    set allowTaskUpdating(value: boolean) {
        this._setOption('allowTaskUpdating', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
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
    DxoEditingComponent
  ],
  exports: [
    DxoEditingComponent
  ],
})
export class DxoEditingModule { }

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
    selector: 'dxo-data-grid-column-fixing-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridColumnFixingTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fix(): string {
        return this._getOption('fix');
    }
    set fix(value: string) {
        this._setOption('fix', value);
    }

    @Input()
    get leftPosition(): string {
        return this._getOption('leftPosition');
    }
    set leftPosition(value: string) {
        this._setOption('leftPosition', value);
    }

    @Input()
    get rightPosition(): string {
        return this._getOption('rightPosition');
    }
    set rightPosition(value: string) {
        this._setOption('rightPosition', value);
    }

    @Input()
    get stickyPosition(): string {
        return this._getOption('stickyPosition');
    }
    set stickyPosition(value: string) {
        this._setOption('stickyPosition', value);
    }

    @Input()
    get unfix(): string {
        return this._getOption('unfix');
    }
    set unfix(value: string) {
        this._setOption('unfix', value);
    }


    protected get _optionPath() {
        return 'texts';
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
    DxoDataGridColumnFixingTextsComponent
  ],
  exports: [
    DxoDataGridColumnFixingTextsComponent
  ],
})
export class DxoDataGridColumnFixingTextsModule { }

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
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-gantt-texts',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoGanttTextsComponent extends NestedOption implements OnDestroy, OnInit  {

    
    @Input()
    get cancel(): string {
        return this._getOption('cancel');
    }
    set cancel(value: string) {
        this._setOption('cancel', value);
    }

    @Input()
    get emptyValue(): string {
        return this._getOption('emptyValue');
    }
    set emptyValue(value: string) {
        this._setOption('emptyValue', value);
    }

    @Input()
    get ok(): string {
        return this._getOption('ok');
    }
    set ok(value: string) {
        this._setOption('ok', value);
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
  imports: [
    DxoGanttTextsComponent
  ],
  exports: [
    DxoGanttTextsComponent
  ],
})
export class DxoGanttTextsModule { }

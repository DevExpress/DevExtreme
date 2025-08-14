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
    selector: 'dxo-tag-box-field-addons',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoTagBoxFieldAddonsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get afterTemplate(): any {
        return this._getOption('afterTemplate');
    }
    set afterTemplate(value: any) {
        this._setOption('afterTemplate', value);
    }

    @Input()
    get beforeTemplate(): any {
        return this._getOption('beforeTemplate');
    }
    set beforeTemplate(value: any) {
        this._setOption('beforeTemplate', value);
    }


    protected get _optionPath() {
        return 'fieldAddons';
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
    DxoTagBoxFieldAddonsComponent
  ],
  exports: [
    DxoTagBoxFieldAddonsComponent
  ],
})
export class DxoTagBoxFieldAddonsModule { }

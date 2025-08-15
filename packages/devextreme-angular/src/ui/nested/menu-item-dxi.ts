/* tslint:disable:max-line-length */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxi-menu-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiMenuItemComponent) => ({
               propertyName: 'menuItems',
               component
            }),
            deps: [DxiMenuItemComponent],
         }
    ],
})
export class DxiMenuItemComponent extends CollectionNestedOption {

    
    @Input()
    get action(): Function {
        return this._getOption('action');
    }
    set action(value: Function) {
        this._setOption('action', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }


    protected get _optionPath() {
        return 'menuItems';
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
  imports: [
    DxiMenuItemComponent
  ],
  exports: [
    DxiMenuItemComponent
  ],
})
export class DxiMenuItemModule { }

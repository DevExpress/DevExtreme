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
    selector: 'dxi-connection-point-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiConnectionPointDiagramComponent extends CollectionNestedOption {
    @Input()
    get x(): number {
        return this._getOption('x');
    }
    set x(value: number) {
        this._setOption('x', value);
    }

    @Input()
    get y(): number {
        return this._getOption('y');
    }
    set y(value: number) {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'connectionPoints';
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
    DxiConnectionPointDiagramComponent
  ],
  exports: [
    DxiConnectionPointDiagramComponent
  ],
})
export class DxiConnectionPointDiagramModule { }

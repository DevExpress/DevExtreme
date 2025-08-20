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
    selector: 'dxo-card-view-texts',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewTextsComponent extends NestedOption implements OnDestroy, OnInit  {

    
    @Input()
    get addCard(): string {
        return this._getOption('addCard');
    }
    set addCard(value: string) {
        this._setOption('addCard', value);
    }

    @Input()
    get confirmDeleteMessage(): string {
        return this._getOption('confirmDeleteMessage');
    }
    set confirmDeleteMessage(value: string) {
        this._setOption('confirmDeleteMessage', value);
    }

    @Input()
    get confirmDeleteTitle(): string {
        return this._getOption('confirmDeleteTitle');
    }
    set confirmDeleteTitle(value: string) {
        this._setOption('confirmDeleteTitle', value);
    }

    @Input()
    get deleteCard(): string {
        return this._getOption('deleteCard');
    }
    set deleteCard(value: string) {
        this._setOption('deleteCard', value);
    }

    @Input()
    get editCard(): string {
        return this._getOption('editCard');
    }
    set editCard(value: string) {
        this._setOption('editCard', value);
    }

    @Input()
    get saveCard(): string {
        return this._getOption('saveCard');
    }
    set saveCard(value: string) {
        this._setOption('saveCard', value);
    }

    @Input()
    get clearFilter(): string {
        return this._getOption('clearFilter');
    }
    set clearFilter(value: string) {
        this._setOption('clearFilter', value);
    }

    @Input()
    get createFilter(): string {
        return this._getOption('createFilter');
    }
    set createFilter(value: string) {
        this._setOption('createFilter', value);
    }

    @Input()
    get filterEnabledHint(): string {
        return this._getOption('filterEnabledHint');
    }
    set filterEnabledHint(value: string) {
        this._setOption('filterEnabledHint', value);
    }

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
    DxoCardViewTextsComponent
  ],
  exports: [
    DxoCardViewTextsComponent
  ],
})
export class DxoCardViewTextsModule { }

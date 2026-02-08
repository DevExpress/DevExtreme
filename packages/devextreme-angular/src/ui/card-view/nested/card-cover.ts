/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';



import {
    DxIntegrationModule,
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-card-view-card-cover',
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoCardViewCardCoverComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get altExpr(): ((data: any) => string) | string {
        return this._getOption('altExpr');
    }
    set altExpr(value: ((data: any) => string) | string) {
        this._setOption('altExpr', value);
    }

    @Input()
    get aspectRatio(): string {
        return this._getOption('aspectRatio');
    }
    set aspectRatio(value: string) {
        this._setOption('aspectRatio', value);
    }

    @Input()
    get imageExpr(): ((data: any) => string) | string {
        return this._getOption('imageExpr');
    }
    set imageExpr(value: ((data: any) => string) | string) {
        this._setOption('imageExpr', value);
    }

    @Input()
    get maxHeight(): number {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }


    protected get _optionPath() {
        return 'cardCover';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        templateHost.setHost(this);
    }

    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
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
    DxoCardViewCardCoverComponent
  ],
  exports: [
    DxoCardViewCardCoverComponent
  ],
})
export class DxoCardViewCardCoverModule { }

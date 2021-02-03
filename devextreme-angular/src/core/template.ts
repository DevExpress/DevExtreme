/* tslint:disable:use-input-property-decorator */

import {
    Directive,
    NgModule,
    TemplateRef,
    ViewContainerRef,
    Input,
    Renderer2,
    NgZone,
    EmbeddedViewRef
} from '@angular/core';

import { DxTemplateHost } from './template-host';
import { getElement } from './utils';
import * as events from 'devextreme/events';
import * as domAdapter from 'devextreme/core/dom_adapter';

export const DX_TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class RenderData {
    model: any;
    index: number;
    container: any;
}

@Directive({
    selector: '[dxTemplate]'
})
export class DxTemplateDirective {
    @Input()
    set dxTemplateOf(value) {
        this.name = value;
    };
    name: string;

    constructor(private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        templateHost: DxTemplateHost,
        private renderer: Renderer2,
        private zone: NgZone) {
        templateHost.setTemplate(this);
    }

    private renderTemplate(renderData: RenderData): EmbeddedViewRef<any> {
        const childView = this.viewContainerRef.createEmbeddedView(this.templateRef, {
            '$implicit': renderData.model,
            index: renderData.index
        });

        const container = getElement(renderData.container);
        if (renderData.container) {
            childView.rootNodes.forEach((element) => {
                this.renderer.appendChild(container, element);
            });
        }

        return childView;
    }

    render(renderData: RenderData) {
        let childView;
        if (this.zone.isStable) {
            childView = this.zone.run(() => {
                return this.renderTemplate(renderData);
            });
        } else {
            childView = this.renderTemplate(renderData);
            // =========== WORKAROUND =============
            // https://github.com/angular/angular/issues/12243
            childView['detectChanges']();
            // =========== /WORKAROUND =============
        }

        childView.rootNodes.forEach((element) => {
            if (element.nodeType === 1) {
                domAdapter.setClass(element, DX_TEMPLATE_WRAPPER_CLASS, true);
            }

            events.one(element, 'dxremove', ({}, params) => {
                if (!params || !params._angularIntegration) {
                    childView.destroy();
                }
            });
        });

        return childView.rootNodes;
    }
}

@NgModule({
    declarations: [DxTemplateDirective],
    exports: [DxTemplateDirective]
})
export class DxTemplateModule { }

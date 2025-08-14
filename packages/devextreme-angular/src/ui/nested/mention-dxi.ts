/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { DxiHtmlEditorMention } from './base/html-editor-mention-dxi';

@Component({
    selector: 'dxi-mention',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiMentionComponent) => ({
               propertyName: 'mentions',
               component
            }),
            deps: [DxiMentionComponent],
         }
    ],
    inputs: [
        'dataSource',
        'displayExpr',
        'itemTemplate',
        'marker',
        'minSearchLength',
        'searchExpr',
        'searchTimeout',
        'template',
        'valueExpr'
    ]
})
export class DxiMentionComponent extends DxiHtmlEditorMention {

    

    protected get _optionPath() {
        return 'mentions';
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
    DxiMentionComponent
  ],
  exports: [
    DxiMentionComponent
  ],
})
export class DxiMentionModule { }

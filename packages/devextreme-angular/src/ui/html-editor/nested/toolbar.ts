/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    // ContentChildren,
    forwardRef,
    QueryList,
    AfterContentInit
} from '@angular/core';




import { AIToolbarItem, dxHtmlEditorToolbarItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
// import { DxiHtmlEditorItemComponent } from './item-dxi';
// import { DxiHtmlEditorToolbarItemComponent } from './toolbar-item-dxi';
import { ParentTracker, ParentTrackerToken } from './parent-tracker';
import { ChildRegistry } from './child-registry';


@Component({
    selector: 'dxo-html-editor-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        { provide: ParentTrackerToken, useExisting: forwardRef(() => DxoHtmlEditorToolbarComponent) }
    ]
})
export class DxoHtmlEditorToolbarComponent extends NestedOption implements ParentTracker<any>, OnDestroy, OnInit, AfterContentInit  {
    @Input()
    get container(): any | string {
        return this._getOption('container');
    }
    set container(value: any | string) {
        this._setOption('container', value);
    }

    @Input()
    get items(): Array<AIToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<AIToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>) {
        this._setOption('items', value);
    }

    @Input()
    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }

    registry = new ChildRegistry<any>();

    logChildren() {
        console.log(this.registry.getChildren());
    }

    register(child: any): void {
        console.log('Registering:', child);
        this.registry.register(child);
    }

    unregister(child: any): void {
        console.log('Unregistering:', child);
        this.registry.unregister(child);
    }


    // @ContentChildren(forwardRef(() => DxiHtmlEditorItemComponent)) itemsChildren!: QueryList<DxiHtmlEditorItemComponent>
    
    // @ContentChildren(forwardRef(() => DxiHtmlEditorToolbarItemComponent)) toolbarItemsChildren!: QueryList<DxiHtmlEditorToolbarItemComponent>
    
    setItems() {
        console.log("Logging children");
        this.logChildren();
        const q: QueryList<any> = new QueryList();
        // q.reset([
        //     ...this.itemsChildren.toArray(),
        //     ...this.toolbarItemsChildren.toArray(),
        // ]);
        q.reset([...this.registry.getChildren()])

        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();

        this.registry.children$.subscribe(() => { this.setItems() });
        
        // this.itemsChildren.changes.subscribe(() => { this.setItems() });
        // this.toolbarItemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoHtmlEditorToolbarComponent
  ],
  exports: [
    DxoHtmlEditorToolbarComponent
  ],
})
export class DxoHtmlEditorToolbarModule { }

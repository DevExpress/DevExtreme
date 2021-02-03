/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxTabPanelModule,
    DxTabPanelComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: `
    <dx-tab-panel 
        [dataSource]="tabPanelItems"
        [selectedIndex]="selectedIndex">
    </dx-tab-panel>
    `
})
class TestContainerComponent {
    @ViewChild(DxTabPanelComponent) tabPanel: DxTabPanelComponent;

    tabPanelItems: number[] = [0, 1, 2];
    selectedIndex = 0;
}

describe('DxTabPanel', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTabPanelModule]
            });
    });

    // spec
    it('option, dependenced on dataSource, should be applied', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component: TestContainerComponent = fixture.componentInstance;
        component.tabPanelItems.push(3);

        let index = component.tabPanelItems.length - 1;
        component.selectedIndex = index;
        fixture.detectChanges();

        let instance: any = component.tabPanel.instance;
        expect(instance.option('items').length).toBe(4);
        expect(instance.option('selectedIndex')).toBe(index);
    });

    it('option, binded to another widget, should update second widget before AfterViewChecked lifecycle hook', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-tab-panel #tabPanel
                        [dataSource]="tabPanelItems" [visible]="true">
                    </dx-tab-panel>
                    <dx-tab-panel [(visible)]="tabPanel.visible"></dx-tab-panel>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component: TestContainerComponent = fixture.componentInstance;
        component.tabPanel.visible = false;

        expect(fixture.detectChanges.bind(fixture)).not.toThrow();
    });

    it('dxi-item nested component should render own content', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-tab-panel>
                        <dxi-item title="page1">
                            <div id="content">Page1</div>
                        </dxi-item>
                    </dx-tab-panel>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let content = document.getElementById('content');

        expect(content).not.toBe(null);
        expect(content.innerText).toBe('Page1');
    });
});

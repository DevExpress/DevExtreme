/* tslint:disable:component-selector */
import {
  Component,
  ViewChild,
} from '@angular/core';

import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';

import {
  DxTagBoxComponent,
} from 'devextreme-angular';

import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import {
  DxFormComponent, DxiFormItemComponent, DxiFormValidationRuleComponent, DxoFormLabelComponent
} from 'devextreme-angular/ui/form';

@Component({
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  formData = {
    name: 'Unknown',
    date: new Date(),
  };

  labelValues = [{ name: 'label1' }, { name: 'label2' }];

  labelValuesSecond = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];

  formData1 = { labels: this.labelValues };

  condition = true;

  @ViewChild(DxFormComponent) formComponent: DxFormComponent;

  validateForm() {
    return true;
  }
}

describe('DxForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent],
        imports: [
            DxFormComponent,
          DxTagBoxComponent,
          DxiFormItemComponent,
          DxoFormLabelComponent,
          DxiFormValidationRuleComponent,
          DxiItemComponent
        ],
      },
    );
  });

  function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
    return fixture.componentInstance.formComponent.instance;
  }

  // spec
  it('should be able to accept items via nested dxi components (T459714)', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-form-item dataField="name" editorType="dxTextBox"></dxi-form-item>
                    </dx-form>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);
    expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
  });

  it('should be able to accept items recursively', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-item caption="Root Group" itemType="group">
                            <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                            <dxi-item caption="Inner Group" itemType="group">
                                <dxi-item dataField="name" editorType="dxTextBox"></dxi-item>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);
    expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(2);
  });

  it('should be able to accept items via nested dxi components with comment from ngIf directive (#440)', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form id="form" [formData]="formData">
                        <dxi-form-item dataField="name" editorType="dxTextBox">
                            <dxi-form-validation-rule
                                *ngIf="true"
                                type="required"
                                message="item is required."
                            ></dxi-form-validation-rule>
                        </dxi-form-item>
                    </dx-form>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const instance = getWidget(fixture);
    expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
  });

  it('should update model after editor value was changed', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="formData">
                        <dxi-form-item dataField="name" editorType="dxTextBox">
                        </dxi-form-item>
                    </dx-form>
                    <span id="text">{{formData.name}}<span>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.autoDetectChanges();

    const instance = getWidget(fixture);
    const input = instance.element().querySelector('input');
    input.value = 'test value';
    input?.dispatchEvent(new Event('change'));

    expect(document.getElementById('text').innerText.trim()).toBe('test value');
    fixture.autoDetectChanges(false);
  });

  it('should work with dxTagBox', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form
                        [formData]="{}"
                        [items]="[{
                            dataField: 'name',
                            editorType: 'dxTagBox',
                            editorOptions: {
                                dataSource: [{ value: 1, text: 'item 1' }, { value: 2, text: 'item 2' }, { value: 3, text: 'item 3' }],
                                displayExpr: 'text',
                                valueExpr: 'value'
                            }
                        }]"></dx-form>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const tagBoxInstance = formInstance.getEditor('name');

    tagBoxInstance.option('value', [2]);
    fixture.detectChanges();

    expect(formInstance.option('formData.name')).toEqual([2]);
  });

  it('should work with custom validation and ngIf', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="{ text: 1 }">
                        <dxi-form-item itemType="group" *ngIf="true">
                            <dxi-form-item dataField="text">
                                <dxi-form-validation-rule type="custom" [validationCallback]="validateForm">
                                </dxi-form-validation-rule>
                            </dxi-form-item>
                        </dxi-form-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    expect(formInstance.validate()).toBeDefined();
  });

  it('should not call resetOption for rerendered nested collection components', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="formData1">
                        <dxi-item itemType="group"
                            name="label-container">
                            <dxi-item [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValues; let i = index">
                                <dxo-form-label [text]="labelValue.name"></dxo-form-label>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();
    const formInstance = getWidget(fixture);
    const spy = spyOn(formInstance, 'resetOption');

    fixture.componentInstance.labelValues = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(0);
    expect(formInstance.option('items[0].items[0].label.text')).toBe('label1');
  });

  it('should not call resetOption for rerendered nested components', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="formData1">
                        <dxi-form-item [dataField]="'labels[' + i + ']'"  *ngFor="let labelValue of labelValues; let i = index">
                            <dxo-form-label [text]="labelValue.name"></dxo-form-label>
                        </dxi-form-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const spy = spyOn(formInstance, 'resetOption');

    fixture.componentInstance.labelValues = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(0);
    expect(formInstance.option('items[0].label.text')).toBe('label1');
  });

  it('should not call resetOption for rerendered nested components (delete item)', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="{}">
                        <dxi-form-item [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                            <dxo-form-label text="{{ labelValue.name }}"></dxo-form-label>
                        </dxi-form-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const spy = spyOn(formInstance, 'resetOption');

    fixture.componentInstance.labelValuesSecond.splice(1, 1);
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(0);
    expect(formInstance.option('items[1].label.text')).toBe('label3');
  });

  it('should delete collection nested item with ordinary nested', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="{}">
                        <dxi-form-item [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                            <dxo-form-label text="{{ labelValue.name }}"></dxo-form-label>
                        </dxi-form-item>
                        <dxi-form-item [dataField]="'labels[4]'">
                            <dxo-form-label text="label4" *ngIf="condition"></dxo-form-label>
                        </dxi-form-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const spy = spyOn(formInstance, 'resetOption').and.callThrough();

    fixture.componentInstance.labelValuesSecond.splice(1, 1);
    fixture.componentInstance.condition = false;
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(1);
    expect(formInstance.option('items[1].label.text')).toBe('label3');
    expect(formInstance.option('items[2].label.text')).toBe(undefined);
  });

  it('should delete collection nested item with ordinary nested in two groups', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="{}">
                        <dxi-item caption="First Group" itemType="group">
                            <dxi-item [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValues; let i = index">
                                <dxo-form-label text="{{ labelValue.name }}"></dxo-form-label>
                            </dxi-item>
                            <dxi-item [dataField]="'labels[3]'">
                                <dxo-form-label text="label3" *ngIf="condition"></dxo-form-label>
                            </dxi-item>
                        </dxi-item>
                        <dxi-item caption="Second Group" itemType="group">
                            <dxi-item [dataField]="'labels[0]'">
                                <dxo-form-label text="label0" *ngIf="condition"></dxo-form-label>
                            </dxi-item>
                            <dxi-item [dataField]="'labels[' + i++ + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                                <dxo-form-label text="{{ labelValue.name }}"></dxo-form-label>
                            </dxi-item>
                        </dxi-item>
                    </dx-form>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const spy = spyOn(formInstance, 'resetOption').and.callThrough();

    fixture.componentInstance.labelValues.splice(1, 1);
    fixture.componentInstance.labelValuesSecond.splice(1, 1);
    fixture.componentInstance.condition = false;
    fixture.detectChanges();

    expect(spy.calls.count()).toBe(2);
    expect(formInstance.option('items[0].items[1].label.text')).toBe(undefined);
    expect(formInstance.option('items[1].items[2].label.text')).toBe('label3');
    expect(formInstance.option('items[1].items[3].label.text')).toBe(undefined);
  });

  it('should change the value of dxDateBox', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-form [formData]="formData">
                    </dx-form>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    fixture.componentInstance.formData.date = new Date(2017, 0, 1);
    fixture.detectChanges();

    const formInstance = getWidget(fixture);
    const dateBoxInstance = formInstance.getEditor('date');

    expect(dateBoxInstance.option('value')).toEqual(new Date(2017, 0, 1));
  });
});

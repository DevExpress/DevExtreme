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
  DxFormModule,
  DxTagBoxModule,
  DxFormComponent,
} from 'devextreme-angular';

@Component({
  standalone: false,
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
        imports: [DxFormModule, DxTagBoxModule],
      },
    );
  });

  function getWidget(fixture: ComponentFixture<TestContainerComponent>) {
    return fixture.componentInstance.formComponent.instance;
  }

  // spec
  [
    {
      testName: 'legacy',
      formSimpleItem: 'dxi-item',
      formGroupItem: 'dxi-item',
      formGroupItemType: 'itemType="group"',
      formValidationItem: 'dxi-validation-rule',
      formValidationRequiredItemType: 'type="required"',
      formValidationCustomItemType: 'type="custom"',
    },
    {
      testName: 'new',
      formSimpleItem: 'dxi-form-simple-item',
      formGroupItem: 'dxi-form-group-item',
      formGroupItemType: '',
      formValidationItem: 'dxi-form-required-rule',
      formValidationRequiredItemType: '',
      formValidationCustomItemType: '',
    },
  ].forEach(({
    testName,
    formSimpleItem,
    formGroupItem,
    formGroupItemType,
    formValidationItem,
    formValidationRequiredItemType,
    formValidationCustomItemType,
  }) => {
    it(`should be able to accept items via nested dxi components (T459714) (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form id="form" [formData]="formData">
                        <${formSimpleItem} dataField="name" editorType="dxTextBox"></${formSimpleItem}>
                    </dx-form>
                `,
        },
      });
      const fixture = TestBed.createComponent(TestContainerComponent);
      fixture.detectChanges();

      const instance = getWidget(fixture);
      expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    });

    it(`should be able to accept items recursively (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form id="form" [formData]="formData">
                        <${formGroupItem} caption="Root Group" ${formGroupItemType}>
                            <${formSimpleItem} dataField="name" editorType="dxTextBox"></${formSimpleItem}>
                            <${formGroupItem} caption="Inner Group" ${formGroupItemType}>
                                <${formSimpleItem} dataField="name" editorType="dxTextBox"></${formSimpleItem}>
                            </${formGroupItem}>
                        </${formGroupItem}>
                    </dx-form>
                `,
        },
      });
      const fixture = TestBed.createComponent(TestContainerComponent);
      fixture.detectChanges();

      const instance = getWidget(fixture);
      expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(2);
    });

    it(`should be able to accept items via nested dxi components with comment from ngIf directive (#440) (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form id="form" [formData]="formData">
                        <${formSimpleItem} dataField="name" editorType="dxTextBox">
                            <${formValidationItem}
                                *ngIf="true"
                                ${formValidationRequiredItemType}
                                message="item is required."
                            ></${formValidationItem}>
                        </${formSimpleItem}>
                    </dx-form>
                `,
        },
      });
      const fixture = TestBed.createComponent(TestContainerComponent);
      fixture.detectChanges();

      const instance = getWidget(fixture);
      expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    });

    it(`should update model after editor value was changed (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="formData">
                        <${formSimpleItem} dataField="name" editorType="dxTextBox">
                        </${formSimpleItem}>
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

    it(`should work with custom validation and ngIf (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="{ text: 1 }">
                        <${formGroupItem} ${formGroupItemType} *ngIf="true">
                            <${formSimpleItem} dataField="text">
                                <${formValidationItem} ${formValidationCustomItemType} [validationCallback]="validateForm">
                                </${formValidationItem}>
                            </${formSimpleItem}>
                        </${formGroupItem}>
                    </dx-form>
                `,
        },
      });

      const fixture = TestBed.createComponent(TestContainerComponent);
      fixture.detectChanges();

      const formInstance = getWidget(fixture);
      expect(formInstance.validate()).toBeDefined();
    });

    it(`should not call resetOption for rerendered nested collection components (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="formData1">
                        <${formGroupItem} ${formGroupItemType}
                            name="label-container">
                            <${formSimpleItem} [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValues; let i = index">
                                <dxo-label [text]="labelValue.name"></dxo-label>
                            </${formSimpleItem}>
                        </${formGroupItem}>
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

    it(`should not call resetOption for rerendered nested components (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="formData1">
                        <${formSimpleItem} [dataField]="'labels[' + i + ']'"  *ngFor="let labelValue of labelValues; let i = index">
                            <dxo-label [text]="labelValue.name"></dxo-label>
                        </${formSimpleItem}>
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

    it(`should not call resetOption for rerendered nested components (delete item) (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="{}">
                        <${formSimpleItem} [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                            <dxo-label text="{{ labelValue.name }}"></dxo-label>
                        </${formSimpleItem}>
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

    it(`should delete collection nested item with ordinary nested (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="{}">
                        <${formSimpleItem} [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                            <dxo-label text="{{ labelValue.name }}"></dxo-label>
                        </${formSimpleItem}>
                        <${formSimpleItem} [dataField]="'labels[4]'">
                            <dxo-label text="label4" *ngIf="condition"></dxo-label>
                        </${formSimpleItem}>
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

    it(`should delete collection nested item with ordinary nested in two groups (with ${testName} nested items)`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-form [formData]="{}">
                        <${formGroupItem} caption="First Group" ${formGroupItemType}>
                            <${formSimpleItem} [dataField]="'labels[' + i + ']'" *ngFor="let labelValue of labelValues; let i = index">
                                <dxo-label text="{{ labelValue.name }}"></dxo-label>
                            </${formSimpleItem}>
                            <${formSimpleItem} [dataField]="'labels[3]'">
                                <dxo-label text="label3" *ngIf="condition"></dxo-label>
                            </${formSimpleItem}>
                        </${formGroupItem}>
                        <${formGroupItem} caption="Second Group" ${formGroupItemType}>
                            <${formSimpleItem} [dataField]="'labels[0]'">
                                <dxo-label text="label0" *ngIf="condition"></dxo-label>
                            </${formSimpleItem}>
                            <${formSimpleItem} [dataField]="'labels[' + i++ + ']'" *ngFor="let labelValue of labelValuesSecond; let i = index">
                                <dxo-label text="{{ labelValue.name }}"></dxo-label>
                            </${formSimpleItem}>
                        </${formGroupItem}>
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

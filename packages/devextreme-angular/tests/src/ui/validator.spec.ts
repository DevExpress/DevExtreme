/* tslint:disable:component-selector */

import {
  Component,
  ViewChild,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxTextBoxComponent,
  DxValidatorComponent,
} from 'devextreme-angular';

@Component({
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  @ViewChild(DxTextBoxComponent) textBox: DxTextBoxComponent;

  @ViewChild(DxValidatorComponent) validator: DxValidatorComponent;

  text = 'Some text';

  validationRules = [
    {
      type: 'required',
      message: 'Report number is required.',
    },
  ];

  isValid = true;

  testAdapter = {
    getValue: () => this.text,
    applyValidationResults: (result: any) => {
      this.isValid = result.isValid;
    },
  };
}

describe('DxValidator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent],
        imports: [DxTextBoxComponent, DxValidatorComponent],
      },
    );
  });

  // spec
  it('should work with dx-validator', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-text-box [value]="text">
                        <dx-validator [validationRules]="validationRules"></dx-validator>
                    </dx-text-box>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.textBox;

    fixture.detectChanges();
    expect(instance.element().classList.contains('dx-invalid')).toBe(false);

    testComponent.text = '';
    fixture.detectChanges();
    expect(instance.element().classList.contains('dx-invalid')).toBe(true);

    testComponent.text = 'Some text';
    fixture.detectChanges();
    expect(instance.element().classList.contains('dx-invalid')).toBe(false);
  });

  it('should work with custom editor', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <input [value]="text"/>
                    <dx-validator [validationRules]="validationRules" [adapter]="testAdapter"></dx-validator>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;

    testComponent.validator.instance.validate();
    expect(testComponent.isValid).toBe(true);

    testComponent.text = '';
    fixture.detectChanges();
    testComponent.validator.instance.validate();
    expect(testComponent.isValid).toBe(false);

    testComponent.text = 'Some text';
    fixture.detectChanges();
    testComponent.validator.instance.validate();
    expect(testComponent.isValid).toBe(true);
  });
});

/* tslint:disable:component-selector */

import {
  Component,
  ViewChild,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxTextBoxModule,
  DxTextBoxComponent,
  DxValidatorModule,
  DxValidatorComponent,
} from 'devextreme-angular';

@Component({
  standalone: false,
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  @ViewChild(DxTextBoxComponent) textBox: DxTextBoxComponent;

  @ViewChild(DxValidatorComponent) validator: DxValidatorComponent;

  text = 'some@email.ok';

  validationRules = [
    {
      type: 'required',
      message: 'Report number is required.',
    },
    {
      type: 'email',
      message: 'Correct email is required.',
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
        imports: [DxTextBoxModule, DxValidatorModule],
      },
    );
  });

  [
    {
      name: 'legacy',
      tpl: `<dx-validator>
                @for (rule of validationRules; track rule){ 
                    <dxi-validation-rule [type]="rule.type"></dxi-validation-rule>
                }
            </dx-validator>`,
    },
    {
      name: 'by props',
      tpl: '<dx-validator [validationRules]="validationRules"></dx-validator>',
    },
    {
      name: 'modern',
      tpl: `<dx-validator>
            @for (rule of validationRules; track rule){ 
                @if (rule.type === 'email') {
                    <dxi-validator-email-rule ></dxi-validator-email-rule>
                } @else {
                    <dxi-validator-required-rule></dxi-validator-required-rule>
                 }
            }</dx-validator>`,
    },
  ].forEach(({ name, tpl }) => {
    // spec
    it('should work with dx-validator', () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <dx-text-box [value]="text">
                        ${tpl}
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
      expect(instance.element().classList.contains('dx-invalid')).toBe(true);

      testComponent.text = 'some@ema.il';
      fixture.detectChanges();
      expect(instance.element().classList.contains('dx-invalid')).toBe(false);
    });

    it(`should work with custom editor (use ${name})`, () => {
      TestBed.overrideComponent(TestContainerComponent, {
        set: {
          template: `
                    <input [value]="text"/>
                    ${tpl.replace('<dx-validator', '<dx-validator [adapter]="testAdapter"')}
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
      expect(testComponent.isValid).toBe(false);

      testComponent.text = 'some@email.yes';
      fixture.detectChanges();
      testComponent.validator.instance.validate();
      expect(testComponent.isValid).toBe(true);
    });
  });
});

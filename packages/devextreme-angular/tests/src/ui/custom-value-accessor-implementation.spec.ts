/* tslint:disable:component-selector */

import {
    Component,
    OnInit
} from '@angular/core';

import {
    ReactiveFormsModule,
    AbstractControl,
    FormGroup,
    FormControl
} from '@angular/forms';

import {
    TestBed
} from '@angular/core/testing';

import DxTextBox from 'devextreme/ui/text_box';

import {
    DxTextBoxModule
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: `
        <form [formGroup]="form">
            <div class="form-group">
                <dx-text-box formControlName="formControl" [(ngModel)]="value"></dx-text-box>
            </div>
        </form>
    `
})
class TestContainerComponent implements OnInit {
    form: FormGroup;
    value = '';
    formControl: AbstractControl;

    ngOnInit() {
        this.form = new FormGroup({
            formControl: new FormControl(''),
        });
        this.formControl = this.form.controls['formControl'];
    }
}

describe('DxTextBox value accessor', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTextBoxModule, ReactiveFormsModule]
            });
    });

    function getWidget(fixture) {
        let widgetElement = fixture.nativeElement.querySelector('.dx-textbox') || fixture.nativeElement;
        return DxTextBox['getInstance'](widgetElement) as any;
    }

    // spec
    it('should process disable/enable methods', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        fixture.componentInstance.formControl.disable();
        fixture.detectChanges();

        expect(instance.option('disabled')).toBe(true);

        fixture.componentInstance.formControl.enable();
        fixture.detectChanges();

        expect(instance.option('disabled')).toBe(false);
    });

    it('should change the value', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        fixture.componentInstance.value = 'text';
        fixture.detectChanges();

        expect(instance.option('value')).toBe('text');
    });

    it('should change touched option', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = getWidget(fixture);

        expect(fixture.componentInstance.formControl.touched).toBe(false);

        instance.focus();
        instance.blur();

        expect(fixture.componentInstance.formControl.touched).toBe(true);
    });

    it('should not fire valueChanges event when patchValue method is used with emitEvent=false (T614207)', () => {
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let component = fixture.componentInstance,
            form = component.form,
            testSpy = jasmine.createSpy('testSpy');

        form.valueChanges.subscribe(testSpy);

        form.controls['formControl'].patchValue('text', { emitEvent: false });
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(0);

        form.controls['formControl'].patchValue('text2');
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    });
});

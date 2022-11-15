import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';

enum FormControls {
    toggleControl = 'toggleControl',
}

@Component({
    selector: 'app-slide-toggle-form-example',
    templateUrl: './slide-toggle-form-example.component.html',
    styleUrls: ['./slide-toggle-form-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleFormExampleComponent {
    form = new FormGroup({
        [FormControls.toggleControl]: new FormControl(true),
    });

    formValue$ = this.form.valueChanges.pipe(startWith(this.form.value));

    validationForm = new FormGroup({
        [FormControls.toggleControl]: new FormControl(false, [Validators.requiredTrue]),
    });

    validationFormValue$ = this.validationForm.valueChanges.pipe(startWith(this.validationForm.value));

    validationFormStatus$ = this.validationForm.statusChanges.pipe(startWith(this.validationForm.status));

    toggleFormValue(): void {
        const control = this.form.get(FormControls.toggleControl);
        this.form.setValue({
            [FormControls.toggleControl]: !control?.value,
        });
    }

    toggleValidationFormValue(): void {
        const control = this.validationForm.get(FormControls.toggleControl);
        this.validationForm.setValue({
            [FormControls.toggleControl]: !control?.value,
        });
    }
}

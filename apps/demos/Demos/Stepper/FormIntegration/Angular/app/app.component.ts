import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  computed,
  enableProdMode,
  inject,
  signal,
} from '@angular/core';
import {
  DxButtonModule,
  DxMultiViewModule,
} from 'devextreme-angular';
import { DxStepperModule, type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import validationEngine from 'devextreme/ui/validation_engine';
import { AppService } from './app.service';
import { DatesFormComponent } from './dates-form/dates-form.component';
import { GuestsFormComponent } from './guests-form/guests-form.component';
import { RoomMealPlanFormComponent } from './room-meal-plan-form/room-meal-plan-form.component';
import { AdditionalFormComponent } from './additional-form/additional-form.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxButtonModule,
    DxMultiViewModule,
    DxStepperModule,
    DatesFormComponent,
    GuestsFormComponent,
    RoomMealPlanFormComponent,
    AdditionalFormComponent,
    ConfirmationComponent,
  ],
})
export class AppComponent {
  private readonly appService = inject(AppService);

  readonly steps = signal(this.appService.getInitialSteps());

  readonly formData = signal(this.appService.getInitialFormData());

  readonly confirmationData = signal(this.formData());

  readonly selectedIndex = signal(0);

  readonly isConfirmed = signal(false);

  readonly isStepperReadonly = signal(false);

  readonly validationGroups = ['dates', 'guests', 'roomAndMealPlan'];

  readonly nextButtonText = computed(() => {
    if (this.selectedIndex() < this.steps().length - 1) {
      return 'Next';
    }

    return this.isConfirmed() ? 'Reset' : 'Confirm';
  });

  private getValidationResult(index: number) {
    if (index >= this.validationGroups.length) {
      return true;
    }

    return validationEngine.validateGroup(this.validationGroups[index]).isValid;
  }

  private setStepValidationResult(index: number, isValid: boolean | undefined) {
    this.steps()[index].isValid = isValid;
  }

  onSelectionChanging(e: DxStepperTypes.SelectionChangingEvent) {
    const { component, addedItems, removedItems } = e;
    const { items = [] } = component.option();

    const addedIndex = items.findIndex((item: DxStepperTypes.Item) => item === addedItems[0]);
    const removedIndex = items.findIndex((item: DxStepperTypes.Item) => item === removedItems[0]);
    const isMoveForward = removedIndex > -1 && addedIndex > removedIndex;

    if (isMoveForward) {
      const isValid = this.getValidationResult(removedIndex);

      this.setStepValidationResult(removedIndex, isValid);

      if (isValid === false) {
        e.cancel = true;
      }
    }

    if (!e.cancel && addedIndex === items.length - 1) {
      this.confirmationData.set({ ...this.formData() });
    }
  }

  onPrevButtonClick() {
    this.selectedIndex.update((index) => index - 1);
  }

  private moveNext() {
    const isValid = this.getValidationResult(this.selectedIndex());

    this.setStepValidationResult(this.selectedIndex(), isValid);

    if (isValid) {
      this.selectedIndex.update((index) => index + 1);
    }
  }

  private reset() {
    this.isConfirmed.set(false);
    this.selectedIndex.set(0);
    this.steps.set(this.appService.getInitialSteps());
    const formData = this.appService.getInitialFormData();
    this.formData.set(formData);
    this.confirmationData.set(formData);
    this.isStepperReadonly.set(false);
  }

  private confirm() {
    this.isConfirmed.set(true);
    this.setStepValidationResult(this.selectedIndex(), true);
    this.isStepperReadonly.set(true);
  }

  onNextButtonClick() {
    if (this.selectedIndex() < this.steps().length - 1) {
      this.moveNext();
    } else if (this.isConfirmed()) {
      this.reset();
    } else {
      this.confirm();
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});

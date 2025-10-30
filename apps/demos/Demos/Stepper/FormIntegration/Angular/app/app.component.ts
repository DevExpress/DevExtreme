import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxButtonModule,
  DxDateRangeBoxModule,
  DxFormModule,
  DxMultiViewModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextAreaModule,
} from 'devextreme-angular';
import { DxStepperModule, type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import { AppService } from './app.service';
import { BookingFormData } from './app.types';
import { DatesFormComponent } from './dates-form/dates-form.component';
import { GuestsFormComponent } from './guests-form/guests-form.component';
import { RoomMealPlanFormComponent } from './room-meal-plan-form/room-meal-plan-form.component';
import { AdditionalFormComponent } from './additional-form/additional-form.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import validationEngine from 'devextreme/ui/validation_engine';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'demo-app',
  standalone: false,
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  steps: DxStepperTypes.Item[];

  formData: BookingFormData;

  selectedIndex: number;

  isConfirmed: boolean;

  isStepperReadonly: boolean;

  validationGroups = ['dates', 'guests', 'roomAndMealPlan'];

  constructor(private readonly appService: AppService) {
    this.steps = this.appService.getInitialSteps();
    this.formData = this.appService.getInitialFormData();
    this.selectedIndex = 0;
    this.isConfirmed = false;
    this.isStepperReadonly = false;
  }

  getValidationResult(index: number) {
    if (index >= this.validationGroups.length) {
      return true;
    }

    return validationEngine.validateGroup(this.validationGroups[index]).isValid;
  }

  setStepValidationResult(index: number, isValid: boolean | undefined) {
    this.steps[index].isValid = isValid;
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
  }

  getNextButtonText() {
    if (this.selectedIndex < this.steps.length - 1) {
      return 'Next';
    }

    return this.isConfirmed ? 'Reset' : 'Confirm';
  }

  onPrevButtonClick() {
    this.selectedIndex -= 1;
  }

  moveNext() {
    const isValid = this.getValidationResult(this.selectedIndex);

    this.setStepValidationResult(this.selectedIndex, isValid);

    if (isValid) {
      this.selectedIndex += 1;
    }
  }

  reset() {
    this.isConfirmed = false;
    this.selectedIndex = 0;
    this.steps = this.appService.getInitialSteps();
    this.formData = this.appService.getInitialFormData();
    this.isStepperReadonly = false;
  }

  confirm() {
    this.isConfirmed = true;
    this.setStepValidationResult(this.selectedIndex, true);
    this.isStepperReadonly = true;
  }

  onNextButtonClick() {
    if (this.selectedIndex < this.steps.length - 1) {
      this.moveNext();
    } else if (this.isConfirmed) {
      this.reset();
    } else {
      this.confirm();
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxDateRangeBoxModule,
    DxFormModule,
    DxMultiViewModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxStepperModule,
    DxTextAreaModule,
  ],
  declarations: [
    AppComponent,
    DatesFormComponent,
    GuestsFormComponent,
    RoomMealPlanFormComponent,
    AdditionalFormComponent,
    ConfirmationComponent,
  ],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

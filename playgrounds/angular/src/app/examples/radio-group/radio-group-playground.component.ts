import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

interface PlaygroundBtnData {
  value: string;
  label: string;
}

interface PlaygroundData {
  groupValue?: string;
  buttons: PlaygroundBtnData[];
}

@Component({
  selector: 'dx-radio-group-playground',
  template: `
    <div
      *ngIf="data$ | async as data"
      class="example">
      <div class="example__title">
        RadioGroup playground
      </div>
      <div class="example__control">
        <dx-radio-group
          [value]="data.groupValue"
          (valueChange)="setGroupValue($event)"
        >
          <dx-radio-button
            *ngFor="let btnData of data.buttons"
            [value]="btnData.value"
            [label]="btnData.label"
          >
          </dx-radio-button>
        </dx-radio-group>
      </div>
      <div class="example__play-part">
        <div class="example__play-part">
          <label>RadioGroup value:</label>
          <input
            type="text"
            class="example-input"
            [value]="data.groupValue"
            (change)="setGroupDataFromEvent($event)"
          />
        </div>
        <div
          *ngFor="let btnData of data.buttons; let idx = index"
          class="example__play-part">
          <label>label:</label>
          <input
            type="text"
            class="example-input"
            [value]="btnData.label"
            (change)="setButtonLabelFromEvent($event, idx)"
          />
          <label>value:</label>
          <input
            type="text"
            class="example-input"
            [value]="btnData.value"
            (change)="setButtonValueFromEvent($event, idx)"
          />
        </div>
        <div class="example__play-part">
          <button class="example-button" (click)="addBtn()">Add</button>
          <button class="example-button" (click)="removeBtn()">Remove</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupPlaygroundComponent {
  private dataSubject = new BehaviorSubject<PlaygroundData>({
    groupValue: '1',
    buttons: [
      { value: '0', label: 'Option 0' },
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
  });

  data$ = this.dataSubject.asObservable();

  setGroupValue(value?: string): void {
    this.updateData(() => ({ groupValue: value }));
  }

  setGroupDataFromEvent(event: Event): void {
    this.setGroupValue((event.target as HTMLInputElement)?.value);
  }

  setButtonLabelFromEvent(event: Event, idx: number): void {
    const label = (event.target as HTMLInputElement)?.value;
    this.updateData((data) => ({
      buttons: Object.assign(data.buttons, { [idx]: { label, value: data.buttons[idx].value } }),
    }));
  }

  setButtonValueFromEvent(event: Event, idx: number): void {
    const value = (event.target as HTMLInputElement)?.value;
    this.updateData((data) => ({
      buttons: Object.assign(data.buttons, { [idx]: { label: data.buttons[idx].label, value } }),
    }));
  }

  addBtn(): void {
    this.updateData((data) => ({
      buttons: [
        ...data.buttons,
        { label: `Option ${data.buttons.length}`, value: `${data.buttons.length}` },
      ],
    }));
  }

  removeBtn(): void {
    this.updateData((data) => ({
      buttons: data.buttons.filter((_, idx) => idx !== data.buttons.length - 1),
    }));
  }

  private updateData(updateFunc: (data: PlaygroundData) => Partial<PlaygroundData>): void {
    this.dataSubject.pipe(take(1)).subscribe((data) => {
      this.dataSubject.next(({
        ...data,
        ...updateFunc(data),
      }));
    });
  }
}

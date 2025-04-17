/* tslint:disable:component-selector */

import {
  Component,
  ViewChild,
} from '@angular/core';

import { TestBed } from '@angular/core/testing';

import {
  DxCalendarComponent,
} from 'devextreme-angular';

@Component({
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  @ViewChild(DxCalendarComponent) calendar: DxCalendarComponent;

  value: any = [];
}

describe('DxCalendar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent],
        imports: [DxCalendarComponent],
      },
    );
  });

  // spec
  it('should accept iterable and non-iterable values without exception', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-calendar [value]="value" selectionMode="multiple"></dx-calendar>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);

    fixture.detectChanges();

    const { calendar } = fixture.componentInstance;

    calendar.selectionMode = 'single';
    calendar.instance.option('value', new Date());

    fixture.detectChanges();
  });
});

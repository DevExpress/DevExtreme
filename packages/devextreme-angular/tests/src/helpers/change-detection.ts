import { ComponentFixture } from '@angular/core/testing';

export const detectChanges = (fixture: ComponentFixture<unknown>): void => {
  fixture.changeDetectorRef.markForCheck();
  fixture.detectChanges();
};

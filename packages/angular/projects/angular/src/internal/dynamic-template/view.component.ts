import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class ViewComponent {
  constructor(protected cdRef: ChangeDetectorRef) {
  }

  markForCheck(): void {
    this.cdRef.markForCheck();
  }
}

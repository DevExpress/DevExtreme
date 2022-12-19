import { ChangeDetectorRef, Component } from '@angular/core';

@Component({ template: '' })
export abstract class ViewComponent {
  constructor(protected cdRef: ChangeDetectorRef) {
  }

  markForCheck(): void {
    this.cdRef.markForCheck();
  }
}

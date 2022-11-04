import {ChangeDetectorRef, Component} from '@angular/core';

@Component({ template: '' })
export abstract class DxViewComponent {
  constructor(protected cdRef: ChangeDetectorRef) {
  }

  markForCheck(): void {
    this.cdRef.markForCheck();
  }
}

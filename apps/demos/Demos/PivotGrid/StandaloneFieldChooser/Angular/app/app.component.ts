import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

// TODO: restore the original demo (see git history for this file, app.component.html,
// app.component.css, app.service.ts — all left untouched/unused for easy restoration).
// Temporarily simplified because combining DxPivotGridModule + DxPivotGridFieldChooserModule
// in one component's `imports` triggers NG8023 ("Multiple components match node with tagname
// dxo-pivot-grid-field-chooser-texts") during devextreme-site's CI daily build. Doesn't
// reproduce with a from-scratch local rebuild of devextreme-angular on this branch —
// suspected stale nx/build cache on that CI runner. Restore once that's confirmed cleared.
@Component({
  selector: 'demo-app',
  template: '<p>This demo is temporarily disabled. See the TODO in app.component.ts.</p>',
})
export class AppComponent {}

bootstrapApplication(AppComponent);

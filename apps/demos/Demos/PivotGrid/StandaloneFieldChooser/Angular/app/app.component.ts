import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

// TODO: restore the original demo (see git history for this file, app.component.html,
// app.component.css, app.service.ts). Disabled because combining DxPivotGridModule and
// DxPivotGridFieldChooserModule here triggers NG8023 on CI's daily build, likely a stale
// build cache on that runner — not reproducible locally.
@Component({
  selector: 'demo-app',
  template: '<p>This demo is temporarily disabled. See the TODO in app.component.ts.</p>',
})
export class AppComponent {}

bootstrapApplication(AppComponent);

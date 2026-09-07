import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

// TODO: restore the original demo (see git history for this file, app.component.html,
// app.component.css, app.service.ts). Disabled because combining DxPivotGridModule and
// DxPivotGridFieldChooserModule here reproducibly triggers, in CI only (not locally, likely a
// devextreme-angular artifacts staleness difference between environments):
//   NG8023: Multiple components match node with tagname dxo-pivot-grid-field-chooser-texts:
//   'DxoPivotGridFieldChooserTextsComponent', 'DxoPivotGridFieldChooserTextsComponent'.
// Both modules generate their own nested-options component for that tag name, and combining
// them in one standalone component's imports puts both in scope at once. Needs a real fix in
// devextreme-angular's generated wrappers (or dropping one of the two imports if one turns out
// to be redundant here) rather than a demo-side workaround.
@Component({
  selector: 'demo-app',
  template: '<p>This demo is temporarily disabled. See the TODO in app.component.ts.</p>',
})
export class AppComponent {}

bootstrapApplication(AppComponent);

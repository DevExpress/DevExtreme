import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'email',
  templateUrl: `.${modulePrefix}/email/email.component.html`,
})
export class Email {
  @Input() email!: string;
}

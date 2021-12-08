import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // eslint-disable-next-line spellcheck/spell-checker
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-app';
  helloWorld() {
    alert(1);
  }
}

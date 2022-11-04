import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-home',
  template:`
    <a routerLink="/slideToggle">slideToggle examples</a>
    <a routerLink="/pager">pager examples</a>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    a {
      display: block;
      margin: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
}

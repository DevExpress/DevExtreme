import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, take} from 'rxjs';

const PAGE_SIZES = [
  [10, 20, 30],
  [20, 40, 60],
  [15, 30, 45],
]

interface IControlState {
  selectedPage: number;
  selectedPageSize: number;
  pageCount: number;
  pageSizes: number[];
}

const DEFAULT_CONTROL_STATE: IControlState = {
  selectedPage: 1,
  selectedPageSize: 10,
  pageCount: 20,
  pageSizes: PAGE_SIZES[0],
}

@Component({
  selector: 'app-pager-simple-example',
  templateUrl: './pager-simple-example.component.html',
  styleUrls: ['./pager-simple-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerSimpleExampleComponent {
  private stateSubject = new BehaviorSubject(DEFAULT_CONTROL_STATE);

  readonly state$ = this.stateSubject.asObservable();
  readonly allowedPageSizes = PAGE_SIZES;

  onPageChanged(selectedPage: number): void {
    this.updateControlState(() => ({selectedPage}));
  }

  onPageSizeChanged(selectedPageSize: number): void {
    this.updateControlState(() => ({selectedPageSize}));
  }

  changePageCount(event: Event): void {
    this.updateControlState(() => ({
      pageCount: +(event.target as HTMLInputElement)?.value,
    }))
  }

  changePageSizes(event: Event): void {
    this.updateControlState(() => ({
      pageSizes: PAGE_SIZES[+(event.target as HTMLSelectElement)?.value],
    }))
  }

  protected updateControlState(updateFunc: (state: IControlState) => Partial<IControlState>): void {
    this.stateSubject.pipe(take(1)).subscribe((state) => {
      this.stateSubject.next({
        ...state,
        ...updateFunc(state),
      })
    })
  }
}

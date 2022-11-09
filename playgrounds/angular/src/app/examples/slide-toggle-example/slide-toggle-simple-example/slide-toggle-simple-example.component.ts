import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TTextPosition } from '@devexpress/core/lib/esm/components/slideToggle';
import { BehaviorSubject, take } from 'rxjs';

interface IControlState {
    value: boolean;
    text: string;
    textPosition: TTextPosition;
}

@Component({
    selector: 'app-slide-toggle-control-example',
    templateUrl: './slide-toggle-simple-example.component.html',
    styleUrls: ['./slide-toggle-simple-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideToggleSimpleExampleComponent {
    private stateSubject = new BehaviorSubject<IControlState>({
        value: true,
        text: 'Angular passed text',
        textPosition: 'right' as TTextPosition
    });

    readonly state$ = this.stateSubject.asObservable();

    onValueChanged(changedValue: boolean): void {
        this.updateControlState(({value}) => ({value: changedValue}));
    }

    changeValue(): void {
        this.updateControlState(({value}) => ({value: !value}));
    }

    changeControlText(event: Event): void {
        this.updateControlState(() => ({
            text: (event.target as HTMLInputElement)?.value
        }));
    }

    changeControlTextPosition(event: Event): void {
        this.updateControlState(() => ({
            textPosition: ((event.target as HTMLSelectElement)?.value || 'right' as unknown) as TTextPosition
        }));
    }

    protected updateControlState(updateFunc: (state: IControlState) => Partial<IControlState>): void {
        this.stateSubject.pipe(take(1)).subscribe((state) => {
            this.stateSubject.next({
                ...state,
                ...updateFunc(state)
            });
        });
    }
}

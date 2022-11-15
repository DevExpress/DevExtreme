import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TTextPosition } from '@devexpress/core/lib/esm/components/slideToggle';
import { BehaviorSubject, take } from 'rxjs';
import { CustomIndicatorComponent, CustomTextComponent } from '../custom-components';

@Component({
    selector: 'app-slide-toggle-customization-example',
    templateUrl: './slide-toggle-customization-example.component.html',
    styleUrls: ['./slide-toggle-customization-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlideToggleCustomizationExampleComponent {
    private controlConfig = new BehaviorSubject({
        text: 'Component',
        textPosition: 'right' as TTextPosition
    });

    controlConfig$ = this.controlConfig.asObservable();

    indicatorView = CustomIndicatorComponent;

    textView = CustomTextComponent;

    changeControlText(event: Event): void {
        this.controlConfig.pipe(take(1)).subscribe((config) => {
            this.controlConfig.next({
                ...config,
                text: (event.target as HTMLInputElement)?.value
            });
        });
    }

    changeControlTextPosition(event: Event): void {
        this.controlConfig.pipe(take(1)).subscribe((config) => {
            this.controlConfig.next({
                ...config,
                textPosition: ((event.target as HTMLSelectElement)?.value || 'right' as unknown) as TTextPosition
            });
        });
    }
}

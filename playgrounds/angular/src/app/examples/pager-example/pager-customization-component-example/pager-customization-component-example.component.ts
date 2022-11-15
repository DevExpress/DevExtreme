import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CustomPageNumberComponent,
    CustomPageNumberItemComponent,
    CustomPagerComponent,
    CustomPageSizeComponent,
    CustomPageSizeItemComponent,
    CustomPageNumberDividerComponent
} from '../custom-components';

@Component({
    selector: 'app-pager-customization-component-example',
    templateUrl: './pager-customization-component-example.component.html',
    styleUrls: ['./pager-customization-component-example.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerCustomizationComponentExampleComponent {
    readonly customComponents = {
        pageNumberItem: CustomPageNumberItemComponent,
        pageNumberFakeItem: CustomPageNumberDividerComponent,
        pageSizeItem: CustomPageSizeItemComponent,
        pageNumber: CustomPageNumberComponent,
        pageSize: CustomPageSizeComponent,
        pager: CustomPagerComponent,
    };
}

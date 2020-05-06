import {
    Component,
    ComponentBindings,
    JSXComponent,
    Event,
    OneWay,
    Effect,
} from 'devextreme-generator/component_declaration/common';
import Page from './page';
import { PAGER_INFO_CLASS } from './info';
import NumberBox from '../number-box';
import * as messageLocalization from '../../localization/message';

const PAGER_INFO_TEXT_CLASS = `${PAGER_INFO_CLASS}  dx-info-text`;
export const viewFunction = ({
    valueChanged,
    width,
    value,
    props: { pageCount, pagesCountText },
}: SmallPages) => {
    return (
        <div className={'dx-light-pages'}>
            <NumberBox
                min={1}
                max={pageCount}
                width={width}
                value={value}
                valueChange={valueChanged}
            />
            <span className={PAGER_INFO_TEXT_CLASS}>{pagesCountText}</span>
            <Page selected={false} index={pageCount! - 1} />
        </div>
    );
};

@ComponentBindings()
export class SmallPagesProps {
    @OneWay() pageCount?: number = 10;
    @OneWay() pageIndex?: number = 0;
    // tslint:disable-next-line: max-line-length
    @OneWay() pagesCountText?: string = (messageLocalization as any).getFormatter('dxPager-pagesCountText')();
    @OneWay() rtlEnabled?: boolean = false;
    @Event() pageIndexChange?: (pageIndex: number) => void = () => { }; // commonUtils.noop
}
export const oneDigitWidth = 10;

// tslint:disable-next-line: max-classes-per-file
@Component({ defaultOptionRules: null, view: viewFunction })
export default class SmallPages extends JSXComponent<SmallPagesProps> {
    get value() {
        return this.props.pageIndex! + 1;
    }
    get width() {
        return this.minWidth + oneDigitWidth * this.props.pageCount!.toString().length;
    }
    private minWidth = 40;
    @Effect()
    updateWidth() {
        // TODO /*Number($pageIndex.css('minWidth').replace('px', ''))
    }
    valueChanged(value: number) {
        if (this.props.pageIndexChange) {
            this.props.pageIndexChange(value - 1);
        }
    }
}

import { Component, ComponentBindings, JSXComponent, Event, OneWay, Fragment } from 'devextreme-generator/component_declaration/common';
import Pages from './pages';
import LightButton from './light-button';

const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';
export const PAGER_BUTTON_DISABLE_CLASS = 'dx-button-disable';
const nextButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonClassName = `${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
const nextButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_NEXT_BUTTON_CLASS}`;
const prevButtonDisabledClassName = `${PAGER_BUTTON_DISABLE_CLASS} ${PAGER_NAVIGATE_BUTTON} ${PAGER_PREV_BUTTON_CLASS}`;
export const viewFunction = ({
    renderNavButtons,
    prevClassName,
    navigateToPrevPage,
    nextClassName,
    navigateToNextPage,
    props: {
        hasKnownLastPage, isLargeDisplayMode, maxPagesCount,
        pageCount, pageIndex, pageIndexChange: pageIndexChanged, pagesCountText,
        rtlEnabled, totalCount,
    } }: PageIndexSelector) => {
    return (
        <Fragment>
            {renderNavButtons &&
                <LightButton
                    className={prevClassName}
                    label={'Previous page'}
                    onClick={navigateToPrevPage}
                />}
            <Pages
                isLargeDisplayMode={isLargeDisplayMode}
                maxPagesCount={maxPagesCount}
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageIndexChange={pageIndexChanged}
                pagesCountText={pagesCountText}
                rtlEnabled={rtlEnabled}
                totalCount={totalCount}
            />
            {renderNavButtons &&
                <LightButton
                    className={nextClassName}
                    label={'Next page'}
                    onClick={navigateToNextPage}
                />}
        </Fragment>);
};

@ComponentBindings()
export class PageIndexSelectorProps {
    @OneWay() hasKnownLastPage?: boolean = true;
    @OneWay() isLargeDisplayMode?: boolean = true;
    @OneWay() maxPagesCount?: number = 10;
    @OneWay() pageCount?: number = 10;
    @OneWay() pageIndex?: number = 0;
    @Event() pageIndexChange?: (value: number) => void; // commonUtils.noop
    // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() pagesCountText?: string = 'Of';
    @OneWay() rtlEnabled?: boolean = false;
    @OneWay() showNavigationButtons?: boolean = false;
    @OneWay() totalCount?: number = 0;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})

export default class PageIndexSelector extends JSXComponent<PageIndexSelectorProps> {
    get nextClassName() {
        const direction = this.getNextDirection();
        const canNavigate = this.canNavigateTo(direction);
        return canNavigate ? nextButtonClassName : nextButtonDisabledClassName;
    }
    get prevClassName() {
        const direction = this.getPrevDirection();
        const canNavigate = this.canNavigateTo(direction);
        return canNavigate ? prevButtonClassName : prevButtonDisabledClassName;
    }
    get renderNavButtons() {
        const
            { isLargeDisplayMode, showNavigationButtons } = this.props;
        return !isLargeDisplayMode || showNavigationButtons;
    }
    getNextDirection() {
        return !this.props.rtlEnabled ? 'next' : 'prev';
    }
    getPrevDirection() {
        return !this.props.rtlEnabled ? 'prev' : 'next';
    }
    navigateToNextPage() {
        this.navigateToPage(this.getNextDirection());
    }
    navigateToPrevPage() {
        this.navigateToPage(this.getPrevDirection());
    }
    private canNavigateTo(direction: 'next' | 'prev') {
        const isNextDirection = direction === 'next';
        const { pageCount, pageIndex } = this.props as Required<PageIndexSelectorProps>;
        return isNextDirection ? pageIndex < pageCount - 1 : pageIndex > 0;
    }
    private getIncrement(direction: 'next' | 'prev') {
        return direction === 'next' ? +1 : -1;
    }
    private navigateToPage(direction: 'next' | 'prev') {
        const canNavigate = this.canNavigateTo(direction);
        if (canNavigate) {
            this.props.pageIndexChange!(this.props.pageIndex! + this.getIncrement(direction));
        }
    }
}

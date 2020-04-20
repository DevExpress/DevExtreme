import { Component, ComponentBindings, JSXComponent, Event, OneWay, Fragment } from 'devextreme-generator/component_declaration/common';
import PagerNavigationButton from './navigation-button';
import Pages from './pages';

export const viewFunction = ({ renderNavButtons, props }: PagerPageIndexSelector) => {
    const { rtlEnabled } = props;
    return (
        <Fragment>
            {renderNavButtons &&
            <PagerNavigationButton rtlEnabled={rtlEnabled} direction={'prev'} />}
            <Pages {...props}/>
            {renderNavButtons &&
            <PagerNavigationButton rtlEnabled={rtlEnabled} direction={'next'} />}
        </Fragment>);
};

@ComponentBindings()
export class PagerPageIndexSelectorInput {
    @OneWay() hasKnownLastPage ?= true;
    @OneWay() isLargeDisplayMode = true;
    @OneWay() maxPagesCount = 10;
    @OneWay() pageCount = 10;
    @OneWay() pageIndex = 0;
    @Event() pageIndexChanged ?= null; // commonUtils.noop
    // TODO messageLocalization.getFormatter('dxPager-pagesCountText');
    @OneWay() pagesCountText = 'Of';
    @OneWay() rtlEnabled = false;
    @OneWay() showNavigationButtons = false;
    @OneWay() totalCount = 0;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})
export default class PagerPageIndexSelector extends JSXComponent<PagerPageIndexSelectorInput> {
    get renderNavButtons() {
        const
            { isLargeDisplayMode, showNavigationButtons } = this.props;
        return !isLargeDisplayMode || showNavigationButtons;
    }
    getClick() {
        // const {rtlEnabled} = this.props;
        // isNext = (!rtlEnabled && direction === "prev") || (rtlEnabled && direction === "next");
    }

}

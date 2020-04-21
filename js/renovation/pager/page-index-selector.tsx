import { Component, ComponentBindings, JSXComponent, Event, OneWay, Fragment } from 'devextreme-generator/component_declaration/common';
import NavigationButton from './navigation-button';
import Pages from './pages';

export const viewFunction = ({ renderNavButtons, props }: PageIndexSelector) => {
    const { rtlEnabled } = props;
    return (
        <Fragment>
            {renderNavButtons &&
            <NavigationButton rtlEnabled={rtlEnabled} direction={'prev'} />}
            <Pages {...props}/>
            {renderNavButtons &&
            <NavigationButton rtlEnabled={rtlEnabled} direction={'next'} />}
        </Fragment>);
};

@ComponentBindings()
export class PageIndexSelectorProps {
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
export default class PageIndexSelector extends JSXComponent<PageIndexSelectorProps> {
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

import { Component, ComponentBindings, JSXComponent, OneWay } from 'devextreme-generator/component_declaration/common';

/*
     _renderNavigateButton: function(direction) {
        const that = this;
        const clickAction = that._createAction(function() {
            that._nextPage(direction);
        });
        let $button;

        if(that.option('showNavigationButtons') || that.option('lightModeEnabled')) {
            $button = $('<div>').addClass(PAGER_NAVIGATE_BUTTON);

            eventsEngine.on($button, eventUtils.addNamespace([pointerEvents.up, clickEvent.name],
                that.Name + 'Pages'), that._wrapClickAction(clickAction));

            accessibility.registerKeyboardAction('pager', that, $button, undefined, clickAction);

            that.setAria({
                'role': 'button',
                'label': direction === 'prev' ? 'Previous page' : ' Next page'
            }, $button);

            accessibility.setTabIndex(that, $button);

            if(that.option('rtlEnabled')) {
                $button.addClass(direction === 'prev' ? PAGER_NEXT_BUTTON_CLASS :
                 PAGER_PREV_BUTTON_CLASS);
                $button.prependTo(this._$pagesChooser);
            } else {
                $button.addClass(direction === 'prev' ? PAGER_PREV_BUTTON_CLASS :
                PAGER_NEXT_BUTTON_CLASS);
                $button.appendTo(this._$pagesChooser);
            }
        }
    },

 */
const PAGER_NAVIGATE_BUTTON = 'dx-navigate-button';
const PAGER_PREV_BUTTON_CLASS = 'dx-prev-button';
const PAGER_NEXT_BUTTON_CLASS = 'dx-next-button';

function combineClassName(classes: string[]) { return classes.join(' '); }
export const viewFunction = ({ className }: NavigationButton) => {
    return (<div className={className}/>);
};

@ComponentBindings()
export class NavigationButtonProps {
    @OneWay() direction: string = 'prev';
    @OneWay() rtlEnabled = false;
}

const nextButtonClassName = combineClassName([PAGER_NAVIGATE_BUTTON, PAGER_NEXT_BUTTON_CLASS]);
const prevButtonClassName = combineClassName([PAGER_NAVIGATE_BUTTON, PAGER_PREV_BUTTON_CLASS]);
// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules: null,
    view: viewFunction,
})

export default class NavigationButton extends JSXComponent<NavigationButtonProps> {
    get className() {
        const
            { direction } = this.props;
        return direction === 'prev' ? prevButtonClassName : nextButtonClassName;
    }
}

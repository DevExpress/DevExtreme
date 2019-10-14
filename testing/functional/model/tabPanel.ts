import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';
import Tabs from './tabs'
import MultiView from './multiView'

const CLASS = {
    tabPanel: "dx-tabpanel",
    focused: "dx-state-focused"
};

export default class TabPanel extends Widget {
    element: Selector;
    tabs: Tabs;
    multiview: MultiView;

    name: string = 'dxTabPanel';

    constructor (id: string|Selector) {
        super(id);

        this.element = Selector(`.${CLASS.tabPanel}`);
        this.isFocused = this.element.hasClass(CLASS.focused);

        this.tabs = new Tabs("#tabs");
        this.multiview = new MultiView("#multiView");
    }
}
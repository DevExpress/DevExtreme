import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';
import Tabs from './tabs'

const CLASS = {
    tabPanel: "dx-tabpanel"
};

export default class TabPanel extends Widget {
    element: Selector;
    tabs: Tabs;

    name: string = 'dxTabPanel';

    constructor (id: string|Selector) {
        super(id);

        this.element = Selector(`.${CLASS.tabPanel}`);
        this.tabs = new Tabs("#tabs");
    }
}
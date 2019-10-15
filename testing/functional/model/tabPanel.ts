import Widget from './internal/widget';
import { Selector } from 'testcafe';
import Tabs from './tabs'
import MultiView from './multiView'

const CLASS = {
    tabPanel: "dx-tabpanel",
    tabs: "dx-tabs",
    multiview: "dx-multiview"
};

export default class TabPanel extends Widget {
    element: Selector;
    tabs: Tabs;
    multiview: MultiView;

    name: string = 'dxTabPanel';

    constructor (id: string) {
        super(id);

        this.element = Selector(`.${CLASS.tabPanel}`);

        this.tabs = new Tabs(`.${CLASS.tabs}`);
        this.multiview = new MultiView(`.${CLASS.multiview}`);
    }
}

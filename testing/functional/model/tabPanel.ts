import Widget from './internal/widget';
import Tabs from './tabs'
import MultiView from './multiView'

const CLASS = {
    tabs: "dx-tabs",
    multiview: "dx-multiview"
};

export default class TabPanel extends Widget {
    tabs: Tabs;
    multiview: MultiView;

    name: string = 'dxTabPanel';

    constructor (id: string) {
        super(id);

        this.tabs = new Tabs(`.${CLASS.tabs}`);
        this.multiview = new MultiView(`.${CLASS.multiview}`);
    }
}

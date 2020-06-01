import Widget from './internal/widget';
import Tabs from './tabs';
import multiView from './multiView';

const CLASS = {
    tabs: 'dx-tabs',
    multiView: 'dx-multiView'
};

export default class TabPanel extends Widget {
    tabs: Tabs;
    multiView: multiView;

    name: string = 'dxTabPanel';

    constructor(id: string) {
        super(id);

        this.tabs = new Tabs(`.${CLASS.tabs}`);
        this.multiView = new multiView(`.${CLASS.multiView}`);
    }
}

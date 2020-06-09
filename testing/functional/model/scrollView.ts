import Widget from './internal/widget';
import { Selector } from 'testcafe';
import Scrollbar from './internal/scrollbar';

const CLASS = {
    scrollView: 'dx-scrollview',
    scrollbarContainer: 'dx-scrollable-container'
};
export default class ScrollView extends Widget {
    scrollbar: Scrollbar;

    name: string = 'dxScrollView';

    constructor(id: string|Selector, direction) {
        super(id);

        this.element = Selector(`.${CLASS.scrollView}`);
        this.scrollbar = new Scrollbar(direction);
    }

    static getScrollViewContainer() {
        return Selector(`.${CLASS.scrollbarContainer}`);
    }
}

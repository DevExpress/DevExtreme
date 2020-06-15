import Widget from './internal/widget';
import { Selector } from 'testcafe';
import Scrollbar from './internal/scrollbar';

const CLASS = {
    scrollView: "dx-scrollview",
    scrollbar: "dx-scrollbar",
    scrollbarContainer: "dx-scrollable-container",
    stateInvisible: "dx-state-invisible",
    scrollableScroll: "dx-scrollable-scroll"
};
export default class ScrollView extends Widget {
    scrollbar: Scrollbar;

    name: string = 'dxScrollView';

    constructor (id: string|Selector, direction) {
        super(id);

        this.element = Selector(`.${CLASS.scrollView}`);
        this.scrollbar = new Scrollbar(direction);
    }

    getScrollViewContainer() {
        return Selector(`.${CLASS.scrollbarContainer}`);
    }
}

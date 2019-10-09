import Widget from './internal/widget';
import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    scrollView: "dx-scrollview",
    scrollbar: "dx-scrollbar",
    scrollbarContainer: "dx-scrollable-container",
    stateInvisible: "dx-state-invisible",
    scrollableScroll: "dx-scrollable-scroll"
};

class Scrollbar {
    element: Selector;

    constructor(postfix: string) {
        this.element = Selector(`.${CLASS.scrollbar}-${postfix}`);
    }

    getScroll() {
        return this.element.find(`.${CLASS.scrollableScroll}`);
    }

    isScrollVisible(): Promise<boolean> {
        const scroll = this.getScroll();
        const invisibleStateClass = CLASS.stateInvisible;

        return ClientFunction(() => !$(scroll()).hasClass(invisibleStateClass), {
            dependencies: { scroll, invisibleStateClass }
        })();
    }
}

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
import $ from 'jquery';
import RenovatedPager from 'renovation/ui/pager/pager.j.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { act } from 'preact/test-utils';

export class RenovatedPagerForTest extends RenovatedPager {
    get _$pagesSizeChooser() {
        return this._$element.find('.dx-page-sizes');
    }
    get _$pagesChooser() {
        return this._$element.find('.dx-pages');
    }
    get _$info() {
        return this._$element.find('.dx-info');
    }
    get _pages() {
        return $.map(this._$element.find('.dx-page'), (el, index) => ({
            _$page: $(el),
            value: ()=> Number($(el).text()),
            selected: $(el).hasClass('dx-selection'),
            index
        }));
    }
    get selectedPage() {
        return this._pages.filter(p => p.selected)[0];
    }
    _dimensionChanged() {
        if(!this.firing) {
            this.firing = true;
            act(() => resizeCallbacks.fire());
        }
        this.firing = false;
    }
    _selectPageByValue(pageIndex) {
        const pages = this._pages;
        const page = pages.filter(({ value }) => value() === pageIndex)[0];
        const currentIndex = pages.indexOf(page);
        pages[currentIndex]._$page.trigger('dxclick');
    }
}

import $ from 'jquery';
import RenovatedPager from 'renovation/pager/pager.j.js';
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
    option(name, value) {
        if(!this._useDefaultOptionUpdate) {
            if(name instanceof Object) {
                const { pageIndex, pageSizeChanged, pageIndexChanged, ...restOption } = name;
                if(pageIndex && !this._useDefaultOptionUpdate) {
                    super.option({ pageIndex: pageIndex - 1, ...restOption });
                } else {
                    super.option({ pageIndex, ...restOption });
                }
                if(pageSizeChanged) {
                    super.on('optionChanged', ({ name, value }) => {
                        if(name === 'pageSize') {
                            pageSizeChanged(value);
                        }
                    });
                }
                if(pageIndexChanged) {
                    super.on('optionChanged', ({ name, value }) => {
                        if(name === 'pageIndex') {
                            pageIndexChanged(value + 1);
                        }
                    });
                }
                return;
            }
            if(name === 'pageIndex' && !this._useDefaultOptionUpdate) {
                if(value !== undefined) {
                    super.option(name, value - 1);
                    return;
                } else {
                    const val = super.option(name);
                    return (val || 0) + 1;
                }
            }
        }
        return super.option.apply(this, arguments);
    }
    _dimensionChanged() {
        if(!this.theRoofIsOnFire) {
            this.theRoofIsOnFire = true;
            act(() => resizeCallbacks.fire());
        }
        this.theRoofIsOnFire = false;
    }
    _selectPageByValue(pageIndex) {
        const pages = this._pages;
        const page = pages.filter(({ value }) => value() === pageIndex)[0];
        const currentIndex = pages.indexOf(page);
        pages[currentIndex]._$page.trigger('dxclick');
    }
}

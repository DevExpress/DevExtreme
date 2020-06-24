/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import PagerContentComponent, { PagerContentProps } from '../../../../js/renovation/pager/pager-content';
import PageSizeSelectorComponent from '../../../../js/renovation/pager/page-size-selector';
// import type { PageSizeSelectorPropsType } from '../../../js/renovation/pager/page-size-selector';
import PageIndexSelectorComponent from '../../../../js/renovation/pager/page-index-selector';
import InfoTextComponent from '../../../../js/renovation/pager/info';
import { PAGER_CLASS_FULL, PAGER_PAGES_CLASS, LIGHT_MODE_CLASS } from '../../../../js/renovation/pager/consts';

jest.mock('../../../../js/renovation/select-box', () => { });

describe('PagerContent', () => {
  const render = (props: Partial<PagerContentProps>) => {
    const root = shallow(<PagerContentComponent {...props} />);
    return {
      root,
      // tslint:disable-next-line: object-literal-sort-keys
      container: root,
      pageSize: () => root.find(PageSizeSelectorComponent),
      pageSelectorContainer: () => root.childAt(1),
      pageIndexSelector: () => root.find(PageIndexSelectorComponent),
      infoText: () => root.find(InfoTextComponent),
    };
  };
  it('View, all children', () => {
    const {
      container, pageSize, pageSelectorContainer, pageIndexSelector, infoText,
    } = render({ showInfo: true });
    expect(container.props().className).toBe(PAGER_CLASS_FULL);
    expect(pageSize().props())
      .toMatchObject({ isLargeDisplayMode: true, pageSize: 5, pageSizes: [5, 10] });
    expect(pageSelectorContainer().props().className).toBe(PAGER_PAGES_CLASS);
    expect(pageIndexSelector().props())
      .toMatchObject({ isLargeDisplayMode: true, pageIndex: 0, maxPagesCount: 10 });
    expect(infoText().props()).toMatchObject({
      infoText: 'Page {0} of {1} ({2} items)', pageCount: 10, pageIndex: 0, totalCount: 0,
    });
  });
  it('View, showInfo: false', () => {
    const { infoText } = render({ showInfo: false });
    expect(infoText()).toHaveLength(0);
  });
  it('View, custom infoText', () => {
    const customText = '{0} {1} {2}';
    const { infoText } = render({ showInfo: true, infoText: customText });
    expect(infoText().props()).toMatchObject({
      infoText: customText, pageCount: 10, pageIndex: 0, totalCount: 0,
    });
  });
  it('Logic, className', () => {
    let component = new PagerContentComponent({
      lightModeEnabled: false,
      isLargeDisplayMode: true,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(true);
    expect(component.className.indexOf(LIGHT_MODE_CLASS)).toBe(-1);

    component = new PagerContentComponent({
      lightModeEnabled: true,
      isLargeDisplayMode: true,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(false);
    expect(component.className.indexOf(LIGHT_MODE_CLASS)).not.toBe(-1);
  });
  it('Logic isLargeDisplayMode', () => {
    let component = new PagerContentComponent({
      lightModeEnabled: false,
      isLargeDisplayMode: true,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(true);

    component = new PagerContentComponent({
      lightModeEnabled: true,
      isLargeDisplayMode: true,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(false);

    component = new PagerContentComponent({
      lightModeEnabled: false,
      isLargeDisplayMode: false,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(false);

    component = new PagerContentComponent({
      lightModeEnabled: true,
      isLargeDisplayMode: false,
    } as PagerContentProps);
    expect(component.isLargeDisplayMode).toBe(false);
  });
});

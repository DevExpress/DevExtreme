/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import PageIndexSelector, { PageIndexSelectorProps as Props, PAGER_BUTTON_DISABLE_CLASS } from '../../../js/renovation/pager/page-index-selector';

describe('Page index selector', () => {
  const createViewModel = (props: Props) => new PageIndexSelector(props);
  it('render showNavigationButtons: true, isLargeDisplayMode:true', () => {
    const { nextClassName, prevClassName } = createViewModel({
      isLargeDisplayMode: true, showNavigationButtons: true, pageIndex: 5, pageCount: 10,
    });
    // Vitik: It's impossible to test label because it's label={'Previous Page'} in view function
    // expect(root.find(LightButton)).toHaveLength(2);
    // expect(prevButton().props()).toMatchObject(
    //    { className: 'dx-navigate-button dx-prev-button', label: 'Previous page' });
    // expect(nextButton().props()).toMatchObject(
    //    { className: 'dx-navigate-button dx-next-button', label: 'Next page' });
    expect(nextClassName).toBe('dx-navigate-button dx-next-button');
    expect(prevClassName).toBe('dx-navigate-button dx-prev-button');
  });
  it('render showNavigationButtons: false, isLargeDisplayMode:true', () => {
    const { renderNavButtons } = createViewModel({
      isLargeDisplayMode: true, showNavigationButtons: false, pageIndex: 5, pageCount: 10,
    });
    expect(renderNavButtons).toBeFalsy();
  });
  it('render showNavigationButtons: true, isLargeDisplayMode:false', () => {
    const { renderNavButtons } = createViewModel({
      isLargeDisplayMode: false, showNavigationButtons: true, pageIndex: 5, pageCount: 10,
    });
    expect(renderNavButtons).toBeTruthy();
  });
  // Vitik: It's impossible to reproduce. But it's more generator test.
  // i-t('render change from large to small', () => {
  //     const { root, prevButton, nextButton } = createViewModel(
  //    { isLargeDisplayMode:true, showNavigationButtons: false, pageIndex: 5, pageCount: 10 });
  //     expect(root.find(LightButton)).toHaveLength(0);
  //     root.setProps({ isLargeDisplayMode:false, showNavigationButtons: false });
  //     expect(root.find(LightButton)).toHaveLength(2);
  // });
  it('enable/disable navigation button rtl=false, firstPage', async () => {
    const { nextClassName, prevClassName } = createViewModel({
      rtlEnabled: false,
      pageIndex: 0,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    expect(prevClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
    expect(nextClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
  });
  it('enable/disable navigation button rtl=false, lastPage', async () => {
    const { nextClassName, prevClassName } = createViewModel({
      rtlEnabled: false,
      pageIndex: 9,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    // root.update();
    expect(prevClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
    expect(nextClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
  });
  it('enable/disable navigation button rtl=true, firstPage', async () => {
    const { nextClassName, prevClassName } = createViewModel({
      rtlEnabled: true,
      pageIndex: 0,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    expect(prevClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
    expect(nextClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
  });
  it('enable/disable navigation button rtl=true, lastPage', async () => {
    const { nextClassName, prevClassName } = createViewModel({
      rtlEnabled: true,
      pageIndex: 9,
      pageCount: 10,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    expect(prevClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).not.toBe(-1);
    expect(nextClassName.indexOf(PAGER_BUTTON_DISABLE_CLASS)).toBe(-1);
  });
  it('click to navigation buttons pageIndex = 0', () => {
    const pageIndexChangeHandler = jest.fn();
    const viewModel = createViewModel({
      rtlEnabled: false,
      pageIndex: 0,
      pageCount: 3,
      pageIndexChange: pageIndexChangeHandler,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    viewModel.navigateToPrevPage();
    expect(pageIndexChangeHandler).not.toBeCalled();
    viewModel.navigateToNextPage();
    expect(pageIndexChangeHandler).toBeCalled();
  });
  it('click to navigation buttons pageIndex = pageCount - 1', () => {
    const pageIndexChangeHandler = jest.fn();
    const viewModel = createViewModel({
      rtlEnabled: false,
      pageIndex: 2,
      pageCount: 3,
      pageIndexChange: pageIndexChangeHandler,
      isLargeDisplayMode: true,
      showNavigationButtons: true,
    });
    viewModel.navigateToNextPage();
    expect(pageIndexChangeHandler).not.toBeCalled();
    viewModel.navigateToPrevPage();
    expect(pageIndexChangeHandler).toBeCalled();
  });
});

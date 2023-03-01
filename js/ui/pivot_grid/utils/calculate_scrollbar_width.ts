import domAdapter from '../../../core/dom_adapter';
import callOnce from '../../../core/utils/call_once';

const getScrollbarWidth = (
  containerElement,
): number => containerElement.offsetWidth - containerElement.clientWidth;

const calculateScrollbarWidth = callOnce(() => {
  const document = domAdapter.getDocument();

  document.body.insertAdjacentHTML(
    'beforeend',
    '<div style=\'position: absolute; overflow: scroll; width: 100px; height: 100px; top: -9999px;\'></div>',
  );

  const scrollbar = document.body.lastElementChild;
  const scrollbarWidth = getScrollbarWidth(scrollbar);

  if (scrollbar) {
    document.body.removeChild(scrollbar);
  }

  return scrollbarWidth;
});

export { calculateScrollbarWidth };

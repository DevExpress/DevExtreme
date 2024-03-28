import { SelectableElement } from './SelectableElement';

const CLASS = {
  pagerPage: 'dx-page',
};

export default class NavPage extends SelectableElement {
  constructor(pagerElement: Selector, pageText: string) {
    super(pagerElement.find(`.${CLASS.pagerPage}`).withText(pageText));
  }
}

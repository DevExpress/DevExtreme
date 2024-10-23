import { SelectableElement } from './selectableElement';

const CLASS = {
  paginationPage: 'dx-page',
};

export default class NavPage extends SelectableElement {
  constructor(paginationElement: Selector, pageText: string) {
    super(paginationElement.find(`.${CLASS.paginationPage}`).withText(pageText));
  }
}

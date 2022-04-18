import DropDownList from './internal/dropDownList';

const CLASS = {
  tag: 'dx-tag',
};

export default class TagBox extends DropDownList {
  name = 'dxTagBox';

  tags: Selector;

  constructor(id: string) {
    super(id);

    this.tags = this.element.find(`.${CLASS.tag}`);
  }
}

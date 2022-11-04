import registerComponent from 'devextreme/core/component_registrator';
import { createVNode } from 'inferno';

import { createElement } from 'inferno-create-element';
import render from 'devextreme/core/inferno_renderer';

import BaseComponent from 'devextreme/renovation/component_wrapper/common/component';
import { DxPager } from './generated/components/pager/dxPager';
import { TemplateWrapper } from 'devextreme/renovation/component_wrapper/common/template_wrapper';

import { DxPagerPageNumberItemView, DxPagerPageNumberView } from './generated/components/pager/views';

class RootTemplateWrapper extends TemplateWrapper {
  render() {
    return createVNode(1, "div");
  }
}

export default class Pager extends BaseComponent {
  _initializeComponent() {
    super._initializeComponent();
    this._propsInfo.templates.forEach((template) => {
      this._componentTemplates[template] = this._createTemplateComponent(this._props[template], template);
    });
  }
  _createTemplateComponent(templateOption, templateName) {
    if(templateName === 'pagerView' && templateOption !== null) {
      const template = this._getTemplate(templateOption);
      return (model) => createElement(
        RootTemplateWrapper, { template, model },
      );
    }
    return super._createTemplateComponent(templateOption);
  }
  getProps() {
    return super.getProps();
  }

  get _propsInfo() {
    return {
      twoWay: [['selectedPageSize', 'defaultSelectedPageSize', 'selectedPageSize'], ['selectedPage', 'defaultSelectedPage', 'selectedPageChange'],],
      allowNull: [],
      elements: [],
      templates: ['pagerView', 'pageNumberView', 'pageNumberItemView', 'pageNumberFakeItemView', 'pageSizeItemView'],
      props: ['selectedPage', 'pageCount', 'pageSizes', 'pager', 'pageNumber', 'pageNumberItem', 'pageNumberFakeItem', 'pageSize', 'pageSizeItem'],
    };
  }

  get _viewComponent() {
    return DxPager;
  }
}

registerComponent('dxPager', Pager);

window.DXInfernoTemplateWrapper = render.render;

window.DXViews = {
  'DxPagerPageNumberItemView': (props, containerNode) => {
    render.render(DxPagerPageNumberItemView, { data: props }, containerNode, false)
  },
  'DxPagerPageNumberView': (props, containerNode) => {
    render.render(DxPagerPageNumberView, { data: props }, containerNode, false)
  }
}

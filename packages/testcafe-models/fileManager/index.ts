import Widget from '../internal/widget';
import type { WidgetName } from '../types';

const CLASS = {
  focused: 'dx-state-focused',
  scrollable: 'dx-scrollable',
  scrollableContainer: 'dx-scrollable-container',
  thumbnailsViewPort: 'dx-filemanager-thumbnails-view-port',
  thumbnailItem: 'dx-filemanager-thumbnails-item',
  toolbar: 'dx-filemanager-toolbar',
  toolbarViewModeItem: 'dx-filemanager-toolbar-viewmode-item',
};

export default class FileManager extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxFileManager'; }

  getThumbnailsViewPort() {
    return this.element.find(`.${CLASS.thumbnailsViewPort}`);
  }

  getThumbnailsViewScrollable() {
    return this.getThumbnailsViewPort().find(`.${CLASS.scrollable}`);
  }

  getThumbnailsViewScrollableContainer() {
    return this.getThumbnailsViewScrollable().find(`.${CLASS.scrollableContainer}`);
  }

  getThumbnailsItems() {
    return this.element.find(`.${CLASS.thumbnailItem}`);
  }

  isThumbnailItemFocused(index: number) {
     return this.getThumbnailsItems().nth(index).hasClass(CLASS.focused);
  }

  getToolbar() {
    return this.element.find(`.${CLASS.toolbar}`);
  }

  getToolbarViewModeItem() {
    return this.getToolbar().find(`.${CLASS.toolbarViewModeItem}`);
  }
}

import { virtualScrollingDataControllerExtender } from './extenders/virtual_scrolling_data_controller';
import { resizing, rowsView } from './m_virtual_scrolling';

interface VirtualScrollingModuleOptions {
  scrolling: {
    timeout: number;
    updateTimeout: number;
    minTimeout: number;
    renderingThreshold: number;
    removeInvisiblePages: boolean;
    rowPageSize: number;
    prerenderedRowChunkSize: number;
    mode: string;
    preloadEnabled: boolean;
    rowRenderingMode: string;
    loadTwoPagesOnStart: boolean;
    legacyMode: boolean;
    prerenderedRowCount: number;
  };
}

export const virtualScrollingModule = {
  defaultOptions(): VirtualScrollingModuleOptions {
    return {
      scrolling: {
        timeout: 300,
        updateTimeout: 300,
        minTimeout: 0,
        renderingThreshold: 100,
        removeInvisiblePages: true,
        rowPageSize: 5,
        prerenderedRowChunkSize: 1,
        mode: 'standard',
        preloadEnabled: false,
        rowRenderingMode: 'standard',
        loadTwoPagesOnStart: false,
        legacyMode: false,
        prerenderedRowCount: 1,
      },
    };
  },
  extenders: {
    controllers: {
      data: virtualScrollingDataControllerExtender,
      resizing,
    },
    views: {
      rowsView,
    },
  },
};

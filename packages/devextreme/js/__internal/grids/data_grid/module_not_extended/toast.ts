import { ToastViewController } from '@ts/grids/grid_core/toast/toast_controller';
import { ToastView } from '@ts/grids/grid_core/toast/toast_view';

import gridCore from '../core';

gridCore.registerModule('toast', {
  defaultOptions() {
    return {};
  },
  controllers: {
    toastViewController: ToastViewController,
  },
  views: {
    toastView: ToastView,
  },
});

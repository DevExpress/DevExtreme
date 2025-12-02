import { ToastViewController } from '@ts/grids/grid_core/toast/m_toast_controller';
import { ToastView } from '@ts/grids/grid_core/toast/m_toast_view';

import gridCore from '../m_core';

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

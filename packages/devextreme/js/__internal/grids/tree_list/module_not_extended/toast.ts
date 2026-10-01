import { ToastViewController } from '@ts/grids/grid_core/toast/toast_controller';
import { ToastView } from '@ts/grids/grid_core/toast/toast_view';

import gridCore from '../m_core';

gridCore.registerModule('toast', {
  controllers: {
    toastViewController: ToastViewController,
  },
  views: {
    toastView: ToastView,
  },
});

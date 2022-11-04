import Pager from './pager.j';
import {DxPagerPageSizeView} from './generated/components/pager/views/dxPagerPageSizeView';
import {render} from 'inferno';

const sizeView = (options, element) => {
  const vNode = DxPagerPageSizeView({
    viewModel: options, selectPageSize: () => {
    }
  });
  return render(vNode, element);
}


window.DevExpress = window.DevExpress || {
  ui: {
    dxPager: Pager,
    DxPagerPageSizeView: sizeView
  }
};

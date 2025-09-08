import { ClientFunction } from 'testcafe';
import Overlay from '../overlay/index';

export default class LoadPanel extends Overlay {
    getShadowWidth(): Promise<number> {
        return this.getWrapper().offsetWidth;
    }

    getShadowHeight(): Promise<number> {
        return this.getWrapper().offsetHeight;
    }

    getShadowOffset(): Promise<{ left: number; top: number }> {
        const wrapperElement = this.getWrapper();
    
        return ClientFunction(
          () => ($(wrapperElement()) as any).offset(),
          { dependencies: { wrapperElement } },
        )();
    }
}

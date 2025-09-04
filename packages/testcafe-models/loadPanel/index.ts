import Overlay from '../overlay/index';

export default class LoadPanel extends Overlay {
    getShadowWidth(): Promise<number> {
        return this.getWrapper().offsetWidth;
    }

    getShadowHeight(): Promise<number> {
        return this.getWrapper().offsetHeight;
    }

    getShadowOffset(): Promise<{ left: number; top: number }> {
        return this.getWrapper().boundingClientRect.then(rect => ({
            left: rect.left,
            top: rect.top,
        }));
    }
}

import $ from '../../core/renderer';

const TOAST_CLASS = 'dx-toast';

function hideAllToasts(container) {
    const toasts = $(`.${TOAST_CLASS}`).toArray();
    if(!arguments.length) {
        toasts.forEach(toast => { $(toast).dxToast('hide'); });
        return;
    }

    const containerElement = $(container).get(0);

    toasts
        .map(toast => $(toast).dxToast('instance'))
        .filter(instance => {
            const toastContainerElement = $(instance.option('container')).get(0);
            return containerElement === toastContainerElement && containerElement;
        })
        .forEach(instance => {
            instance.hide();
        });
}

export default hideAllToasts;

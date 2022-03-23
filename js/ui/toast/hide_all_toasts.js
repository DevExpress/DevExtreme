import $ from '../../core/renderer';

function hideAllToasts(container) {
    const containerElement = $(container).get(0);
    const toasts = ($('.dx-toast')).toArray();

    toasts.forEach((toast) => {
        const toastInstance = $(toast).dxToast('instance');
        if(arguments.length) {
            const toastContainerElement = $(toastInstance.option('container')).get(0);
            containerElement && containerElement === toastContainerElement && toastInstance.hide();
        } else {
            toastInstance.hide();
        }
    });
}

export default hideAllToasts;

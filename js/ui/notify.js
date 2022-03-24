import $ from '../core/renderer';
import Action from '../core/action';
import { value as viewPort } from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import { getWindow } from '../core/utils/window';
import Toast from './toast';

const window = getWindow();
let $notify = null;

const notify = function(message, /* optional */ type, displayTime, stackOptions) {
    const options = isPlainObject(message) ? message : { message: message };
    const userHiddenAction = options.onHidden;
    const { enabled = true, containerId = 'stackContainer', direction = 'up', position = 'bottom center' } = stackOptions || {};

    if(enabled) {
        const $container = getStackContainer(containerId);
        setContainerClasses($container, direction);

        options.container = $container;
        options.onShowing = () => setContainerStyles($container, direction, position);
    }

    extend(options, {
        type: type,
        displayTime: displayTime,
        onHidden: function(args) {
            $(args.element).remove();

            new Action(userHiddenAction, {
                context: args.model
            }).execute(arguments);
        }
    });

    $notify = $('<div>').appendTo(viewPort());
    new Toast($notify, options).show();
};

const createStackContainer = (id) => {
    return $('<div>')
        .attr({ id })
        .appendTo(viewPort());
};

const getStackContainer = (id) => {
    const $container = $(`#${id}`);
    return $container.length ? $container : createStackContainer(id);
};

const setContainerClasses = (container, direction) => {
    container
        .removeClass()
        .addClass('dx-toast-container')
        .addClass(`dx-toast-container-${direction}-direction`);
};

const setContainerStyles = (container, direction, position) => {
    const dimensions = {
        toastWidth: container.children().first()[0].offsetWidth,
        toastHeight: container.children().first()[0].offsetHeight,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
    };

    const styles = typeof position === 'string'
        ? getPositionStylesByAlias(direction, position, dimensions)
        : getPositionStylesByCoordinates(direction, position, dimensions);

    container.css(styles);
};

const getCoordinatesByAlias = (alias, { toastWidth, toastHeight, windowHeight, windowWidth }) => {
    switch(alias) {
        case 'top left':
            return { top: 10, left: 10 };
        case 'top right':
            return { top: 10, right: 10 };
        case 'bottom left':
            return { bottom: 10, left: 10 };
        case 'bottom right':
            return { bottom: 10, right: 10 };
        case 'top center':
            return { top: 10, left: Math.round(windowWidth / 2 - toastWidth / 2) };
        case 'left center':
            return { top: Math.round(windowHeight / 2 - toastHeight / 2), left: 10 };
        case 'right center':
            return { top: Math.round(windowHeight / 2 - toastHeight / 2), right: 10 };
        case 'center':
            return {
                top: Math.round(windowHeight / 2 - toastHeight / 2),
                left: Math.round(windowWidth / 2 - toastWidth / 2)
            };
        case 'bottom center':
        default:
            return { bottom: 10, left: Math.round(windowWidth / 2 - toastWidth / 2) };
    }
};

const getPositionStylesByAlias = (direction, position, dimensions) => {
    return getPositionStylesByCoordinates(direction, getCoordinatesByAlias(position, dimensions), dimensions);
};

const getPositionStylesByCoordinates = (direction, position, dimensions) => {
    const { toastWidth, toastHeight, windowHeight, windowWidth } = dimensions;

    switch(direction.replace('-reverse', '')) {
        case 'up':
            return {
                bottom: position.bottom ?? windowHeight - toastHeight - position.top,
                top: '',
                left: position.left ?? '',
                right: position.right ?? '',
            };
        case 'down':
            return {
                top: position.top ?? windowHeight - toastHeight - position.bottom,
                bottom: '',
                left: position.left ?? '',
                right: position.right ?? '',
            };
        case 'left':
            return {
                right: position.right ?? windowWidth - toastWidth - position.left,
                left: '',
                top: position.top ?? '',
                bottom: position.bottom ?? '',
            };
        case 'right':
            return {
                left: position.left ?? windowWidth - toastWidth - position.right,
                right: '',
                top: position.top ?? '',
                bottom: position.bottom ?? '',
            };
    }
};

export default notify;

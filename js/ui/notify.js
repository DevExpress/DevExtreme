import $ from '../core/renderer';
import Action from '../core/action';
import { value } from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import Toast from './toast';
import { getWindow } from '../core/utils/window';
import domAdapter from '../core/dom_adapter';

const window = getWindow();
let $notify = null;

const notify = function(message, /* optional */ type, displayTime, stackOptions) {
    const options = isPlainObject(message) ? message : { message: message };
    const userHiddenAction = options.onHidden;
    const { enabled = true, containerId = 'stackContainer', direction = 'up', position = 'bottom center' } = stackOptions || {};

    if(enabled) {
        const container = getStackContainer(containerId);
        setContainerClasses(container, direction);

        options.container = container;
        options.onShowing = () => setContainerStyles(container, direction, position);
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

    $notify = $('<div>').appendTo(value());
    new Toast($notify, options).show();
};

const createStackContainer = (id) => {
    const newContainer = $('<div>').appendTo($(domAdapter.getBody()));
    newContainer.attr('id', id);

    return newContainer;
};

const getStackContainer = (id) => {
    if($(`#${id}`).length) {
        return $(`#${id}`);
    } else {
        return createStackContainer(id);
    }
};


const setContainerClasses = (container, direction) => {
    container.removeClass();
    container.addClass('dx-toast-container').addClass(`dx-toast-container-${direction}-direction`);
};

const setContainerStyles = (container, direction, position) => {
    const styles = typeof position === 'string'
        ? getPositionStylesByAlias(container, direction, position)
        : getPositionStylesByCoordinates(container, direction, position);

    container.css(styles);
};

const getPositionStylesByAlias = (container, direction, position) => {
    const toastWidth = container.children().first()[0].offsetWidth;
    const toastHeight = container.children().first()[0].offsetHeight;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    switch(position) {
        case 'top left':
            return getPositionStylesByCoordinates(container, direction, { top: 10, left: 10 });
        case 'top right':
            return getPositionStylesByCoordinates(container, direction, { top: 10, right: 10 });
        case 'bottom left':
            return getPositionStylesByCoordinates(container, direction, { bottom: 10, left: 10 });
        case 'bottom right':
            return getPositionStylesByCoordinates(container, direction, { bottom: 10, right: 10 });
        case 'top center':
            return getPositionStylesByCoordinates(container, direction, { top: 10, left: Math.round(windowWidth / 2 - toastWidth / 2) });
        case 'left center':
            return getPositionStylesByCoordinates(container, direction, { top: Math.round(windowHeight / 2 - toastHeight / 2), left: 10 });
        case 'right center':
            return getPositionStylesByCoordinates(container, direction, { top: Math.round(windowHeight / 2 - toastHeight / 2), right: 10 });
        case 'center':
            return getPositionStylesByCoordinates(container, direction, {
                top: Math.round(windowHeight / 2 - toastHeight / 2),
                left: Math.round(windowWidth / 2 - toastWidth / 2)
            });
        case 'bottom center':
        default:
            return getPositionStylesByCoordinates(container, direction, { bottom: 10, left: Math.round(windowWidth / 2 - toastWidth / 2) });
    }
};

const getPositionStylesByCoordinates = (container, direction, position) => {
    const styles = {};
    const toastWidth = container.children().first()[0].offsetWidth;
    const toastHeight = container.children().first()[0].offsetHeight;

    switch(direction.replace('-reverse', '')) {
        case 'up':
            styles.bottom = position.bottom ? position.bottom : `calc(100vh - ${toastHeight}px - ${position.top}px)`;
            styles.top = '';
            styles.left = position.left ? `${position.left}px` : '';
            styles.right = position.right ? `${position.right}px` : '';
            break;
        case 'down':
            styles.top = position.top ? position.top : `calc(100vh - ${toastHeight}px - ${position.bottom}px)`;
            styles.bottom = '';
            styles.left = position.left ? `${position.left}px` : '';
            styles.right = position.right ? `${position.right}px` : '';
            break;
        case 'left':
            styles.right = position.right ? position.right : `calc(100vw - (100vw - 100%) - ${toastWidth}px - ${position.left}px)`;
            styles.left = '';
            styles.top = position.top ? `${position.top}px` : '';
            styles.bottom = position.bottom ? `${position.bottom}px` : '';
            break;
        case 'right':
            styles.left = position.left ? position.left : `calc(100vw - (100vw - 100%) - ${toastWidth}px - ${position.right}px)`;
            styles.right = '';
            styles.top = position.top ? `${position.top}px` : '';
            styles.bottom = position.bottom ? `${position.bottom}px` : '';
            break;
    }

    return styles;
};

export default notify;

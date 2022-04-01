import $ from '../core/renderer';
import Action from '../core/action';
import { value as viewPort } from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import { getWindow } from '../core/utils/window';
import Toast from './toast';

const window = getWindow();
let $notify = null;
const $containers = {};

function notify(message, /* optional */ typeOrStackOptions, displayTime) {
    const options = isPlainObject(message) ? message : { message: message };
    const stackOptions = isPlainObject(typeOrStackOptions) ? typeOrStackOptions : undefined;
    const type = isPlainObject(typeOrStackOptions) ? undefined : typeOrStackOptions;

    const userHiddenAction = options.onHidden;

    if(stackOptions && stackOptions.position) {
        const { position } = stackOptions;
        const direction = stackOptions.direction || getDefaultDirection(position);
        let containerKey = typeof position === 'string'
            ? position
            : JSON.stringify(position).replaceAll(/[{}"]/g, '').replaceAll(/[:,]/g, '-');
        containerKey = containerKey.split(' ').join('-');

        const $container = getStackContainer(containerKey);
        setContainerClasses($container, direction);
        options.container = $container;

        const userShowingAction = options.onShowing;
        options.onShowing = function(args) {
            setContainerStyles($container, direction, position);

            new Action(userShowingAction, {
                context: args.model
            }).execute(arguments);
        };
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
}

const getDefaultDirection = (position) => {
    return typeof position === 'string' && position.includes('top') ? 'down' : 'up';
};

const createStackContainer = (key) => {
    const $container = $('<div>').appendTo(viewPort());
    $containers[key] = $container;

    return $container;
};

const getStackContainer = (key) => {
    const $container = $containers[key];

    return $container ? $container : createStackContainer(key);
};

const setContainerClasses = (container, direction) => {
    container
        .removeClass()
        .addClass('dx-toast-stack')
        .addClass(`dx-toast-stack-${direction}-direction`);
};

const setContainerStyles = (container, direction, position) => {
    const dimensions = {
        toastWidth: container.children().first()[0].offsetWidth,
        toastHeight: container.children().first()[0].offsetHeight,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
    };

    const coordinates = typeof position === 'string' ? getCoordinatesByAlias(position, dimensions) : position;

    const styles = getPositionStylesByCoordinates(direction, coordinates, dimensions);

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

const getPositionStylesByCoordinates = (direction, coordinates, dimensions) => {
    const { toastWidth, toastHeight, windowHeight, windowWidth } = dimensions;

    switch(direction.replace('-reverse', '')) {
        case 'up':
            return {
                bottom: coordinates.bottom ?? windowHeight - toastHeight - coordinates.top,
                top: '',
                left: coordinates.left ?? '',
                right: coordinates.right ?? '',
            };
        case 'down':
            return {
                top: coordinates.top ?? windowHeight - toastHeight - coordinates.bottom,
                bottom: '',
                left: coordinates.left ?? '',
                right: coordinates.right ?? '',
            };
        case 'left':
            return {
                right: coordinates.right ?? windowWidth - toastWidth - coordinates.left,
                left: '',
                top: coordinates.top ?? '',
                bottom: coordinates.bottom ?? '',
            };
        case 'right':
            return {
                left: coordinates.left ?? windowWidth - toastWidth - coordinates.right,
                right: '',
                top: coordinates.top ?? '',
                bottom: coordinates.bottom ?? '',
            };
    }
};

///#DEBUG
Object.setPrototypeOf(notify, {
    _resetContainers: function() {
        Object.keys($containers).forEach(key => delete $containers[key]);
    }
});
///#ENDDEBUG

export default notify;

import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isPlainObject, isString } from '@js/core/utils/type';
import { value as viewPort } from '@js/core/utils/view_port';
import { getWindow } from '@js/core/utils/window';
import type {
  HiddenEvent,
  Properties as ToastProperties,
  ShowingEvent,
} from '@js/ui/toast';
import Toast from '@js/ui/toast';

type DefaultDirection = 'down-push' | 'up-push';

type NotifyType = 'info' | 'warning' | 'error' | 'success';

interface Dimensions {
  toastWidth: number;
  toastHeight: number;
  windowHeight: number;
  windowWidth: number;
}

interface NotifyCoordinates {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface PositionStyles {
  top: number | string;
  bottom: number | string;
  left: number | string;
  right: number | string;
}

type CoordinateFunction = (dimensions: Dimensions) => NotifyCoordinates;
type PositionStylesFunction = (
  coordinates: NotifyCoordinates,
  dimensions: Dimensions,
) => PositionStyles;

const window = getWindow();

let $notify: dxElementWrapper | null = null;

const $containers: Record<string, dxElementWrapper> = {};

const COORDINATE_ALIASES: Record<string, NotifyCoordinates | CoordinateFunction> = {
  'top left': { top: 10, left: 10 },
  'top right': { top: 10, right: 10 },
  'bottom left': { bottom: 10, left: 10 },
  'bottom right': { bottom: 10, right: 10 },
  'top center': (dimensions: Dimensions): NotifyCoordinates => ({
    top: 10,
    left: Math.round(dimensions.windowWidth / 2 - dimensions.toastWidth / 2),
  }),
  'left center': (dimensions: Dimensions): NotifyCoordinates => ({
    top: Math.round(dimensions.windowHeight / 2 - dimensions.toastHeight / 2),
    left: 10,
  }),
  'right center': (dimensions: Dimensions): NotifyCoordinates => ({
    top: Math.round(dimensions.windowHeight / 2 - dimensions.toastHeight / 2),
    right: 10,
  }),
  center: (dimensions: Dimensions): NotifyCoordinates => ({
    top: Math.round(dimensions.windowHeight / 2 - dimensions.toastHeight / 2),
    left: Math.round(dimensions.windowWidth / 2 - dimensions.toastWidth / 2),
  }),
  'bottom center': (dimensions: Dimensions): NotifyCoordinates => ({
    bottom: 10,
    left: Math.round(dimensions.windowWidth / 2 - dimensions.toastWidth / 2),
  }),
};

const POSITION_STYLES_MAP: Record<string, PositionStylesFunction> = {
  up: (coordinates: NotifyCoordinates, dimensions: Dimensions): PositionStyles => ({
    bottom: coordinates.bottom
      ?? dimensions.windowHeight - dimensions.toastHeight - (coordinates.top ?? 0),
    top: '',
    left: coordinates.left ?? '',
    right: coordinates.right ?? '',
  }),
  down: (coordinates: NotifyCoordinates, dimensions: Dimensions): PositionStyles => ({
    top: coordinates.top
      ?? dimensions.windowHeight - dimensions.toastHeight - (coordinates.bottom ?? 0),
    bottom: '',
    left: coordinates.left ?? '',
    right: coordinates.right ?? '',
  }),
  left: (coordinates: NotifyCoordinates, dimensions: Dimensions): PositionStyles => ({
    right: coordinates.right
      ?? dimensions.windowWidth - dimensions.toastWidth - (coordinates.left ?? 0),
    left: '',
    top: coordinates.top ?? '',
    bottom: coordinates.bottom ?? '',
  }),
  right: (coordinates: NotifyCoordinates, dimensions: Dimensions): PositionStyles => ({
    left: coordinates.left
      ?? dimensions.windowWidth - dimensions.toastWidth - (coordinates.right ?? 0),
    right: '',
    top: coordinates.top ?? '',
    bottom: coordinates.bottom ?? '',
  }),
};

const getDefaultDirection = (position: string | NotifyCoordinates): DefaultDirection => {
  const condition = isString(position) && position.includes('top');

  return condition ? 'down-push' : 'up-push';
};

const createStackContainer = (key: string): dxElementWrapper => {
  const $container = $('<div>').appendTo(viewPort());

  $containers[key] = $container;

  return $container;
};

const getStackContainer = (key: string): dxElementWrapper => {
  const $container = $containers[key];

  return $container || createStackContainer(key);
};

const setContainerClasses = (container: dxElementWrapper, direction: string): void => {
  const containerClasses = `dx-toast-stack dx-toast-stack-${direction}-direction`;
  container.removeAttr('class').addClass(containerClasses);
};

const getNotifyCoordinatesByAlias = (alias: string, dimensions: Dimensions): NotifyCoordinates => {
  const coordinate = alias
    ? COORDINATE_ALIASES[alias]
    : COORDINATE_ALIASES['bottom center'];

  return typeof coordinate === 'function' ? coordinate(dimensions) : coordinate;
};

const getPositionStylesByNotifyCoordinates = (
  direction: string,
  coordinates: NotifyCoordinates,
  dimensions: Dimensions,
): PositionStyles => {
  const directionKey = direction.replace(/-push|-stack/g, '');
  const styleFunction = POSITION_STYLES_MAP[directionKey];

  return styleFunction ? styleFunction(coordinates, dimensions) : {
    top: '',
    bottom: '',
    left: '',
    right: '',
  };
};

const setContainerStyles = (
  container: dxElementWrapper,
  direction: string,
  position: string | NotifyCoordinates,
): void => {
  const {
    // @ts-expect-error 'offsetWidth' does not exist on type 'Element'
    offsetWidth: toastWidth,
    // @ts-expect-error 'offsetHeight' does not exist on type 'Element'
    offsetHeight: toastHeight,
  } = container.children().first().get(0);

  const dimensions: Dimensions = {
    toastWidth,
    toastHeight,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  };

  const coordinates = isString(position)
    ? getNotifyCoordinatesByAlias(position, dimensions)
    : position;

  const styles = getPositionStylesByNotifyCoordinates(direction, coordinates, dimensions);

  container.css(styles);
};

const getToastOptions = (
  message: ToastProperties | string,
  typeOrStack?: NotifyType,
  displayTime?: number,
): ToastProperties => {
  const userOptions = isPlainObject(message) ? message : { message };

  const stack = isPlainObject(typeOrStack) ? typeOrStack : undefined;
  const type = isPlainObject(typeOrStack) ? undefined : typeOrStack;

  const {
    onHidden: userOnHidden,
    onShowing: userOnShowing,
  } = userOptions;

  const defaultConfiguration: Partial<ToastProperties> = {
    onHidden: (e: HiddenEvent): void => {
      $(e.element).remove();
      userOnHidden?.(e);
    },
  };

  if (type !== undefined) {
    defaultConfiguration.type = type;
  }

  if (displayTime !== undefined) {
    defaultConfiguration.displayTime = displayTime;
  }

  if (stack?.position) {
    const { position } = stack;

    const direction = stack.direction || getDefaultDirection(position);

    const containerKey = isString(position)
      ? position
      : `${position.top}-${position.left}-${position.bottom}-${position.right}`;

    const $container = getStackContainer(containerKey);

    setContainerClasses($container, direction);

    const options = {
      ...userOptions,
      ...defaultConfiguration,
      container: $container,
      _skipContentPositioning: true,
      onShowing: (e: ShowingEvent): void => {
        setContainerStyles($container, direction, position);
        userOnShowing?.(e);
      },
    };

    return options;
  }

  const options = {
    ...userOptions,
    ...defaultConfiguration,
  };

  return options;
};

const notify = (
  message: ToastProperties | string,
  typeOrStack?: NotifyType,
  displayTime?: number,
): void => {
  const options = getToastOptions(message, typeOrStack, displayTime);

  $notify = $('<div>').appendTo(viewPort());

  // @ts-expect-error Toast constructor accepts jQuery element
  const toast = new Toast($notify, options);

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  toast.show();
};

/// #DEBUG
Object.setPrototypeOf(notify, {
  _resetContainers() {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys($containers).forEach((key) => delete $containers[key]);
  },
});
/// #ENDDEBUG

export default notify;

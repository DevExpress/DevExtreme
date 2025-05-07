import Emitter from '@js/common/core/events/core/emitter';
import registerEmitter from '@js/common/core/events/core/emitter_registrator';
import { hasTouches } from '@js/common/core/events/utils/index';
import * as iteratorUtils from '@js/core/utils/iterator';
import { fitIntoRange, sign as mathSign } from '@js/core/utils/math';

interface EventAlias {
  name: string;
  args: any;
}

const DX_PREFIX = 'dx';

const TRANSFORM = 'transform';
const TRANSLATE = 'translate';
const PINCH = 'pinch';
const ROTATE = 'rotate';

const START_POSTFIX = 'start';
const UPDATE_POSTFIX = '';
const END_POSTFIX = 'end';

const eventAliases: EventAlias[] = [];
const addAlias = function (eventName, eventArgs) {
  eventAliases.push({
    name: eventName,
    args: eventArgs,
  });
};

addAlias(TRANSFORM, {
  scale: true,
  deltaScale: true,
  rotation: true,
  deltaRotation: true,
  translation: true,
  deltaTranslation: true,
});

addAlias(TRANSLATE, {
  translation: true,
  deltaTranslation: true,
});

addAlias(PINCH, {
  scale: true,
  deltaScale: true,
});

addAlias(ROTATE, {
  rotation: true,
  deltaRotation: true,
});

const getVector = function (first, second) {
  return {
    x: second.pageX - first.pageX,
    y: -second.pageY + first.pageY,
    centerX: (second.pageX + first.pageX) * 0.5,
    centerY: (second.pageY + first.pageY) * 0.5,
  };
};

const getEventVector = function (e) {
  const { pointers } = e;

  return getVector(pointers[0], pointers[1]);
};

const getDistance = function (vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

const getScale = function (firstVector, secondVector) {
  return getDistance(firstVector) / getDistance(secondVector);
};

const getRotation = function (firstVector, secondVector) {
  const scalarProduct = firstVector.x * secondVector.x + firstVector.y * secondVector.y;
  const distanceProduct = getDistance(firstVector) * getDistance(secondVector);

  if (distanceProduct === 0) {
    return 0;
  }

  const sign = mathSign(firstVector.x * secondVector.y - secondVector.x * firstVector.y);
  const angle = Math.acos(fitIntoRange(scalarProduct / distanceProduct, -1, 1));

  return sign * angle;
};

const getTranslation = function (firstVector, secondVector) {
  return {
    x: firstVector.centerX - secondVector.centerX,
    y: firstVector.centerY - secondVector.centerY,
  };
};

const TransformEmitter = Emitter.inherit({

  validatePointers(e) {
    return hasTouches(e) > 1;
  },

  start(e) {
    this._accept(e);

    const startVector = getEventVector(e);
    this._startVector = startVector;
    this._prevVector = startVector;

    this._fireEventAliases(START_POSTFIX, e);
  },

  move(e) {
    const currentVector = getEventVector(e);
    const eventArgs = this._getEventArgs(currentVector);

    this._fireEventAliases(UPDATE_POSTFIX, e, eventArgs);
    this._prevVector = currentVector;
  },

  end(e) {
    const eventArgs = this._getEventArgs(this._prevVector);
    this._fireEventAliases(END_POSTFIX, e, eventArgs);
  },

  _getEventArgs(vector) {
    return {
      scale: getScale(vector, this._startVector),
      deltaScale: getScale(vector, this._prevVector),
      rotation: getRotation(vector, this._startVector),
      deltaRotation: getRotation(vector, this._prevVector),
      translation: getTranslation(vector, this._startVector),
      deltaTranslation: getTranslation(vector, this._prevVector),
    };
  },

  _fireEventAliases(eventPostfix, originalEvent, eventArgs) {
    eventArgs = eventArgs || {};

    iteratorUtils.each(eventAliases, (_, eventAlias) => {
      const args = {};
      iteratorUtils.each(eventAlias.args, (name) => {
        if (name in eventArgs) {
          args[name] = eventArgs[name];
        }
      });

      this._fireEvent(DX_PREFIX + eventAlias.name + eventPostfix, originalEvent, args);
    });
  },

});

const eventNames = eventAliases.reduce((result: string[], eventAlias) => {
  [START_POSTFIX, UPDATE_POSTFIX, END_POSTFIX].forEach((eventPostfix) => {
    result.push(DX_PREFIX + eventAlias.name + eventPostfix);
  });
  return result;
}, []);

registerEmitter({
  emitter: TransformEmitter,
  events: eventNames,
});
const exportNames: Record<string, any> = {};
iteratorUtils.each(eventNames, (_, eventName: string) => {
  exportNames[eventName.substring(DX_PREFIX.length)] = eventName;
});

export { exportNames };

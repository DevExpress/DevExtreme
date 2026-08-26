import { hasTouches } from '@js/common/core/events/utils/index';
import * as iteratorUtils from '@js/core/utils/iterator';
import { fitIntoRange, sign as mathSign } from '@js/core/utils/math';
import type { EmitterEvent, EmitterEventPointer } from '@ts/events/core/m_emitter';
import Emitter from '@ts/events/core/m_emitter';
import registerEmitter from '@ts/events/core/m_emitter_registrator';

interface EventAlias {
  name: string;
  args: Record<string, boolean>;
}

interface TransformVector {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
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
const addAlias = function (eventName: string, eventArgs: Record<string, boolean>): void {
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

const getVector = function (first: EmitterEventPointer, second: EmitterEventPointer): TransformVector {
  return {
    x: second.pageX - first.pageX,
    y: -second.pageY + first.pageY,
    centerX: (second.pageX + first.pageX) * 0.5,
    centerY: (second.pageY + first.pageY) * 0.5,
  };
};

const getEventVector = function (e: EmitterEvent): TransformVector {
  const pointers = e.pointers as EmitterEventPointer[];

  return getVector(pointers[0], pointers[1]);
};

const getDistance = function (vector: TransformVector): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
};

const getScale = function (firstVector: TransformVector, secondVector: TransformVector): number {
  return getDistance(firstVector) / getDistance(secondVector);
};

const getRotation = function (firstVector: TransformVector, secondVector: TransformVector): number {
  const scalarProduct = firstVector.x * secondVector.x + firstVector.y * secondVector.y;
  const distanceProduct = getDistance(firstVector) * getDistance(secondVector);

  if (distanceProduct === 0) {
    return 0;
  }

  const sign = mathSign(firstVector.x * secondVector.y - secondVector.x * firstVector.y);
  const angle = Math.acos(fitIntoRange(scalarProduct / distanceProduct, -1, 1));

  return sign * angle;
};

const getTranslation = function (firstVector: TransformVector, secondVector: TransformVector): { x: number; y: number } {
  return {
    x: firstVector.centerX - secondVector.centerX,
    y: firstVector.centerY - secondVector.centerY,
  };
};

class TransformEmitter extends Emitter {
  _startVector!: TransformVector;

  _prevVector!: TransformVector;

  validatePointers(e: EmitterEvent): boolean {
    return hasTouches(e) > 1;
  }

  start(e: EmitterEvent): void {
    this._accept(e);

    const startVector = getEventVector(e);
    this._startVector = startVector;
    this._prevVector = startVector;

    this._fireEventAliases(START_POSTFIX, e);
  }

  move(e: EmitterEvent): void {
    const currentVector = getEventVector(e);
    const eventArgs = this._getEventArgs(currentVector);

    this._fireEventAliases(UPDATE_POSTFIX, e, eventArgs);
    this._prevVector = currentVector;
  }

  end(e: EmitterEvent): void {
    const eventArgs = this._getEventArgs(this._prevVector);
    this._fireEventAliases(END_POSTFIX, e, eventArgs);
  }

  _getEventArgs(vector: TransformVector): Record<string, unknown> {
    return {
      scale: getScale(vector, this._startVector),
      deltaScale: getScale(vector, this._prevVector),
      rotation: getRotation(vector, this._startVector),
      deltaRotation: getRotation(vector, this._prevVector),
      translation: getTranslation(vector, this._startVector),
      deltaTranslation: getTranslation(vector, this._prevVector),
    };
  }

  _fireEventAliases(eventPostfix: string, originalEvent: EmitterEvent, eventArgs?: Record<string, unknown>): void {
    const args: Record<string, unknown> = eventArgs ?? {};

    iteratorUtils.each(eventAliases, (_, eventAlias) => {
      const aliasArgs: Record<string, unknown> = {};
      iteratorUtils.each(eventAlias.args, (name) => {
        if (name in args) {
          aliasArgs[name] = args[name];
        }
      });

      this._fireEvent(DX_PREFIX + eventAlias.name + eventPostfix, originalEvent, aliasArgs);
    });
  }
}

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
const exportNames: Record<string, string> = {};
iteratorUtils.each(eventNames, (_, eventName: string) => {
  exportNames[eventName.substring(DX_PREFIX.length)] = eventName;
});

export { exportNames };

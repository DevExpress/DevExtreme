import callbacks from '@js/common/core/events/core/event_registrator_callbacks';
import { each } from '@js/core/utils/iterator';

const registerEvent = function (name, eventObject) {
  const strategy: any = {};

  if ('noBubble' in eventObject) {
    strategy.noBubble = eventObject.noBubble;
  }

  if ('bindType' in eventObject) {
    strategy.bindType = eventObject.bindType;
  }

  if ('delegateType' in eventObject) {
    strategy.delegateType = eventObject.delegateType;
  }

  each(['setup', 'teardown', 'add', 'remove', 'trigger', 'handle', '_default', 'dispose'], (_, methodName) => {
    if (!eventObject[methodName]) {
      return;
    }

    strategy[methodName] = function () {
      const args: any = [].slice.call(arguments);
      args.unshift(this);
      return eventObject[methodName].apply(eventObject, args);
    };
  });

  callbacks.fire(name, strategy);
};
registerEvent.callbacks = callbacks;

export default registerEvent;

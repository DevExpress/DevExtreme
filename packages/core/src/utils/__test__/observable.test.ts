import { createObservableEmitter } from '../observable';

describe('core', () => {
  describe('utils', () => {
    describe('observable', () => {
      interface Observed {
        value: number
      }

      it('Emits same value to all subscribers', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });

        let firstResult;
        let secondResult;
        observable.subscribe((value) => { firstResult = value; });
        observable.subscribe((value) => { secondResult = value; });
        observable.emit(testValue);

        expect(firstResult === secondResult).toBeTruthy();
      });

      it('Calls all subscribers on each emit', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscribers = [jest.fn(), jest.fn(), jest.fn(), jest.fn()];

        observable.subscribe(spySubscribers[0]);
        observable.subscribe(spySubscribers[1]);
        observable.subscribe(spySubscribers[2]);
        observable.subscribe(spySubscribers[3]);
        observable.emit(testValue);
        observable.emit(testValue);

        spySubscribers.forEach((spy) => {
          expect(spy).toHaveBeenCalledTimes(2);
        });
      });

      it('Shouldn\'t call subscribers after unsubscribe', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscriber = jest.fn();

        const unsubscribe = observable.subscribe(spySubscriber);
        observable.emit(testValue);
        unsubscribe();
        observable.emit(testValue);

        expect(spySubscriber).toHaveBeenCalledTimes(1);
      });

      it('Emits new values for not unsubscribed subscribers', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscriberFirst = jest.fn();
        const spySubscriberSecond = jest.fn();

        const unsubscribe = observable.subscribe(spySubscriberFirst);
        observable.subscribe(spySubscriberSecond);
        unsubscribe();
        observable.emit(testValue);
        observable.emit(testValue);

        expect(spySubscriberSecond).toHaveBeenCalledTimes(2);
      });

      it('Handles the same function passed to subscribe multiple times', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscriber = jest.fn();

        observable.subscribe(spySubscriber);
        observable.subscribe(spySubscriber);
        observable.subscribe(spySubscriber);
        observable.emit(testValue);

        expect(spySubscriber).toHaveBeenCalledTimes(1);
      });

      it('Should correctly unsubscribe the same function passed to subscribe multiple times', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscriber = jest.fn();

        const unsubscribe = observable.subscribe(spySubscriber);
        observable.subscribe(spySubscriber);
        observable.subscribe(spySubscriber);
        unsubscribe();
        observable.emit(testValue);

        expect(spySubscriber).not.toHaveBeenCalled();
      });

      it('Emits new values to resubscribed function', () => {
        const testValue: Observed = { value: 2 };
        const observable = createObservableEmitter<Observed>({ value: 0 });
        const spySubscriber = jest.fn();

        const unsubscribe = observable.subscribe(spySubscriber);
        observable.subscribe(spySubscriber);
        observable.emit(testValue);
        unsubscribe();
        observable.subscribe(spySubscriber);
        observable.emit(testValue);

        expect(spySubscriber).toHaveBeenCalledTimes(2);
      });

      it('stores initial value', () => {
        const initialValue = {};

        const observable = createObservableEmitter(initialValue);

        expect(observable.getValue()).toBe(initialValue);
      });

      it('stores emitted value', () => {
        const emittedValue = {};
        const observable = createObservableEmitter({});

        observable.emit(emittedValue);

        expect(observable.getValue()).toBe(emittedValue);
      });
    });
  });
});

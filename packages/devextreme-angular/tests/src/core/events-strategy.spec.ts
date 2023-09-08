import { NgEventsStrategy } from 'devextreme-angular';

describe('Events strategy API', () => {
    it('should allow to pass object with event handlers in the "on" method', () => {
        const eventsStrategy = new NgEventsStrategy({}, null);
        const handlers = [
            jasmine.createSpy('first'),
            jasmine.createSpy('second'),
            jasmine.createSpy('third')
        ];

        eventsStrategy.on({
            firstEvent: handlers[0],
            secondEvent: handlers[1],
            thirdEvent: handlers[2]
        });

        eventsStrategy.fireEvent('firstEvent', []);
        expect(handlers[0]).toHaveBeenCalled();

        eventsStrategy.fireEvent('secondEvent', []);
        expect(handlers[1]).toHaveBeenCalled();

        eventsStrategy.fireEvent('thirdEvent', []);
        expect(handlers[2]).toHaveBeenCalled();
    });
});

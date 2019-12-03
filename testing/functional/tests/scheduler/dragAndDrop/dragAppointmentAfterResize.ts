import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Drag-n-drop appointment after resize(T835545)`
    .page(url(__dirname, '../../container.html'));

["day", "week", "month", "timelineDay", "timelineWeek", "timelineMonth"].forEach(view => test(
    `After drag-n-drop appointment, size of appointment shouldn't change in the '${view}' view`, async t => {
    const scheduler = new Scheduler("#container");
    const { element, resizableHandle } = scheduler.getAppointment("app");

    const initSize = {
        width: await element.clientWidth,
        height: await element.clientHeight
    };

    const isVertical = await resizableHandle.bottom.count !== 0;

    await t
        .drag(isVertical ? resizableHandle.bottom : resizableHandle.right, 50, 50);

    await t.expect(isVertical ? await element.clientHeight : await element.clientWidth)
        .gt(isVertical ? initSize.height : initSize.width);

    const sizeBeforeDrag = {
        width: await element.clientWidth,
        height: await element.clientHeight
    };
    const positionBeforeDrag = {
        left: await element.clientLeft,
        top: await element.clientTop
    };

    await t
        .drag(element, 10, 10, {
            offsetX: 0,
            offsetY: 0
        });

    await t
        .expect(sizeBeforeDrag.width)
        .eql(await element.clientWidth)

        .expect(sizeBeforeDrag.height)
        .eql(await element.clientHeight)

        .expect(positionBeforeDrag.left)
        .eql(await element.clientLeft)

        .expect(positionBeforeDrag.top)
        .eql(await element.clientTop)

}).before(() => createScheduler({
    views: [view],
    currentView: view,
    startDayHour: 9,
    currentDate: new Date(2017, 4, 1),
    dataSource: [{
        text: `app`,
        startDate: new Date(2017, 4, 1, 9, 0),
        endDate: new Date(2017, 4, 1, 10, 0),
    }]
})));

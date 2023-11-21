import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { Themes } from '../../../../helpers/themes';
import { changeTheme } from '../../../../helpers/changeTheme';
import {
  insertStylesheetRulesToPage,
  removeStylesheetRulesFromPage,
} from '../../../../helpers/domUtils';

fixture.disablePageReloads`Layout:Templates:CellTemplate`
  .page(url(__dirname, '../../../container.html'));

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'timelineMonth'].forEach((currentView) => {
  test(`dataCellTemplate and dateCellTemplate layout should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`data-cell-template-currentView=${currentView}.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      showAllDayPanel: false,
      dataCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxDateBox({
        type: 'time',
        value: itemData.startDate,
      })),
      dateCellTemplate: ClientFunction((itemData) => ($('<div />') as any).dxTextBox({
        value: new Intl.DateTimeFormat('en-US').format(itemData.date),
      })),
      height: 600,
    });
  });
});

const customClasses = `
.disable-date {
  background-image:
    repeating-linear-gradient(
      135deg,
      rgba(244, 67, 54, 0.1),
      rgba(244, 67, 54, 0.1) 4px,
      transparent 4px,
      transparent 9px
    );
  color: #9b6467;
}

.dinner {
  background: rgba(255, 193, 7, 0.2);
}

.disable-date, .dinner {
  height: 100%;
  width: 100%;
}`;

[
  Themes.genericLight,
  Themes.materialBlue,
  Themes.fluentBlue,
].forEach((theme) => {
  test(`There is no paddings at root cell element in ${theme}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`cell-template-in-${theme}.png`, scheduler.workSpace))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
    await insertStylesheetRulesToPage(customClasses);

    return createWidget('dxScheduler', {
      dataSource: [],
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 27),
      firstDayOfWeek: 0,
      startDayHour: 9,
      endDayHour: 19,
      showAllDayPanel: false,
      height: 730,

      dataCellTemplate: ClientFunction((itemData, itemIndex, itemElement) => {
        const date = itemData.startDate;
        const hours = date.getHours();
        const element = $('<div />');

        if (date.getDate() === 29) {
          element.addClass('disable-date');
        } else if (hours > 12 && hours < 14) {
          element.addClass('dinner');
        }

        return itemElement.append(element);
      }),

      dateCellTemplate: ClientFunction((itemData, itemIndex, itemElement) => {
        const element = $(`<div>${itemData.text}</div>`);

        if (itemData.date.getDate() === 29) {
          element.addClass('disable-date');
        }

        return itemElement.append(element);
      }),
    });
  }).after(async () => {
    await changeTheme('generic.light');
    await removeStylesheetRulesFromPage();
  });
});

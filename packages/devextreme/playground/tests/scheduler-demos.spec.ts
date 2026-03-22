import { test, expect } from '@playwright/test';

const schedulerDemos = [
    'Overview', 'BasicViews', 'SimpleArray', 'Agenda', 'Timelines',
    'GroupingByResources', 'GroupByDate', 'RecurringAppointments', 'Editing',
    'DragAndDrop', 'ResolveTimeConflicts', 'AppointmentOverlapping',
    'AppointmentCountPerCell', 'CustomViewDuration', 'IndividualViewsCustomization',
    'CellTemplates', 'Templates', 'CurrentTimeIndicator', 'AllDayPanelMode',
    'VirtualScrolling', 'TimeZonesSupport', 'Resources', 'Toolbar',
    'ContextMenu', 'Adaptability', 'WorkShifts',
];

for (const name of schedulerDemos) {
    test(`Scheduler/${name}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(`/demos/Scheduler/${name}/`);
        await page.waitForTimeout(2000);

        expect(errors, `Errors in Scheduler/${name}:\n${errors.join('\n')}`).toHaveLength(0);
    });
}

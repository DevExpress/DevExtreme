import * as testingLib from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Scheduler } from '../../../scheduler';

describe('Scheduler component', () => {
    beforeEach(() => {
        jest.useRealTimers();
    });

    afterEach(() => {
        testingLib.cleanup();
        jest.useFakeTimers();
    });

    it('T1311967: re-renders dateCellRender content after navigation', async () => {
        const currentDate = new Date(2025, 2, 28);
        const data = [
            {
                text: 'Test Appointment',
                startDate: new Date('2025-03-29T10:00:00'),
                endDate: new Date('2025-03-29T11:00:00'),
            },
        ];

        const user = userEvent.setup({ delay: null });

        const dateCellRender = (cellData: any) => {
            const date = new Date(cellData.date);
            return <div className='custom-cell-marker'>Day {date.getDate()}</div>;
        };

        testingLib.render(
            <Scheduler
                timeZone="America/Los_Angeles"
                dataSource={data}
                defaultCurrentView="week"
                defaultCurrentDate={currentDate}
                dateCellRender={dateCellRender}
                startDayHour={9}
            />,
        );

        await testingLib.waitFor(() => {
            const cells = document.querySelectorAll('.custom-cell-marker');
            const hasMarchDates = Array.from(cells).some((cell) => cell.textContent?.includes('Day 28') ?? cell.textContent?.includes('Day 29'));
            expect(hasMarchDates).toBe(true);
        });

        const nextButton = await testingLib.waitFor(() => {
            const btn = document.querySelector('[aria-label="Next page"]') as HTMLElement;
            expect(btn).toBeDefined();
            return btn;
        });
        await user.click(nextButton);

        await testingLib.waitFor(() => {
            const cells = document.querySelectorAll('.custom-cell-marker');
            const hasAprilDates = Array.from(cells).some((cell) => cell.textContent?.includes('Day 4') ?? cell.textContent?.includes('Day 5'));
            expect(hasAprilDates).toBe(true);
        });
    });
});

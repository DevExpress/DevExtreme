import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { createScheduler } from './init/widget.setup';
import { primaryDataSource } from './init/widget.data';


import { appointmentIds, dragAndDropCells } from './init/appointment.map';
import { dragAndDropTest } from './init/dragAndDrop';

fixture`Behaviour dragging between cells in the timelineDayView-mode`.page(getContainerFileUrl());

test('Appointments in the timelineDayView-mode should be replaced on the timeline with maintaining their size and duration', async t => {
    for (let appointmentId of appointmentIds) {
        for (let cellId of dragAndDropCells) {
            await dragAndDropTest(t, appointmentId, `Primary #${appointmentId}`, 0, cellId);
        }
    }

}).before(async () => { await createScheduler('timelineDay', primaryDataSource) });

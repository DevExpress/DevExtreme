import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { createScheduler } from './init/widget.setup';
import { dataSource } from './init/widget.data';


import { appointmentIds, dragAndDropRows, lastRow } from './init/appointment.map';
import { dragAndDropTest } from './init/dragAndDrop';

fixture`Behaviour dragging between scheduler cells in the weekView-mode`.page(getContainerFileUrl());

test('Appointments in the weekView-mode should be replaced on the timeline with maintaining their size and duration', async t => {
    const lastCell = 6;
    for (let appointmentId of appointmentIds) {
        for (let rowId of dragAndDropRows) {
            const inverseRowId = lastRow - rowId;

            await dragAndDropTest(t, appointmentId, `Primary #${appointmentId}`, rowId, lastCell);
            await dragAndDropTest(t, appointmentId, `Primary #${appointmentId}`, rowId);

            await dragAndDropTest(t, appointmentId, `Secondary #${appointmentId}`, inverseRowId);
            await dragAndDropTest(t, appointmentId, `Secondary #${appointmentId}`, inverseRowId, lastCell);
        }
    }

}).before(async () => { await createScheduler('week', dataSource) });

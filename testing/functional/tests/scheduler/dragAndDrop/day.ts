import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { createScheduler } from './init/widget.setup';
import { dataSource } from './init/widget.data';


import { appointmentIds, dragAndDropRows, lastRow } from './init/appointment.map';
import { dragAndDropTest } from './init/dragAndDrop';

fixture`Behaviour dragging between cells in the dayView-mode`.page(getContainerFileUrl());

test('Appointments in the dayView-mode should be replaced on the timeline with maintaining their size and duration', async t => {
    for (let appointmentId of appointmentIds) {
        for (let rowId of dragAndDropRows) {
            const inverseRowId = lastRow - rowId;

            await dragAndDropTest(t, appointmentId, `Primary #${appointmentId}`, rowId);
            await dragAndDropTest(t, appointmentId, `Secondary #${appointmentId}`, inverseRowId);
        }
    }

}).before(async () => { await createScheduler('day', dataSource) });

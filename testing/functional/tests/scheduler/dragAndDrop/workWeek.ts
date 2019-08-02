import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import { TablePosition, Feature } from './helpers/appointment.helper';
import { AppointmentModel } from './helpers/appointment.model';

import { movementMap } from './map/workWeek.map';

fixture
    `Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`.page(getContainerFileUrl());

test('Rearrange appointments with the drag-and-drop gesture in WorkWeek mode', async t => {
    for (let item of movementMap) {
        for (let step of item.features) {
            let appointment = new AppointmentModel(item.title, step);

            await appointment.dropTo(t, new TablePosition(step.position.row, step.position.cell));
            await appointment.compare(t, [Feature.height, Feature.startTime, Feature.endTime]);
        }
    }

}).before(async () => { await createScheduler('workWeek', dataSource) });

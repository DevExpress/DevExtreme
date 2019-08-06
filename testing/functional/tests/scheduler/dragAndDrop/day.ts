import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import { TablePosition, Feature } from './helpers/appointment.helper';
import { AppointmentModel } from './helpers/appointment.model';

import { movementMap } from './map/day.map';

fixture`Rearrange appointments in the Scheduler widget for basic views with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in Day view', async t => {
    for (let item of movementMap) {
        for (let feature of item.features) {
            let appointment = new AppointmentModel(item.title, feature);

            await appointment.dropTo(t, new TablePosition(feature.position.row, 0));
            await appointment.compare(t, [Feature.height, Feature.startTime, Feature.endTime]);
        }
    }

}).before(async () => { await createScheduler('day', dataSource) });

import { TablePosition, Size, TimeSpan } from '../helpers/appointment.helper';

export const movementMap = [
    {
        title: 'Appointment #1',
        features: [
            {
                position: new TablePosition(0, 3),
                size: new Size('auto', '19px'),
                duration: new TimeSpan('9:00 AM', '9:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #2',
        features: [
            {
                position: new TablePosition(0, 3),
                size: new Size('auto', '19px'),
                duration: new TimeSpan('9:00 AM', '10:00 AM')
            }
        ]
    },
    {
        title: 'Appointment #3',
        features: [
            {
                position: new TablePosition(0, 3),
                size: new Size('auto', '19px'),
                duration: new TimeSpan('9:00 AM', '10:30 AM')
            }
        ]
    }
]

import { TablePosition, Size, Duration } from '../helpers/appointment.helper';

export const movementMap = [
    {
        title: 'Appointment #1',
        features: [
            {
                position: new TablePosition(1, 0),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '9:30 AM')
            },
            {
                position: new TablePosition(1, 2),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '9:30 AM')
            },
            {
                position: new TablePosition(2, 3),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '9:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #2',
        features: [
            {
                position: new TablePosition(1, 2),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:00 AM')
            },
            {
                position: new TablePosition(2, 3),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:00 AM')
            },
            {
                position: new TablePosition(2, 5),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:00 AM')
            }
        ]
    },
    {
        title: 'Appointment #3',
        features: [
            {
                position: new TablePosition(2, 3),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:30 AM')
            },
            {
                position: new TablePosition(3, 5),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:30 AM')
            },
            {
                position: new TablePosition(3, 3),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '10:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #5',
        features: [
            {
                position: new TablePosition(3, 5),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '11:30 AM')
            },
            {
                position: new TablePosition(5, 2),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '11:30 AM')
            },
            {
                position: new TablePosition(5, 3),
                size: new Size('auto', '19px'),
                duration: new Duration('9:00 AM', '11:30 AM')
            }
        ]
    }
]

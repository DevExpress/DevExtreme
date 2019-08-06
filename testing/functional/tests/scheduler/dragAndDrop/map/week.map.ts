import { TablePosition, Size, TimeSpan } from '../helpers/appointment.helper';

export const movementMap = [
    {
        title: 'Appointment #1',
        features: [
            {
                position: new TablePosition(1, 0),
                size: new Size('auto', '50px'),
                duration: new TimeSpan('9:30 AM', '10:00 AM')
            },
            {
                position: new TablePosition(3, 0),
                size: new Size('auto', '50px'),
                duration: new TimeSpan('10:30 AM', '11:00 AM')
            }
        ]
    },
    {
        title: 'Appointment #2',
        features: [
            {
                position: new TablePosition(1, 0),
                size: new Size('auto', '100px'),
                duration: new TimeSpan('9:30 AM', '10:30 AM')
            },
            {
                position: new TablePosition(3, 0),
                size: new Size('auto', '100px'),
                duration: new TimeSpan('10:30 AM', '11:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #3',
        features: [
            {
                position: new TablePosition(1, 0),
                size: new Size('auto', '150px'),
                duration: new TimeSpan('9:30 AM', '11:00 AM')
            },
            {
                position: new TablePosition(3, 0),
                size: new Size('auto', '150px'),
                duration: new TimeSpan('10:30 AM', '12:00 PM')
            }
        ]
    },
    {
        title: 'Appointment #2',
        features: [
            {
                position: new TablePosition(1, 0),
                size: new Size('auto', '100px'),
                duration: new TimeSpan('9:30 AM', '10:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #1',
        features: [
            {
                position: new TablePosition(0, 0),
                size: new Size('auto', '50px'),
                duration: new TimeSpan('9:00 AM', '9:30 AM')
            }
        ]
    },
    {
        title: 'Appointment #2',
        features: [
            {
                position: new TablePosition(0, 1),
                size: new Size('auto', '100px'),
                duration: new TimeSpan('9:00 AM', '10:00 AM')
            }
        ]
    },
    {
        title: 'Appointment #3',
        features: [
            {
                position: new TablePosition(0, 2),
                size: new Size('auto', '150px'),
                duration: new TimeSpan('9:00 AM', '10:30 AM')
            }
        ]
    }
]

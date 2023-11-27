const tabsPositionsSelectBoxLabel = { 'aria-label': 'Tab position' };

const tabsPositions = [
  'left',
  'top',
  'right',
  'bottom',
];

const stylingModesSelectBoxLabel = { 'aria-label': 'Styling mode' };

const stylingModes = [
  'secondary',
  'primary',
];

const iconPositionsSelectBoxLabel = { 'aria-label': 'Icon positions' };

const iconPositions = [
  'top',
  'start',
  'end',
  'bottom',
];

const tasks = [
  {
    status: 'Not Started',
    priority: 'high',
    text: 'Revenue Projections',
    date: '2023/09/16',
    assignedBy: 'John Heart',
  },
  {
    status: 'Not Started',
    priority: 'high',
    text: 'New Brochures',
    date: '2023/09/16',
    assignedBy: 'Samantha Bright',
  },
  {
    status: 'Not Started',
    priority: 'medium',
    text: 'Training',
    date: '2023/09/16',
    assignedBy: 'Arthur Miller',
  },
  {
    status: 'Not Started',
    priority: 'medium',
    text: 'NDA',
    date: '2023/09/16',
    assignedBy: 'Robert Reagan',
  },
  {
    status: 'Not Started',
    priority: 'low',
    text: 'Health Insurance',
    date: '2023/09/16',
    assignedBy: 'Greta Sims',
  },

  {
    status: 'Help Needed',
    priority: 'low',
    text: 'TV Recall',
    date: '2023/09/16',
    assignedBy: 'Brett Wade',
  },
  {
    status: 'Help Needed',
    priority: 'low',
    text: 'Recall and Refund Forms',
    date: '2023/09/16',
    assignedBy: 'Sandra Johnson',
  },
  {
    status: 'Help Needed',
    priority: 'high',
    text: 'Shippers',
    date: '2023/09/16',
    assignedBy: 'Ed Holmes',
  },
  {
    status: 'Help Needed',
    priority: 'medium',
    text: 'Hardware Upgrade',
    date: '2023/09/16',
    assignedBy: 'Barb Banks',
  },

  {
    status: 'In Progress',
    priority: 'medium',
    text: 'Online Sales',
    date: '2023/09/16',
    assignedBy: 'Cindy Stanwick',
  },
  {
    status: 'In Progress',
    priority: 'medium',
    text: 'New Website Design',
    date: '2023/09/16',
    assignedBy: 'Sammy Hill',
  },
  {
    status: 'In Progress',
    priority: 'low',
    text: 'Bandwidth Increase',
    date: '2023/09/16',
    assignedBy: 'Davey Jones',
  },
  {
    status: 'In Progress',
    priority: 'medium',
    text: 'Support',
    date: '2023/09/16',
    assignedBy: 'Victor Norris',
  },
  {
    status: 'In Progress',
    priority: 'low',
    text: 'Training Material',
    date: '2023/09/16',
    assignedBy: 'John Heart',
  },

  {
    status: 'Deferred',
    priority: 'medium',
    text: 'New Database',
    date: '2023/09/16',
    assignedBy: 'Samantha Bright',
  },
  {
    status: 'Deferred',
    priority: 'high',
    text: 'Automation Server',
    date: '2023/09/16',
    assignedBy: 'Arthur Miller',
  },
  {
    status: 'Deferred',
    priority: 'medium',
    text: 'Retail Sales',
    date: '2023/09/16',
    assignedBy: 'Robert Reagan',
  },
  {
    status: 'Deferred',
    priority: 'medium',
    text: 'Shipping Labels',
    date: '2023/09/16',
    assignedBy: 'Greta Sims',
  },

  {
    status: 'Rejected',
    priority: 'high',
    text: 'Schedule Meeting with Sales Team',
    date: '2023/09/16',
    assignedBy: 'Sandra Johnson',
  },
  {
    status: 'Rejected',
    priority: 'medium',
    text: 'Confirm Availability for Sales Meeting',
    date: '2023/09/16',
    assignedBy: 'Ed Holmes',
  },
  {
    status: 'Rejected',
    priority: 'medium',
    text: 'Reschedule Sales Team Meeting',
    date: '2023/09/16',
    assignedBy: 'Barb Banks',
  },
  {
    status: 'Rejected',
    priority: 'high',
    text: 'Update Database with New Leads',
    date: '2023/09/16',
    assignedBy: 'Kevin Carter',
  },
  {
    status: 'Rejected',
    priority: 'low',
    text: 'Send Territory Sales Breakdown',
    date: '2023/09/16',
    assignedBy: 'Cindy Stanwick',
  },

  {
    status: 'Completed',
    priority: 'medium',
    text: 'Territory Sales Breakdown Report',
    date: '2023/09/16',
    assignedBy: 'Sammy Hill',
  },
  {
    status: 'Completed',
    priority: 'low',
    text: 'Return Merchandise Report',
    date: '2023/09/16',
    assignedBy: 'Davey Jones',
  },
  {
    status: 'Completed',
    priority: 'high',
    text: 'Staff Productivity Report',
    date: '2023/09/16',
    assignedBy: 'Victor Norris',
  },
  {
    status: 'Completed',
    priority: 'medium',
    text: 'Review HR Budget Company Wide',
    date: '2023/09/16',
    assignedBy: 'Mary Stern',
  },
];

const dataSource = [
  {
    icon: 'description',
    title: 'Not Started',
    tasks: tasks.filter((item) => item.status === 'Not Started'),
  },
  {
    icon: 'taskhelpneeded',
    title: 'Help Needed',
    tasks: tasks.filter((item) => item.status === 'Help Needed'),
  },
  {
    icon: 'taskinprogress',
    title: 'In Progress',
    tasks: tasks.filter((item) => item.status === 'In Progress'),
  },
  {
    icon: 'taskstop',
    title: 'Deferred',
    tasks: tasks.filter((item) => item.status === 'Deferred'),
  },
  {
    icon: 'taskrejected',
    title: 'Rejected',
    tasks: tasks.filter((item) => item.status === 'Rejected'),
  },
  {
    icon: 'taskcomplete',
    title: 'Completed',
    tasks: tasks.filter((item) => item.status === 'Completed'),
  },
];

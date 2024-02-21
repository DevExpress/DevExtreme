export const resources = [{
  id: 0,
  text: 'David Carter',
  color: '#74d57b',
}, {
  id: 1,
  text: 'Emma Lewis',
  color: '#1db2f5',
}, {
  id: 2,
  text: 'Noah Hill',
  color: '#f5564a',
}, {
  id: 3,
  text: 'William Bell',
  color: '#97c95c',
}, {
  id: 4,
  text: 'Jane Jones',
  color: '#ffc720',
}, {
  id: 5,
  text: 'Violet Young',
  color: '#eb3573',
}, {
  id: 6,
  text: 'Samuel Perry',
  color: '#a63db8',
}, {
  id: 7,
  text: 'Luther Murphy',
  color: '#ffaa66',
}, {
  id: 8,
  text: 'Craig Morris',
  color: '#2dcdc4',
}, {
  id: 9,
  text: 'Sandy Wood',
  color: '#c34cb9',
}, {
  id: 10,
  text: 'Susan Bennett',
  color: '#3d44ec',
}, {
  id: 11,
  text: 'Lilly Barnes',
  color: '#4ddcca',
}, {
  id: 12,
  text: 'Marcus Price',
  color: '#2ec98d',
}, {
  id: 13,
  text: 'David Stewart',
  color: '#3ff6ca',
}, {
  id: 14,
  text: 'Joseph Smith',
  color: '#f665aa',
}, {
  id: 15,
  text: 'Carter Wilson',
  color: '#d1c974',
}, {
  id: 16,
  text: 'Wyatt Lopez',
  color: '#ff6741',
}, {
  id: 17,
  text: 'John Long',
  color: '#ee53dc',
}, {
  id: 18,
  text: 'Jack Rivera',
  color: '#795ac3',
}, {
  id: 19,
  text: 'Victoria Adams',
  color: '#ff7d8a',
}, {
  id: 20,
  text: 'Madison Anderson',
  color: '#4cd482',
}, {
  id: 21,
  text: 'Luna Moore',
  color: '#9d67cc',
}, {
  id: 22,
  text: 'Michael Bailey',
  color: '#5ab1ef',
}, {
  id: 23,
  text: 'Jenny Powell',
  color: '#68e18f',
}, {
  id: 24,
  text: 'Daniel Peterson',
  color: '#4dd155',
}, {
  id: 25,
  text: 'Gabriel Gray',
  color: '#ef9e44',
}, {
  id: 26,
  text: 'Anthony Robinson',
  color: '#45a5cc',
}, {
  id: 27,
  text: 'Ellie Tomson',
  color: '#a067bd',
}, {
  id: 28,
  text: 'Natalie Adams',
  color: '#3d44ec',
}, {
  id: 29,
  text: 'Sofia Green',
  color: '#4ddcca',
}];

const appointmentsText = [
  'Google AdWords Strategy',
  'New Brochures',
  'Brochure Design Review',
  'Website Re-Design Plan',
  'Rollout of New Website and Marketing Brochures',
  'Update Sales Strategy Documents',
  'Non-Compete Agreements',
  'Approve Hiring of John Jeffers',
  'Update NDA Agreement',
  'Update Employee Files with New NDA',
  'Submit Questions Regarding New NDA',
  'Submit Signed NDA',
  'Review Revenue Projections',
  'Comment on Revenue Projections',
  'Provide New Health Insurance Docs',
  'Review Changes to Health Insurance Coverage',
  'Review Training Course for any Ommissions',
  'Recall Rebate Form',
  'Create Report on Customer Feedback',
  'Review Customer Feedback Report',
  'Customer Feedback Report Analysis',
  'Prepare Shipping Cost Analysis Report',
  'Provide Feedback on Shippers',
  'Select Preferred Shipper',
  'Complete Shipper Selection Form',
  'Upgrade Server Hardware',
  'Upgrade Personal Computers',
  'Upgrade Apps to Windows RT or stay with WinForms',
  'Estimate Time Required to Touch-Enable Apps',
  'Report on Tranistion to Touch-Based Apps',
  'Submit New Website Design',
  'Create Icons for Website',
  'Create New Product Pages',
  'Approve Website Launch',
  'Update Customer Shipping Profiles',
  'Create New Shipping Return Labels',
  'Get Design for Shipping Return Labels',
  'PSD needed for Shipping Return Labels',
  'Contact ISP and Discuss Payment Options',
  'Prepare Year-End Support Summary Report',
  'Review New Training Material',
  'Distribute Training Material to Support Staff',
  'Training Material Distribution Schedule',
  'Approval on Converting to New HDMI Specification',
  'Create New Spike for Automation Server',
  'Code Review - New Automation Server',
  'Confirm Availability for Sales Meeting',
  'Reschedule Sales Team Meeting',
  'Send 2 Remotes for Giveaways',
  'Discuss Product Giveaways with Management',
  'Replace Desktops on the 3rd Floor',
  'Update Database with New Leads',
  'Mail New Leads for Follow Up',
  'Send Territory Sales Breakdown',
  'Territory Sales Breakdown Report',
  'Report on the State of Engineering Dept',
  'Staff Productivity Report',
];

function getRandomDuration(durationState) {
  const durationMin = Math.floor((durationState % 23) / 3 + 5) * 15;

  return durationMin * 60 * 1000;
}

function getRandomText(textIndex) {
  return appointmentsText[textIndex % appointmentsText.length];
}

function filterAppointmentsByTime(appointments, startDayHour, endDayHour) {
  const result = [];

  for (let i = 0; i < appointments.length; i += 1) {
    const { startDate } = appointments[i];
    const { endDate } = appointments[i];

    if (startDate.getDay() === endDate.getDay()
        && startDate.getHours() >= startDayHour - 1
        && endDate.getHours() <= endDayHour - 1) {
      result.push(appointments[i]);
    }
  }

  return result;
}

export function generateAppointments(startDay, endDay, startDayHour, endDayHour) {
  const appointments = [];

  let textIndex = 0;
  let durationState = 1;
  const durationIncrement = 19;

  for (let i = 0; i < resources.length; i += 1) {
    let startDate = startDay;

    while (startDate.getTime() < endDay.getTime()) {
      durationState += durationIncrement;
      const endDate = new Date(startDate.getTime() + getRandomDuration(durationState));

      appointments.push({
        text: getRandomText(textIndex),
        startDate,
        endDate,
        humanId: resources[i].id,
      });

      textIndex += 1;

      durationState += durationIncrement;
      startDate = new Date(endDate.getTime() + getRandomDuration(durationState));
    }
  }

  return filterAppointmentsByTime(appointments, startDayHour, endDayHour);
}

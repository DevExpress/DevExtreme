var resourcesAmount = 100;
var colors = [
  'rgba(63, 81, 181, 0.7)',
  'rgba(234, 128, 252, 0.7)',
  'rgba(223, 82, 134, 0.7)',
  'rgba(254, 194, 0, 0.7)'
];
var texts = [
  "Website Re-Design Plan",
  "Book Flights to San Fran for Sales Trip",
  "Install New Router in Dev Room",
  "Approve Personal Computer Upgrade Plan",
  "Final Budget Review",
  "New Brochures",
  "Install New Database",
  "Approve New Online Marketing Strategy",
  "Upgrade Personal Computers",
  "Customer Workshop",
  "Prepare 2015 Marketing Plan",
  "Brochure Design Review",
  "Create Icons for Website",
  "Upgrade Server Hardware",
  "Submit New Website Design",
  "Launch New Website",
];

function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

function generateResources() {
  var resources = [];

  for(var i = 0; i < resourcesAmount; ++i) {
    var color = colors[i % colors.length];

    resources.push({
      id: i,
      text: `Resource ${i}`,
      color: color
    });
  }

  return resources;
};

function generateAppointments() {
  var startDay = 6;
  var endDay = 14;
  var startDayHour = 9;
  var endDayHour = 18;

  var appointments = [];

  for (var resourceId = 0; resourceId < resourcesAmount; ++resourceId) {
    for (var dayIndex = startDay; dayIndex <= endDay; ++dayIndex) {
      for (var count = 0; count < 10; ++count) {
        var hour = getRandomInt(startDayHour, endDayHour);
        var minutes = getRandomInt(15, 44);
        var minutesBeforeHour = 60 - minutes;
        var minMinutes = Math.min(minutes, minutesBeforeHour);
        var maxMinutes = Math.max(minutes, minutesBeforeHour);
        var appointmentTime = getRandomInt(minMinutes, maxMinutes) * 60 * 1000;
        var startDate = new Date(2021, 8, dayIndex, hour, minutes);
        var endDate = new Date(startDate.getTime() + appointmentTime);

        var item = {
          text: texts[getRandomInt(0, texts.length)],
          resourceId: resourceId,
          startDate: startDate,
          endDate: endDate,
        };
        appointments.push(item);
      }
    }
  }

  return appointments;
}

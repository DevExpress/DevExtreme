var flowNodes = [
  {
    "id": 107,
    "text": "A new ticket",
    "type": "terminator"
  },
  {
    "id": 108,
    "text": "Analyze the issue",
    "type": "process"
  },
  {
    "id": 118,
    "text": "Do we have all information to work with?",
    "type": "diamond"
  },
  {
    "id": 120,
    "text": "Answered",
    "type": "terminator"
  },
  {
    "id": 121,
    "text": "Request additional information or clarify the scenario",
    "type": "rectangle"
  },
  {
    "id": 125,
    "text": "Prepare an example in Code Central",
    "type": "rectangle"
  },
  {
    "id": 127,
    "text": "Update the documentation",
    "type": "rectangle"
  },
  {
    "id": 131,
    "text": "Process the ticket",
    "type": "rectangle"
  },
  {
    "id": 133,
    "text": "Work with the R&D team",
    "type": "rectangle"
  }
];
var flowEdges = [
  {
    "fromId": 107,
    "id": 116,
    "text": null,
    "toId": 108
  },
  {
    "fromId": 108,
    "id": 117,
    "text": null,
    "toId": 118
  },
  {
    "fromId": 118,
    "id": 122,
    "text": "No",
    "toId": 121
  },
  {
    "fromId": 121,
    "id": 123,
    "text": null,
    "toId": 108
  },
  {
    "fromId": 131,
    "id": 124,
    "text": null,
    "toId": 120
  },
  {
    "fromId": 120,
    "id": 126,
    "text": "",
    "toId": 125
  },
  {
    "fromId": 120,
    "id": 128,
    "text": null,
    "toId": 120
  },
  {
    "fromId": 127,
    "id": 129,
    "text": null,
    "toId": 127
  },
  {
    "fromId": 120,
    "id": 130,
    "text": "",
    "toId": 127
  },
  {
    "fromId": 118,
    "id": 132,
    "text": "Yes",
    "toId": 131
  },
  {
    "fromId": 131,
    "id": 134,
    "text": "Need developer assistance?",
    "toId": 133
  },
  {
    "fromId": 133,
    "id": 135,
    "text": null,
    "toId": 120
  }
];

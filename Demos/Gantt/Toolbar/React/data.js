export const tasks = [{
  'id': 1,
  'parentId': 0,
  'title': 'Software Development',
  'start': new Date('2019-02-21T05:00:00.000Z'),
  'end': new Date('2019-07-04T12:00:00.000Z'),
  'progress': 31
}, {
  'id': 2,
  'parentId': 1,
  'title': 'Scope',
  'start': new Date('2019-02-21T05:00:00.000Z'),
  'end': new Date('2019-02-26T09:00:00.000Z'),
  'progress': 60
}, {
  'id': 3,
  'parentId': 2,
  'title': 'Determine project scope',
  'start': new Date('2019-02-21T05:00:00.000Z'),
  'end': new Date('2019-02-21T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 4,
  'parentId': 2,
  'title': 'Secure project sponsorship',
  'start': new Date('2019-02-21T10:00:00.000Z'),
  'end': new Date('2019-02-22T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 5,
  'parentId': 2,
  'title': 'Define preliminary resources',
  'start': new Date('2019-02-22T10:00:00.000Z'),
  'end': new Date('2019-02-25T09:00:00.000Z'),
  'progress': 60
}, {
  'id': 6,
  'parentId': 2,
  'title': 'Secure core resources',
  'start': new Date('2019-02-25T10:00:00.000Z'),
  'end': new Date('2019-02-26T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 7,
  'parentId': 2,
  'title': 'Scope complete',
  'start': new Date('2019-02-26T09:00:00.000Z'),
  'end': new Date('2019-02-26T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 8,
  'parentId': 1,
  'title': 'Analysis/Software Requirements',
  'start': new Date('2019-02-26T10:00:00.000Z'),
  'end': new Date('2019-03-18T09:00:00.000Z'),
  'progress': 80
}, {
  'id': 9,
  'parentId': 8,
  'title': 'Conduct needs analysis',
  'start': new Date('2019-02-26T10:00:00.000Z'),
  'end': new Date('2019-03-05T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 10,
  'parentId': 8,
  'title': 'Draft preliminary software specifications',
  'start': new Date('2019-03-05T10:00:00.000Z'),
  'end': new Date('2019-03-08T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 11,
  'parentId': 8,
  'title': 'Develop preliminary budget',
  'start': new Date('2019-03-08T10:00:00.000Z'),
  'end': new Date('2019-03-12T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 12,
  'parentId': 8,
  'title': 'Review software specifications/budget with team',
  'start': new Date('2019-03-12T10:00:00.000Z'),
  'end': new Date('2019-03-12T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 13,
  'parentId': 8,
  'title': 'Incorporate feedback on software specifications',
  'start': new Date('2019-03-13T05:00:00.000Z'),
  'end': new Date('2019-03-13T14:00:00.000Z'),
  'progress': 70
}, {
  'id': 14,
  'parentId': 8,
  'title': 'Develop delivery timeline',
  'start': new Date('2019-03-14T05:00:00.000Z'),
  'end': new Date('2019-03-14T14:00:00.000Z'),
  'progress': 0
}, {
  'id': 15,
  'parentId': 8,
  'title': 'Obtain approvals to proceed (concept, timeline, budget)',
  'start': new Date('2019-03-15T05:00:00.000Z'),
  'end': new Date('2019-03-15T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 16,
  'parentId': 8,
  'title': 'Secure required resources',
  'start': new Date('2019-03-15T10:00:00.000Z'),
  'end': new Date('2019-03-18T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 17,
  'parentId': 8,
  'title': 'Analysis complete',
  'start': new Date('2019-03-18T09:00:00.000Z'),
  'end': new Date('2019-03-18T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 18,
  'parentId': 1,
  'title': 'Design',
  'start': new Date('2019-03-18T10:00:00.000Z'),
  'end': new Date('2019-04-05T14:00:00.000Z'),
  'progress': 80
}, {
  'id': 19,
  'parentId': 18,
  'title': 'Review preliminary software specifications',
  'start': new Date('2019-03-18T10:00:00.000Z'),
  'end': new Date('2019-03-20T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 20,
  'parentId': 18,
  'title': 'Develop functional specifications',
  'start': new Date('2019-03-20T10:00:00.000Z'),
  'end': new Date('2019-03-27T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 21,
  'parentId': 18,
  'title': 'Develop prototype based on functional specifications',
  'start': new Date('2019-03-27T10:00:00.000Z'),
  'end': new Date('2019-04-02T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 22,
  'parentId': 18,
  'title': 'Review functional specifications',
  'start': new Date('2019-04-02T10:00:00.000Z'),
  'end': new Date('2019-04-04T09:00:00.000Z'),
  'progress': 30
}, {
  'id': 23,
  'parentId': 18,
  'title': 'Incorporate feedback into functional specifications',
  'start': new Date('2019-04-04T10:00:00.000Z'),
  'end': new Date('2019-04-05T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 24,
  'parentId': 18,
  'title': 'Obtain approval to proceed',
  'start': new Date('2019-04-05T10:00:00.000Z'),
  'end': new Date('2019-04-05T14:00:00.000Z'),
  'progress': 0
}, {
  'id': 25,
  'parentId': 18,
  'title': 'Design complete',
  'start': new Date('2019-04-05T14:00:00.000Z'),
  'end': new Date('2019-04-05T14:00:00.000Z'),
  'progress': 0
}, {
  'id': 26,
  'parentId': 1,
  'title': 'Development',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-05-07T12:00:00.000Z'),
  'progress': 42
}, {
  'id': 27,
  'parentId': 26,
  'title': 'Review functional specifications',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-08T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 28,
  'parentId': 26,
  'title': 'Identify modular/tiered design parameters',
  'start': new Date('2019-04-09T05:00:00.000Z'),
  'end': new Date('2019-04-09T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 29,
  'parentId': 26,
  'title': 'Assign development staff',
  'start': new Date('2019-04-10T05:00:00.000Z'),
  'end': new Date('2019-04-10T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 30,
  'parentId': 26,
  'title': 'Develop code',
  'start': new Date('2019-04-11T05:00:00.000Z'),
  'end': new Date('2019-05-01T14:00:00.000Z'),
  'progress': 49
}, {
  'id': 31,
  'parentId': 26,
  'title': 'Developer testing (primary debugging)',
  'start': new Date('2019-04-16T12:00:00.000Z'),
  'end': new Date('2019-05-07T12:00:00.000Z'),
  'progress': 24
}, {
  'id': 32,
  'parentId': 26,
  'title': 'Development complete',
  'start': new Date('2019-05-07T12:00:00.000Z'),
  'end': new Date('2019-05-07T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 33,
  'parentId': 1,
  'title': 'Testing',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-06-13T12:00:00.000Z'),
  'progress': 23
}, {
  'id': 34,
  'parentId': 33,
  'title': 'Develop unit test plans using product specifications',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-11T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 35,
  'parentId': 33,
  'title': 'Develop integration test plans using product specifications',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-11T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 36,
  'parentId': 33,
  'title': 'Unit Testing',
  'start': new Date('2019-05-07T12:00:00.000Z'),
  'end': new Date('2019-05-28T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 37,
  'parentId': 36,
  'title': 'Review modular code',
  'start': new Date('2019-05-07T12:00:00.000Z'),
  'end': new Date('2019-05-14T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 38,
  'parentId': 36,
  'title': 'Test component modules to product specifications',
  'start': new Date('2019-05-14T12:00:00.000Z'),
  'end': new Date('2019-05-16T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 39,
  'parentId': 36,
  'title': 'Identify anomalies to product specifications',
  'start': new Date('2019-05-16T12:00:00.000Z'),
  'end': new Date('2019-05-21T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 40,
  'parentId': 36,
  'title': 'Modify code',
  'start': new Date('2019-05-21T12:00:00.000Z'),
  'end': new Date('2019-05-24T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 41,
  'parentId': 36,
  'title': 'Re-test modified code',
  'start': new Date('2019-05-24T12:00:00.000Z'),
  'end': new Date('2019-05-28T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 42,
  'parentId': 36,
  'title': 'Unit testing complete',
  'start': new Date('2019-05-28T12:00:00.000Z'),
  'end': new Date('2019-05-28T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 43,
  'parentId': 33,
  'title': 'Integration Testing',
  'start': new Date('2019-05-28T12:00:00.000Z'),
  'end': new Date('2019-06-13T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 44,
  'parentId': 43,
  'title': 'Test module integration',
  'start': new Date('2019-05-28T12:00:00.000Z'),
  'end': new Date('2019-06-04T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 45,
  'parentId': 43,
  'title': 'Identify anomalies to specifications',
  'start': new Date('2019-06-04T12:00:00.000Z'),
  'end': new Date('2019-06-06T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 46,
  'parentId': 43,
  'title': 'Modify code',
  'start': new Date('2019-06-06T12:00:00.000Z'),
  'end': new Date('2019-06-11T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 47,
  'parentId': 43,
  'title': 'Re-test modified code',
  'start': new Date('2019-06-11T12:00:00.000Z'),
  'end': new Date('2019-06-13T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 48,
  'parentId': 43,
  'title': 'Integration testing complete',
  'start': new Date('2019-06-13T12:00:00.000Z'),
  'end': new Date('2019-06-13T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 49,
  'parentId': 1,
  'title': 'Training',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-06-10T12:00:00.000Z'),
  'progress': 25
}, {
  'id': 50,
  'parentId': 49,
  'title': 'Develop training specifications for end users',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-10T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 51,
  'parentId': 49,
  'title': 'Develop training specifications for helpdesk support staff',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-10T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 52,
  'parentId': 49,
  'title': 'Identify training delivery methodology (computer based training, classroom, etc.)',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-09T14:00:00.000Z'),
  'progress': 100
}, {
  'id': 53,
  'parentId': 49,
  'title': 'Develop training materials',
  'start': new Date('2019-05-07T12:00:00.000Z'),
  'end': new Date('2019-05-28T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 54,
  'parentId': 49,
  'title': 'Conduct training usability study',
  'start': new Date('2019-05-28T12:00:00.000Z'),
  'end': new Date('2019-06-03T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 55,
  'parentId': 49,
  'title': 'Finalize training materials',
  'start': new Date('2019-06-03T12:00:00.000Z'),
  'end': new Date('2019-06-06T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 56,
  'parentId': 49,
  'title': 'Develop training delivery mechanism',
  'start': new Date('2019-06-06T12:00:00.000Z'),
  'end': new Date('2019-06-10T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 57,
  'parentId': 49,
  'title': 'Training materials complete',
  'start': new Date('2019-06-10T12:00:00.000Z'),
  'end': new Date('2019-06-10T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 58,
  'parentId': 1,
  'title': 'Documentation',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-05-20T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 59,
  'parentId': 58,
  'title': 'Develop Help specification',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-08T14:00:00.000Z'),
  'progress': 80
}, {
  'id': 60,
  'parentId': 58,
  'title': 'Develop Help system',
  'start': new Date('2019-04-22T10:00:00.000Z'),
  'end': new Date('2019-05-13T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 61,
  'parentId': 58,
  'title': 'Review Help documentation',
  'start': new Date('2019-05-13T10:00:00.000Z'),
  'end': new Date('2019-05-16T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 62,
  'parentId': 58,
  'title': 'Incorporate Help documentation feedback',
  'start': new Date('2019-05-16T10:00:00.000Z'),
  'end': new Date('2019-05-20T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 63,
  'parentId': 58,
  'title': 'Develop user manuals specifications',
  'start': new Date('2019-04-08T05:00:00.000Z'),
  'end': new Date('2019-04-09T14:00:00.000Z'),
  'progress': 65
}, {
  'id': 64,
  'parentId': 58,
  'title': 'Develop user manuals',
  'start': new Date('2019-04-22T10:00:00.000Z'),
  'end': new Date('2019-05-13T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 65,
  'parentId': 58,
  'title': 'Review all user documentation',
  'start': new Date('2019-05-13T10:00:00.000Z'),
  'end': new Date('2019-05-15T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 66,
  'parentId': 58,
  'title': 'Incorporate user documentation feedback',
  'start': new Date('2019-05-15T10:00:00.000Z'),
  'end': new Date('2019-05-17T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 67,
  'parentId': 58,
  'title': 'Documentation complete',
  'start': new Date('2019-05-20T09:00:00.000Z'),
  'end': new Date('2019-05-20T09:00:00.000Z'),
  'progress': 0
}, {
  'id': 68,
  'parentId': 1,
  'title': 'Pilot',
  'start': new Date('2019-03-18T10:00:00.000Z'),
  'end': new Date('2019-06-24T12:00:00.000Z'),
  'progress': 22
}, {
  'id': 69,
  'parentId': 68,
  'title': 'Identify test group',
  'start': new Date('2019-03-18T10:00:00.000Z'),
  'end': new Date('2019-03-19T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 70,
  'parentId': 68,
  'title': 'Develop software delivery mechanism',
  'start': new Date('2019-03-19T10:00:00.000Z'),
  'end': new Date('2019-03-20T09:00:00.000Z'),
  'progress': 100
}, {
  'id': 71,
  'parentId': 68,
  'title': 'Install/deploy software',
  'start': new Date('2019-06-13T12:00:00.000Z'),
  'end': new Date('2019-06-14T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 72,
  'parentId': 68,
  'title': 'Obtain user feedback',
  'start': new Date('2019-06-14T12:00:00.000Z'),
  'end': new Date('2019-06-21T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 73,
  'parentId': 68,
  'title': 'Evaluate testing information',
  'start': new Date('2019-06-21T12:00:00.000Z'),
  'end': new Date('2019-06-24T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 74,
  'parentId': 68,
  'title': 'Pilot complete',
  'start': new Date('2019-06-24T12:00:00.000Z'),
  'end': new Date('2019-06-24T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 75,
  'parentId': 1,
  'title': 'Deployment',
  'start': new Date('2019-06-24T12:00:00.000Z'),
  'end': new Date('2019-07-01T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 76,
  'parentId': 75,
  'title': 'Determine final deployment strategy',
  'start': new Date('2019-06-24T12:00:00.000Z'),
  'end': new Date('2019-06-25T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 77,
  'parentId': 75,
  'title': 'Develop deployment methodology',
  'start': new Date('2019-06-25T12:00:00.000Z'),
  'end': new Date('2019-06-26T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 78,
  'parentId': 75,
  'title': 'Secure deployment resources',
  'start': new Date('2019-06-26T12:00:00.000Z'),
  'end': new Date('2019-06-27T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 79,
  'parentId': 75,
  'title': 'Train support staff',
  'start': new Date('2019-06-27T12:00:00.000Z'),
  'end': new Date('2019-06-28T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 80,
  'parentId': 75,
  'title': 'Deploy software',
  'start': new Date('2019-06-28T12:00:00.000Z'),
  'end': new Date('2019-07-01T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 81,
  'parentId': 75,
  'title': 'Deployment complete',
  'start': new Date('2019-07-01T12:00:00.000Z'),
  'end': new Date('2019-07-01T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 82,
  'parentId': 1,
  'title': 'Post Implementation Review',
  'start': new Date('2019-07-01T12:00:00.000Z'),
  'end': new Date('2019-07-04T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 83,
  'parentId': 82,
  'title': 'Document lessons learned',
  'start': new Date('2019-07-01T12:00:00.000Z'),
  'end': new Date('2019-07-02T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 84,
  'parentId': 82,
  'title': 'Distribute to team members',
  'start': new Date('2019-07-02T12:00:00.000Z'),
  'end': new Date('2019-07-03T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 85,
  'parentId': 82,
  'title': 'Create software maintenance team',
  'start': new Date('2019-07-03T12:00:00.000Z'),
  'end': new Date('2019-07-04T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 86,
  'parentId': 82,
  'title': 'Post implementation review complete',
  'start': new Date('2019-07-04T12:00:00.000Z'),
  'end': new Date('2019-07-04T12:00:00.000Z'),
  'progress': 0
}, {
  'id': 87,
  'parentId': 1,
  'title': 'Software development template complete',
  'start': new Date('2019-07-04T12:00:00.000Z'),
  'end': new Date('2019-07-04T12:00:00.000Z'),
  'progress': 0
}];

export const dependencies = [{
  'id': 1,
  'predecessorId': 3,
  'successorId': 4,
  'type': 0
}, {
  'id': 2,
  'predecessorId': 4,
  'successorId': 5,
  'type': 0
}, {
  'id': 3,
  'predecessorId': 5,
  'successorId': 6,
  'type': 0
}, {
  'id': 4,
  'predecessorId': 6,
  'successorId': 7,
  'type': 0
}, {
  'id': 5,
  'predecessorId': 7,
  'successorId': 9,
  'type': 0
}, {
  'id': 6,
  'predecessorId': 9,
  'successorId': 10,
  'type': 0
}, {
  'id': 7,
  'predecessorId': 10,
  'successorId': 11,
  'type': 0
}, {
  'id': 8,
  'predecessorId': 11,
  'successorId': 12,
  'type': 0
}, {
  'id': 9,
  'predecessorId': 12,
  'successorId': 13,
  'type': 0
}, {
  'id': 10,
  'predecessorId': 13,
  'successorId': 14,
  'type': 0
}, {
  'id': 11,
  'predecessorId': 14,
  'successorId': 15,
  'type': 0
}, {
  'id': 12,
  'predecessorId': 15,
  'successorId': 16,
  'type': 0
}, {
  'id': 13,
  'predecessorId': 16,
  'successorId': 17,
  'type': 0
}, {
  'id': 14,
  'predecessorId': 17,
  'successorId': 19,
  'type': 0
}, {
  'id': 15,
  'predecessorId': 19,
  'successorId': 20,
  'type': 0
}, {
  'id': 16,
  'predecessorId': 20,
  'successorId': 21,
  'type': 0
}, {
  'id': 17,
  'predecessorId': 21,
  'successorId': 22,
  'type': 0
}, {
  'id': 18,
  'predecessorId': 22,
  'successorId': 23,
  'type': 0
}, {
  'id': 19,
  'predecessorId': 23,
  'successorId': 24,
  'type': 0
}, {
  'id': 20,
  'predecessorId': 24,
  'successorId': 25,
  'type': 0
}, {
  'id': 21,
  'predecessorId': 25,
  'successorId': 27,
  'type': 0
}, {
  'id': 22,
  'predecessorId': 27,
  'successorId': 28,
  'type': 0
}, {
  'id': 23,
  'predecessorId': 28,
  'successorId': 29,
  'type': 0
}, {
  'id': 24,
  'predecessorId': 29,
  'successorId': 30,
  'type': 0
}, {
  'id': 25,
  'predecessorId': 31,
  'successorId': 32,
  'type': 0
}, {
  'id': 26,
  'predecessorId': 37,
  'successorId': 38,
  'type': 0
}, {
  'id': 27,
  'predecessorId': 38,
  'successorId': 39,
  'type': 0
}, {
  'id': 28,
  'predecessorId': 39,
  'successorId': 40,
  'type': 0
}, {
  'id': 29,
  'predecessorId': 40,
  'successorId': 41,
  'type': 0
}, {
  'id': 30,
  'predecessorId': 41,
  'successorId': 42,
  'type': 0
}, {
  'id': 31,
  'predecessorId': 42,
  'successorId': 44,
  'type': 0
}, {
  'id': 32,
  'predecessorId': 44,
  'successorId': 45,
  'type': 0
}, {
  'id': 33,
  'predecessorId': 45,
  'successorId': 46,
  'type': 0
}, {
  'id': 34,
  'predecessorId': 46,
  'successorId': 47,
  'type': 0
}, {
  'id': 35,
  'predecessorId': 47,
  'successorId': 48,
  'type': 0
}, {
  'id': 36,
  'predecessorId': 53,
  'successorId': 54,
  'type': 0
}, {
  'id': 37,
  'predecessorId': 54,
  'successorId': 55,
  'type': 0
}, {
  'id': 38,
  'predecessorId': 55,
  'successorId': 56,
  'type': 0
}, {
  'id': 39,
  'predecessorId': 56,
  'successorId': 57,
  'type': 0
}, {
  'id': 40,
  'predecessorId': 59,
  'successorId': 60,
  'type': 0
}, {
  'id': 41,
  'predecessorId': 60,
  'successorId': 61,
  'type': 0
}, {
  'id': 42,
  'predecessorId': 61,
  'successorId': 62,
  'type': 0
}, {
  'id': 43,
  'predecessorId': 63,
  'successorId': 64,
  'type': 0
}, {
  'id': 44,
  'predecessorId': 64,
  'successorId': 65,
  'type': 0
}, {
  'id': 45,
  'predecessorId': 65,
  'successorId': 66,
  'type': 0
}, {
  'id': 46,
  'predecessorId': 66,
  'successorId': 67,
  'type': 0
}, {
  'id': 47,
  'predecessorId': 69,
  'successorId': 70,
  'type': 0
}, {
  'id': 48,
  'predecessorId': 70,
  'successorId': 71,
  'type': 0
}, {
  'id': 49,
  'predecessorId': 71,
  'successorId': 72,
  'type': 0
}, {
  'id': 50,
  'predecessorId': 72,
  'successorId': 73,
  'type': 0
}, {
  'id': 51,
  'predecessorId': 73,
  'successorId': 74,
  'type': 0
}, {
  'id': 52,
  'predecessorId': 74,
  'successorId': 76,
  'type': 0
}, {
  'id': 53,
  'predecessorId': 76,
  'successorId': 77,
  'type': 0
}, {
  'id': 54,
  'predecessorId': 77,
  'successorId': 78,
  'type': 0
}, {
  'id': 55,
  'predecessorId': 78,
  'successorId': 79,
  'type': 0
}, {
  'id': 56,
  'predecessorId': 79,
  'successorId': 80,
  'type': 0
}, {
  'id': 57,
  'predecessorId': 80,
  'successorId': 81,
  'type': 0
}, {
  'id': 58,
  'predecessorId': 81,
  'successorId': 83,
  'type': 0
}, {
  'id': 59,
  'predecessorId': 83,
  'successorId': 84,
  'type': 0
}, {
  'id': 60,
  'predecessorId': 84,
  'successorId': 85,
  'type': 0
}, {
  'id': 61,
  'predecessorId': 85,
  'successorId': 86,
  'type': 0
}, {
  'id': 62,
  'predecessorId': 86,
  'successorId': 87,
  'type': 0
}];

export const resources = [{
  'id': 1,
  'text': 'Management'
}, {
  'id': 2,
  'text': 'Project Manager'
}, {
  'id': 3,
  'text': 'Analyst'
}, {
  'id': 4,
  'text': 'Developer'
}, {
  'id': 5,
  'text': 'Testers'
}, {
  'id': 6,
  'text': 'Trainers'
}, {
  'id': 7,
  'text': 'Technical Communicators'
}, {
  'id': 8,
  'text': 'Deployment Team'
}];

export const resourceAssignments = [{
  'id': 0,
  'taskId': 3,
  'resourceId': 1
}, {
  'id': 1,
  'taskId': 4,
  'resourceId': 1
}, {
  'id': 2,
  'taskId': 5,
  'resourceId': 2
}, {
  'id': 3,
  'taskId': 6,
  'resourceId': 2
}, {
  'id': 4,
  'taskId': 9,
  'resourceId': 3
}, {
  'id': 5,
  'taskId': 10,
  'resourceId': 3
}, {
  'id': 6,
  'taskId': 11,
  'resourceId': 2
}, {
  'id': 7,
  'taskId': 12,
  'resourceId': 2
}, {
  'id': 8,
  'taskId': 12,
  'resourceId': 3
}, {
  'id': 9,
  'taskId': 13,
  'resourceId': 3
}, {
  'id': 10,
  'taskId': 14,
  'resourceId': 2
}, {
  'id': 11,
  'taskId': 15,
  'resourceId': 1
}, {
  'id': 12,
  'taskId': 15,
  'resourceId': 2
}, {
  'id': 13,
  'taskId': 16,
  'resourceId': 2
}, {
  'id': 14,
  'taskId': 19,
  'resourceId': 3
}, {
  'id': 15,
  'taskId': 20,
  'resourceId': 3
}, {
  'id': 16,
  'taskId': 21,
  'resourceId': 3
}, {
  'id': 17,
  'taskId': 22,
  'resourceId': 1
}, {
  'id': 18,
  'taskId': 23,
  'resourceId': 1
}, {
  'id': 19,
  'taskId': 24,
  'resourceId': 1
}, {
  'id': 20,
  'taskId': 24,
  'resourceId': 2
}, {
  'id': 21,
  'taskId': 27,
  'resourceId': 4
}, {
  'id': 22,
  'taskId': 28,
  'resourceId': 4
}, {
  'id': 23,
  'taskId': 29,
  'resourceId': 4
}, {
  'id': 24,
  'taskId': 30,
  'resourceId': 4
}, {
  'id': 25,
  'taskId': 31,
  'resourceId': 4
}, {
  'id': 26,
  'taskId': 34,
  'resourceId': 5
}, {
  'id': 27,
  'taskId': 35,
  'resourceId': 5
}, {
  'id': 28,
  'taskId': 37,
  'resourceId': 5
}, {
  'id': 29,
  'taskId': 38,
  'resourceId': 5
}, {
  'id': 30,
  'taskId': 39,
  'resourceId': 5
}, {
  'id': 31,
  'taskId': 40,
  'resourceId': 5
}, {
  'id': 32,
  'taskId': 41,
  'resourceId': 5
}, {
  'id': 33,
  'taskId': 44,
  'resourceId': 5
}, {
  'id': 34,
  'taskId': 45,
  'resourceId': 5
}, {
  'id': 35,
  'taskId': 46,
  'resourceId': 5
}, {
  'id': 36,
  'taskId': 47,
  'resourceId': 5
}, {
  'id': 37,
  'taskId': 50,
  'resourceId': 6
}, {
  'id': 38,
  'taskId': 51,
  'resourceId': 6
}, {
  'id': 39,
  'taskId': 52,
  'resourceId': 6
}, {
  'id': 40,
  'taskId': 53,
  'resourceId': 6
}, {
  'id': 41,
  'taskId': 54,
  'resourceId': 6
}, {
  'id': 42,
  'taskId': 55,
  'resourceId': 6
}, {
  'id': 43,
  'taskId': 56,
  'resourceId': 6
}, {
  'id': 44,
  'taskId': 59,
  'resourceId': 7
}, {
  'id': 45,
  'taskId': 60,
  'resourceId': 7
}, {
  'id': 46,
  'taskId': 61,
  'resourceId': 7
}, {
  'id': 47,
  'taskId': 62,
  'resourceId': 7
}, {
  'id': 48,
  'taskId': 63,
  'resourceId': 7
}, {
  'id': 49,
  'taskId': 64,
  'resourceId': 7
}, {
  'id': 50,
  'taskId': 65,
  'resourceId': 7
}, {
  'id': 51,
  'taskId': 66,
  'resourceId': 7
}, {
  'id': 52,
  'taskId': 69,
  'resourceId': 2
}, {
  'id': 53,
  'taskId': 71,
  'resourceId': 8
}, {
  'id': 54,
  'taskId': 72,
  'resourceId': 8
}, {
  'id': 55,
  'taskId': 73,
  'resourceId': 8
}, {
  'id': 56,
  'taskId': 76,
  'resourceId': 8
}, {
  'id': 57,
  'taskId': 77,
  'resourceId': 8
}, {
  'id': 58,
  'taskId': 78,
  'resourceId': 8
}, {
  'id': 59,
  'taskId': 79,
  'resourceId': 8
}, {
  'id': 60,
  'taskId': 80,
  'resourceId': 8
}, {
  'id': 61,
  'taskId': 83,
  'resourceId': 2
}, {
  'id': 62,
  'taskId': 84,
  'resourceId': 2
}, {
  'id': 63,
  'taskId': 85,
  'resourceId': 2
}];

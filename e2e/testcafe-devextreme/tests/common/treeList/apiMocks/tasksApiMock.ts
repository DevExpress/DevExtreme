import { RequestMock } from 'testcafe';

export const tasksApiMock = RequestMock()
  .onRequestTo(/\/api\/data\?filter=%5B%22Task_Parent_ID%22%2C%22%3D%22%2C0%5D/)
  .respond(
    {
      data: [
        {
          Task_ID: 1,
          Task_Parent_ID: 0,
          Task_Assigned_Employee_ID: 1,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Plans 2015',
          Task_Start_Date: '2015-01-01T00:00:00',
          Task_Due_Date: '2015-04-01T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: true,
        },
        {
          Task_ID: 2,
          Task_Parent_ID: 0,
          Task_Assigned_Employee_ID: 2,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Health Insurance',
          Task_Start_Date: '2015-02-12T00:00:00',
          Task_Due_Date: '2015-05-30T00:00:00',
          Task_Status: 'In Progress',
          Task_Priority: 3,
          Task_Completion: 75,
          Has_Items: true,
        },
      ],
      totalCount: -1,
      groupCount: -1,
      summary: null,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?filter=%5B%22Task_Parent_ID%22%2C%22%3D%22%2C1%5D/)
  .respond(
    {
      data: [
        {
          Task_ID: 28,
          Task_Parent_ID: 1,
          Task_Assigned_Employee_ID: 7,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Prepare 2015 Financial',
          Task_Start_Date: '2015-01-15T00:00:00',
          Task_Due_Date: '2015-01-31T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: false,
        },
        {
          Task_ID: 29,
          Task_Parent_ID: 1,
          Task_Assigned_Employee_ID: 4,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Prepare 2015 Marketing Plan',
          Task_Start_Date: '2015-01-01T00:00:00',
          Task_Due_Date: '2015-01-31T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: true,
        },
        {
          Task_ID: 42,
          Task_Parent_ID: 1,
          Task_Assigned_Employee_ID: 3,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Deliver R&D Plans for 2015',
          Task_Start_Date: '2015-03-01T00:00:00',
          Task_Due_Date: '2015-03-10T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: true,
        },
      ],
      totalCount: -1,
      groupCount: -1,
      summary: null,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?filter=%5B%5B%22Task_Subject%22%2C%22contains%22%2C%22google%22%5D%2C%22or%22%2C%5B%22Task_Status%22%2C%22contains%22%2C%22google%22%5D%5D/)
  .respond(
    {
      data: [
        {
          Task_ID: 32,
          Task_Parent_ID: 29,
          Task_Assigned_Employee_ID: 1,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 4,
          Task_Subject: 'Google AdWords Strategy',
          Task_Start_Date: '2015-02-16T00:00:00',
          Task_Due_Date: '2015-02-28T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: false,
        },
      ],
      totalCount: -1,
      groupCount: -1,
      summary: null,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?filter=%5B%22Task_ID%22%2C%22%3D%22%2C29%5D/)
  .respond(
    {
      data: [
        {
          Task_ID: 29,
          Task_Parent_ID: 1,
          Task_Assigned_Employee_ID: 4,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Prepare 2015 Marketing Plan',
          Task_Start_Date: '2015-01-01T00:00:00',
          Task_Due_Date: '2015-01-31T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: true,
        },
      ],
      totalCount: -1,
      groupCount: -1,
      summary: null,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?filter=%5B%22Task_ID%22%2C%22%3D%22%2C1%5D/)
  .respond(
    {
      data: [
        {
          Task_ID: 1,
          Task_Parent_ID: 0,
          Task_Assigned_Employee_ID: 1,
          Task_Assigned_Employee: null,
          Task_Owner_ID: 1,
          Task_Subject: 'Plans 2015',
          Task_Start_Date: '2015-01-01T00:00:00',
          Task_Due_Date: '2015-04-01T00:00:00',
          Task_Status: 'Completed',
          Task_Priority: 3,
          Task_Completion: 100,
          Has_Items: true,
        },
      ],
      totalCount: -1,
      groupCount: -1,
      summary: null,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  );

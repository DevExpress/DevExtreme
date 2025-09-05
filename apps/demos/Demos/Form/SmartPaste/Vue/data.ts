export const AzureOpenAIConfig = {
  dangerouslyAllowBrowser: true,
  deployment: 'gpt-4o-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

export const defaultText = `Payment: Amount - $123.00
Statement Date: 10/15/2024
Name: John Smith
Contact: (123) 456-7890
Email: john@myemail.com
Address:
- 123 Elm St Apt 4B
- New York, NY 10001
`;

const employee = {
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
  BirthDate: '1964/03/16',
  HireDate: '1995/01/15',
  Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
  Address: '351 S Hill St., Los Angeles, CA',
  Phone: '360-684-1334',
  Email: 'jheart@dx-email.com',
};

const positions = [
  'HR Manager',
  'IT Manager',
  'CEO',
  'Controller',
  'Sales Manager',
  'Support Manager',
  'Shipping Manager',
];

export default {
  getEmployee() {
    return employee;
  },
  getPositions() {
    return positions;
  },
};

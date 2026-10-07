const titles = ['Mr.', 'Mrs.', 'Ms.'];
const states = ['California', 'New York', 'Texas'];
const positions = ['CEO', 'Sales Assistant', 'CMO', 'Manager', 'Designer', 'Developer'];
export const AI_SERVICE_CONFIG = {
    dangerouslyAllowBrowser: true,
    deployment: 'demo-mini',
    endpoint: 'https://public-api.devexpress.com/demo-openai',
    apiVersion: '2024-02-01',
    apiKey: 'DEMO',
};
export class ChatCommandError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ChatCommandError';
        Object.setPrototypeOf(this, ChatCommandError.prototype);
    }
}
export const emptyViewMessage = 'How can I help with this page?';
export const employee = {
    ID: 1,
    Prefix: 'Mr.',
    FirstName: 'John',
    LastName: 'Heart',
    Position: 'CEO',
    State: 'California',
    BirthDate: '1964/03/16',
};
export const tasks = [
    {
        ID: 5,
        Subject: 'Choose between PPO and HMO Health Plan',
        StartDate: '2026/02/15',
        DueDate: '2026/04/15',
        Status: 'In Progress',
        Priority: 'Low',
        Completion: 75,
        EmployeeID: 1,
    },
    {
        ID: 6,
        Subject: 'Google AdWords Strategy',
        StartDate: '2026/02/16',
        DueDate: '2026/02/28',
        Status: 'Completed',
        Priority: 'High',
        Completion: 100,
        EmployeeID: 1,
    },
    {
        ID: 7,
        Subject: 'New Brochures',
        StartDate: '2026/02/17',
        DueDate: '2026/02/24',
        Status: 'Completed',
        Priority: 'Normal',
        Completion: 100,
        EmployeeID: 1,
    },
    {
        ID: 22,
        Subject: 'Update NDA Agreement',
        StartDate: '2026/03/14',
        DueDate: '2026/03/16',
        Status: 'Completed',
        Priority: 'High',
        Completion: 100,
        EmployeeID: 1,
    },
    {
        ID: 52,
        Subject: 'Review Product Recall Report by Engineering Team',
        StartDate: '2026/05/17',
        DueDate: '2026/05/20',
        Status: 'Completed',
        Priority: 'High',
        Completion: 100,
        EmployeeID: 1,
    },
];
export const formFieldsConfig = [
    { dataField: 'Prefix', label: { text: 'Title' }, editorType: 'dxSelectBox', editorOptions: { items: titles, searchEnabled: true }, aiOptions: { instruction: 'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a title is explicitly mentioned in the text. Never use this field for any part of a person\'s name.' } },
    { dataField: 'FirstName', label: { text: 'First Name' }, aiOptions: { instruction: "Only fill this field if the text clearly refers to a person's given name. Never use grid/task-related words like Subject, Priority, Status, Due Date, Completion, or generic verbs like sort/filter/show as a name." } },
    { dataField: 'LastName', label: { text: 'Last Name' }, aiOptions: { instruction: "If the text gives a full person name (e.g. 'customer name', 'employee name') without separately labeled first/last names, use only the first word as First Name and the rest of the name as Last Name." } },
    { dataField: 'Position', label: { text: 'Position' }, editorType: 'dxSelectBox', editorOptions: { items: positions, searchEnabled: true }, aiOptions: { instruction: "Only fill this field with one of the allowed job position values if the text explicitly refers to the employee's own job title/role." } },
    { dataField: 'State', label: { text: 'State' }, editorType: 'dxSelectBox', editorOptions: { items: states, searchEnabled: true }, aiOptions: { instruction: "Only fill this field with one of the allowed US state values if the text explicitly refers to the employee's home/office state." } },
    { dataField: 'BirthDate', label: { text: 'Birth Date' }, editorType: 'dxDateBox', editorOptions: { displayFormat: 'M/d/yyyy' }, aiOptions: { instruction: "Only fill this field if the text explicitly refers to the employee's own birth date or date of birth." } },
];
export const formFieldOptions = formFieldsConfig.map(({ dataField, label }) => ({
    dataField: dataField ?? '',
    label: label?.text ?? dataField ?? '',
}));

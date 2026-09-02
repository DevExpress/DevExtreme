const CLASSES = {
  clearChatButton: "ai-chat-clear-button",
};

const deployment = "demo-mini";
const apiVersion = "2024-02-01";
const endpoint = "https://public-api.devexpress.com/demo-openai";
const apiKey = "DEMO";

const emptyViewMessage = "How can I help with this page?";
const emptyViewPrompt =
  "Update employee <b>Form</b> fields.\nFilter or sort tasks, display or hide <b>DataGrid</b> columns, or clear all filters and sorting."

const titles = ["Mr.", "Mrs.", "Ms."];
const colors = { High: "#F1BBBC", Normal: "#F9E2AE", Low: "#9FD89F" };
const states = ["California", "New York", "Texas"];
const positions = [
  "CEO",
  "Sales Assistant",
  "CMO",
  "Manager",
  "Designer",
  "Developer",
];

const employee = {
  ID: 1,
  Prefix: "Mr.",
  FirstName: "John",
  LastName: "Heart",
  Position: "CEO",
  State: "California",
  BirthDate: "1964/03/16",
};

const tasks = [
  {
    ID: 5,
    Subject: "Choose between PPO and HMO Health Plan",
    StartDate: "2026/02/15",
    DueDate: "2026/04/15",
    Status: "In Progress",
    Priority: "Low",
    Completion: 75,
    EmployeeID: 1,
  },
  {
    ID: 6,
    Subject: "Google AdWords Strategy",
    StartDate: "2026/02/16",
    DueDate: "2026/02/28",
    Status: "Completed",
    Priority: "High",
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 7,
    Subject: "New Brochures",
    StartDate: "2026/02/17",
    DueDate: "2026/02/24",
    Status: "Completed",
    Priority: "Normal",
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 22,
    Subject: "Update NDA Agreement",
    StartDate: "2026/03/14",
    DueDate: "2026/03/16",
    Status: "Completed",
    Priority: "High",
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 52,
    Subject: "Review Product Recall Report by Engineering Team",
    StartDate: "2026/05/17",
    DueDate: "2026/05/20",
    Status: "Completed",
    Priority: "High",
    Completion: 100,
    EmployeeID: 1,
  },
];

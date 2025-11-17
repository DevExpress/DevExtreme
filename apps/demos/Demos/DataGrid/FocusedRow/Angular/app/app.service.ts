import { Injectable } from '@angular/core';

export interface Employee {
  Employee_Full_Name: string;
}

export interface Task {
  Task_ID: number;

  Task_Subject: string;

  Task_Start_Date: string;

  Task_Status: string;

  Task_Description: string;

  Task_Completion: number | null;

  ResponsibleEmployee: Employee;
}

const tasks: Task[] = [
  {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 1,
    "Task_Subject": "Prepare 2013 Financial",
    "Task_Start_Date": "2013-01-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>IMPORTANT: The document must be fully formatted in Excel.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 2,
    "Task_Subject": "Prepare 3013 Marketing Plan",
    "Task_Start_Date": "2013-01-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We need to double revenues in 2013 and our marketing strategy is going to be key here. R&amp;D is improving existing products and creating new products so we can deliver great AV equipment to our customers.</div>\r\n\r\n<div>Robert, please make certain to create a PowerPoint presentation for the members of the executive team.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 3,
    "Task_Subject": "Update Personnel Files",
    "Task_Start_Date": "2013-02-03T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>In an audit I conducted of personnel files this, I found documentation to be lacking. Samantha, you need to review my report and get this fixed.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: John, I've completed this review and sent my report to you.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 4,
    "Task_Subject": "Review Health Insurance Options Under the Affordable Care Act",
    "Task_Start_Date": "2013-02-12T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>The changes in health insurance laws require that we review our existing coverage and update it to meet regulations. &nbsp;Samantha Bright will be point on this.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: Update - still working with the insurance company to update our coverages.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 5,
    "Task_Subject": "Choose between PPO and HMO Health Plan",
    "Task_Start_Date": "2013-02-15T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We need a final decision on whether we are planning on staying with a PPO Health Plan or we plan on switching to an HMO. We cannot proceed with compliance with the Affordable Health Act until we make this decision.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Samantha, I'm still reviewing costs. I am not in a position to make a final decision at this point.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 6,
    "Task_Subject": "Google AdWords Strategy",
    "Task_Start_Date": "2013-02-16T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Make final decision on whether we are going to increase our Google AdWord spend based on our 2013 marketing plan. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>We must seriously consider a higher spend if we are going to double revenues this year.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 7,
    "Task_Subject": "New Brochures",
    "Task_Start_Date": "2013-02-17T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Review and the new brochure designs and give final approval. &nbsp;</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: I've reviewed them all and forwarded an email with all changes we need to make to the brochures to comply with local regulations.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Morgan Kennedy",
    },
    "Task_ID": 8,
    "Task_Subject": "2013 Brochure Designs",
    "Task_Start_Date": "2013-02-19T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The changes we need to make to our 2013 brochures have been forwarded via Email please review and send updated versions to Robert Reagan.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Morgan Kennedy: This task has been completed. New designs are published on our server.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Violet Bailey",
    },
    "Task_ID": 9,
    "Task_Subject": "Brochure Design Review",
    "Task_Start_Date": "2013-02-19T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We have been instructed by management to modify brochure designs for 2013. All specifications and change requests are on the server.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Violet Bailey: What did you want me to do besides create the icons we'll be using in the brochure?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Morgan Kennedy: That's it. Thanks</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Violet Bailey",
    },
    "Task_ID": 10,
    "Task_Subject": "Website Re-Design Plan",
    "Task_Start_Date": "2013-02-19T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The changes in our brochure designs for 2013 require us to update key areas of our website. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Violet Bailey: I've completed the plan and have submitted it to Robert for his approval.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>&nbsp;</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 11,
    "Task_Subject": "Rollout of New Website and Marketing Brochures",
    "Task_Start_Date": "2013-02-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The designs for new brochures and website have been approved. Launch date is set for Feb 28.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Robert Reagan: Designers and IT departments have implemented all requirements. The rollout is complete.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 12,
    "Task_Subject": "Update Sales Strategy Documents",
    "Task_Start_Date": "2013-02-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Changes in marketing strategy require an update to our direct sales strategy. The report has to be completed by month's end to submission to the CEO.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: As you will see in my report, I do not recommend any major changes. </div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Jim Packard",
    },
    "Task_ID": 13,
    "Task_Subject": "Create 2012 Sales Report",
    "Task_Start_Date": "2013-02-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>2012 Sales Report has to be completed so we can determine if major changes are required to sales strategy. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Jim Packard: I've forwarded everything I have via Email. If you need anything else, please let em know.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Hannah Brookly",
    },
    "Task_ID": 14,
    "Task_Subject": "Direct vs Online Sales Comparison Report",
    "Task_Start_Date": "2013-02-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>To better understand 2013 sales strategy, we need to report 2012 direct vs online sales information to management.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Hannah Brookly: Jim, I created this a long time ago and I've forwarded it to you again. Let me know if it's sufficient.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 15,
    "Task_Subject": "Review 2012 Sales Report and Approve 2013 Plans",
    "Task_Start_Date": "2013-02-23T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>2012 Sales Reports along with detailed market comparisons are complete. Management needs to review and provide additional guidance.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Robert Reagan: We are in agreement with the recommendations in the report. You are go to execute plans.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 16,
    "Task_Subject": "Deliver R&D Plans for 2013",
    "Task_Start_Date": "2013-03-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Marketing strategy is set. R&amp;D needs to deliver a detailed report on product development plans along with final decisions as to which product lines will be terminated.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Arther Miller: I've submitted your reports. Need final approval.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 17,
    "Task_Subject": "Create 2013 R&D Plans",
    "Task_Start_Date": "2013-03-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Create 2013 R&amp;D Plan Report for CEO and include information on products under consideration and final decisions as to which products will be depracated.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Bart Arnaz: Done. You should review this Arthur as there are issues we need to consider.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Leah Simpson",
    },
    "Task_ID": 18,
    "Task_Subject": "2013 QA Strategy Report",
    "Task_Start_Date": "2013-03-02T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>In final stages of the 2013 R&amp;D Report to Management. Need QA strategy report asap. Remember, 2012 was a difficult year product quality-wise and we must step it up in 2013.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Leah Simpson: Bart, my apologies about 2012. My report includes remedies to issues we encountered.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Nat Maguiree",
    },
    "Task_ID": 19,
    "Task_Subject": "2013 Training Events",
    "Task_Start_Date": "2013-03-02T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to finalize 2013 Training Events. QA is under pressure to step it up in 2013 and without an effective training strategy for the field, QA problems will persist.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Nat Maguiree: Leah, we've forwarded our 2013 training schedule. We'll do our best to minimize issues in 2013.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Greta Sims",
    },
    "Task_ID": 20,
    "Task_Subject": "Approve Hiring of John Jeffers",
    "Task_Start_Date": "2013-03-02T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Review resume and non-compete with previous employer and give final approval to hire John Jeffers.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Greta Sims: We are unable to hire John. His non-compete is rock solid and he will not be able to perform his role as a product trainer for our company.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 21,
    "Task_Subject": "Non-Compete Agreements",
    "Task_Start_Date": "2013-03-12T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Make final decision on whether our employees should sign non-compete agreements. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: Greta, we discussed this and we feel it is unnecessary to require non-compete agreements for employees.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 22,
    "Task_Subject": "Update NDA Agreement",
    "Task_Start_Date": "2013-03-14T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need sign-off on the new NDA agreement. It's important that this is done quickly to prevent any unauthorized leaks.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Done. Please have Greta update employee files.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Greta Sims",
    },
    "Task_ID": 23,
    "Task_Subject": "Update Employee Files with New NDA",
    "Task_Start_Date": "2013-03-16T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div>Management has approved new NDA. All employees must sign the new NDA and their employee files must be updated.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Greta Sims: Having difficulty with a few employees. Will follow up by Email.</div>",
    "Task_Completion": 90,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 24,
    "Task_Subject": "Sign Updated NDA",
    "Task_Start_Date": "2013-03-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>You must sign updated NDA. Documents have been emailed to you. Once documents have been signed, please retain one copy for your records and return one to HR for filing.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 25,
    "Task_Subject": "Sign Updated NDA",
    "Task_Start_Date": "2013-03-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>You must sign updated NDA. Documents have been emailed to you. Once documents have been signed, please retain one copy for your records and return one to HR for filing.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 26,
    "Task_Subject": "Sign Updated NDA",
    "Task_Start_Date": "2013-03-20T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div><font color=black>You must sign updated NDA. Documents have been emailed to you. Once documents have been signed, please retain one copy for your records and return one to HR for filing.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Ed Holmes: As discussed, I don't believe the new NDA is helpful for our sales strategy.</font></div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 27,
    "Task_Subject": "Sign Updated NDA",
    "Task_Start_Date": "2013-03-20T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div><font color=black>You must sign updated NDA. Documents have been emailed to you. Once documents have been signed, please retain one copy for your records and return one to HR for filing.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kelly Rodriguez",
    },
    "Task_ID": 28,
    "Task_Subject": "Submit Questions Regarding New NDA",
    "Task_Start_Date": "2013-03-21T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The new NDA is now required for employment. I need a list of questions or issues so we can submit all paperwork to HR.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kelly Rodriguez: I don\u2019t have any questions. Thank you.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "James Anderson",
    },
    "Task_ID": 29,
    "Task_Subject": "Submit Questions Regarding New NDA",
    "Task_Start_Date": "2013-03-21T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>The new NDA is now required for employment. I need a list of questions or issues so we can submit all paperwork to HR.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Antony Remmen",
    },
    "Task_ID": 30,
    "Task_Subject": "Submit Questions Regarding New NDA",
    "Task_Start_Date": "2013-03-21T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div><font color=black>The new NDA is now required for employment. I need a list of questions or issues so we can submit all paperwork to HR.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Anthony Remmen: My attorney suggests that I not sign this. </font></div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Victor Norris",
    },
    "Task_ID": 31,
    "Task_Subject": "Submit Signed NDA",
    "Task_Start_Date": "2013-03-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The new NDA must be signed for continued employment at DevAV. Do not ignore this task as you will be terminated if not signed. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>The sensitive nature of our job responsibilities demands that we hold ourselves to the highest standards.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Davey Jones",
    },
    "Task_ID": 32,
    "Task_Subject": "Submit Signed NDA",
    "Task_Start_Date": "2013-03-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>The new NDA must be signed for continued employment at DevAV. Do not ignore this task as you will be terminated if not signed. </font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>The sensitive nature of our job responsibilities demands that we hold ourselves to the highest standards.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Mary Stern",
    },
    "Task_ID": 33,
    "Task_Subject": "Submit Signed NDA",
    "Task_Start_Date": "2013-03-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>The new NDA must be signed for continued employment at DevAV. Do not ignore this task as you will be terminated if not signed. </font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>The sensitive nature of our job responsibilities demands that we hold ourselves to the highest standards.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robin Cosworth",
    },
    "Task_ID": 34,
    "Task_Subject": "Submit Signed NDA",
    "Task_Start_Date": "2013-03-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>The new NDA must be signed for continued employment at DevAV. Do not ignore this task as you will be terminated if not signed. </font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>The sensitive nature of our job responsibilities demands that we hold ourselves to the highest standards.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 35,
    "Task_Subject": "Update Revenue Projections",
    "Task_Start_Date": "2013-03-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Meeting with Board has been scheduled. Need final sales projections for 2013.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sandra Johnson: Report has been emailed to all stakeholders.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 36,
    "Task_Subject": "Review Revenue Projections",
    "Task_Start_Date": "2013-03-25T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Board requires 2013 Revenue Projection Report. Review sales reports and my projections and give final approval before I proceed.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: Done. You are 100% on target with the data.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Jim Packard",
    },
    "Task_ID": 37,
    "Task_Subject": "Comment on Revenue Projections",
    "Task_Start_Date": "2013-03-25T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Board requires 2013 Revenue Projection Report. Comment on sales reports and my projections and provide any additional information that might be relevant to management.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Hannah Brookly",
    },
    "Task_ID": 38,
    "Task_Subject": "Comment on Revenue Projections",
    "Task_Start_Date": "2013-03-25T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Board requires 2013 Revenue Projection Report. Comment on sales reports and my projections and provide any additional information that might be relevant to management.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Todd Hoffman",
    },
    "Task_ID": 39,
    "Task_Subject": "Comment on Revenue Projections",
    "Task_Start_Date": "2013-03-25T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div><font color=black>Board requires 2013 Revenue Projection Report. Comment on sales reports and my projections and provide any additional information that might be relevant to management.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Sandra Johnson: Todd, I need this information from you. You are holding up my report. I will have to go without your input if I do not receive it.</font></div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Greta Sims",
    },
    "Task_ID": 40,
    "Task_Subject": "Provide New Health Insurance Docs",
    "Task_Start_Date": "2013-03-28T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to get employees to sign new health insurance documents. Need final paperwork from agents.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Greta Sims: Cindy, this information was already sent to you. Do not create unnecessary tasks for me.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kevin Carter",
    },
    "Task_ID": 41,
    "Task_Subject": "Review Changes to Health Insurance Coverage",
    "Task_Start_Date": "2013-04-07T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Shipping department must review new health insurance policy and submit paperwork by the end of the month. If not submitted, coverage will terminate.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kevin Carter: All employees have submitted paperwork.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Victor Norris",
    },
    "Task_ID": 42,
    "Task_Subject": "Scan Health Insurance Forms",
    "Task_Start_Date": "2013-04-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>HR needs scanned copies of all signed documents for personnel files. Victor, you have to scan them for me as I'm just too busy.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Victor Norris: Done and forwarded by Email.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Mary Stern",
    },
    "Task_ID": 43,
    "Task_Subject": "Sign Health Insurance Forms",
    "Task_Start_Date": "2013-04-16T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Kevin asked me to collect all signed health insurance forms for him - he is too busy. Please get this done asap so I can get back to my regular job.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Mary Stern: Done and Email sent.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Davey Jones",
    },
    "Task_ID": 44,
    "Task_Subject": "Sign Health Insurance Forms",
    "Task_Start_Date": "2013-04-16T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Kevin asked me to collect all signed health insurance forms for him - he is too busy. Please get this done asap so I can get back to my regular job.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Davey Jones: Done and Email sent.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robin Cosworth",
    },
    "Task_ID": 45,
    "Task_Subject": "Sign Health Insurance Forms",
    "Task_Start_Date": "2013-04-16T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div><font color=black>Kevin asked me to collect all signed health insurance forms for him - he is too busy. Please get this done asap so I can get back to my regular job.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Robin Cosworth: I'm going with my husband's plan. This new plan is terrible and I don\u2019t want it.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "James Anderson",
    },
    "Task_ID": 46,
    "Task_Subject": "Follow up with West Coast Stores",
    "Task_Start_Date": "2013-04-18T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>The problem with the TVs has been confirmed with R&amp;D. We need to immediately follow up with West Coast Retailers and let them know so we do not get any returns.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>James Anderson: This is going to take me a long time to finish.</div>",
    "Task_Completion": 95,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kelly Rodriguez",
    },
    "Task_ID": 47,
    "Task_Subject": "Follow up with East Coast Stores",
    "Task_Start_Date": "2013-04-18T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div><font color=black>The problem with the TVs has been confirmed with R&amp;D. We need to immediately follow up with West Coast Retailers and let them know so we do not get any returns.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Kelly Rodriguez: Still working on this. Taking so much time. </font></div>",
    "Task_Completion": 85,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Antony Remmen",
    },
    "Task_ID": 48,
    "Task_Subject": "Send Email to Customers about Recall",
    "Task_Start_Date": "2013-04-18T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>The problem with the TVs has been confirmed with R&amp;D. We need to send an email to all customers who purchased the TV in the last 30 days.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Anthony Remmen: Done. Over 100 emails have been sent.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 49,
    "Task_Subject": "Submit Refund Report for 2013 Recall",
    "Task_Start_Date": "2013-04-25T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need a report on all customers who've been promised a refund as a result of the 2013 TV recall.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Barb Banks: Sent by Email. I know, this is going to hurt our bottom-line.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 50,
    "Task_Subject": "Give Final Approval for Refunds",
    "Task_Start_Date": "2013-05-05T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Refunds as a result of our 2013 TV recalls have been submitted. Need final approval to cut checks to customers.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: You can send the checks out mid-May.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 51,
    "Task_Subject": "Prepare Product Recall Report",
    "Task_Start_Date": "2013-05-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Bart, this recall was an absolute disaster. Your report better be on my desk tomorrow. This is killing our bottom-line.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Bart Arnaz: Yes, it's unacceptable.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 52,
    "Task_Subject": "Review Product Recall Report by Engineering Team",
    "Task_Start_Date": "2013-05-17T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>John, everyone in Engineering is working hard to avoid any future recalls. Can you please review this report and send me your thoughts.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Very difficult situation. It should never have happened.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Nat Maguiree",
    },
    "Task_ID": 53,
    "Task_Subject": "Create Training Course for New TVs",
    "Task_Start_Date": "2013-05-29T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>After the recall, customers have option to purchase new version of TV. You need to prepare training course for our retail partners so they can better understand the design changes.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Leah Simpson",
    },
    "Task_ID": 54,
    "Task_Subject": "Review Training Course for any Ommissions",
    "Task_Start_Date": "2013-06-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Leah, consider this most important item on your agenda. I need this new training material reviewed so it can be submitted to management.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Leah Simpson: I only found a few spelling mistakes.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 55,
    "Task_Subject": "Review Overtime Report",
    "Task_Start_Date": "2013-06-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Brett, way too much overtime being submitted by the IT department please review numbers and get with management and tell me long term decision on this matter.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Taylor Riley",
    },
    "Task_ID": 56,
    "Task_Subject": "Submit Overtime Request Forms",
    "Task_Start_Date": "2013-06-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Taylor, you are working too many hours and management wants to stop it. You cannot work this much overtime. Send me the report so I can kick it up to HR.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>They need you to justify your hours.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Amelia Harper",
    },
    "Task_ID": 57,
    "Task_Subject": "Submit Overtime Request Forms",
    "Task_Start_Date": "2013-06-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Amelia, you are working too many hours and management wants to stop it. You cannot work this much overtime. Send me the report so I can kick it up to HR.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>They need you to justify your hours.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Wally Hobbs",
    },
    "Task_ID": 58,
    "Task_Subject": "Submit Overtime Request Forms",
    "Task_Start_Date": "2013-06-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Wally, you are working too many hours and management wants to stop it. You cannot work this much overtime. Send me the report so I can kick it up to HR.</font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>They need you to justify your hours.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 59,
    "Task_Subject": "Overtime Approval Guidelines",
    "Task_Start_Date": "2013-06-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Samantha, we cannot keep going like this. Everytime my people send overtime request, we get hassled. Can you please send me the definitive guide as to when people can submit overtime?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: Done. Check Email.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 60,
    "Task_Subject": "Refund Request Template",
    "Task_Start_Date": "2013-06-17T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>We need to update the refund request template as I keep getting asked questions from confused customers. Is this something we can do this week?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: I've asked for input from legal. For now it's status quo.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 61,
    "Task_Subject": "Recall Rebate Form",
    "Task_Start_Date": "2013-06-17T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>I don\u2019t think we can keep sending our existing rebate forms. Like the refund request forms, customers are confused by all the legal language and they refuse to sign it.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: We have nothing from legal on this and so we have to keep doing what we've been doing.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sammy Hill",
    },
    "Task_ID": 62,
    "Task_Subject": "Create Report on Customer Feedback",
    "Task_Start_Date": "2013-06-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Ed asked me to get with you and prepare a full report of all questions being asked by customers about the recall and refund request forms. Legal does not want to take any action until we submit this.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sammy Hill: This is crazy. I don\u2019t understand why legal does not change the language.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 63,
    "Task_Subject": "Review Customer Feedback Report",
    "Task_Start_Date": "2013-06-30T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The problems with our recall and refund request forms are real. Sale staff are overwhelmed and are answering the same questions over and over again. Need a solution from legal.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 64,
    "Task_Subject": "Customer Feedback Report Analysis",
    "Task_Start_Date": "2013-07-05T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>We've analyzed all complaints submitted to sales staff. The problems are real and a solution is needed. Kicking this up to you John as legal simply will not budge.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Ed, I'm with legal on this. Tell the sales staff to keep doing what they are doing.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kevin Carter",
    },
    "Task_ID": 65,
    "Task_Subject": "Prepare Shipping Cost Analysis Report",
    "Task_Start_Date": "2013-07-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Management needs to see which shipping company is giving us the best bang for our buck. Need the report asap as we have to commit to one shipper soon.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kevin Carter: They are all the same, but the report has been prepared nonetheless.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Davey Jones",
    },
    "Task_ID": 66,
    "Task_Subject": "Provide Feedback on Shippers",
    "Task_Start_Date": "2013-07-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to know which shipping companies you prefer to work. Looks like costs are all coming in the same so I think we just need to pick the one that offers the best services.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Mary Stern",
    },
    "Task_ID": 67,
    "Task_Subject": "Provide Feedback on Shippers",
    "Task_Start_Date": "2013-07-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Need to know which shipping companies you prefer to work. Looks like costs are all coming in the same so I think we just need to pick the one that offers the best services.</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robin Cosworth",
    },
    "Task_ID": 68,
    "Task_Subject": "Provide Feedback on Shippers",
    "Task_Start_Date": "2013-07-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Need to know which shipping companies you prefer to work. Looks like costs are all coming in the same so I think we just need to pick the one that offers the best services.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Robin Cosworth: You already know my opinion Kevin. Why keep asking me about this?</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 69,
    "Task_Subject": "Select Preferred Shipper",
    "Task_Start_Date": "2013-07-16T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>All cost analysis reports have been prepared. I've also submitted personal opinions on all the shippers we've dealt with. We need a final decision so I can negotiate final contract.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: This is not just up to me. Will take it CEO.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 70,
    "Task_Subject": "Complete Shipper Selection Form",
    "Task_Start_Date": "2013-07-21T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>John, the natives are getting restless. You need to make a final decision on the shipper we are going to go with. I don\u2019t know why we can't choose a single shipper?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Samantha, we've been through this. We need to work with multiple shippers</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 71,
    "Task_Subject": "Upgrade Server Hardware",
    "Task_Start_Date": "2013-07-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Website traffic has doubled. We must upgrade server hardware or customers will continue to experience difficulties ordering. We need a decision by end of month.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: You request has been approved.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 72,
    "Task_Subject": "Upgrade Personal Computers",
    "Task_Start_Date": "2013-07-24T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>It's end-of-life for Windows XP. We either have to upgrade everyone's computers or upgrade the OS on existing customers. We need a final decision from management to proceed.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: We will upgrade computers one at a time through April 2014.</div>",
    "Task_Completion": 85,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 73,
    "Task_Subject": "Approve Personal Computer Upgrade Plan",
    "Task_Start_Date": "2013-07-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Windows XP is finished and we need to know if we are going to upgrade hardware or simply update OS. IT department has a lot of work ahead of it and the sooner we know, the better it will be for everyone.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 74,
    "Task_Subject": "Decide on Mobile Devices to Use in the Field",
    "Task_Start_Date": "2013-07-30T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We need to decide whether we are going to use Surface tablets in the field or go with iPad. I've prepared the pros and cons based on feedback from everyon in the IT dept. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Arthur Miller: Surface</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 75,
    "Task_Subject": "Upgrade Apps to Windows RT or stay with WinForms",
    "Task_Start_Date": "2013-08-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to decide if we are going to re-write apps as Metro apps or simply touch-enable our existing apps. Obviously the former is going to take a lot of time.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: Definitely use DevExpress Controls and upgrade to touch-enabled - do not rewrite anything</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Karen Goodson",
    },
    "Task_ID": 76,
    "Task_Subject": "Estimate Time Required to Touch-Enable Apps",
    "Task_Start_Date": "2013-08-05T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Management has decided to stick with existing apps. We simply need to make them touch-enabled for the new Surface Tablets being distributed to the field. Can you get me an estimate?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Karen Goodson: Bard, they are already touch-enabled. We are using DevExpress WinForms Controls</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Wally Hobbs",
    },
    "Task_ID": 77,
    "Task_Subject": "Report on Tranistion to Touch-Based Apps",
    "Task_Start_Date": "2013-08-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Wally, I've given the approval to go with touch-based apps on WinForms vs complete re-write. I need your report as to when the apps are going to be ready to deploy to the field.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Wally Hobbs: Brett, the apps are already touch-enabled. We didn\u2019t have to do anything.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 78,
    "Task_Subject": "Try New Touch-Enabled WinForms Apps",
    "Task_Start_Date": "2013-08-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The field will get this rolled out next week. You should try the apps on the new Surface tablets and give me your thoughts. We did not re-write anything - the app was already touch-enabled because we used DevExpress UI Controls.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Arthur Miller: Works like a charm.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brad Jameson",
    },
    "Task_ID": 79,
    "Task_Subject": "Rollout New Touch-Enabled WinForms Apps",
    "Task_Start_Date": "2013-08-17T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are go to rollout the new WinForms apps to all Surface tablets used in the field. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brade Jameson: I'm going to mark this as an on-going task for me to do throughout 2013 and 2014.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 80,
    "Task_Subject": "Site Up-Time Report",
    "Task_Start_Date": "2013-08-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to see site up-time reports. Online sales have taken a big dive and we think it's because the site is not reliable.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: The site has 100% uptime. Don\u2019t think this is the problem with sales.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 81,
    "Task_Subject": "Review Site Up-Time Report",
    "Task_Start_Date": "2013-08-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Robert, as you'll see by this report, the drop in online sales is not a result of site up-time. You should review this with John and tell me what you want us to do. </div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 82,
    "Task_Subject": "Review Online Sales Report",
    "Task_Start_Date": "2013-08-30T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>The dip in online sales is not a result of website reliability. The issue is a marketing one and we need to discuss how to update our marketing content so we can get sales back on track.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: You told me it was because of website reliability. This is not good Robert.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 83,
    "Task_Subject": "Determine New Online Marketing Strategy",
    "Task_Start_Date": "2013-09-03T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Online sales are a disaster. We need to rework our entire marketing message and spend a lot of money on ad-words to generate more traffic to our site. We have great products. I don\u2019t understand the problem.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: You know the reason. We had a recall a couple of months back.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Hannah Brookly",
    },
    "Task_ID": 84,
    "Task_Subject": "New Online Marketing Strategy",
    "Task_Start_Date": "2013-09-05T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We need to do something to stop the fall in online sales right away. Management is putting a lot of pressure on me and I don\u2019t know exactly what to do. Send me a report with your opinions.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Hannah Brookly: Report Emailed to you.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 85,
    "Task_Subject": "Approve New Online Marketing Strategy",
    "Task_Start_Date": "2013-09-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We have prepared a detailed report of all options to improve online sales. We have 3 major recommendations and I need the ok to pursue this with the IT and design teams.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Robert Reagan: Approved, go ahead and start</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Morgan Kennedy",
    },
    "Task_ID": 86,
    "Task_Subject": "Submit New Website Design",
    "Task_Start_Date": "2013-09-17T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>New marketing strategy has been approved by management. I need a new website design.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Morgan Kennedy: We worked 24/7 and prepared this in record time.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Violet Bailey",
    },
    "Task_ID": 87,
    "Task_Subject": "Create Icons for Website",
    "Task_Start_Date": "2013-09-17T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Im in a tough spot as management wants the new design right away. I need you to take the lead and create all the icons we are going to need for the new site. Send it to me asap.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Violet Bailey: Done, sent by Email.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 88,
    "Task_Subject": "Review PSDs for New Website",
    "Task_Start_Date": "2013-09-23T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Brett, we've done all we can in the design department. You have all the PSDs. It's now up to you to create and deploy the new online sales portal. Good luck.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: I'm on it. Thanks for all the hard work.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brad Jameson",
    },
    "Task_ID": 89,
    "Task_Subject": "Create New Shopping Cart",
    "Task_Start_Date": "2013-09-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>You have the PSDs from the design team. I need the cart updated. Management wants this done immediately so we can roll out by October 15.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Karen Goodson",
    },
    "Task_ID": 90,
    "Task_Subject": "Create New Product Pages",
    "Task_Start_Date": "2013-09-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>You have the PSDs from the design team. I need the product pages updated. Management wants this done immediately so we can roll out by Octover 15.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Karen Goodson: I'm going to have a lot of overtime this week.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 91,
    "Task_Subject": "Review New Product Pages",
    "Task_Start_Date": "2013-10-04T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Karen published the new product pages on our sandbox server. Can you take a look and give your thoughts. Is it what you wanted? I'm not sure that I like it that much.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: Yes, I love it.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robert Reagan",
    },
    "Task_ID": 92,
    "Task_Subject": "Approve Website Launch",
    "Task_Start_Date": "2013-10-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Everything is in place Robert. You are the final approval for us to launch the new website. Please give me the OK so I can get this done.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Robert Reagan: You have the OK to go live.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 93,
    "Task_Subject": "Launch New Website",
    "Task_Start_Date": "2013-10-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>You are good to go Brett. Launch the website and track first day activities. Send me a report once you have everything ready.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>&nbsp;</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Victor Norris",
    },
    "Task_ID": 94,
    "Task_Subject": "Update Customer Shipping Profiles",
    "Task_Start_Date": "2013-10-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Problems with new website. We did not update shipping profiles and customers have no idea how to update personal information. Can you get on this asap?</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 95,
    "Task_Subject": "Create New Shipping Return Labels",
    "Task_Start_Date": "2013-10-21T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need a new RMA label for the website. I've requested this a few times but it keeps getting put off. Can we get this completed by the end of the month Brett? It's really important.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Wally Hobbs",
    },
    "Task_ID": 96,
    "Task_Subject": "Get Design for Shipping Return Labels",
    "Task_Start_Date": "2013-10-21T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Wally, you are point to create the new RMA labels for the website. We are under pressure from the shipping department to get this done by month's end. Get with the design department and deploy it by the end of the month.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Violet Bailey",
    },
    "Task_ID": 97,
    "Task_Subject": "PSD needed for Shipping Return Labels",
    "Task_Start_Date": "2013-10-22T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Violet, Im behind the 8 ball on this one. I need a new design for our RMA labels. Can you please send me the artwork. I've uploaded the specs to the server.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Violet Bailey: Not a problem Wally</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 98,
    "Task_Subject": "Request Bandwidth Increase from ISP",
    "Task_Start_Date": "2013-11-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Getting a lot of complaints from users about slow connection speeds. I've checked with our ISP and we can upgrade to a faster access plan.</div>\r\n\r\n<div>&nbsp;</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 99,
    "Task_Subject": "Submit D&B Number to ISP for Credit Approval",
    "Task_Start_Date": "2013-11-04T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Our ISP is not willing to upgrade our access plan because they are concerned about our payment history. Sandra, please get them our D&amp;B # so they can check our credit history.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sandra Johnson: They are crazy. We pay our bills on time. I'll deal with this.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 100,
    "Task_Subject": "Contact ISP and Discuss Payment Options",
    "Task_Start_Date": "2013-11-05T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>ISP is being difficult and refusing to increase our bandwidth because they say our credit is not good. Can you please get in touch with Herb Heart and resolve this. I don\u2019t have much more information that I can provide them.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Brigh: We are good Sandra. They OK'd it.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "James Anderson",
    },
    "Task_ID": 101,
    "Task_Subject": "Prepare Year-End Support Summary Report",
    "Task_Start_Date": "2013-11-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need a summary of all major support issues we encountered this year. This report will be presented to management. You are the point person on this James. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>James Anderson: I'm on it Barb.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Antony Remmen",
    },
    "Task_ID": 102,
    "Task_Subject": "Analyze Support Traffic for 2013",
    "Task_Start_Date": "2013-11-11T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Antony, we are being pushed to get the a support issues report delivered before year end. Can you aggragate all of our data so I can compile it and send it over to Barb?</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Leah Simpson",
    },
    "Task_ID": 103,
    "Task_Subject": "Review New Training Material",
    "Task_Start_Date": "2013-11-14T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Just getting ready to push out some new training material for our customers so they can better understand how our product line fits together. &nbsp;Can I get a review of the content so I can send it out to the printer?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Leah Simpson: Nat, I've reviewed everything and it looks really nice. </div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Nat Maguiree",
    },
    "Task_ID": 104,
    "Task_Subject": "Distribute Training Material to Support Staff",
    "Task_Start_Date": "2013-11-18T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Please distribute new training material to all support staff. The information is very useful and I believe it will help us address issues in a more effective manner.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 105,
    "Task_Subject": "Training Material Distribution Schedule",
    "Task_Start_Date": "2013-11-30T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>I am in the process of publishing my new training material. It will be posted to the server. Please see that all support engineers have access to them. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Barb Banks: This is great Nat, we've needed this for some time.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Morgan Kennedy",
    },
    "Task_ID": 106,
    "Task_Subject": "Provide New Artwork to Support Team",
    "Task_Start_Date": "2013-12-03T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We need to get new artwork and PDFs for the support team. We are currently using out-dated materials. Can you please publish them on our server\u2026</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Morgan Kennedy: I'll get my assistant to publish it for you.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Violet Bailey",
    },
    "Task_ID": 107,
    "Task_Subject": "Publish New Art on the Server",
    "Task_Start_Date": "2013-12-03T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Violet, please get all our new art published so that other teams can use them as necessary. I asked you to do this a week ago.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Violet Bailey: I already published it. I guess I put it in the wrong location.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sammy Hill",
    },
    "Task_ID": 108,
    "Task_Subject": "Replace Old Artwork with New Artwork",
    "Task_Start_Date": "2013-12-07T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Sammy - please replace all artwork / brochures / media being used for sales presentations with new materials produced by the graphic design team. If you have questions, ask me.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sammy Hill: Done</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Olivia Peyton",
    },
    "Task_ID": 109,
    "Task_Subject": "Replace Old Artwork with New Artwork",
    "Task_Start_Date": "2013-12-07T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Olivia - please replace all artwork / brochures / media being used for sales presentations with new materials produced by the graphic design team. If you have questions, ask me.</font></div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div><font color=black>Olivia Peyton: Done</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Lucy Ball",
    },
    "Task_ID": 110,
    "Task_Subject": "Replace Old Artwork with New Artwork",
    "Task_Start_Date": "2013-12-07T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div><font color=black>Lucy - please replace all artwork / brochures / media being used for sales presentations with new materials produced by the graphic design team. If you have questions, ask me.</font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>Lucy Ball: Done</font></div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 111,
    "Task_Subject": "Ship New Brochures to Field",
    "Task_Start_Date": "2013-12-19T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to receive 1000 new brochures so I can begin distributing it out to customer accounts that I manage. I've stopped using old brochures. Please forward new brochures to me asap.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: I will ask someone from shipping to send them out to you.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Victor Norris",
    },
    "Task_ID": 112,
    "Task_Subject": "Ship Brochures to Todd Hoffman",
    "Task_Start_Date": "2013-12-23T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Victor - we need new brochures sent out to Todd Hoffman. It's urgent as we are no longer using older brochures and he has sales calls to make.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Victor Norris: Overnighted 1000 brochures to him.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Amelia Harper",
    },
    "Task_ID": 113,
    "Task_Subject": "Update Server with Service Packs",
    "Task_Start_Date": "2013-12-24T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Going directly to you Amelia as Brett is out of the office. We have to update the server with newest service pack. This is highest priority.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Amelia Harper: Done</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Amelia Harper",
    },
    "Task_ID": 114,
    "Task_Subject": "Install New Database",
    "Task_Start_Date": "2013-12-27T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We are go on the new database. I need you to get it installed so we can begin company wide roll-out.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Amelia Harper: Brett, I will take care of this, but you need to approve overtime.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 115,
    "Task_Subject": "Approve Overtime for HR",
    "Task_Start_Date": "2013-12-29T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Submitted my overtime request to you for approval so I can walk it down to HR before the year end paycheck. I had no choice\u2026I had to work overtime to get the database rolled out.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: Approved and Emailed.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 116,
    "Task_Subject": "Review New HDMI Specification",
    "Task_Start_Date": "2014-01-02T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Bart, this is already delayed too long. I need your report on the new HDMI specification and how we plan on getting to market. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Bart Arnaz: I understand and I'm working on it. Getting input from Industry types.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 117,
    "Task_Subject": "Approval on Converting to New HDMI Specification",
    "Task_Start_Date": "2014-01-11T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>My report is not complete and in order to complete it, I need approval to invest $250K on new tooling for HDMI 2.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Arthur Miller: We must delay this spend. Too much at this time.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brad Jameson",
    },
    "Task_ID": 118,
    "Task_Subject": "Create New Spike for Automation Server",
    "Task_Start_Date": "2014-01-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>I need to see if this is a market we should enter and unless I get a spike, I wont know what to report to CEO.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brad Jameson: Ive forwarded information on what you need to execute the app.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Jim Packard",
    },
    "Task_ID": 119,
    "Task_Subject": "Report on Retail Sales Strategy for 2014",
    "Task_Start_Date": "2014-01-20T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need a detailed report on retail sales strategy for 2014. Management wants to significantly increase revenues this year and retail is our primary focus.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Jim Packard: You have the report, let me know if you have questions.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Karen Goodson",
    },
    "Task_ID": 120,
    "Task_Subject": "Code Review - New Automation Server",
    "Task_Start_Date": "2014-01-27T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need your eyes on the new Automation Server product. I'm having performance issues and you have to figure out what is causing it.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Karen Goodson: We need time to figure this out.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kelly Rodriguez",
    },
    "Task_ID": 121,
    "Task_Subject": "Feedback on New Training Course",
    "Task_Start_Date": "2014-01-28T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Kelly, I have not received your feedback on my new training course. Can you please send me an email asap so I can consider your comments?</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kevin Carter",
    },
    "Task_ID": 122,
    "Task_Subject": "Send Monthly Invoices from Shippers",
    "Task_Start_Date": "2014-02-01T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Im missing all invoices for this month and I cannot reconcile until I get them. Kevin, please remember to do this on a regular basis.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kevin Carter: Im sorry. I will take care of it.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Lucy Ball",
    },
    "Task_ID": 123,
    "Task_Subject": "Schedule Meeting with Sales Team",
    "Task_Start_Date": "2014-02-07T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Need to discuss new retail strategies with sales team. Please coordinate everything and make sure everyone is present.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Hannah Brookly",
    },
    "Task_ID": 124,
    "Task_Subject": "Confirm Availability for Sales Meeting",
    "Task_Start_Date": "2014-02-09T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>I've called you a few times Hannah, but no response. Retail sales meeting is mandatory but I'm told you are going to be out of town. Please advise.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Hannah Brookly: I will not be able to attend Lucy.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Gabe Jones",
    },
    "Task_ID": 125,
    "Task_Subject": "Reschedule Sales Team Meeting",
    "Task_Start_Date": "2014-02-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Hannah is unable to attend the meeting and unless you want to go without her, you will need to reschedule this.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Gabe Jones: Will reschedule.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Lucy Ball",
    },
    "Task_ID": 126,
    "Task_Subject": "Send 2 Remotes for Giveaways",
    "Task_Start_Date": "2014-02-15T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Running a contest in my region and will be giving away 2 remote controls. Can you send them to me asap.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Lucy Ball: Remotes on their way to you priority.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Mary Stern",
    },
    "Task_ID": 127,
    "Task_Subject": "Ship 2 Remotes Priority to Clark Morgan",
    "Task_Start_Date": "2014-02-16T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Please refer to my Email. We are doing a giveaway in Clark's region and we need to send 2 remotes.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Mary Stern: I already took care of this and have marked the task as completed.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Olivia Peyton",
    },
    "Task_ID": 128,
    "Task_Subject": "Discuss Product Giveaways with Management",
    "Task_Start_Date": "2014-02-19T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Need a final decision if we are going to be doing more product giveaways at tradeshows so I can coordinate with shipping department.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Olivia Peyton: No decision has been made if this will be long-term strategy at tradeshows.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sammy Hill",
    },
    "Task_ID": 129,
    "Task_Subject": "Follow Up Email with Recent Online Purchasers",
    "Task_Start_Date": "2014-02-26T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need you to send Emails to everyone who purchased a product online in the last week. We want to test whether this yields a sales improvement.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sammy Hill: Working on it. Lot's of emails to send.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Taylor Riley",
    },
    "Task_ID": 130,
    "Task_Subject": "Replace Desktops on the 3rd Floor",
    "Task_Start_Date": "2014-02-27T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Been told that all desktops on the third floor have to be replaced. We are being asked to do it because of workload in IT dept. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Taylor Riley: Not a problem, Im taking care of it.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Todd Hoffman",
    },
    "Task_ID": 131,
    "Task_Subject": "Update Database with New Leads",
    "Task_Start_Date": "2014-03-01T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Todd, I'm told you have all new leads from the tradeshow. Can you please update the database so I can begin my follow-ups.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Todd Hoffman: I've done the best I can with this, but I just have no time to finish it.</div>",
    "Task_Completion": 80,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Todd Hoffman",
    },
    "Task_ID": 132,
    "Task_Subject": "Mail New Leads for Follow Up",
    "Task_Start_Date": "2014-03-10T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Todd, I know you have no time to update the database yourself, but can you please forward the leads to me by mail so I an take care of my follow-ups?</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sammy Hill",
    },
    "Task_ID": 133,
    "Task_Subject": "Send Territory Sales Breakdown",
    "Task_Start_Date": "2014-03-13T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need you to create a spreadsheet with sales by territory and forward it to CEO. He is on vacation and does not have access to VPN.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sammy Hill: Compiling it</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Jim Packard",
    },
    "Task_ID": 134,
    "Task_Subject": "Territory Sales Breakdown Report",
    "Task_Start_Date": "2014-03-17T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Per discussion, I need territory sales report by EOD.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Jim Packard: John, Im waiting for the report from Sammy. I don\u2019t know what's taking him so long to finish it\u2026we are at 50%.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 135,
    "Task_Subject": "Return Merchandise Report",
    "Task_Start_Date": "2014-03-17T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need to see the number of returns this month as I'm told by accounting that our refunds are through the roof. What is the problem Arthur?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Arthur Miller: John, I know. I'm on it.</div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 136,
    "Task_Subject": "Report on the State of Engineering Dept",
    "Task_Start_Date": "2014-03-18T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>Under a lot of pressure from CEO to figure out cause of refunds. Need you to send me a state of engineering dept report so we can get to the bottom of the problems.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 137,
    "Task_Subject": "Staff Productivity Report",
    "Task_Start_Date": "2014-03-20T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>We might need to cut back on your budget so can you send me staff productivity report so I can send it over to the CEO</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: What report is that? Never heard of it.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Greta Sims",
    },
    "Task_ID": 138,
    "Task_Subject": "Review HR Budget Company Wide",
    "Task_Start_Date": "2014-03-20T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need to do a top to bottom review on our payroll and figure out where we can cut costs.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Greta Sims: I have what I need on my end. Waiting on things from dept heads.</div>",
    "Task_Completion": 40,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Ed Holmes",
    },
    "Task_ID": 139,
    "Task_Subject": "Sales Dept Budget Request Report",
    "Task_Start_Date": "2014-03-23T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Ed, I really need you to send me your budget report because CEO is looking to make changes and I'm stuck without your help.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Ed Holmes: I'm working on this right now.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 140,
    "Task_Subject": "Support Dept Budget Report",
    "Task_Start_Date": "2014-03-23T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div><font color=black>Barb, I really need you to send me your budget report because CEO is looking to make changes and I'm stuck without your help.</font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>Barb Banks: Coming soon...</font></div>",
    "Task_Completion": 60,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 141,
    "Task_Subject": "IT Dept Budget Request Report",
    "Task_Start_Date": "2014-03-23T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div><font color=black>Brett, you are usually really good at getting me this information but you have not done it this year. Being pressured by CEO to deliver final report. Please forward your budget report to me. </font></div>\r\n\r\n<div><font color=black>&nbsp;</font></div>\r\n\r\n<div><font color=black>Brett Wade: Been busy. Working on it.</font></div>",
    "Task_Completion": 30,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 142,
    "Task_Subject": "Engineering Dept Budget Request Report",
    "Task_Start_Date": "2014-03-23T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Bart, please see subject. You have to send me your budget report otherwise you may end up with cut-backs.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Bart Arnaz: Cutbacks? We are overwhelmed as it is. I will talk to CEO about this.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Marcus Orbison",
    },
    "Task_ID": 143,
    "Task_Subject": "1Q Travel Spend Report",
    "Task_Start_Date": "2014-03-24T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Marcus, have complaints from management that travel costs are just too high. I need you to send me over your detailed report.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Marcus Orbison: It's going to take me a while to compile it.</div>",
    "Task_Completion": 30,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 144,
    "Task_Subject": "Approve Benefits Upgrade Package",
    "Task_Start_Date": "2014-03-26T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Negotiated a great new deal for health insurance. I need to get approval from you.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sandra Johnson: You know we are under tight budgets. Why would you do this?</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Greta Sims",
    },
    "Task_ID": 145,
    "Task_Subject": "Final Budget Review",
    "Task_Start_Date": "2014-03-26T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We need to get together and review the budget before kicking it up to John. I need you to take a look at what I sent and give me your thoughts.</div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 146,
    "Task_Subject": "State of Operations Report",
    "Task_Start_Date": "2014-03-28T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Samantha, I'm dissapointed you have not sent this report over to me. You know we are trying to manage a crisis and it does not help when you are not proactive.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: I know John, I'm collecting info from teams.</div>",
    "Task_Completion": 45,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Hannah Brookly",
    },
    "Task_ID": 147,
    "Task_Subject": "Online Sales Report",
    "Task_Start_Date": "2014-03-29T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Hannah, you are the only one who has not sent me the report I requested in our meeting. I need you to send it to me asap.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Hannah Brookly: I was sick yesterday.</div>",
    "Task_Completion": 55,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Davey Jones",
    },
    "Task_ID": 148,
    "Task_Subject": "Reprint All Shipping Labels",
    "Task_Start_Date": "2014-04-01T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Get with graphic design and let's reprint all of our shipping labels. I want to use a new font.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Davey Jones: Im waiting on artwork. Done what I can.</div>",
    "Task_Completion": 10,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Morgan Kennedy",
    },
    "Task_ID": 149,
    "Task_Subject": "Shipping Label Artwork",
    "Task_Start_Date": "2014-04-02T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Kevin wants new shipping labels and I cannot print them without the artwork from your team. Can you please hurry and send it to me.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Morgan Kennedy: Send me the specs and I will work on it when I can.</div>",
    "Task_Completion": 40,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Davey Jones",
    },
    "Task_ID": 150,
    "Task_Subject": "Specs for New Shipping Label",
    "Task_Start_Date": "2014-04-04T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>We got your specs and we've started the redesign. We are confused by a few things and need you to reply to our Email with detailed information.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Mary Stern",
    },
    "Task_ID": 151,
    "Task_Subject": "Move Packaging Materials to New Warehouse",
    "Task_Start_Date": "2014-04-05T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Mary, you are going to have to coordinate the move. All packaging materials are your responsibility. You can hire temp workers if needed.</div>",
    "Task_Completion": 60,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Robin Cosworth",
    },
    "Task_ID": 152,
    "Task_Subject": "Move Inventory to New Warehouse",
    "Task_Start_Date": "2014-04-05T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Robin, you are point person to get all inventory moved to the new warehouse location. You can hire temp workers if needed.</div>",
    "Task_Completion": 70,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Victor Norris",
    },
    "Task_ID": 153,
    "Task_Subject": "Take Forklift to Service Center",
    "Task_Start_Date": "2014-04-07T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We cannot have the forklift continue to breakdown Victor. You know this is your responsibility and I want you to go out and get it fixed.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Victor Norris: So what do we do if we don't &nbsp;have a forklift\u2026rent?</div>",
    "Task_Completion": 60,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kevin Carter",
    },
    "Task_ID": 154,
    "Task_Subject": "Approve Rental of Forklift",
    "Task_Start_Date": "2014-04-08T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div>Kevin, do we have the ok to get a forklift rental. I still don\u2019t know when our forklift is going to be fixed and I'm worried it might take a long time. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kevin Carter: I need to get approval from the Controller</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Sandra Johnson",
    },
    "Task_ID": 155,
    "Task_Subject": "Give Final Approval to Rent Forklift",
    "Task_Start_Date": "2014-04-08T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div>Sandra, I cannot wait on your approval any longer. My staff is lifting boxes and everyone's back is starting to hurt. We need you to ok this.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Sandra Johnson: It's not up to me. I've kicked it up the ladder</div>",
    "Task_Completion": null,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 156,
    "Task_Subject": "Approve Overtime Pay",
    "Task_Start_Date": "2014-04-12T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Brett, the overtime I submitted was not paid and I'm being told it was not approved. I thought you approved this. What is the problem?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brett Wade: I did approve it. It was error in payroll. Trying to figure it out.</div>",
    "Task_Completion": 80,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Bart Arnaz",
    },
    "Task_ID": 157,
    "Task_Subject": "Approve Vacation Request",
    "Task_Start_Date": "2014-04-15T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>Planning a trip with the family for 2 weeks. Can you give me the ok so I can submit this to HR?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>&nbsp;Bart Arnaz: Will take a look as soon as I can.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Arthur Miller",
    },
    "Task_ID": 158,
    "Task_Subject": "Approve Salary Increase Request",
    "Task_Start_Date": "2014-04-16T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>I am told by Bart that we have a salary freeze and that my request for an increase in salary is on hold. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Please approve this request. I work very hard and deserve to be paid more.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 159,
    "Task_Subject": "Review Complaint Reports",
    "Task_Start_Date": "2014-04-17T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are getting a lot of complaints sent to the Consumer Affairs dept. Can you please reivew the report I sent you and send me your thoughts as to how we can deal with all this.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Barb Banks: This is a lot of work. Will do what I can</div>",
    "Task_Completion": 40,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brett Wade",
    },
    "Task_ID": 160,
    "Task_Subject": "Review Website Complaint Reports",
    "Task_Start_Date": "2014-04-18T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Brett, a lot of the reports about the website are related to uptime. You need to review this document and send and Email to me and Ken so we can deal with the Consumer Affairs Dept.</div>",
    "Task_Completion": 65,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Leah Simpson",
    },
    "Task_ID": 161,
    "Task_Subject": "Test New Automation App",
    "Task_Start_Date": "2014-04-20T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are in a rush to ship this and you need to put all your energy behind finding bugs. If you do find bugs, use standard reporting mechanisms. We'll fix what we can as soon as we can.</div>",
    "Task_Completion": 80,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Terry Bradley",
    },
    "Task_ID": 162,
    "Task_Subject": "Fix Synchronization Issues",
    "Task_Start_Date": "2014-04-21T00:00:00",
    "Task_Status": "Completed",
    "Task_Description": "<div>Terry, I don\u2019t know who else to get help from. The automation app is not synchronizing anything so I'm stuck until I get this fixed. I need to finish my testing. Please look at the log report and send Email with info.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Terry Bradley: I know why this happened. Fix on the way.</div>",
    "Task_Completion": 100,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Amelia Harper",
    },
    "Task_ID": 163,
    "Task_Subject": "Free Up Space for New Application Set",
    "Task_Start_Date": "2014-04-19T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>I need you to tell me where I'm going to be able to install our new application set for management's review. As it stands, I'm being blamed for the delay, but it's not my fault.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Amelia Harper",
    },
    "Task_ID": 164,
    "Task_Subject": "Install New Router in Dev Room",
    "Task_Start_Date": "2014-04-23T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Ameilia, we keep getting bounced off the network and we cant get our job done. Can you please replace this old router so we can get things done?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Amelia Harper: I've placed the order. Will replace as soon as I get the new router</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Antony Remmen",
    },
    "Task_ID": 165,
    "Task_Subject": "Update Your Profile on Website",
    "Task_Start_Date": "2014-04-28T00:00:00",
    "Task_Status": "Need Assistance",
    "Task_Description": "<div>Antony, it's your responsibility to maintain personal profile on site. I've asked you repeatedly. Is there a problem or something I can help with?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Antony Remmen: I forgot my password and we don\u2019t have recovery page.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Antony Remmen",
    },
    "Task_ID": 166,
    "Task_Subject": "Schedule Conf Call with SuperMart",
    "Task_Start_Date": "2014-04-29T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>They had some great things to say about your support follow up. Please schedule a conf call with them. I want to see if we can do a case study for our website.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Antony Remmen: Left a message and waiting on a call back.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Barb Banks",
    },
    "Task_ID": 167,
    "Task_Subject": "Support Team Evaluation Report",
    "Task_Start_Date": "2014-05-01T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Barb, can we get together and finish our evaluation of the support team. </div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Barb Banks: Ken, this is a high priority item as we have to keep support satisfaction levels very high. I have to defer this task for the time being however.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brad Jameson",
    },
    "Task_ID": 168,
    "Task_Subject": "Create New Installer for Company Wide App Deployment",
    "Task_Start_Date": "2014-05-02T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>I cannot deploy the apps manually. I need you to create an installer so we can get the apps installed on all desktops without manual configuration.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Brad Jameson: Ok, give me a few days.</div>",
    "Task_Completion": 70,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Brad Jameson",
    },
    "Task_ID": 169,
    "Task_Subject": "Pickup Packages from the Warehouse",
    "Task_Start_Date": "2014-04-30T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>We have a shipment from one of our PC vendors in the warehouse. Can you please pick these up as we do not have anyone who can deliver them to you.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Gabe Jones",
    },
    "Task_ID": 170,
    "Task_Subject": "Sumit Travel Expenses for Recent Trip",
    "Task_Start_Date": "2014-04-30T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Gabe, you sent me some receipts by Email but in order for me to get you a payment for expenses, I need your expense report.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Gabe Jones: I'm missing a receipt. As soon as I find it, I will submit</div>",
    "Task_Completion": 70,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Gabe Jones",
    },
    "Task_ID": 171,
    "Task_Subject": "Make Travel Arrangements for Sales Trip to San Francisco",
    "Task_Start_Date": "2014-04-29T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Need you to join me on our upcoming roadtrip to San Francisco. We are going to visit a few stores and help out with product staging.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Gabe: Im waiting on Marcus. He has to book flights.</div>",
    "Task_Completion": 60,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Marcus Orbison",
    },
    "Task_ID": 172,
    "Task_Subject": "Book Flights to San Fran for Sales Trip",
    "Task_Start_Date": "2014-04-30T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are heading out to San Francisco. Planned schedule has been emailed. Please book us flights asap. Please also use my frequent flier #.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Marcus Orbison: What's your FF#?</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "James Anderson",
    },
    "Task_ID": 173,
    "Task_Subject": "Collect Customer Reviews for Website",
    "Task_Start_Date": "2014-05-01T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are updating our website again with customer reviews. Need you to contact 10 customers and get feedback and authorization to publish their thoughts on our website.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>&nbsp;</div>",
    "Task_Completion": 20,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "James Anderson",
    },
    "Task_ID": 174,
    "Task_Subject": "Submit New W4 for Updated Exemptions",
    "Task_Start_Date": "2014-05-02T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>James, we cannot update your personnel file and we cannot change your exemptions until you sign your W4 form. Can you get that done soon?</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>James Anderson: I'm consulting an accountant on what to do.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Jim Packard",
    },
    "Task_ID": 175,
    "Task_Subject": "Get New Frequent Flier Account",
    "Task_Start_Date": "2014-05-03T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Just called the airline for your Jim and they told me they cancelled your frequent flier account. You need to call them yourself and get a new account. As soon as I get it, I will send it to travel dept.</div>",
    "Task_Completion": 10,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "John Heart",
    },
    "Task_ID": 176,
    "Task_Subject": "Review New Customer Follow Up Plan",
    "Task_Start_Date": "2014-05-05T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>John, I've created a detailed follow up with all of our customers. This will help us with retention. Please review and give me OK so I can push it out to the field.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>John Heart: Im getting feedback from management.</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Samantha Bright",
    },
    "Task_ID": 177,
    "Task_Subject": "Submit Customer Follow Up Plan Feedback",
    "Task_Start_Date": "2014-05-06T00:00:00",
    "Task_Status": "Deferred",
    "Task_Description": "<div>Forwarded Ken's new follow up plan to you by email. Need your opinions on it asap so we can get things nailed down in the upcoming months.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Samantha Bright: John, I had a family emergency. I need you to ask someone else to help.</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Karen Goodson",
    },
    "Task_ID": 178,
    "Task_Subject": "Review Issue Report and Provide Workarounds",
    "Task_Start_Date": "2014-05-04T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Karen, we have a stack of issues with the new apps that you need to review and fix asap. I've logged everything in the db. Give me your thoughts.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Karen Goodson: I'm working on these. Will let you know.</div>",
    "Task_Completion": 50,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kelly Rodriguez",
    },
    "Task_ID": 179,
    "Task_Subject": "Contact Customers for Video Interviews",
    "Task_Start_Date": "2014-05-07T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>We are creating a new section on our website for video interviews. Contact a few customers and see if they are willing to record a video review for us.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kelly Rodriguez: Not much like so far. Still trying.</div>",
    "Task_Completion": 25,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kelly Rodriguez",
    },
    "Task_ID": 180,
    "Task_Subject": "Resubmit Request for Expense Reimbursement",
    "Task_Start_Date": "2014-05-09T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>Kelly, I lost your expense reimbursement documents so I'm going to need you to send them to me by Email so this can get paid in this week's check run.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Kelly Rodriguez: I don\u2019t have receipts scanned. Is that ok?</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Kevin Carter",
    },
    "Task_ID": 181,
    "Task_Subject": "Approve Vacation Request Form",
    "Task_Start_Date": "2014-05-10T00:00:00",
    "Task_Status": "Not Started",
    "Task_Description": "<div>Kevin, I need to take some time off. My back hurts from lifting all these boxes. Can you please approve my vacation.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>&nbsp;</div>",
    "Task_Completion": 0,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Leah Simpson",
    },
    "Task_ID": 182,
    "Task_Subject": "Email Test Report on New Products",
    "Task_Start_Date": "2014-05-12T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Leah, we cannot fix our products until we get the test report from you. Please send everything you have by email to me so I can distribute it in the engineering dept.</div>\r\n\r\n<div>&nbsp;</div>\r\n\r\n<div>Leah Simpson: Still collecting these</div>",
    "Task_Completion": 75,
  }, {
    "ResponsibleEmployee": {
      "Employee_Full_Name": "Marcus Orbison",
    },
    "Task_ID": 183,
    "Task_Subject": "Send Receipts for all Flights Last Month",
    "Task_Start_Date": "2014-05-10T00:00:00",
    "Task_Status": "In Progress",
    "Task_Description": "<div>Marcus, I've not seen last month's flight expense report. Please forward it to me as I cannot reconcile our accounts without them.</div>",
    "Task_Completion": 50,
  },
];

@Injectable()
export class Service {
  getTasks(): Task[] {
    return tasks;
  }
}

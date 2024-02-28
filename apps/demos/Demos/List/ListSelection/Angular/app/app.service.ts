import { Injectable } from '@angular/core';

export class Task {
  id: number;

  text: string;
}

const tasks: Task[] = [
  { id: 1, text: 'Prepare 2016 Financial' },
  { id: 2, text: 'Prepare 2016 Marketing Plan' },
  { id: 3, text: 'Update Personnel Files' },
  { id: 4, text: 'Review Health Insurance Options Under the Affordable Care Act' },
  { id: 5, text: 'New Brochures' },
  { id: 6, text: '2016 Brochure Designs' },
  { id: 7, text: 'Brochure Design Review' },
  { id: 8, text: 'Website Re-Design Plan' },
  { id: 9, text: 'Rollout of New Website and Marketing Brochures' },
  { id: 10, text: 'Create 2012 Sales Report' },
  { id: 11, text: 'Direct vs Online Sales Comparison Report' },
  { id: 12, text: 'Review 2012 Sales Report and Approve 2016 Plans' },
  { id: 13, text: 'Submit Signed NDA' },
  { id: 14, text: 'Update Revenue Projections' },
  { id: 15, text: 'Review Revenue Projections' },
  { id: 16, text: 'Comment on Revenue Projections' },
  { id: 17, text: 'Scan Health Insurance Forms' },
  { id: 18, text: 'Sign Health Insurance Forms' },
  { id: 19, text: 'Follow up with West Coast Stores' },
  { id: 20, text: 'Follow up with East Coast Stores' },
  { id: 21, text: 'Submit Refund Report for 2016 Recall' },
  { id: 22, text: 'Give Final Approval for Refunds' },
  { id: 23, text: 'Prepare Product Recall Report' },
  { id: 24, text: 'Review Product Recall Report by Engineering Team' },
  { id: 25, text: 'Review Training Course for any Omissions' },
  { id: 26, text: 'Review Overtime Report' },
  { id: 27, text: 'Submit Overtime Request Forms' },
  { id: 28, text: 'Overtime Approval Guidelines' },
  { id: 29, text: 'Create Report on Customer Feedback' },
  { id: 30, text: 'Review Customer Feedback Report' },
  { id: 31, text: 'Customer Feedback Report Analysis' },
  { id: 32, text: 'Prepare Shipping Cost Analysis Report' },
  { id: 33, text: 'Complete Shipper Selection Form' },
  { id: 34, text: 'Upgrade Server Hardware' },
  { id: 35, text: 'Upgrade Personal Computers' },
  { id: 36, text: 'Approve Personal Computer Upgrade Plan' },
  { id: 37, text: 'Estimate Time Required to Touch-Enable Apps' },
  { id: 38, text: 'Report on Tranistion to Touch-Based Apps' },
  { id: 39, text: 'Try New Touch-Enabled WinForms Apps' },
  { id: 40, text: 'Site Up-Time Report' },
  { id: 41, text: 'Review Site Up-Time Report' },
  { id: 42, text: 'Review Online Sales Report' },
  { id: 43, text: 'Determine New Online Marketing Strategy' },
  { id: 44, text: 'Submit New Website Design' },
  { id: 45, text: 'Create Icons for Website' },
  { id: 46, text: 'Review PSDs for New Website' },
  { id: 47, text: 'Create New Shopping Cart' },
  { id: 48, text: 'Launch New Website' },
  { id: 49, text: 'Update Customer Shipping Profiles' },
  { id: 50, text: 'Create New Shipping Return Labels' },
];

@Injectable()
export class Service {
  getTasks(): Task[] {
    return tasks;
  }
}

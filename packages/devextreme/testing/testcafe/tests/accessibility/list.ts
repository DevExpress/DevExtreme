import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/list.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const simpleItems = ['Item_1', 'Item_2', 'Item_3'];

const optionsWithSimpleItems: Options<Properties> = {
  dataSource: [[], simpleItems],
  height: [undefined, 400],
  grouped: [false],
  searchEnabled: [true, false],
  allowItemDeleting: [true, false],
  showSelectionControls: [true, false],
  selectionMode: ['all', 'multiple', 'none', 'single'],
  itemDeleteMode: ['toggle', 'context', 'slideButton', 'slideItem', 'static', 'swipe'],
  useNativeScrolling: [true, false],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configurationWithSimpleItems: Configuration = {
  component: 'dxList',
  a11yCheckConfig,
  options: optionsWithSimpleItems,
};

testAccessibility(configurationWithSimpleItems);

const groupedItems = [[
  {
    key: 'Mr. John Heart',
    items: ['Choose between PPO and HMO Health Plan', 'Google AdWords Strategy', 'New Brochures', 'Update NDA Agreement', 'Review Product Recall Report by Engineering Team'],
  }, {
    key: 'Mrs. Olivia Peyton',
    items: ['Update Personnel Files', 'Review Health Insurance Options Under the Affordable Care Act', 'Non-Compete Agreements'],
  }, {
    key: 'Mr. Robert Reagan',
    items: ['Deliver R&D Plans for 2013', 'Decide on Mobile Devices to Use in the Field', 'Try New Touch-Enabled WinForms Apps', 'Approval on Converting to New HDMI Specification'],
  }, {
    key: 'Ms. Greta Sims',
    items: ['Approve Hiring of John Jeffers', 'Update Employee Files with New NDA', 'Give Final Approval for Refunds'],
  }, {
    key: 'Mr. Brett Wade',
    items: ['Prepare 3013 Marketing Plan', 'Rollout of New Website and Marketing Brochures', 'Review 2012 Sales Report and Approve 2013 Plans', 'Review Site Up-Time Report'],
  }, {
    key: 'Mrs. Sandra Johnson',
    items: ['Provide New Health Insurance Docs', 'Review HR Budget Company Wide', 'Final Budget Review'],
  }, {
    key: 'Mr. Kevin Carter',
    items: ['Sign Updated NDA', 'Review Overtime Report', 'Upgrade Server Hardware', 'Upgrade Personal Computers'],
  }, {
    key: 'Ms. Cynthia Stanwick',
    items: ['Prepare 2013 Financial', 'Update Revenue Projections', 'Submit D&B Number to ISP for Credit Approval'],
  }, {
    key: 'Dr. Kent Samuelson',
    items: ['Update Sales Strategy Documents', 'Review Revenue Projections', 'Refund Request Template'],
  },
]];

const options: Options<Properties> = {
  dataSource: [groupedItems],
  height: [undefined, 400],
  grouped: [true],
  collapsibleGroups: [true, false],
  searchEnabled: [true, false],
  allowItemDeleting: [true, false],
  showSelectionControls: [true, false],
  selectionMode: ['all', 'multiple', 'none', 'single'],
  itemDeleteMode: ['toggle', 'context', 'slideButton', 'slideItem', 'static', 'swipe'],
  useNativeScrolling: [true, false],
};

const configuration: Configuration = {
  component: 'dxList',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);

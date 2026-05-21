import '../js/__internal/integration/jquery';
import '../js/ui/card_view';
import $ from 'jquery';
import { setupThemeSelector } from './themeSelector.ts';

const customers = [
  { ID: 1, Company: 'Super Mart of the West', Address: '702 SW 8th Street', City: 'Bentonville', State: 'Arkansas', Zipcode: 72716, Phone: '(800) 555-2797' },
  { ID: 2, Company: 'Electronics Depot', Address: '2455 Paces Ferry Road NW', City: 'Atlanta', State: 'Georgia', Zipcode: 30339, Phone: '(800) 595-3232' },
  { ID: 3, Company: 'K&S Music', Address: '1000 Nicllet Mall', City: 'Minneapolis', State: 'Minnesota', Zipcode: 55403, Phone: '(612) 304-6073' },
  { ID: 4, Company: "Tom's Club", Address: '999 Lake Drive', City: 'Issaquah', State: 'Washington', Zipcode: 98027, Phone: '(800) 955-2292' },
  { ID: 5, Company: 'E-Mart', Address: '3333 Beverly Rd', City: 'Hoffman Estates', State: 'Illinois', Zipcode: 60179, Phone: '(847) 286-2500' },
  { ID: 6, Company: 'Walters', Address: '200 Wilmot Rd', City: 'Deerfield', State: 'Illinois', Zipcode: 60015, Phone: '(847) 940-2500' },
  { ID: 7, Company: 'StereoShack', Address: '400 Commerce S', City: 'Fort Worth', State: 'Texas', Zipcode: 76102, Phone: '(817) 820-0741' },
  { ID: 8, Company: 'Circuit Town', Address: '2200 Kensington Court', City: 'Oak Brook', State: 'Illinois', Zipcode: 60523, Phone: '(800) 955-2929' },
  { ID: 9, Company: 'Premier Buy', Address: '7601 Penn Avenue South', City: 'Richfield', State: 'Minnesota', Zipcode: 55423, Phone: '(612) 291-1000' },
  { ID: 10, Company: 'ElectrixMax', Address: '263 Shuman Blvd', City: 'Naperville', State: 'Illinois', Zipcode: 60563, Phone: '(630) 438-7800' },
  { ID: 11, Company: 'Video Emporium', Address: '1201 Elm Street', City: 'Dallas', State: 'Texas', Zipcode: 75270, Phone: '(214) 854-3000' },
  { ID: 12, Company: 'Screen Shop', Address: '1000 Lowes Blvd', City: 'Mooresville', State: 'North Carolina', Zipcode: 28117, Phone: '(800) 445-6937' },
];

window.addEventListener('load', () =>
  setupThemeSelector('theme-selector')
    .catch((err) => console.error('Theme loading failed:', err))
    .then(() => {
      $('#widget-container').dxCardView({
        dataSource: customers,
        keyExpr: 'ID',
        cardsPerRow: 'auto',
        cardMinWidth: 320,
        columns: ['Company', 'Address', 'City', 'State', 'Zipcode', 'Phone'],
      });
    }));
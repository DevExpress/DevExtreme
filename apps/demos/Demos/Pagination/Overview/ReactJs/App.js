import React, { useState } from 'react';
import Pagination from 'devextreme-react/pagination';
import EmployeeGallery from './EmployeesGallery.js';
import { employees } from './data.js';

const PAGE_SIZES = [4, 6];
const App = () => {
  const [pageSize, setPageSize] = useState(4);
  const [pageIndex, setPageIndex] = useState(1);
  return (
    <React.Fragment>
      <EmployeeGallery
        employees={employees}
        pageSize={pageSize}
        pageIndex={pageIndex}
      />
      <Pagination
        showInfo
        showNavigationButtons
        allowedPageSizes={PAGE_SIZES}
        itemCount={employees.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </React.Fragment>
  );
};
export default App;

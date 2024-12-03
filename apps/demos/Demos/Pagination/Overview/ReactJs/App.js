import React, { useState } from 'react';
import Pagination from 'devextreme-react/pagination';
import EmployeeGallery from './EmployeesGallery.js';
import { employees } from './data.js';

const App = () => {
  const [pageSize, setPageSize] = useState(4);
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <>
      <EmployeeGallery
        employees={employees}
        pageSize={pageSize}
        pageIndex={pageIndex}
      />
      <Pagination
        showInfo
        showNavigationButtons
        allowedPageSizes={[4, 6]}
        itemCount={employees.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onOptionChanged={(evt) => {
          if (evt.name === 'pageSize') {
            setPageSize(evt.value);
          }

          if (evt.name === 'pageIndex') {
            setPageIndex(evt.value);
          }
        }}
      />
    </>
  );
};

export default App;

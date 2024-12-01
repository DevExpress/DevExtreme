import React from "react";
import Pagination from "devextreme-react/pagination";
import { customers } from "./data.js";

const columns = ["CompanyName", "City", "State", "Phone", "Fax"];

const App = () => {
  return (
    <>
      <Pagination />
    </>
  );
};

export default App;

import React from 'react';
import { CardView, CardCover, Column, Pager } from 'devextreme-react/card-view';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import { employees, columns, cardCover } from './data';

const App = () => {
  return (
    <div>
      <CardView
        dataSource={employees}
        keyExpr="ID"
        cardsPerRow={3}
        // Todo: Remove this and use nested <Column>
        columns={columns}
        allowColumnReordering={true}
      >
        <CardCover
          imageExpr={cardCover.imageExpr}
          altExpr={cardCover.altExpr}
        />

        <Pager
            visible={true}
            showPageSizeSelector={true}
            allowedPageSizes={'auto'}
        >
        </Pager>
        
        {/* {columns.map((col, index) => (
          <Column 
            key={index} 
            dataField={col.dataField} 
            caption={col.caption} />
        ))} */}

      </CardView>
    </div>
  );
};

export default App;

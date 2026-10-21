import React, { useState } from "react";
import CardView, { Column } from "devextreme-react/card-view";

const initialData = [
  { id: 1, updateCount: 0 },
  { id: 2, updateCount: 0 },
];

const renderCard = ({ card }) => (
  <div className="custom-card">
    {`${card.data.id}: ${card.data.updateCount}`}
  </div>
);

function App() {
  const [items, setItems] = useState(initialData);

  const updateItems = () => {
    setItems((prev) => prev.map((item) => ({
      ...item,
      updateCount: item.updateCount + 1,
    })));
  };

  return (
    <div>
      <button onClick={updateItems}>Update Data</button>

      <CardView
        dataSource={items}
        keyExpr="id"
        cardsPerRow={2}
        cardRender={renderCard}
      >
        <Column dataField="id" />
        <Column dataField="updateCount" />
      </CardView>
    </div>
  );
}

export default App;

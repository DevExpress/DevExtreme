import React from 'react';
import { Button as DxButton } from 'devextreme-react/button';

export default function Button() {
  return (
    <div className="button-container">
      <DxButton
        text="Click me!"
      />
    </div>
  );
} 
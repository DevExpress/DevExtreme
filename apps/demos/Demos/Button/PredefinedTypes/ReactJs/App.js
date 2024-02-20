import React from 'react';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

const onClick = (e) => {
  const buttonText = e.component.option('text');
  notify(`The ${capitalize(buttonText)} button was clicked`);
};
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export default function App() {
  return (
    <div className="buttons-demo">
      <div className="buttons">
        <div>
          <div className="buttons-column">
            <div className="column-header">Normal</div>
            <div>
              <Button
                width={120}
                text="Contained"
                type="normal"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Outlined"
                type="normal"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Text"
                type="normal"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">Success</div>
            <div>
              <Button
                width={120}
                text="Contained"
                type="success"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Outlined"
                type="success"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Text"
                type="success"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="buttons-column">
            <div className="column-header">Default</div>
            <div>
              <Button
                width={120}
                text="Contained"
                type="default"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Outlined"
                type="default"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Text"
                type="default"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">Danger</div>
            <div>
              <Button
                width={120}
                text="Contained"
                type="danger"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Outlined"
                type="danger"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width={120}
                text="Text"
                type="danger"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

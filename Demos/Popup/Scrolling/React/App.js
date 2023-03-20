import React from 'react';

import { Button } from 'devextreme-react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import ScrollView from 'devextreme-react/scroll-view';

export default function App() {
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [popupWithScrollViewVisible, setPopupWithScrollViewVisible] = React.useState(false);

  const showPopup = React.useCallback(() => {
    setPopupVisible(true);
  }, [setPopupVisible]);

  const showPopupWithScrollView = React.useCallback(() => {
    setPopupWithScrollViewVisible(true);
  }, [setPopupWithScrollViewVisible]);

  const hide = React.useCallback(() => {
    setPopupVisible(false);
    setPopupWithScrollViewVisible(false);
  }, [setPopupVisible, setPopupWithScrollViewVisible]);

  const bookButtonOptions = React.useMemo(() => ({
    width: 300,
    text: 'Book',
    type: 'default',
    stylingMode: 'contained',
    onClick: hide,
  }));

  return (
    <React.Fragment>
      <div className="demo-container">
        <div className="button-container">
          <Button
            text="Show Popup"
            type="default"
            width={300}
            onClick={showPopup}
          />
          <div className="label"> A native scrollable container </div>
        </div>

        <div className="button-container">
          <Button
            text="Show Popup"
            width={300}
            onClick={showPopupWithScrollView}
          />
          <div className="label"> The ScrollView </div>
        </div>
      </div>

      <Popup
        width={360}
        height={320}
        visible={popupVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Downtown Inn">
        <div className="popup-content">
          <div className="caption">Description</div>
          In the heart of LA&apos;s business district, the Downtown Inn has a welcoming staff
          and award winning restaurants that remain open 24 hours a day.
          Use our conference room facilities to conduct meetings and have a drink
          at our beautiful rooftop bar.
          <br /><br />
          <div className="content">
            <div>
              <div className="caption">Features</div>
              <div>Concierge</div>
              <div>Restaurant</div>
              <div>Valet Parking</div>
              <div>Fitness Center</div>
              <div>Sauna</div>
              <div>Airport Shuttle</div>
            </div>
            <div>
              <div className="caption">Rooms</div>
              <div>Climate control</div>
              <div>Air conditioning</div>
              <div>Coffee/tea maker</div>
              <div>Iron/ironing</div>
            </div>
          </div>
        </div>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="center"
          options={bookButtonOptions}
        />
      </Popup>

      <Popup
        width={360}
        height={320}
        visible={popupWithScrollViewVisible}
        onHiding={hide}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Downtown Inn">
        <ScrollView width='100%' height='100%'>
          <div className="caption">Description</div>
          In the heart of LA&apos;s business district, the Downtown Inn has a welcoming staff
          and award winning restaurants that remain open 24 hours a day.
          Use our conference room facilities to conduct meetings and have a drink
          at our beautiful rooftop bar.
          <br /><br />
          <div className="content">
            <div>
              <div className="caption">Features</div>
              <div>Concierge</div>
              <div>Restaurant</div>
              <div>Valet Parking</div>
              <div>Fitness Center</div>
              <div>Sauna</div>
              <div>Airport Shuttle</div>
            </div>
            <div>
              <div className="caption">Rooms</div>
              <div>Climate control</div>
              <div>Air conditioning</div>
              <div>Coffee/tea maker</div>
              <div>Iron/ironing</div>
            </div>
          </div>
        </ScrollView>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="center"
          options={bookButtonOptions}
        />
      </Popup>
    </React.Fragment>
  );
}


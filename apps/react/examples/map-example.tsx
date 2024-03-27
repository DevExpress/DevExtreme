/* eslint-disable react/no-unused-state */
import * as React from 'react';
import {
  Map, Location, Marker, Route, Tooltip,
} from 'devextreme-react/map';
import Example from './example-block';

interface IPosition {
  lat: number;
  lng: number;
}

const startPos = {
  lat: 40.71000,
  lng: -73.91000,
};

export default class extends React.Component<any, { text: string; pos: IPosition }> {
  constructor(props: unknown) {
    super(props);
    const pos = { ...startPos };
    this.state = {
      text: JSON.stringify(pos),
      pos,
    };

    this.updatePos = this.updatePos.bind(this);
  }

  public updatePos(): void {
    const { pos: { lat, lng } } = this.state;
    const pos = {
      lat: lat + 0.01,
      lng: lng + 0.05,
    };

    this.setState({
      text: JSON.stringify(pos),
      pos,
    });
  }

  public render(): React.ReactNode {
    const { pos } = this.state;
    return (
      <Example title="dxMap" state={this.state}>
        <button type="button" onClick={this.updatePos}>Move!</button>
        <Map
          provider="bing"
          defaultZoom={11}
          height={440}
          controls
        >
          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Times Square" />
            <Location lat={40.755833} lng={-73.986389} />
          </Marker>

          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Central Park" />
            <Location lat={40.7825} lng={-73.966111} />
          </Marker>

          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Start" />
            <Location lat={startPos.lat} lng={startPos.lng} />
          </Marker>

          <Marker>
            <Tooltip text={JSON.stringify(pos)} />
            <Location lat={pos.lat} lng={pos.lng} />
          </Marker>

          <Route color="green">
            <Location lat={40.755833} lng={-73.986389} />
            <Location lat={40.7825} lng={-73.966111} />
            <Location lat={startPos.lat} lng={startPos.lng} />
            <Location lat={pos.lat} lng={pos.lng} />
          </Route>
        </Map>
      </Example>
    );
  }
}

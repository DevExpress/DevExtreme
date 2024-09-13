import { render } from 'inferno';
import { Card } from 'devextreme/esm/__internal/grids/new/card_view/content_view/card'

import 'devextreme/dist/css/dx.light.css';

const App = () => {
  return (
    <Card
      row={{
        key: 1,
        cells: [
          {
            value: 1,
            column: {
              name: 'asd',
              alignment: 'right'
            }
          }
        ]
      }}
    ></Card>
  )
}

render(<App/>, document.querySelector("#app"))

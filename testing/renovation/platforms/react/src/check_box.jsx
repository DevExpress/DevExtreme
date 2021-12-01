/* eslint-env browser*/
import React from 'react';
import CheckBox from '../../../../../artifacts/react/renovation/ui/editors/check_box/check_box';
import ReactDOM from 'react-dom';

const App = (props) => (<CheckBox text='checkBox' value={null}/>);

ReactDOM.render(<App/>, document.getElementById('app'));

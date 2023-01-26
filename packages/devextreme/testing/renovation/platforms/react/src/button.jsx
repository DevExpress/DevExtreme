/* eslint-env browser*/
import React from 'react';
import Button from '../../../../../artifacts/react/renovation/ui/button';
import ReactDOM from 'react-dom';

const App = (props) => (<Button text='Click Me!' onClick={() => alert('OK')}/>);

ReactDOM.render(<App/>, document.getElementById('app'));

import React from 'react';
import ReactDOM from 'react-dom';
import StoreListing from './StoreListing';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StoreListing />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import React from 'react';
import ReactDOM from 'react-dom';
import CategoryCard from './CategoryCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CategoryCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});

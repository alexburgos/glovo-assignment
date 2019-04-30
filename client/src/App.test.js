import './setupTest';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {
  let mockEvent;
  let mockCategories;
  let wrapper;

  beforeEach(() => {
    mockEvent = { preventDefault: jest.fn() }
    mockCategories = [
      {
        id: 1,
        label: 'Snacks',
        name: 'snacks',
        openIcon: '/img/snacks-open.png',
        sleepIcon: '/img/snacks-sleep.png'
      },
      {
        id: 2,
        label: 'Restaurants',
        name: 'restaurants',
        openIcon: '/img/restaurants-open.png',
        sleepIcon: '/img/restaurants-sleep.png'
      },
    ]
    wrapper = shallow(<App />)
  });

  window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json: () => Promise.resolve(mockCategories)
  }));

  it('fetches store based on category', () => {
    const url = '/categories'
    const getOptions = {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-cache',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    wrapper.instance().getCategories(mockEvent)
    expect(window.fetch).toHaveBeenCalledWith(url, getOptions)
  });
});

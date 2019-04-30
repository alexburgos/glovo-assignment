import '../setupTest';
import React from 'react';
import ReactDOM from 'react-dom';
import CategoryPage from './CategoryPage';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CategoryPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});


describe('CategoryPage', () => {
  let mockEvent;
  let mockStores;
  let wrapper;

  beforeEach(() => {
    mockEvent = { preventDefault: jest.fn() }
    mockStores = [
      {
        id: 1,
        name: 'Pizza place',
        description: 'Eat all the pizza',
        tags: ['pizza'],
        schedule: [
          {
            day: 1,
            open: '12:00',
            close: '22:00'
          },
          {
            day: 2,
            open: '12:00',
            close: '22:00'
          },
        ]
      },
      {
        id: 2,
        name: 'Burger Joint',
        description: 'Yummmm',
        tags: ['burgers', 'american'],
        schedule: [
          {
            day: 1,
            open: '12:00',
            close: '22:00'
          },
          {
            day: 2,
            open: '12:00',
            close: '22:00'
          },
        ]
      },
    ]
    wrapper = shallow(<CategoryPage />)
  });

  window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json: () => Promise.resolve(mockStores)
  }));

  it('fetches store based on category', () => {
    const url = '/stores?category=undefined'
    const getOptions = {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-cache',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    wrapper.instance().getStores(mockEvent)
    expect(window.fetch).toHaveBeenCalledWith(url, getOptions)
  });
});
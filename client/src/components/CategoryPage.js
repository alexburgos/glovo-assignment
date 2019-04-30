import React, { Component } from "react";
import "./CategoryPage.css";
import StoreListing from "./StoreListing";
import { find, sortBy, every, flatten, uniq } from 'lodash';

class CategoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [],
      filteredStores: [],
      tagFilter: '',
      tags: []
    };
  }

  componentDidMount() {
    this.getStores();
  }

  handleChange = (e) => {
    this.setState({
      tagFilter: e.target.value
    }, this.handleFilter);
  }

  sortByTag = (tagName) => {
    this.setState({
      tagFilter: tagName
    }, this.handleFilter);
  }

  handleFilter = () => {
    let filteredStores = this.state.stores.filter((store) => store.tags.includes(this.state.tagFilter));

    if (filteredStores.length > 0) {
      this.setState({ filteredStores });
    } else {
      this.setState({ filteredStores: this.state.stores })
    }
  }

  clearFilter = () => {
    this.setState({
      tagFilter: ''
    }, this.handleFilter);
  }

  setOpenStatus = (currentDate, store) => {
    let currentSchedule = find(store.schedule, (sched) => sched.day === currentDate.day());
    let currentHour = currentDate.hour();
    let currentMinutes = currentDate.minute();
    let openStatus;
    let nextSchedule;

    //Special case where the store is open for 1 hour
    if (store.schedule.length === 1) {
      currentSchedule = store.schedule[0];
      nextSchedule = store.schedule[0];
      if (currentHour >= currentSchedule.open.split(':')[0]) {
        openStatus = 'open';
      } else {
        openStatus = 'closed';
      }
    } else if (currentSchedule) {
      let openHour = currentSchedule.open.split(':')[0];
      let closeHour = currentSchedule.close.split(':')[0];
      let closeMinutes = currentSchedule.close.split(':')[1];


      if (closeMinutes > 0) {
        if ((currentHour >= openHour && currentHour < closeHour) || (currentHour >= closeHour && currentMinutes < closeMinutes)) {
          openStatus = 'open';
        } else if (currentHour >= closeHour && currentMinutes >= closeMinutes) {
          openStatus = 'closed';
          nextSchedule = find(store.schedule, (sched) => sched.day === currentSchedule.day + 1);
          if (!nextSchedule) nextSchedule = store.schedule[currentSchedule.day + 1] || store.schedule[0];
        } else if (currentHour < openHour) {
          openStatus = 'closed';
          nextSchedule = find(store.schedule, (sched) => sched.day === currentSchedule.day);
        }
      } else {
        if (currentHour >= openHour && currentHour < closeHour) {
          openStatus = 'open';
        } else if (currentHour < openHour) {
          openStatus = 'closed';
          nextSchedule = find(store.schedule, (sched) => sched.day === currentSchedule.day);
        } else if (currentHour >= closeHour) {
          openStatus = 'closed';
          nextSchedule = find(store.schedule, (sched) => sched.day === currentSchedule.day + 1);
          if (!nextSchedule) nextSchedule = store.schedule[currentSchedule.day + 1] || store.schedule[0];
        }
      }
    } else if (!currentSchedule && store.schedule.length > 1) {
      openStatus = 'closed';
      nextSchedule = find(store.schedule, (sched) => sched.day === currentDate.day() + 1);
      if (!nextSchedule) nextSchedule = store.schedule[currentDate.day() + 1] || store.schedule[0];
    } else {
      openStatus = 'no-schedule'
    }

    return Object.assign({}, store, { currentSchedule: currentSchedule, openStatus: openStatus, nextSchedule: nextSchedule });
  }

  getStores = () => {
    const getOptions = {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      })
    };

    fetch(`/stores?category=${this.props.categoryName}`, getOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.status);
      })
      .then(data => {
        let sortingTags = [];
        let { stores } = data;
        let storesWithStatus = stores.map((store) => this.setOpenStatus(this.props.currentDate, store));
        let sortedStores = sortBy(storesWithStatus, (store) => store.openStatus === 'closed');
        stores.forEach( (store) => sortingTags.push(store.tags));


        this.setState({
          stores: sortedStores,
          filteredStores: sortedStores,
          tags: uniq(flatten(sortingTags))
        });
      });
  };

  render() {
    let categoryClosed = every(this.state.filteredStores, (store) => store.openStatus === 'closed');
    return (
      <div className="CategoryPage">
        <header className="CategoryPage-header">
          <h1> {this.props.categoryLabel} Stores </h1>
        </header>
        
        <div className="CategoryPage-filter">
          <label>Filter stores by tag: </label>
          <input value={this.state.tagFilter} type="text" placeholder="Tag" onChange={this.handleChange} />
          <span className="CategoryPage-clear" onClick={this.clearFilter} role="img" aria-label="clear">&#10060;</span>
          <div className="CategoryPage-tags">
            { this.state.tags.length > 0 &&
              this.state.tags.map((tag, index) => <span key={index} onClick={() => this.sortByTag(tag)}>{tag}</span>)
            }
          </div>
        </div>

        {categoryClosed &&
          <h2>All stores are currently closed :(</h2>
        }

        {this.state.filteredStores.length > 0 && (
          <div className="CategoryPage-stores">
            {this.state.filteredStores.map(store => {
              let storeProps = {
                name: store.name,
                description: store.description,
                openStatus: store.openStatus,
                currentSchedule: store.currentSchedule,
                nextSchedule: store.nextSchedule,
                schedule: store.schedule
              };

              return <StoreListing key={store.id} {...storeProps} />;
            })}
          </div>
        )}
      </div>
    );
  }
}

CategoryPage.propTypes = {};

export default CategoryPage;

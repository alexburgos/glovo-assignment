import React, { Component } from "react";
import "./CategoryPage.css";
import StoreListing from "./StoreListing";

class CategoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stores: [],
      filteredStores: [],
      tagFilter: ''
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

  handleFilter = () => {
    let filteredStores = this.state.stores.filter( (store) => store.tags.includes(this.state.tagFilter) );

    if (filteredStores.length > 0) { 
      this.setState({ filteredStores });
    } else {
      this.setState({ filteredStores: this.state.stores })
    }
  }

  setOpenStatus = (currentDate, store) => {
    let currentSchedule = store.schedule.filter((sched) => sched.day === 1);
    let openStatus;

    if (currentSchedule.length > 0) {
      let currentHour = currentDate.hour();
      let currentMinutes = currentDate.minute();
      let openHour = currentSchedule[0].open.split(':')[0];
      let closeHour = currentSchedule[0].close.split(':')[0];
      let closeMinutes = currentSchedule[0].close.split(':')[1];
  
      openStatus = (currentHour >= openHour) && (closeMinutes > 0 ? (currentHour <= closeHour && currentMinutes < closeMinutes) : currentHour < closeHour) ? 'open' : 'closed';
    } else {
      openStatus = 'no-schedule'
    }

    return Object.assign({}, store, {currentSchedule: currentSchedule, openStatus: openStatus});
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
        let { stores } = data;
        let modifiedStores = stores.map((store) => this.setOpenStatus(this.props.currentDate, store));
        this.setState({
          stores: modifiedStores,
          filteredStores: modifiedStores
        });
      });
  };

  render() {
    return (
      <div className="CategoryPage">
        <header className="CategoryPage-header">
          <h1> {this.props.categoryLabel} Stores </h1>
        </header>
        <div className="CategoryPage-filter">
          <label>Filter stores: </label>
          <input value={this.state.tagFilter} type="text" placeholder="Tag" onChange={this.handleChange}/>
        </div>
        {this.state.filteredStores.length > 0 && (
          <div className="CategoryPage-stores">
            {this.state.filteredStores.map(store => {
              let storeProps = {
                name: store.name,
                description: store.description,
                openStatus: store.openStatus,
                currentSchedule: store.currentSchedule
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

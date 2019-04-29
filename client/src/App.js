import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CategoryPage from "./components/CategoryPage";
import dayjs from 'dayjs';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      currentDate: dayjs(),
    };
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    const getOptions = {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      })
    };

    fetch(`/categories`, getOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.status);
      })
      .then(data => {
        this.setState({
          categories: data.categories
        });
      });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Link to={`/`} className="App-back-link">&#8592; {`Go Back`} </Link>
          <div>
            <Route exact path={`/`} render={() => <Home categories={this.state.categories}/> } />
            {this.state.categories.map( (category, index) => {
              return (
                <Route exact path={`/${category.name}`} render={() => <CategoryPage categoryName={category.name} categoryLabel={category.label} currentDate={this.state.currentDate} /> } key={index} /> 
              );
              })
            }
          </div>
        </div>
      </Router>
    );
  }
}

App.propTypes = {};

export default App;

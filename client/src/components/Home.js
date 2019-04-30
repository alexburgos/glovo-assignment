import React from "react";
import PropTypes from "prop-types";
import CategoryCard from "./CategoryCard";

function Home(props) {
  return (
    <div>
      <header className="App-header">
        <h1> Available Categories </h1>
        <p>Click on any of the following categories to see which stores are open near you: </p>
      </header>
      {props.categories.length > 0 && (
        <div className="App-categories">
          {props.categories.map(category => {
            let categoryProps = {
              name: category.name,
              label: category.label,
              openIcon: category.openIcon,
              sleepIcon: category.sleepIcon
            };

            return <CategoryCard key={category.id} {...categoryProps} />;
          })}
        </div>
      )}
    </div>
  );
}

Home.propTypes = {};

export default Home;

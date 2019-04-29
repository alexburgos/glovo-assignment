import React from "react";
import PropTypes from "prop-types";
import "./CategoryCard.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const CategoryCard = props => {
  let { name, label, sleepIcon, openIcon } = props;

  let isCategoryClosed = false;
  return (
    <div className="Category">
        <Link to={`/${name}`}>
          {!isCategoryClosed && <img src={openIcon} alt="open-icon" />}
          {isCategoryClosed && <img src={sleepIcon} alt="sleep-icon" />}
          <p>{label}</p>
        </Link>

    </div>
  );
};

CategoryCard.propTypes = {};

export default CategoryCard;

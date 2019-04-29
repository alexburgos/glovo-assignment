import React from 'react'
import PropTypes from 'prop-types'
import './StoreListing.css';

const fullWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StoreListing = props => {
  let {
    name,
    description,
    openStatus,
    currentSchedule
  } = props;

  return (
    <div className="StoreListing">
      <h2>{name}</h2>
      <p>{description}</p>
      {openStatus === 'open' &&
        <div className="StoreListing-open"><span>Open right now</span></div>
      }
      {openStatus === 'closed' && 
        <div className="StoreListing-closed"><span>Next opening time: {fullWeekDays[currentSchedule[0].day]} at {currentSchedule[0].open}</span></div>
      }
      {openStatus === 'no-schedule' && 
        <div className="StoreListing-closed"><span>Sorry! No hours for today</span></div>
      }
    </div>
  );
}

StoreListing.propTypes = {

};

export default StoreListing;

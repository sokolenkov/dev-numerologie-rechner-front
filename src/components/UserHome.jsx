import React, { Component } from 'react';

import '../styles/UserHome.css';

import TitleBar from './TitleBar';
import NavigationBar from './NavigationBar';
import AdArea from './AdArea';

class UserHome extends Component {
  /**
   * default component render
   */
  render() {
    return (
      <div>
        <NavigationBar />
        <TitleBar primaryActionTitle="Anfrage an Berater" />
        <div className="UserHomeContentArea">
          <div className="UserHomeLeftAdArea">
            <AdArea />
          </div>
          <div className="UserHomeContent">
            <h3> Content </h3>
          </div>
        </div>
      </div>
    );
  }
}

export default UserHome;

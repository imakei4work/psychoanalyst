import React, { Component } from 'react';
import './style.css';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * 描画処理.
   */
  render() {
    return (<div>
      <header className="app-header">
        <div className="app-header-back">
          
        </div>
        <div className="app-header-title">
          {this.props.title}
        </div>
        <div className="app-header-hamburger" />
      </header>
      <div className='header-line'></div>
    </div>);
  }
}
export default Header;

import React, { Component } from 'react';
import './style.css';

class TextInput extends Component {
  constructor(props) {
    super(props);
  }
  /**
   * 描画処理.
   */
  render() {
    return (<div className="app-body-row">
          <span className="app-body-text">
            {this.props.text}
          </span>
          <span className="app-body-textbox">
            <input type="text" ></input>
          </span>
    </div>);
  }
}
export default TextInput;

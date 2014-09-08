/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var eventBinder = require('../stream-helpers/EventBinder');
var Immutable = require('immutable');

var ENTER_KEY_CODE = 13;

var TodoTextInput = React.createClass({

  propTypes: {
    className: ReactPropTypes.string,
    id: ReactPropTypes.string,
    placeholder: ReactPropTypes.string,
    onSave: ReactPropTypes.func.isRequired,
    value: ReactPropTypes.string
  },

  getInitialState: function() {
    return {
      value: this.props.value || ''
    };
  },

  componentWillMount: function() {
    var component = this;
    var eventStream = eventBinder(component);

    this.blurStream = eventStream("_onBlur");
    this.keyDownStream = eventStream("_onKeyDown");
    this.changeStream = eventStream("_onChange");
  },

  componentDidMount: function() {
    var component = this;

    var enterStream = this.keyDownStream.filter(function(event) {
      return event.keyCode === ENTER_KEY_CODE;
    });

    var saveStream = this.blurStream.merge(enterStream).map(function(e) {
      return event.target.value;
    })

    var saveWithText = saveStream.filter(function(value) {
      return value !== "";
    })

    saveWithText.onValue(function(title) {
      component.setState({
        value: ''
      });

      component.props.onSave(title);
    });

    this.changeStream.onValue(function(e) {
      component.setState({
        value: e.target.value
      });
    });
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._onBlur}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
        ref="todoTextInput"
      />
    );
  }

});

module.exports = TodoTextInput;

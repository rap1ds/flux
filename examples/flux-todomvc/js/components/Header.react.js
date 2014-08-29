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
var Bacon = require('baconjs');
var TodoTextInput = require('./TodoTextInput.react');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var Header = React.createClass({

  componentWillMount: function() {
    this.onSave = new Bacon.Bus();
  },

  componentDidMount: function() {
    var saveStream = this.onSave
      .map(function(text) {
        return text.trim();
      })
      .filter(function(v) {
        return v;
      });

    AppDispatcher.createTodoStream.plug(saveStream);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this.onSave}
        />
      </header>
    );
  }

});

module.exports = Header;

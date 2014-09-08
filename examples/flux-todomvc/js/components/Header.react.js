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
var TodoTextInput = require('./TodoTextInput.react');
var Immutable = require('immutable');

var Header = React.createClass({

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
          todos={this.props.todos}
        />
      </header>
    );
  },

  onSave: function(title) {
    function create(text) {
      // Hand waving here -- not showing how this interacts with XHR or persistent
      // server-side storage.
      // Using the current timestamp in place of a real id.
      var id = Date.now();
      var _todos = {};
      return Immutable.fromJS({
        id: id,
        complete: false,
        text: text
      });
    }

    this.props.todos.update(function(todos) {
      return todos.toVector().push(create(title))
    })
  }

});

module.exports = Header;

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
var TodoItem = require('./TodoItem.react');
var eventBinder = require('../stream-helpers/EventBinder');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoStore = require('../stores/TodoStore');

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  componentWillMount: function() {
    var eventStream = eventBinder(this);

    this.toggleCompleteAllClickStream = eventStream("_onToggleCompleteAll");
  },

  componentDidMount: function() {
    var component = this;
    TodoStore.allCompleted.onValue(function(allCompleted) {
      component.setState({
        allCompleted: allCompleted
      });
    })

    var toggleAll = this.toggleCompleteAllClickStream.map(function() {
      return !component.state.allCompleted;
    });

    AppDispatcher.toggleAllCompletedStream.plug(toggleAll);
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodos = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  }

});

module.exports = MainSection;

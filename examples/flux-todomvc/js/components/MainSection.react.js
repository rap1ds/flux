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

var MainSection = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired
  },

  allCompleted: function() {
    var allTodos = this.props.allTodos;

    return allTodos.length && allTodos.every(function(todo) {
      return todo.get('complete');
    });
  },

  /**
   * @return {object}
   */
  render: function() {
    var allTodos = this.props.allTodos;

    // This section should be hidden by default
    // and shown when there are todos.
    if(!allTodos || allTodos.length === 0) {
      return null;
    }

    var todos = allTodos.map(function(todo) {
      return (
        <TodoItem key={todo.id} allTodos={allTodos} todo={todo} />
      );
    }).toArray();

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this.onToggleCompleteAll}
          checked={this.allCompleted() ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todos}</ul>
      </section>
    );
  },

  onToggleCompleteAll: function() {
    var allCompleted = this.allCompleted();

    this.props.allTodos.update(function(todos) {
      return todos.map(function(todo) {
        return todo.set('complete', !allCompleted);
      })
    })
  }

});

module.exports = MainSection;

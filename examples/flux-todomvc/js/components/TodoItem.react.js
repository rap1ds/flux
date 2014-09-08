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
var ReactPropTypes = React.PropTypes;
var TodoTextInput = require('./TodoTextInput.react');

var cx = require('react/lib/cx');

var TodoItem = React.createClass({

  propTypes: {
   todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var todo = this.props.todo;

    var input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          className="edit"
          onSave={this.onSave}
          value={todo.get('text')}
        />;
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <li
        className={cx({
          'completed': todo.get('complete'),
          'editing': this.state.isEditing
        })}
        key={todo.get('id')}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.get('complete')}
            onChange={this.onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.get('text')}
          </label>
          <button className="destroy" onClick={this.onDestroyClick} />
        </div>
        {input}
      </li>
    );
  },

  onToggleComplete: function() {
    var todo = this.props.todo;
    todo.set('complete', !todo.get('complete'))
  },

  onSave: function(title) {
    this.setState({isEditing: false});
    this.props.todo.set('text', title);
  },

  onDestroyClick: function() {
    var currentTodo = this.props.todo;

    this.props.allTodos.update(function(allTodosData) {
      return allTodosData.filter(function(todoInList) {
        return todoInList !== currentTodo.deref();
      });
    });
  },

  _onDoubleClick: function() {
    this.setState({isEditing: true});
  }

});

module.exports = TodoItem;

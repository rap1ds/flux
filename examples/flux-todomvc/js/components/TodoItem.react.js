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
var eventBinder = require('../stream-helpers/EventBinder');
var AppDispatcher = require('../dispatcher/AppDispatcher');

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

  componentWillMount: function() {
    var eventStream = eventBinder(this);

    this.onSave = new Bacon.Bus();
    this.destroyClickStream = eventStream("_onDestroyClick");
    this.toggleCompleteClickStream = eventStream("_onToggleComplete");
  },

  componentDidMount: function() {
    var component = this;

    var destroyStream = this.destroyClickStream.map(function() {
      return component.props.todo.id;
    });

    AppDispatcher.destroyTodoStream.plug(destroyStream);

    var completeStream = this.toggleCompleteClickStream.filter(function() {
      return !component.props.todo.complete;
    }).map(function() {
      return component.props.todo.id;
    });

    var undoCompleteStream = this.toggleCompleteClickStream.filter(function() {
      return component.props.todo.complete;
    }).map(function() {
      return component.props.todo.id;
    });

    AppDispatcher.completeStream.plug(completeStream);
    AppDispatcher.undoCompleteStream.plug(undoCompleteStream);

    this.onSave.onValue(function(v) {
      component.setState({isEditing: false});
    });

    var updateStream = this.onSave.map(function(text) {
      return {id: component.props.todo.id, text: text}
    })

    AppDispatcher.updateStream.plug(updateStream);
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
          value={todo.text}
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
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    );
  },

  _onDoubleClick: function() {
    this.setState({isEditing: true});
  }

});

module.exports = TodoItem;

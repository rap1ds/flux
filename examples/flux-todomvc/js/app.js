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

var TodoApp = require('./components/TodoApp.react');
var Immutable = require('immutable')

var renderApplication = function(cursor) {
  React.renderComponent(
    TodoApp({cursor: cursor}),
    document.getElementById('todoapp')
  )
}

var logApplicationState = function(newState) {
  console.log("State: " + newState.toString());
}

var saveApplicationState = function() {

}

/**
 * Start app and refresh it on app state change
 */
var startApp = function(initialState) {
  var cursor = initialState.cursor(refreshApp);

  renderApplication(cursor);
}

var refreshApp = function(newState, oldState, path) {
  var cursor = newState.cursor(refreshApp);

  renderApplication(cursor);
  logApplicationState(newState);
  saveApplicationState(newState, oldState, path);
}

var initialState = Immutable.Map({
  todos: Immutable.Vector()
});

startApp(initialState)

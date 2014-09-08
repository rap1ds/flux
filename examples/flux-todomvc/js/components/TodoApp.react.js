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

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');

var TodoApp = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    var todos = this.props.cursor.cursor(["todos"])
    return (
      <div>
        <Header
          todos={todos}
        />
        <MainSection
          allTodos={todos}
        />
        <Footer allTodos={todos} />
      </div>
    );
  },

});

module.exports = TodoApp;

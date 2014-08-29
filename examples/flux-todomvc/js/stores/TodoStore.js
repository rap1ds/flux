var _ = require('lodash');
var AppDispatcher = require('../dispatcher/AppDispatcher');

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp in place of a real id.
  var id = Date.now();
  var _todos = {};
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
  return _todos;
}

var createNewItem = AppDispatcher.createTodoStream.map(function(text) {
  return text.trim();
}).filter(function(text) {
  return text;
}).map(function(text) {
  return create(text);
}).map(function(todo) {
  return function(todos) {
    return _.assign({}, todos, todo)
  };
});

var destroyTodoStream = AppDispatcher.destroyTodoStream.map(function(todoId) {
  return function(todos) {
    return _.omit(todos, "" + todoId)
  };
});

var completeStream = AppDispatcher.completeStream.map(function(todoId) {
  return function(todos) {
    var complete = {};
    complete[todoId] = {complete: true}
    return _.merge(todos, complete);
  }
});

var undoCompleteStream = AppDispatcher.undoCompleteStream.map(function(todoId) {
  return function(todos) {
    var complete = {};
    complete[todoId] = {complete: false}
    return _.merge(todos, complete);
  }
});

var clearCompletedStream = AppDispatcher.clearCompletedStream.map(function() {
  return function(todos) {
    return _.reject(todos, function(todo) {
      return todo.complete;
    });
  }
});

var toggleAllCompleteMod = AppDispatcher.toggleAllCompletedStream.map(function(toggle) {
  return function(todos) {
    return _.mapValues(todos, function(todo) {
      return _.merge(todo, {complete: toggle});
    });
  };
});

var updateMod = AppDispatcher.updateStream.map(function(value) {
  return function(todos) {
    var newValue = {};
    newValue[value.id] = {text: value.text};
    return _.merge(todos, newValue);
  };
})

var modificationsStream = createNewItem
  .merge(destroyTodoStream)
  .merge(completeStream)
  .merge(undoCompleteStream)
  .merge(clearCompletedStream)
  .merge(toggleAllCompleteMod)
  .merge(updateMod)

var allTodos = modificationsStream.scan({}, function(todos, modificationFn) {
  return modificationFn(todos)
});

var allCompleted = allTodos.map(function(todos) {
  return _.every(todos, function(todo) {
    return todo.complete;
  });
});

module.exports = {
  allTodos: allTodos,
  allCompleted: allCompleted
};

var Bacon = require('baconjs');

var dispatcher = {
  createTodoStream: new Bacon.Bus(),
  destroyTodoStream: new Bacon.Bus(),
  completeStream: new Bacon.Bus(),
  undoCompleteStream: new Bacon.Bus(),
  clearCompletedStream: new Bacon.Bus(),
  toggleAllCompletedStream: new Bacon.Bus(),
  updateStream: new Bacon.Bus()
};

module.exports = dispatcher;

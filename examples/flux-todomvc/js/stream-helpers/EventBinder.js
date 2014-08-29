var Bacon = require('baconjs');

var eventBinder = function(component) {
  var streams = {};

  return function(handlerFnName) {
    var stream = streams[handlerFnName];

    if(!stream) {
      var sendEventToSink;

      component[handlerFnName] = function(event) {
        sendEventToSink(event);
      }

      stream = streams[handlerFnName] = Bacon.fromBinder(function(sink) {
        sendEventToSink = function(event) {
          sink(new Bacon.Next(event));
          return function() {
            // No-op
          }
        }
      });
    }

    return stream;
  }
};

module.exports = eventBinder;

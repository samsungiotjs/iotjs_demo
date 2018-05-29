// utils
var async_queue = [];

function addTask(task) {
  var func;

  if (typeof task === 'function') {
    func = task;
  } else if (task instanceof Task) {
    func = task.func;
  } else {
    console.error('unknown type');
    return;
  }

  async_queue.push(func);
}

function callNextTask() {
  if (async_queue.length) {
    var task = async_queue.shift();
    task();
  } else {
    console.log('task empty');
  }
}

function createConditionCallback(total, callback) {
  var current = 0, errors = [], results = [];
  return function(err, result) {
    if (err) {
      errors.push({
        name: this.__name,
        value: err,
      });
    } else {
      results.push({
        name: this.__name,
        value: result,
      });
    }

    if (++current === total)
      callback(errors, results);
  };
}

function Task(func, callbackContext) {
  this.func = func;
  this.callbackContext = callbackContext;
}

function batchRun(asyncFuncList, callback) {
  var cb = createConditionCallback(asyncFuncList.length, callback);
  asyncFuncList.forEach(function(item) {
    item.func(cb.bind(item.callbackContext));
  });
}

module.exports = {
  addTask: addTask,
  callNextTask: callNextTask,
  batchRun: batchRun,
  createConditionCallback: createConditionCallback,
  Task: Task,
};

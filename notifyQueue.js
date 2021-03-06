﻿let container = document.createElement('div');
container.id = 'snackbarContainer';
document.body.appendChild(container);
let maxConcurrency = 3;

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}



const styleDefaults = {
  opacity: 1,
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
  borderRadius: '0px',
  iconColor: '#fff',
  backgroundColor: '#444',
  buttonBackgroundColor: 'inherit',
  textColor: '#fff',
}

const Snack = function (args) {
  /*Adapted from https://codepen.io/wibblymat/pen/avAjq */
  this.paperSnackbar = document.createElement('div');
  const message = args.message;
  const action = args.action;
  const duration = args.duration;
  args.style ? args.style : args.style = styleDefaults;
  args.actionText ? args.actionText : args.actionText = 'Ok';

  Snack.prototype.dismiss = function () {
    let t = this;
    t.getElement().style.opacity = 0;
    t.getElement().classList.add("removed");
    window.setTimeout(function () {
      t.getElement().parentNode.removeChild(t.getElement());
    }, 500);

  };

  Snack.prototype.close = function () {
    this.dismiss(this.getElement());
  };

  Snack.prototype.Message = function () { return message };

  Snack.prototype.Visible = function () { return this.paperSnackbar.style.opacity > 0 }

  Snack.prototype.getElement = function () { return this.paperSnackbar };

  Snack.prototype.show = function (done) {
    const t = this;
    this.paperSnackbar.className = 'paper-snackbar';
    this.paperSnackbar.style.backgroundColor = args.style.backgroundColor ? args.style.backgroundColor : styleDefaults.backgroundColor;
    this.paperSnackbar.style.borderRadius = args.style.borderRadius ? args.style.borderRadius : styleDefaults.borderRadius;
    this.paperSnackbar.style.boxShadow = args.style.boxShadow ? args.style.boxShadow : styleDefaults.boxShadow;

    const infoIcon = document.createElement('i');
    infoIcon.className = 'medium material-icons';
    infoIcon.innerHTML = 'info_outline';
    infoIcon.style.color = args.style.iconColor ? args.style.iconColor : styleDefaults.iconColor;

    const text = document.createElement('p');
    text.innerHTML = message;
    text.style.fontFamily = "Roboto,sans-serif";
    text.style.lineHeight = 'normal';
    text.style.fontSize = args.style.fontSize ? args.style.fontSize : styleDefaults.fontSize;
    text.style.color = args.style.textColor ? args.style.textColor : styleDefaults.textColor;

    const button = document.createElement('button');
    button.className = 'action btn';
    button.innerHTML = args.actionText;
    button.style.fontFamily = "Roboto,sans-serif";
    button.style.backgroundColor = args.style.buttonBackgroundColor ? args.style.buttonBackgroundColor : styleDefaults.buttonBackgroundColor;

    this.paperSnackbar.appendChild(infoIcon);
    this.paperSnackbar.appendChild(text);
    this.paperSnackbar.appendChild(button);
    container.appendChild(this.paperSnackbar);

    if (action)
      button.addEventListener('click', action.bind(this));
    else
      button.addEventListener('click', function () {
        t.dismiss(this.paperSnackbar)
        done();
      });


    // In order for the animations to trigger, we have to force the original style to be computed, and then change it.
    getComputedStyle(this.paperSnackbar).bottom;
    this.paperSnackbar.style.opacity = args.style.opacity ? args.style.opacity : styleDefaults.opacity;

    if (duration != null) {
      setTimeout(function () {
        t.dismiss(this.paperSnackbar);
        done();
      }, duration)
    }
    else
      done();

  };
}

function queue(concurrency) {
  let running = 0
  const taskQueue = []

  const runTask = function (task) {
    running++
    task(function (_) {
      running--
      if (taskQueue.length > 0) {
        runTask(taskQueue.shift())
      }
    })
  }


  const enqueueTask = function (task) { taskQueue.push(task); }

  return {
    push: function (task) {
      running < concurrency ? runTask(task) : enqueueTask(task)
    },
    Running: function () {
      return running;
    },
    NotMax: function () {
      return running < concurrency;
    }
  }
}

const NotifyQueue = function (args) {
  args ? args : args = {};
  if (args.styleSheet) {
    appendCss(args.styleSheet)
  } else {
    getAjax('https://mathih13-notification-queue.firebaseio.com/css.json', function(data){ appendCss(data.slice(1, -1)) });
  }

  const taskRunner = queue(maxConcurrency);

  NotifyQueue.prototype.notify = function (args) {
    let s = new Snack(args);
    taskRunner.push(
      function (done) {
        s.show(done);
      })
  }

  NotifyQueue.prototype.setDefaultStyle = function (args) {
    Object.assign(styleDefaults, args);
  };

}



window.NotifyQueue = NotifyQueue;

function appendCss(url) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  link.media = 'all';
  head.appendChild(link);
}

function getAjax(url, success) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
}
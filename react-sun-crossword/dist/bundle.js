/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 70);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(33)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(32)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color = __webpack_require__(25);
//these all have the same initial lightness but in rgb which is not ideal
//the values are too dark - so is there a way 
//to provide as hsl !
//these are hsl(x, y, 50%) until call the lightness value
var initialLightness = 80;
var greenColor = Color("rgb(0, 255, 17)").lightness(initialLightness);
var redColor = Color("rgb(255, 13, 0)").lightness(initialLightness);
var orangeColor = Color("rgb(255, 132, 0)").lightness(initialLightness);
var yellowColor = Color("rgb(217, 255, 0)").lightness(initialLightness);
var blueColor = Color("rgb(242, 242, 242)").lightness(95);
//this will be added in at the end
var whiteRgb = "rgb(247, 247, 247)";
var blackRgb = "rgb(51, 51, 51)";
var notSelectedSolutionModeColours = [
    {
        mode: 'Guessing',
        color: blueColor
    }, {
        mode: 'Solved',
        color: greenColor
    }, {
        mode: 'Unsolved',
        color: redColor
    }, {
        mode: 'Cheating',
        color: orangeColor
    }
];
var changeAmount = 0.3;
var selectionModes = [{
        mode: 'notSelected',
        change: 0
    }, {
        mode: 'selected',
        change: 2
    }, {
        mode: 'wordSelected',
        change: 1
    }
];
var styles = {};
selectionModes.forEach(selectionMode => {
    notSelectedSolutionModeColours.forEach(notSelectedSolutionModeColour => {
        styles[selectionMode.mode + notSelectedSolutionModeColour.mode] = {
            backgroundColor: notSelectedSolutionModeColour.color.darken(changeAmount * selectionMode.change).rgb().toString()
        };
    });
});
styles.notSelectedGuessing.backgroundColor = whiteRgb;
styles.blank = { backgroundColor: blackRgb };
styles.letter = { backgroundColor: blackRgb };
styles.autoSolved = styles.selectedSolved;
exports.commonColourStyles = styles;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SolvingMode;
(function (SolvingMode) {
    SolvingMode[SolvingMode["Guessing"] = 0] = "Guessing";
    SolvingMode[SolvingMode["Solving"] = 1] = "Solving";
    SolvingMode[SolvingMode["Cheating"] = 2] = "Cheating";
})(SolvingMode = exports.SolvingMode || (exports.SolvingMode = {}));
class Word {
    constructor() {
        this.squares = [];
        this.solvingMode = SolvingMode.Guessing;
    }
    _setSolvingMode(solvingMode) {
        this.squares.forEach(square => square.solvingMode = solvingMode);
        this.solvingMode = solvingMode;
    }
    solved() {
        var isSolved = true;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            if (square.guess !== square.letter) {
                isSolved = false;
                break;
            }
        }
        return isSolved;
    }
    //cheat() {
    //    this._setSolvingMode(SolvingMode.Cheating);
    //}
    //uncheat() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    //solve() {
    //    this._setSolvingMode(SolvingMode.Solving);
    //}
    //unsolve() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    _setSelectionState(selected) {
        this.squares.forEach(square => square.wordSelected = selected);
        this.selected = selected;
    }
    select() {
        this._setSelectionState(true);
    }
    deselect() {
        this._setSelectionState(false);
    }
}
exports.Word = Word;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



var emptyFunction = __webpack_require__(3);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(7);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_CLASS = 'react-tabs__tab';

var Tab = function (_Component) {
  _inherits(Tab, _Component);

  function Tab() {
    _classCallCheck(this, Tab);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Tab.prototype.componentDidMount = function componentDidMount() {
    this.checkFocus();
  };

  Tab.prototype.componentDidUpdate = function componentDidUpdate() {
    this.checkFocus();
  };

  Tab.prototype.checkFocus = function checkFocus() {
    if (this.props.selected && this.props.focus) {
      this.node.focus();
    }
  };

  Tab.prototype.render = function render() {
    var _cx,
        _this2 = this;

    var _props = this.props,
        children = _props.children,
        className = _props.className,
        disabled = _props.disabled,
        disabledClassName = _props.disabledClassName,
        focus = _props.focus,
        id = _props.id,
        panelId = _props.panelId,
        selected = _props.selected,
        selectedClassName = _props.selectedClassName,
        tabRef = _props.tabRef,
        attributes = _objectWithoutProperties(_props, ['children', 'className', 'disabled', 'disabledClassName', 'focus', 'id', 'panelId', 'selected', 'selectedClassName', 'tabRef']);

    return _react2.default.createElement(
      'li',
      _extends({}, attributes, {
        className: (0, _classnames2.default)(className, (_cx = {}, _cx[selectedClassName] = selected, _cx[disabledClassName] = disabled, _cx)),
        ref: function ref(node) {
          _this2.node = node;
          if (tabRef) tabRef(node);
        },
        role: 'tab',
        id: id,
        'aria-selected': selected ? 'true' : 'false',
        'aria-disabled': disabled ? 'true' : 'false',
        'aria-controls': panelId,
        tabIndex: selected ? '0' : null
      }),
      children
    );
  };

  return Tab;
}(_react.Component);

Tab.defaultProps = {
  className: DEFAULT_CLASS,
  disabledClassName: DEFAULT_CLASS + '--disabled',
  focus: false,
  id: null,
  panelId: null,
  selected: false,
  selectedClassName: DEFAULT_CLASS + '--selected'
};
exports.default = Tab;
Tab.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.string]),
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  disabled: _propTypes2.default.bool,
  disabledClassName: _propTypes2.default.string, // private
  focus: _propTypes2.default.bool, // private
  id: _propTypes2.default.string, // private
  panelId: _propTypes2.default.string, // private
  selected: _propTypes2.default.bool, // private
  selectedClassName: _propTypes2.default.string, // private
  tabRef: _propTypes2.default.func } : {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(7);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabList = function (_Component) {
  _inherits(TabList, _Component);

  function TabList() {
    _classCallCheck(this, TabList);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  TabList.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        attributes = _objectWithoutProperties(_props, ['children', 'className']);

    return _react2.default.createElement(
      'ul',
      _extends({}, attributes, { className: (0, _classnames2.default)(className), role: 'tablist' }),
      children
    );
  };

  return TabList;
}(_react.Component);

TabList.defaultProps = {
  className: 'react-tabs__tab-list'
};
exports.default = TabList;
TabList.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]),
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object])
} : {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(7);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_CLASS = 'react-tabs__tab-panel';

var TabPanel = function (_Component) {
  _inherits(TabPanel, _Component);

  function TabPanel() {
    _classCallCheck(this, TabPanel);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  TabPanel.prototype.render = function render() {
    var _cx;

    var _props = this.props,
        children = _props.children,
        className = _props.className,
        forceRender = _props.forceRender,
        id = _props.id,
        selected = _props.selected,
        selectedClassName = _props.selectedClassName,
        tabId = _props.tabId,
        attributes = _objectWithoutProperties(_props, ['children', 'className', 'forceRender', 'id', 'selected', 'selectedClassName', 'tabId']);

    return _react2.default.createElement(
      'div',
      _extends({}, attributes, {
        className: (0, _classnames2.default)(className, (_cx = {}, _cx[selectedClassName] = selected, _cx)),
        role: 'tabpanel',
        id: id,
        'aria-labelledby': tabId
      }),
      forceRender || selected ? children : null
    );
  };

  return TabPanel;
}(_react.Component);

TabPanel.defaultProps = {
  className: DEFAULT_CLASS,
  forceRender: false,
  selectedClassName: DEFAULT_CLASS + '--selected',
  style: {}
};
exports.default = TabPanel;
TabPanel.propTypes = process.env.NODE_ENV !== "production" ? {
  selectedClassName: _propTypes2.default.string, // private
  children: _propTypes2.default.node,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  forceRender: _propTypes2.default.bool,
  id: _propTypes2.default.string, // private
  selected: _propTypes2.default.bool, // private
  tabId: _propTypes2.default.string } : {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class TwoCol extends React.Component {
    render() {
        var leftPercent = 50;
        if (this.props.leftPercentage) {
            leftPercent = this.props.leftPercentage;
        }
        var rightPercent = 100 - leftPercent;
        var leftStyle = {
            float: 'left',
            width: leftPercent + '%',
            height: '100%',
            overflow: this.props.colOverflow ? this.props.colOverflow : 'hidden'
        };
        var rightStyle = {
            float: 'left',
            width: rightPercent + '%',
            height: '100%',
            overflow: this.props.colOverflow ? this.props.colOverflow : 'hidden'
        };
        var left = React.createElement("div", { style: leftStyle }, this.props.leftContent);
        var right = React.createElement("div", { style: rightStyle },
            this.props.rightContent,
            " ");
        var container = React.createElement("div", null,
            left,
            right);
        if (this.props.containerStyle) {
            container = React.createElement("div", { style: this.props.containerStyle },
                left,
                right);
        }
        return container;
    }
}
exports.TwoCol = TwoCol;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Key event names.
 */
exports.KEYDOWN = 'keydown';
exports.KEYPRESS = 'keypress';
exports.KEYUP = 'keyup';


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(16);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var prefix = __webpack_require__(30)
var toCamelCase = __webpack_require__(54)
var cache = { 'float': 'cssFloat' }
var addPxToStyle = __webpack_require__(26)

function style (element, property, value) {
  var camel = cache[property]
  if (typeof camel === 'undefined') {
    camel = detect(property)
  }

  // may be false if CSS prop is unsupported
  if (camel) {
    if (value === undefined) {
      return element.style[camel]
    }

    element.style[camel] = addPxToStyle(camel, value)
  }
}

function each (element, properties) {
  for (var k in properties) {
    if (properties.hasOwnProperty(k)) {
      style(element, k, properties[k])
    }
  }
}

function detect (cssProp) {
  var camel = toCamelCase(cssProp)
  var result = prefix(camel)
  cache[camel] = cache[cssProp] = cache[result] = result
  return result
}

function set () {
  if (arguments.length === 2) {
    if (typeof arguments[1] === 'string') {
      arguments[0].style.cssText = arguments[1]
    } else {
      each(arguments[0], arguments[1])
    }
  } else {
    style(arguments[0], arguments[1], arguments[2])
  }
}

module.exports = set
module.exports.set = set

module.exports.get = function (element, properties) {
  if (Array.isArray(properties)) {
    return properties.reduce(function (obj, prop) {
      obj[prop] = style(element, prop || '')
      return obj
    }, {})
  } else {
    return style(element, properties || '')
  }
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getTabsCount = getTabsCount;
exports.getPanelsCount = getPanelsCount;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _TabList = __webpack_require__(10);

var _TabList2 = _interopRequireDefault(_TabList);

var _Tab = __webpack_require__(9);

var _Tab2 = _interopRequireDefault(_Tab);

var _TabPanel = __webpack_require__(11);

var _TabPanel2 = _interopRequireDefault(_TabPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTabsCount(children) {
  var tabLists = _react2.default.Children.toArray(children).filter(function (x) {
    return x.type === _TabList2.default;
  });

  if (tabLists[0] && tabLists[0].props.children) {
    return _react2.default.Children.count(_react2.default.Children.toArray(tabLists[0].props.children).filter(function (x) {
      return x.type === _Tab2.default;
    }));
  }

  return 0;
}

function getPanelsCount(children) {
  return _react2.default.Children.count(_react2.default.Children.toArray(children).filter(function (x) {
    return x.type === _TabPanel2.default;
  }));
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.childrenPropType = childrenPropType;
exports.onSelectPropType = onSelectPropType;
exports.selectedIndexPropType = selectedIndexPropType;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Tab = __webpack_require__(9);

var _Tab2 = _interopRequireDefault(_Tab);

var _TabList = __webpack_require__(10);

var _TabList2 = _interopRequireDefault(_TabList);

var _TabPanel = __webpack_require__(11);

var _TabPanel2 = _interopRequireDefault(_TabPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function childrenPropType(props, propName, componentName) {
  var error = void 0;
  var tabsCount = 0;
  var panelsCount = 0;
  var children = props[propName];

  _react2.default.Children.forEach(children, function (child) {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) {
      return;
    }

    if (child.type === _TabList2.default) {
      _react2.default.Children.forEach(child.props.children, function (c) {
        // null happens when conditionally rendering TabPanel/Tab
        // see https://github.com/reactjs/react-tabs/issues/37
        if (c === null) {
          return;
        }

        if (c.type === _Tab2.default) {
          tabsCount++;
        }
      });
    } else if (child.type === _TabPanel2.default) {
      panelsCount++;
    } else {
      error = new Error('Expected \'TabList\' or \'TabPanel\' but found \'' + (child.type.displayName || child.type) + '\' in `' + componentName + '`');
    }
  });

  if (tabsCount !== panelsCount) {
    error = new Error('There should be an equal number of \'Tab\' and \'TabPanel\' in `' + componentName + '`.' + ('Received ' + tabsCount + ' \'Tab\' and ' + panelsCount + ' \'TabPanel\'.'));
  }

  return error;
}

function onSelectPropType(props, propName, componentName, location, propFullName) {
  var prop = props[propName];
  var name = propFullName || propName;
  var error = null;

  if (prop && typeof prop !== 'function') {
    error = new Error('Invalid ' + location + ' `' + name + '` of type `' + (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) + '` supplied to `' + componentName + '`, expected `function`.');
  } else if (props.selectedIndex != null && prop == null) {
    error = new Error('The ' + location + ' `' + name + '` is marked as required in `' + componentName + '`, but its value is `undefined` or `null`.\n`onSelect` is required when `selectedIndex` is also set. Not doing so will make the tabs not do anything, as `selectedIndex` indicates that you want to handle the selected tab yourself.\nIf you only want to set the inital tab replace `selectedIndex` with `defaultIndex`.');
  }

  return error;
}

function selectedIndexPropType(props, propName, componentName, location, propFullName) {
  var prop = props[propName];
  var name = propFullName || propName;
  var error = null;

  if (prop != null && typeof prop !== 'number') {
    error = new Error('Invalid ' + location + ' `' + name + '` of type `' + (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) + '` supplied to `' + componentName + '`, expected `number`.');
  } else if (props.defaultIndex != null && prop != null) {
    return new Error('The ' + location + ' `' + name + '` cannot be used together with `defaultIndex` in `' + componentName + '`.\nEither remove `' + name + '` to let `' + componentName + '` handle the selected tab internally or remove `defaultIndex` to handle it yourself.');
  }

  return error;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = uuid;
exports.reset = reset;
// Get a universally unique identifier
var count = 0;
function uuid() {
  return "react-tabs-" + count++;
}

function reset() {
  count = 0;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const SunCrosswordModelProvider_1 = __webpack_require__(69);
const crosswordPuzzle_1 = __webpack_require__(62);
class CrosswordPuzzleLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { crosswordModel: this.getModel() };
    }
    getModel() {
        var crosswordJson = {
            "data": {
                "headline": "Crossword No 431844",
                "type": "games",
                "meta": {
                    "pdf": "crossword-20170507-23830.pdf",
                    "print_index": "print.html"
                },
                "copy": {
                    "title": "Crossword No 431844",
                    "id": "23830",
                    "description": "",
                    "publisher": "The Sun",
                    "setter": "",
                    "byline": "",
                    "date-publish": "Sunday, 07 May 2017",
                    "date-publish-email": "07 May 2017",
                    "date-publish-analytics": "2017\/05\/07 00:00 sunday",
                    "date-release": "2017-05-07 00:00:00",
                    "date-solution": "2017-05-08 00:00:00",
                    "crosswordtype": "Two Speed",
                    "correctsolutionmessagetext": "You've done it!",
                    "previoussolutiontext": "Previous crossword solution",
                    "previoussolutionlink": "http:\/\/feeds.thesun.co.uk\/puzzles\/crossword\/20170506\/23829\/",
                    "type": "block",
                    "gridsize": {
                        "type": "Standard",
                        "cols": "13",
                        "rows": "13"
                    },
                    "settings": {
                        "solution_hashed": "4ba089e97b12962ceb1b70e6111c9c87",
                        "solution": "CLOSECALL INKR U X S E R NOCTET TREMOLOS S E U R N WSATURATE ASTI  A N E M   NKEYPAD NOSINGE   L P N S  EDGY KINGCRABP R E C O A EFROGMAN LEEKSI A U I I L ETON SOCIALIST"
                    },
                    "hints": {
                        "Mark Errors": "0",
                        "Solve Letter": "0",
                        "Solve Word": "0",
                        "Ask A Friend": "0"
                    },
                    "clues": [
                        {
                            "name": "Cryptic",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "A hundred to miss summons &ndash; a narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Some thinking writers need it?",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Eight players etc to play",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Lot more confused by the musical effect",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Soak a suet-tar concoction",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Firstly, all should try Italian wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Part of phone provides entry device to flat",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Numbers in Greek capital being inquisitive",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Entered gym, somewhat nervous",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Cooks ring back to get crustacean",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Gold initially brought in from an amphibious diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Seeps, it's said, like these vegetables?",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Part of a stone weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing gathering, it's broken up",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Cryptic",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Mark is annoyed",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Show greater endurance than troublesome tout, say",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Outside in vortex, tern alights",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Clever use of statue",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Ogle when dance comes up",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Makes smooth for fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Aware of the monarch about this time",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "Looming, a different Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Look up suitable exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "Serial I translated, from Jerusalem perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Meal outside to choose and take, both unfinished",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Low sound, developed sound",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Surround and harass live group",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Some Aussie museum houses birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "Narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Pen fluid",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Band of eight",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Musical vibration",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Drench",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Fizzy wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Console",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Prying",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Anxious",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Edible crustacean of the North Pacific",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Pungent vegetables",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Great weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Angry",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Last longer than",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Lying outside",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Canny",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Stare suggestively",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Chains, fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Being aware of",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "East Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Healthy exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "From Tel Aviv, perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Alfresco meal",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Sigh loudly",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Encircle",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Australian birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        }
                    ],
                    "words": [
                        {
                            "id": 1,
                            "x": "1-9",
                            "y": "1",
                            "solution": "CLOSECALL"
                        },
                        {
                            "id": 2,
                            "x": "11-13",
                            "y": "1",
                            "solution": "INK"
                        },
                        {
                            "id": 3,
                            "x": "1-5",
                            "y": "3",
                            "solution": "OCTET"
                        },
                        {
                            "id": 4,
                            "x": "7-13",
                            "y": "3",
                            "solution": "TREMOLO"
                        },
                        {
                            "id": 5,
                            "x": "1-8",
                            "y": "5",
                            "solution": "SATURATE"
                        },
                        {
                            "id": 6,
                            "x": "10-13",
                            "y": "5",
                            "solution": "ASTI"
                        },
                        {
                            "id": 7,
                            "x": "1-6",
                            "y": "7",
                            "solution": "KEYPAD"
                        },
                        {
                            "id": 8,
                            "x": "8-13",
                            "y": "7",
                            "solution": "NOSING"
                        },
                        {
                            "id": 9,
                            "x": "1-4",
                            "y": "9",
                            "solution": "EDGY"
                        },
                        {
                            "id": 10,
                            "x": "6-13",
                            "y": "9",
                            "solution": "KINGCRAB"
                        },
                        {
                            "id": 11,
                            "x": "1-7",
                            "y": "11",
                            "solution": "FROGMAN"
                        },
                        {
                            "id": 12,
                            "x": "9-13",
                            "y": "11",
                            "solution": "LEEKS"
                        },
                        {
                            "id": 13,
                            "x": "1-3",
                            "y": "13",
                            "solution": "TON"
                        },
                        {
                            "id": 14,
                            "x": "5-13",
                            "y": "13",
                            "solution": "SOCIALIST"
                        },
                        {
                            "id": 15,
                            "x": "1",
                            "y": "1-5",
                            "solution": "CROSS"
                        },
                        {
                            "id": 16,
                            "x": "3",
                            "y": "1-7",
                            "solution": "OUTSTAY"
                        },
                        {
                            "id": 17,
                            "x": "5",
                            "y": "1-8",
                            "solution": "EXTERNAL"
                        },
                        {
                            "id": 18,
                            "x": "7",
                            "y": "1-6",
                            "solution": "ASTUTE"
                        },
                        {
                            "id": 19,
                            "x": "9",
                            "y": "1-4",
                            "solution": "LEER"
                        },
                        {
                            "id": 20,
                            "x": "11",
                            "y": "1-5",
                            "solution": "IRONS"
                        },
                        {
                            "id": 21,
                            "x": "13",
                            "y": "1-7",
                            "solution": "KNOWING"
                        },
                        {
                            "id": 22,
                            "x": "9",
                            "y": "6-13",
                            "solution": "MONGOLIA"
                        },
                        {
                            "id": 23,
                            "x": "1",
                            "y": "7-13",
                            "solution": "KEEPFIT"
                        },
                        {
                            "id": 24,
                            "x": "11",
                            "y": "7-13",
                            "solution": "ISRAELI"
                        },
                        {
                            "id": 25,
                            "x": "7",
                            "y": "8-13",
                            "solution": "PICNIC"
                        },
                        {
                            "id": 26,
                            "x": "3",
                            "y": "9-13",
                            "solution": "GROAN"
                        },
                        {
                            "id": 27,
                            "x": "13",
                            "y": "9-13",
                            "solution": "BESET"
                        },
                        {
                            "id": 28,
                            "x": "5",
                            "y": "10-13",
                            "solution": "EMUS"
                        }
                    ]
                },
                "options": [],
                "competitioncrossword": 0,
                "grid": [
                    [
                        {
                            "SquareID": 1,
                            "Number": "1",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 2,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 3,
                            "Number": "2",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 4,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 5,
                            "Number": "3",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 6,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 7,
                            "Number": "4",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 8,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 9,
                            "Number": "5",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 10,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 11,
                            "Number": "6",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 12,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 13,
                            "Number": "7",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 14,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 15,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 16,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 17,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 18,
                            "Number": "",
                            "Letter": "X",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 19,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 20,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 21,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 22,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 23,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 24,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 25,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 26,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 27,
                            "Number": "8",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 28,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 29,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 30,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 31,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 32,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 33,
                            "Number": "9",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 34,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 35,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 36,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 37,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 38,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 39,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 40,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 41,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 42,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 43,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 44,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 45,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 46,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 47,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 48,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 49,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 50,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 51,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 52,
                            "Number": "",
                            "Letter": "W",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 53,
                            "Number": "10",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 54,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 55,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 56,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 57,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 58,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 59,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 60,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 61,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 62,
                            "Number": "11",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 63,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 64,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 65,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 66,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 67,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 68,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 69,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 70,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 71,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 72,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 73,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 74,
                            "Number": "12",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 75,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 76,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 77,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 78,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 79,
                            "Number": "13",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 80,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 81,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 82,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 83,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 84,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 85,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 86,
                            "Number": "14",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 87,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 88,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 89,
                            "Number": "15",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 90,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 91,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 92,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 93,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 94,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 95,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 96,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 97,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 98,
                            "Number": "16",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 99,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 100,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 101,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 102,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 103,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 104,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        }
                    ],
                    [
                        {
                            "SquareID": 105,
                            "Number": "17",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 106,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 107,
                            "Number": "18",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 108,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 109,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 110,
                            "Number": "19",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 111,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 112,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 113,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 114,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 115,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 116,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 117,
                            "Number": "20",
                            "Letter": "B",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 118,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 119,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 120,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 121,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 122,
                            "Number": "21",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 123,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 124,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 125,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 126,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 127,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 128,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 129,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 130,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 131,
                            "Number": "22",
                            "Letter": "F",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 132,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 133,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 134,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 135,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 136,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 137,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 138,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 139,
                            "Number": "23",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 140,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 141,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 142,
                            "Number": "",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 143,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 144,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 145,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 146,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 147,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 148,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 149,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 150,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 151,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 152,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 153,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 154,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 155,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 156,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 157,
                            "Number": "24",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 158,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 159,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 160,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 161,
                            "Number": "25",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 162,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 163,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 164,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 165,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 166,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 167,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 168,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 169,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 27
                        }
                    ]
                ],
                "created": "2017-05-08 00:00:21"
            }
        };
        var model = SunCrosswordModelProvider_1.ModelFromJson(crosswordJson);
        return model;
    }
    render() {
        return React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
    }
}
exports.CrosswordPuzzleLoader = CrosswordPuzzleLoader;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorString = __webpack_require__(29);
var convert = __webpack_require__(27);

var _slice = [].slice;

var skippedModels = [
	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// gray conflicts with some method names, and has its own method defined.
	'gray',

	// shouldn't really be in color-convert either...
	'hex'
];

var hashedModelKeys = {};
Object.keys(convert).forEach(function (model) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
});

var limiters = {};

function Color(obj, model) {
	if (!(this instanceof Color)) {
		return new Color(obj, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	var i;
	var channels;

	if (!obj) {
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (obj instanceof Color) {
		this.model = obj.model;
		this.color = obj.color.slice();
		this.valpha = obj.valpha;
	} else if (typeof obj === 'string') {
		var result = colorString.get(obj);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + obj);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (obj.length) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		var newArr = _slice.call(obj, 0, channels);
		this.color = zeroArray(newArr, channels);
		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
	} else if (typeof obj === 'number') {
		// this is always RGB - can be converted later on.
		obj &= 0xFFFFFF;
		this.model = 'rgb';
		this.color = [
			(obj >> 16) & 0xFF,
			(obj >> 8) & 0xFF,
			obj & 0xFF
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		var keys = Object.keys(obj);
		if ('alpha' in obj) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
		}

		var hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
		}

		this.model = hashedModelKeys[hashedKeys];

		var labels = convert[this.model].labels;
		var color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(obj[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			var limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString: function () {
		return this.string();
	},

	toJSON: function () {
		return this[this.model]();
	},

	string: function (places) {
		var self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString: function (places) {
		var self = this.rgb().round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array: function () {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object: function () {
		var result = {};
		var channels = convert[this.model].channels;
		var labels = convert[this.model].labels;

		for (var i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray: function () {
		var rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject: function () {
		var rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round: function (places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha: function (val) {
		if (arguments.length) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
		}

		return this.valpha;
	},

	// rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return convert[this.model].keyword(this.color);
	},

	hex: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber: function () {
		var rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.rgb().color;

		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.rgb().color;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = this.rgb();
		for (var i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}
		return rgb;
	},

	lighten: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten: function (ratio) {
		var hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken: function (ratio) {
		var hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale: function () {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var rgb = this.rgb().color;
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(val, val, val);
	},

	fade: function (ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer: function (ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate: function (degrees) {
		var hsl = this.hsl();
		var hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix: function (mixinColor, weight) {
		// ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		var color1 = this.rgb();
		var color2 = mixinColor.rgb();
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return Color.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue(),
				color1.alpha() * p + color2.alpha() * (1 - p));
	}
};

// model conversion methods and static constructors
Object.keys(convert).forEach(function (model) {
	if (skippedModels.indexOf(model) !== -1) {
		return;
	}

	var channels = convert[model].channels;

	// conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length) {
			return new Color(arguments, model);
		}

		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}
		return new Color(color, model);
	};
});

function roundTo(num, places) {
	return Number(num.toFixed(places));
}

function roundToPlace(places) {
	return function (num) {
		return roundTo(num, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	model.forEach(function (m) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	});

	model = model[0];

	return function (val) {
		var result;

		if (arguments.length) {
			if (modifier) {
				val = modifier(val);
			}

			result = this[model]();
			result.color[channel] = val;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(val) {
	return Array.isArray(val) ? val : [val];
}

function zeroArray(arr, length) {
	for (var i = 0; i < length; i++) {
		if (typeof arr[i] !== 'number') {
			arr[i] = 0;
		}
	}

	return arr;
}

module.exports = Color;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/* The following list is defined in React's core */
var IS_UNITLESS = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

module.exports = function(name, value) {
  if(typeof value === 'number' && !IS_UNITLESS[ name ]) {
    return value + 'px';
  } else {
    return value;
  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(15);
var route = __webpack_require__(28);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(15);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

// https://jsperf.com/object-keys-vs-for-in-with-closure/3
var models = Object.keys(conversions);

function buildGraph() {
	var graph = {};

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(16);
var swizzle = __webpack_require__(52);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var div = null
var prefixes = [ 'Webkit', 'Moz', 'O', 'ms' ]

module.exports = function prefixStyle (prop) {
  // re-use a dummy div
  if (!div) {
    div = document.createElement('div')
  }

  var style = div.style

  // prop exists without prefix
  if (prop in style) {
    return prop
  }

  // borderRadius -> BorderRadius
  var titleCase = prop.charAt(0).toUpperCase() + prop.slice(1)

  // find the vendor-prefixed prop
  for (var i = prefixes.length; i >= 0; i--) {
    var name = prefixes[i] + titleCase
    // e.g. WebkitBorderRadius or webkitBorderRadius
    if (name in style) {
      return name
    }
  }

  return false
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(2);
  var warning = __webpack_require__(8);
  var ReactPropTypesSecret = __webpack_require__(18);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(3);
var invariant = __webpack_require__(2);

module.exports = function() {
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  function shim() {
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(3);
var invariant = __webpack_require__(2);
var warning = __webpack_require__(8);

var ReactPropTypesSecret = __webpack_require__(18);
var checkPropTypes = __webpack_require__(31);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(35)
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.renderViewDefault = renderViewDefault;
exports.renderTrackHorizontalDefault = renderTrackHorizontalDefault;
exports.renderTrackVerticalDefault = renderTrackVerticalDefault;
exports.renderThumbHorizontalDefault = renderThumbHorizontalDefault;
exports.renderThumbVerticalDefault = renderThumbVerticalDefault;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable react/prop-types */

function renderViewDefault(props) {
    return _react2["default"].createElement('div', props);
}

function renderTrackHorizontalDefault(_ref) {
    var style = _ref.style,
        props = _objectWithoutProperties(_ref, ['style']);

    var finalStyle = _extends({}, style, {
        right: 2,
        bottom: 2,
        left: 2,
        borderRadius: 3
    });
    return _react2["default"].createElement('div', _extends({ style: finalStyle }, props));
}

function renderTrackVerticalDefault(_ref2) {
    var style = _ref2.style,
        props = _objectWithoutProperties(_ref2, ['style']);

    var finalStyle = _extends({}, style, {
        right: 2,
        bottom: 2,
        top: 2,
        borderRadius: 3
    });
    return _react2["default"].createElement('div', _extends({ style: finalStyle }, props));
}

function renderThumbHorizontalDefault(_ref3) {
    var style = _ref3.style,
        props = _objectWithoutProperties(_ref3, ['style']);

    var finalStyle = _extends({}, style, {
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    });
    return _react2["default"].createElement('div', _extends({ style: finalStyle }, props));
}

function renderThumbVerticalDefault(_ref4) {
    var style = _ref4.style,
        props = _objectWithoutProperties(_ref4, ['style']);

    var finalStyle = _extends({}, style, {
        cursor: 'pointer',
        borderRadius: 'inherit',
        backgroundColor: 'rgba(0,0,0,.2)'
    });
    return _react2["default"].createElement('div', _extends({ style: finalStyle }, props));
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raf2 = __webpack_require__(34);

var _raf3 = _interopRequireDefault(_raf2);

var _domCss = __webpack_require__(17);

var _domCss2 = _interopRequireDefault(_domCss);

var _react = __webpack_require__(0);

var _propTypes = __webpack_require__(48);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _isString = __webpack_require__(43);

var _isString2 = _interopRequireDefault(_isString);

var _getScrollbarWidth = __webpack_require__(42);

var _getScrollbarWidth2 = _interopRequireDefault(_getScrollbarWidth);

var _returnFalse = __webpack_require__(44);

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _getInnerWidth = __webpack_require__(41);

var _getInnerWidth2 = _interopRequireDefault(_getInnerWidth);

var _getInnerHeight = __webpack_require__(40);

var _getInnerHeight2 = _interopRequireDefault(_getInnerHeight);

var _styles = __webpack_require__(38);

var _defaultRenderElements = __webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scrollbars = function (_Component) {
    _inherits(Scrollbars, _Component);

    function Scrollbars(props) {
        var _ref;

        _classCallCheck(this, Scrollbars);

        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Scrollbars.__proto__ || Object.getPrototypeOf(Scrollbars)).call.apply(_ref, [this, props].concat(rest)));

        _this.getScrollLeft = _this.getScrollLeft.bind(_this);
        _this.getScrollTop = _this.getScrollTop.bind(_this);
        _this.getScrollWidth = _this.getScrollWidth.bind(_this);
        _this.getScrollHeight = _this.getScrollHeight.bind(_this);
        _this.getClientWidth = _this.getClientWidth.bind(_this);
        _this.getClientHeight = _this.getClientHeight.bind(_this);
        _this.getValues = _this.getValues.bind(_this);
        _this.getThumbHorizontalWidth = _this.getThumbHorizontalWidth.bind(_this);
        _this.getThumbVerticalHeight = _this.getThumbVerticalHeight.bind(_this);
        _this.getScrollLeftForOffset = _this.getScrollLeftForOffset.bind(_this);
        _this.getScrollTopForOffset = _this.getScrollTopForOffset.bind(_this);

        _this.scrollLeft = _this.scrollLeft.bind(_this);
        _this.scrollTop = _this.scrollTop.bind(_this);
        _this.scrollToLeft = _this.scrollToLeft.bind(_this);
        _this.scrollToTop = _this.scrollToTop.bind(_this);
        _this.scrollToRight = _this.scrollToRight.bind(_this);
        _this.scrollToBottom = _this.scrollToBottom.bind(_this);

        _this.handleTrackMouseEnter = _this.handleTrackMouseEnter.bind(_this);
        _this.handleTrackMouseLeave = _this.handleTrackMouseLeave.bind(_this);
        _this.handleHorizontalTrackMouseDown = _this.handleHorizontalTrackMouseDown.bind(_this);
        _this.handleVerticalTrackMouseDown = _this.handleVerticalTrackMouseDown.bind(_this);
        _this.handleHorizontalThumbMouseDown = _this.handleHorizontalThumbMouseDown.bind(_this);
        _this.handleVerticalThumbMouseDown = _this.handleVerticalThumbMouseDown.bind(_this);
        _this.handleWindowResize = _this.handleWindowResize.bind(_this);
        _this.handleScroll = _this.handleScroll.bind(_this);
        _this.handleDrag = _this.handleDrag.bind(_this);
        _this.handleDragEnd = _this.handleDragEnd.bind(_this);

        _this.state = {
            didMountUniversal: false
        };
        return _this;
    }

    _createClass(Scrollbars, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.addListeners();
            this.update();
            this.componentDidMountUniversal();
        }
    }, {
        key: 'componentDidMountUniversal',
        value: function componentDidMountUniversal() {
            // eslint-disable-line react/sort-comp
            var universal = this.props.universal;

            if (!universal) return;
            this.setState({ didMountUniversal: true });
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.update();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.removeListeners();
            (0, _raf2.cancel)(this.requestFrame);
            clearTimeout(this.hideTracksTimeout);
            clearInterval(this.detectScrollingInterval);
        }
    }, {
        key: 'getScrollLeft',
        value: function getScrollLeft() {
            return this.view.scrollLeft;
        }
    }, {
        key: 'getScrollTop',
        value: function getScrollTop() {
            return this.view.scrollTop;
        }
    }, {
        key: 'getScrollWidth',
        value: function getScrollWidth() {
            return this.view.scrollWidth;
        }
    }, {
        key: 'getScrollHeight',
        value: function getScrollHeight() {
            return this.view.scrollHeight;
        }
    }, {
        key: 'getClientWidth',
        value: function getClientWidth() {
            return this.view.clientWidth;
        }
    }, {
        key: 'getClientHeight',
        value: function getClientHeight() {
            return this.view.clientHeight;
        }
    }, {
        key: 'getValues',
        value: function getValues() {
            var _view = this.view,
                scrollLeft = _view.scrollLeft,
                scrollTop = _view.scrollTop,
                scrollWidth = _view.scrollWidth,
                scrollHeight = _view.scrollHeight,
                clientWidth = _view.clientWidth,
                clientHeight = _view.clientHeight;


            return {
                left: scrollLeft / (scrollWidth - clientWidth) || 0,
                top: scrollTop / (scrollHeight - clientHeight) || 0,
                scrollLeft: scrollLeft,
                scrollTop: scrollTop,
                scrollWidth: scrollWidth,
                scrollHeight: scrollHeight,
                clientWidth: clientWidth,
                clientHeight: clientHeight
            };
        }
    }, {
        key: 'getThumbHorizontalWidth',
        value: function getThumbHorizontalWidth() {
            var _props = this.props,
                thumbSize = _props.thumbSize,
                thumbMinSize = _props.thumbMinSize;
            var _view2 = this.view,
                scrollWidth = _view2.scrollWidth,
                clientWidth = _view2.clientWidth;

            var trackWidth = (0, _getInnerWidth2["default"])(this.trackHorizontal);
            var width = Math.ceil(clientWidth / scrollWidth * trackWidth);
            if (trackWidth === width) return 0;
            if (thumbSize) return thumbSize;
            return Math.max(width, thumbMinSize);
        }
    }, {
        key: 'getThumbVerticalHeight',
        value: function getThumbVerticalHeight() {
            var _props2 = this.props,
                thumbSize = _props2.thumbSize,
                thumbMinSize = _props2.thumbMinSize;
            var _view3 = this.view,
                scrollHeight = _view3.scrollHeight,
                clientHeight = _view3.clientHeight;

            var trackHeight = (0, _getInnerHeight2["default"])(this.trackVertical);
            var height = Math.ceil(clientHeight / scrollHeight * trackHeight);
            if (trackHeight === height) return 0;
            if (thumbSize) return thumbSize;
            return Math.max(height, thumbMinSize);
        }
    }, {
        key: 'getScrollLeftForOffset',
        value: function getScrollLeftForOffset(offset) {
            var _view4 = this.view,
                scrollWidth = _view4.scrollWidth,
                clientWidth = _view4.clientWidth;

            var trackWidth = (0, _getInnerWidth2["default"])(this.trackHorizontal);
            var thumbWidth = this.getThumbHorizontalWidth();
            return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
        }
    }, {
        key: 'getScrollTopForOffset',
        value: function getScrollTopForOffset(offset) {
            var _view5 = this.view,
                scrollHeight = _view5.scrollHeight,
                clientHeight = _view5.clientHeight;

            var trackHeight = (0, _getInnerHeight2["default"])(this.trackVertical);
            var thumbHeight = this.getThumbVerticalHeight();
            return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
        }
    }, {
        key: 'scrollLeft',
        value: function scrollLeft() {
            var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.view.scrollLeft = left;
        }
    }, {
        key: 'scrollTop',
        value: function scrollTop() {
            var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.view.scrollTop = top;
        }
    }, {
        key: 'scrollToLeft',
        value: function scrollToLeft() {
            this.view.scrollLeft = 0;
        }
    }, {
        key: 'scrollToTop',
        value: function scrollToTop() {
            this.view.scrollTop = 0;
        }
    }, {
        key: 'scrollToRight',
        value: function scrollToRight() {
            this.view.scrollLeft = this.view.scrollWidth;
        }
    }, {
        key: 'scrollToBottom',
        value: function scrollToBottom() {
            this.view.scrollTop = this.view.scrollHeight;
        }
    }, {
        key: 'addListeners',
        value: function addListeners() {
            /* istanbul ignore if */
            if (typeof document === 'undefined') return;
            var view = this.view,
                trackHorizontal = this.trackHorizontal,
                trackVertical = this.trackVertical,
                thumbHorizontal = this.thumbHorizontal,
                thumbVertical = this.thumbVertical;

            view.addEventListener('scroll', this.handleScroll);
            if (!(0, _getScrollbarWidth2["default"])()) return;
            trackHorizontal.addEventListener('mouseenter', this.handleTrackMouseEnter);
            trackHorizontal.addEventListener('mouseleave', this.handleTrackMouseLeave);
            trackHorizontal.addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
            trackVertical.addEventListener('mouseenter', this.handleTrackMouseEnter);
            trackVertical.addEventListener('mouseleave', this.handleTrackMouseLeave);
            trackVertical.addEventListener('mousedown', this.handleVerticalTrackMouseDown);
            thumbHorizontal.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
            thumbVertical.addEventListener('mousedown', this.handleVerticalThumbMouseDown);
            window.addEventListener('resize', this.handleWindowResize);
        }
    }, {
        key: 'removeListeners',
        value: function removeListeners() {
            /* istanbul ignore if */
            if (typeof document === 'undefined') return;
            var view = this.view,
                trackHorizontal = this.trackHorizontal,
                trackVertical = this.trackVertical,
                thumbHorizontal = this.thumbHorizontal,
                thumbVertical = this.thumbVertical;

            view.removeEventListener('scroll', this.handleScroll);
            if (!(0, _getScrollbarWidth2["default"])()) return;
            trackHorizontal.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackHorizontal.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackHorizontal.removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
            trackVertical.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackVertical.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackVertical.removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
            thumbHorizontal.removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
            thumbVertical.removeEventListener('mousedown', this.handleVerticalThumbMouseDown);
            window.removeEventListener('resize', this.handleWindowResize);
            // Possibly setup by `handleDragStart`
            this.teardownDragging();
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll(event) {
            var _this2 = this;

            var _props3 = this.props,
                onScroll = _props3.onScroll,
                onScrollFrame = _props3.onScrollFrame;

            if (onScroll) onScroll(event);
            this.update(function (values) {
                var scrollLeft = values.scrollLeft,
                    scrollTop = values.scrollTop;

                _this2.viewScrollLeft = scrollLeft;
                _this2.viewScrollTop = scrollTop;
                if (onScrollFrame) onScrollFrame(values);
            });
            this.detectScrolling();
        }
    }, {
        key: 'handleScrollStart',
        value: function handleScrollStart() {
            var onScrollStart = this.props.onScrollStart;

            if (onScrollStart) onScrollStart();
            this.handleScrollStartAutoHide();
        }
    }, {
        key: 'handleScrollStartAutoHide',
        value: function handleScrollStartAutoHide() {
            var autoHide = this.props.autoHide;

            if (!autoHide) return;
            this.showTracks();
        }
    }, {
        key: 'handleScrollStop',
        value: function handleScrollStop() {
            var onScrollStop = this.props.onScrollStop;

            if (onScrollStop) onScrollStop();
            this.handleScrollStopAutoHide();
        }
    }, {
        key: 'handleScrollStopAutoHide',
        value: function handleScrollStopAutoHide() {
            var autoHide = this.props.autoHide;

            if (!autoHide) return;
            this.hideTracks();
        }
    }, {
        key: 'handleWindowResize',
        value: function handleWindowResize() {
            this.update();
        }
    }, {
        key: 'handleHorizontalTrackMouseDown',
        value: function handleHorizontalTrackMouseDown(event) {
            event.preventDefault();
            var target = event.target,
                clientX = event.clientX;

            var _target$getBoundingCl = target.getBoundingClientRect(),
                targetLeft = _target$getBoundingCl.left;

            var thumbWidth = this.getThumbHorizontalWidth();
            var offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
            this.view.scrollLeft = this.getScrollLeftForOffset(offset);
        }
    }, {
        key: 'handleVerticalTrackMouseDown',
        value: function handleVerticalTrackMouseDown(event) {
            event.preventDefault();
            var target = event.target,
                clientY = event.clientY;

            var _target$getBoundingCl2 = target.getBoundingClientRect(),
                targetTop = _target$getBoundingCl2.top;

            var thumbHeight = this.getThumbVerticalHeight();
            var offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
            this.view.scrollTop = this.getScrollTopForOffset(offset);
        }
    }, {
        key: 'handleHorizontalThumbMouseDown',
        value: function handleHorizontalThumbMouseDown(event) {
            event.preventDefault();
            this.handleDragStart(event);
            var target = event.target,
                clientX = event.clientX;
            var offsetWidth = target.offsetWidth;

            var _target$getBoundingCl3 = target.getBoundingClientRect(),
                left = _target$getBoundingCl3.left;

            this.prevPageX = offsetWidth - (clientX - left);
        }
    }, {
        key: 'handleVerticalThumbMouseDown',
        value: function handleVerticalThumbMouseDown(event) {
            event.preventDefault();
            this.handleDragStart(event);
            var target = event.target,
                clientY = event.clientY;
            var offsetHeight = target.offsetHeight;

            var _target$getBoundingCl4 = target.getBoundingClientRect(),
                top = _target$getBoundingCl4.top;

            this.prevPageY = offsetHeight - (clientY - top);
        }
    }, {
        key: 'setupDragging',
        value: function setupDragging() {
            (0, _domCss2["default"])(document.body, _styles.disableSelectStyle);
            document.addEventListener('mousemove', this.handleDrag);
            document.addEventListener('mouseup', this.handleDragEnd);
            document.onselectstart = _returnFalse2["default"];
        }
    }, {
        key: 'teardownDragging',
        value: function teardownDragging() {
            (0, _domCss2["default"])(document.body, _styles.disableSelectStyleReset);
            document.removeEventListener('mousemove', this.handleDrag);
            document.removeEventListener('mouseup', this.handleDragEnd);
            document.onselectstart = undefined;
        }
    }, {
        key: 'handleDragStart',
        value: function handleDragStart(event) {
            this.dragging = true;
            event.stopImmediatePropagation();
            this.setupDragging();
        }
    }, {
        key: 'handleDrag',
        value: function handleDrag(event) {
            if (this.prevPageX) {
                var clientX = event.clientX;

                var _trackHorizontal$getB = this.trackHorizontal.getBoundingClientRect(),
                    trackLeft = _trackHorizontal$getB.left;

                var thumbWidth = this.getThumbHorizontalWidth();
                var clickPosition = thumbWidth - this.prevPageX;
                var offset = -trackLeft + clientX - clickPosition;
                this.view.scrollLeft = this.getScrollLeftForOffset(offset);
            }
            if (this.prevPageY) {
                var clientY = event.clientY;

                var _trackVertical$getBou = this.trackVertical.getBoundingClientRect(),
                    trackTop = _trackVertical$getBou.top;

                var thumbHeight = this.getThumbVerticalHeight();
                var _clickPosition = thumbHeight - this.prevPageY;
                var _offset = -trackTop + clientY - _clickPosition;
                this.view.scrollTop = this.getScrollTopForOffset(_offset);
            }
            return false;
        }
    }, {
        key: 'handleDragEnd',
        value: function handleDragEnd() {
            this.dragging = false;
            this.prevPageX = this.prevPageY = 0;
            this.teardownDragging();
            this.handleDragEndAutoHide();
        }
    }, {
        key: 'handleDragEndAutoHide',
        value: function handleDragEndAutoHide() {
            var autoHide = this.props.autoHide;

            if (!autoHide) return;
            this.hideTracks();
        }
    }, {
        key: 'handleTrackMouseEnter',
        value: function handleTrackMouseEnter() {
            this.trackMouseOver = true;
            this.handleTrackMouseEnterAutoHide();
        }
    }, {
        key: 'handleTrackMouseEnterAutoHide',
        value: function handleTrackMouseEnterAutoHide() {
            var autoHide = this.props.autoHide;

            if (!autoHide) return;
            this.showTracks();
        }
    }, {
        key: 'handleTrackMouseLeave',
        value: function handleTrackMouseLeave() {
            this.trackMouseOver = false;
            this.handleTrackMouseLeaveAutoHide();
        }
    }, {
        key: 'handleTrackMouseLeaveAutoHide',
        value: function handleTrackMouseLeaveAutoHide() {
            var autoHide = this.props.autoHide;

            if (!autoHide) return;
            this.hideTracks();
        }
    }, {
        key: 'showTracks',
        value: function showTracks() {
            clearTimeout(this.hideTracksTimeout);
            (0, _domCss2["default"])(this.trackHorizontal, { opacity: 1 });
            (0, _domCss2["default"])(this.trackVertical, { opacity: 1 });
        }
    }, {
        key: 'hideTracks',
        value: function hideTracks() {
            var _this3 = this;

            if (this.dragging) return;
            if (this.scrolling) return;
            if (this.trackMouseOver) return;
            var autoHideTimeout = this.props.autoHideTimeout;

            clearTimeout(this.hideTracksTimeout);
            this.hideTracksTimeout = setTimeout(function () {
                (0, _domCss2["default"])(_this3.trackHorizontal, { opacity: 0 });
                (0, _domCss2["default"])(_this3.trackVertical, { opacity: 0 });
            }, autoHideTimeout);
        }
    }, {
        key: 'detectScrolling',
        value: function detectScrolling() {
            var _this4 = this;

            if (this.scrolling) return;
            this.scrolling = true;
            this.handleScrollStart();
            this.detectScrollingInterval = setInterval(function () {
                if (_this4.lastViewScrollLeft === _this4.viewScrollLeft && _this4.lastViewScrollTop === _this4.viewScrollTop) {
                    clearInterval(_this4.detectScrollingInterval);
                    _this4.scrolling = false;
                    _this4.handleScrollStop();
                }
                _this4.lastViewScrollLeft = _this4.viewScrollLeft;
                _this4.lastViewScrollTop = _this4.viewScrollTop;
            }, 100);
        }
    }, {
        key: 'raf',
        value: function raf(callback) {
            var _this5 = this;

            if (this.requestFrame) _raf3["default"].cancel(this.requestFrame);
            this.requestFrame = (0, _raf3["default"])(function () {
                _this5.requestFrame = undefined;
                callback();
            });
        }
    }, {
        key: 'update',
        value: function update(callback) {
            var _this6 = this;

            this.raf(function () {
                return _this6._update(callback);
            });
        }
    }, {
        key: '_update',
        value: function _update(callback) {
            var _props4 = this.props,
                onUpdate = _props4.onUpdate,
                hideTracksWhenNotNeeded = _props4.hideTracksWhenNotNeeded;

            var values = this.getValues();
            if ((0, _getScrollbarWidth2["default"])()) {
                var scrollLeft = values.scrollLeft,
                    clientWidth = values.clientWidth,
                    scrollWidth = values.scrollWidth;

                var trackHorizontalWidth = (0, _getInnerWidth2["default"])(this.trackHorizontal);
                var thumbHorizontalWidth = this.getThumbHorizontalWidth();
                var thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
                var thumbHorizontalStyle = {
                    width: thumbHorizontalWidth,
                    transform: 'translateX(' + thumbHorizontalX + 'px)'
                };
                var scrollTop = values.scrollTop,
                    clientHeight = values.clientHeight,
                    scrollHeight = values.scrollHeight;

                var trackVerticalHeight = (0, _getInnerHeight2["default"])(this.trackVertical);
                var thumbVerticalHeight = this.getThumbVerticalHeight();
                var thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
                var thumbVerticalStyle = {
                    height: thumbVerticalHeight,
                    transform: 'translateY(' + thumbVerticalY + 'px)'
                };
                if (hideTracksWhenNotNeeded) {
                    var trackHorizontalStyle = {
                        visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
                    };
                    var trackVerticalStyle = {
                        visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
                    };
                    (0, _domCss2["default"])(this.trackHorizontal, trackHorizontalStyle);
                    (0, _domCss2["default"])(this.trackVertical, trackVerticalStyle);
                }
                (0, _domCss2["default"])(this.thumbHorizontal, thumbHorizontalStyle);
                (0, _domCss2["default"])(this.thumbVertical, thumbVerticalStyle);
            }
            if (onUpdate) onUpdate(values);
            if (typeof callback !== 'function') return;
            callback(values);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            var scrollbarWidth = (0, _getScrollbarWidth2["default"])();
            /* eslint-disable no-unused-vars */

            var _props5 = this.props,
                onScroll = _props5.onScroll,
                onScrollFrame = _props5.onScrollFrame,
                onScrollStart = _props5.onScrollStart,
                onScrollStop = _props5.onScrollStop,
                onUpdate = _props5.onUpdate,
                renderView = _props5.renderView,
                renderTrackHorizontal = _props5.renderTrackHorizontal,
                renderTrackVertical = _props5.renderTrackVertical,
                renderThumbHorizontal = _props5.renderThumbHorizontal,
                renderThumbVertical = _props5.renderThumbVertical,
                tagName = _props5.tagName,
                hideTracksWhenNotNeeded = _props5.hideTracksWhenNotNeeded,
                autoHide = _props5.autoHide,
                autoHideTimeout = _props5.autoHideTimeout,
                autoHideDuration = _props5.autoHideDuration,
                thumbSize = _props5.thumbSize,
                thumbMinSize = _props5.thumbMinSize,
                universal = _props5.universal,
                autoHeight = _props5.autoHeight,
                autoHeightMin = _props5.autoHeightMin,
                autoHeightMax = _props5.autoHeightMax,
                style = _props5.style,
                children = _props5.children,
                props = _objectWithoutProperties(_props5, ['onScroll', 'onScrollFrame', 'onScrollStart', 'onScrollStop', 'onUpdate', 'renderView', 'renderTrackHorizontal', 'renderTrackVertical', 'renderThumbHorizontal', 'renderThumbVertical', 'tagName', 'hideTracksWhenNotNeeded', 'autoHide', 'autoHideTimeout', 'autoHideDuration', 'thumbSize', 'thumbMinSize', 'universal', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'style', 'children']);
            /* eslint-enable no-unused-vars */

            var didMountUniversal = this.state.didMountUniversal;


            var containerStyle = _extends({}, _styles.containerStyleDefault, autoHeight && _extends({}, _styles.containerStyleAutoHeight, {
                minHeight: autoHeightMin,
                maxHeight: autoHeightMax
            }), style);

            var viewStyle = _extends({}, _styles.viewStyleDefault, {
                // Hide scrollbars by setting a negative margin
                marginRight: scrollbarWidth ? -scrollbarWidth : 0,
                marginBottom: scrollbarWidth ? -scrollbarWidth : 0
            }, autoHeight && _extends({}, _styles.viewStyleAutoHeight, {
                // Add scrollbarWidth to autoHeight in order to compensate negative margins
                minHeight: (0, _isString2["default"])(autoHeightMin) ? 'calc(' + autoHeightMin + ' + ' + scrollbarWidth + 'px)' : autoHeightMin + scrollbarWidth,
                maxHeight: (0, _isString2["default"])(autoHeightMax) ? 'calc(' + autoHeightMax + ' + ' + scrollbarWidth + 'px)' : autoHeightMax + scrollbarWidth
            }), autoHeight && universal && !didMountUniversal && {
                minHeight: autoHeightMin,
                maxHeight: autoHeightMax
            }, universal && !didMountUniversal && _styles.viewStyleUniversalInitial);

            var trackAutoHeightStyle = {
                transition: 'opacity ' + autoHideDuration + 'ms',
                opacity: 0
            };

            var trackHorizontalStyle = _extends({}, _styles.trackHorizontalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
                display: 'none'
            });

            var trackVerticalStyle = _extends({}, _styles.trackVerticalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
                display: 'none'
            });

            return (0, _react.createElement)(tagName, _extends({}, props, { style: containerStyle, ref: function ref(_ref2) {
                    _this7.container = _ref2;
                } }), [(0, _react.cloneElement)(renderView({ style: viewStyle }), { key: 'view', ref: function ref(_ref3) {
                    _this7.view = _ref3;
                } }, children), (0, _react.cloneElement)(renderTrackHorizontal({ style: trackHorizontalStyle }), { key: 'trackHorizontal', ref: function ref(_ref4) {
                    _this7.trackHorizontal = _ref4;
                } }, (0, _react.cloneElement)(renderThumbHorizontal({ style: _styles.thumbHorizontalStyleDefault }), { ref: function ref(_ref5) {
                    _this7.thumbHorizontal = _ref5;
                } })), (0, _react.cloneElement)(renderTrackVertical({ style: trackVerticalStyle }), { key: 'trackVertical', ref: function ref(_ref6) {
                    _this7.trackVertical = _ref6;
                } }, (0, _react.cloneElement)(renderThumbVertical({ style: _styles.thumbVerticalStyleDefault }), { ref: function ref(_ref7) {
                    _this7.thumbVertical = _ref7;
                } }))]);
        }
    }]);

    return Scrollbars;
}(_react.Component);

exports["default"] = Scrollbars;


Scrollbars.propTypes = {
    onScroll: _propTypes2["default"].func,
    onScrollFrame: _propTypes2["default"].func,
    onScrollStart: _propTypes2["default"].func,
    onScrollStop: _propTypes2["default"].func,
    onUpdate: _propTypes2["default"].func,
    renderView: _propTypes2["default"].func,
    renderTrackHorizontal: _propTypes2["default"].func,
    renderTrackVertical: _propTypes2["default"].func,
    renderThumbHorizontal: _propTypes2["default"].func,
    renderThumbVertical: _propTypes2["default"].func,
    tagName: _propTypes2["default"].string,
    thumbSize: _propTypes2["default"].number,
    thumbMinSize: _propTypes2["default"].number,
    hideTracksWhenNotNeeded: _propTypes2["default"].bool,
    autoHide: _propTypes2["default"].bool,
    autoHideTimeout: _propTypes2["default"].number,
    autoHideDuration: _propTypes2["default"].number,
    autoHeight: _propTypes2["default"].bool,
    autoHeightMin: _propTypes2["default"].oneOfType([_propTypes2["default"].number, _propTypes2["default"].string]),
    autoHeightMax: _propTypes2["default"].oneOfType([_propTypes2["default"].number, _propTypes2["default"].string]),
    universal: _propTypes2["default"].bool,
    style: _propTypes2["default"].object,
    children: _propTypes2["default"].node
};

Scrollbars.defaultProps = {
    renderView: _defaultRenderElements.renderViewDefault,
    renderTrackHorizontal: _defaultRenderElements.renderTrackHorizontalDefault,
    renderTrackVertical: _defaultRenderElements.renderTrackVerticalDefault,
    renderThumbHorizontal: _defaultRenderElements.renderThumbHorizontalDefault,
    renderThumbVertical: _defaultRenderElements.renderThumbVerticalDefault,
    tagName: 'div',
    thumbMinSize: 30,
    hideTracksWhenNotNeeded: false,
    autoHide: false,
    autoHideTimeout: 1000,
    autoHideDuration: 200,
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 200,
    universal: false
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var containerStyleDefault = exports.containerStyleDefault = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
};

// Overrides containerStyleDefault properties
var containerStyleAutoHeight = exports.containerStyleAutoHeight = {
    height: 'auto'
};

var viewStyleDefault = exports.viewStyleDefault = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch'
};

// Overrides viewStyleDefault properties
var viewStyleAutoHeight = exports.viewStyleAutoHeight = {
    position: 'relative',
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined
};

var viewStyleUniversalInitial = exports.viewStyleUniversalInitial = {
    overflow: 'hidden',
    marginRight: 0,
    marginBottom: 0
};

var trackHorizontalStyleDefault = exports.trackHorizontalStyleDefault = {
    position: 'absolute',
    height: 6
};

var trackVerticalStyleDefault = exports.trackVerticalStyleDefault = {
    position: 'absolute',
    width: 6
};

var thumbHorizontalStyleDefault = exports.thumbHorizontalStyleDefault = {
    position: 'relative',
    display: 'block',
    height: '100%'
};

var thumbVerticalStyleDefault = exports.thumbVerticalStyleDefault = {
    position: 'relative',
    display: 'block',
    width: '100%'
};

var disableSelectStyle = exports.disableSelectStyle = {
    userSelect: 'none'
};

var disableSelectStyleReset = exports.disableSelectStyleReset = {
    userSelect: ''
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollbars = undefined;

var _Scrollbars = __webpack_require__(37);

var _Scrollbars2 = _interopRequireDefault(_Scrollbars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _Scrollbars2["default"];
exports.Scrollbars = _Scrollbars2["default"];

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = getInnerHeight;
function getInnerHeight(el) {
    var clientHeight = el.clientHeight;

    var _getComputedStyle = getComputedStyle(el),
        paddingTop = _getComputedStyle.paddingTop,
        paddingBottom = _getComputedStyle.paddingBottom;

    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = getInnerWidth;
function getInnerWidth(el) {
    var clientWidth = el.clientWidth;

    var _getComputedStyle = getComputedStyle(el),
        paddingLeft = _getComputedStyle.paddingLeft,
        paddingRight = _getComputedStyle.paddingRight;

    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = getScrollbarWidth;

var _domCss = __webpack_require__(17);

var _domCss2 = _interopRequireDefault(_domCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var scrollbarWidth = false;

function getScrollbarWidth() {
    if (scrollbarWidth !== false) return scrollbarWidth;
    /* istanbul ignore else */
    if (typeof document !== 'undefined') {
        var div = document.createElement('div');
        (0, _domCss2["default"])(div, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: -9999,
            overflow: 'scroll',
            MsOverflowStyle: 'scrollbar'
        });
        document.body.appendChild(div);
        scrollbarWidth = div.offsetWidth - div.clientWidth;
        document.body.removeChild(div);
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = isString;
function isString(maybe) {
    return typeof maybe === 'string';
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = returnFalse;
function returnFalse() {
    return false;
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(2);
  var warning = __webpack_require__(8);
  var ReactPropTypesSecret = __webpack_require__(12);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(3);
var invariant = __webpack_require__(2);
var ReactPropTypesSecret = __webpack_require__(12);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(3);
var invariant = __webpack_require__(2);
var warning = __webpack_require__(8);

var ReactPropTypesSecret = __webpack_require__(12);
var checkPropTypes = __webpack_require__(45);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(47)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(46)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes3 = __webpack_require__(20);

var _UncontrolledTabs = __webpack_require__(50);

var _UncontrolledTabs2 = _interopRequireDefault(_UncontrolledTabs);

var _count = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.handleSelected = function (index, last, event) {
      // Call change event handler
      if (typeof _this.props.onSelect === 'function') {
        // Check if the change event handler cancels the tab change
        if (_this.props.onSelect(index, last, event) === false) return;
      }

      var state = {
        // Set focus if the change was triggered from the keyboard
        focus: event.type === 'keydown'
      };

      if (Tabs.inUncontrolledMode(_this.props)) {
        // Update selected index
        state.selectedIndex = index;
      }

      _this.setState(state);
    };

    _this.state = Tabs.copyPropsToState(_this.props, {}, _this.props.defaultFocus);
    return _this;
  }

  Tabs.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (process.env.NODE_ENV !== 'production' && Tabs.inUncontrolledMode(newProps) !== Tabs.inUncontrolledMode(this.props)) {
      throw new Error('Switching between controlled mode (by using `selectedIndex`) and uncontrolled mode is not supported in `Tabs`.\nFor more information about controlled and uncontrolled mode of react-tabs see the README.');
    }
    // Use a transactional update to prevent race conditions
    // when reading the state in copyPropsToState
    // See https://github.com/reactjs/react-tabs/issues/51
    this.setState(function (state) {
      return Tabs.copyPropsToState(newProps, state);
    });
  };

  Tabs.inUncontrolledMode = function inUncontrolledMode(props) {
    return props.selectedIndex === null;
  };

  // preserve the existing selectedIndex from state.
  // If the state has not selectedIndex, default to the defaultIndex or 0
  Tabs.copyPropsToState = function copyPropsToState(props, state) {
    var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var newState = {
      focus: focus
    };

    if (Tabs.inUncontrolledMode(props)) {
      var maxTabIndex = (0, _count.getTabsCount)(props.children) - 1;
      var selectedIndex = null;

      if (state.selectedIndex != null) {
        selectedIndex = Math.min(state.selectedIndex, maxTabIndex);
      } else {
        selectedIndex = props.defaultIndex || 0;
      }
      newState.selectedIndex = selectedIndex;
    }

    return newState;
  };

  Tabs.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        defaultIndex = _props.defaultIndex,
        defaultFocus = _props.defaultFocus,
        props = _objectWithoutProperties(_props, ['children', 'defaultIndex', 'defaultFocus']);

    props.focus = this.state.focus;
    props.onSelect = this.handleSelected;

    if (this.state.selectedIndex != null) {
      props.selectedIndex = this.state.selectedIndex;
    }

    return _react2.default.createElement(
      _UncontrolledTabs2.default,
      props,
      children
    );
  };

  return Tabs;
}(_react.Component);

Tabs.defaultProps = {
  defaultFocus: false,
  forceRenderTabPanel: false,
  selectedIndex: null,
  defaultIndex: null
};
exports.default = Tabs;
Tabs.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes3.childrenPropType,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  defaultFocus: _propTypes2.default.bool,
  defaultIndex: _propTypes2.default.number,
  disabledTabClassName: _propTypes2.default.string,
  forceRenderTabPanel: _propTypes2.default.bool,
  onSelect: _propTypes3.onSelectPropType,
  selectedIndex: _propTypes3.selectedIndexPropType,
  selectedTabClassName: _propTypes2.default.string,
  selectedTabPanelClassName: _propTypes2.default.string
} : {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(7);

var _classnames2 = _interopRequireDefault(_classnames);

var _uuid = __webpack_require__(21);

var _uuid2 = _interopRequireDefault(_uuid);

var _propTypes3 = __webpack_require__(20);

var _Tab = __webpack_require__(9);

var _Tab2 = _interopRequireDefault(_Tab);

var _TabList = __webpack_require__(10);

var _TabList2 = _interopRequireDefault(_TabList);

var _TabPanel = __webpack_require__(11);

var _TabPanel2 = _interopRequireDefault(_TabPanel);

var _count = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Determine if a node from event.target is a Tab element
function isTabNode(node) {
  return node.nodeName === 'LI' && node.getAttribute('role') === 'tab';
}

// Determine if a tab node is disabled
function isTabDisabled(node) {
  return node.getAttribute('aria-disabled') === 'true';
}

var canUseActiveElement = !!(typeof window !== 'undefined' && window.document && window.document.activeElement);

var UncontrolledTabs = function (_Component) {
  _inherits(UncontrolledTabs, _Component);

  function UncontrolledTabs() {
    var _temp, _this, _ret;

    _classCallCheck(this, UncontrolledTabs);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.tabNodes = [], _this.handleKeyDown = function (e) {
      if (_this.isTabFromContainer(e.target)) {
        var index = _this.props.selectedIndex;
        var preventDefault = false;

        if (e.keyCode === 37 || e.keyCode === 38) {
          // Select next tab to the left
          index = _this.getPrevTab(index);
          preventDefault = true;
        } else if (e.keyCode === 39 || e.keyCode === 40) {
          // Select next tab to the right
          index = _this.getNextTab(index);
          preventDefault = true;
        }

        // This prevents scrollbars from moving around
        if (preventDefault) {
          e.preventDefault();
        }

        _this.setSelected(index, e);
      }
    }, _this.handleClick = function (e) {
      var node = e.target;
      // eslint-disable-next-line no-cond-assign
      do {
        if (_this.isTabFromContainer(node)) {
          if (isTabDisabled(node)) {
            return;
          }

          var index = [].slice.call(node.parentNode.children).filter(isTabNode).indexOf(node);
          _this.setSelected(index, e);
          return;
        }
      } while ((node = node.parentNode) !== null);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  UncontrolledTabs.prototype.setSelected = function setSelected(index, event) {
    // Don't do anything if nothing has changed
    if (index === this.props.selectedIndex) return;
    // Check index boundary
    if (index < 0 || index >= this.getTabsCount()) return;

    // Call change event handler
    this.props.onSelect(index, this.props.selectedIndex, event);
  };

  UncontrolledTabs.prototype.getNextTab = function getNextTab(index) {
    var count = this.getTabsCount();

    // Look for non-disabled tab from index to the last tab on the right
    for (var i = index + 1; i < count; i++) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    }

    // If no tab found, continue searching from first on left to index
    for (var _i = 0; _i < index; _i++) {
      if (!isTabDisabled(this.getTab(_i))) {
        return _i;
      }
    }

    // No tabs are disabled, return index
    return index;
  };

  UncontrolledTabs.prototype.getPrevTab = function getPrevTab(index) {
    var i = index;

    // Look for non-disabled tab from index to first tab on the left
    while (i--) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    }

    // If no tab found, continue searching from last tab on right to index
    i = this.getTabsCount();
    while (i-- > index) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    }

    // No tabs are disabled, return index
    return index;
  };

  UncontrolledTabs.prototype.getTabsCount = function getTabsCount() {
    return (0, _count.getTabsCount)(this.props.children);
  };

  UncontrolledTabs.prototype.getPanelsCount = function getPanelsCount() {
    return (0, _count.getPanelsCount)(this.props.children);
  };

  UncontrolledTabs.prototype.getTab = function getTab(index) {
    return this.tabNodes['tabs-' + index];
  };

  UncontrolledTabs.prototype.getChildren = function getChildren() {
    var _this2 = this;

    var index = 0;
    var _props = this.props,
        children = _props.children,
        disabledTabClassName = _props.disabledTabClassName,
        focus = _props.focus,
        forceRenderTabPanel = _props.forceRenderTabPanel,
        selectedIndex = _props.selectedIndex,
        selectedTabClassName = _props.selectedTabClassName,
        selectedTabPanelClassName = _props.selectedTabPanelClassName;


    this.tabIds = this.tabIds || [];
    this.panelIds = this.panelIds || [];
    var diff = this.tabIds.length - this.getTabsCount();

    // Add ids if new tabs have been added
    // Don't bother removing ids, just keep them in case they are added again
    // This is more efficient, and keeps the uuid counter under control
    while (diff++ < 0) {
      this.tabIds.push((0, _uuid2.default)());
      this.panelIds.push((0, _uuid2.default)());
    }

    // Map children to dynamically setup refs
    return _react2.default.Children.map(children, function (child) {
      // null happens when conditionally rendering TabPanel/Tab
      // see https://github.com/reactjs/react-tabs/issues/37
      if (child === null) {
        return null;
      }

      var result = child;

      // Clone TabList and Tab components to have refs
      if (child.type === _TabList2.default) {
        var listIndex = 0;

        // Figure out if the current focus in the DOM is set on a Tab
        // If it is we should keep the focus on the next selected tab
        var wasTabFocused = false;

        if (canUseActiveElement) {
          wasTabFocused = _react2.default.Children.toArray(child.props.children).filter(function (tab) {
            return tab.type === _Tab2.default;
          }).some(function (tab, i) {
            return document.activeElement === _this2.getTab(i);
          });
        }

        result = (0, _react.cloneElement)(child, {
          children: _react2.default.Children.map(child.props.children, function (tab) {
            // null happens when conditionally rendering TabPanel/Tab
            // see https://github.com/reactjs/react-tabs/issues/37
            if (tab === null) {
              return null;
            }

            // Exit early if this is not a tab. That way we can have arbitrary
            // elements anywhere inside <TabList>
            if (tab.type !== _Tab2.default) return tab;

            var key = 'tabs-' + listIndex;
            var selected = selectedIndex === listIndex;

            var props = {
              tabRef: function tabRef(node) {
                _this2.tabNodes[key] = node;
              },
              id: _this2.tabIds[listIndex],
              panelId: _this2.panelIds[listIndex],
              selected: selected,
              focus: selected && (focus || wasTabFocused)
            };

            if (selectedTabClassName) props.selectedClassName = selectedTabClassName;
            if (disabledTabClassName) props.disabledClassName = disabledTabClassName;

            listIndex++;

            return (0, _react.cloneElement)(tab, props);
          })
        });
      } else if (child.type === _TabPanel2.default) {
        var props = {
          id: _this2.panelIds[index],
          tabId: _this2.tabIds[index],
          selected: selectedIndex === index
        };

        if (forceRenderTabPanel) props.forceRender = forceRenderTabPanel;
        if (selectedTabPanelClassName) props.selectedClassName = selectedTabPanelClassName;

        index++;

        result = (0, _react.cloneElement)(child, props);
      }

      return result;
    });
  };

  /**
   * Determine if a node from event.target is a Tab element for the current Tabs container.
   * If the clicked element is not a Tab, it returns false.
   * If it finds another Tabs container between the Tab and `this`, it returns false.
   */
  UncontrolledTabs.prototype.isTabFromContainer = function isTabFromContainer(node) {
    // return immediately if the clicked element is not a Tab.
    if (!isTabNode(node)) {
      return false;
    }

    // Check if the first occurrence of a Tabs container is `this` one.
    var nodeAncestor = node.parentElement;
    do {
      if (nodeAncestor === this.node) return true;else if (nodeAncestor.getAttribute('data-tabs')) break;

      nodeAncestor = nodeAncestor.parentElement;
    } while (nodeAncestor);

    return false;
  };

  UncontrolledTabs.prototype.render = function render() {
    var _this3 = this;

    // Delete all known props, so they don't get added to DOM
    var _props2 = this.props,
        children = _props2.children,
        className = _props2.className,
        disabledTabClassName = _props2.disabledTabClassName,
        focus = _props2.focus,
        forceRenderTabPanel = _props2.forceRenderTabPanel,
        onSelect = _props2.onSelect,
        selectedIndex = _props2.selectedIndex,
        selectedTabClassName = _props2.selectedTabClassName,
        selectedTabPanelClassName = _props2.selectedTabPanelClassName,
        attributes = _objectWithoutProperties(_props2, ['children', 'className', 'disabledTabClassName', 'focus', 'forceRenderTabPanel', 'onSelect', 'selectedIndex', 'selectedTabClassName', 'selectedTabPanelClassName']);

    return _react2.default.createElement(
      'div',
      _extends({}, attributes, {
        className: (0, _classnames2.default)(className),
        onClick: this.handleClick,
        onKeyDown: this.handleKeyDown,
        ref: function ref(node) {
          _this3.node = node;
        },
        'data-tabs': true
      }),
      this.getChildren()
    );
  };

  return UncontrolledTabs;
}(_react.Component);

UncontrolledTabs.defaultProps = {
  className: 'react-tabs',
  focus: false
};
exports.default = UncontrolledTabs;
UncontrolledTabs.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes3.childrenPropType,
  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  disabledTabClassName: _propTypes2.default.string,
  focus: _propTypes2.default.bool,
  forceRenderTabPanel: _propTypes2.default.bool,
  onSelect: _propTypes2.default.func.isRequired,
  selectedIndex: _propTypes2.default.number.isRequired,
  selectedTabClassName: _propTypes2.default.string,
  selectedTabPanelClassName: _propTypes2.default.string
} : {};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.resetIdCounter = exports.Tabs = exports.TabPanel = exports.TabList = exports.Tab = undefined;

var _Tabs = __webpack_require__(49);

var _Tabs2 = _interopRequireDefault(_Tabs);

var _TabList = __webpack_require__(10);

var _TabList2 = _interopRequireDefault(_TabList);

var _Tab = __webpack_require__(9);

var _Tab2 = _interopRequireDefault(_Tab);

var _TabPanel = __webpack_require__(11);

var _TabPanel2 = _interopRequireDefault(_TabPanel);

var _uuid = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Tab = _Tab2.default;
exports.TabList = _TabList2.default;
exports.TabPanel = _TabPanel2.default;
exports.Tabs = _Tabs2.default;
exports.resetIdCounter = _uuid.reset;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(53);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {


var space = __webpack_require__(56)

/**
 * Export.
 */

module.exports = toCamelCase

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase(string) {
  return space(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase()
  })
}


/***/ }),
/* 55 */
/***/ (function(module, exports) {


/**
 * Export.
 */

module.exports = toNoCase

/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/
var hasSeparator = /(_|-|\.|:)/
var hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase(string) {
  if (hasSpace.test(string)) return string.toLowerCase()
  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase()
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase()
  return string.toLowerCase()
}

/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate(string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : ''
  })
}

/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize(string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ')
  })
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {


var clean = __webpack_require__(55)

/**
 * Export.
 */

module.exports = toSpaceCase

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */

function toSpaceCase(string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : ''
  }).trim()
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class AutoSolveButton extends React.Component {
    render() {
        var text = "Auto Solve";
        if (this.props.isAutoSolving) {
            text = "Stop Auto Solving";
        }
        //will add styling later
        return React.createElement("button", { onClick: () => { this.props.clicked(); } }, text);
    }
}
exports.AutoSolveButton = AutoSolveButton;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const index_1 = __webpack_require__(6);
const formatWord_1 = __webpack_require__(63);
const clueNumber_1 = __webpack_require__(59);
const twoCol_1 = __webpack_require__(13);
const commonColourStyling_1 = __webpack_require__(5);
class ClueContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.selected = () => {
            this.props.selected(this.props.wordId);
        };
    }
    _getBackgroundColorStyle() {
        var solvingMode = this.props.solvingMode;
        var backgroundColorStyle;
        var propName = "wordSelected";
        if (!this.props.isSelected) {
            propName = "notSelected";
        }
        var solvingModePropPart = "Guessing";
        if (solvingMode !== index_1.SolvingMode.Guessing) {
            if (this.props.isSolved) {
                solvingModePropPart = "Solved";
            }
            else {
                solvingModePropPart = "Unsolved";
                if (solvingMode === index_1.SolvingMode.Cheating) {
                    solvingModePropPart = "Cheating";
                }
            }
        }
        propName = propName + solvingModePropPart;
        backgroundColorStyle = commonColourStyling_1.commonColourStyles[propName];
        return backgroundColorStyle;
    }
    ;
    shouldComponentUpdate(nextProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    }
    render() {
        var leftContent = React.createElement(clueNumber_1.ClueNumber, { number: this.props.clueNumber });
        var rightContent = this.props.wrapped;
        var backgroundColor = this._getBackgroundColorStyle().backgroundColor;
        return React.createElement("div", { style: {
                backgroundColor: backgroundColor,
                padding: '10px',
                overflow: 'hidden'
            }, onClick: this.selected },
            React.createElement(twoCol_1.TwoCol, { leftPercentage: 10, leftContent: leftContent, rightContent: rightContent }));
    }
}
exports.ClueContainer = ClueContainer;
class ClueFormat extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { style: { padding: '2px' } },
                React.createElement(ClueText, { text: this.props.text })),
            React.createElement("div", { style: { padding: '2px' } },
                React.createElement(formatWord_1.FormatWord, { isSolved: this.props.isSolved, format: this.props.format, clueLetters: this.props.clueLetters }))));
    }
}
exports.ClueFormat = ClueFormat;
class ClueText extends React.Component {
    render() {
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.text } });
    }
}
exports.ClueText = ClueText;
class GroupedClue extends React.Component {
    render() {
        var clueTextFormats = this.props.clueTextFormats;
        var compareFormat;
        var formatsSame = true;
        for (var i = 0; i < clueTextFormats.length; i++) {
            var format = clueTextFormats[i].format;
            if (compareFormat) {
                formatsSame = compareFormat === format;
                if (!formatsSame) {
                    break;
                }
            }
            else {
                compareFormat = format;
            }
        }
        if (formatsSame) {
            return (React.createElement("div", null,
                this.props.clueTextFormats.map((clueTextFormat, index) => {
                    return React.createElement("div", { style: { paddingBottom: '2px' } },
                        React.createElement(ClueText, { key: index, text: clueTextFormat.text + " /" }));
                }),
                React.createElement(formatWord_1.FormatWord, { isSolved: this.props.isSolved, format: compareFormat, clueLetters: this.props.clueLetters })));
        }
        else {
            return React.createElement("div", null, clueTextFormats.map((clueTextFormat, index) => {
                return React.createElement("div", null,
                    React.createElement(ClueFormat, { isSolved: this.props.isSolved, clueLetters: this.props.clueLetters, format: clueTextFormat.format, text: clueTextFormat.text, key: index }));
            }));
        }
    }
}
exports.GroupedClue = GroupedClue;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class ClueNumber extends React.Component {
    render() {
        return React.createElement("span", { style: {
                fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    }
}
exports.ClueNumber = ClueNumber;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const react_tabs_1 = __webpack_require__(51);
const twoCol_1 = __webpack_require__(13);
const clueContainer_1 = __webpack_require__(58);
const react_custom_scrollbars_1 = __webpack_require__(39);
class CroswordClues extends React.Component {
    mapNonGroupedToWrapped(clues) {
        return clues.map(clue => {
            return {
                clueNumber: clue.clueNumber,
                isSelected: clue.isSelected,
                isSolved: clue.isSolved,
                solvingMode: clue.solvingMode,
                wordId: clue.wordId,
                wrappedElement: React.createElement(clueContainer_1.ClueFormat, { isSolved: clue.isSolved, clueLetters: clue.clueLetters, format: clue.format, text: clue.text })
            };
        });
    }
    render() {
        if (this.props.grouping) {
            var allAcrossClues = [];
            var allDownClues = [];
            var numAcross;
            var numDown;
            var clueProviders = this.props.clueProviders;
            var firstClueProvider = clueProviders[0];
            var firstAcrossClues = firstClueProvider.acrossClues;
            var firstDownClues = firstClueProvider.downClues;
            function mapFirst(clues) {
                return clues.map(clue => {
                    var mapped = {
                        clueNumber: clue.clueNumber,
                        wordId: clue.wordId,
                        isSolved: clue.isSolved,
                        solvingMode: clue.solvingMode,
                        isSelected: clue.isSelected,
                        clueTextFormats: [{ text: clue.text, format: clue.format }],
                        clueLetters: clue.clueLetters
                    };
                    return mapped;
                });
            }
            var mappedAcrossClues = mapFirst(firstAcrossClues);
            var mappedDownClues = mapFirst(firstDownClues);
            for (var i = 1; i < clueProviders.length; i++) {
                var clueProvider = clueProviders[i];
                var clueProviderAcrossClues = clueProvider.acrossClues;
                for (var j = 0; j < clueProviderAcrossClues.length; j++) {
                    var acrossClue = clueProviderAcrossClues[j];
                    mappedAcrossClues[j].clueTextFormats.push({ text: acrossClue.text, format: acrossClue.format });
                }
                var clueProviderDownClues = clueProvider.downClues;
                for (var j = 0; j < clueProviderDownClues.length; j++) {
                    var downClue = clueProviderDownClues[j];
                    mappedDownClues[j].clueTextFormats.push({ text: downClue.text, format: downClue.format });
                }
            }
            function getWrappedClues(groupedMappedClues) {
                return groupedMappedClues.map(groupedMappedClue => {
                    var wrappedElement = React.createElement(clueContainer_1.GroupedClue, { clueTextFormats: groupedMappedClue.clueTextFormats, isSolved: groupedMappedClue.isSolved, clueLetters: groupedMappedClue.clueLetters });
                    var wrappedClue = {
                        clueNumber: groupedMappedClue.clueNumber,
                        isSelected: groupedMappedClue.isSelected,
                        wordId: groupedMappedClue.wordId,
                        solvingMode: groupedMappedClue.solvingMode,
                        isSolved: groupedMappedClue.isSolved,
                        wrappedElement: wrappedElement
                    };
                    return wrappedClue;
                });
            }
            var acrossWrappedClues = getWrappedClues(mappedAcrossClues);
            var downWrappedClues = getWrappedClues(mappedDownClues);
            return React.createElement("div", { style: { width: '600px' } },
                React.createElement(react_tabs_1.Tabs, null,
                    React.createElement(react_tabs_1.TabList, null,
                        React.createElement(react_tabs_1.Tab, null, "Clues")),
                    React.createElement(react_tabs_1.TabPanel, null,
                        React.createElement(AcrossDownClues, { clueSelected: this.props.clueSelected, acrossClues: acrossWrappedClues, downClues: downWrappedClues }))));
        }
        return React.createElement("div", { style: { width: '600px' } },
            React.createElement(react_tabs_1.Tabs, null,
                React.createElement(react_tabs_1.TabList, null, this.props.clueProviders.map((cp, index) => {
                    return React.createElement(react_tabs_1.Tab, { key: index }, cp.name);
                })),
                this.props.clueProviders.map((cp, index) => {
                    return React.createElement(react_tabs_1.TabPanel, { key: index },
                        React.createElement(AcrossDownClues, { clueSelected: this.props.clueSelected, acrossClues: this.mapNonGroupedToWrapped(cp.acrossClues), downClues: this.mapNonGroupedToWrapped(cp.downClues) }));
                })));
    }
}
exports.CroswordClues = CroswordClues;
class AcrossDownClues extends React.Component {
    render() {
        //var leftContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding:'5px' }}>{this.getLeftText()}</div></Scrollbars>
        //var rightContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding: '5px' }}>{this.getRightText()}</div></Scrollbars>
        var containerStyle = { height: '800px', width: '600px' };
        var leftContent = React.createElement(AcrossOrDownClues, { clueSelected: this.props.clueSelected, isAcross: true, clues: this.props.acrossClues });
        var rightContent = React.createElement(AcrossOrDownClues, { clueSelected: this.props.clueSelected, isAcross: false, clues: this.props.downClues });
        return React.createElement("div", { style: containerStyle },
            " ",
            React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent }));
    }
}
exports.AcrossDownClues = AcrossDownClues;
class AcrossOrDownClues extends React.Component {
    constructor() {
        super(...arguments);
        this.clueSelected = (wordId) => {
            this.props.clueSelected(this.props.isAcross, wordId);
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { style: { padding: '5px' } }, this.props.isAcross ? "Across" : "Down"),
            React.createElement(react_custom_scrollbars_1.Scrollbars, { style: { width: '300px', height: '800px' } }, this.props.clues.map((clue, index) => {
                var border = '1px black solid';
                var style = {
                    borderTop: "",
                    borderBottom: ""
                };
                if (index !== this.props.clues.length - 1) {
                    style.borderTop = border;
                }
                else {
                    style.borderBottom = border;
                }
                return React.createElement("div", { style: style, key: index },
                    React.createElement(clueContainer_1.ClueContainer, { wrapped: clue.wrappedElement, key: index, selected: this.clueSelected, clueNumber: clue.clueNumber, wordId: clue.wordId, isSolved: clue.isSolved, solvingMode: clue.solvingMode, isSelected: clue.isSelected }));
            }))));
    }
}
exports.AcrossOrDownClues = AcrossOrDownClues;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const square_1 = __webpack_require__(66);
const commonColourStyling_1 = __webpack_require__(5);
// State is never set so we use the 'undefined' type.
class Crossword extends React.Component {
    //this is wrong do not want to pass through SquareProps as the selected ?
    render() {
        var squares = this.props.squares;
        var id = 0; //solely for finding in tests
        var trs = squares.map((row, rowIndex) => {
            var tds = row.map((square, index) => {
                id++;
                var square = squares[rowIndex][index];
                //remember that square.selected is callback from the CrosswordPuzzle
                return React.createElement("td", { style: { border: "0px" }, key: index, id: "SquareTd" + id },
                    React.createElement(square_1.Square, { selected: square.selected, letter: square.letter, isSelected: square.isSelected, isWordSelected: square.isWordSelected, solvingMode: square.solvingMode, autoSolved: square.autoSolved, guess: square.guess, identifier: square.identifier, number: square.number }));
            });
            return React.createElement("tr", { key: rowIndex }, tds);
        });
        //could do above inline  ,
        return React.createElement("table", { style: {
                backgroundColor: commonColourStyling_1.commonColourStyles.blank.backgroundColor, border: "2px solid", borderColor: commonColourStyling_1.commonColourStyles.blank.backgroundColor, borderCollapse: "collapse"
            } },
            React.createElement("tbody", null, trs));
    }
}
exports.Crossword = Crossword;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const index_1 = __webpack_require__(6);
const crossword_1 = __webpack_require__(61);
const KeyEvents = __webpack_require__(71);
const solveButton_1 = __webpack_require__(65);
const globalCheatButton_1 = __webpack_require__(64);
const autoSolveButton_1 = __webpack_require__(57);
const twoCol_1 = __webpack_require__(13);
const clues_1 = __webpack_require__(60);
var WordSelectMode;
(function (WordSelectMode) {
    WordSelectMode[WordSelectMode["select"] = 0] = "select";
    WordSelectMode[WordSelectMode["nav"] = 1] = "nav";
    WordSelectMode[WordSelectMode["across"] = 2] = "across";
    WordSelectMode[WordSelectMode["down"] = 3] = "down";
})(WordSelectMode = exports.WordSelectMode || (exports.WordSelectMode = {}));
class CrosswordPuzzle extends React.Component {
    constructor(props) {
        super(props);
        //this context lost otherwise
        this.squareSelected = (rowColIndices) => {
            var square = this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col];
            this.performSelection(square);
        };
        this.solveClicked = () => {
            if (this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving) {
                this.props.crosswordModel.solvingMode = index_1.SolvingMode.Guessing;
            }
            else {
                this.props.crosswordModel.solvingMode = index_1.SolvingMode.Solving;
            }
            this.setTheState();
        };
        this.globalCheatClicked = () => {
            if (this.props.crosswordModel.solvingMode === index_1.SolvingMode.Cheating) {
                this.props.crosswordModel.solvingMode = index_1.SolvingMode.Guessing;
            }
            else {
                this.props.crosswordModel.solvingMode = index_1.SolvingMode.Cheating;
            }
            this.setTheState();
        };
        this.autoSolveClicked = () => {
            this.autoSolve = !this.autoSolve;
            this.setTheState();
        };
        this.clueSelected = (isAcross, wordId) => {
            var cm = this.props.crosswordModel;
            var selectedWord = cm.words.find(word => {
                return word.id == wordId;
            });
            var firstSquare = selectedWord.squares[0];
            var wordSelectMode = WordSelectMode.down;
            if (isAcross) {
                wordSelectMode = WordSelectMode.across;
            }
            this.performSelection(firstSquare, wordSelectMode);
            //want to select it and force across/down
        };
        this.autoSolve = true;
        this.state = { squares: this.getTheState() };
    }
    _mapGrid(grid) {
        var self = this;
        var mappedGrid = grid.map((row, rowIndex) => {
            return row.map((square, colIndex) => {
                return {
                    identifier: { row: rowIndex, col: colIndex }, autoSolved: square.autoSolved, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: this.props.crosswordModel.solvingMode, number: square.number, letter: square.letter, guess: square.guess
                };
            });
        });
        return mappedGrid;
    }
    _selectWord(selectedWord) {
        if (this.props.crosswordModel.selectedWord !== selectedWord) {
            if (this.props.crosswordModel.selectedWord) {
                //this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
                this.props.crosswordModel.selectedWord.deselect();
            }
            selectedWord.select();
            this.props.crosswordModel.selectedWord = selectedWord;
        }
    }
    //the crosswordModel selectedCell property should deal with it - but interface 
    _selectSquare(square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square, across) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    performSelection(square, wordSelectMode = WordSelectMode.select) {
        var requiresRender = false;
        if (square.letter !== "") {
            var previousSelectedWord = this.props.crosswordModel.selectedWord;
            //leave here as _selectSquare changes
            var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
            var sameSquare = square.selected;
            if (!sameSquare) {
                this._selectSquare(square);
                requiresRender = true;
            }
            var wordToSelect;
            if (square.acrossWord !== null && square.downWord !== null) {
                if (wordSelectMode == WordSelectMode.across) {
                    wordToSelect = square.acrossWord;
                }
                else if (wordSelectMode == WordSelectMode.down) {
                    wordToSelect = square.downWord;
                }
                else {
                    if (sameSquare) {
                        wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                    }
                    else {
                        var determinePreference = true;
                        if (wordSelectMode === WordSelectMode.nav) {
                            if (previousSelectedSquare.acrossWord === square.acrossWord || previousSelectedSquare.downWord === square.downWord) {
                                wordToSelect = this.props.crosswordModel.selectedWord;
                                determinePreference = false;
                            }
                        }
                        if (determinePreference) {
                            wordToSelect = square.acrossWord;
                            if (square.number !== "") {
                                if (this._squareIsStartOfWord(square, false)) {
                                    if (!this._squareIsStartOfWord(square, true)) {
                                        wordToSelect = square.downWord;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
            }
            if (previousSelectedWord !== wordToSelect) {
                this._selectWord(wordToSelect);
                requiresRender = true;
            }
        }
        if (requiresRender) {
            this.setTheState();
        }
    }
    arrowDownDown(evt) {
        evt.preventDefault();
        this.arrowDown();
    }
    arrowDown() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == numSquaresInColumn - 1 ? 0 : nextSquareRowIndex + 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowLeftDown(evt) {
        evt.preventDefault();
        this.arrowLeft();
    }
    arrowLeft() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == 0 ? numSquaresInRow - 1 : nextSquareColIndex - 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowRightDown(evt) {
        evt.preventDefault();
        this.arrowRight();
    }
    arrowRight() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == numSquaresInRow - 1 ? 0 : nextSquareColIndex + 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowUpDown(evt) {
        evt.preventDefault();
        this.arrowUp();
    }
    arrowUp() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == 0 ? numSquaresInColumn - 1 : nextSquareRowIndex - 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    backspace() {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var requiresRender;
            if (selectedSquare.guess !== "") {
                selectedSquare.guess = "";
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                }
                else {
                    this.arrowUp();
                }
            }
            else {
                if (requiresRender) {
                    this.setTheState();
                }
            }
        }
    }
    keyGuess(event, keyValue) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length - 1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                }
                else {
                    this.arrowDown();
                }
            }
            else {
                if (requiresRender) {
                    this.setTheState();
                }
            }
        }
    }
    getTheState() {
        var crosswordModel = this.props.crosswordModel;
        //given that autoSolve is unrelated to a specific crossword
        if (this.autoSolve) {
            var solvedWords = [];
            var unsolvedWords = [];
            this.props.crosswordModel.words.forEach(word => {
                if (word.solved()) {
                    solvedWords.push(word);
                }
                else {
                    unsolvedWords.push(word);
                }
            });
            unsolvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolved = false);
            });
            solvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolved = true);
            });
        }
        else {
            var grid = this.props.crosswordModel.grid;
            grid.forEach(row => {
                row.forEach(square => {
                    square.autoSolved = false;
                });
            });
        }
        return this._mapGrid(this.props.crosswordModel.grid);
    }
    setTheState() {
        this.setState({ squares: this.getTheState() });
    }
    render() {
        var crosswordModel = this.props.crosswordModel;
        //solvingMode on the word........
        var solvingMode = crosswordModel.solvingMode;
        function mapClues(clues) {
            return clues.map(clue => {
                var clueWord = clue.word;
                var wordSolved = clueWord.solved();
                var clueLetters = clueWord.squares.map(sq => {
                    return {
                        guess: sq.guess,
                        letter: sq.letter,
                        autoSolved: sq.autoSolved,
                        solvingMode: solvingMode,
                        isSolved: wordSolved
                    };
                });
                var clueProps = {
                    clueNumber: clue.number,
                    format: clue.format,
                    text: clue.text,
                    solvingMode: solvingMode,
                    isSelected: crosswordModel.selectedWord === clue.word,
                    isSolved: wordSolved,
                    clueLetters: clueLetters,
                    wordId: clue.word.id
                };
                return clueProps;
            });
        }
        var mappedClueProviders = this.props.crosswordModel.clueProviders.map(cp => {
            return {
                name: cp.name,
                acrossClues: mapClues(cp.acrossClues),
                downClues: mapClues(cp.downClues)
            };
        });
        var leftContent = React.createElement("div", { style: { padding: '100px' } },
            React.createElement(crossword_1.Crossword, { squares: this.state.squares }),
            React.createElement(solveButton_1.SolveButton, { isSolving: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving, clicked: this.solveClicked }),
            React.createElement(globalCheatButton_1.GlobalCheatButton, { isCheating: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Cheating, clicked: this.globalCheatClicked }),
            React.createElement(autoSolveButton_1.AutoSolveButton, { isAutoSolving: this.autoSolve, clicked: this.autoSolveClicked }));
        var rightContent = React.createElement(clues_1.CroswordClues, { clueSelected: this.clueSelected, grouping: true, clueProviders: mappedClueProviders });
        return React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent });
    }
}
exports.CrosswordPuzzle = CrosswordPuzzle;
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var alphaKeysLower = alphaKeysUpper.map(u => u.toLowerCase());
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches = alphaKeys.map(alphaKey => {
    return {
        methodName: "keyGuess",
        keyMatches: [alphaKey]
    };
});
var arrowMatches = [
    {
        methodName: "arrowLeftDown",
        keyMatches: ["ArrowLeft"]
    },
    {
        methodName: "arrowRightDown",
        keyMatches: ["ArrowRight"]
    },
    {
        methodName: "arrowDownDown",
        keyMatches: ["ArrowDown"]
    },
    {
        methodName: "arrowUpDown",
        keyMatches: ["ArrowUp"]
    }
];
var backspaceMatch = {
    methodName: "backspace",
    keyMatches: ["Backspace"]
};
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
exports.CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const index_1 = __webpack_require__(6);
const commonColourStyling_1 = __webpack_require__(5);
class FormatWord extends React.Component {
    render() {
        var clueLetters = this.props.clueLetters;
        var format = this.props.format;
        var parts = format.split(",");
        var formatted = []; //type ReactInstance = Component<any, any> | Element; - this is not the correct typing ....
        var numParts = parts.length;
        var counter = 0;
        var key = counter;
        for (var i = 0; i < numParts; i++) {
            var part = parts[i];
            var numLettersInPart = parseInt(part);
            for (var j = 0; j < numLettersInPart; j++) {
                var clueLetterProps = clueLetters[counter];
                var clueLetter = React.createElement(ClueLetter, { key: key, isSolved: clueLetterProps.isSolved, autoSolved: clueLetterProps.autoSolved, guess: clueLetterProps.guess, letter: clueLetterProps.letter, solvingMode: clueLetterProps.solvingMode });
                formatted.push(clueLetter);
                counter++;
                key++;
            }
            var isLastPart = i == numParts - 1;
            if (!isLastPart) {
                formatted.push(React.createElement("span", { style: { paddingRight: '2px' }, key: key }, "-"));
                key++;
            }
        }
        return React.createElement("div", null, formatted);
    }
}
exports.FormatWord = FormatWord;
class ClueLetter extends React.Component {
    render() {
        var solvingMode = this.props.solvingMode;
        var letter = this.props.letter;
        var displayLetter = letter;
        var guess = this.props.guess;
        if (solvingMode !== index_1.SolvingMode.Cheating) {
            displayLetter = guess === "" ? "_" : guess;
        }
        var fontColor = commonColourStyling_1.commonColourStyles.letter.backgroundColor;
        if (solvingMode === index_1.SolvingMode.Guessing) {
            if (this.props.isSolved && this.props.autoSolved) {
                fontColor = commonColourStyling_1.commonColourStyles.autoSolved.backgroundColor;
            }
        }
        else {
            if (solvingMode === index_1.SolvingMode.Solving) {
                if (!this.props.isSolved && guess === letter) {
                    fontColor = commonColourStyling_1.commonColourStyles.autoSolved.backgroundColor;
                }
            }
        }
        return React.createElement("span", { style: { color: fontColor, paddingRight: '2px' } }, displayLetter);
    }
}
exports.ClueLetter = ClueLetter;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class GlobalCheatButton extends React.Component {
    render() {
        var text = "Cheat";
        if (this.props.isCheating) {
            text = "Uncheat";
        }
        //will add styling later
        return React.createElement("button", { onClick: () => { this.props.clicked(); } }, text);
    }
}
exports.GlobalCheatButton = GlobalCheatButton;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class SolveButton extends React.Component {
    render() {
        var text = "Solve";
        if (this.props.isSolving) {
            text = "Unsolve";
        }
        //will add styling later
        return React.createElement("button", { onClick: () => { this.props.clicked(); } }, text);
    }
}
exports.SolveButton = SolveButton;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
//import  Radium  =require('radium')
const index_1 = __webpack_require__(6);
const squareLetter_1 = __webpack_require__(67);
const squareNumber_1 = __webpack_require__(68);
const commonColourStyling_1 = __webpack_require__(5);
//@Radium
class Square extends React.Component {
    constructor() {
        super(...arguments);
        this._raiseSelected = () => {
            this.props.selected(this.props.identifier);
        };
    }
    _getBackgroundColorStyle() {
        if (this.props.letter === "") {
            return commonColourStyling_1.commonColourStyles.blank;
        }
        var solvingMode = this.props.solvingMode;
        var backgroundColorStyle;
        var propName = "selected";
        if (!this.props.isSelected) {
            if (this.props.isWordSelected) {
                propName = "wordSelected";
            }
            else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart = "Guessing";
        if (solvingMode !== index_1.SolvingMode.Guessing) {
            if (this.props.letter === this.props.guess) {
                solvingModePropPart = "Solved";
            }
            else {
                solvingModePropPart = "Unsolved";
                if (solvingMode === index_1.SolvingMode.Cheating) {
                    solvingModePropPart = "Cheating";
                }
            }
        }
        propName = propName + solvingModePropPart;
        backgroundColorStyle = commonColourStyling_1.commonColourStyles[propName];
        return backgroundColorStyle;
    }
    ;
    _getSquareStyle() {
        var baseStyle = {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position: "relative"
        };
        return Object.assign(baseStyle, this._getBackgroundColorStyle());
    }
    _getSquareLetter() {
        var letter = this.props.letter;
        if (this.props.solvingMode !== index_1.SolvingMode.Cheating) {
            letter = this.props.guess;
        }
        return letter;
    }
    shouldComponentUpdate(nextProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    }
    render() {
        return React.createElement("span", { onClick: this._raiseSelected, style: this._getSquareStyle() },
            React.createElement(squareNumber_1.SquareNumber, { number: this.props.number }),
            React.createElement(squareLetter_1.SquareLetter, { letter: this._getSquareLetter(), autoSolvedGuessing: this.props.solvingMode === index_1.SolvingMode.Guessing && this.props.autoSolved }));
    }
}
exports.Square = Square;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const commonColourStyling_1 = __webpack_require__(5);
class SquareLetter extends React.Component {
    render() {
        var fontColor = this.props.autoSolvedGuessing ? commonColourStyling_1.commonColourStyles.autoSolved.backgroundColor : commonColourStyling_1.commonColourStyles.letter.backgroundColor;
        return React.createElement("span", { style: { color: fontColor, verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight: "28px" } }, this.props.letter);
    }
}
exports.SquareLetter = SquareLetter;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class SquareNumber extends React.Component {
    render() {
        return React.createElement("span", { style: {
                position: "absolute", left: "2px", top: 0, fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    }
}
exports.SquareNumber = SquareNumber;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//it will only be necessary to read this the once - after that will be working from IndexedDbModelProvider or JsonModelProvider
const Crossword = __webpack_require__(6);
function ModelFromJson(json) {
    var grid = json.data.grid.map((row, rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare = {
                autoSolved: false,
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                acrossWord: null,
                downWord: null,
                guess: "",
                letter: square.Letter,
                number: square.Number,
                selected: false,
                wordSelected: false,
                solvingMode: Crossword.SolvingMode.Guessing
            };
            return crosswordSquare;
        });
    });
    var crosswordWords = json.data.copy.words.map(word => {
        var isAcross = true;
        var lengthEnd;
        //"2-12", means starts on 2 finishes on 12 - length = 12-1+1
        var xParts = word.x.split("-"); //*************** X is columns
        var yParts = word.y.split("-"); //*************** Y is rows
        var x = parseInt(xParts[0]); //lowest is 1
        var start = x;
        var y = parseInt(yParts[0]);
        var lengthParts = xParts;
        if (yParts.length == 2) {
            lengthParts = yParts;
            isAcross = false;
            start = y;
        }
        lengthEnd = parseInt(lengthParts[1]);
        var length = lengthEnd - start + 1;
        var crosswordWord = new Crossword.Word();
        crosswordWord.isAcross = isAcross;
        crosswordWord.id = word.id;
        for (var i = 0; i < length; i++) {
            var crosswordSquare = grid[y - 1][x - 1];
            crosswordWord.squares.push(crosswordSquare);
            if (isAcross) {
                crosswordSquare.acrossWord = crosswordWord;
                x = x + 1;
            }
            else {
                crosswordSquare.downWord = crosswordWord;
                y = y + 1;
            }
        }
        return crosswordWord;
    });
    //at the moment it is {"name": "Cryptic","title": "Across",..} , {"name": "Cryptic", "title": "Down",..}, {"name": "Coffee time","title": "Across",},{"name": "Coffee time","title": "Down",}
    var sunCluesByProviderAndDirection = json.data.copy.clues;
    function findCrossword(id) {
        var crossword;
        for (var i = 0; i < crosswordWords.length; i++) {
            var cw = crosswordWords[i];
            if (cw.id === id) {
                crossword = cw;
                break;
            }
        }
        return crossword;
    }
    function mapClues(clues) {
        return clues.map(clue => {
            var crosswordClue = {
                format: clue.format,
                text: clue.clue,
                number: clue.number,
                word: findCrossword(clue.word)
            };
            return crosswordClue;
        });
    }
    //for simplicity...
    var crosswordModel = {
        grid: grid,
        clueProviders: [
            {
                name: "Cryptic",
                acrossClues: mapClues(sunCluesByProviderAndDirection[0].clues),
                downClues: mapClues(sunCluesByProviderAndDirection[1].clues)
            },
            {
                name: "Coffee time",
                acrossClues: mapClues(sunCluesByProviderAndDirection[2].clues),
                downClues: mapClues(sunCluesByProviderAndDirection[3].clues)
            }
        ],
        selectedSquare: null,
        selectedWord: null,
        solvingMode: Crossword.SolvingMode.Guessing,
        words: crosswordWords
    };
    return crosswordModel;
}
exports.ModelFromJson = ModelFromJson;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactDOM = __webpack_require__(23);
const CrosswordPuzzleLoader_1 = __webpack_require__(22);
ReactDOM.render(React.createElement(CrosswordPuzzleLoader_1.CrosswordPuzzleLoader, null), document.getElementById("example"));


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* @flow */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
//import {canUseDOM} from 'exenv';
const constants_1 = __webpack_require__(14);
const utils_1 = __webpack_require__(72);
function keyModifiersAny() {
    return {
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        none: true,
        andOr: AndOr.Or
    };
}
exports.keyModifiersAny = keyModifiersAny;
var KeyModifiersEnum;
(function (KeyModifiersEnum) {
    KeyModifiersEnum[KeyModifiersEnum["none"] = 0] = "none";
    KeyModifiersEnum[KeyModifiersEnum["alt"] = 1] = "alt";
    KeyModifiersEnum[KeyModifiersEnum["ctrl"] = 2] = "ctrl";
    KeyModifiersEnum[KeyModifiersEnum["shift"] = 4] = "shift";
    KeyModifiersEnum[KeyModifiersEnum["all"] = 7] = "all";
})(KeyModifiersEnum = exports.KeyModifiersEnum || (exports.KeyModifiersEnum = {}));
var AndOr;
(function (AndOr) {
    AndOr[AndOr["Or"] = 0] = "Or";
    AndOr[AndOr["AndLoose"] = 1] = "AndLoose";
    AndOr[AndOr["AndExact"] = 2] = "AndExact";
})(AndOr = exports.AndOr || (exports.AndOr = {}));
class KeyHandler extends React.Component {
    constructor(props) {
        super(props);
        this.isModifierMatch = (event, modifiers) => {
            var match = true;
            var modKeys = {
                altKey: modifiers.altKey,
                ctrlKey: modifiers.ctrlKey,
                shiftKey: modifiers.shiftKey
            };
            var none = modifiers.none;
            if (modifiers.andOr !== AndOr.Or) {
                if (none) {
                    throw new Error("cannot have none and and");
                }
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        match = event[modKey];
                        if (!match) {
                            break;
                        }
                    }
                }
            }
            else {
                //console.log("in or")//these needs to change to cater for none 
                var noModifiers = true;
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        //console.log("Looking at event " + modKey);
                        match = event[modKey];
                        if (noModifiers) {
                            noModifiers = !match;
                        }
                        if (match) {
                            //console.log("match key: " + modKey);
                            break;
                        }
                    }
                }
                if (!match && noModifiers && none) {
                    //console.log('no modifiers and none');
                    match = true;
                }
            }
            //console.log('is match: ' + match)
            return match;
        };
        this.handleKey = (event) => {
            //console.log("keyhandler component handle key")
            const { keyValue, keyCode, keyMatches, onKeyHandle } = this.props;
            if (!onKeyHandle) {
                return;
            }
            const { target } = event;
            if (target instanceof HTMLElement && utils_1.isInput(target)) {
                return;
            }
            //console.log("Before keyMatches");
            var matchingIds = [];
            var matches;
            if (keyMatches) {
                //console.log("In key matches");
                //could have mapped all to Array<ModKey> but then would have had unnecessary looping
                if (keyMatches instanceof Array) {
                    for (var i = 0; i < keyMatches.length; i++) {
                        var keyOrModKey = keyMatches[i];
                        var key;
                        var mod = keyModifiersAny();
                        var id = null;
                        if (typeof keyOrModKey === 'string') {
                            key = keyOrModKey;
                        }
                        else {
                            key = keyOrModKey.key;
                            mod = keyOrModKey.modifiers;
                            id = keyOrModKey.id;
                        }
                        var kbKey = { keyValue: key, keyCode: null };
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, kbKey);
                        if (possibleMatch) {
                            var isMatch = this.isModifierMatch(event, mod);
                            if (!matches) {
                                matches = isMatch;
                            }
                            if (matches && id) {
                                matchingIds.push(id);
                            }
                            if (!id) {
                                break;
                            }
                        }
                    }
                }
                else {
                    var keys = keyMatches.keys;
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, { keyValue: key, keyCode: null });
                        if (possibleMatch) {
                            matches = this.isModifierMatch(event, keyMatches.modifiers);
                            break;
                        }
                    }
                }
            }
            else {
                matches = utils_1.matchesKeyboardEvent(event, { keyValue, keyCode });
            }
            if (matches) {
                onKeyHandle(event, matchingIds);
            }
        };
        /* eslint-disable no-console */
        //if (!props.keyValue && !props.keyCode) {
        //  console.error('Warning: Failed propType: Missing prop `keyValue` or `keyCode` for `KeyHandler`.');
        //}
        /* eslint-enable */
    }
    shouldComponentUpdate() {
        return false;
    }
    componentDidMount() {
        //if (!canUseDOM) return;
        window.document.addEventListener(this.props.keyEventName, this.handleKey);
    }
    componentWillUnmount() {
        //if (!canUseDOM) return;
        window.document.removeEventListener(this.props.keyEventName, this.handleKey);
    }
    render() {
        return null;
    }
}
KeyHandler.defaultProps = {
    keyEventName: constants_1.KEYUP,
};
exports.KeyHandler = KeyHandler;
;
/**
 * KeyHandler decorators.
 */
//...any: any[]
function keyHandleDecorator(matcher) {
    return (props) => {
        const { keyValue, keyCode, keyEventName, keyMatches } = props || {};
        return (Component) => (
        //the decorator needs to have the same property interface 
        class KeyHandleDecorator extends React.Component {
            constructor() {
                super(...arguments);
                this.state = { keyValue: null, keyCode: null, modifiers: null };
                this.handleKey = (event, ids) => {
                    //console.log("HOC handleKey");
                    if (matcher && matcher(event, this.state)) {
                        this.setState({ keyValue: null, keyCode: null });
                        return;
                    }
                    var modifiers = KeyModifiersEnum.none;
                    if (event.altKey) {
                        modifiers |= KeyModifiersEnum.alt;
                    }
                    if (event.ctrlKey) {
                        modifiers |= KeyModifiersEnum.ctrl;
                    }
                    if (event.shiftKey) {
                        modifiers |= KeyModifiersEnum.shift;
                    }
                    var keyValue = utils_1.eventKey(event);
                    var keyCode = event.keyCode;
                    if (ids.length > 0) {
                        ids.forEach(methodName => {
                            this.wrappedInstance[methodName](event, keyValue, keyCode, modifiers);
                        });
                    }
                    else {
                        this.setState({ keyValue: keyValue, keyCode: keyCode, modifiers: modifiers });
                    }
                };
            }
            render() {
                function isKeyMatchesMethodName(toDetermine) {
                    return toDetermine.methodName !== undefined;
                }
                var mappedKeyMatches = keyMatches;
                if (keyMatches) {
                    if (keyMatches instanceof Array) {
                        var testEntry = keyMatches[0];
                        if (isKeyMatchesMethodName(testEntry)) {
                            var keyMatchesMethodNameArray = keyMatches;
                            var allModKeys = [];
                            keyMatchesMethodNameArray.forEach(keyMatchesMethodName => {
                                var methodName = keyMatchesMethodName.methodName;
                                var kMatches = keyMatchesMethodName.keyMatches;
                                var modKeys;
                                if (kMatches instanceof Array) {
                                    var tEntry = kMatches[0];
                                    if (typeof tEntry === 'string') {
                                        var anyKeyModifiers = keyModifiersAny();
                                        modKeys = kMatches.map(kMatch => {
                                            var modKey = {
                                                key: kMatch,
                                                modifiers: anyKeyModifiers
                                            };
                                            return modKey;
                                        });
                                    }
                                    else {
                                        modKeys = kMatches;
                                    }
                                }
                                else {
                                    var modifiers = kMatches.modifiers;
                                    modKeys = kMatches.keys.map(key => {
                                        var modKey = {
                                            key: key,
                                            modifiers: modifiers
                                        };
                                        return modKey;
                                    });
                                }
                                modKeys.forEach(modKey => modKey.id = methodName);
                                allModKeys = allModKeys.concat(modKeys);
                            });
                            mappedKeyMatches = allModKeys;
                        }
                    }
                }
                return (React.createElement("div", null,
                    React.createElement(KeyHandler, { keyValue: keyValue, keyCode: keyCode, keyMatches: mappedKeyMatches, keyEventName: keyEventName, onKeyHandle: this.handleKey }),
                    React.createElement(Component, Object.assign({ ref: (instance) => { this.wrappedInstance = instance; } }, this.props, this.state))));
            }
        });
    };
}
exports.keyHandler = keyHandleDecorator();
exports.keyToggleHandler = keyHandleDecorator(utils_1.matchesKeyboardEvent);
/**
 * Constants
 */
__export(__webpack_require__(14));


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* @flow */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(14);
/**
 * Constants.
 */
const NORMALIZED_KEYS = {
    'Esc': 'Escape',
    'Spacebar': ' ',
    'Left': 'ArrowLeft',
    'Up': 'ArrowUp',
    'Right': 'ArrowRight',
    'Down': 'ArrowDown',
    'Del': 'Delete',
    'Win': 'OS',
    'Menu': 'ContextMenu',
    'Apps': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'MozPrintableKey': 'Unidentified',
};
const KEY_CODE_KEYS = {
    '8': 'Backspace',
    '9': 'Tab',
    '12': 'Clear',
    '13': 'Enter',
    '16': 'Shift',
    '17': 'Control',
    '18': 'Alt',
    '19': 'Pause',
    '20': 'CapsLock',
    '27': 'Escape',
    '32': ' ',
    '33': 'PageUp',
    '34': 'PageDown',
    '35': 'End',
    '36': 'Home',
    '37': 'ArrowLeft',
    '38': 'ArrowUp',
    '39': 'ArrowRight',
    '40': 'ArrowDown',
    '45': 'Insert',
    '46': 'Delete',
    '112': 'F1',
    '113': 'F2',
    '114': 'F3',
    '115': 'F4',
    '116': 'F5',
    '117': 'F6',
    '118': 'F7',
    '119': 'F8',
    '120': 'F9',
    '121': 'F10',
    '122': 'F11',
    '123': 'F12',
    '144': 'NumLock',
    '145': 'ScrollLock',
    '224': 'Meta',
};
/**
 * Check if `given` element is an input / textarea form element or acts as one.
 */
function isInput(element) {
    if (!element) {
        return false;
    }
    const { tagName } = element;
    const editable = isContentEditable(element);
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable;
}
exports.isInput = isInput;
function isContentEditable(element) {
    if (typeof element.getAttribute !== 'function') {
        return false;
    }
    return !!element.getAttribute('contenteditable');
}
/**
 * Matches an event against a given keyboard key.
 */
function matchesKeyboardEvent(event, { keyCode, keyValue }) {
    if (!isNullOrUndefined(keyValue)) {
        //console.log("checking " + keyValue);
        return keyValue === eventKey(event);
    }
    if (!isNullOrUndefined(keyCode)) {
        return keyCode === event.keyCode;
    }
    return false;
}
exports.matchesKeyboardEvent = matchesKeyboardEvent;
function isNullOrUndefined(value) {
    return (value === undefined) || (value === null);
}
function eventKey(event) {
    const { key, keyCode, type } = event;
    if (key) {
        const normalizedKey = NORMALIZED_KEYS[key] || key;
        if (normalizedKey !== 'Unidentified') {
            return normalizedKey;
        }
    }
    if (type === constants_1.KEYPRESS) {
        const charCode = eventCharCode(event);
        return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
    }
    if (type === constants_1.KEYDOWN || type === constants_1.KEYUP) {
        return KEY_CODE_KEYS[String(keyCode)] || 'Unidentified';
    }
    return '';
}
exports.eventKey = eventKey;
function eventCharCode(event) {
    let { charCode, keyCode } = event;
    if ('charCode' in event) {
        if (charCode === 0 && keyCode === 13) {
            return 13;
        }
    }
    else {
        charCode = keyCode;
    }
    if (charCode >= 32 || charCode === 13) {
        return charCode;
    }
    return 0;
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
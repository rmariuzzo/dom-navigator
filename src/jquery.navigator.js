/*
 * jquery.navigator
 *
 *
 * Copyright (c) 2014 Rubens Mariuzzo
 * Licensed under the MIT license.
 */

/* globals define */

(function(factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return factory(jQuery);
    });
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function($) {

  //-------------------//
  // Utilities methods //
  //-------------------//

  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue;
      }

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
  }

  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  //-------------//
  // Constructor //
  //-------------//

  var Navigator = function(element, options) {
    this.$doc = window.document;
    this.$element = element;
    this.$options = extend({}, Navigator.defaults, options);
    this.$selected = null;
    this.$keys = {};
    this.$keys[this.$options.left] = this.left;
    this.$keys[this.$options.up] = this.up;
    this.$keys[this.$options.right] = this.right;
    this.$keys[this.$options.down] = this.down;
    this.$keydownHandler = null;
    this.enable();
  };

  Navigator.defaults = {
    selected: 'selected',
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };

  //---------//
  // Methods //
  //---------//

  Navigator.prototype.enable = function() {
    var self = this;
    this.$keydownHandler = function(event) {
      self.handleKeydown.call(self, event);
    };
    this.$doc.addEventListener('keydown', this.$keydownHandler);
  };

  Navigator.prototype.disable = function() {
    if (this.$keydownHandler) {
      this.$doc.removeEventListener('keydown', this.$keydownHandler);
    }
  };

  Navigator.prototype.destroy = function() {
    this.disable();
    if (this.$element.navigator) {
      delete this.$element.navigator;
    }
  };

  Navigator.prototype.left = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft - 1;
      var top = this.$selected.offsetTop;

      var next = this.elementsBefore(left, Infinity).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top);
        if (currDistance < prev.distance) {
          return {
            distance: currDistance,
            element: curr
          };
        }
        return prev;
      }, {
        distance: Infinity
      });

      this.select(next.element);
    }
  };

  Navigator.prototype.up = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft;
      var top = this.$selected.offsetTop - 1;

      var next = this.elementsBefore(Infinity, top).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top);
        if (currDistance < prev.distance) {
          return {
            distance: currDistance,
            element: curr
          };
        }
        return prev;
      }, {
        distance: Infinity
      });

      this.select(next.element);
    }
  };

  Navigator.prototype.right = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft + this.$selected.offsetWidth;
      var top = this.$selected.offsetTop;

      var next = this.elementsAfter(left, 0).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        currDistance = Math.abs(currDistance.left - left) + Math.abs(currDistance.top - top);
        if (currDistance < prev.distance) {
          return {
            distance: currDistance,
            element: curr
          };
        }
        return prev;
      }, {
        distance: Infinity
      });

      this.select(next.element);
    }
  };

  Navigator.prototype.down = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft;
      var top = this.$selected.offsetTop + this.$selected.offsetHeight;

      var next = this.elementsAfter(0, top).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        currDistance = Math.abs(currDistance.left - left) + Math.abs(currDistance.top - top);
        if (currDistance < prev.distance) {
          return {
            distance: currDistance,
            element: curr
          };
        }
        return prev;
      }, {
        distance: Infinity
      });

      this.select(next.element);
    }
  };

  Navigator.prototype.selected = function() {
    return this.$selected;
  };

  Navigator.prototype.select = function(element) {
    if (element && element !== this.$selected) {
      // Unbox element from jQuery or array.
      if (element.jquery || Array.isArray(element)) {
        element = element[0];
      }
      // Unselect previous element.
      if (this.$selected) {
        removeClass(this.$selected, this.$options.selected);
      }
      // Select given element.
      addClass(element, this.$options.selected);
      this.$selected = element;
    }
  };

  Navigator.prototype.elements = function() {
    var children = [];
    for (var i = this.$element.children.length; i--;) {
      // Skip comment nodes on IE8
      if (this.$element.children[i].nodeType !== 8) {
        children.unshift(this.$element.children[i]);
      }
    }
    return children;
  };

  Navigator.prototype.elementsAfter = function(left, top) {
    return this.elements().filter(function(el) {
      return el.offsetLeft >= left && el.offsetTop >= top;
    });
  };

  Navigator.prototype.elementsBefore = function(left, top) {
    return this.elements().filter(function(el) {
      return el.offsetLeft <= left && el.offsetTop <= top;
    });
  };

  Navigator.prototype.handleKeydown = function(event) {
    if (this.$keys[event.which]) {
      event.preventDefault();
      this.$keys[event.which].call(this);
    }
  };

  //--------------------------//
  // jQuery plugin definition //
  //--------------------------//

  if ($) {

    var old = $.fn.navigator;

    $.fn.navigator = function(method) {

      // Parse arguments.
      var args = Array.prototype.slice.call(arguments, 1);
      var retval;

      this.each(function() {

        // Create Navigator instance.
        if (!this.navigator) {
          this.navigator = new Navigator(this, typeof method === 'object' && method);
        }

        // Invoke given method with given arguments.
        if (typeof method === 'string' && this.navigator[method]) {
          retval = this.navigator[method].apply(this.navigator, args);
        }

      });

      if (retval === undefined) {
        retval = this;
      }

      return retval;
    };

    $.fn.navigator.Constructor = Navigator;

    //---------------------------//
    // jQuery plugin no conflict //
    //---------------------------//

    $.fn.navigator.noConflict = function() {
      $.fn.navigator = old;
      return this;
    };
  }

}));

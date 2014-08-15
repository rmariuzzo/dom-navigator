/*! dom-navigator - v1.0.0 - 2014-08-14
* https://github.com/rmariuzzo/dom-navigator
* Copyright (c) 2014 Rubens Mariuzzo; Licensed MIT */
/* globals define */

(function(factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return factory(window.jQuery);
    });
  } else {
    // Browser globals
    factory(window.jQuery);
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

  var DIRECTION = {
    left: 'left',
    up: 'up',
    right: 'right',
    down: 'down'
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
    if (this.$element.domNavigator) {
      delete this.$element.domNavigator;
    }
  };

  Navigator.prototype.left = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft - 1;
      var top = this.$selected.offsetTop;

      var next = this.elementsBefore(left, Infinity).reduce(function(prev, curr) {
        var currDistance = Math.abs(left - curr.offsetLeft) + Math.abs(top - curr.offsetTop);
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

      this.select(next.element, DIRECTION.left);
    }
  };

  Navigator.prototype.up = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft;
      var top = this.$selected.offsetTop - 1;

      var next = this.elementsBefore(Infinity, top).reduce(function(prev, curr) {
        var currDistance = Math.abs(left - curr.offsetLeft) + Math.abs(top - curr.offsetTop);
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

      this.select(next.element, DIRECTION.up);
    }
  };

  Navigator.prototype.right = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft + this.$selected.offsetWidth;
      var top = this.$selected.offsetTop;

      var next = this.elementsAfter(left, 0).reduce(function(prev, curr) {
        var currDistance = Math.abs(curr.offsetLeft - left) + Math.abs(curr.offsetTop - top);
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

      this.select(next.element, DIRECTION.right);
    }
  };

  Navigator.prototype.down = function() {
    if (!this.$selected) {
      this.select(this.elements()[0]);
    } else {
      var left = this.$selected.offsetLeft;
      var top = this.$selected.offsetTop + this.$selected.offsetHeight;

      var next = this.elementsAfter(0, top).reduce(function(prev, curr) {
        var currDistance = Math.abs(curr.offsetLeft - left) + Math.abs(curr.offsetTop - top);
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

      this.select(next.element, DIRECTION.down);
    }
  };

  Navigator.prototype.selected = function() {
    return this.$selected;
  };

  Navigator.prototype.select = function(element, direction) {
    if (element && element !== this.$selected) {
      // Unbox element from jQuery or array.
      if (element.jquery || Array.isArray(element)) {
        element = element[0];
      }
      // Unselect previous element.
      if (this.$selected) {
        removeClass(this.$selected, this.$options.selected);
      }
      // Scroll to given element.
      this.focus(element, direction);
      // Select given element.
      addClass(element, this.$options.selected);
      this.$selected = element;
    }
  };

  /**
   * Focus an element by scrolling the container.
   *
   * @param el {Element} The element to focus.
   * @param direction {String} The direction of the current navigation.
   *
   * @return void.
   */
  Navigator.prototype.focus = function(el, direction) {
    if (!this.inContainerViewport(el)) {
      switch (direction) {
        case DIRECTION.left:
          break;
        case DIRECTION.up:
          this.$element.scrollTop = el.offsetTop - this.$element.offsetTop;
          break;
        case DIRECTION.right:
          break;
        case DIRECTION.down:
          this.$element.scrollTop = el.offsetTop - this.$element.offsetTop - (this.$element.offsetHeight - el.offsetHeight);
          break;
      }
    }
  };

  /**
   * Indicate if an element is in the viewport.
   *
   * @param el {Element} The element to check.
   *
   * @return {Boolean} true if the given element is in the viewport, otherwise false.
   */
  Navigator.prototype.inContainerViewport = function(el) {
    // Check on left side.
    if (el.offsetLeft - this.$element.scrollLeft < this.$element.offsetLeft) {
      return false;
    }
    // Check on top side.
    if (el.offsetTop - this.$element.scrollTop < this.$element.offsetTop) {
      return false;
    }
    // Check on right side.
    if ((el.offsetLeft + el.offsetWidth - this.$element.scrollLeft) > (this.$element.offsetLeft + this.$element.offsetWidth)) {
      return false;
    }
    // Check on down side.
    if ((el.offsetTop + el.offsetHeight - this.$element.scrollTop) > (this.$element.offsetTop + this.$element.offsetHeight)) {
      return false;
    }
    return true;
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

  //------------------------//
  // Export Navigator class //
  //------------------------//

  window.DomNavigator = Navigator;

  //--------------------------//
  // jQuery plugin definition //
  //--------------------------//

  if ($) {

    var old = $.fn.domNavigator;

    $.fn.domNavigator = function(method) {

      // Parse arguments.
      var args = Array.prototype.slice.call(arguments, 1);
      var retval;

      this.each(function() {

        // Create Navigator instance.
        if (!this.domNavigator) {
          this.domNavigator = new Navigator(this, typeof method === 'object' && method);
        }

        // Invoke given method with given arguments.
        if (typeof method === 'string' && this.domNavigator[method]) {
          retval = this.domNavigator[method].apply(this.domNavigator, args);
        }

      });

      if (retval === undefined) {
        retval = this;
      }

      return retval;
    };

    $.fn.domNavigator.Constructor = Navigator;

    //---------------------------//
    // jQuery plugin no conflict //
    //---------------------------//

    $.fn.domNavigator.noConflict = function() {
      $.fn.domNavigator = old;
      return this;
    };
  }

}));

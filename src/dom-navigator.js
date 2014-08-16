/*
 * DOM Navigator
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

  /**
   * Unbox an object from jQuery or array.
   *
   * @param obj {Object} The object to unbox.
   *
   * @return {Element} An element.
   */
  function unboxElement(obj) {
    if (obj.jquery || Array.isArray(obj)) {
      return obj[0];
    }
    return obj;
  }

  //-------------//
  // Constructor //
  //-------------//

  /**
   * Create a new DOM Navigator.
   *
   * @param container {Element} The container of the element to navigate.
   * @param options {Object} The options to configure the DOM navigator.
   *
   * @return void.
   */
  var Navigator = function(container, options) {
    this.$doc = window.document;
    this.$container = container;
    this.$options = extend({}, Navigator.defaults, options);
    this.$selected = null;
    this.$keydownHandler = null;
    this.$keys = {};
    this.$keys[this.$options.left] = this.left;
    this.$keys[this.$options.up] = this.up;
    this.$keys[this.$options.right] = this.right;
    this.$keys[this.$options.down] = this.down;
    this.enable();
  };

  /**
   * Defaults options.
   */
  Navigator.defaults = {
    selected: 'selected',
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };

  /**
   * Direction constants.
   */
  var DIRECTION = {
    left: 'left',
    up: 'up',
    right: 'right',
    down: 'down'
  };

  //---------//
  // Methods //
  //---------//

  /**
   * Enable this navigator.
   *
   * @return void.
   */
  Navigator.prototype.enable = function() {
    var self = this;
    this.$keydownHandler = function(event) {
      self.handleKeydown.call(self, event);
    };
    this.$doc.addEventListener('keydown', this.$keydownHandler);
  };

  /**
   * Disable this navigator.
   *
   * @return void.
   */
  Navigator.prototype.disable = function() {
    if (this.$keydownHandler) {
      this.$doc.removeEventListener('keydown', this.$keydownHandler);
    }
  };

  /**
   * Destroy this navigator removing any event registered and any other data.
   *
   * @return void.
   */
  Navigator.prototype.destroy = function() {
    this.disable();
    if (this.$container.domNavigator) {
      delete this.$container.domNavigator;
    }
  };

  /**
   * Navigate left to the next element if any.
   *
   * @return void.
   */
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

  /**
   * Navigate up to the next element if any.
   *
   * @return void.
   */
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

  /**
   * Navigate right to the next element if any.
   *
   * @return void.
   */
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

  /**
   * Navigate down to the next element if any.
   */
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

  /**
   * Return the selected DOM element.
   *
   * @return {Element} The selected DOM element.
   */
  Navigator.prototype.selected = function() {
    return this.$selected;
  };

  /**
   * Select the given element.
   *
   * @param el {Element} The DOM element to select.
   *
   * @return void
   */
  Navigator.prototype.select = function(el, direction) {
    // Is there an element or is it selected?
    if (!el || el === this.$selected) {
      return; // Nothing to do here.
    }
    el = unboxElement(el);
    // Unselect previous element.
    if (this.$selected) {
      removeClass(this.$selected, this.$options.selected);
    }
    // Scroll to given element.
    this.scrollTo(el, direction);
    // Select given element.
    addClass(el, this.$options.selected);
    this.$selected = el;
  };

  /**
   * Scroll the container to an element.
   *
   * @param el {Element} The destination element.
   * @param direction {String} The direction of the current navigation.
   *
   * @return void.
   */
  Navigator.prototype.scrollTo = function(el, direction) {
    if (!this.inContainerViewport(el)) {
      switch (direction) {
        case DIRECTION.left:
          // TODO.
          break;
        case DIRECTION.up:
          this.$container.scrollTop = el.offsetTop - this.$container.offsetTop;
          break;
        case DIRECTION.right:
          // TODO.
          break;
        case DIRECTION.down:
          this.$container.scrollTop = el.offsetTop - this.$container.offsetTop - (this.$container.offsetHeight - el.offsetHeight);
          break;
      }
    }
  };

  /**
   * Indicate if an element is in the container viewport.
   *
   * @param el {Element} The element to check.
   *
   * @return {Boolean} true if the given element is in the container viewport, otherwise false.
   */
  Navigator.prototype.inContainerViewport = function(el) {
    el = unboxElement(el);
    // Check on left side.
    if (el.offsetLeft - this.$container.scrollLeft < this.$container.offsetLeft) {
      return false;
    }
    // Check on top side.
    if (el.offsetTop - this.$container.scrollTop < this.$container.offsetTop) {
      return false;
    }
    // Check on right side.
    if ((el.offsetLeft + el.offsetWidth - this.$container.scrollLeft) > (this.$container.offsetLeft + this.$container.offsetWidth)) {
      return false;
    }
    // Check on down side.
    if ((el.offsetTop + el.offsetHeight - this.$container.scrollTop) > (this.$container.offsetTop + this.$container.offsetHeight)) {
      return false;
    }
    return true;
  };

  /**
   * Return an array of the navigable elements.
   *
   * @return {Array} An array of elements.
   */
  Navigator.prototype.elements = function() {
    var children = [];
    for (var i = this.$container.children.length; i--;) {
      // Skip comment nodes on IE8
      if (this.$container.children[i].nodeType !== 8) {
        children.unshift(this.$container.children[i]);
      }
    }
    return children;
  };

  /**
   * Return an array of navigable elements after an offset.
   *
   * @param left {Integer} The left offset.
   * @param top {Integer} The top offset.
   *
   * @return {Array} An array of elements.
   */
  Navigator.prototype.elementsAfter = function(left, top) {
    return this.elements().filter(function(el) {
      return el.offsetLeft >= left && el.offsetTop >= top;
    });
  };

  /**
   * Return an array of navigable elements before an offset.
   *
   * @param left {Integer} The left offset.
   * @param top {Integer} The top offset.
   *
   * @return {Array} An array of elements.
   */
  Navigator.prototype.elementsBefore = function(left, top) {
    return this.elements().filter(function(el) {
      return el.offsetLeft <= left && el.offsetTop <= top;
    });
  };

  /**
   * Handle the keydown event.
   *
   * @param {Event} The event object.
   *
   * @return void.
   */
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

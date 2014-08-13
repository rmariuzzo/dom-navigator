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
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function($) {

  //-------------//
  // Constructor //
  //-------------//

  var Navigator = function(element, options) {
    this.$document = $(document);
    this.$element = element;
    this.$options = $.extend({}, Navigator.defaults, options);
    this.$selected = null;
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
    // Create map of movement methods by keys.
    var keys = {};
    keys[this.$options.left] = this.left;
    keys[this.$options.up] = this.up;
    keys[this.$options.right] = this.right;
    keys[this.$options.down] = this.down;

    // Bind keydown event.
    var instance = this;
    this.$document.bind('keydown', function(event) {
      event.preventDefault();
      if (keys[event.which]) {
        keys[event.which].call(instance);
      }
    });
  };

  Navigator.prototype.disable = function() {
    this.$document.unbind('keydown');
  };

  Navigator.prototype.destroy = function() {
    this.disable();
    this.$element.removeData('navigator');
  };

  Navigator.prototype.left = function() {
    if (!this.$selected) {
      this.select(this.$element.children().eq(0));
    } else {
      var left = this.$selected.position().left - 1;
      var top = this.$selected.position().top;

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
      this.select(this.$element.children().eq(0));
    } else {
      var left = this.$selected.position().left;
      var top = this.$selected.position().top - 1;

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
      this.select(this.$element.children().eq(0));
    } else {
      var left = this.$selected.position().left + this.$selected.width();
      var top = this.$selected.position().top;

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
      this.select(this.$element.children().eq(0));
    } else {
      var left = this.$selected.position().left;
      var top = this.$selected.position().top + this.$selected.height();

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
    element = $(element);
    if (element.length && element !== this.$selected) {
      // Unselect previous element.
      if (this.$selected) {
        this.$selected.removeClass(this.$options.selected);
      }
      // Select given element.
      element.addClass(this.$options.selected);
      this.$selected = element;
    }
  };

  Navigator.prototype.elementsAfter = function(left, top) {
    return $.grep(this.$element.children(), function(el) {
      var pos = $(el).position();
      return pos.left >= left && pos.top >= top;
    });
  };

  Navigator.prototype.elementsBefore = function(left, top) {
    return $.grep(this.$element.children(), function(el) {
      var pos = $(el).position();
      return pos.left <= left && pos.top <= top;
    });
  };

  //--------------------------//
  // jQuery plugin definition //
  //--------------------------//

  var old = $.fn.navigator;

  $.fn.navigator = function(method) {

    // Parse arguments.
    var args = Array.prototype.slice.call(arguments, 1);
    var retval;

    this.each(function() {

      var $this = $(this),
        instance = $this.data('navigator');

      // Create Navigator instance.
      if (!instance) {
        $this.data('navigator', (instance = new Navigator($this, typeof method === 'object' && method)));
      }

      // Invoke given method with given arguments.
      if (typeof method === 'string' && instance[method]) {
        retval = instance[method].apply(instance, args);
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

}));

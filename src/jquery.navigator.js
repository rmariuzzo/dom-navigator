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
  //  Utilities  //
  //-------------//
  
  function isInRange(from, to, angle) {
    var _from  = from  % (2 * Math.PI),
        _to    = to    % (2 * Math.PI),
        _angle = angle % (2 * Math.PI);
    
    if (_from  < 0) _from  += (2 * Math.PI);
    if (_to    < 0) _to    += (2 * Math.PI);
    if (_angle < 0) _angle += (2 * Math.PI);
    if (_from === _to) {
      if (to > from)
          return true; // whole circle
      return _angle === _from; // exact only
    }
    if (_to < _from)
      return _angle <= _to || from <= _angle; // _angle outside range
    
    return _from <= _angle && _angle <= _to;    // _angle inside range
  }

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
    down: 40,
    upAngleRange: [1.25 * Math.PI, 1.75  * Math.PI],    //
    rightAngleRange: [1.75 * Math.PI, 0.25 * Math.PI], // This is defining matematicly what
    downAngleRange: [0.25 * Math.PI, 0.75 * Math.PI],  // is up and what is down, etc
    leftAngleRange: [0.75 * Math.PI, 1.25 * Math.PI]  //
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
      if (keys[event.which]) {
        event.preventDefault();
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
      var $this = this; //inside the reduce callback this == window
      var next = this.elementsBefore(left, Infinity).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        // define the top and left for futher calcs
        var currtop = currDistance.top - top;
        var currleft = currDistance.left - left;
        //currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top); // Not mathematiclly correct
        currDistance = Math.sqrt(Math.pow(currleft, 2) + Math.pow(currtop, 2)); // Mathematiclly correct
        // Determinate the relative angle of the element, so whe can decide if it is at left
        
        var angle = Math.atan(currtop / currleft);
        angle = angle === 0 ? (currleft < 0 ? Math.PI : 0) : angle; 
        
        if (currDistance < prev.distance && isInRange($this.$options.leftAngleRange[0], $this.$options.leftAngleRange[1], angle)) {
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
      var $this = this; //inside the reduce callback this == window
      var next = this.elementsBefore(Infinity, top).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        // define the top and left for futher calcs
        var currtop = currDistance.top - top;
        var currleft = currDistance.left - left;
        //currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top); // Not mathematiclly correct
        currDistance = Math.sqrt(Math.pow(currleft, 2) + Math.pow(currtop, 2)); // Mathematiclly correct
        // Determinate the relative angle of the element, so whe can decide if it is at left
        var angle = Math.atan(currtop / currleft);
        angle = angle === 0 ? (currleft < 0 ? Math.PI : 0) : angle; 
        
        if (currDistance < prev.distance && isInRange($this.$options.upAngleRange[0], $this.$options.upAngleRange[1], angle)) {
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
      var left = this.$selected.position().left;// + this.$selected.width(); //this makes ignore things that are 0px after the item
      var top = this.$selected.position().top;
      var $this = this; //inside the reduce callback this == window
      var next = this.elementsAfter(left, 0).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        // define the top and left for futher calcs
        var currtop = currDistance.top - top;
        var currleft = currDistance.left - left;
        //currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top); // Not mathematiclly correct
        currDistance = Math.sqrt(Math.pow(currleft, 2) + Math.pow(currtop, 2)); // Mathematiclly correct
        // Determinate the relative angle of the element, so whe can decide if it is at left
        var angle = Math.atan(currtop / currleft);
        angle = angle === 0 ? (currleft < 0 ? Math.PI : 0) : angle; 
        
        
        if (currDistance < prev.distance && isInRange($this.$options.rightAngleRange[0], $this.$options.rightAngleRange[1], angle)) {
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
      var top = this.$selected.position().top;// + this.$selected.height(); //this makes ignore things that are 0px after the item
      var $this = this; //inside the reduce callback this == window
      var next = this.elementsAfter(0, top).reduce(function(prev, curr) {
        curr = $(curr);
        var currDistance = curr.position();
        // define the top and left for futher calcs
        var currtop = currDistance.top - top;
        var currleft = currDistance.left - left;
        //currDistance = Math.abs(left - currDistance.left) + Math.abs(top - currDistance.top); // Not mathematiclly correct
        currDistance = Math.sqrt(Math.pow(currleft, 2) + Math.pow(currtop, 2)); // Mathematiclly correct
        // Determinate the relative angle of the element, so whe can decide if it is at left
        var angle = Math.atan(currtop / currleft);
        angle = angle === 0 ? (currleft < 0 ? Math.PI : 0) : angle; 
       
        if (currDistance < prev.distance && isInRange($this.$options.downAngleRange[0], $this.$options.downAngleRange[1], angle)) {
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

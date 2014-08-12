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

  var Navigator = function(context) {
    this.context = context;
  };

  //---------//
  // Methods //
  //---------//

  Navigator.prototype.enable = function() {
    // TODO
  };

  Navigator.prototype.disable = function() {
    // TODO
  };

  Navigator.prototype.toggle = function() {
    // TODO
  };

  //--------------------------//
  // jQuery plugin definition //
  //--------------------------//

  var old = $.fn.navigator;

  $.fn.navigator = function(method) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
      var $this = $(this),
        data = $this.data('navigator');
      if (!data) {
        $this.data('navigator', (data = new Navigator($this, typeof method === 'object' && method)));
      }
      if (typeof method === 'string' && data[method]) {
        data[method].apply(data, args);
      }
    });
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

(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */


  var lifecycle = {
    setup: function() {
      this.target = $('#qunit-fixture ul').navigator();
    },
    teardown: function() {
      this.target.navigator('destroy');
    }
  };


  module('jQuery#navigator', lifecycle);

  test('is chainable', function() {
    strictEqual(this.target, this.target, 'should be chainable');
  });

  test('is instantiable', function() {
    ok(this.target.data('navigator'), 'should have an instance');
  });

  module('jQuery#navigator#left', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.left, 'The method left should exists.');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.left, 'The default value for left should exists.');
  });

  test('move the selection to the element at left', function() {
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.left;
    $(document).trigger(event);
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    ok(this.target.children().eq(0).is(selected), 'The first element should be selected when navigation has not started.');
    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The first element should remain selected if already selected.');
  });

  module('jQuery#navigator#up', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.up, 'The method up should exists.');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.up, 'The default value for up should exists.');
  });

  test('move the selection to the element at up', function() {
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.up;
    $(document).trigger(event);
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    ok(this.target.children().eq(0).is(selected), 'The first element should be selected when navigation has not started.');
    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The first element should remain selected if already selected.');
  });

  module('jQuery#navigator#right', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.right, 'The method right should exists.');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.right, 'The default value for right should exists.');
  });

  test('move the selection to the element at right', function() {
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.right;
    $(document).trigger(event);
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    ok(this.target.children().eq(0).is(selected), 'The first element should be selected when navigation has not started.');
    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The first element should remain selected if already selected.');
  });

  module('jQuery#navigator#down', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.down, 'The method down should exists.');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.down, 'The default value for down should exists.');
  });

  test('move the selection to the element at down', function() {
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.down;
    $(document).trigger(event);
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    ok(this.target.children().eq(0).is(selected), 'The first element should be selected when navigation has not started.');
    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The first element should remain selected if already selected.');
  });

}(jQuery));

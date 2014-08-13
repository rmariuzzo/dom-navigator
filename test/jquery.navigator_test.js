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

  module('jQuery#navigator("left")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.left, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.left, 'The default value for left should exist');
  });

  test('move the selection to the element at left', function() {
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;

    // Create keydown event.
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.left;

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'should select first element when navigation has not started.');

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'should remain selected if cannot navigate to left.');

    for (var x = 0; x <= 2; x++) {
      var from = 2 + (x * 3);
      this.target.navigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - y);
        $(document).trigger(event);
        ok(el.is(selected), 'should select: ' + el.text() + ', selected: ' + this.target.navigator('selected').text());
      }
    }
  });

  module('jQuery#navigator("up")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.up, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.up, 'The default value for up should exist');
  });

  test('move the selection to the element at up', function() {
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;

    // Create keydown event.
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.up;

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should remain selected if already selected.');

    for (var x = 6; x <= 8; x++) {
      var from = x;
      this.target.navigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - (y * 3));
        $(document).trigger(event);
        ok(el.is(selected), 'should select: ' + el.text() + ', selected: ' + this.target.navigator('selected').text());
      }
    }
  });

  module('jQuery#navigator("right")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.right, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.right, 'The default value for right should exist');
  });

  test('move the selection to the element at right', function() {
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;

    // Create keydown event.
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.right;

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    $(document).trigger(event);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(1).is(selected), 'The 2nd element should be selected when navigating to the right from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x * 3;
      this.target.navigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + y);
        $(document).trigger(event);
        ok(el.is(selected), 'should select: ' + el.text() + ', selected: ' + this.target.navigator('selected').text());
      }
    }
  });

  module('jQuery#navigator("down")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.down, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.navigator.Constructor.defaults.down, 'The default value for down should exist');
  });

  test('move the selection to the element at down', function() {
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;

    // Create keydown event.
    var event = $.Event('keydown');
    event.which = $.fn.navigator.Constructor.defaults.down;

    $(document).trigger(event);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    $(document).trigger(event);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(3).is(selected), 'The 4th element should be selected when navigating to the down from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x;
      this.target.navigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + (y * 3));
        $(document).trigger(event);
        ok(el.is(selected), 'should select: ' + el.text() + ', selected: ' + this.target.navigator('selected').text());
      }
    }
  });

  module('jQuery#navigator("selected")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.selected, 'should exist');
  });

  test('return expected values', function() {
    ok(this.target.navigator('selected') === null, 'should return null after initialization');
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    this.target.children().each(function(i, el) {
      el = $(el);
      el.parent().navigator('select', el);
      ok(el.is(selected), 'should select the given element');
    });
  });

  module('jQuery#navigator("select")', lifecycle);

  test('exists', function() {
    ok($.fn.navigator.Constructor.prototype.select, 'should exist');
  });

  test('select given element', function() {
    var selected = '.' + $.fn.navigator.Constructor.defaults.selected;
    this.target.children().each(function(i, el) {
      $(el).parent().navigator('select', el);
      ok($(el).is(selected), 'DOM element should be selected');
    });
    this.target.children().each(function(i, el) {
      el = $(el);
      el.parent().navigator('select', el);
      ok(el.is(selected), 'jQuery element should be selected');
    });
  });


}(jQuery));

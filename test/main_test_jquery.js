(function($) {

  var lifecycle = {
    setup: function() {
      this.target = $('#qunit-fixture ul').domNavigator();
    },
    teardown: function() {
      this.target.domNavigator('destroy');
    }
  };

  function simulateKeydown(element, which) {
    var event;

    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent('keydown', true, true);
    } else {
      event = document.createEventObject();
      event.eventType = 'keydown';
    }

    event.eventName = 'keydown';
    event.which = which;

    if (document.createEvent) {
      element.dispatchEvent(event);
    } else {
      element.fireEvent('on' + event.eventType, event);
    }
  }

  module('jQuery#domNavigator', lifecycle);

  test('is chainable', function() {
    strictEqual(this.target, this.target, 'should be chainable');
  });

  test('is instantiable', function() {
    ok(this.target[0].domNavigator, 'should have an instance');
  });

  module('jQuery#domNavigator("select")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.select, 'should exist');
  });

  test('select given element', function() {
    var selected = '.' + $.fn.domNavigator.Constructor.defaults.selected;

    this.target.children().each(function(i, el) {
      $(el).parent().domNavigator('select', el);
      ok($(el).is(selected), 'DOM element should be selected');
    });

    this.target.children().each(function(i, el) {
      el = $(el);
      el.parent().domNavigator('select', el);
      ok(el.is(selected), 'jQuery element should be selected');
    });
  });

  module('jQuery#domNavigator("selected")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.selected, 'should exist');
  });

  test('return expected values', function() {
    ok(this.target.domNavigator('selected') === null, 'should return null after initialization');

    this.target.children().each(function(i, el) {
      el = $(el);
      el.parent().domNavigator('select', el);
      ok(el.is(el.parent().domNavigator('selected')), 'should select the given element');
    });
  });

  module('jQuery#domNavigator("left")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.left, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.domNavigator.Constructor.defaults.left, 'The default value for left should exist');
  });

  test('move the selection to the element at left', function() {
    var selected = '.' + $.fn.domNavigator.Constructor.defaults.selected;

    // Create keydown event.
    var left = $.fn.domNavigator.Constructor.defaults.left;

    simulateKeydown(document, left);
    ok(this.target.children().eq(0).is(selected), 'should select first element when navigation has not started.');

    simulateKeydown(document, left);
    ok(this.target.children().eq(0).is(selected), 'should remain selected if cannot navigate to left.');

    for (var x = 0; x <= 2; x++) {
      var from = 2 + (x * 3);
      this.target.domNavigator('select', this.target.children().get(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - y);
        simulateKeydown(document, left);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
      }
    }
  });

  module('jQuery#domNavigator("up")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.up, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.domNavigator.Constructor.defaults.up, 'The default value for up should exist');
  });

  test('move the selection to the element at up', function() {
    var selected = '.' + $.fn.domNavigator.Constructor.defaults.selected;

    // Create keydown event.
    var up = $.fn.domNavigator.Constructor.defaults.up;

    simulateKeydown(document, up);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, up);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should remain selected if already selected.');

    for (var x = 6; x <= 8; x++) {
      var from = x;
      this.target.domNavigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - (y * 3));
        simulateKeydown(document, up);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
      }
    }
  });

  module('jQuery#domNavigator("right")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.right, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.domNavigator.Constructor.defaults.right, 'The default value for right should exist');
  });

  test('move the selection to the element at right', function() {
    var selected = '.' + $.fn.domNavigator.Constructor.defaults.selected;

    // Create keydown event.
    var right = $.fn.domNavigator.Constructor.defaults.right;

    simulateKeydown(document, right);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, right);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(1).is(selected), 'The 2nd element should be selected when navigating to the right from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x * 3;
      this.target.domNavigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + y);
        simulateKeydown(document, right);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
      }
    }
  });

  module('jQuery#domNavigator("down")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.down, 'should exist');
  });

  test('has a default value', function() {
    ok($.fn.domNavigator.Constructor.defaults.down, 'The default value for down should exist');
  });

  test('move the selection to the element at down', function() {
    var selected = '.' + $.fn.domNavigator.Constructor.defaults.selected;

    // Create keydown event.
    var down = $.fn.domNavigator.Constructor.defaults.down;

    simulateKeydown(document, down);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, down);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(3).is(selected), 'The 4th element should be selected when navigating to the down from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x;
      this.target.domNavigator('select', this.target.children().eq(from));
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + (y * 3));
        simulateKeydown(document, down);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
      }
    }
  });

  module('jQuery#domNavigator("destroy")', lifecycle);

  test('exists', function() {
    ok($.fn.domNavigator.Constructor.prototype.destroy, 'should exist');
  });

  test('destroy instance attached to DOM', function() {
    this.target.domNavigator('destroy');
    ok(!this.target[0].domNavigator, 'should not have any instance attached: ' + this.target[0].domNavigator);
  });

}(jQuery));

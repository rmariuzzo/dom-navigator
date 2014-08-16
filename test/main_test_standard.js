(function($) {

  var lifecycle = {
    setup: function() {
      this.target = $(document.querySelector('#qunit-fixture ul'));
      this.domNavigator = new DomNavigator(this.target[0]);
    },
    teardown: function() {
      this.domNavigator.destroy();
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

  module('DomNavigator', lifecycle);

  test('exists', function() {
    ok(DomNavigator, 'should exists');
  });

  module('DomNavigator.select()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.select, 'should exist');
  });

  test('select given element', function() {
    var selected = '.' + DomNavigator.defaults.selected;
    var domNavigator = this.domNavigator;

    this.target.children().each(function(i, el) {
      domNavigator.select(el);
      ok($(el).is(selected), 'DOM element should be selected');
    });

    this.target.children().each(function(i, el) {
      domNavigator.select(el);
      ok($(el).is(selected), 'jQuery element should be selected');
    });
  });

  module('DomNavigator.selected()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.selected, 'should exist');
  });

  test('return expected values', function() {
    var domNavigator = this.domNavigator;

    ok(this.domNavigator.selected() === null, 'should return null after initialization');

    this.target.children().each(function(i, el) {
      domNavigator.select(el);
      ok(domNavigator.selected() === el, 'should select the given element');
    });
  });

  module('DomNavigator.inContainerViewport()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.inContainerViewport, 'should exist');
  });

  // TODO more test needed.

  module('DomNavigator.left()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.left, 'should exist');
  });

  test('has a default value', function() {
    ok(DomNavigator.defaults.left, 'should have a default value: ' + DomNavigator.defaults.left);
  });

  test('move the selection to the element at left', function() {
    var selected = '.' + DomNavigator.defaults.selected;

    // Create keydown event.
    var left = DomNavigator.defaults.left;

    simulateKeydown(document, left);
    ok(this.target.children().eq(0).is(selected), 'should select first element when navigation has not started.');

    simulateKeydown(document, left);
    ok(this.target.children().eq(0).is(selected), 'should remain selected if cannot navigate to left.');

    for (var x = 0; x <= 2; x++) {
      var from = 2 + (x * 3);
      this.domNavigator.select(this.target.children()[from]);
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - y);
        simulateKeydown(document, left);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
      }
    }
  });

  module('DomNavigator.up()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.up, 'should exist');
  });

  test('has a default value', function() {
    ok(DomNavigator.defaults.up, 'The default value for up should exist');
  });

  test('move the selection to the element at up', function() {
    var selected = '.' + DomNavigator.defaults.selected;

    // Create keydown event.
    var up = DomNavigator.defaults.up;

    simulateKeydown(document, up);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, up);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should remain selected if already selected.');

    for (var x = 6; x <= 8; x++) {
      var from = x;
      this.domNavigator.select(this.target.children()[from]);
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from - (y * 3));
        simulateKeydown(document, up);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
      }
    }
  });

  module('DomNavigator.right()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.right, 'should exist');
  });

  test('has a default value', function() {
    ok(DomNavigator.defaults.right, 'The default value for right should exist');
  });

  test('move the selection to the element at right', function() {
    var selected = '.' + DomNavigator.defaults.selected;

    // Create keydown event.
    var right = DomNavigator.defaults.right;

    simulateKeydown(document, right);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, right);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(1).is(selected), 'The 2nd element should be selected when navigating to the right from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x * 3;
      this.domNavigator.select(this.target.children()[from]);
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + y);
        simulateKeydown(document, right);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
      }
    }
  });

  module('DomNavigator.down()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.down, 'should exist');
  });

  test('has a default value', function() {
    ok(DomNavigator.defaults.down, 'The default value for down should exist');
  });

  test('move the selection to the element at down', function() {
    var selected = '.' + DomNavigator.defaults.selected;

    // Create keydown event.
    var down = DomNavigator.defaults.down;

    simulateKeydown(document, down);
    ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeydown(document, down);
    ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    ok(this.target.children().eq(3).is(selected), 'The 4th element should be selected when navigating to the down from 1st element.');

    for (var x = 0; x <= 2; x++) {
      var from = x;
      this.domNavigator.select(this.target.children()[from]);
      for (var y = 1; y <= 2; y++) {
        var el = this.target.children().eq(from + (y * 3));
        simulateKeydown(document, down);
        ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
      }
    }
  });

  module('DomNavigator.destroy()', lifecycle);

  test('exists', function() {
    ok(DomNavigator.prototype.destroy, 'should exist');
  });

}(jQuery));

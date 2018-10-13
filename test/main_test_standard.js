QUnit.start();

var lifecycle = {
    beforeEach: function () {
        this.selector = '#qunit-fixture ul';
        this.target = $(document.querySelector(this.selector));
        this.domNavigator = new window.DomNavigator(this.target[0]);
    },
    afterEach: function () {
        this.domNavigator.destroy();
    }
};

/**
 * Simulate a key down event over an element.
 *
 * @param {Object} element The DOM element.
 * @param {Object} which
 */
function simulateKeyDown(element, which) {
    var event;

    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
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

QUnit.module('DomNavigator', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator, 'should exists');
});

QUnit.test('supports query selector', function (assert) {
    var domNavigatorByQuerySelector = new window.DomNavigator(this.selector);
    var domNavigatorByElement = new window.DomNavigator(document.querySelector(this.selector));

    assert.ok(domNavigatorByElement.$container.isSameNode(domNavigatorByQuerySelector.$container), 'should be the same element');
});

QUnit.module('DomNavigator.select()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.select, 'should exist');
});

QUnit.test('select given element', function (assert) {
    var selected = '.' + DomNavigator.DEFAULTS.selected;
    var domNavigator = this.domNavigator;

    this.target.children().each(function (i, el) {
        domNavigator.select(el);
        assert.ok($(el).is(selected), 'DOM element should be selected');
    });

    this.target.children().each(function (i, el) {
        domNavigator.select(el);
        assert.ok($(el).is(selected), 'jQuery element should be selected');
    });
});

QUnit.module('DomNavigator.selected()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.selected, 'should exist');
});

QUnit.test('return expected values', function (assert) {
    var domNavigator = this.domNavigator;

    assert.ok(this.domNavigator.selected() === null, 'should return null after initialization');

    this.target.children().each(function (i, el) {
        domNavigator.select(el);
        assert.ok(domNavigator.selected() === el, 'should select the given element');
    });
});

QUnit.module('DomNavigator.inContainerViewport()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.inContainerViewport, 'should exist');
});

QUnit.test('should return expected values', function (assert) {
    var domNavigator = this.domNavigator;
    var contTop = this.target[0].offsetTop;
    var contBottom = contTop + this.target[0].offsetHeight;
    var contScroll = this.target[0].scrollTop;

    this.target.children().each(function (i, el) {
        var elTop = el.offsetTop;
        var elBottom = elTop + el.offsetHeight;
        var expected = elTop - contScroll >= contTop;

        expected = expected && elBottom - contScroll <= contBottom;
        assert.ok(domNavigator.inContainerViewport(el) === expected, 'should return: ' + expected + ' for element: ' + el.textContent);
    });
});

QUnit.module('DomNavigator.left()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.left, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.left, 'should have a default value: ' + DomNavigator.DEFAULTS.left);
});

QUnit.test('move the selection to the element at left', function (assert) {
    var selected = '.' + DomNavigator.DEFAULTS.selected;

    // Create keydown event.
    var left = DomNavigator.DEFAULTS.left;

    simulateKeyDown(document, left);
    assert.ok(this.target.children().eq(0).is(selected), 'should select first element when navigation has not started.');

    simulateKeyDown(document, left);
    assert.ok(this.target.children().eq(0).is(selected), 'should remain selected if cannot navigate to left.');

    for (var x = 0; x <= 2; x++) {
        var from = 2 + (x * 3);
        this.domNavigator.select(this.target.children()[from]);
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from - y);
            simulateKeyDown(document, left);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
        }
    }
});

QUnit.module('DomNavigator.up()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.up, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.up, 'The default value for up should exist');
});

QUnit.test('move the selection to the element at up', function (assert) {
    var selected = '.' + DomNavigator.DEFAULTS.selected;

    // Create keydown event.
    var up = DomNavigator.DEFAULTS.up;

    simulateKeyDown(document, up);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, up);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should remain selected if already selected.');

    for (var x = 6; x <= 8; x++) {
        var from = x;
        this.domNavigator.select(this.target.children()[from]);
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from - (y * 3));
            simulateKeyDown(document, up);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
        }
    }
});

QUnit.module('DomNavigator.right()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.right, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.right, 'The default value for right should exist');
});

QUnit.test('move the selection to the element at right', function (assert) {
    var selected = '.' + DomNavigator.DEFAULTS.selected;

    // Create keydown event.
    var right = DomNavigator.DEFAULTS.right;

    simulateKeyDown(document, right);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, right);
    assert.ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    assert.ok(this.target.children().eq(1).is(selected), 'The 2nd element should be selected when navigating to the right from 1st element.');

    for (var x = 0; x <= 2; x++) {
        var from = x * 3;
        this.domNavigator.select(this.target.children()[from]);
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from + y);
            simulateKeyDown(document, right);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
        }
    }
});

QUnit.module('DomNavigator.down()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.down, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.down, 'The default value for down should exist');
});

QUnit.test('move the selection to the element at down', function (assert) {
    var selected = '.' + DomNavigator.DEFAULTS.selected;

    // Create key down event.
    var down = DomNavigator.DEFAULTS.down;

    simulateKeyDown(document, down);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, down);
    assert.ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    assert.ok(this.target.children().eq(3).is(selected), 'The 4th element should be selected when navigating to the down from 1st element.');

    for (var x = 0; x <= 2; x++) {
        var from = x;
        this.domNavigator.select(this.target.children()[from]);
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from + (y * 3));
            simulateKeyDown(document, down);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.domNavigator.selected().textContent);
        }
    }
});

QUnit.module('DomNavigator.destroy()', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok(DomNavigator.prototype.destroy, 'should exist');
});

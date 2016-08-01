var lifecycle = {
    beforeEach: function () {
        this.target = $('#qunit-fixture').find('ul').domNavigator();
    },
    afterEach: function () {
        this.target.domNavigator('destroy');
    }
};

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

QUnit.module('jQuery#domNavigator', lifecycle);

QUnit.test('is chainable', function (assert) {
    assert.strictEqual(this.target, this.target, 'should be chainable');
});

QUnit.test('is instantiable', function (assert) {
    assert.ok(this.target[0].domNavigator, 'should have an instance');
});

QUnit.module('jQuery#domNavigator("select")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.select, 'should exist');
});

QUnit.test('select given element', function (assert) {
    var selected = '.selected';

    this.target.children().each(function (i, el) {
        $(el).parent().domNavigator('select', el);
        assert.ok($(el).is(selected), 'DOM element should be selected');
    });

    this.target.children().each(function (i, el) {
        el = $(el);
        el.parent().domNavigator('select', el);
        assert.ok(el.is(selected), 'jQuery element should be selected');
    });
});

QUnit.module('jQuery#domNavigator("selected")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.selected, 'should exist');
});

QUnit.test('return expected values', function (assert) {
    assert.ok(this.target.domNavigator('selected') === null, 'should return null after initialization');

    this.target.children().each(function (i, el) {
        el = $(el);
        el.parent().domNavigator('select', el);
        assert.ok(el.is(el.parent().domNavigator('selected')), 'should select the given element');
    });
});

QUnit.module('jQuery#domNavigator("inContainerViewport", ...)', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.inContainerViewport, 'should exist');
});

QUnit.test('should return expected values', function (assert) {
    var target = this.target;
    var contTop = this.target.position().top;
    var contBottom = contTop + this.target.height();
    var contScroll = this.target.scrollTop();

    this.target.children().each(function (i, el) {
        el = $(el);
        var elTop = el.position().top;
        var elBottom = elTop + el.height();
        var expected = elTop - contScroll >= contTop;

        expected = expected && elBottom - contScroll <= contBottom;
        assert.ok(target.domNavigator("inContainerViewport", el) === expected, 'should return: ' + expected + ' for element: ' + el.text());
    });
});

QUnit.module('jQuery#domNavigator("left")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.left, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.left, 'The default value for left should exist');
});

QUnit.test('move the selection to the element at left', function (assert) {
    var selected = '.selected';

    // Create keydown event.
    var left = DomNavigator.DEFAULTS.left;

    simulateKeyDown(document, left);
    assert.ok(this.target.children().eq(0).is(selected), 'should select first element when navigation has not started.');

    simulateKeyDown(document, left);
    assert.ok(this.target.children().eq(0).is(selected), 'should remain selected if cannot navigate to left.');

    for (var x = 0; x <= 2; x++) {
        var from = 2 + (x * 3);
        this.target.domNavigator('select', this.target.children().get(from));
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from - y);
            simulateKeyDown(document, left);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
        }
    }
});

QUnit.module('jQuery#domNavigator("up")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.up, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.up, 'The default value for up should exist');
});

QUnit.test('move the selection to the element at up', function (assert) {
    var selected = '.selected';

    // Create keydown event.
    var up = DomNavigator.DEFAULTS.up;

    simulateKeyDown(document, up);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, up);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should remain selected if already selected.');

    for (var x = 6; x <= 8; x++) {
        var from = x;
        this.target.domNavigator('select', this.target.children().eq(from));
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from - (y * 3));
            simulateKeyDown(document, up);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
        }
    }
});

QUnit.module('jQuery#domNavigator("right")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.right, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.right, 'The default value for right should exist');
});

QUnit.test('move the selection to the element at right', function (assert) {
    var selected = '.selected';

    // Create keydown event.
    var right = DomNavigator.DEFAULTS.right;

    simulateKeyDown(document, right);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, right);
    assert.ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    assert.ok(this.target.children().eq(1).is(selected), 'The 2nd element should be selected when navigating to the right from 1st element.');

    for (var x = 0; x <= 2; x++) {
        var from = x * 3;
        this.target.domNavigator('select', this.target.children().eq(from));
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from + y);
            simulateKeyDown(document, right);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
        }
    }
});

QUnit.module('jQuery#domNavigator("down")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.down, 'should exist');
});

QUnit.test('has a default value', function (assert) {
    assert.ok(DomNavigator.DEFAULTS.down, 'The default value for down should exist');
});

QUnit.test('move the selection to the element at down', function (assert) {
    var selected = '.selected';

    // Create keydown event.
    var down = DomNavigator.DEFAULTS.down;

    simulateKeyDown(document, down);
    assert.ok(this.target.children().eq(0).is(selected), 'The 1st element should be selected when navigation has not started.');

    simulateKeyDown(document, down);
    assert.ok(!this.target.children().eq(0).is(selected), 'The 1st element should not remain selected if already selected.');
    assert.ok(this.target.children().eq(3).is(selected), 'The 4th element should be selected when navigating to the down from 1st element.');

    for (var x = 0; x <= 2; x++) {
        var from = x;
        this.target.domNavigator('select', this.target.children().eq(from));
        for (var y = 1; y <= 2; y++) {
            var el = this.target.children().eq(from + (y * 3));
            simulateKeyDown(document, down);
            assert.ok(el.is(selected), 'should select: ' + el.textContent + ', selected: ' + this.target.domNavigator('selected').textContent);
        }
    }
});

QUnit.module('jQuery#domNavigator("destroy")', lifecycle);

QUnit.test('exists', function (assert) {
    assert.ok($.fn.domNavigator.Constructor.prototype.destroy, 'should exist');
});

QUnit.test('destroy instance attached to DOM', function (assert) {
    this.target.domNavigator('destroy');
    assert.ok(!this.target[0].domNavigator, 'should not have any instance attached: ' + this.target[0].domNavigator);
});


DOM Navigator
=============

> Library that allow keyboard navigation through DOM elements (←↑→↓).

Installation
------------

Using bower:

```sh
bower install dom-navigator --save
```

Using NPM:

```sh
npm install dom-navigator --save
```

Usage
=====

Vanilla JavaScript:

```js
var el = document.querySelector('#grid');
new DomNavigator(el);
```

If jQuery is included you can use the library as a jQuery plugin:

```js
var el = $('#grid');
el.domNavigator();
```


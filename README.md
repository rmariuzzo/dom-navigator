# DOM Navigator

> Library that allow keyboard navigation through DOM elements (←↑→↓).

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rmariuzzo/dom-navigator)

## Installation

#### Bower

```sh
bower install dom-navigator --save
```

#### NPM

```sh
npm install dom-navigator --save
```

#### Manual

 1. [Download the latest release](https://github.com/rmariuzzo/dom-navigator/releases).
 2. Then include `dom-navigator-###.min.js` into your HTML page.

## Usage

#### Pure JavaScript

```js
var el = document.querySelector('#grid');
new DomNavigator(el);
```

#### jQuery

If jQuery is included you can use the library as a jQuery plugin:

```js
var el = $('#grid');
el.domNavigator();
```

## Want to contribute?

All help are more than welcome!

#### Pre-requisites

 - [Node.js](http://nodejs.org/).
 - [Grunt](http://gruntjs.com/).

#### Development Workflow

 1. **[Fork](https://github.com/rmariuzzo/dom-navigator/fork)** this respository.
 2. **Clone** your fork and create a feature branch from develop.

        git clone git@github.com:<your-username>/dom-navigator.git
        git fetch origin
        git checkout develop
        git checkout -b feature-<super-power>

 3. **Install** development dependencies.

        npm install
        bower install

 4. **Code** and be happy!
 5. **Test** your code using QUnit `grunt test`.
 6. Submit a **pull request** and grab popcorn.

### Credits

**dom-navigator** was created by [Rubens Mariuzzo](http://github.com/rmariuzzo) with all the love in the world.

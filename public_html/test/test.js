/**
 * test
 * @module MultiMethodJS
 * @version 1.0
 * @copyright (c) 2014 xianrenb at gmail dot com
 * @license http://opensource.org/licenses/MIT
 */
/*jslint nomen: true, plusplus: true, vars: true, browser: true */
/*global collide: false, collide2: false, create_prototype: false, equal: false, invoke: false, ok: false, module: false, multi_method: false, myns: false, test: false */
/*properties
    call, collide, collide2, constructor, isPrototypeOf, message, myns, myns2,
    name, point, prototype, toString
*/
(function (global) {
    'use strict';
    module('MultiMethodJS Test');

    test('Testing create_prototype()', function () {
        var instance, Obj1, Obj2;

        Obj1 = function () {
            return this;
        };

        Obj1.prototype = {};

        Obj2 = function () {
            Obj1.call(this);
            return this;
        };

        Obj2.prototype = create_prototype(Obj1.prototype);
        Obj2.prototype.constructor = Obj2;
        instance = new Obj2();
        ok(Obj1.prototype.isPrototypeOf(instance));
    });

    test('Testing multi_method(): parameter type check', function () {
        var error, error_message, error_name;

        try {
            multi_method(null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"name" should be a string.');
        equal(error_name, 'TypeError');

        try {
            multi_method('dummy', null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"arg_type_array" should be an array.');
        equal(error_name, 'TypeError');

        try {
            multi_method('dummy', [], null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"method_body" should be a function.');
        equal(error_name, 'TypeError');
    });

    test('Testing multi_method(): normal use', function () {
        var a, collide_message, error, error_message, error_name, g, s, score;

        function Asteroid() {
            this.point = 1;
        }

        function Spaceship() {
            this.point = 10;
        }

        function GiantSpaceship() {
            // Spaceship.call(this);
            this.point = 100;
        }

        GiantSpaceship.prototype = create_prototype(Spaceship.prototype);

        multi_method('collide', [Asteroid, Spaceship], function (a, b) {
            collide_message = 'Behavior when asteroid hits spaceship';
            return a.point + b.point;
        });

        multi_method('collide', [Spaceship, Spaceship], function (a, b) {
            collide_message = 'Behavior when spaceship hits spaceship';
            return a.point + b.point;
        });

        multi_method('collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'To be redefined';
            return a.point + b.point;
        });

        multi_method('collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'Behavior when spaceship hits asteroid';
            return a.point + b.point;
        });

        multi_method('collide', [Asteroid, Asteroid], function (a, b) {
            collide_message = 'Behavior when asteroid hits asteroid';
            return a.point + b.point;
        });

        multi_method('collide', [GiantSpaceship, GiantSpaceship], function (a, b) {
            collide_message = 'Behavior when giant spaceship hits giant spaceship';
            return a.point + b.point;
        });

        a = new Asteroid();
        s = new Spaceship();
        g = new GiantSpaceship();
        score = 0;
        score += collide(a, s);
        equal(collide_message, 'Behavior when asteroid hits spaceship');
        equal(score, 11);
        score += collide(s, s);
        equal(collide_message, 'Behavior when spaceship hits spaceship');
        equal(score, 31);
        score += collide(s, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 42);
        score += collide(a, a);
        equal(collide_message, 'Behavior when asteroid hits asteroid');
        equal(score, 44);
        score += collide(g, g);
        equal(collide_message, 'Behavior when giant spaceship hits giant spaceship');
        equal(score, 244);
        score += collide(g, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 345);

        try {
            collide();
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');

        try {
            collide(a, s, g);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');
        delete global.collide;
    });

    test('Testing multi_method(): normal use with namespace part 1', function () {
        var a, collide_message, error, error_message, error_name, g, s, score;

        function Asteroid() {
            this.point = 1;
        }

        function Spaceship() {
            this.point = 10;
        }

        function GiantSpaceship() {
            // Spaceship.call(this);
            this.point = 100;
        }

        GiantSpaceship.prototype = create_prototype(Spaceship.prototype);

        multi_method('myns.collide', [Asteroid, Spaceship], function (a, b) {
            collide_message = 'Behavior when asteroid hits spaceship';
            return a.point + b.point;
        });

        multi_method('myns.collide', [Spaceship, Spaceship], function (a, b) {
            collide_message = 'Behavior when spaceship hits spaceship';
            return a.point + b.point;
        });

        multi_method('myns.collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'To be redefined';
            return a.point + b.point;
        });

        multi_method('myns.collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'Behavior when spaceship hits asteroid';
            return a.point + b.point;
        });

        multi_method('myns.collide', [Asteroid, Asteroid], function (a, b) {
            collide_message = 'Behavior when asteroid hits asteroid';
            return a.point + b.point;
        });

        multi_method('myns.collide', [GiantSpaceship, GiantSpaceship], function (a, b) {
            collide_message = 'Behavior when giant spaceship hits giant spaceship';
            return a.point + b.point;
        });

        a = new Asteroid();
        s = new Spaceship();
        g = new GiantSpaceship();
        score = 0;
        score += myns.collide(a, s);
        equal(collide_message, 'Behavior when asteroid hits spaceship');
        equal(score, 11);
        score += myns.collide(s, s);
        equal(collide_message, 'Behavior when spaceship hits spaceship');
        equal(score, 31);
        score += myns.collide(s, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 42);
        score += myns.collide(a, a);
        equal(collide_message, 'Behavior when asteroid hits asteroid');
        equal(score, 44);
        score += myns.collide(g, g);
        equal(collide_message, 'Behavior when giant spaceship hits giant spaceship');
        equal(score, 244);
        score += myns.collide(g, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 345);

        try {
            myns.collide();
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');

        try {
            myns.collide(a, s, g);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');
        delete global.myns.collide;
        delete global.myns;
    });

    test('Testing multi_method(): normal use with namespace part 2', function () {
        var a, collide_message, error, error_message, error_name, g, s, score;

        function Asteroid() {
            this.point = 1;
        }

        function Spaceship() {
            this.point = 10;
        }

        function GiantSpaceship() {
            // Spaceship.call(this);
            this.point = 100;
        }

        GiantSpaceship.prototype = create_prototype(Spaceship.prototype);

        multi_method('myns.myns2.collide', [Asteroid, Spaceship], function (a, b) {
            collide_message = 'Behavior when asteroid hits spaceship';
            return a.point + b.point;
        });

        multi_method('myns.myns2.collide', [Spaceship, Spaceship], function (a, b) {
            collide_message = 'Behavior when spaceship hits spaceship';
            return a.point + b.point;
        });

        multi_method('myns.myns2.collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'To be redefined';
            return a.point + b.point;
        });

        multi_method('myns.myns2.collide', [Spaceship, Asteroid], function (a, b) {
            collide_message = 'Behavior when spaceship hits asteroid';
            return a.point + b.point;
        });

        multi_method('myns.myns2.collide', [Asteroid, Asteroid], function (a, b) {
            collide_message = 'Behavior when asteroid hits asteroid';
            return a.point + b.point;
        });

        multi_method('myns.myns2.collide', [GiantSpaceship, GiantSpaceship], function (a, b) {
            collide_message = 'Behavior when giant spaceship hits giant spaceship';
            return a.point + b.point;
        });

        a = new Asteroid();
        s = new Spaceship();
        g = new GiantSpaceship();
        score = 0;
        score += myns.myns2.collide(a, s);
        equal(collide_message, 'Behavior when asteroid hits spaceship');
        equal(score, 11);
        score += myns.myns2.collide(s, s);
        equal(collide_message, 'Behavior when spaceship hits spaceship');
        equal(score, 31);
        score += myns.myns2.collide(s, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 42);
        score += myns.myns2.collide(a, a);
        equal(collide_message, 'Behavior when asteroid hits asteroid');
        equal(score, 44);
        score += myns.myns2.collide(g, g);
        equal(collide_message, 'Behavior when giant spaceship hits giant spaceship');
        equal(score, 244);
        score += myns.myns2.collide(g, a);
        equal(collide_message, 'Behavior when spaceship hits asteroid');
        equal(score, 345);

        try {
            myns.myns2.collide();
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');

        try {
            myns.myns2.collide(a, s, g);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');
        delete global.myns.myns2.collide;
        delete global.myns.myns2;
        delete global.myns;
    });

    test('Testing multi_method(): normal use with type specified by typeof operator', function () {
        var collide_message, score;

        multi_method('collide', ['string', 'undefined'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        multi_method('collide', ['string', 'object'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        multi_method('collide', ['string', 'boolean'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        multi_method('collide', ['string', 'number'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        multi_method('collide', ['string', 'string'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        multi_method('collide', ['string', 'function'], function (a, b) {
            collide_message = 'Behavior when ' + a.toString() + ' hits ' + typeof b;
            return 1;
        });

        score = 0;
        score += collide('apple', undefined);
        equal(score, 1);
        equal(collide_message, 'Behavior when apple hits undefined');
        score += collide('apple', {});
        equal(score, 2);
        equal(collide_message, 'Behavior when apple hits object');
        score += collide('apple', true);
        equal(score, 3);
        equal(collide_message, 'Behavior when apple hits boolean');
        score += collide('apple', 1);
        equal(score, 4);
        equal(collide_message, 'Behavior when apple hits number');
        score += collide('apple', 'orange');
        equal(score, 5);
        equal(collide_message, 'Behavior when apple hits string');

        score += collide('apple', function () {
            return this;
        });

        equal(score, 6);
        equal(collide_message, 'Behavior when apple hits function');
        delete global.collide;
    });

    test('Testing invoke(): parameter type check', function () {
        var error, error_message, error_name;

        try {
            invoke(null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"name" should be a string.');
        equal(error_name, 'TypeError');

        try {
            invoke('dummy', null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"arg_type_array" should be an array.');
        equal(error_name, 'TypeError');

        try {
            invoke('dummy', [], null);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, '"arg_array" should be an array.');
        equal(error_name, 'TypeError');
    });

    test('Testing invoke(): normal use', function () {
        var a, collide_message, error, error_message, error_name, s, score;

        function Asteroid() {
            this.point = 1;
        }

        function Spaceship() {
            this.point = 10;
        }

        multi_method('collide2', [Asteroid, Spaceship], function (a, b) {
            collide_message = 'Behavior when asteroid hits spaceship';
            return a.point + b.point;
        });

        multi_method('collide2', ['object', 'object'], function (a, b) {
            collide_message = 'Behavior when ' + typeof a + ' hits ' + typeof b;
            return 0;
        });

        a = new Asteroid();
        s = new Spaceship();
        score = 0;
        score += collide2(a, s);
        equal(score, 0);
        equal(collide_message, 'Behavior when object hits object');
        score += invoke('collide2', [Asteroid, Spaceship], [a, s]);
        equal(score, 11);
        equal(collide_message, 'Behavior when asteroid hits spaceship');

        try {
            score += invoke('collide2', ['string', 'string'], [a, s]);
            error = false;
            error_message = '';
            error_name = '';
        } catch (e) {
            error = true;
            error_message = e.message.toString();
            error_name = e.name.toString();
        }

        equal(error, true);
        equal(error_message, 'No matching method.');
        equal(error_name, 'ReferenceError');
        delete global.collide2;
    });
}(this));

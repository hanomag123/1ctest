(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * FingerprintJS v3.0.3 - Copyright (c) FingerprintJS, Inc, 2020 (https://fingerprintjs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * This software contains code from open-source projects:
 * MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');

/*
 * Taken from https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
 */
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// added together as a 64bit int (as an array of two 32bit ints).
//
function x64Add(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// multiplied together as a 64bit int (as an array of two 32bit ints).
//
function x64Multiply(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
}
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) rotated left by that number of positions.
//
function x64Rotl(m, n) {
    n %= 64;
    if (n === 32) {
        return [m[1], m[0]];
    }
    else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
    }
    else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
    }
}
//
// Given a 64bit int (as an array of two 32bit ints) and an int
// representing a number of bit positions, returns the 64bit int (as an
// array of two 32bit ints) shifted left by that number of positions.
//
function x64LeftShift(m, n) {
    n %= 64;
    if (n === 0) {
        return m;
    }
    else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    }
    else {
        return [m[1] << (n - 32), 0];
    }
}
//
// Given two 64bit ints (as an array of two 32bit ints) returns the two
// xored together as a 64bit int (as an array of two 32bit ints).
//
function x64Xor(m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
}
//
// Given a block, returns murmurHash3's final x64 mix of that block.
// (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
// only place where we need to right shift 64bit ints.)
//
function x64Fmix(h) {
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    return h;
}
//
// Given a string and an optional seed as an int, returns a 128 bit
// hash using the x64 flavor of MurmurHash3, as an unsigned hex.
//
function x64hash128(key, seed) {
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    var i;
    for (i = 0; i < bytes; i = i + 16) {
        k1 = [
            (key.charCodeAt(i + 4) & 0xff) |
                ((key.charCodeAt(i + 5) & 0xff) << 8) |
                ((key.charCodeAt(i + 6) & 0xff) << 16) |
                ((key.charCodeAt(i + 7) & 0xff) << 24),
            (key.charCodeAt(i) & 0xff) |
                ((key.charCodeAt(i + 1) & 0xff) << 8) |
                ((key.charCodeAt(i + 2) & 0xff) << 16) |
                ((key.charCodeAt(i + 3) & 0xff) << 24),
        ];
        k2 = [
            (key.charCodeAt(i + 12) & 0xff) |
                ((key.charCodeAt(i + 13) & 0xff) << 8) |
                ((key.charCodeAt(i + 14) & 0xff) << 16) |
                ((key.charCodeAt(i + 15) & 0xff) << 24),
            (key.charCodeAt(i + 8) & 0xff) |
                ((key.charCodeAt(i + 9) & 0xff) << 8) |
                ((key.charCodeAt(i + 10) & 0xff) << 16) |
                ((key.charCodeAt(i + 11) & 0xff) << 24),
        ];
        k1 = x64Multiply(k1, c1);
        k1 = x64Rotl(k1, 31);
        k1 = x64Multiply(k1, c2);
        h1 = x64Xor(h1, k1);
        h1 = x64Rotl(h1, 27);
        h1 = x64Add(h1, h2);
        h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = x64Multiply(k2, c2);
        k2 = x64Rotl(k2, 33);
        k2 = x64Multiply(k2, c1);
        h2 = x64Xor(h2, k2);
        h2 = x64Rotl(h2, 31);
        h2 = x64Add(h2, h1);
        h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
        case 15:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        // fallthrough
        case 14:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        // fallthrough
        case 13:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        // fallthrough
        case 12:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        // fallthrough
        case 11:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        // fallthrough
        case 10:
            k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        // fallthrough
        case 9:
            k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
            k2 = x64Multiply(k2, c2);
            k2 = x64Rotl(k2, 33);
            k2 = x64Multiply(k2, c1);
            h2 = x64Xor(h2, k2);
        // fallthrough
        case 8:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        // fallthrough
        case 7:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        // fallthrough
        case 6:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        // fallthrough
        case 5:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        // fallthrough
        case 4:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        // fallthrough
        case 3:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        // fallthrough
        case 2:
            k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        // fallthrough
        case 1:
            k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
            k1 = x64Multiply(k1, c1);
            k1 = x64Rotl(k1, 31);
            k1 = x64Multiply(k1, c2);
            h1 = x64Xor(h1, k1);
        // fallthrough
    }
    h1 = x64Xor(h1, [0, key.length]);
    h2 = x64Xor(h2, [0, key.length]);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    h1 = x64Fmix(h1);
    h2 = x64Fmix(h2);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    return (('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8));
}

var version = "3.0.3";

var w = window;
function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
    if (deadlineTimeout === void 0) { deadlineTimeout = Infinity; }
    return new Promise(function (resolve) {
        if (w.requestIdleCallback) {
            w.requestIdleCallback(function () { return resolve(); }, { timeout: deadlineTimeout });
        }
        else {
            setTimeout(resolve, Math.min(fallbackTimeout, deadlineTimeout));
        }
    });
}

/**
 * Converts an error object to a plain object that can be used with `JSON.stringify`.
 * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
 */
function errorToObject(error) {
    var _a;
    return tslib.__assign({ name: error.name, message: error.message, stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n') }, error);
}

/*
 * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
 */
/**
 * Does the same as Array.prototype.includes but has better typing
 */
function includes(haystack, needle) {
    for (var i = 0, l = haystack.length; i < l; ++i) {
        if (haystack[i] === needle) {
            return true;
        }
    }
    return false;
}
/**
 * Like `!includes()` but with proper typing
 */
function excludes(haystack, needle) {
    return !includes(haystack, needle);
}
/**
 * Be careful, NaN can return
 */
function toInt(value) {
    return parseInt(value);
}
/**
 * Be careful, NaN can return
 */
function toFloat(value) {
    return parseFloat(value);
}
function replaceNaN(value, replacement) {
    return typeof value === 'number' && isNaN(value) ? replacement : value;
}
function countTruthy(values) {
    return values.reduce(function (sum, value) { return sum + (value ? 1 : 0); }, 0);
}

/*
 * Functions to help with features that vary through browsers
 */
var w$1 = window;
var n = navigator;
var d = document;
/**
 * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isTrident() {
    // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
    return (countTruthy([
        'MSCSSMatrix' in w$1,
        'msSetImmediate' in w$1,
        'msIndexedDB' in w$1,
        'msMaxTouchPoints' in n,
        'msPointerEnabled' in n,
    ]) >= 4);
}
/**
 * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isEdgeHTML() {
    // Based on research in October 2020
    return (countTruthy(['msWriteProfilerMark' in w$1, 'MSStream' in w$1, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 &&
        !isTrident());
}
/**
 * Checks whether the browser is based on Chromium without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isChromium() {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    return (countTruthy([
        'webkitPersistentStorage' in n,
        'webkitTemporaryStorage' in n,
        n.vendor.indexOf('Google') === 0,
        'webkitResolveLocalFileSystemURL' in w$1,
        'BatteryManager' in w$1,
        'webkitMediaStream' in w$1,
        'webkitSpeechGrammar' in w$1,
    ]) >= 5);
}
/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isWebKit() {
    // Based on research in September 2020
    return (countTruthy([
        'ApplePayError' in w$1,
        'CSSPrimitiveValue' in w$1,
        'Counter' in w$1,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w$1,
    ]) >= 4);
}
/**
 * Checks whether the WebKit browser is a desktop Safari.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isDesktopSafari() {
    return (countTruthy([
        'safari' in w$1,
        !('DeviceMotionEvent' in w$1),
        !('ongestureend' in w$1),
        !('standalone' in n),
    ]) >= 3);
}
/**
 * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isGecko() {
    var _a;
    // Based on research in September 2020
    return (countTruthy([
        'buildID' in n,
        ((_a = d.documentElement) === null || _a === void 0 ? void 0 : _a.style) && 'MozAppearance' in d.documentElement.style,
        'MediaRecorderErrorEvent' in w$1,
        'mozInnerScreenX' in w$1,
        'CSSMozDocumentRule' in w$1,
        'CanvasCaptureMediaStream' in w$1,
    ]) >= 4);
}
/**
 * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
 * It doesn't check that the browser is based on Chromium, there is a separate function for this.
 */
function isChromium86OrNewer() {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    return (countTruthy([
        !('MediaSettingsRange' in w$1),
        'RTCEncodedAudioFrame' in w$1,
        '' + w$1.Intl === '[object Intl]',
        '' + w$1.Reflect === '[object Reflect]',
    ]) >= 3);
}
/**
 * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @link https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
 */
function isWebKit606OrNewer() {
    // Checked in Safari 9–14
    return (countTruthy([
        'DOMRectList' in w$1,
        'RTCPeerConnectionIceEvent' in w$1,
        'SVGGeometryElement' in w$1,
        'ontransitioncancel' in w$1,
    ]) >= 3);
}

var w$2 = window;
var d$1 = document;
// Inspired by and based on https://github.com/cozylife/audio-fingerprint
function getAudioFingerprint() {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var AudioContext, context, oscillator, compressor, buffer, error_1;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    AudioContext = w$2.OfflineAudioContext || w$2.webkitOfflineAudioContext;
                    if (!AudioContext) {
                        return [2 /*return*/, -2 /* NotSupported */];
                    }
                    // In some browsers, audio context always stays suspended unless the context is started in response to a user action
                    // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
                    // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
                    // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
                    if (doesCurrentBrowserSuspendAudioContext()) {
                        return [2 /*return*/, -1 /* KnownToSuspend */];
                    }
                    context = new AudioContext(1, 44100, 44100);
                    oscillator = context.createOscillator();
                    oscillator.type = 'triangle';
                    setAudioParam(context, oscillator.frequency, 10000);
                    compressor = context.createDynamicsCompressor();
                    setAudioParam(context, compressor.threshold, -50);
                    setAudioParam(context, compressor.knee, 40);
                    setAudioParam(context, compressor.ratio, 12);
                    setAudioParam(context, compressor.reduction, -20);
                    setAudioParam(context, compressor.attack, 0);
                    setAudioParam(context, compressor.release, 0.25);
                    oscillator.connect(compressor);
                    compressor.connect(context.destination);
                    oscillator.start(0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, renderAudio(context)];
                case 2:
                    buffer = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.name === "timeout" /* Timeout */ || error_1.name === "suspended" /* Suspended */) {
                        return [2 /*return*/, -3 /* Timeout */];
                    }
                    throw error_1;
                case 4:
                    oscillator.disconnect();
                    compressor.disconnect();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/, getHash(buffer.getChannelData(0))];
            }
        });
    });
}
/**
 * Checks if the current browser is known to always suspend audio context
 */
function doesCurrentBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer();
}
function setAudioParam(context, param, value) {
    var isAudioParam = function (value) {
        return value && typeof value.setValueAtTime === 'function';
    };
    if (isAudioParam(param)) {
        param.setValueAtTime(value, context.currentTime);
    }
}
function renderAudio(context) {
    var resumeTriesMaxCount = 3;
    var resumeRetryDelay = 500;
    var runningTimeout = 1000;
    return new Promise(function (resolve, reject) {
        context.oncomplete = function (event) { return resolve(event.renderedBuffer); };
        var resumeTriesLeft = resumeTriesMaxCount;
        var tryResume = function () {
            context.startRendering();
            switch (context.state) {
                case 'running':
                    setTimeout(function () { return reject(makeInnerError("timeout" /* Timeout */)); }, runningTimeout);
                    break;
                // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
                // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
                // background on iPhone. Retries usually help in this case.
                case 'suspended':
                    // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
                    // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
                    // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
                    // can be suspended when `document.hidden === false` and start running after a retry.
                    if (!d$1.hidden) {
                        resumeTriesLeft--;
                    }
                    if (resumeTriesLeft > 0) {
                        setTimeout(tryResume, resumeRetryDelay);
                    }
                    else {
                        reject(makeInnerError("suspended" /* Suspended */));
                    }
                    break;
            }
        };
        tryResume();
    });
}
function getHash(signal) {
    var hash = 0;
    for (var i = 4500; i < 5000; ++i) {
        hash += Math.abs(signal[i]);
    }
    return hash;
}
function makeInnerError(name) {
    var error = new Error(name);
    error.name = name;
    return error;
}

var d$2 = document;
// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated.
var testString = 'mmMwWLliI0O&1';
// We test using 48px font size, we may use any size. I guess larger the better.
var testSize = '48px';
// A font will be compared against all the three default fonts.
// And if it doesn't match all 3 then that font is not available.
var baseFonts = ['monospace', 'sans-serif', 'serif'];
var fontList = [
    // This is android-specific font from "Roboto" family
    'sans-serif-thin',
    'ARNO PRO',
    'Agency FB',
    'Arabic Typesetting',
    'Arial Unicode MS',
    'AvantGarde Bk BT',
    'BankGothic Md BT',
    'Batang',
    'Bitstream Vera Sans Mono',
    'Calibri',
    'Century',
    'Century Gothic',
    'Clarendon',
    'EUROSTILE',
    'Franklin Gothic',
    'Futura Bk BT',
    'Futura Md BT',
    'GOTHAM',
    'Gill Sans',
    'HELV',
    'Haettenschweiler',
    'Helvetica Neue',
    'Humanst521 BT',
    'Leelawadee',
    'Letter Gothic',
    'Levenim MT',
    'Lucida Bright',
    'Lucida Sans',
    'Menlo',
    'MS Mincho',
    'MS Outlook',
    'MS Reference Specialty',
    'MS UI Gothic',
    'MT Extra',
    'MYRIAD PRO',
    'Marlett',
    'Meiryo UI',
    'Microsoft Uighur',
    'Minion Pro',
    'Monotype Corsiva',
    'PMingLiU',
    'Pristina',
    'SCRIPTINA',
    'Segoe UI Light',
    'Serifa',
    'SimHei',
    'Small Fonts',
    'Staccato222 BT',
    'TRAJAN PRO',
    'Univers CE 55 Medium',
    'Vrinda',
    'ZWAdobeF',
];
var fontSpanStyle = {
    // CSS font reset to reset external styles
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineBreak: 'auto',
    lineHeight: 'normal',
    textTransform: 'none',
    textAlign: 'left',
    textDecoration: 'none',
    textShadow: 'none',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    wordSpacing: 'normal',
    // We need this css as in some weird browser this span elements shows up for a microSec which creates
    // a bad user experience
    position: 'absolute',
    left: '-9999px',
    fontSize: testSize,
};
// kudos to http://www.lalit.org/lab/javascript-css-font-detect/
function getFonts() {
    var h = d$2.body;
    // div to load spans for the base fonts
    var baseFontsDiv = d$2.createElement('div');
    // div to load spans for the fonts to detect
    var fontsDiv = d$2.createElement('div');
    var defaultWidth = {};
    var defaultHeight = {};
    // creates a span where the fonts will be loaded
    var createSpan = function () {
        var span = d$2.createElement('span');
        span.textContent = testString;
        for (var _i = 0, _a = Object.keys(fontSpanStyle); _i < _a.length; _i++) {
            var prop = _a[_i];
            span.style[prop] = fontSpanStyle[prop];
        }
        return span;
    };
    // creates a span and load the font to detect and a base font for fallback
    var createSpanWithFonts = function (fontToDetect, baseFont) {
        var s = createSpan();
        s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
        return s;
    };
    // creates spans for the base fonts and adds them to baseFontsDiv
    var initializeBaseFontsSpans = function () {
        return baseFonts.map(function (baseFont) {
            var s = createSpan();
            s.style.fontFamily = baseFont;
            baseFontsDiv.appendChild(s);
            return s;
        });
    };
    // creates spans for the fonts to detect and adds them to fontsDiv
    var initializeFontsSpans = function () {
        // Stores {fontName : [spans for that font]}
        var spans = {};
        var _loop_1 = function (font) {
            spans[font] = baseFonts.map(function (baseFont) {
                var s = createSpanWithFonts(font, baseFont);
                fontsDiv.appendChild(s);
                return s;
            });
        };
        for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
            var font = fontList_1[_i];
            _loop_1(font);
        }
        return spans;
    };
    // checks if a font is available
    var isFontAvailable = function (fontSpans) {
        return baseFonts.some(function (baseFont, baseFontIndex) {
            return fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
                fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont];
        });
    };
    // create spans for base fonts
    var baseFontsSpans = initializeBaseFontsSpans();
    // add the spans to the DOM
    h.appendChild(baseFontsDiv);
    // get the default width for the three base fonts
    for (var index = 0, length_1 = baseFonts.length; index < length_1; index++) {
        defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
        defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
    }
    // create spans for fonts to detect
    var fontsSpans = initializeFontsSpans();
    // add all the spans to the DOM
    h.appendChild(fontsDiv);
    // check available fonts
    var available = [];
    for (var i = 0, l = fontList.length; i < l; i++) {
        if (isFontAvailable(fontsSpans[fontList[i]])) {
            available.push(fontList[i]);
        }
    }
    // remove spans from DOM
    h.removeChild(fontsDiv);
    h.removeChild(baseFontsDiv);
    return available;
}

function getPlugins() {
    if (isTrident()) {
        return [];
    }
    if (!navigator.plugins) {
        return undefined;
    }
    var plugins = [];
    // Safari 10 doesn't support iterating navigator.plugins with for...of
    for (var i = 0; i < navigator.plugins.length; ++i) {
        var plugin = navigator.plugins[i];
        if (!plugin) {
            continue;
        }
        var mimeTypes = [];
        for (var j = 0; j < plugin.length; ++j) {
            var mimeType = plugin[j];
            mimeTypes.push({
                type: mimeType.type,
                suffixes: mimeType.suffixes,
            });
        }
        plugins.push({
            name: plugin.name,
            description: plugin.description,
            mimeTypes: mimeTypes,
        });
    }
    return plugins;
}

function makeCanvasContext() {
    var canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 140;
    canvas.style.display = 'inline';
    return [canvas, canvas.getContext('2d')];
}
function isSupported(canvas, context) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return !!(context && canvas.toDataURL);
}
function save(canvas) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return canvas.toDataURL();
}
// https://www.browserleaks.com/canvas#how-does-it-work
function getCanvasFingerprint() {
    var _a = makeCanvasContext(), canvas = _a[0], context = _a[1];
    if (!isSupported(canvas, context)) {
        return { winding: false, data: '' };
    }
    // detect browser support of canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    var winding = !context.isPointInPath(5, 5, 'evenodd');
    context.textBaseline = 'alphabetic';
    context.fillStyle = '#f60';
    context.fillRect(125, 1, 62, 20);
    context.fillStyle = '#069';
    // https://github.com/Valve/fingerprintjs2/issues/66
    // this can affect FP generation when applying different CSS on different websites
    context.font = '11pt no-real-font-123';
    // the choice of emojis has a gigantic impact on rendering performance (especially in FF)
    // some newer emojis cause it to slow down 50-200 times
    // context.fillText("Cw爨m fjordbank \ud83d\ude03 gly", 2, 15)
    var printedText = 'Cwm fjordbank \ud83d\ude03 gly';
    context.fillText(printedText, 2, 15);
    context.fillStyle = 'rgba(102, 204, 0, 0.2)';
    context.font = '18pt Arial';
    context.fillText(printedText, 4, 45);
    // canvas blending
    // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    context.globalCompositeOperation = 'multiply';
    context.fillStyle = 'rgb(255,0,255)';
    context.beginPath();
    context.arc(50, 50, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.fillStyle = 'rgb(0,255,255)';
    context.beginPath();
    context.arc(100, 50, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.fillStyle = 'rgb(255,255,0)';
    context.beginPath();
    context.arc(75, 100, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    context.fillStyle = 'rgb(255,0,255)';
    // canvas winding
    // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    context.arc(75, 75, 75, 0, Math.PI * 2, true);
    context.arc(75, 75, 25, 0, Math.PI * 2, true);
    context.fill('evenodd');
    return {
        winding: winding,
        data: save(canvas),
    };
}

var n$1 = navigator;
var w$3 = window;
/**
 * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
 * of a touch screen with a JS, without actually subscribing to a touch event.
 *
 * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
 * @see https://github.com/Modernizr/Modernizr/issues/548
 */
function getTouchSupport() {
    var maxTouchPoints = 0;
    var touchEvent;
    if (n$1.maxTouchPoints !== undefined) {
        maxTouchPoints = toInt(n$1.maxTouchPoints);
    }
    else if (n$1.msMaxTouchPoints !== undefined) {
        maxTouchPoints = n$1.msMaxTouchPoints;
    }
    try {
        document.createEvent('TouchEvent');
        touchEvent = true;
    }
    catch (_) {
        touchEvent = false;
    }
    var touchStart = 'ontouchstart' in w$3;
    return {
        maxTouchPoints: maxTouchPoints,
        touchEvent: touchEvent,
        touchStart: touchStart,
    };
}

function getOsCpu() {
    return navigator.oscpu;
}

var n$2 = navigator;
function getLanguages() {
    var result = [];
    var language = n$2.language || n$2.userLanguage || n$2.browserLanguage || n$2.systemLanguage;
    if (language !== undefined) {
        result.push([language]);
    }
    if (Array.isArray(n$2.languages)) {
        // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
        // the value of `navigator.language`. Therefore the value is ignored in this browser.
        if (!(isChromium() && isChromium86OrNewer())) {
            result.push(n$2.languages);
        }
    }
    else if (typeof n$2.languages === 'string') {
        var languages = n$2.languages;
        if (languages) {
            result.push(languages.split(','));
        }
    }
    return result;
}

function getColorDepth() {
    return window.screen.colorDepth;
}

function getDeviceMemory() {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return replaceNaN(toFloat(navigator.deviceMemory), undefined);
}

var w$4 = window;
function getScreenResolution() {
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    var dimensions = [toInt(w$4.screen.width), toInt(w$4.screen.height)];
    dimensions.sort().reverse();
    return dimensions;
}

var w$5 = window;
function getAvailableScreenResolution() {
    if (w$5.screen.availWidth && w$5.screen.availHeight) {
        // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
        // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
        var dimensions = [toInt(w$5.screen.availWidth), toInt(w$5.screen.availHeight)];
        dimensions.sort().reverse();
        return dimensions;
    }
    return undefined;
}

function getHardwareConcurrency() {
    try {
        // sometimes hardware concurrency is a string
        var concurrency = toInt(navigator.hardwareConcurrency);
        return isNaN(concurrency) ? 1 : concurrency;
    }
    catch (e) {
        return 1;
    }
}

function getTimezoneOffset() {
    var currentYear = new Date().getFullYear();
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()), toFloat(new Date(currentYear, 6, 1).getTimezoneOffset()));
}

var w$6 = window;
function getTimezone() {
    var _a;
    if ((_a = w$6.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat) {
        return new w$6.Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return undefined;
}

function getSessionStorage() {
    try {
        return !!window.sessionStorage;
    }
    catch (error) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}

// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
function getLocalStorage() {
    try {
        return !!window.localStorage;
    }
    catch (e) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}

function getIndexedDB() {
    // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
    // visitor identifier in normal and private modes.
    if (isTrident() || isEdgeHTML()) {
        return undefined;
    }
    try {
        return !!window.indexedDB;
    }
    catch (e) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}

function getOpenDatabase() {
    return !!window.openDatabase;
}

function getCpuClass() {
    return navigator.cpuClass;
}

/**
 * It should be improved to handle mock value on iOS:
 * https://github.com/fingerprintjs/fingerprintjs/issues/514#issuecomment-727782842
 */
function getPlatform() {
    return navigator.platform;
}

function getPluginsSupport() {
    return navigator.plugins !== undefined;
}

function getProductSub() {
    return navigator.productSub;
}

function getEmptyEvalLength() {
    return eval.toString().length;
}

function getErrorFF() {
    try {
        throw 'a';
    }
    catch (e) {
        try {
            e.toSource();
            return true;
        }
        catch (e2) {
            return false;
        }
    }
}

function getVendor() {
    return navigator.vendor;
}

function getChrome() {
    return window.chrome !== undefined;
}

var d$3 = document;
/**
 * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
 * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
 * site-specific exceptions. Don't rely on it.
 *
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
 */
function areCookiesEnabled() {
    // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
    // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
    // with site-specific exceptions. Don't rely on it.
    // try..catch because some in situations `document.cookie` is exposed but throws a
    // SecurityError if you try to access it; e.g. documents created from data URIs
    // or in sandboxed iframes (depending on flags/context)
    try {
        // Create cookie
        d$3.cookie = 'cookietest=1';
        var result = d$3.cookie.indexOf('cookietest=') !== -1;
        // Delete cookie
        d$3.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return result;
    }
    catch (e) {
        return false;
    }
}

/**
 * The list of entropy sources used to make visitor identifiers.
 *
 * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
 * this package.
 */
var sources = {
    // Expected errors and default values must be handled inside the functions. Unexpected errors must be thrown.
    osCpu: getOsCpu,
    languages: getLanguages,
    colorDepth: getColorDepth,
    deviceMemory: getDeviceMemory,
    screenResolution: getScreenResolution,
    availableScreenResolution: getAvailableScreenResolution,
    hardwareConcurrency: getHardwareConcurrency,
    timezoneOffset: getTimezoneOffset,
    timezone: getTimezone,
    sessionStorage: getSessionStorage,
    localStorage: getLocalStorage,
    indexedDB: getIndexedDB,
    openDatabase: getOpenDatabase,
    cpuClass: getCpuClass,
    platform: getPlatform,
    plugins: getPlugins,
    canvas: getCanvasFingerprint,
    // adBlock: isAdblockUsed, // https://github.com/fingerprintjs/fingerprintjs/issues/405
    touchSupport: getTouchSupport,
    fonts: getFonts,
    audio: getAudioFingerprint,
    pluginsSupport: getPluginsSupport,
    productSub: getProductSub,
    emptyEvalLength: getEmptyEvalLength,
    errorFF: getErrorFF,
    vendor: getVendor,
    chrome: getChrome,
    cookiesEnabled: areCookiesEnabled,
};
/**
 * Gets a components list from the given list of entropy sources.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getComponents(sources, sourceOptions, excludeSources) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var timestamp, components, _i, _a, sourceKey, result, error_1, nextTimestamp;
        var _b;
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    timestamp = Date.now();
                    components = {};
                    _i = 0, _a = Object.keys(sources);
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    sourceKey = _a[_i];
                    if (!excludes(excludeSources, sourceKey)) {
                        return [3 /*break*/, 6];
                    }
                    result = void 0;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    _b = {};
                    return [4 /*yield*/, sources[sourceKey](sourceOptions)];
                case 3:
                    result = (_b.value = _c.sent(), _b);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    result = error_1 && typeof error_1 === 'object' && 'message' in error_1 ? { error: error_1 } : { error: { message: error_1 } };
                    return [3 /*break*/, 5];
                case 5:
                    nextTimestamp = Date.now();
                    components[sourceKey] = tslib.__assign(tslib.__assign({}, result), { duration: nextTimestamp - timestamp }); // TypeScript has beaten me here
                    timestamp = nextTimestamp;
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, components];
            }
        });
    });
}
/**
 * Collects entropy components from the built-in sources to make the visitor identifier.
 */
function getBuiltinComponents() {
    return getComponents(sources, undefined, []);
}

function componentsToCanonicalString(components) {
    var result = '';
    for (var _i = 0, _a = Object.keys(components); _i < _a.length; _i++) {
        var componentKey = _a[_i];
        var component = components[componentKey];
        var value = component.error ? 'error' : JSON.stringify(component.value);
        result += "" + (result ? '|' : '') + componentKey.replace(/([:|\\])/g, '\\$1') + ":" + value;
    }
    return result;
}
function componentsToDebugString(components) {
    return JSON.stringify(components, function (_key, value) {
        if (value instanceof Error) {
            return errorToObject(value);
        }
        return value;
    }, 2);
}
function hashComponents(components) {
    return x64hash128(componentsToCanonicalString(components));
}
/**
 * Makes a GetResult implementation that calculates the visitor id hash on demand.
 * Designed for optimisation.
 */
function makeLazyGetResult(components) {
    var visitorIdCache;
    // A plain class isn't used because its getters and setters aren't enumerable.
    return {
        components: components,
        get visitorId() {
            if (visitorIdCache === undefined) {
                visitorIdCache = hashComponents(this.components);
            }
            return visitorIdCache;
        },
        set visitorId(visitorId) {
            visitorIdCache = visitorId;
        },
    };
}
/**
 * The class isn't exported from the index file to not expose the constructor.
 * The hiding gives more freedom for future non-breaking updates.
 */
var OpenAgent = /** @class */ (function () {
    function OpenAgent() {
    }
    /**
     * @inheritDoc
     */
    OpenAgent.prototype.get = function (options) {
        if (options === void 0) { options = {}; }
        return tslib.__awaiter(this, void 0, void 0, function () {
            var components, result;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getBuiltinComponents()];
                    case 1:
                        components = _a.sent();
                        result = makeLazyGetResult(components);
                        if (options.debug) {
                            // console.log is ok here because it's under a debug clause
                            // eslint-disable-next-line no-console
                            console.log("Copy the text below to get the debug data:\n\n```\nversion: " + version + "\nuserAgent: " + navigator.userAgent + "\ngetOptions: " + JSON.stringify(options, undefined, 2) + "\nvisitorId: " + result.visitorId + "\ncomponents: " + componentsToDebugString(components) + "\n```");
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return OpenAgent;
}());
/**
 * Builds an instance of Agent and waits a delay required for a proper operation.
 */
function load(_a) {
    var _b = (_a === void 0 ? {} : _a).delayFallback, delayFallback = _b === void 0 ? 50 : _b;
    return tslib.__awaiter(this, void 0, void 0, function () {
        return tslib.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // A delay is required to ensure consistent entropy components.
                // See https://github.com/fingerprintjs/fingerprintjs/issues/254
                // and https://github.com/fingerprintjs/fingerprintjs/issues/307
                // and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
                // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
                return [4 /*yield*/, requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2)];
                case 1:
                    // A delay is required to ensure consistent entropy components.
                    // See https://github.com/fingerprintjs/fingerprintjs/issues/254
                    // and https://github.com/fingerprintjs/fingerprintjs/issues/307
                    // and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
                    // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
                    _c.sent();
                    return [2 /*return*/, new OpenAgent()];
            }
        });
    });
}

// The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
// It should contain all the public exported values.
var index = { load: load, hashComponents: hashComponents, componentsToDebugString: componentsToDebugString };
// The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
/** Not documented, out of Semantic Versioning, usage is at your own risk */
var murmurX64Hash128 = x64hash128;

exports.componentsToDebugString = componentsToDebugString;
exports.default = index;
exports.getComponents = getComponents;
exports.hashComponents = hashComponents;
exports.isChromium = isChromium;
exports.isDesktopSafari = isDesktopSafari;
exports.isEdgeHTML = isEdgeHTML;
exports.isGecko = isGecko;
exports.isTrident = isTrident;
exports.isWebKit = isWebKit;
exports.load = load;
exports.murmurX64Hash128 = murmurX64Hash128;

},{"tslib":2}],2:[function(require,module,exports){
(function (global){(function (){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
!function(e,o){if("function"==typeof define&&define.amd)define(["exports"],o);else if("undefined"!=typeof exports)o(exports);else{var t={};o(t),e.bodyScrollLock=t}}(this,function(exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=!1;if("undefined"!=typeof window){var e={get passive(){t=!0}};window.addEventListener("testPassive",null,e),window.removeEventListener("testPassive",null,e)}function l(o){return c.some(function(e){return!(!e.options.allowTouchMove||!e.options.allowTouchMove(o))})}function d(e){var o=e||window.event;return!!l(o.target)||(1<o.touches.length||(o.preventDefault&&o.preventDefault(),!1))}function n(){void 0!==v&&(document.body.style.paddingRight=v,v=void 0),void 0!==s&&(document.body.style.overflow=s,s=void 0)}var i="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||"MacIntel"===window.navigator.platform&&1<window.navigator.maxTouchPoints),c=[],a=!1,u=-1,s=void 0,v=void 0;exports.disableBodyScroll=function(r,e){if(r){if(!c.some(function(e){return e.targetElement===r})){var o={targetElement:r,options:e||{}};c=[].concat(function(e){if(Array.isArray(e)){for(var o=0,t=Array(e.length);o<e.length;o++)t[o]=e[o];return t}return Array.from(e)}(c),[o]),i?(r.ontouchstart=function(e){1===e.targetTouches.length&&(u=e.targetTouches[0].clientY)},r.ontouchmove=function(e){var o,t,n,i;1===e.targetTouches.length&&(t=r,i=(o=e).targetTouches[0].clientY-u,l(o.target)||(t&&0===t.scrollTop&&0<i||(n=t)&&n.scrollHeight-n.scrollTop<=n.clientHeight&&i<0?d(o):o.stopPropagation()))},a||(document.addEventListener("touchmove",d,t?{passive:!1}:void 0),a=!0)):function(e){if(void 0===v){var o=!!e&&!0===e.reserveScrollBarGap,t=window.innerWidth-document.documentElement.clientWidth;o&&0<t&&(v=document.body.style.paddingRight,document.body.style.paddingRight=t+"px")}void 0===s&&(s=document.body.style.overflow,document.body.style.overflow="hidden")}(e)}}else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")},exports.clearAllBodyScrollLocks=function(){i?(c.forEach(function(e){e.targetElement.ontouchstart=null,e.targetElement.ontouchmove=null}),a&&(document.removeEventListener("touchmove",d,t?{passive:!1}:void 0),a=!1),u=-1):n(),c=[]},exports.enableBodyScroll=function(o){o?(c=c.filter(function(e){return e.targetElement!==o}),i?(o.ontouchstart=null,o.ontouchmove=null,a&&0===c.length&&(document.removeEventListener("touchmove",d,t?{passive:!1}:void 0),a=!1)):c.length||n()):console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")}});

},{}],4:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],5:[function(require,module,exports){
(function (process,global){(function (){
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function() {
  'use strict';

  var root = typeof window === 'object' ? window : {};
  var NODE_JS = !root.JS_SHA1_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA1_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  var createOutputMethod = function (outputType) {
    return function (message) {
      return new Sha1(true).update(message)[outputType]();
    };
  };

  var createMethod = function () {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Sha1();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function (method) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash('sha1').update(message, 'utf8').digest('hex');
      } else if (message.constructor === ArrayBuffer) {
        message = new Uint8Array(message);
      } else if (message.length === undefined) {
        return method(message);
      }
      return crypto.createHash('sha1').update(new Buffer(message)).digest('hex');
    };
    return nodeMethod;
  };

  function Sha1(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    this.h0 = 0x67452301;
    this.h1 = 0xEFCDAB89;
    this.h2 = 0x98BADCFE;
    this.h3 = 0x10325476;
    this.h4 = 0xC3D2E1F0;

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  Sha1.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString = typeof(message) !== 'string';
    if (notString && message.constructor === root.ArrayBuffer) {
      message = new Uint8Array(message);
    }
    var code, index = 0, i, length = message.length || 0, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if(notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha1.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha1.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4;
    var f, j, t, blocks = this.blocks;

    for(j = 16; j < 80; ++j) {
      t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
      blocks[j] =  (t << 1) | (t >>> 31);
    }

    for(j = 0; j < 20; j += 5) {
      f = (b & c) | ((~b) & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1518500249 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | ((~a) & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1518500249 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | ((~e) & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1518500249 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | ((~d) & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1518500249 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | ((~c) & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1518500249 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 40; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e + 1859775393 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d + 1859775393 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c + 1859775393 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b + 1859775393 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a + 1859775393 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 60; j += 5) {
      f = (b & c) | (b & d) | (c & d);
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 1894007588 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = (a & b) | (a & c) | (b & c);
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 1894007588 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = (e & a) | (e & b) | (a & b);
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 1894007588 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = (d & e) | (d & a) | (e & a);
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 1894007588 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = (c & d) | (c & e) | (d & e);
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 1894007588 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    for(; j < 80; j += 5) {
      f = b ^ c ^ d;
      t = (a << 5) | (a >>> 27);
      e = t + f + e - 899497514 + blocks[j] << 0;
      b = (b << 30) | (b >>> 2);

      f = a ^ b ^ c;
      t = (e << 5) | (e >>> 27);
      d = t + f + d - 899497514 + blocks[j + 1] << 0;
      a = (a << 30) | (a >>> 2);

      f = e ^ a ^ b;
      t = (d << 5) | (d >>> 27);
      c = t + f + c - 899497514 + blocks[j + 2] << 0;
      e = (e << 30) | (e >>> 2);

      f = d ^ e ^ a;
      t = (c << 5) | (c >>> 27);
      b = t + f + b - 899497514 + blocks[j + 3] << 0;
      d = (d << 30) | (d >>> 2);

      f = c ^ d ^ e;
      t = (b << 5) | (b >>> 27);
      a = t + f + a - 899497514 + blocks[j + 4] << 0;
      c = (c << 30) | (c >>> 2);
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
  };

  Sha1.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

    return HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
           HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
           HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
           HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
           HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
           HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
           HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
           HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
           HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
           HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
           HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
           HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
           HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
           HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
           HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
           HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
           HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
           HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
           HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
           HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F];
  };

  Sha1.prototype.toString = Sha1.prototype.hex;

  Sha1.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4;

    return [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF
    ];
  };

  Sha1.prototype.array = Sha1.prototype.digest;

  Sha1.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(20);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    return buffer;
  };

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha1 = exports;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }
});

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":6}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
"use strict";

require('./modules/polyfills');

require('./app/_init');

require('./app/accordion');

require('./app/animations');

require('./app/cards');

require('./app/click-goals');

require('./app/cookies');

require('./app/form');

require('./app/header');

require('./app/lazyload');

require('./app/menu-mobile');

require('./app/menu-top');

require('./app/modal');

require('./app/scroll');

require('./app/scrollspy');

require('./app/slider');

require('./app/tabs');

require('./app/tooltip');

require('./app/route');

require('./app/calculator');

require('./app/add-form-items');

require('./app/load-more');

require('./app/glossary');

require('./app/category-tabs');

require('./app/aside-menu');

},{"./app/_init":8,"./app/accordion":9,"./app/add-form-items":10,"./app/animations":11,"./app/aside-menu":12,"./app/calculator":13,"./app/cards":14,"./app/category-tabs":15,"./app/click-goals":16,"./app/cookies":17,"./app/form":18,"./app/glossary":19,"./app/header":20,"./app/lazyload":21,"./app/load-more":22,"./app/menu-mobile":23,"./app/menu-top":24,"./app/modal":25,"./app/route":26,"./app/scroll":27,"./app/scrollspy":28,"./app/slider":29,"./app/tabs":30,"./app/tooltip":31,"./modules/polyfills":38}],8:[function(require,module,exports){
"use strict";

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _jsSha = _interopRequireDefault(require("js-sha1"));

var _fingerprintjs = _interopRequireDefault(require("@fingerprintjs/fingerprintjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var body = document.querySelector('body');

if (window.navigator.userAgent.indexOf('MSIE ') > 0 || window.navigator.userAgent.indexOf('Trident/') > 0) {
  body.classList.add('ie-browser');
}

if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
  body.classList.add('ios-browser');
}

if (/Android/.test(navigator.appVersion)) {
  window.addEventListener('resize', function () {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      document.activeElement.scrollIntoView();
    }
  });
}

window.addEventListener('DOMContentLoaded', function () {
  new Promise(function (resolve) {
    resolve(_fingerprintjs["default"].load());
  }).then(function (fp) {
    return fp.get();
  }).then(function (result) {
    _jsCookie["default"].set('fp', result.visitorId, {
      domain: window.location.hostname,
      secure: true
    });
  });


});
document.querySelectorAll('.form__wrap').forEach(function (form) {
  var cloud = form.previousSibling;

  while (cloud && cloud.nodeType !== 1) {
    cloud = cloud.previousSibling;
  }

  // if (cloud) {
  //   cloud.value = (0, _jsSha["default"])(_jsCookie["default"].get('wp-settings-gut'));
  // }
});

},{"@fingerprintjs/fingerprintjs":1,"js-cookie":4,"js-sha1":5}],9:[function(require,module,exports){
"use strict";

var expandTogglers = document.querySelectorAll('[data-toggle="expand"]') || []; //TODO remove duplicate

var tabsHeightSet = function tabsHeightSet(tabs) {
  tabs.forEach(function (currentTabs) {
    if (currentTabs.getAttribute('data-tabs-height') === 'auto') {
      currentTabs.querySelector('.tabs__body').style.minHeight = currentTabs.querySelector('.tabs__pane.active').getBoundingClientRect().height + 'px';
    } else {
      var tabsPanes = currentTabs.querySelectorAll('.tabs__pane');
      var panesHeights = [];
      tabsPanes.forEach(function (pane) {
        return panesHeights.push(pane.getBoundingClientRect().height);
      });
      currentTabs.querySelector('.tabs__body').style.minHeight = Math.max.apply(null, panesHeights) + 'px';
    }
  });
};

expandTogglers.forEach(function (item) {
  var textContainer = item.querySelector('[data-toggle-text]');

  var expandAction = function expandAction() {
    var target = item.getAttribute('data-target');
    var targetItem = document.querySelector('[data-target-item=' + target + ']');
    var langSwitcher = item.closest('.lang-switcher');
    var innerCards = targetItem.querySelectorAll('.card') || [];
    item.classList.toggle('active');
    targetItem.classList.toggle('collapse'); // change tab height

    var tabs = document.querySelectorAll('[data-element="tabs"]');

    if (tabs.length) {
      targetItem.addEventListener('transitionstart', function () {
        tabsHeightSet(tabs);
      });
      targetItem.addEventListener('transitionend', function () {
        tabsHeightSet(tabs);
      });
    }

    innerCards.forEach(function (card) {
      return card.classList.toggle('show');
    });

    if (langSwitcher) {
      langSwitcher.classList.toggle('active');
    }

    if (textContainer) {
      var currentText = textContainer.innerText;
      textContainer.innerText = textContainer.getAttribute('data-toggle-text');
      textContainer.setAttribute('data-toggle-text', currentText);
    } // for faq accordion


    var accordion = item.closest('.accordion');

    if (accordion && accordion.getAttribute('data-accordion-multiple') === 'false') {
      var allItems = accordion.querySelectorAll('[data-toggle="expand"]');
      allItems.forEach(function (accItem) {
        if (accItem !== item) {
          var accItemTarget = accItem.getAttribute('data-target');
          var accTargetItem = accItem.parentElement.querySelector('[data-target-item=' + accItemTarget + ']');
          accItem.classList.remove('active');
          accTargetItem.classList.remove('collapse');
        }
      });
    }
  };

  item.addEventListener('click', function () {
    return expandAction();
  });
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      expandAction();
    }
  });
});

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSelectItem = removeSelectItem;
exports.addSelectItem = void 0;

var _greatSelect = _interopRequireDefault(require("../modules/great-select"));

var _constants = require("../modules/_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var addSelectItem = function addSelectItem(btnAdd) {
  var maxCount = 4;
  var countNodes = document.querySelectorAll('[data-plus]').length;
  var field = btnAdd.closest('.form__field');
  var parent = btnAdd.closest('.calculator__col');
  var newItem = field.cloneNode(true);
  var newBtn = newItem.querySelector('.btn--add');
  var newSelect = newItem.querySelector('[data-select]');
  var newLabel = newItem.querySelector('label');
  var greatSelect = newItem.querySelector('.great-select');
  var tooltip = newItem.querySelector('[data-toggle="tooltip"]');

  if (greatSelect) {
    greatSelect.remove();
  }

  if (tooltip) {
    tooltip.remove();
  }

  newSelect.id = newSelect.id + (countNodes + 1);
  newLabel.setAttribute('for', newLabel.getAttribute('for') + (countNodes + 1));
  newBtn.dataset.role = 'remove-btn';
  newBtn.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M14 3.5L12 15H4.5L2 3.5M0 3.5H16M3 1H13\" stroke=\"#1F232C\" fill=\"none\"/>\n                        </svg>";
  newItem.classList.add('show');
  newItem.addEventListener('animationend', function () {
    return newItem.classList.remove('show');
  });
  parent.appendChild(newItem);
  var select = new _greatSelect["default"]('[data-select]', _constants.SELECT);
  select.init();

  if (countNodes === maxCount) {
    btnAdd.setAttribute('disabled', true);
  }

  return newBtn;
};

exports.addSelectItem = addSelectItem;

function removeSelectItem(removeBtn, btnAdd, updatePrices) {
  var currentField = removeBtn.closest('.form__field');
  currentField.classList.remove('show');
  currentField.classList.add('hide');
  currentField.addEventListener('animationend', function () {
    currentField.remove();
    updatePrices();
  });
  btnAdd.removeAttribute('disabled');
}

},{"../modules/_constants":32,"../modules/great-select":36}],11:[function(require,module,exports){
"use strict";

var _functions = require("../modules/_functions");

document.addEventListener('DOMContentLoaded', function () {
  var showAnimations = function showAnimations() {
    var animateImages = document.querySelectorAll('.animate-image');
    animateImages.forEach(function (animateImage) {
      if ((0, _functions.inViewport)(animateImage) || (0, _functions.inViewport)(animateImage.closest('section'))) {
        var animateElement = animateImage.querySelectorAll('.animate-element, .animate-line');
        animateElement.forEach(function (el) {
          el.classList.add('show');
          el.style.animationDelay = el.getAttribute('data-animation-delay');
        });
      }
    });
  };

  showAnimations();
  document.addEventListener('scroll', showAnimations);
});

},{"../modules/_functions":33}],12:[function(require,module,exports){
"use strict";

// const category = document.querySelector('.category');
var categoryAside = document.querySelector('.category__aside--single');

if (categoryAside) {
  var categoryNav = categoryAside.querySelector('.category__nav'); // const height = window.innerHeight - (window.pageYOffset + category.getBoundingClientRect().top) - 30;

  var top = parseInt(window.getComputedStyle(categoryAside, null).getPropertyValue('top'), 10);
  var height = window.innerHeight - top - 30;

  if (categoryNav.offsetHeight > height - categoryNav.offsetTop) {
    categoryNav.style.maxHeight = height - categoryNav.offsetTop + 'px';
    categoryAside.style.maxHeight = height + 'px';
  }
}

},{}],13:[function(require,module,exports){
"use strict";

var _greatSelect = _interopRequireDefault(require("../modules/great-select"));

var _microRanger = _interopRequireDefault(require("../modules/micro-ranger"));

var _constants = require("../modules/_constants");

var _addFormItems = require("./add-form-items");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var calculators = document.querySelectorAll('[data-role="calc"]');
calculators.forEach(function (calc) {
  var dcSelect = new _greatSelect["default"]('[data-select]', _constants.SELECT);
  var ranges = calc.querySelectorAll('[type="range"]') || [];
  var inputs = calc.querySelectorAll('.range__value');
  var radioBtns = calc.querySelectorAll('.radio__input');
  var usersInput = calc.querySelector('input[data-name="users"]');
  var gbInput = calc.querySelector('input[data-name="ssd"]').parentElement.querySelector('.range__input');
  var priceElement = calc.querySelector('.price__value');
  var btnAdd = document.querySelector('[data-role="add-btn"]');
  dcSelect.init();

  var rangers = _toConsumableArray(ranges).reduce(function (rangers, range) {
    rangers[range.getAttribute('aria-label')] = new _microRanger["default"](range, {
      suffix: range.dataset.suffix,
      map: range.dataset.map ? JSON.parse(range.dataset.map) : {}
    });
    return rangers;
  }, {});

  var updatePrices = function updatePrices() {
    // price = basePrice + numberOfUsers * pricePerUser + pricePerGB * (numberOfGB - minGB)
    var currentType = calc.querySelector('input[data-rates]:checked');
    var bases = calc.querySelectorAll('select[data-select="conf"]');
    var params = JSON.parse(currentType.dataset.rates);
    var numberOfUsers = usersInput.value,
        numberOfGB = gbInput.value,
        minGB = Number(gbInput.min),
        pricePerGB = Number(gbInput.dataset.rates),
        basesCount = bases.length,
        pricePerBase = Number(btnAdd.dataset.price);
    var pricePerBases = basesCount > numberOfUsers ? (basesCount - numberOfUsers) * pricePerBase : 0;
    var price = params.base + params.perUser * numberOfUsers + (numberOfGB - minGB) * pricePerGB + pricePerBases;
    priceElement.textContent = price;
  };

  inputs.forEach(function (input) {
    return input.addEventListener('ranger:onChange', updatePrices);
  });
  radioBtns.forEach(function (btn) {
    return btn.addEventListener('change', updatePrices);
  });
  updatePrices();

  if (btnAdd) {
    btnAdd.addEventListener('click', function () {
      var removeBtn = (0, _addFormItems.addSelectItem)(btnAdd);
      updatePrices();
      removeBtn.addEventListener('click', function () {
        (0, _addFormItems.removeSelectItem)(removeBtn, btnAdd, updatePrices);
      });
    });
  }
});

},{"../modules/_constants":32,"../modules/great-select":36,"../modules/micro-ranger":37,"./add-form-items":10}],14:[function(require,module,exports){
"use strict";

var _functions = require("../modules/_functions");

var cardsCollection = document.querySelectorAll('[data-activity]') || [];
cardsCollection.forEach(function (card) {
  var cardActivity = card.getAttribute('data-activity');
  var cardImg = card.querySelector('.card__img');
  var cardBtn = card.querySelector('.btn');
  card.addEventListener('mouseover', function () {
    (0, _functions.getSiblings)(card).forEach(function (sibling) {
      sibling.classList.replace('card--active', 'card--disable');
      sibling.querySelector('.btn').classList.replace('btn--active', 'btn--disable');

      if (!(sibling.dataset.activity === 'iconx')) {
        sibling.querySelector('.card__img').classList.replace('card__img--active', 'card__img--disable');
      }
    });
    card.classList.replace('card--disable', 'card--active');
    cardImg.classList.replace('card__img--disable', 'card__img--active');
    cardBtn.classList.replace('btn--disable', 'btn--active');
  });
  card.addEventListener('mouseleave', function () {
    (0, _functions.getSiblings)(card).forEach(function (sibling) {
      var sibActivity = sibling.getAttribute('data-activity');

      switch (sibActivity) {
        case 'none':
          break;

        case 'icon':
          sibling.querySelector('.card__img').classList.replace('card__img--disable', 'card__img--active');
          break;

        case 'active':
          sibling.classList.replace('card--disable', 'card--active');
          sibling.querySelector('.card__img').classList.replace('card__img--disable', 'card__img--active');
          sibling.querySelector('.btn').classList.replace('btn--disable', 'btn--active');
          break;

        case 'iconx':
          sibling.querySelector('.card__img').classList.replace('card__img--disable', 'card__img--active');
          break;

        default:
      }
    });

    switch (cardActivity) {
      case 'none':
        card.classList.replace('card--active', 'card--disable');
        cardImg.classList.replace('card__img--active', 'card__img--disable');
        cardBtn.classList.replace('btn--active', 'btn--disable');
        break;

      case 'icon':
        card.classList.replace('card--active', 'card--disable');
        cardBtn.classList.replace('btn--active', 'btn--disable');
        break;

      case 'iconx':
        card.classList.replace('card--active', 'card--disable');
        cardBtn.classList.replace('btn--active', 'btn--disable');
        break;

      case 'active':
        break;

      default:
    }
  });
});

},{"../modules/_functions":33}],15:[function(require,module,exports){
"use strict";

var categoryTabsLinks = document.querySelectorAll('[data-toggle="category-tabs"]');

if (categoryTabsLinks.length) {
  categoryTabsLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var target = this.dataset.target;
      var categoryTabs = link.closest('.category').querySelectorAll('.category__tab');
      link.classList.add('active');
      categoryTabs.forEach(function (tab) {
        if (tab.dataset.id === target) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      categoryTabsLinks.forEach(function (catLink) {
        if (link !== catLink) {
          catLink.classList.remove('active');
        }
      });
    });
  });
}

},{}],16:[function(require,module,exports){
"use strict";

var _ctaGoals = require("../modules/cta-goals");

document.querySelectorAll('[data-goal]').forEach(function (btn) {
  return btn.addEventListener('click', function (e) {
    (0, _ctaGoals.reachGoals)(btn.getAttribute('data-goal'), {
      goal: btn.getAttribute('data-goal'),
      action: btn.getAttribute('data-action'),
      category: btn.getAttribute('data-category')
    });
  });
});

},{"../modules/cta-goals":35}],17:[function(require,module,exports){
"use strict";

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.onload = function () {
  var cookies = document.querySelector('#cookiesMessage');

  if (cookies) {
    cookies.querySelector('[data-toggle="cookies-accept"]').addEventListener('click', function () {
      cookies.classList.add('hide');
      setTimeout(function () {
        cookies.remove();
      }, 1000);

      _jsCookie["default"].set('1office-cookies', 'accepted', {
        expires: 365
      });
    });
  }
  document.addEventListener('DOMNodeInserted', () => {
    if (event.target) {
      event.target.remove()
    }
  })
};

},{"js-cookie":4}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFormDefaults = setFormDefaults;

var _constants = require("../modules/_constants");

var _ajaxHandler = _interopRequireDefault(require("../modules/ajax-handler"));

var _ctaGoals = require("../modules/cta-goals");

var _modal = require("./modal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var forms = document.querySelectorAll('.form') || [];
forms.forEach(function (item) {
  var inputs = item.querySelectorAll(_constants.FORM.control);
  inputs.forEach(function (input) {
    return input.addEventListener('focus', function (e) {
      clearInputError(e.target);
    });
  });
  item.addEventListener('submit', function (e) {
    var form = e.target;
    var url = form.getAttribute('action');
    var formData = new FormData(form);
    var inputs = form.querySelectorAll(_constants.FORM.control);
    var fileInput = form.querySelector('input[type="file"]');
    var ajax = new _ajaxHandler["default"]({
      'url': url,
      'form': form
    });
    formData.append('csrf_token', document.getElementById('csrf-token').getAttribute('content'));

    if (fileInput) {
      for (var i = 0; i < fileInput.files.length; i++) {
        formData.append('files[]', fileInput.files[i]);
      }
    }

    inputs.forEach(function (input) {
      return clearInputError(input);
    });
    ajax.send(formData, function () {
      var response = ajax.response;
      var currentModal = form.closest(_constants.MODAL.module);
      inputs.forEach(function (input) {
        return input.value = '';
      });
      (0, _ctaGoals.reachGoals)(response.counters.goals.ym, response.counters.goals.ga, response.counters.goals.gads);

      if ('success_modal' === response.type) {
        var currentResponse = document.getElementById(_constants.MODAL.successId).querySelector(_constants.MODAL.response);
        currentResponse.innerHTML = response.message;
        currentResponse.classList.add('show');
        (0, _modal.openModal)(_constants.MODAL.successId);
        setFormDefaults(form);
      } else if (response.type === 'same_modal') {
        var _currentResponse = currentModal.querySelector(_constants.MODAL.response);

        currentModal.querySelector(_constants.MODAL.content).classList.add('hide');

        _currentResponse.classList.add('show');

        _currentResponse.innerHTML = response.message;
      } else {
        window.location.replace('https://' + window.location.hostname + '/success/');
      }
    }, function () {
      onResponseFalse(form, ajax.response);
    });
    e.preventDefault();
  });
});

function onResponseFalse(form, response) {
  var inputs = form.querySelectorAll(_constants.FORM.control);
  inputs.forEach(function (input) {
    var errorMsg = input.parentElement.querySelector(_constants.FORM.error);
    var field = input.closest(_constants.FORM.field);

    for (var error in response.errors) {
      if (input.name === response.errors[error].field && !errorMsg) {
        field.classList.add('error');
        input.classList.add('error');
        input.insertAdjacentHTML('afterend', '<span class="error-msg">' + response.errors[error].message + '</span>');
      }
    }
  });
}

function clearInputError(input) {
  var field = input.closest(_constants.FORM.field);

  if (field.classList.contains('error')) {
    var errorMsg = input.parentElement.querySelector(_constants.FORM.error);
    field.classList.remove('error');
    input.classList.remove('error');

    if (errorMsg) {
      input.parentElement.removeChild(errorMsg);
    }
  }
}

function setFormDefaults(form, modal) {
  if (modal) {
    var formResponse = modal.querySelector(_constants.MODAL.response);
    var modalContent = modal.querySelector(_constants.MODAL.content);

    if (modalContent) {
      setTimeout(function () {
        modal.querySelector(_constants.MODAL.content).classList.remove('hide');
      }, 200);
    }

    if (formResponse) {
      formResponse.innerHTML = '';
    }

    form = modal.querySelector('.form');
  }

  if (form) {
    form.querySelectorAll(_constants.FORM.control).forEach(function (input) {
      return clearInputError(input);
    });
  }
}

},{"../modules/_constants":32,"../modules/ajax-handler":34,"../modules/cta-goals":35,"./modal":25}],19:[function(require,module,exports){
"use strict";

var categories = document.querySelectorAll('.glossary-link:not(.disabled)') || [];
var allItems = document.querySelectorAll('.glossary-item') || [];
var glossaryBody = document.querySelector('.glossary-body');

if (glossaryBody) {
  var minHeight;

  var glossaryListener = function glossaryListener(e, links, allItems) {
    var category = e.target.getAttribute('data-letter');
    links.forEach(function (linkInner) {
      linkInner.classList.remove('active');

      if (linkInner.getAttribute('data-letter') === category) {
        linkInner.classList.add('active');
      }
    });

    if (category !== 'all') {
      glossaryBody.classList.add('active');
      allItems.forEach(function (item) {
        item.classList.remove('active');
        item.classList.add('inactive');
      });
      setTimeout(function () {
        var activeItems = glossaryBody.querySelectorAll('[data-letter=' + category + ']');
        activeItems.forEach(function (item) {
          item.classList.remove('inactive');
          item.classList.add('active');
        });
        glossaryBody.removeAttribute('style');
        minHeight = glossaryBody.offsetHeight;
        glossaryBody.style.minHeight = minHeight + 'px';
      }, 100);
    } else {
      glossaryBody.classList.remove('active');
      allItems.forEach(function (catItem) {
        catItem.classList.remove('inactive');
        catItem.classList.add('active');
      });
      minHeight = glossaryBody.offsetHeight;
      glossaryBody.style.minHeight = minHeight + 'px';
    }

    e.preventDefault();
  };

  categories.forEach(function (link) {
    link.addEventListener('click', function (e) {
      glossaryListener(e, categories, allItems);
    });
  });
}

},{}],20:[function(require,module,exports){
"use strict";

var _menuTop = require("./menu-top");

var HEADER_FIXED_HEIGHT = 25;
var topLine = document.querySelector('.topline'),
    header = document.querySelector('.header'),
    headerMain = header.querySelector('.header__main'),
    asideMenu = document.querySelector('.category__aside') || document.querySelector('.tabs__nav--category'); // headerBtns = header.querySelectorAll('.btn');

var lastScrollTop = 0;

var processScroll = function processScroll() {
  var currentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  if (Math.sign(currentScrollTop) !== -1) {
    if (currentScrollTop > lastScrollTop) {
      if (topLine) {
        header.classList.add('header--gap');

        if (asideMenu) {
          asideMenu.classList.add('gap');
        }
      }

      if (currentScrollTop > HEADER_FIXED_HEIGHT) {
        headerMain.classList.add('header__main--scrolled');
        (0, _menuTop.makeLightHeader)(); // headerBtns.forEach(btn => {
        //   if (btn.classList.contains('btn--empty')) {
        //     btn.classList.remove('btn--empty');
        //     btn.classList.add('btn--full');
        //   }
        // });
      }
    } else {
      if (topLine) {
        header.classList.remove('header--gap');

        if (asideMenu) {
          asideMenu.classList.remove('gap');
        }
      }

      if (currentScrollTop < HEADER_FIXED_HEIGHT) {
        headerMain.classList.remove('header__main--scrolled');

        if (!document.querySelector('.submenu.show')) {
          (0, _menuTop.makeDarkHeader)();
        }
      }
    }

    lastScrollTop = currentScrollTop;
  }
};

var hideLang = function hideLang() {
  var activeLang = document.querySelectorAll('.lang-switcher.active') || [];
  activeLang.forEach(function (switcher) {
    return switcher.classList.remove('active');
  });
};

window.addEventListener('scroll', processScroll);
window.addEventListener('scroll', hideLang);
window.addEventListener('resize', processScroll);
window.addEventListener('resize', hideLang);

},{"./menu-top":24}],21:[function(require,module,exports){
"use strict";

document.addEventListener('lazybeforeunveil', function (e) {
  var bg = e.target.getAttribute('data-bg');

  if (bg) {
    e.target.style.backgroundImage = 'url(' + bg + ')';
  }
});

},{}],22:[function(require,module,exports){
"use strict";

var _ajaxHandler = _interopRequireDefault(require("../modules/ajax-handler"));

var _constants = require("../modules/_constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var loadMoreBtns = document.querySelectorAll('[data-toggle="loadMore"]');
loadMoreBtns.forEach(function (loadMore) {
  var options = {
    'action': _constants.LOAD_MORE.action,
    'type': loadMore.dataset.type,
    'category': loadMore.dataset.category,
    'status': loadMore.dataset.status,
    'template': loadMore.dataset.template
  };
  loadMore.addEventListener('click', function () {
    var ajaxHandler = new _ajaxHandler["default"]({
      'url': _constants.AJAX_URL,
      'btn': loadMore
    });
    var data = new FormData();

    for (var prop in options) {
      data.append(prop, options[prop]);
    }

    ajaxHandler.send(data, function () {
      loadMore.closest(_constants.LOAD_MORE.parent).querySelector(_constants.LOAD_MORE.container).insertAdjacentHTML('beforeend', ajaxHandler.response.cards);

      if (ajaxHandler.response.foundPosts > ajaxHandler.response.postCount) {
        options.offset = ajaxHandler.response.postCount;
      } else {
        loadMore.style.display = 'none';
      }
    });
  });
});

},{"../modules/_constants":32,"../modules/ajax-handler":34}],23:[function(require,module,exports){
"use strict";

var _bodyScrollLock = require("body-scroll-lock");

var menu = document.getElementById('mobileMenu');
var body = document.body;
var mobileMenuBody = document.getElementById('mobile-menu-body');
var menuOpen = document.getElementById('mobileOpen');
var menuClose = document.getElementById('mobileClose');
var header = document.querySelector('header');

var resetMobileMenu = function resetMobileMenu(e) {
  var sectionsTogglers = document.querySelectorAll('.accordion__toggler.active');
  var sections = document.querySelectorAll('.accordion__menu.collapse');
  sectionsTogglers.forEach(function (item) {
    item.classList.remove('active');
  });
  sections.forEach(function (item) {
    item.classList.remove('collapse');
  });
};

var closeMenu = function closeMenu(e) {
  body.classList.remove('modal-open');
  menu.classList.remove('show');
  var menuSectionShow = document.querySelector('.mobile-menu__section.show');
  setTimeout(function () {
    if (menuSectionShow) {
      menuSectionShow.classList.remove('show');
    }

    (0, _bodyScrollLock.clearAllBodyScrollLocks)();
  }, 200);
  resetMobileMenu();
};

var closeMenuByOuterClick = function closeMenuByOuterClick(e) {
  var menuShow = document.querySelector('.mobile-wrapper.show');

  if (menuShow && !menuShow.contains(e.target) && !menuClose.contains(e.target) || e.target.classList.contains('mobile-overlay')) {
    closeMenu();
  }
};

menuOpen.addEventListener('click', function () {
  body.classList.add('modal-open');

  if (window.innerWidth > 767 && header.classList.contains('header--gap')) {
    header.classList.remove('header--gap');
  }

  setTimeout(function () {
    menu.classList.toggle('show');
    (0, _bodyScrollLock.disableBodyScroll)(mobileMenuBody, {
      reserveScrollBarGap: true
    });
  }, 0);
  setMobileMenuHeights();
});
menuClose.addEventListener('click', function () {
  closeMenu();
});
window.addEventListener('click', closeMenuByOuterClick);

var setMobileMenuHeights = function setMobileMenuHeights() {
  // var toplineHeight = header.querySelector('.topline').getBoundingClientRect().height;
  var headerHeight = menu.querySelector('.mobile-menu__header').getBoundingClientRect().height;
  var footerHeight = menu.querySelector('.mobile-menu__footer').getBoundingClientRect().height;
  var bodyHeight = window.innerHeight - headerHeight - footerHeight;
  document.querySelector('.mobile-wrapper').style.height = window.innerHeight + 'px';
  mobileMenuBody.style.height = bodyHeight + 'px';
};

window.addEventListener('DOMContentLoaded', setMobileMenuHeights);
window.addEventListener('resize', setMobileMenuHeights);

},{"body-scroll-lock":3}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeDarkHeader = exports.makeLightHeader = void 0;
var header = document.querySelector('.header__main');
var langSwitchers = document.querySelectorAll('.lang-switcher.menu') || [];
var dropdowns = document.querySelectorAll('[data-toggle="dropdown"]') || [];
langSwitchers.forEach(function (item) {
  return item.querySelector('[data-toggle="lang-switcher"]').addEventListener('click', function () {
    return item.classList.toggle('active');
  });
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('.lang-switcher.menu.active')) {
    langSwitchers.forEach(function (item) {
      return item.classList.remove('active');
    });
  }
});
dropdowns.forEach(function (dropdown) {
  var parent = dropdown.closest('.dropdown');
  var currentMenu = parent.querySelector('.submenu');

  var showMenu = function showMenu() {
    currentMenu.classList.add('show');
  };

  var hideMenu = function hideMenu() {
    currentMenu.classList.remove('show');
  };

  dropdown.addEventListener('mouseover', function () {
    showMenu();
    makeLightHeader();
  });
  dropdown.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === 'Down') {
      showMenu();
      makeLightHeader();
    }
  });
  var lastSubmenuLink = parent.querySelector('.submenu__section') ? parent.querySelector('.submenu__section:last-child .submenu__item:last-child .submenu__link') : parent.querySelector('.submenu__item:last-child .submenu__link');
  lastSubmenuLink.addEventListener('blur', function () {
    return hideMenu();
  });
  parent.addEventListener('mouseleave', function () {
    return hideMenu();
  });
});
var menuDropdowns = document.querySelectorAll('.menu-top__item');
menuDropdowns.forEach(function (item) {
  item.addEventListener('mouseover', function () {
    item.querySelector('.menu-top__link').classList.add('menu-top__link--active');

    if (item.classList.contains('dropdown')) {
      document.querySelector('.header__main').classList.add('header__main--active');
    }
  });
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && item.classList.contains('dropdown')) {
      document.querySelector('.header__main').classList.add('header__main--active');
    }
  });
  item.addEventListener('mouseleave', function () {
    item.querySelector('.menu-top__link').classList.remove('menu-top__link--active');
  });
  item.addEventListener('blur', function () {
    item.querySelector('.menu-top__link').classList.remove('menu-top__link--active');
  });
});
header.addEventListener('mouseleave', function () {
  makeDarkHeader();
});

var makeLightHeader = function makeLightHeader() {
  if (header.getAttribute('data-theme') === 'dark' || header.getAttribute('data-theme') === 'dark-border') {
    if (header.getAttribute('data-theme') === 'dark') {
      header.classList.replace('header__main--dark', 'header__main--light');
    } else {
      header.classList.replace('header__main--dark-border', 'header__main--light');
    }

    header.querySelector('.header__logo').classList.replace('header__logo--dark', 'header__logo--light');
    document.querySelectorAll('.menu-top__link').forEach(function (link) {
      link.classList.replace('menu-top__link--dark', 'menu-top__link--light');
    });
    document.querySelectorAll('.mobile-btn__bar').forEach(function (burgerBar) {
      burgerBar.classList.replace('mobile-btn__bar--dark', 'mobile-btn__bar--light');
    });
  }
};

exports.makeLightHeader = makeLightHeader;

var makeDarkHeader = function makeDarkHeader() {
  if ((header.getAttribute('data-theme') === 'dark' || header.getAttribute('data-theme') === 'dark-border') && !header.classList.contains('header__main--scrolled')) {
    if (header.getAttribute('data-theme') === 'dark') {
      header.classList.replace('header__main--light', 'header__main--dark');
    } else {
      header.classList.replace('header__main--light', 'header__main--dark-border');
    }

    header.querySelector('.header__logo').classList.replace('header__logo--light', 'header__logo--dark');
    document.querySelectorAll('.menu-top__link').forEach(function (link) {
      link.classList.replace('menu-top__link--light', 'menu-top__link--dark');
    });
    document.querySelectorAll('.mobile-btn__bar').forEach(function (burgerBar) {
      burgerBar.classList.replace('mobile-btn__bar--light', 'mobile-btn__bar--dark');
    });
  }
};

exports.makeDarkHeader = makeDarkHeader;

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openModal = openModal;
exports.closeModal = closeModal;

var _constants = require("../modules/_constants");

var _functions = require("../modules/_functions");

var _form = require("./form");

var _bodyScrollLock = require("body-scroll-lock");

var openButtons = document.querySelectorAll('[data-toggle="modal"]') || [];
var closeButtons = document.querySelectorAll('[data-toggle="close-modal"]') || [];
var body = document.querySelector('body');
var header = document.querySelector('.header');
var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

function closePopupByOuterClick(event) {
  if (!event.target.closest(_constants.MODAL.window) && !(event.target.getAttribute('data-toggle') === 'modal')) {
    closeModal();
  }
}

function openModal(id, title) {
  var modal = document.getElementById(id);
  var modalTitle = modal.querySelector('.form__title');

  if (modalTitle && title) {
    modal.dataset.title = modalTitle.textContent;
    modalTitle.innerHTML = title;
  }

  if (!(0, _functions.isMobileDevice)()) {
    body.classList.add('modal-open');
    body.style.paddingRight = scrollbarWidth + 'px';
    header.style.right = scrollbarWidth + 'px';
  }

  if ((0, _functions.isMobileDevice)()) {
    (0, _bodyScrollLock.disableBodyScroll)(modal, {
      reserveScrollBarGap: true
    });
  }

  setTimeout(function () {
    modal.classList.add('show');
    document.addEventListener('click', closePopupByOuterClick);
  }, 200);
  modal.dispatchEvent(new CustomEvent('modal:beforeOpen'));
}

function closeModal(modal) {
  modal = modal ? modal : document.querySelector('.modal.show');
  modal.classList.add('out');

  if ((0, _functions.isMobileDevice)()) {
    (0, _bodyScrollLock.enableBodyScroll)(modal);
  }

  setTimeout(function () {
    (0, _form.setFormDefaults)(false, modal);
    modal.classList.remove('show');
    modal.classList.remove('out');
    body.classList.remove('modal-open');
    body.style.paddingRight = null;
    header.style.right = null;

    if ('modal-file' === modal.id) {
      var content = modal.querySelector('.modal__content');

      if (content) {
        content.innerHTML = '';
      }
    }

    if (modal.dataset.title) {
      var modalTitle = modal.querySelector('.form__title');

      if (modalTitle) {
        modalTitle.textContent = modal.dataset.title;
        modal.dataset.title = '';
      }
    }
  }, 100);
  document.removeEventListener('click', closePopupByOuterClick);
}

openButtons.forEach(function (btn) {
  return btn.addEventListener('click', function (e) {
    e.preventDefault();
    var id = btn.getAttribute('data-target').replace('#', '');
    var title = btn.getAttribute('data-modal-title');

    if ('modal-file' === id) {
      addFile(btn, id);
    }

    openModal(id, title);
  });
});
closeButtons.forEach(function (btn) {
  return btn.addEventListener('click', function () {
    return closeModal();
  });
});
document.addEventListener('keydown', function (event) {
  var modal = document.querySelector('.modal.show');

  if (event.key === 'Escape' && modal) {
    closeModal(modal);
  }
});

var addFile = function addFile(btn, id) {
  var content = document.querySelector("#".concat(id, " .modal__content"));
  var link = btn.dataset.file;
  content.insertAdjacentHTML('beforeend', "<img src=\"".concat(link, "\">"));
};

},{"../modules/_constants":32,"../modules/_functions":33,"./form":18,"body-scroll-lock":3}],26:[function(require,module,exports){
"use strict";

var routes = document.querySelectorAll('[data-toggle="route"]') || [];
routes.forEach(function (item) {
  var parent = item.closest('.route');
  var targetValue = item.dataset.target;
  var target = parent.querySelector('[data-route-value=' + targetValue + ']');
  var images = parent.querySelectorAll('[data-route-value');

  var removeActivity = function removeActivity() {
    var activeIndex = Object.values(routes).findIndex(function (item) {
      return item.classList.contains('active');
    });
    images[activeIndex].classList.remove('active');
    routes[activeIndex].classList.remove('active');
  };

  var setActivity = function setActivity(item, target) {
    item.classList.add('active');
    target.classList.add('active');
  };

  var changeRoute = function changeRoute() {
    removeActivity();
    setActivity(item, target);
  };

  item.addEventListener('click', function () {
    routes.forEach(function (item) {
      return item.classList.remove('clicked');
    });
    item.classList.add('clicked');
    changeRoute();
  });
  item.addEventListener('mouseenter', function () {
    return changeRoute();
  });
  item.addEventListener('mouseleave', function () {
    var clickedItem = parent.querySelector('.clicked');
    var targetClickedValue = clickedItem.dataset.target;
    var targetClicked = parent.querySelector('[data-route-value=' + targetClickedValue + ']');
    removeActivity();
    setActivity(clickedItem, targetClicked);
  });
});
var imagesWrap = document.querySelector('.route__images');

var switchActivity = function switchActivity() {
  document.querySelectorAll('[data-route-value').forEach(function (item) {
    return item.classList.toggle('active');
  });
  routes.forEach(function (item) {
    return item.classList.toggle('active');
  });
};

if (imagesWrap) {
  imagesWrap.addEventListener('mouseenter', switchActivity);
  imagesWrap.addEventListener('mouseleave', switchActivity);
  imagesWrap.addEventListener('touchend', switchActivity);
}

},{}],27:[function(require,module,exports){
"use strict";

var links = document.querySelectorAll('.aside-menu__link') || [];
links.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    var target = link.getAttribute('href');
    var offset = document.querySelector(target).getBoundingClientRect().top + window.scrollY - document.querySelector('.header').getBoundingClientRect().height - 50;
    document.querySelector('.aside-menu__link.active').classList.remove('active');
    link.classList.add('active');
    window.scrollTo({
      top: offset,
      behavior: "smooth"
    });
  });
});

},{}],28:[function(require,module,exports){
"use strict";

var targets = document.querySelectorAll('[data-spy-target]') || [];
var sections = {};
var i = 0;
targets.forEach(function (target) {
  return sections[target.id] = target.getBoundingClientRect().top + window.scrollY - document.querySelector('.header').getBoundingClientRect().height - 100;
});

window.onscroll = function () {
  var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

  for (i in sections) {
    if (sections[i] <= scrollPosition) {
      document.querySelector('.anchor-spy.active').classList.remove('active');
      document.querySelector('a[href*=' + i + ']').classList.add('active');
    }
  }
};

},{}],29:[function(require,module,exports){
"use strict";

var _functions = require("../modules/_functions");

var sliders = document.querySelectorAll('.slider');
var sliderParams = {
  duration: 200,
  easing: 'ease-out',
  startIndex: 0,
  draggable: true,
  multipleDrag: true,
  threshold: 20,
  loop: true,
  rtl: false,
  onInit: function onInit() {},
  onChange: function onChange() {}
};
sliders.forEach(function (item) {
  var thisParams = Object.create(sliderParams);
  thisParams.selector = item;
  var slidesPerPage = item.getAttribute('data-perPage');

  switch (slidesPerPage) {
    case '4':
      thisParams.perPage = {
        0: 1,
        768: 2,
        992: 3,
        1200: 4
      };
      thisParams.dots = true;
      thisParams.nav = false;
      break;

    case '1':
      thisParams.nav = true;
      thisParams.dots = true;
      thisParams.perPage = 1;
      break;

    default:
      thisParams.nav = true;
      thisParams.perPage = 1;
      break;
  }

  if (item.children.length) {
    (function () {
      var slider = new Siema(thisParams);
      var arrow = '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.35348 0.646484L0.646371 1.35359L6.29282 7.00004L0.646371 12.6465L1.35348 13.3536L7.70703 7.00004L1.35348 0.646484Z" fill="#1F232C"/></svg>';

      if (slider.config.nav) {
        var navWrap = document.createElement('div');
        var prev = document.createElement('button');
        var next = document.createElement('button');
        navWrap.classList.add('slider__nav');
        prev.classList.add('slider__prev');
        next.classList.add('slider__next');
        prev.setAttribute('aria-label', 'previos');
        next.setAttribute('aria-label', 'next');
        prev.insertAdjacentHTML('beforeend', arrow);
        next.insertAdjacentHTML('beforeend', arrow);
        item.after(navWrap);
        navWrap.append(prev);
        navWrap.append(next);
        prev.addEventListener('click', function () {
          slider.prev();

          if (slider.config.dots) {
            makeActiveDot(slider);
          }
        });
        next.addEventListener('click', function () {
          slider.next();

          if (slider.config.dots) {
            makeActiveDot(slider);
          }
        });
      }

      if (slider.config.dots) {
        var dotsWrap = document.createElement('div');
        dotsWrap.classList.add('slider__dots');
        item.after(dotsWrap);

        var _loop = function _loop(i) {
          var dot = document.createElement('button');
          dot.setAttribute('aria-label', 'slider-dot');

          if (i === 0) {
            dot.classList.add('active');
          }

          dotsWrap.append(dot);
          dot.addEventListener('click', function () {
            slider.goTo(i);
            makeActive(dot);
          });
        };

        for (var i = 0; i < slider.innerElements.length; i++) {
          _loop(i);
        }
      }

      if (slider.config.draggable) {
        slider.selector.addEventListener('touchend', function () {
          return makeActiveDot(slider);
        });
        slider.selector.addEventListener('mouseup', function () {
          return makeActiveDot(slider);
        });
      }
    })();
  }
});

var makeActive = function makeActive(elem) {
  (0, _functions.getSiblings)(elem).forEach(function (item) {
    item.classList.remove('active');
  });
  elem.classList.add('active');
};

var makeActiveDot = function makeActiveDot(slider) {
  var dots = document.querySelectorAll('.slider__dots button') || [];
  dots.forEach(function (dot) {
    dot.classList.remove('active');
  });
  document.querySelector('.slider__dots button:nth-child(' + (slider.currentSlide + 1) + ')').classList.add('active');
};

},{"../modules/_functions":33}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabsHeight = void 0;
var tabs = document.querySelectorAll('[data-element="tabs"]');

var tabsHeight = function tabsHeight() {
  tabs.forEach(function (currentTabs) {
    if (currentTabs.getAttribute('data-tabs-height') === 'auto') {
      currentTabs.querySelector('.tabs__body').style.minHeight = currentTabs.querySelector('.tabs__pane.active').getBoundingClientRect().height + 'px';
    } else {
      var tabsPanes = currentTabs.querySelectorAll('.tabs__pane');
      var panesHeights = [];
      tabsPanes.forEach(function (pane) {
        return panesHeights.push(pane.getBoundingClientRect().height);
      });
      currentTabs.querySelector('.tabs__body').style.minHeight = Math.max.apply(null, panesHeights) + 'px';
    }
  });
};

exports.tabsHeight = tabsHeight;

if (tabs) {
  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(tabsHeight, 200);
  });
  window.addEventListener('resize', tabsHeight);
}

tabs.forEach(function (currentTabs) {
  var tabControls = currentTabs.querySelectorAll('[data-tab-toggle]');
  var panes = currentTabs.querySelectorAll('.tabs__pane');
  var accordions = currentTabs.querySelectorAll('.tabs__content');
  var tabTogglers = currentTabs.querySelectorAll('[data-toggle="tab"]');
  var tabsBody = currentTabs.querySelector('.tabs__body');
  var tabsHead = currentTabs.querySelector('.tabs__head');

  var changeTab = function changeTab(direction) {
    direction = direction ? direction : 'next';
    var activeTabIndex = Object.values(panes).findIndex(function (item) {
      return item.classList.contains('active');
    });
    var nextTabIndex = direction === 'prev' ? (activeTabIndex + panes.length - 1) % panes.length : (activeTabIndex + 1) % panes.length;
    var nextTab = panes[nextTabIndex];

    if (nextTab) {
      tabTogglers[activeTabIndex].classList.remove('active');
      panes[activeTabIndex].classList.remove('active');
      panes[nextTabIndex].classList.add('active');
      tabTogglers[nextTabIndex].classList.add('active');

      if (tabsHead && window.innerWidth < 992) {
        var nextLinkLeftPosition = tabTogglers[nextTabIndex].offsetLeft;
        tabsHead.scrollTo({
          left: nextLinkLeftPosition,
          behavior: 'smooth'
        });
      }
    }

    if (currentTabs.getAttribute('data-tabs-height') === 'auto') {
      tabsHeight();
    }
  };

  var tabsGroupsEvents = new Hammer(tabsBody);

  var handlePan = function handlePan(e) {
    var currentPane = e.target.closest('.tabs__pane');

    switch (e.type) {
      case 'panleft':
      case 'panright':
        if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaY) < 50) {
          currentPane.style.transform = "translateX(".concat(e.deltaX + 'px', ")");
        }

        break;

      case 'panend':
      case 'pancancel':
        if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaY) < 50) {
          if (e.deltaX > 0) {
            changeTab('prev');
          } else {
            changeTab();
          }
        }

        currentPane.style.transform = '';
        break;
    }
  };

  var handleHammer = function handleHammer(e) {
    switch (e.type) {
      case 'panleft':
      case 'panright':
      case 'panend':
      case 'pancancel':
        handlePan(e);
        break;
    }
  };

  tabControls.forEach(function (control) {
    control.addEventListener('click', function () {
      changeTab(control.getAttribute('data-tab-toggle'));
    });
  });
  tabTogglers.forEach(function (toggler) {
    var changeTabByToggler = function changeTabByToggler() {
      var isMobileAccordion = toggler.classList.contains('tabs__link--accordion') && window.innerWidth < 992;
      var targetValue = toggler.getAttribute('data-target');
      var target = isMobileAccordion ? tabsHead.querySelectorAll('[data-tab-content=' + targetValue + ']') : tabsBody.querySelectorAll('[data-tab-content=' + targetValue + ']');
      tabTogglers.forEach(function (toggler) {
        return toggler.classList.remove('active');
      });

      if (isMobileAccordion) {
        accordions.forEach(function (accordionPane) {
          return accordionPane.classList.remove('active');
        });
        toggler.classList.toggle('active');
        target.forEach(function (pane) {
          return pane.classList.toggle('active');
        });
      } else {
        panes.forEach(function (pane) {
          return pane.classList.remove('active');
        });
        toggler.classList.add('active');
        target.forEach(function (pane) {
          return pane.classList.add('active');
        });
      }

      if (currentTabs.getAttribute('data-tabs-height') === 'auto') {
        tabsHeight();
      }
    };

    toggler.addEventListener('click', changeTabByToggler);
    toggler.addEventListener('keydown', function (e) {
      return e.key === 'Enter' && changeTabByToggler();
    });
  });

  if (window.innerWidth < 992) {
    tabsGroupsEvents.on('panleft panright panend pancancel', handleHammer);
  }

  var centerNav = function centerNav() {
    var tabsNav = currentTabs.querySelector('.tabs__nav--tabs, .tabs__nav--extended');

    if (window.innerWidth < 992 && tabsNav) {
      if (tabsNav && tabsNav.clientWidth > tabsHead.clientWidth) {
        tabsHead.style.justifyContent = 'flex-start';
      } else {
        tabsHead.style.justifyContent = 'center';
      }
    } else {
      tabsHead.style = '';
    }
  };

  window.addEventListener('DOMContentLoaded', centerNav);
  window.addEventListener('resize', centerNav);
});

},{}],31:[function(require,module,exports){
"use strict";

var tooltipTogglers = document.querySelectorAll('[data-toggle="tooltip"]');
tooltipTogglers.forEach(function (tooltipToggler) {
  var tooltip = tooltipToggler.querySelector('.tooltip');
  var isDcMap = tooltipToggler.classList.contains('dc-map__point');
  var activeByClick = tooltipToggler.getAttribute('data-activateBy') === 'click';

  var showTooltip = function showTooltip() {
    tooltip.classList.add('show');

    if (isDcMap) {
      tooltipToggler.querySelector('.dc-map__dot').classList.add('active');
    }
  };

  var hideTooltip = function hideTooltip() {
    tooltip.classList.remove('show');

    if (isDcMap) {
      tooltipToggler.querySelector('.dc-map__dot').classList.remove('active');
    }
  };

  var hideTooltipByOuterClick = function hideTooltipByOuterClick(e) {
    if (!e.target.closest('.tooltip') && !e.target.closest('[data-toggle="tooltip"]')) {
      hideTooltip();
    }
  };

  if (!activeByClick) {
    tooltipToggler.addEventListener('mouseover', showTooltip);
    tooltipToggler.addEventListener('mouseleave', hideTooltip);
  } else {
    tooltipToggler.addEventListener('click', function () {
      return tooltip.classList.toggle('show');
    });
  }

  document.addEventListener('click', hideTooltipByOuterClick);
});
var tooltipsGlossary = document.querySelectorAll('[data-toggle="tooltip-glossary"]');
tooltipsGlossary.forEach(function (tooltipGlossary) {
  tooltipGlossary.addEventListener('mouseenter', function () {
    tooltipGlossary.classList.add('active');
    var excerpt = tooltipGlossary.getAttribute('data-excerpt');
    tooltipGlossary.insertAdjacentHTML('beforeend', '<div class="tooltip-glossary__popup">' + '<div class="tooltip-glossary__body">' + excerpt + '</div>' + '</div>');
    var popup = tooltipGlossary.querySelector('.tooltip-glossary__popup');

    if (popup.offsetWidth + tooltipGlossary.getBoundingClientRect().left > window.innerWidth) {
      popup.classList.add('tooltip-glossary__popup--right');
    } else {
      popup.classList.remove('tooltip-glossary__popup--right');
    }

    tooltipGlossary.addEventListener('mouseleave', function () {
      popup.remove();
      tooltipGlossary.classList.remove('active');
    }, {
      once: true
    });
  });
});

},{}],32:[function(require,module,exports){
"use strict";

module.exports = Object.freeze({
  AJAX_URL: '/wp-admin/admin-ajax.php',
  LOAD_MORE: {
    action: 'load_more',
    parent: '.load-wrapper',
    container: '.load-container'
  },
  FORM: {
    field: '.form__field',
    control: '.form__control',
    error: '.error-msg'
  },
  MODAL: {
    module: '.modal',
    window: '.modal__popup',
    content: '.modal__content',
    response: '.modal__response',
    successId: 'modal-success'
  },
  SELECT: {
    classes: {
      'main': 'select',
      'list': 'select__list',
      'current': 'select__current',
      'optionSelected': 'active'
    }
  },
  HOURS_IN_MONTH: 720
});

},{}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMobileDevice = isMobileDevice;
exports.inViewport = inViewport;
exports.getSiblings = getSiblings;
exports.numberThousandSeparator = numberThousandSeparator;
exports["default"] = void 0;

/**
 * @param {String} data
 *
 * @return {String}
 */
var _default = Element.prototype.data = function (data) {
  return this.getAttribute('data-' + data);
};
/**
 * @return {Boolean}
 */


exports["default"] = _default;

function isMobileDevice() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
}
/**
 * @param {Element} element
 *
 * @return {Boolean}
 */


function inViewport(element) {
  return !(element.getBoundingClientRect().top > innerHeight || element.getBoundingClientRect().bottom < 0);
}
/**
 * @param {Element} element
 *
 * @return {Array}
 */


function getSiblings(element) {
  return Array.prototype.filter.call(element.parentNode.children, function (sibling) {
    return sibling !== element;
  });
}
/**
 * @param {Number} n
 *
 * @return {String}
 */


function numberThousandSeparator(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AjaxHandler = /*#__PURE__*/function () {
  function AjaxHandler(options) {
    _classCallCheck(this, AjaxHandler);

    this.options = options;
    this.form = this.options.form;
    this.btn = this.form ? this.form.querySelector('button[type="submit"]') : this.options.btn ? this.options.btn : null;
  }

  _createClass(AjaxHandler, [{
    key: "onResponseSuccess",
    value: function onResponseSuccess(callback) {
      if (callback) {
        callback();
      }
    }
  }, {
    key: "onResponseFalse",
    value: function onResponseFalse(callback) {
      if (callback) {
        callback();
      }
    }
  }, {
    key: "onAjaxHandlerProcess",
    value: function onAjaxHandlerProcess(callback) {
      if (callback) {
        callback();
      }
    }
  }, {
    key: "send",
    value: function send(data, callbackSuccess, callbackFalse, callbackProcess) {
      var _this = this;

      // Event to modify data before ajax sending
      var beforeSubmitEvent;
      var xhr = new XMLHttpRequest();

      if (this.form) {
        beforeSubmitEvent = new CustomEvent('ajax:beforeSubmit', {
          'detail': {
            formData: data
          }
        });
        this.form.dispatchEvent(beforeSubmitEvent);
      }

      xhr.open('POST', this.options.url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(beforeSubmitEvent ? beforeSubmitEvent.detail.formData : data);

      this._disableBtn();

      this._loadingBtn();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          setTimeout(function () {
            var response;

            try {
              response = JSON.parse(xhr.responseText);
            } catch (e) {
              response = xhr.responseText;
            }

            _this._enableBtn();

            _this._activateBtn();

            _this.response = response;

            if (response.status === 'error') {
              _this.onResponseFalse(callbackFalse);
            } else {
              _this.onResponseSuccess(callbackSuccess);
            }
          }, 1000);
        }
      };
    }
  }, {
    key: "_disableBtn",
    value: function _disableBtn() {
      if (this.btn) {
        this.btn.setAttribute('disabled', 'disabled');
      }
    }
  }, {
    key: "_enableBtn",
    value: function _enableBtn() {
      if (this.btn) {
        this.btn.removeAttribute('disabled');
      }
    }
  }, {
    key: "_loadingBtn",
    value: function _loadingBtn() {
      if (this.btn) {
        this.btn.classList.add('loading');
      }
    }
  }, {
    key: "_activateBtn",
    value: function _activateBtn() {
      if (this.btn) {
        this.btn.classList.remove('loading');
      }
    }
  }]);

  return AjaxHandler;
}();

var _default = AjaxHandler;
exports["default"] = _default;

},{}],35:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param {String} ymGoal
 * @param {Object} gaGoal
 * @param {String} gadsGoal
 */
module.exports.reachGoals = function (ymGoal, gaGoal, gadsGoal) {
  var ymCounterTag = document.querySelector('[name="yandex-counter-number"]');
  var ymCounterNumber = ymCounterTag ? ymCounterTag.getAttribute('content') : '';
  var ym = 'yaCounter' + ymCounterNumber;
  var gadsIdTag = document.querySelector('[name="google-ads-id"]');
  var gadsId = gadsIdTag ? gadsIdTag.getAttribute('content') : '';
  var gaGoalIsSet = typeof gaGoal.goal !== 'undefined' && typeof gaGoal.action !== 'undefined' && typeof gaGoal.category !== 'undefined';

  if (typeof ymCounterNumber !== 'undefined' && typeof window[ym] !== 'undefined' && ymCounterNumber.length && typeof ymGoal !== 'undefined') {
    window[ym].reachGoal(ymGoal);

    if (gaGoalIsSet) {
      window.yaParams = _defineProperty({}, gaGoal.category, _defineProperty({}, gaGoal.action, _defineProperty({}, gaGoal.goal, [window.location.href.split('?')[0]])));
      window[ym].params(window.yaParams || {});
    }
  }

  if (typeof ga !== 'undefined' && gaGoalIsSet) {
    ga('send', 'event', gaGoal.category, gaGoal.action, gaGoal.goal);
  }

  if (typeof gtag !== 'undefined' && typeof gadsGoal !== 'undefined' && gadsGoal.length && gadsId !== '') {
    gtag('event', 'conversion', {
      'send_to': gadsId + '/' + gadsGoal
    });
  }
};

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GreatSelect = /*#__PURE__*/function () {
  /**
   * @param {String} itemsSelector
   * @param {Object} options
   */
  function GreatSelect(itemsSelector, options) {
    _classCallCheck(this, GreatSelect);

    this.classes = {
      'main': 'great-select',
      'opened': 'open',
      'disabled': 'disabled',
      'list': 'list',
      'option': 'option',
      'current': 'current',
      'optionSelected': 'selected',
      'optionFocused': 'focus'
    };

    if (options && options.classes) {
      for (var optionClass in options.classes) {
        this.classes[optionClass] = options.classes[optionClass];
      }
    }

    this.selectItems = document.querySelectorAll(itemsSelector);
  }

  _createClass(GreatSelect, [{
    key: "init",
    value: function init() {
      var _this = this;

      //this._removeListeners();
      GreatSelect._iePointerEventsFix();

      this.selectItems.forEach(function (item) {
        var nextElement = item.nextElementSibling;
        item.style.display = 'none';

        if (!nextElement || nextElement && !nextElement.classList.contains(_this.classes.main)) {
          _this._createSelect(item);
        }
      });

      this._addGlobalListeners();
    }
  }, {
    key: "_createSelect",
    value: function _createSelect(selectItem) {
      var _this2 = this;

      var selectDisabled = selectItem.getAttribute('disabled');
      var selectContainer = '<div class="' + this.classes.main + ' great-select ' + (selectItem.getAttribute('class') || '') + (selectDisabled ? this.classes.disabled : '') + '" ' + '' + (!selectDisabled ? 'tabindex="0"' : '') + '>' + '<span class="' + this.classes.current + '"></span>' + '<ul class="' + this.classes.list + '"></ul>' + '</div>';
      selectItem.insertAdjacentHTML('afterend', selectContainer);
      var dropdown = selectItem.nextElementSibling;
      var options = selectItem.querySelectorAll('option');
      var selectedOption = selectItem.querySelector('option:checked');
      var optionsContainer = dropdown.querySelector('ul');
      var icon = selectedOption.getAttribute('data-select-icon');
      dropdown.querySelector('.' + this.classes.current).innerHTML = "".concat(icon ? "<span class=\"select__icon\"><img src=\"".concat(icon, "\" alt=\"\"></span>") : '', " ").concat(selectedOption.getAttribute('data-display') || selectedOption.getAttribute('data-shorter-name') || selectedOption.textContent);
      options.forEach(function (option) {
        var displayText = option.getAttribute('data-display');
        var shorterName = option.getAttribute('data-shorter-name');
        var icon = option.getAttribute('data-select-icon');
        var optionItem = "<li data-value=\"".concat(option.value, "\" data-select-icon=\"").concat(icon, "\" \n          ").concat(displayText ? 'data-display="' + displayText + '"' : '', "\n          ").concat(shorterName ? 'data-shorter-name="' + shorterName + '"' : '', "\n          class=\"").concat(_this2.classes.option, " ").concat(option.selected ? _this2.classes.optionSelected : '', " ").concat(option.disabled ? _this2.classes.disabled : '', "\">\n          ").concat(icon ? "<span class=\"select__icon\"><img src=\"".concat(icon, "\" alt=\"\"></span>") : '', "\n          <span>").concat(option.textContent, "</span>\n          </li>");
        optionsContainer.insertAdjacentHTML('beforeend', optionItem);
      });

      this._addSelectListeners(selectItem.nextElementSibling, selectItem.previousElementSibling);
    }
  }, {
    key: "_removeListeners",
    value: function _removeListeners() {
      var allSelects = document.querySelectorAll('.' + this.classes.main);
      allSelects.forEach(function (select) {
        var clone = select.cloneNode(true);
        select.parentNode.replaceChild(clone, select);
      });
    }
  }, {
    key: "_addSelectListeners",
    value: function _addSelectListeners(gSelectItem, label) {
      var _this3 = this;

      gSelectItem.addEventListener('click', function (e) {
        var dropdown = e.target.closest('.' + _this3.classes.main);
        document.querySelectorAll('.' + _this3.classes.main).forEach(function (item) {
          if (item !== dropdown) {
            item.classList.remove(_this3.classes.opened);
          }
        });
        dropdown.classList.toggle(_this3.classes.opened);

        if (dropdown.classList.contains(_this3.classes.opened)) {
          var focusedOption = dropdown.querySelector('.' + _this3.classes.optionFocused);

          if (focusedOption) {
            focusedOption.classList.remove(_this3.classes.optionFocused);
          }

          dropdown.querySelector('.' + _this3.classes.optionSelected).classList.add(_this3.classes.optionFocused);
        } else {
          dropdown.focus();
        }
      });
      var activeOptions = gSelectItem.querySelectorAll('.' + this.classes.option + ':not(.' + this.classes.disabled + ')');
      activeOptions.forEach(function (option) {
        return option.addEventListener('click', function (e) {
          var targetOption = e.target.closest('.' + _this3.classes.option);
          var icon = option.getAttribute('data-select-icon');
          gSelectItem.querySelector('.' + _this3.classes.optionSelected).classList.remove(_this3.classes.optionSelected);
          targetOption.classList.add(_this3.classes.optionSelected);
          gSelectItem.querySelector('.' + _this3.classes.current).innerHTML = "".concat(icon ? "<span class=\"select__icon\"><img src=\"".concat(icon, "\" alt=\"\"></span>") : '', " ").concat(targetOption.getAttribute('data-display') || targetOption.getAttribute('data-shorter-name') || targetOption.textContent);
          gSelectItem.previousElementSibling.value = targetOption.getAttribute('data-value');
          gSelectItem.previousElementSibling.dispatchEvent(new CustomEvent('change'));
        });
      });
      gSelectItem.addEventListener('keydown', function (e) {
        var targetDropdown = e.target.closest('.' + _this3.classes.main);
        var focusedOption = targetDropdown.querySelector('.' + _this3.classes.optionFocused) || targetDropdown.querySelector('.' + _this3.classes.option + '.' + _this3.classes.optionSelected);

        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();

          if (targetDropdown.classList.contains(_this3.classes.opened)) {
            focusedOption.click();
          } else {
            targetDropdown.click();
          }
        } else if (e.code === 'ArrowDown') {
          e.preventDefault();

          if (!targetDropdown.classList.contains(_this3.classes.opened)) {
            targetDropdown.click();
          } else {
            //TODO: find next not disabled
            //var $next = $focused_option.nextAll('.option:not(.disabled)').first();
            // let nextAll = false;
            // nextAll = [].filter.call(focusedOption.parentNode.children,  elem => {
            //     return (elem.previousElementSibling === focusedOption) ? nextAll = true : nextAll;
            // });
            var next = focusedOption.nextElementSibling;

            if (next) {
              targetDropdown.querySelector('.' + _this3.classes.optionFocused).classList.remove(_this3.classes.optionFocused);
              next.classList.add(_this3.classes.optionFocused);
            }
          }
        } else if (e.code === 'ArrowUp') {
          e.preventDefault();

          if (!targetDropdown.classList.contains(_this3.classes.opened)) {
            targetDropdown.click();
          } else {
            //TODO: find prev not disabled
            var prev = focusedOption.previousElementSibling;

            if (prev) {
              targetDropdown.querySelector('.' + _this3.classes.optionFocused).classList.remove(_this3.classes.optionFocused);
              prev.classList.add(_this3.classes.optionFocused);
            }
          }
        } else if (e.code === 'Escape') {
          targetDropdown.classList.remove(_this3.classes.opened);
        } else if (e.code === 'Tab') {
          if (targetDropdown.classList.contains(_this3.classes.opened)) {
            e.preventDefault();
          }
        }
      });
      label.addEventListener('click', function () {
        gSelectItem.focus();
      });
    }
  }, {
    key: "_addGlobalListeners",
    value: function _addGlobalListeners() {
      var _this4 = this;

      document.addEventListener('click', function (e) {
        var openedSelect = document.querySelector('.' + _this4.classes.main + '.' + _this4.classes.opened);

        if (openedSelect && !openedSelect.contains(e.target)) {
          openedSelect.classList.remove(_this4.classes.opened);
        }
      });
    }
  }, {
    key: "update",
    value: function update() {
      var _this5 = this;

      this.selectItems.forEach(function (select) {
        var dropdown = select.nextElementSibling;
        var opened = dropdown.classList.contains(_this5.classes.opened);

        if (dropdown && dropdown.classList.contains(_this5.classes.main)) {
          dropdown.remove();

          _this5._createSelect(select);

          if (opened) {
            select.nextElementSibling.click();
          }
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this6 = this;

      this.selectItems.forEach(function (select) {
        var dropdown = select.nextElementSibling;

        if (dropdown && dropdown.classList.contains(_this6.classes.main)) {
          dropdown.remove();
          select.style.display = '';
        }
      });
    }
  }], [{
    key: "_iePointerEventsFix",
    value: function _iePointerEventsFix() {
      // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
      var style = document.createElement('a').style;
      style.cssText = 'pointer-events:auto';

      if (style.pointerEvents !== 'auto') {
        document.querySelector('html').classList.add('no-csspointerevents');
      }
    }
  }]);

  return GreatSelect;
}();

exports["default"] = GreatSelect;

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MicroRanger = /*#__PURE__*/function () {
  /**
   * @param {HTMLInputElement} element
   * @param {Object} options
   */
  function MicroRanger(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MicroRanger);

    if (!element.hasAttribute('type') || element.type !== 'range') {
      throw new Error('The input must be a type of range.');
    }

    this.ranger = element;
    this.range = [];
    this.options = this._mergeOptions(options);
    /**
     * @type {HTMLElement}
     */

    this.parent = this.ranger.parentElement;
    this.valuer = this.parent.querySelector('[data-role="range-value"');
    this.progress = this.parent.querySelector('[data-role="range-progress"');
    this.controls = this.parent.querySelectorAll('[data-role="range-btn"');

    this._generateRange();

    this._rangeListener();

    this._valuerListener();

    this._updateRangerAttributes();

    if (this.controls) {
      this._controlsListener();
    }

    this._createFakeInput();
  }
  /**
   * Overrides default options with custom ones.
   *
   * @param {Object} options
   *
   * @return {Object}
   */


  _createClass(MicroRanger, [{
    key: "_mergeOptions",
    value: function _mergeOptions(options) {
      var defaults = {
        min: parseInt(this.ranger.min),
        max: parseInt(this.ranger.max),
        step: this.ranger.step.length ? parseInt(this.ranger.step) : 1,
        suffix: '',
        map: {},
        acceleration: false,
        accParams: {
          factor: 10,
          steps: null
        }
      };
      Object.keys(options).forEach(function (key) {
        defaults[key] = options[key];
      }); // Create steps map from an array.

      if (Array.isArray(defaults.map) && defaults.map.length) {
        var map = {};
        var mapLength = defaults.map.length;
        var i = 1; // override ranger params to map minimals

        this.ranger.min = i.toString();
        this.ranger.value = i.toString();

        for (i; i <= mapLength; i++) {
          map[i] = defaults.map.shift();
        }

        defaults.map = map;
      }

      return defaults;
    }
  }, {
    key: "_generateRange",
    value: function _generateRange() {
      for (var i = this.options.min; i <= this.options.max; i += this.options.step) {
        this.range.push(Object.keys(this.options.map).length ? this.options.map[i] : i);
      }
    }
  }, {
    key: "_updateRangerAttributes",

    /**
     * Overrides ranger attributes if acceleration is set up.
     *
     * @private
     */
    value: function _updateRangerAttributes() {
      if (this.options.acceleration && this.options.accParams.factor === parseInt(this.options.accParams.factor, 10)) {
        var factor = this.options.step;
        var key = this.options.min;

        for (var i = key; i <= this.options.max; i += factor) {
          this.options.map[key] = i;
          key += this.options.step;

          if (i / factor === this.options.accParams.factor) {
            factor *= this.options.accParams.factor;
          }
        }

        this.ranger.max = (key - this.options.step).toString();
      }
    }
  }, {
    key: "_createFakeInput",
    value: function _createFakeInput() {
      this.fakeInput = document.createElement('div');
      this.fakeInput.style.width = this.valuer.getBoundingClientRect().width + 'px';
      this.parent.insertBefore(this.fakeInput, this.valuer);

      this._toggleInputs();

      this._fakeInputListener();

      this._valuerBlurListener();

      this._updateFakeInput();
    }
  }, {
    key: "_rangeListener",
    value: function _rangeListener() {
      var _this = this;

      this.ranger.oninput = function (e) {
        _this._updateValue();

        _this._updateProgress();
      };

      this.ranger.addEventListener('mouseup', function () {
        return _this.ranger.blur();
      });
    }
  }, {
    key: "_valuerListener",
    value: function _valuerListener() {
      var _this2 = this;

      this.valuer.addEventListener('change', function (e) {
        var value = parseInt(_this2.valuer.value);

        var closest = _this2.range.reduce(function (closest, element) {
          return Math.abs(element - value) < Math.abs(closest - value) ? element : closest;
        }); // Pass the key of the steps map value if the map exists.


        if (Object.keys(_this2.options.map).length) {
          closest = Object.keys(_this2.options.map).find(function (key) {
            return _this2.options.map[key] === closest;
          });
        }

        _this2.updateValue(closest);

        _this2._updateFakeInput();

        _this2._toggleInputs();

        _this2._fireValueOnChange();
      });
    }
  }, {
    key: "_valuerBlurListener",
    value: function _valuerBlurListener() {
      var _this3 = this;

      this.valuer.addEventListener('blur', function (e) {
        if (_this3.fakeInput.style.display === 'none') {
          _this3._toggleInputs();
        }
      });
    }
  }, {
    key: "_controlsListener",
    value: function _controlsListener() {
      var _this4 = this;

      this.controls.forEach(function (control) {
        return control.addEventListener('click', function () {
          var value = parseInt(_this4.ranger.value);
          var direction = control.data('direction');
          value = 'plus' === direction ? value === _this4.options.max ? value : value + _this4.options.step : value === _this4.options.min ? value : value - _this4.options.step;

          _this4.updateValue(value);
        });
      });
    }
  }, {
    key: "_fakeInputListener",
    value: function _fakeInputListener() {
      var _this5 = this;

      this.fakeInput.addEventListener('click', function (e) {
        _this5._toggleInputs();

        _this5.valuer.focus();
      });
    }
  }, {
    key: "_updateFakeInput",
    value: function _updateFakeInput() {
      var _this6 = this;

      var rangerValue = parseInt(this.valuer.value);
      var value = rangerValue;

      if (this.options.acceleration && Object.keys(this.options.accParams.steps).length) {
        Object.keys(this.options.accParams.steps).forEach(function (accStep) {
          if (rangerValue >= accStep) {
            _this6.options.suffix = _this6.options.accParams.steps[accStep];
            value = rangerValue / accStep;
          }
        });
      }

      this.fakeInput.innerText = Math.round(value).toString();

      if (this.options.suffix) {
        this.fakeInput.innerText += ' ' + this.options.suffix;
      }
    }
  }, {
    key: "_toggleInputs",
    value: function _toggleInputs() {
      if (this.valuer.style.display === 'none') {
        this.fakeInput.style.display = 'none';
        this.valuer.style.display = '';
      } else {
        this.fakeInput.style.display = '';
        this.valuer.style.display = 'none';
      }
    }
  }, {
    key: "_fireValueOnChange",
    value: function _fireValueOnChange() {
      this.valuer.dispatchEvent(new CustomEvent('ranger:onChange'));
    }
  }, {
    key: "_updateProgress",
    value: function _updateProgress() {
      this.progress.style.width = (this.ranger.value - this.ranger.min) / (this.ranger.max - this.ranger.min) * 100 + '%';
    }
  }, {
    key: "_updateValue",
    value: function _updateValue() {
      this.valuer.value = Object.keys(this.options.map).length ? this.options.map[this.ranger.value] : this.ranger.value;

      this._fireValueOnChange();

      this._updateFakeInput();
    }
  }, {
    key: "updateValue",
    value: function updateValue(value) {
      this.ranger.value = value;

      this._updateValue();

      this._updateProgress();
    }
  }, {
    key: "updateParams",
    value: function updateParams(params) {
      var _this7 = this;

      Object.keys(params).forEach(function (key) {
        if (_this7.ranger.hasOwnProperty(key)) {
          _this7.ranger[key] = params[key];
        }

        if (_this7.ranger.hasOwnProperty(key)) {
          _this7.ranger[key] = params[key];
        }
      });

      this._generateRange();
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.ranger.value;
    }
  }]);

  return MicroRanger;
}();

exports["default"] = MicroRanger;

},{}],38:[function(require,module,exports){
"use strict";

/**
 * IE Polyfills.
 */
(function () {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    'use strict';

    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

;

(function () {
  // helpers
  var regExp = function regExp(name) {
    return new RegExp('(^| )' + name + '( |$)');
  };

  var forEach = function forEach(list, fn, scope) {
    for (var i = 0; i < list.length; i++) {
      fn.call(scope, list[i]);
    }
  }; // class list object with basic methods


  function ClassList(element) {
    this.element = element;
  }

  ClassList.prototype = {
    add: function add() {
      forEach(arguments, function (name) {
        if (!this.contains(name)) {
          this.element.className += ' ' + name;
        }
      }, this);
    },
    remove: function remove() {
      forEach(arguments, function (name) {
        this.element.className = this.element.className.replace(regExp(name), '');
      }, this);
    },
    toggle: function toggle(name) {
      return this.contains(name) ? (this.remove(name), false) : (this.add(name), true);
    },
    contains: function contains(name) {
      return regExp(name).test(this.element.className);
    },
    // bonus..
    replace: function replace(oldName, newName) {
      this.remove(oldName), this.add(newName);
    }
  }; // IE8/9, Safari

  if (!('classList' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'classList', {
      get: function get() {
        return new ClassList(this);
      }
    });
  } // replace() support for others


  if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
    DOMTokenList.prototype.replace = ClassList.prototype.replace;
  }
})();

if (!Element.prototype.closest) {
  Element.prototype.closest = function (css) {
    var node = this;

    while (node) {
      if (node.matches(css)) return node;else node = node.parentElement;
    }

    return null;
  };
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
}

if ('NodeList' in window && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;

    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

(function () {
  if (typeof window.CustomEvent === 'function') return false; //If not IE

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

if (!Object.values) Object.values = function (o) {
  return Object.keys(o).map(function (k) {
    return o[k];
  });
};

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = Array.prototype.findIndex || function (callback) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    var list = Object(this); // Makes sures is always has an positive integer as length.

    var length = list.length >>> 0;
    var thisArg = arguments[1];

    for (var i = 0; i < length; i++) {
      if (callback.call(thisArg, list[i], i, list)) {
        return i;
      }
    }

    return -1;
  };
}

Math.sign = Math.sign || function (x) {
  x = +x; // преобразуем в число

  if (x === 0 || isNaN(x)) {
    return x;
  }

  return x > 0 ? 1 : -1;
};

},{}]},{},[7]);

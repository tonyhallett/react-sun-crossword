/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Key event names.
 */
exports.KEYDOWN = 'keydown';
exports.KEYPRESS = 'keypress';
exports.KEYUP = 'keyup';


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(3);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SolvingMode;
(function (SolvingMode) {
    SolvingMode[SolvingMode["Guessing"] = 0] = "Guessing";
    SolvingMode[SolvingMode["Solving"] = 1] = "Solving";
    SolvingMode[SolvingMode["Cheating"] = 2] = "Cheating";
})(SolvingMode = exports.SolvingMode || (exports.SolvingMode = {}));
class Word {
    constructor() {
        this.squares = [];
        this.solvingMode = SolvingMode.Guessing;
    }
    _setSolvingMode(solvingMode) {
        this.squares.forEach(square => square.solvingMode = solvingMode);
        this.solvingMode = solvingMode;
    }
    cheat() {
        this._setSolvingMode(SolvingMode.Cheating);
    }
    uncheat() {
        this._setSolvingMode(SolvingMode.Guessing);
    }
    solve() {
        this._setSolvingMode(SolvingMode.Solving);
    }
    unsolve() {
        this._setSolvingMode(SolvingMode.Guessing);
    }
    _setSelectionState(selected) {
        this.squares.forEach(square => square.wordSelected = selected);
        this.selected = selected;
    }
    select() {
        this._setSelectionState(true);
    }
    deselect() {
        this._setSelectionState(false);
    }
}
exports.Word = Word;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const SunCrosswordModelProvider_1 = __webpack_require__(19);
const crosswordPuzzle_1 = __webpack_require__(15);
class CrosswordPuzzleLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { crosswordModel: this.getModel() };
    }
    getModel() {
        var crosswordJson = {
            "data": {
                "headline": "Crossword No 431844",
                "type": "games",
                "meta": {
                    "pdf": "crossword-20170507-23830.pdf",
                    "print_index": "print.html"
                },
                "copy": {
                    "title": "Crossword No 431844",
                    "id": "23830",
                    "description": "",
                    "publisher": "The Sun",
                    "setter": "",
                    "byline": "",
                    "date-publish": "Sunday, 07 May 2017",
                    "date-publish-email": "07 May 2017",
                    "date-publish-analytics": "2017\/05\/07 00:00 sunday",
                    "date-release": "2017-05-07 00:00:00",
                    "date-solution": "2017-05-08 00:00:00",
                    "crosswordtype": "Two Speed",
                    "correctsolutionmessagetext": "You've done it!",
                    "previoussolutiontext": "Previous crossword solution",
                    "previoussolutionlink": "http:\/\/feeds.thesun.co.uk\/puzzles\/crossword\/20170506\/23829\/",
                    "type": "block",
                    "gridsize": {
                        "type": "Standard",
                        "cols": "13",
                        "rows": "13"
                    },
                    "settings": {
                        "solution_hashed": "4ba089e97b12962ceb1b70e6111c9c87",
                        "solution": "CLOSECALL INKR U X S E R NOCTET TREMOLOS S E U R N WSATURATE ASTI  A N E M   NKEYPAD NOSINGE   L P N S  EDGY KINGCRABP R E C O A EFROGMAN LEEKSI A U I I L ETON SOCIALIST"
                    },
                    "hints": {
                        "Mark Errors": "0",
                        "Solve Letter": "0",
                        "Solve Word": "0",
                        "Ask A Friend": "0"
                    },
                    "clues": [
                        {
                            "name": "Cryptic",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "A hundred to miss summons &ndash; a narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Some thinking writers need it?",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Eight players etc to play",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Lot more confused by the musical effect",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Soak a suet-tar concoction",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Firstly, all should try Italian wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Part of phone provides entry device to flat",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Numbers in Greek capital being inquisitive",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Entered gym, somewhat nervous",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Cooks ring back to get crustacean",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Gold initially brought in from an amphibious diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Seeps, it's said, like these vegetables?",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Part of a stone weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing gathering, it's broken up",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Cryptic",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Mark is annoyed",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Show greater endurance than troublesome tout, say",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Outside in vortex, tern alights",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Clever use of statue",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Ogle when dance comes up",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Makes smooth for fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Aware of the monarch about this time",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "Looming, a different Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Look up suitable exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "Serial I translated, from Jerusalem perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Meal outside to choose and take, both unfinished",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Low sound, developed sound",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Surround and harass live group",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Some Aussie museum houses birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Across",
                            "clues": [
                                {
                                    "word": 1,
                                    "number": "1",
                                    "clue": "Narrow escape",
                                    "format": "5,4",
                                    "length": 9,
                                    "answer": "CLOSECALL"
                                },
                                {
                                    "word": 2,
                                    "number": "6",
                                    "clue": "Pen fluid",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "INK"
                                },
                                {
                                    "word": 3,
                                    "number": "8",
                                    "clue": "Band of eight",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "OCTET"
                                },
                                {
                                    "word": 4,
                                    "number": "9",
                                    "clue": "Musical vibration",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "TREMOLO"
                                },
                                {
                                    "word": 5,
                                    "number": "10",
                                    "clue": "Drench",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "SATURATE"
                                },
                                {
                                    "word": 6,
                                    "number": "11",
                                    "clue": "Fizzy wine",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "ASTI"
                                },
                                {
                                    "word": 7,
                                    "number": "13",
                                    "clue": "Console",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "KEYPAD"
                                },
                                {
                                    "word": 8,
                                    "number": "14",
                                    "clue": "Prying",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "NOSING"
                                },
                                {
                                    "word": 9,
                                    "number": "17",
                                    "clue": "Anxious",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EDGY"
                                },
                                {
                                    "word": 10,
                                    "number": "19",
                                    "clue": "Edible crustacean of the North Pacific",
                                    "format": "4,4",
                                    "length": 8,
                                    "answer": "KINGCRAB"
                                },
                                {
                                    "word": 11,
                                    "number": "22",
                                    "clue": "Diver",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "FROGMAN"
                                },
                                {
                                    "word": 12,
                                    "number": "23",
                                    "clue": "Pungent vegetables",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "LEEKS"
                                },
                                {
                                    "word": 13,
                                    "number": "24",
                                    "clue": "Great weight",
                                    "format": "3",
                                    "length": 3,
                                    "answer": "TON"
                                },
                                {
                                    "word": 14,
                                    "number": "25",
                                    "clue": "Left-wing",
                                    "format": "9",
                                    "length": 9,
                                    "answer": "SOCIALIST"
                                }
                            ]
                        },
                        {
                            "name": "Coffee time",
                            "title": "Down",
                            "clues": [
                                {
                                    "word": 15,
                                    "number": "1",
                                    "clue": "Angry",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "CROSS"
                                },
                                {
                                    "word": 16,
                                    "number": "2",
                                    "clue": "Last longer than",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "OUTSTAY"
                                },
                                {
                                    "word": 17,
                                    "number": "3",
                                    "clue": "Lying outside",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "EXTERNAL"
                                },
                                {
                                    "word": 18,
                                    "number": "4",
                                    "clue": "Canny",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "ASTUTE"
                                },
                                {
                                    "word": 19,
                                    "number": "5",
                                    "clue": "Stare suggestively",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "LEER"
                                },
                                {
                                    "word": 20,
                                    "number": "6",
                                    "clue": "Chains, fetters",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "IRONS"
                                },
                                {
                                    "word": 21,
                                    "number": "7",
                                    "clue": "Being aware of",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "KNOWING"
                                },
                                {
                                    "word": 22,
                                    "number": "12",
                                    "clue": "East Asian country",
                                    "format": "8",
                                    "length": 8,
                                    "answer": "MONGOLIA"
                                },
                                {
                                    "word": 23,
                                    "number": "13",
                                    "clue": "Healthy exercises",
                                    "format": "4-3",
                                    "length": 7,
                                    "answer": "KEEPFIT"
                                },
                                {
                                    "word": 24,
                                    "number": "15",
                                    "clue": "From Tel Aviv, perhaps",
                                    "format": "7",
                                    "length": 7,
                                    "answer": "ISRAELI"
                                },
                                {
                                    "word": 25,
                                    "number": "16",
                                    "clue": "Alfresco meal",
                                    "format": "6",
                                    "length": 6,
                                    "answer": "PICNIC"
                                },
                                {
                                    "word": 26,
                                    "number": "18",
                                    "clue": "Sigh loudly",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "GROAN"
                                },
                                {
                                    "word": 27,
                                    "number": "20",
                                    "clue": "Encircle",
                                    "format": "5",
                                    "length": 5,
                                    "answer": "BESET"
                                },
                                {
                                    "word": 28,
                                    "number": "21",
                                    "clue": "Australian birds",
                                    "format": "4",
                                    "length": 4,
                                    "answer": "EMUS"
                                }
                            ]
                        }
                    ],
                    "words": [
                        {
                            "id": 1,
                            "x": "1-9",
                            "y": "1",
                            "solution": "CLOSECALL"
                        },
                        {
                            "id": 2,
                            "x": "11-13",
                            "y": "1",
                            "solution": "INK"
                        },
                        {
                            "id": 3,
                            "x": "1-5",
                            "y": "3",
                            "solution": "OCTET"
                        },
                        {
                            "id": 4,
                            "x": "7-13",
                            "y": "3",
                            "solution": "TREMOLO"
                        },
                        {
                            "id": 5,
                            "x": "1-8",
                            "y": "5",
                            "solution": "SATURATE"
                        },
                        {
                            "id": 6,
                            "x": "10-13",
                            "y": "5",
                            "solution": "ASTI"
                        },
                        {
                            "id": 7,
                            "x": "1-6",
                            "y": "7",
                            "solution": "KEYPAD"
                        },
                        {
                            "id": 8,
                            "x": "8-13",
                            "y": "7",
                            "solution": "NOSING"
                        },
                        {
                            "id": 9,
                            "x": "1-4",
                            "y": "9",
                            "solution": "EDGY"
                        },
                        {
                            "id": 10,
                            "x": "6-13",
                            "y": "9",
                            "solution": "KINGCRAB"
                        },
                        {
                            "id": 11,
                            "x": "1-7",
                            "y": "11",
                            "solution": "FROGMAN"
                        },
                        {
                            "id": 12,
                            "x": "9-13",
                            "y": "11",
                            "solution": "LEEKS"
                        },
                        {
                            "id": 13,
                            "x": "1-3",
                            "y": "13",
                            "solution": "TON"
                        },
                        {
                            "id": 14,
                            "x": "5-13",
                            "y": "13",
                            "solution": "SOCIALIST"
                        },
                        {
                            "id": 15,
                            "x": "1",
                            "y": "1-5",
                            "solution": "CROSS"
                        },
                        {
                            "id": 16,
                            "x": "3",
                            "y": "1-7",
                            "solution": "OUTSTAY"
                        },
                        {
                            "id": 17,
                            "x": "5",
                            "y": "1-8",
                            "solution": "EXTERNAL"
                        },
                        {
                            "id": 18,
                            "x": "7",
                            "y": "1-6",
                            "solution": "ASTUTE"
                        },
                        {
                            "id": 19,
                            "x": "9",
                            "y": "1-4",
                            "solution": "LEER"
                        },
                        {
                            "id": 20,
                            "x": "11",
                            "y": "1-5",
                            "solution": "IRONS"
                        },
                        {
                            "id": 21,
                            "x": "13",
                            "y": "1-7",
                            "solution": "KNOWING"
                        },
                        {
                            "id": 22,
                            "x": "9",
                            "y": "6-13",
                            "solution": "MONGOLIA"
                        },
                        {
                            "id": 23,
                            "x": "1",
                            "y": "7-13",
                            "solution": "KEEPFIT"
                        },
                        {
                            "id": 24,
                            "x": "11",
                            "y": "7-13",
                            "solution": "ISRAELI"
                        },
                        {
                            "id": 25,
                            "x": "7",
                            "y": "8-13",
                            "solution": "PICNIC"
                        },
                        {
                            "id": 26,
                            "x": "3",
                            "y": "9-13",
                            "solution": "GROAN"
                        },
                        {
                            "id": 27,
                            "x": "13",
                            "y": "9-13",
                            "solution": "BESET"
                        },
                        {
                            "id": 28,
                            "x": "5",
                            "y": "10-13",
                            "solution": "EMUS"
                        }
                    ]
                },
                "options": [],
                "competitioncrossword": 0,
                "grid": [
                    [
                        {
                            "SquareID": 1,
                            "Number": "1",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 2,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 3,
                            "Number": "2",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 4,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 5,
                            "Number": "3",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 6,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 7,
                            "Number": "4",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 8,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 9,
                            "Number": "5",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 1,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 10,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 11,
                            "Number": "6",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 12,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 13,
                            "Number": "7",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 2,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 14,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 15,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 16,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 17,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 18,
                            "Number": "",
                            "Letter": "X",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 19,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 20,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 21,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 22,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 23,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 24,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 25,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 26,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 27,
                            "Number": "8",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 28,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 29,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 30,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 31,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 3,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 32,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 33,
                            "Number": "9",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 34,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 35,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 36,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 37,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 38,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 39,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 4,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 40,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 41,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 42,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 43,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 44,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 45,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 46,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 47,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 48,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 19
                        },
                        {
                            "SquareID": 49,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 50,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 51,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 52,
                            "Number": "",
                            "Letter": "W",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 53,
                            "Number": "10",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 15
                        },
                        {
                            "SquareID": 54,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 55,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 56,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 57,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 58,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 59,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 60,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 5,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 61,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 62,
                            "Number": "11",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 63,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 20
                        },
                        {
                            "SquareID": 64,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 65,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 6,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 66,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 67,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 68,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 69,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 70,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 71,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 72,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 18
                        },
                        {
                            "SquareID": 73,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 74,
                            "Number": "12",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 75,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 76,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 77,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 78,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 79,
                            "Number": "13",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 80,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 81,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 16
                        },
                        {
                            "SquareID": 82,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 83,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 84,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 7,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 85,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 86,
                            "Number": "14",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 87,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 88,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 89,
                            "Number": "15",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 90,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 91,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 8,
                            "WordDownID": 21
                        }
                    ],
                    [
                        {
                            "SquareID": 92,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 93,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 94,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 95,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 96,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 17
                        },
                        {
                            "SquareID": 97,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 98,
                            "Number": "16",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 99,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 100,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 101,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 102,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 103,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 104,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        }
                    ],
                    [
                        {
                            "SquareID": 105,
                            "Number": "17",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 106,
                            "Number": "",
                            "Letter": "D",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 107,
                            "Number": "18",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 108,
                            "Number": "",
                            "Letter": "Y",
                            "Blank": "",
                            "WordAcrossID": 9,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 109,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 110,
                            "Number": "19",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 111,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 112,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 113,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 114,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 115,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 116,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 117,
                            "Number": "20",
                            "Letter": "B",
                            "Blank": "",
                            "WordAcrossID": 10,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 118,
                            "Number": "",
                            "Letter": "P",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 119,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 120,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 121,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 122,
                            "Number": "21",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 123,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 124,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 125,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 126,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 127,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 128,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 129,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 130,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 131,
                            "Number": "22",
                            "Letter": "F",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 132,
                            "Number": "",
                            "Letter": "R",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 133,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 134,
                            "Number": "",
                            "Letter": "G",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 135,
                            "Number": "",
                            "Letter": "M",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 136,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 137,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 11,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 138,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 139,
                            "Number": "23",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 140,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 141,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 142,
                            "Number": "",
                            "Letter": "K",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 143,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 12,
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 144,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 145,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 146,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 147,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 148,
                            "Number": "",
                            "Letter": "U",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 149,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 150,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 151,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 152,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 153,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 154,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 155,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 156,
                            "Number": "",
                            "Letter": "E",
                            "Blank": "",
                            "WordAcrossID": "",
                            "WordDownID": 27
                        }
                    ],
                    [
                        {
                            "SquareID": 157,
                            "Number": "24",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 23
                        },
                        {
                            "SquareID": 158,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 159,
                            "Number": "",
                            "Letter": "N",
                            "Blank": "",
                            "WordAcrossID": 13,
                            "WordDownID": 26
                        },
                        {
                            "SquareID": 160,
                            "Number": "",
                            "Letter": "",
                            "Blank": "blank",
                            "WordAcrossID": "",
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 161,
                            "Number": "25",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 28
                        },
                        {
                            "SquareID": 162,
                            "Number": "",
                            "Letter": "O",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 163,
                            "Number": "",
                            "Letter": "C",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 25
                        },
                        {
                            "SquareID": 164,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 165,
                            "Number": "",
                            "Letter": "A",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 22
                        },
                        {
                            "SquareID": 166,
                            "Number": "",
                            "Letter": "L",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 167,
                            "Number": "",
                            "Letter": "I",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 24
                        },
                        {
                            "SquareID": 168,
                            "Number": "",
                            "Letter": "S",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": ""
                        },
                        {
                            "SquareID": 169,
                            "Number": "",
                            "Letter": "T",
                            "Blank": "",
                            "WordAcrossID": 14,
                            "WordDownID": 27
                        }
                    ]
                ],
                "created": "2017-05-08 00:00:21"
            }
        };
        var model = SunCrosswordModelProvider_1.ModelFromJson(crosswordJson);
        return model;
    }
    render() {
        return React.createElement(crosswordPuzzle_1.CrosswordPuzzleKeyEvents, { crosswordModel: this.state.crosswordModel });
    }
}
exports.CrosswordPuzzleLoader = CrosswordPuzzleLoader;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorString = __webpack_require__(10);
var convert = __webpack_require__(8);

var _slice = [].slice;

var skippedModels = [
	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// gray conflicts with some method names, and has its own method defined.
	'gray',

	// shouldn't really be in color-convert either...
	'hex'
];

var hashedModelKeys = {};
Object.keys(convert).forEach(function (model) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
});

var limiters = {};

function Color(obj, model) {
	if (!(this instanceof Color)) {
		return new Color(obj, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	var i;
	var channels;

	if (!obj) {
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (obj instanceof Color) {
		this.model = obj.model;
		this.color = obj.color.slice();
		this.valpha = obj.valpha;
	} else if (typeof obj === 'string') {
		var result = colorString.get(obj);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + obj);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (obj.length) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		var newArr = _slice.call(obj, 0, channels);
		this.color = zeroArray(newArr, channels);
		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
	} else if (typeof obj === 'number') {
		// this is always RGB - can be converted later on.
		obj &= 0xFFFFFF;
		this.model = 'rgb';
		this.color = [
			(obj >> 16) & 0xFF,
			(obj >> 8) & 0xFF,
			obj & 0xFF
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		var keys = Object.keys(obj);
		if ('alpha' in obj) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
		}

		var hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
		}

		this.model = hashedModelKeys[hashedKeys];

		var labels = convert[this.model].labels;
		var color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(obj[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			var limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString: function () {
		return this.string();
	},

	toJSON: function () {
		return this[this.model]();
	},

	string: function (places) {
		var self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString: function (places) {
		var self = this.rgb().round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array: function () {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object: function () {
		var result = {};
		var channels = convert[this.model].channels;
		var labels = convert[this.model].labels;

		for (var i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray: function () {
		var rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject: function () {
		var rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round: function (places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha: function (val) {
		if (arguments.length) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
		}

		return this.valpha;
	},

	// rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return convert[this.model].keyword(this.color);
	},

	hex: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber: function () {
		var rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.rgb().color;

		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.rgb().color;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = this.rgb();
		for (var i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}
		return rgb;
	},

	lighten: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten: function (ratio) {
		var hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken: function (ratio) {
		var hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale: function () {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var rgb = this.rgb().color;
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(val, val, val);
	},

	fade: function (ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer: function (ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate: function (degrees) {
		var hsl = this.hsl();
		var hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix: function (mixinColor, weight) {
		// ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		var color1 = this.rgb();
		var color2 = mixinColor.rgb();
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return Color.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue(),
				color1.alpha() * p + color2.alpha() * (1 - p));
	}
};

// model conversion methods and static constructors
Object.keys(convert).forEach(function (model) {
	if (skippedModels.indexOf(model) !== -1) {
		return;
	}

	var channels = convert[model].channels;

	// conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length) {
			return new Color(arguments, model);
		}

		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}
		return new Color(color, model);
	};
});

function roundTo(num, places) {
	return Number(num.toFixed(places));
}

function roundToPlace(places) {
	return function (num) {
		return roundTo(num, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	model.forEach(function (m) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	});

	model = model[0];

	return function (val) {
		var result;

		if (arguments.length) {
			if (modifier) {
				val = modifier(val);
			}

			result = this[model]();
			result.color[channel] = val;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(val) {
	return Array.isArray(val) ? val : [val];
}

function zeroArray(arr, length) {
	for (var i = 0; i < length; i++) {
		if (typeof arr[i] !== 'number') {
			arr[i] = 0;
		}
	}

	return arr;
}

module.exports = Color;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(2);
var route = __webpack_require__(9);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(2);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

// https://jsperf.com/object-keys-vs-for-in-with-closure/3
var models = Object.keys(conversions);

function buildGraph() {
	var graph = {};

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(3);
var swizzle = __webpack_require__(11);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(12);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color = __webpack_require__(7);
//these all have the same initial lightness but in rgb which is not ideal
//the values are too dark - so is there a way 
//to provide as hsl !
//these are hsl(x, y, 50%) until call the lightness value
var initialLightness = 80;
var greenColor = Color("rgb(0, 255, 17)").lightness(initialLightness);
var redColor = Color("rgb(255, 13, 0)").lightness(initialLightness);
var orangeColor = Color("rgb(255, 132, 0)").lightness(initialLightness);
var yellowColor = Color("rgb(217, 255, 0)").lightness(initialLightness);
var blueColor = Color("rgb(0, 106, 255)").lightness(initialLightness);
//this will be added in at the end
var whiteRgb = "rgb(255, 255, 255)";
var blackRgb = "rgb(0, 0, 0)";
var notSelectedSolutionModeColours = [
    {
        mode: 'Guessing',
        color: blueColor
    }, {
        mode: 'Solved',
        color: greenColor
    }, {
        mode: 'Unsolved',
        color: redColor
    }, {
        mode: 'Cheating',
        color: orangeColor
    }
];
var changeAmount = 0.3;
var selectionModes = [{
        mode: 'notSelected',
        change: 0
    }, {
        mode: 'selected',
        change: 2
    }, {
        mode: 'wordSelected',
        change: 1
    }
];
var styles = {};
selectionModes.forEach(selectionMode => {
    notSelectedSolutionModeColours.forEach(notSelectedSolutionModeColour => {
        styles[selectionMode.mode + notSelectedSolutionModeColour.mode] = {
            backgroundColor: notSelectedSolutionModeColour.color.darken(changeAmount * selectionMode.change).rgb().toString()
        };
    });
});
styles.notSelectedGuessing.backgroundColor = whiteRgb;
styles.blank = { backgroundColor: blackRgb };
exports.commonColourStyles = styles;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const square_1 = __webpack_require__(16);
// State is never set so we use the 'undefined' type.
class Crossword extends React.Component {
    //this is wrong do not want to pass through SquareProps as the selected ?
    render() {
        var squares = this.props.squares;
        var id = 0; //solely for finding in tests
        var trs = squares.map((row, rowIndex) => {
            var tds = row.map((square, index) => {
                id++;
                var square = squares[rowIndex][index];
                //remember that square.selected is callback from the CrosswordPuzzle
                return React.createElement("td", { style: { border: "0px" }, key: index, id: "SquareTd" + id },
                    React.createElement(square_1.Square, { selected: square.selected, letter: square.letter, isSelected: square.isSelected, isWordSelected: square.isWordSelected, solvingMode: square.solvingMode, guess: square.guess, identifier: square.identifier, number: square.number }));
            });
            return React.createElement("tr", { key: rowIndex }, tds);
        });
        //could do above inline  ,
        return React.createElement("table", { style: { backgroundColor: "black", border: "2px solid black", borderCollapse: "collapse" } },
            React.createElement("tbody", null, trs));
    }
}
exports.Crossword = Crossword;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const crossword_1 = __webpack_require__(14);
const KeyEvents = __webpack_require__(21);
class CrosswordPuzzle extends React.Component {
    constructor() {
        super(...arguments);
        //this context lost otherwise
        this.squareSelected = (square) => {
            this.performSelection(square);
        };
    }
    _mapGrid(grid) {
        var self = this;
        var mappedGrid = grid.map(row => {
            return row.map(square => {
                return { identifier: square, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: square.solvingMode, number: square.number, letter: square.letter, guess: square.guess };
            });
        });
        return mappedGrid;
    }
    _selectWord(selectedWord) {
        if (this.props.crosswordModel.selectedWord) {
            //this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
            this.props.crosswordModel.selectedWord.deselect();
        }
        selectedWord.select();
        this.props.crosswordModel.selectedWord = selectedWord;
    }
    _selectSquare(square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square, across) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    performSelection(square, wordSelectWord = false) {
        var requiresRender = false;
        if (square.letter !== "") {
            //leave here as _selectSquare changes
            var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
            var sameSquare = square.selected;
            if (!sameSquare) {
                this._selectSquare(square);
                requiresRender = true;
            }
            var wordToSelect;
            if (square.acrossWord !== null && square.downWord !== null) {
                if (sameSquare) {
                    wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                    requiresRender = true;
                }
                else {
                    var determinePreference = true;
                    if (wordSelectWord) {
                        if (previousSelectedSquare.acrossWord === square.acrossWord || previousSelectedSquare.downWord === square.downWord) {
                            wordToSelect = this.props.crosswordModel.selectedWord;
                            determinePreference = false;
                        }
                    }
                    if (determinePreference) {
                        wordToSelect = square.acrossWord;
                        if (square.number !== "") {
                            if (this._squareIsStartOfWord(square, false)) {
                                if (!this._squareIsStartOfWord(square, true)) {
                                    wordToSelect = square.downWord;
                                }
                            }
                        }
                    }
                }
            }
            else {
                wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
            }
            this._selectWord(wordToSelect);
        }
        if (requiresRender) {
            this.forceUpdate();
        }
    }
    arrowDown() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == numSquaresInColumn - 1 ? 0 : nextSquareRowIndex + 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowLeft() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == 0 ? numSquaresInRow - 1 : nextSquareColIndex - 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowRight() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == numSquaresInRow - 1 ? 0 : nextSquareColIndex + 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    arrowUp() {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == 0 ? numSquaresInColumn - 1 : nextSquareRowIndex - 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, true);
        }
    }
    backspace() {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            selectedSquare.guess = "";
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                }
                else {
                    this.arrowUp();
                }
            }
        }
    }
    render() {
        return React.createElement(crossword_1.Crossword, { squares: this._mapGrid(this.props.crosswordModel.grid) });
    }
    keyGuess(event, keyValue) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            this.props.crosswordModel.selectedSquare.guess = keyValue.toUpperCase();
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length - 1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                }
                else {
                    this.arrowDown();
                }
            }
        }
    }
}
exports.CrosswordPuzzle = CrosswordPuzzle;
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var alphaKeysLower = alphaKeysUpper.map(u => u.toLowerCase());
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches = alphaKeys.map(alphaKey => {
    return {
        methodName: "keyGuess",
        keyMatches: [alphaKey]
    };
});
var arrowMatches = [
    {
        methodName: "arrowLeft",
        keyMatches: ["ArrowLeft"]
    },
    {
        methodName: "arrowRight",
        keyMatches: ["ArrowRight"]
    },
    {
        methodName: "arrowDown",
        keyMatches: ["ArrowDown"]
    },
    {
        methodName: "arrowUp",
        keyMatches: ["ArrowUp"]
    }
];
var backspaceMatch = {
    methodName: "backspace",
    keyMatches: ["Backspace"]
};
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
exports.CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
//import  Radium  =require('radium')
const index_1 = __webpack_require__(4);
const squareLetter_1 = __webpack_require__(17);
const squareNumber_1 = __webpack_require__(18);
const commonColourStyling_1 = __webpack_require__(13);
//@Radium
class Square extends React.Component {
    constructor() {
        super(...arguments);
        this._raiseSelected = () => {
            this.props.selected(this.props.identifier);
        };
    }
    _getBackgroundColorStyle() {
        if (this.props.letter === "") {
            return commonColourStyling_1.commonColourStyles.blank;
        }
        var solvingMode = this.props.solvingMode;
        var isSelected = this.props.isSelected;
        var isWordSelected = this.props.isWordSelected;
        var backgroundColorStyle;
        var propName = "selected";
        if (!isSelected) {
            if (isWordSelected) {
                propName = "wordSelected";
            }
            else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart;
        switch (solvingMode) {
            case index_1.SolvingMode.Cheating:
                solvingModePropPart = "Cheating";
                break;
            case index_1.SolvingMode.Guessing:
                solvingModePropPart = "Guessing";
                break;
            case index_1.SolvingMode.Solving:
                if (this.props.letter === this.props.guess) {
                    solvingModePropPart = "Solved";
                }
                else {
                    solvingModePropPart = "Unsolved";
                }
                break;
        }
        propName = propName + solvingModePropPart;
        backgroundColorStyle = commonColourStyling_1.commonColourStyles[propName];
        return backgroundColorStyle;
    }
    ;
    _getSquareStyle() {
        var baseStyle = {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position: "relative"
        };
        return Object.assign(baseStyle, this._getBackgroundColorStyle());
    }
    _getSquareLetter() {
        var letter = this.props.letter;
        if (this.props.solvingMode !== index_1.SolvingMode.Cheating) {
            letter = this.props.guess;
        }
        return letter;
    }
    render() {
        return React.createElement("span", { onClick: this._raiseSelected, style: this._getSquareStyle() },
            React.createElement(squareNumber_1.SquareNumber, { number: this.props.number }),
            React.createElement(squareLetter_1.SquareLetter, { letter: this._getSquareLetter() }));
    }
}
exports.Square = Square;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class SquareLetter extends React.Component {
    render() {
        return React.createElement("span", { style: { verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight: "28px" } }, this.props.letter);
    }
}
exports.SquareLetter = SquareLetter;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
class SquareNumber extends React.Component {
    render() {
        return React.createElement("span", { style: {
                position: "absolute", left: "2px", top: 0, fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    }
}
exports.SquareNumber = SquareNumber;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
//it will only be necessary to read this the once - after that will be working from IndexedDbModelProvider or JsonModelProvider
const Crossword = __webpack_require__(4);
function ModelFromJson(json) {
    var grid = json.data.grid.map((row, rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare = { columnIndex: columnIndex, rowIndex: rowIndex, acrossWord: null, downWord: null, guess: "", letter: square.Letter, number: square.Number, selected: false, wordSelected: false, solvingMode: Crossword.SolvingMode.Guessing };
            return crosswordSquare;
        });
    });
    var crosswordWords = json.data.copy.words.map(word => {
        var isAcross = true;
        var lengthEnd;
        //"2-12", means starts on 2 finishes on 12 - length = 12-1+1
        var xParts = word.x.split("-"); //*************** X is columns
        var yParts = word.y.split("-"); //*************** Y is rows
        var x = parseInt(xParts[0]); //lowest is 1
        var start = x;
        var y = parseInt(yParts[0]);
        var lengthParts = xParts;
        if (yParts.length == 2) {
            lengthParts = yParts;
            isAcross = false;
            start = y;
        }
        lengthEnd = parseInt(lengthParts[1]);
        var length = lengthEnd - start + 1;
        var crosswordWord = new Crossword.Word();
        crosswordWord.isAcross = isAcross;
        crosswordWord.id = word.id;
        for (var i = 0; i < length; i++) {
            var crosswordSquare = grid[y - 1][x - 1];
            crosswordWord.squares.push(crosswordSquare);
            if (isAcross) {
                crosswordSquare.acrossWord = crosswordWord;
                x = x + 1;
            }
            else {
                crosswordSquare.downWord = crosswordWord;
                y = y + 1;
            }
        }
        return crosswordWord;
    });
    //at the moment it is {"name": "Cryptic","title": "Across",..} , {"name": "Cryptic", "title": "Down",..}, {"name": "Coffee time","title": "Across",},{"name": "Coffee time","title": "Down",}
    var sunCluesByProviderAndDirection = json.data.copy.clues;
    function findCrossword(id) {
        var crossword;
        for (var i = 0; i < crosswordWords.length; i++) {
            var cw = crosswordWords[i];
            if (cw.id === id) {
                crossword = cw;
                break;
            }
        }
        return crossword;
    }
    function mapClues(clues) {
        return clues.map(clue => {
            var crosswordClue = {
                format: clue.format,
                text: clue.clue,
                word: findCrossword(clue.word)
            };
            return crosswordClue;
        });
    }
    //for simplicity...
    var crosswordModel = {
        grid: grid,
        clueProviders: [{ name: "Cryptic", acrossClues: mapClues(sunCluesByProviderAndDirection[0].clues), downClues: mapClues(sunCluesByProviderAndDirection[1].clues) },
            { name: "Coffee time", acrossClues: mapClues(sunCluesByProviderAndDirection[2].clues), downClues: mapClues(sunCluesByProviderAndDirection[3].clues) }
        ],
        selectedSquare: null,
        selectedWord: null
    };
    return crosswordModel;
}
exports.ModelFromJson = ModelFromJson;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
const ReactDOM = __webpack_require__(6);
const CrosswordPuzzleLoader_1 = __webpack_require__(5);
ReactDOM.render(React.createElement(CrosswordPuzzleLoader_1.CrosswordPuzzleLoader, null), document.getElementById("example"));


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* @flow */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(0);
//import {canUseDOM} from 'exenv';
const constants_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(22);
function keyModifiersAny() {
    return {
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        none: true,
        andOr: AndOr.Or
    };
}
exports.keyModifiersAny = keyModifiersAny;
var KeyModifiersEnum;
(function (KeyModifiersEnum) {
    KeyModifiersEnum[KeyModifiersEnum["none"] = 0] = "none";
    KeyModifiersEnum[KeyModifiersEnum["alt"] = 1] = "alt";
    KeyModifiersEnum[KeyModifiersEnum["ctrl"] = 2] = "ctrl";
    KeyModifiersEnum[KeyModifiersEnum["shift"] = 4] = "shift";
    KeyModifiersEnum[KeyModifiersEnum["all"] = 7] = "all";
})(KeyModifiersEnum = exports.KeyModifiersEnum || (exports.KeyModifiersEnum = {}));
var AndOr;
(function (AndOr) {
    AndOr[AndOr["Or"] = 0] = "Or";
    AndOr[AndOr["AndLoose"] = 1] = "AndLoose";
    AndOr[AndOr["AndExact"] = 2] = "AndExact";
})(AndOr = exports.AndOr || (exports.AndOr = {}));
class KeyHandler extends React.Component {
    constructor(props) {
        super(props);
        this.isModifierMatch = (event, modifiers) => {
            var match = true;
            var modKeys = {
                altKey: modifiers.altKey,
                ctrlKey: modifiers.ctrlKey,
                shiftKey: modifiers.shiftKey
            };
            var none = modifiers.none;
            if (modifiers.andOr !== AndOr.Or) {
                if (none) {
                    throw new Error("cannot have none and and");
                }
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        match = event[modKey];
                        if (!match) {
                            break;
                        }
                    }
                }
            }
            else {
                //console.log("in or")//these needs to change to cater for none 
                var noModifiers = true;
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        //console.log("Looking at event " + modKey);
                        match = event[modKey];
                        if (noModifiers) {
                            noModifiers = !match;
                        }
                        if (match) {
                            //console.log("match key: " + modKey);
                            break;
                        }
                    }
                }
                if (!match && noModifiers && none) {
                    //console.log('no modifiers and none');
                    match = true;
                }
            }
            //console.log('is match: ' + match)
            return match;
        };
        this.handleKey = (event) => {
            //console.log("keyhandler component handle key")
            const { keyValue, keyCode, keyMatches, onKeyHandle } = this.props;
            if (!onKeyHandle) {
                return;
            }
            const { target } = event;
            if (target instanceof HTMLElement && utils_1.isInput(target)) {
                return;
            }
            //console.log("Before keyMatches");
            var matchingIds = [];
            var matches;
            if (keyMatches) {
                //console.log("In key matches");
                //could have mapped all to Array<ModKey> but then would have had unnecessary looping
                if (keyMatches instanceof Array) {
                    for (var i = 0; i < keyMatches.length; i++) {
                        var keyOrModKey = keyMatches[i];
                        var key;
                        var mod = keyModifiersAny();
                        var id = null;
                        if (typeof keyOrModKey === 'string') {
                            key = keyOrModKey;
                        }
                        else {
                            key = keyOrModKey.key;
                            mod = keyOrModKey.modifiers;
                            id = keyOrModKey.id;
                        }
                        var kbKey = { keyValue: key, keyCode: null };
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, kbKey);
                        if (possibleMatch) {
                            var isMatch = this.isModifierMatch(event, mod);
                            if (!matches) {
                                matches = isMatch;
                            }
                            if (matches && id) {
                                matchingIds.push(id);
                            }
                            if (!id) {
                                break;
                            }
                        }
                    }
                }
                else {
                    var keys = keyMatches.keys;
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, { keyValue: key, keyCode: null });
                        if (possibleMatch) {
                            matches = this.isModifierMatch(event, keyMatches.modifiers);
                            break;
                        }
                    }
                }
            }
            else {
                matches = utils_1.matchesKeyboardEvent(event, { keyValue, keyCode });
            }
            if (matches) {
                onKeyHandle(event, matchingIds);
            }
        };
        /* eslint-disable no-console */
        //if (!props.keyValue && !props.keyCode) {
        //  console.error('Warning: Failed propType: Missing prop `keyValue` or `keyCode` for `KeyHandler`.');
        //}
        /* eslint-enable */
    }
    shouldComponentUpdate() {
        return false;
    }
    componentDidMount() {
        //if (!canUseDOM) return;
        window.document.addEventListener(this.props.keyEventName, this.handleKey);
    }
    componentWillUnmount() {
        //if (!canUseDOM) return;
        window.document.removeEventListener(this.props.keyEventName, this.handleKey);
    }
    render() {
        return null;
    }
}
KeyHandler.defaultProps = {
    keyEventName: constants_1.KEYUP,
};
exports.KeyHandler = KeyHandler;
;
/**
 * KeyHandler decorators.
 */
//...any: any[]
function keyHandleDecorator(matcher) {
    return (props) => {
        const { keyValue, keyCode, keyEventName, keyMatches } = props || {};
        return (Component) => (
        //the decorator needs to have the same property interface 
        class KeyHandleDecorator extends React.Component {
            constructor() {
                super(...arguments);
                this.state = { keyValue: null, keyCode: null, modifiers: null };
                this.handleKey = (event, ids) => {
                    //console.log("HOC handleKey");
                    if (matcher && matcher(event, this.state)) {
                        this.setState({ keyValue: null, keyCode: null });
                        return;
                    }
                    var modifiers = KeyModifiersEnum.none;
                    if (event.altKey) {
                        modifiers |= KeyModifiersEnum.alt;
                    }
                    if (event.ctrlKey) {
                        modifiers |= KeyModifiersEnum.ctrl;
                    }
                    if (event.shiftKey) {
                        modifiers |= KeyModifiersEnum.shift;
                    }
                    var keyValue = utils_1.eventKey(event);
                    var keyCode = event.keyCode;
                    if (ids.length > 0) {
                        ids.forEach(methodName => {
                            this.wrappedInstance[methodName](event, keyValue, keyCode, modifiers);
                        });
                    }
                    this.setState({ keyValue: keyValue, keyCode: keyCode, modifiers: modifiers });
                };
            }
            render() {
                function isKeyMatchesMethodName(toDetermine) {
                    return toDetermine.methodName !== undefined;
                }
                var mappedKeyMatches = keyMatches;
                if (keyMatches) {
                    if (keyMatches instanceof Array) {
                        var testEntry = keyMatches[0];
                        if (isKeyMatchesMethodName(testEntry)) {
                            var keyMatchesMethodNameArray = keyMatches;
                            var allModKeys = [];
                            keyMatchesMethodNameArray.forEach(keyMatchesMethodName => {
                                var methodName = keyMatchesMethodName.methodName;
                                var kMatches = keyMatchesMethodName.keyMatches;
                                var modKeys;
                                if (kMatches instanceof Array) {
                                    var tEntry = kMatches[0];
                                    if (typeof tEntry === 'string') {
                                        var anyKeyModifiers = keyModifiersAny();
                                        modKeys = kMatches.map(kMatch => {
                                            var modKey = {
                                                key: kMatch,
                                                modifiers: anyKeyModifiers
                                            };
                                            return modKey;
                                        });
                                    }
                                    else {
                                        modKeys = kMatches;
                                    }
                                }
                                else {
                                    var modifiers = kMatches.modifiers;
                                    modKeys = kMatches.keys.map(key => {
                                        var modKey = {
                                            key: key,
                                            modifiers: modifiers
                                        };
                                        return modKey;
                                    });
                                }
                                modKeys.forEach(modKey => modKey.id = methodName);
                                allModKeys = allModKeys.concat(modKeys);
                            });
                            mappedKeyMatches = allModKeys;
                        }
                    }
                }
                return (React.createElement("div", null,
                    React.createElement(KeyHandler, { keyValue: keyValue, keyCode: keyCode, keyMatches: mappedKeyMatches, keyEventName: keyEventName, onKeyHandle: this.handleKey }),
                    React.createElement(Component, Object.assign({ ref: (instance) => { this.wrappedInstance = instance; } }, this.props, this.state))));
            }
        });
    };
}
exports.keyHandler = keyHandleDecorator();
exports.keyToggleHandler = keyHandleDecorator(utils_1.matchesKeyboardEvent);
/**
 * Constants
 */
__export(__webpack_require__(1));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* @flow */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(1);
/**
 * Constants.
 */
const NORMALIZED_KEYS = {
    'Esc': 'Escape',
    'Spacebar': ' ',
    'Left': 'ArrowLeft',
    'Up': 'ArrowUp',
    'Right': 'ArrowRight',
    'Down': 'ArrowDown',
    'Del': 'Delete',
    'Win': 'OS',
    'Menu': 'ContextMenu',
    'Apps': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'MozPrintableKey': 'Unidentified',
};
const KEY_CODE_KEYS = {
    '8': 'Backspace',
    '9': 'Tab',
    '12': 'Clear',
    '13': 'Enter',
    '16': 'Shift',
    '17': 'Control',
    '18': 'Alt',
    '19': 'Pause',
    '20': 'CapsLock',
    '27': 'Escape',
    '32': ' ',
    '33': 'PageUp',
    '34': 'PageDown',
    '35': 'End',
    '36': 'Home',
    '37': 'ArrowLeft',
    '38': 'ArrowUp',
    '39': 'ArrowRight',
    '40': 'ArrowDown',
    '45': 'Insert',
    '46': 'Delete',
    '112': 'F1',
    '113': 'F2',
    '114': 'F3',
    '115': 'F4',
    '116': 'F5',
    '117': 'F6',
    '118': 'F7',
    '119': 'F8',
    '120': 'F9',
    '121': 'F10',
    '122': 'F11',
    '123': 'F12',
    '144': 'NumLock',
    '145': 'ScrollLock',
    '224': 'Meta',
};
/**
 * Check if `given` element is an input / textarea form element or acts as one.
 */
function isInput(element) {
    if (!element) {
        return false;
    }
    const { tagName } = element;
    const editable = isContentEditable(element);
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable;
}
exports.isInput = isInput;
function isContentEditable(element) {
    if (typeof element.getAttribute !== 'function') {
        return false;
    }
    return !!element.getAttribute('contenteditable');
}
/**
 * Matches an event against a given keyboard key.
 */
function matchesKeyboardEvent(event, { keyCode, keyValue }) {
    if (!isNullOrUndefined(keyValue)) {
        //console.log("checking " + keyValue);
        return keyValue === eventKey(event);
    }
    if (!isNullOrUndefined(keyCode)) {
        return keyCode === event.keyCode;
    }
    return false;
}
exports.matchesKeyboardEvent = matchesKeyboardEvent;
function isNullOrUndefined(value) {
    return (value === undefined) || (value === null);
}
function eventKey(event) {
    const { key, keyCode, type } = event;
    if (key) {
        const normalizedKey = NORMALIZED_KEYS[key] || key;
        if (normalizedKey !== 'Unidentified') {
            return normalizedKey;
        }
    }
    if (type === constants_1.KEYPRESS) {
        const charCode = eventCharCode(event);
        return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
    }
    if (type === constants_1.KEYDOWN || type === constants_1.KEYUP) {
        return KEY_CODE_KEYS[String(keyCode)] || 'Unidentified';
    }
    return '';
}
exports.eventKey = eventKey;
function eventCharCode(event) {
    let { charCode, keyCode } = event;
    if ('charCode' in event) {
        if (charCode === 0 && keyCode === 13) {
            return 13;
        }
    }
    else {
        charCode = keyCode;
    }
    if (charCode >= 32 || charCode === 13) {
        return charCode;
    }
    return 0;
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
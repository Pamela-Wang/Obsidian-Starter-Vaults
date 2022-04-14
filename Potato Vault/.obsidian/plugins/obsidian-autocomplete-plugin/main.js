'use strict';

var obsidian = require('obsidian');

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

var Provider = /** @class */ (function () {
    function Provider() {
    }
    Provider.prototype.matchWith = function (input) {
        var _this = this;
        var inputLowered = input.toLowerCase();
        var inputHasUpperCase = /[A-Z]/.test(input);
        // case-sensitive logic if input has an upper case.
        // Otherwise, uses case-insensitive logic
        var suggestions = this.completions
            .filter(function (suggestion) {
            return suggestion != input
                ? inputHasUpperCase
                    ? suggestion.includes(input)
                    : suggestion.toLowerCase().includes(inputLowered)
                : false;
        })
            .sort(function (a, b) { return a.localeCompare(b); })
            .sort(function (a, b) {
            return Number(b.toLowerCase().startsWith(inputLowered)) -
                Number(a.toLowerCase().startsWith(inputLowered));
        })
            .map(function (suggestion) {
            return { category: _this.category, value: suggestion };
        });
        return suggestions;
    };
    Provider.wordSeparatorRegex = /(\.|,|;|:|'|"|!|\?|-|\)|\]|\}|\/| |Enter)/g;
    Provider.placeholder = '#{}';
    return Provider;
}());

function defaultDirection() {
    return { index: 0, direction: 'still' };
}
function managePlaceholders(selectedValue, initialCursorIndex) {
    var normalizedValue;
    var placeholder = Provider.placeholder;
    var newCursorPosition = initialCursorIndex;
    var placeholderIndex = selectedValue.indexOf(placeholder);
    if (placeholderIndex > -1) {
        // TODO: Manage multiple placeholders
        var placeholderRegex = new RegExp(placeholder, 'g');
        normalizedValue = selectedValue.replace(placeholderRegex, '');
        newCursorPosition += placeholderIndex;
    }
    else {
        normalizedValue = selectedValue;
        newCursorPosition += selectedValue.length;
    }
    return { normalizedValue: normalizedValue, newCursorPosition: newCursorPosition };
}
function selectLastSuggestion(selected, suggestionsLength) {
    var decreased = selected.index - 1;
    var updatedSelected = {
        index: decreased < 0 ? suggestionsLength - 1 : decreased,
        direction: 'backward',
    };
    return updatedSelected;
}
function updateSelectedSuggestionFrom(event, selected, suggestionsLength) {
    var updatedSelected = selected;
    switch (event.ctrlKey + " " + event.key) {
        case 'true p':
        case 'false ArrowUp':
            updatedSelected = selectLastSuggestion(selected, suggestionsLength);
            break;
        case 'true n':
        case 'false ArrowDown':
            var increased = selected.index + 1;
            updatedSelected = {
                index: increased >= suggestionsLength ? 0 : increased,
                direction: 'forward',
            };
            break;
    }
    return updatedSelected;
}
function copyObject(obj) {
    return __assign({}, obj);
}
function isVimNormalMode(editor) {
    return editor.getOption('keyMap') === 'vim';
}
function isVimTrigger(_a) {
    var triggerLikeVim = _a.triggerLikeVim, editor = _a.editor, event = _a.event;
    return (triggerLikeVim &&
        !isVimNormalMode(editor) &&
        event.ctrlKey &&
        (event.key === 'n' || event.key === 'p'));
}
var PRINTABLE_CHARS = ["Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Minus", "Equal", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backquote", "Backslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "NumpadMultiply", "Numpad7", "Numpad8", "Numpad9", "NumpadSubtract", "Numpad4", "Numpad5", "Numpad6", "NumpadAdd", "Numpad1", "Numpad2", "Numpad3", "Numpad0", "NumpadDecimal"];
function isKeyboardCodePrintable(code) {
    return PRINTABLE_CHARS.includes(code);
}
function isAutoTrigger(editor, event, tokenizer, settings) {
    var trigger = false;
    if (settings.autoTrigger &&
        !isVimNormalMode(editor) &&
        !tokenizer.isWordSeparator(event.key) &&
        isKeyboardCodePrintable(event.code) &&
        !(
        // Not on copy/cut/paste/undo
        ((event.ctrlKey || event.metaKey) &&
            (event.code === 'KeyX' ||
                event.code === 'KeyC' ||
                event.code === 'KeyV' ||
                event.code === 'KeyZ')))) {
        var cursor = editor.getCursor();
        var currentLine = editor.getLine(cursor.line);
        // If last word is longer or eq than threshold
        trigger =
            currentLine.length - tokenizer.lastWordStartPos(currentLine, cursor.ch) >=
                settings.autoTriggerMinSize;
    }
    return trigger;
}

function generateView(suggestions, selectedIndex) {
    var suggestionsHtml = suggestions.map(function (tip, index) {
        var isSelected = selectedIndex === index;
        return "\n        <div id=\"suggestion-" + index + "\" class=\"no-space-wrap suggestion-item" + (isSelected ? ' is-selected' : '') + "\">\n          <div id=\"suggestion-" + index + "\" class=\"suggestion-content\">\n          <span class=\"suggestion-flair\">" + tip.category + "</span>\n          " + tip.value + "\n          </div>\n        </div>\n      ";
    }, []);
    var suggestionsJoined = suggestionsHtml.join('\n');
    var viewString = "\n      <div id=\"suggestion-list\" class=\"suggestion\">\n        " + (suggestionsJoined.length > 0
        ? suggestionsJoined
        : '<div class="no-suggestions">No match found</div>') + "\n      </div>\n      <div class=\"prompt-instructions\">\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Ctrl+N /\u2191 </span>\n          <span>Next Suggestion</span>\n        </div>\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Ctrl+P /\u2193 </span>\n          <span>Previous Suggestion</span>\n        </div>\n        <div class=\"prompt-instruction\">\n          <span class=\"prompt-instruction-command\">Enter/Tab</span>\n          <span>Select Suggestion</span>\n        </div>\n      </div>\n    ";
    var containerNode = document.createElement('div');
    containerNode.classList.add('suggestion-container');
    containerNode.insertAdjacentHTML('beforeend', viewString);
    return containerNode;
}
function updateCachedView(view, selectedIndex) {
    var _a;
    var children = (_a = view.firstElementChild) === null || _a === void 0 ? void 0 : _a.children;
    if (!children)
        return;
    for (var index = 0; index < children.length; index++) {
        var child = children[index];
        child.toggleClass('is-selected', index === selectedIndex);
    }
}
function scrollTo(selected, view, suggestionsLength) {
    if (!view || suggestionsLength === 0)
        return;
    // TODO: Improve scrolling with page size and boundaries
    var parent = view.children[0];
    var selectedIndex = selected.index;
    var child = parent.children[0];
    if (child) {
        var scrollAmount = child.scrollHeight * selectedIndex;
        switch (selected.direction) {
            case 'forward':
                if (selectedIndex === 0)
                    // End -> Start
                    parent.scrollTop = 0;
                else
                    parent.scrollTop = scrollAmount;
                break;
            case 'backward':
                if (selectedIndex === suggestionsLength - 1)
                    // End <- Start
                    parent.scrollTop = parent.scrollHeight;
                else
                    parent.scrollTop = scrollAmount;
                break;
        }
    }
}
function appendWidget(editor, view, scrollable) {
    if (scrollable === void 0) { scrollable = true; }
    var cursor = editor.getCursor();
    editor.addWidget({ ch: cursor.ch, line: cursor.line }, view, scrollable);
}

var FlowProvider = /** @class */ (function (_super) {
    __extends(FlowProvider, _super);
    function FlowProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.category = 'F';
        _this.completions = [];
        return _this;
    }
    FlowProvider.prototype.addLastWordFrom = function (line, cursorIndex, tokenizer) {
        var word = tokenizer.lastWordFrom(line, cursorIndex, { normalize: true });
        this.addWord(word);
    };
    FlowProvider.prototype.addWordsFrom = function (text, tokenizer) {
        var _this = this;
        var result = tokenizer.tokenize(text);
        result.tokens.forEach(function (token) { return _this.addWord(token); });
    };
    FlowProvider.prototype.addWord = function (word) {
        if (!word || this.alreadyAdded(word))
            return;
        this.completions.push(word);
    };
    FlowProvider.prototype.alreadyAdded = function (word) {
        return this.completions.includes(word);
    };
    return FlowProvider;
}(Provider));

var TOKENIZE_STRATEGIES = [
    'default',
    'japanese',
    'arabic',
];
var Tokenizer = /** @class */ (function () {
    function Tokenizer(wordSeparators) {
        var escapedSeparators = wordSeparators.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        this.wordSeparatorPattern = new RegExp("[" + escapedSeparators + "]");
        // NOTE: global flag takes note of lastIndex used!
        this.trimPattern = new RegExp(this.wordSeparatorPattern, 'g');
    }
    Tokenizer.prototype.lastWordStartPos = function (text, index, options) {
        if (options === void 0) { options = { normalize: false }; }
        var _a = options.normalize
            ? this.normalizedLine(text, index)
            : { normalized: text, updatedCursor: index }, normalized = _a.normalized, updatedCursor = _a.updatedCursor;
        var wordStartIndex = updatedCursor;
        while (wordStartIndex &&
            !this.isWordSeparator(normalized.charAt(wordStartIndex - 1)))
            wordStartIndex -= 1;
        return wordStartIndex;
    };
    Tokenizer.prototype.lastWordFrom = function (text, cursorIndex, options) {
        if (options === void 0) { options = { normalize: false }; }
        var _a = options.normalize
            ? this.normalizedLine(text, cursorIndex)
            : { normalized: text, updatedCursor: cursorIndex }, normalized = _a.normalized, updatedCursor = _a.updatedCursor;
        if (options.normalize)
            // Already normalized
            options.normalize = false;
        var wordStartIndex = this.lastWordStartPos(normalized, updatedCursor, options);
        var word = null;
        if (wordStartIndex !== updatedCursor)
            word = text.slice(wordStartIndex, updatedCursor);
        return word;
    };
    Tokenizer.prototype.isWordSeparator = function (char) {
        return this.wordSeparatorPattern.test(char);
    };
    /*
     * Remove spaces and word separators
     * near the left of the cursorIndex
     */
    Tokenizer.prototype.normalizedLine = function (line, cursorIndex) {
        var partialLine = line.slice(0, cursorIndex);
        var normalized = partialLine.trimEnd();
        // Subtract how many spaces removed
        var updatedCursor = cursorIndex - (partialLine.length - normalized.length);
        if (normalized.length === 0)
            return { normalized: '', updatedCursor: 0 };
        var lastChar = normalized.charAt(updatedCursor - 1);
        if (this.isWordSeparator(lastChar)) {
            updatedCursor -= 1;
            normalized = normalized.slice(0, updatedCursor);
        }
        return { normalized: normalized, updatedCursor: updatedCursor };
    };
    return Tokenizer;
}());

var DefaultTokenizer = /** @class */ (function (_super) {
    __extends(DefaultTokenizer, _super);
    function DefaultTokenizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultTokenizer.prototype.tokenize = function (text, range) {
        var _this = this;
        var tokens = text
            .slice(range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)
            .split('\n')
            .flatMap(function (line) { return line.split(_this.trimPattern); })
            .filter(function (t) { return t.length > 0; });
        return { range: range, tokens: tokens };
    };
    return DefaultTokenizer;
}(Tokenizer));

var ArabicTokenizer = /** @class */ (function (_super) {
    __extends(ArabicTokenizer, _super);
    function ArabicTokenizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ArabicTokenizer;
}(DefaultTokenizer));

// @ts-nocheck
// Because this code is originally javascript code.
// TinySegmenter 0.1 -- Super compact Japanese tokenizer in Javascript
// (c) 2008 Taku Kudo <taku@chasen.org>
// TinySegmenter is freely distributable under the terms of a new BSD licence.
// For details, see http://chasen.org/~taku/software/TinySegmenter/LICENCE.txt
function TinySegmenter() {
    var patterns = {
        '[一二三四五六七八九十百千万億兆]': 'M',
        '[一-龠々〆ヵヶ]': 'H',
        '[ぁ-ん]': 'I',
        '[ァ-ヴーｱ-ﾝﾞｰ]': 'K',
        '[a-zA-Zａ-ｚＡ-Ｚ]': 'A',
        '[0-9０-９]': 'N',
    };
    this.chartype_ = [];
    for (var i in patterns) {
        var regexp = new RegExp();
        regexp.compile(i);
        this.chartype_.push([regexp, patterns[i]]);
    }
    this.BIAS__ = -332;
    this.BC1__ = { HH: 6, II: 2461, KH: 406, OH: -1378 };
    this.BC2__ = {
        AA: -3267,
        AI: 2744,
        AN: -878,
        HH: -4070,
        HM: -1711,
        HN: 4012,
        HO: 3761,
        IA: 1327,
        IH: -1184,
        II: -1332,
        IK: 1721,
        IO: 5492,
        KI: 3831,
        KK: -8741,
        MH: -3132,
        MK: 3334,
        OO: -2920,
    };
    this.BC3__ = {
        HH: 996,
        HI: 626,
        HK: -721,
        HN: -1307,
        HO: -836,
        IH: -301,
        KK: 2762,
        MK: 1079,
        MM: 4034,
        OA: -1652,
        OH: 266,
    };
    this.BP1__ = { BB: 295, OB: 304, OO: -125, UB: 352 };
    this.BP2__ = { BO: 60, OO: -1762 };
    this.BQ1__ = {
        BHH: 1150,
        BHM: 1521,
        BII: -1158,
        BIM: 886,
        BMH: 1208,
        BNH: 449,
        BOH: -91,
        BOO: -2597,
        OHI: 451,
        OIH: -296,
        OKA: 1851,
        OKH: -1020,
        OKK: 904,
        OOO: 2965,
    };
    this.BQ2__ = {
        BHH: 118,
        BHI: -1159,
        BHM: 466,
        BIH: -919,
        BKK: -1720,
        BKO: 864,
        OHH: -1139,
        OHM: -181,
        OIH: 153,
        UHI: -1146,
    };
    this.BQ3__ = {
        BHH: -792,
        BHI: 2664,
        BII: -299,
        BKI: 419,
        BMH: 937,
        BMM: 8335,
        BNN: 998,
        BOH: 775,
        OHH: 2174,
        OHM: 439,
        OII: 280,
        OKH: 1798,
        OKI: -793,
        OKO: -2242,
        OMH: -2402,
        OOO: 11699,
    };
    this.BQ4__ = {
        BHH: -3895,
        BIH: 3761,
        BII: -4654,
        BIK: 1348,
        BKK: -1806,
        BMI: -3385,
        BOO: -12396,
        OAH: 926,
        OHH: 266,
        OHK: -2036,
        ONN: -973,
    };
    this.BW1__ = {
        ',と': 660,
        ',同': 727,
        B1あ: 1404,
        B1同: 542,
        '、と': 660,
        '、同': 727,
        '」と': 1682,
        あっ: 1505,
        いう: 1743,
        いっ: -2055,
        いる: 672,
        うし: -4817,
        うん: 665,
        から: 3472,
        がら: 600,
        こう: -790,
        こと: 2083,
        こん: -1262,
        さら: -4143,
        さん: 4573,
        した: 2641,
        して: 1104,
        すで: -3399,
        そこ: 1977,
        それ: -871,
        たち: 1122,
        ため: 601,
        った: 3463,
        つい: -802,
        てい: 805,
        てき: 1249,
        でき: 1127,
        です: 3445,
        では: 844,
        とい: -4915,
        とみ: 1922,
        どこ: 3887,
        ない: 5713,
        なっ: 3015,
        など: 7379,
        なん: -1113,
        にし: 2468,
        には: 1498,
        にも: 1671,
        に対: -912,
        の一: -501,
        の中: 741,
        ませ: 2448,
        まで: 1711,
        まま: 2600,
        まる: -2155,
        やむ: -1947,
        よっ: -2565,
        れた: 2369,
        れで: -913,
        をし: 1860,
        を見: 731,
        亡く: -1886,
        京都: 2558,
        取り: -2784,
        大き: -2604,
        大阪: 1497,
        平方: -2314,
        引き: -1336,
        日本: -195,
        本当: -2423,
        毎日: -2113,
        目指: -724,
        Ｂ１あ: 1404,
        Ｂ１同: 542,
        '｣と': 1682,
    };
    this.BW2__ = {
        '..': -11822,
        11: -669,
        '――': -5730,
        '−−': -13175,
        いう: -1609,
        うか: 2490,
        かし: -1350,
        かも: -602,
        から: -7194,
        かれ: 4612,
        がい: 853,
        がら: -3198,
        きた: 1941,
        くな: -1597,
        こと: -8392,
        この: -4193,
        させ: 4533,
        され: 13168,
        さん: -3977,
        しい: -1819,
        しか: -545,
        した: 5078,
        して: 972,
        しな: 939,
        その: -3744,
        たい: -1253,
        たた: -662,
        ただ: -3857,
        たち: -786,
        たと: 1224,
        たは: -939,
        った: 4589,
        って: 1647,
        っと: -2094,
        てい: 6144,
        てき: 3640,
        てく: 2551,
        ては: -3110,
        ても: -3065,
        でい: 2666,
        でき: -1528,
        でし: -3828,
        です: -4761,
        でも: -4203,
        とい: 1890,
        とこ: -1746,
        とと: -2279,
        との: 720,
        とみ: 5168,
        とも: -3941,
        ない: -2488,
        なが: -1313,
        など: -6509,
        なの: 2614,
        なん: 3099,
        にお: -1615,
        にし: 2748,
        にな: 2454,
        によ: -7236,
        に対: -14943,
        に従: -4688,
        に関: -11388,
        のか: 2093,
        ので: -7059,
        のに: -6041,
        のの: -6125,
        はい: 1073,
        はが: -1033,
        はず: -2532,
        ばれ: 1813,
        まし: -1316,
        まで: -6621,
        まれ: 5409,
        めて: -3153,
        もい: 2230,
        もの: -10713,
        らか: -944,
        らし: -1611,
        らに: -1897,
        りし: 651,
        りま: 1620,
        れた: 4270,
        れて: 849,
        れば: 4114,
        ろう: 6067,
        われ: 7901,
        を通: -11877,
        んだ: 728,
        んな: -4115,
        一人: 602,
        一方: -1375,
        一日: 970,
        一部: -1051,
        上が: -4479,
        会社: -1116,
        出て: 2163,
        分の: -7758,
        同党: 970,
        同日: -913,
        大阪: -2471,
        委員: -1250,
        少な: -1050,
        年度: -8669,
        年間: -1626,
        府県: -2363,
        手権: -1982,
        新聞: -4066,
        日新: -722,
        日本: -7068,
        日米: 3372,
        曜日: -601,
        朝鮮: -2355,
        本人: -2697,
        東京: -1543,
        然と: -1384,
        社会: -1276,
        立て: -990,
        第に: -1612,
        米国: -4268,
        '１１': -669,
    };
    this.BW3__ = {
        あた: -2194,
        あり: 719,
        ある: 3846,
        'い.': -1185,
        'い。': -1185,
        いい: 5308,
        いえ: 2079,
        いく: 3029,
        いた: 2056,
        いっ: 1883,
        いる: 5600,
        いわ: 1527,
        うち: 1117,
        うと: 4798,
        えと: 1454,
        'か.': 2857,
        'か。': 2857,
        かけ: -743,
        かっ: -4098,
        かに: -669,
        から: 6520,
        かり: -2670,
        'が,': 1816,
        'が、': 1816,
        がき: -4855,
        がけ: -1127,
        がっ: -913,
        がら: -4977,
        がり: -2064,
        きた: 1645,
        けど: 1374,
        こと: 7397,
        この: 1542,
        ころ: -2757,
        さい: -714,
        さを: 976,
        'し,': 1557,
        'し、': 1557,
        しい: -3714,
        した: 3562,
        して: 1449,
        しな: 2608,
        しま: 1200,
        'す.': -1310,
        'す。': -1310,
        する: 6521,
        'ず,': 3426,
        'ず、': 3426,
        ずに: 841,
        そう: 428,
        'た.': 8875,
        'た。': 8875,
        たい: -594,
        たの: 812,
        たり: -1183,
        たる: -853,
        'だ.': 4098,
        'だ。': 4098,
        だっ: 1004,
        った: -4748,
        って: 300,
        てい: 6240,
        てお: 855,
        ても: 302,
        です: 1437,
        でに: -1482,
        では: 2295,
        とう: -1387,
        とし: 2266,
        との: 541,
        とも: -3543,
        どう: 4664,
        ない: 1796,
        なく: -903,
        など: 2135,
        'に,': -1021,
        'に、': -1021,
        にし: 1771,
        にな: 1906,
        には: 2644,
        'の,': -724,
        'の、': -724,
        の子: -1000,
        'は,': 1337,
        'は、': 1337,
        べき: 2181,
        まし: 1113,
        ます: 6943,
        まっ: -1549,
        まで: 6154,
        まれ: -793,
        らし: 1479,
        られ: 6820,
        るる: 3818,
        'れ,': 854,
        'れ、': 854,
        れた: 1850,
        れて: 1375,
        れば: -3246,
        れる: 1091,
        われ: -605,
        んだ: 606,
        んで: 798,
        カ月: 990,
        会議: 860,
        入り: 1232,
        大会: 2217,
        始め: 1681,
        市: 965,
        新聞: -5055,
        '日,': 974,
        '日、': 974,
        社会: 2024,
        ｶ月: 990,
    };
    this.TC1__ = {
        AAA: 1093,
        HHH: 1029,
        HHM: 580,
        HII: 998,
        HOH: -390,
        HOM: -331,
        IHI: 1169,
        IOH: -142,
        IOI: -1015,
        IOM: 467,
        MMH: 187,
        OOI: -1832,
    };
    this.TC2__ = {
        HHO: 2088,
        HII: -1023,
        HMM: -1154,
        IHI: -1965,
        KKH: 703,
        OII: -2649,
    };
    this.TC3__ = {
        AAA: -294,
        HHH: 346,
        HHI: -341,
        HII: -1088,
        HIK: 731,
        HOH: -1486,
        IHH: 128,
        IHI: -3041,
        IHO: -1935,
        IIH: -825,
        IIM: -1035,
        IOI: -542,
        KHH: -1216,
        KKA: 491,
        KKH: -1217,
        KOK: -1009,
        MHH: -2694,
        MHM: -457,
        MHO: 123,
        MMH: -471,
        NNH: -1689,
        NNO: 662,
        OHO: -3393,
    };
    this.TC4__ = {
        HHH: -203,
        HHI: 1344,
        HHK: 365,
        HHM: -122,
        HHN: 182,
        HHO: 669,
        HIH: 804,
        HII: 679,
        HOH: 446,
        IHH: 695,
        IHO: -2324,
        IIH: 321,
        III: 1497,
        IIO: 656,
        IOO: 54,
        KAK: 4845,
        KKA: 3386,
        KKK: 3065,
        MHH: -405,
        MHI: 201,
        MMH: -241,
        MMM: 661,
        MOM: 841,
    };
    this.TQ1__ = {
        BHHH: -227,
        BHHI: 316,
        BHIH: -132,
        BIHH: 60,
        BIII: 1595,
        BNHH: -744,
        BOHH: 225,
        BOOO: -908,
        OAKK: 482,
        OHHH: 281,
        OHIH: 249,
        OIHI: 200,
        OIIH: -68,
    };
    this.TQ2__ = { BIHH: -1401, BIII: -1033, BKAK: -543, BOOO: -5591 };
    this.TQ3__ = {
        BHHH: 478,
        BHHM: -1073,
        BHIH: 222,
        BHII: -504,
        BIIH: -116,
        BIII: -105,
        BMHI: -863,
        BMHM: -464,
        BOMH: 620,
        OHHH: 346,
        OHHI: 1729,
        OHII: 997,
        OHMH: 481,
        OIHH: 623,
        OIIH: 1344,
        OKAK: 2792,
        OKHH: 587,
        OKKA: 679,
        OOHH: 110,
        OOII: -685,
    };
    this.TQ4__ = {
        BHHH: -721,
        BHHM: -3604,
        BHII: -966,
        BIIH: -607,
        BIII: -2181,
        OAAA: -2763,
        OAKK: 180,
        OHHH: -294,
        OHHI: 2446,
        OHHO: 480,
        OHIH: -1573,
        OIHH: 1935,
        OIHI: -493,
        OIIH: 626,
        OIII: -4007,
        OKAK: -8156,
    };
    this.TW1__ = { につい: -4681, 東京都: 2026 };
    this.TW2__ = {
        ある程: -2049,
        いった: -1256,
        ころが: -2434,
        しょう: 3873,
        その後: -4430,
        だって: -1049,
        ていた: 1833,
        として: -4657,
        ともに: -4517,
        もので: 1882,
        一気に: -792,
        初めて: -1512,
        同時に: -8097,
        大きな: -1255,
        対して: -2721,
        社会党: -3216,
    };
    this.TW3__ = {
        いただ: -1734,
        してい: 1314,
        として: -4314,
        につい: -5483,
        にとっ: -5989,
        に当た: -6247,
        'ので,': -727,
        'ので、': -727,
        のもの: -600,
        れから: -3752,
        十二月: -2287,
    };
    this.TW4__ = {
        'いう.': 8576,
        'いう。': 8576,
        からな: -2348,
        してい: 2958,
        'たが,': 1516,
        'たが、': 1516,
        ている: 1538,
        という: 1349,
        ました: 5543,
        ません: 1097,
        ようと: -4258,
        よると: 5865,
    };
    this.UC1__ = { A: 484, K: 93, M: 645, O: -505 };
    this.UC2__ = { A: 819, H: 1059, I: 409, M: 3987, N: 5775, O: 646 };
    this.UC3__ = { A: -1370, I: 2311 };
    this.UC4__ = {
        A: -2643,
        H: 1809,
        I: -1032,
        K: -3450,
        M: 3565,
        N: 3876,
        O: 6646,
    };
    this.UC5__ = { H: 313, I: -1238, K: -799, M: 539, O: -831 };
    this.UC6__ = { H: -506, I: -253, K: 87, M: 247, O: -387 };
    this.UP1__ = { O: -214 };
    this.UP2__ = { B: 69, O: 935 };
    this.UP3__ = { B: 189 };
    this.UQ1__ = {
        BH: 21,
        BI: -12,
        BK: -99,
        BN: 142,
        BO: -56,
        OH: -95,
        OI: 477,
        OK: 410,
        OO: -2422,
    };
    this.UQ2__ = { BH: 216, BI: 113, OK: 1759 };
    this.UQ3__ = {
        BA: -479,
        BH: 42,
        BI: 1913,
        BK: -7198,
        BM: 3160,
        BN: 6427,
        BO: 14761,
        OI: -827,
        ON: -3212,
    };
    this.UW1__ = {
        ',': 156,
        '、': 156,
        '「': -463,
        あ: -941,
        う: -127,
        が: -553,
        き: 121,
        こ: 505,
        で: -201,
        と: -547,
        ど: -123,
        に: -789,
        の: -185,
        は: -847,
        も: -466,
        や: -470,
        よ: 182,
        ら: -292,
        り: 208,
        れ: 169,
        を: -446,
        ん: -137,
        '・': -135,
        主: -402,
        京: -268,
        区: -912,
        午: 871,
        国: -460,
        大: 561,
        委: 729,
        市: -411,
        日: -141,
        理: 361,
        生: -408,
        県: -386,
        都: -718,
        '｢': -463,
        '･': -135,
    };
    this.UW2__ = {
        ',': -829,
        '、': -829,
        〇: 892,
        '「': -645,
        '」': 3145,
        あ: -538,
        い: 505,
        う: 134,
        お: -502,
        か: 1454,
        が: -856,
        く: -412,
        こ: 1141,
        さ: 878,
        ざ: 540,
        し: 1529,
        す: -675,
        せ: 300,
        そ: -1011,
        た: 188,
        だ: 1837,
        つ: -949,
        て: -291,
        で: -268,
        と: -981,
        ど: 1273,
        な: 1063,
        に: -1764,
        の: 130,
        は: -409,
        ひ: -1273,
        べ: 1261,
        ま: 600,
        も: -1263,
        や: -402,
        よ: 1639,
        り: -579,
        る: -694,
        れ: 571,
        を: -2516,
        ん: 2095,
        ア: -587,
        カ: 306,
        キ: 568,
        ッ: 831,
        三: -758,
        不: -2150,
        世: -302,
        中: -968,
        主: -861,
        事: 492,
        人: -123,
        会: 978,
        保: 362,
        入: 548,
        初: -3025,
        副: -1566,
        北: -3414,
        区: -422,
        大: -1769,
        天: -865,
        太: -483,
        子: -1519,
        学: 760,
        実: 1023,
        小: -2009,
        市: -813,
        年: -1060,
        強: 1067,
        手: -1519,
        揺: -1033,
        政: 1522,
        文: -1355,
        新: -1682,
        日: -1815,
        明: -1462,
        最: -630,
        朝: -1843,
        本: -1650,
        東: -931,
        果: -665,
        次: -2378,
        民: -180,
        気: -1740,
        理: 752,
        発: 529,
        目: -1584,
        相: -242,
        県: -1165,
        立: -763,
        第: 810,
        米: 509,
        自: -1353,
        行: 838,
        西: -744,
        見: -3874,
        調: 1010,
        議: 1198,
        込: 3041,
        開: 1758,
        間: -1257,
        '｢': -645,
        '｣': 3145,
        ｯ: 831,
        ｱ: -587,
        ｶ: 306,
        ｷ: 568,
    };
    this.UW3__ = {
        ',': 4889,
        1: -800,
        '−': -1723,
        '、': 4889,
        々: -2311,
        〇: 5827,
        '」': 2670,
        '〓': -3573,
        あ: -2696,
        い: 1006,
        う: 2342,
        え: 1983,
        お: -4864,
        か: -1163,
        が: 3271,
        く: 1004,
        け: 388,
        げ: 401,
        こ: -3552,
        ご: -3116,
        さ: -1058,
        し: -395,
        す: 584,
        せ: 3685,
        そ: -5228,
        た: 842,
        ち: -521,
        っ: -1444,
        つ: -1081,
        て: 6167,
        で: 2318,
        と: 1691,
        ど: -899,
        な: -2788,
        に: 2745,
        の: 4056,
        は: 4555,
        ひ: -2171,
        ふ: -1798,
        へ: 1199,
        ほ: -5516,
        ま: -4384,
        み: -120,
        め: 1205,
        も: 2323,
        や: -788,
        よ: -202,
        ら: 727,
        り: 649,
        る: 5905,
        れ: 2773,
        わ: -1207,
        を: 6620,
        ん: -518,
        ア: 551,
        グ: 1319,
        ス: 874,
        ッ: -1350,
        ト: 521,
        ム: 1109,
        ル: 1591,
        ロ: 2201,
        ン: 278,
        '・': -3794,
        一: -1619,
        下: -1759,
        世: -2087,
        両: 3815,
        中: 653,
        主: -758,
        予: -1193,
        二: 974,
        人: 2742,
        今: 792,
        他: 1889,
        以: -1368,
        低: 811,
        何: 4265,
        作: -361,
        保: -2439,
        元: 4858,
        党: 3593,
        全: 1574,
        公: -3030,
        六: 755,
        共: -1880,
        円: 5807,
        再: 3095,
        分: 457,
        初: 2475,
        別: 1129,
        前: 2286,
        副: 4437,
        力: 365,
        動: -949,
        務: -1872,
        化: 1327,
        北: -1038,
        区: 4646,
        千: -2309,
        午: -783,
        協: -1006,
        口: 483,
        右: 1233,
        各: 3588,
        合: -241,
        同: 3906,
        和: -837,
        員: 4513,
        国: 642,
        型: 1389,
        場: 1219,
        外: -241,
        妻: 2016,
        学: -1356,
        安: -423,
        実: -1008,
        家: 1078,
        小: -513,
        少: -3102,
        州: 1155,
        市: 3197,
        平: -1804,
        年: 2416,
        広: -1030,
        府: 1605,
        度: 1452,
        建: -2352,
        当: -3885,
        得: 1905,
        思: -1291,
        性: 1822,
        戸: -488,
        指: -3973,
        政: -2013,
        教: -1479,
        数: 3222,
        文: -1489,
        新: 1764,
        日: 2099,
        旧: 5792,
        昨: -661,
        時: -1248,
        曜: -951,
        最: -937,
        月: 4125,
        期: 360,
        李: 3094,
        村: 364,
        東: -805,
        核: 5156,
        森: 2438,
        業: 484,
        氏: 2613,
        民: -1694,
        決: -1073,
        法: 1868,
        海: -495,
        無: 979,
        物: 461,
        特: -3850,
        生: -273,
        用: 914,
        町: 1215,
        的: 7313,
        直: -1835,
        省: 792,
        県: 6293,
        知: -1528,
        私: 4231,
        税: 401,
        立: -960,
        第: 1201,
        米: 7767,
        系: 3066,
        約: 3663,
        級: 1384,
        統: -4229,
        総: 1163,
        線: 1255,
        者: 6457,
        能: 725,
        自: -2869,
        英: 785,
        見: 1044,
        調: -562,
        財: -733,
        費: 1777,
        車: 1835,
        軍: 1375,
        込: -1504,
        通: -1136,
        選: -681,
        郎: 1026,
        郡: 4404,
        部: 1200,
        金: 2163,
        長: 421,
        開: -1432,
        間: 1302,
        関: -1282,
        雨: 2009,
        電: -1045,
        非: 2066,
        駅: 1620,
        '１': -800,
        '｣': 2670,
        '･': -3794,
        ｯ: -1350,
        ｱ: 551,
        ｸﾞ: 1319,
        ｽ: 874,
        ﾄ: 521,
        ﾑ: 1109,
        ﾙ: 1591,
        ﾛ: 2201,
        ﾝ: 278,
    };
    this.UW4__ = {
        ',': 3930,
        '.': 3508,
        '―': -4841,
        '、': 3930,
        '。': 3508,
        〇: 4999,
        '「': 1895,
        '」': 3798,
        '〓': -5156,
        あ: 4752,
        い: -3435,
        う: -640,
        え: -2514,
        お: 2405,
        か: 530,
        が: 6006,
        き: -4482,
        ぎ: -3821,
        く: -3788,
        け: -4376,
        げ: -4734,
        こ: 2255,
        ご: 1979,
        さ: 2864,
        し: -843,
        じ: -2506,
        す: -731,
        ず: 1251,
        せ: 181,
        そ: 4091,
        た: 5034,
        だ: 5408,
        ち: -3654,
        っ: -5882,
        つ: -1659,
        て: 3994,
        で: 7410,
        と: 4547,
        な: 5433,
        に: 6499,
        ぬ: 1853,
        ね: 1413,
        の: 7396,
        は: 8578,
        ば: 1940,
        ひ: 4249,
        び: -4134,
        ふ: 1345,
        へ: 6665,
        べ: -744,
        ほ: 1464,
        ま: 1051,
        み: -2082,
        む: -882,
        め: -5046,
        も: 4169,
        ゃ: -2666,
        や: 2795,
        ょ: -1544,
        よ: 3351,
        ら: -2922,
        り: -9726,
        る: -14896,
        れ: -2613,
        ろ: -4570,
        わ: -1783,
        を: 13150,
        ん: -2352,
        カ: 2145,
        コ: 1789,
        セ: 1287,
        ッ: -724,
        ト: -403,
        メ: -1635,
        ラ: -881,
        リ: -541,
        ル: -856,
        ン: -3637,
        '・': -4371,
        ー: -11870,
        一: -2069,
        中: 2210,
        予: 782,
        事: -190,
        井: -1768,
        人: 1036,
        以: 544,
        会: 950,
        体: -1286,
        作: 530,
        側: 4292,
        先: 601,
        党: -2006,
        共: -1212,
        内: 584,
        円: 788,
        初: 1347,
        前: 1623,
        副: 3879,
        力: -302,
        動: -740,
        務: -2715,
        化: 776,
        区: 4517,
        協: 1013,
        参: 1555,
        合: -1834,
        和: -681,
        員: -910,
        器: -851,
        回: 1500,
        国: -619,
        園: -1200,
        地: 866,
        場: -1410,
        塁: -2094,
        士: -1413,
        多: 1067,
        大: 571,
        子: -4802,
        学: -1397,
        定: -1057,
        寺: -809,
        小: 1910,
        屋: -1328,
        山: -1500,
        島: -2056,
        川: -2667,
        市: 2771,
        年: 374,
        庁: -4556,
        後: 456,
        性: 553,
        感: 916,
        所: -1566,
        支: 856,
        改: 787,
        政: 2182,
        教: 704,
        文: 522,
        方: -856,
        日: 1798,
        時: 1829,
        最: 845,
        月: -9066,
        木: -485,
        来: -442,
        校: -360,
        業: -1043,
        氏: 5388,
        民: -2716,
        気: -910,
        沢: -939,
        済: -543,
        物: -735,
        率: 672,
        球: -1267,
        生: -1286,
        産: -1101,
        田: -2900,
        町: 1826,
        的: 2586,
        目: 922,
        省: -3485,
        県: 2997,
        空: -867,
        立: -2112,
        第: 788,
        米: 2937,
        系: 786,
        約: 2171,
        経: 1146,
        統: -1169,
        総: 940,
        線: -994,
        署: 749,
        者: 2145,
        能: -730,
        般: -852,
        行: -792,
        規: 792,
        警: -1184,
        議: -244,
        谷: -1000,
        賞: 730,
        車: -1481,
        軍: 1158,
        輪: -1433,
        込: -3370,
        近: 929,
        道: -1291,
        選: 2596,
        郎: -4866,
        都: 1192,
        野: -1100,
        銀: -2213,
        長: 357,
        間: -2344,
        院: -2297,
        際: -2604,
        電: -878,
        領: -1659,
        題: -792,
        館: -1984,
        首: 1749,
        高: 2120,
        '｢': 1895,
        '｣': 3798,
        '･': -4371,
        ｯ: -724,
        ｰ: -11870,
        ｶ: 2145,
        ｺ: 1789,
        ｾ: 1287,
        ﾄ: -403,
        ﾒ: -1635,
        ﾗ: -881,
        ﾘ: -541,
        ﾙ: -856,
        ﾝ: -3637,
    };
    this.UW5__ = {
        ',': 465,
        '.': -299,
        1: -514,
        E2: -32768,
        ']': -2762,
        '、': 465,
        '。': -299,
        '「': 363,
        あ: 1655,
        い: 331,
        う: -503,
        え: 1199,
        お: 527,
        か: 647,
        が: -421,
        き: 1624,
        ぎ: 1971,
        く: 312,
        げ: -983,
        さ: -1537,
        し: -1371,
        す: -852,
        だ: -1186,
        ち: 1093,
        っ: 52,
        つ: 921,
        て: -18,
        で: -850,
        と: -127,
        ど: 1682,
        な: -787,
        に: -1224,
        の: -635,
        は: -578,
        べ: 1001,
        み: 502,
        め: 865,
        ゃ: 3350,
        ょ: 854,
        り: -208,
        る: 429,
        れ: 504,
        わ: 419,
        を: -1264,
        ん: 327,
        イ: 241,
        ル: 451,
        ン: -343,
        中: -871,
        京: 722,
        会: -1153,
        党: -654,
        務: 3519,
        区: -901,
        告: 848,
        員: 2104,
        大: -1296,
        学: -548,
        定: 1785,
        嵐: -1304,
        市: -2991,
        席: 921,
        年: 1763,
        思: 872,
        所: -814,
        挙: 1618,
        新: -1682,
        日: 218,
        月: -4353,
        査: 932,
        格: 1356,
        機: -1508,
        氏: -1347,
        田: 240,
        町: -3912,
        的: -3149,
        相: 1319,
        省: -1052,
        県: -4003,
        研: -997,
        社: -278,
        空: -813,
        統: 1955,
        者: -2233,
        表: 663,
        語: -1073,
        議: 1219,
        選: -1018,
        郎: -368,
        長: 786,
        間: 1191,
        題: 2368,
        館: -689,
        '１': -514,
        Ｅ２: -32768,
        '｢': 363,
        ｲ: 241,
        ﾙ: 451,
        ﾝ: -343,
    };
    this.UW6__ = {
        ',': 227,
        '.': 808,
        1: -270,
        E1: 306,
        '、': 227,
        '。': 808,
        あ: -307,
        う: 189,
        か: 241,
        が: -73,
        く: -121,
        こ: -200,
        じ: 1782,
        す: 383,
        た: -428,
        っ: 573,
        て: -1014,
        で: 101,
        と: -105,
        な: -253,
        に: -149,
        の: -417,
        は: -236,
        も: -206,
        り: 187,
        る: -135,
        を: 195,
        ル: -673,
        ン: -496,
        一: -277,
        中: 201,
        件: -800,
        会: 624,
        前: 302,
        区: 1792,
        員: -1212,
        委: 798,
        学: -960,
        市: 887,
        広: -695,
        後: 535,
        業: -697,
        相: 753,
        社: -507,
        福: 974,
        空: -822,
        者: 1811,
        連: 463,
        郎: 1082,
        '１': -270,
        Ｅ１: 306,
        ﾙ: -673,
        ﾝ: -496,
    };
    return this;
}
TinySegmenter.prototype.ctype_ = function (str) {
    for (var i in this.chartype_) {
        if (str.match(this.chartype_[i][0])) {
            return this.chartype_[i][1];
        }
    }
    return 'O';
};
TinySegmenter.prototype.ts_ = function (v) {
    if (v) {
        return v;
    }
    return 0;
};
TinySegmenter.prototype.segment = function (input) {
    if (input == null || input == undefined || input == '') {
        return [];
    }
    var result = [];
    var seg = ['B3', 'B2', 'B1'];
    var ctype = ['O', 'O', 'O'];
    var o = input.split('');
    for (i = 0; i < o.length; ++i) {
        seg.push(o[i]);
        ctype.push(this.ctype_(o[i]));
    }
    seg.push('E1');
    seg.push('E2');
    seg.push('E3');
    ctype.push('O');
    ctype.push('O');
    ctype.push('O');
    var word = seg[3];
    var p1 = 'U';
    var p2 = 'U';
    var p3 = 'U';
    for (var i = 4; i < seg.length - 3; ++i) {
        var score = this.BIAS__;
        var w1 = seg[i - 3];
        var w2 = seg[i - 2];
        var w3 = seg[i - 1];
        var w4 = seg[i];
        var w5 = seg[i + 1];
        var w6 = seg[i + 2];
        var c1 = ctype[i - 3];
        var c2 = ctype[i - 2];
        var c3 = ctype[i - 1];
        var c4 = ctype[i];
        var c5 = ctype[i + 1];
        var c6 = ctype[i + 2];
        score += this.ts_(this.UP1__[p1]);
        score += this.ts_(this.UP2__[p2]);
        score += this.ts_(this.UP3__[p3]);
        score += this.ts_(this.BP1__[p1 + p2]);
        score += this.ts_(this.BP2__[p2 + p3]);
        score += this.ts_(this.UW1__[w1]);
        score += this.ts_(this.UW2__[w2]);
        score += this.ts_(this.UW3__[w3]);
        score += this.ts_(this.UW4__[w4]);
        score += this.ts_(this.UW5__[w5]);
        score += this.ts_(this.UW6__[w6]);
        score += this.ts_(this.BW1__[w2 + w3]);
        score += this.ts_(this.BW2__[w3 + w4]);
        score += this.ts_(this.BW3__[w4 + w5]);
        score += this.ts_(this.TW1__[w1 + w2 + w3]);
        score += this.ts_(this.TW2__[w2 + w3 + w4]);
        score += this.ts_(this.TW3__[w3 + w4 + w5]);
        score += this.ts_(this.TW4__[w4 + w5 + w6]);
        score += this.ts_(this.UC1__[c1]);
        score += this.ts_(this.UC2__[c2]);
        score += this.ts_(this.UC3__[c3]);
        score += this.ts_(this.UC4__[c4]);
        score += this.ts_(this.UC5__[c5]);
        score += this.ts_(this.UC6__[c6]);
        score += this.ts_(this.BC1__[c2 + c3]);
        score += this.ts_(this.BC2__[c3 + c4]);
        score += this.ts_(this.BC3__[c4 + c5]);
        score += this.ts_(this.TC1__[c1 + c2 + c3]);
        score += this.ts_(this.TC2__[c2 + c3 + c4]);
        score += this.ts_(this.TC3__[c3 + c4 + c5]);
        score += this.ts_(this.TC4__[c4 + c5 + c6]);
        //  score += this.ts_(this.TC5__[c4 + c5 + c6]);
        score += this.ts_(this.UQ1__[p1 + c1]);
        score += this.ts_(this.UQ2__[p2 + c2]);
        score += this.ts_(this.UQ3__[p3 + c3]);
        score += this.ts_(this.BQ1__[p2 + c2 + c3]);
        score += this.ts_(this.BQ2__[p2 + c3 + c4]);
        score += this.ts_(this.BQ3__[p3 + c2 + c3]);
        score += this.ts_(this.BQ4__[p3 + c3 + c4]);
        score += this.ts_(this.TQ1__[p2 + c1 + c2 + c3]);
        score += this.ts_(this.TQ2__[p2 + c2 + c3 + c4]);
        score += this.ts_(this.TQ3__[p3 + c1 + c2 + c3]);
        score += this.ts_(this.TQ4__[p3 + c2 + c3 + c4]);
        var p = 'O';
        if (score > 0) {
            result.push(word);
            word = '';
            p = 'B';
        }
        p1 = p2;
        p2 = p3;
        p3 = p;
        word += seg[i];
    }
    result.push(word);
    return result;
};

var JapaneseTokenizer = /** @class */ (function (_super) {
    __extends(JapaneseTokenizer, _super);
    function JapaneseTokenizer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // @ts-ignore
        _this.tokenizer = new TinySegmenter();
        return _this;
    }
    JapaneseTokenizer.prototype.tokenize = function (text, range) {
        var _this = this;
        var tokens = text
            .slice(range === null || range === void 0 ? void 0 : range.start, range === null || range === void 0 ? void 0 : range.end)
            .split('\n')
            .flatMap(function (line) { return _this.tokenizer.segment(line); })
            .map(function (t) { return t.replace(_this.trimPattern, ''); });
        return { tokens: tokens };
    };
    JapaneseTokenizer.prototype.lastWordFrom = function (text, index, options) {
        var _this = this;
        if (options === void 0) { options = { normalize: false }; }
        var normalized = (options.normalize
            ? this.normalizedLine(text, index)
            : { normalized: text }).normalized;
        var tokens = this.tokenizer
            .segment(normalized)
            .map(function (t) { return t.replace(_this.trimPattern, ''); });
        var length = tokens.length;
        return length > 0 ? tokens[length - 1] : null;
    };
    JapaneseTokenizer.prototype.lastWordStartPos = function (text, index, options) {
        if (options === void 0) { options = { normalize: false }; }
        var lastWord = this.lastWordFrom(text, index, options);
        return lastWord ? text.length - lastWord.length : 0;
    };
    return JapaneseTokenizer;
}(Tokenizer));

var TokenizerFactory = /** @class */ (function () {
    function TokenizerFactory() {
    }
    TokenizerFactory.getTokenizer = function (strategy, wordSeparators) {
        var tokenizer;
        switch (strategy) {
            case 'default':
                tokenizer = new DefaultTokenizer(wordSeparators);
                break;
            case 'japanese':
                tokenizer = new JapaneseTokenizer(wordSeparators);
                break;
            case 'arabic':
                tokenizer = new ArabicTokenizer(wordSeparators);
                break;
            default:
                throw new Error("Strategy '" + strategy + "' not found");
        }
        return tokenizer;
    };
    return TokenizerFactory;
}());

var LaTexProvider = /** @class */ (function (_super) {
    __extends(LaTexProvider, _super);
    function LaTexProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.category = "L";
        _this.completions = ["\\Arrowvert", "\\Bbbk", "\\Big", "\\Bigg", "\\Biggl", "\\Biggr", "\\Bigl", "\\Bigm", "\\Bigr", "\\Box", "\\Bumpeq", "\\Cap", "\\cite[#{}]{#{}}", "\\cite", "\\Cup", "\\DeclareMathOperator{#{}}{#{}}", "\\Delta", "\\Downarrow", "\\Finv", "\\Game", "\\Gamma", "\\Im", "\\Lambda", "\\Leftarrow", "\\Leftrightarrow", "\\Lleftarrow", "\\Longleftarrow", "\\Longleftrightarrow", "\\Longrightarrow", "\\Lsh", "\\Omega", "\\Phi", "\\Pi", "\\Pr", "\\Psi", "\\Re", "\\Rightarrow", "\\Rrightarrow", "\\Rsh", "\\S", "\\Sigma", "\\Subset", "\\Supset", "\\TeX", "\\Theta", "\\Uparrow", "\\Updownarrow", "\\Upsilon", "\\Vdash", "\\Vert", "\\Vvdash", "\\Xi", "\\above", "\\abovewithdelims", "\\acute{#{}}", "\\aleph", "\\alpha", "\\amalg", "\\angle", "\\approx", "\\approxeq", "\\arccos", "\\arcsin", "\\arctan", "\\arg", "\\arrowvert", "\\ast", "\\asymp", "\\atop",
            "\\atopwithdelims", "\\backepsilon", "\\backprime", "\\backsim", "\\backsimeq", "\\backslash", "\\bar{#{}}", "\\barwedge", "\\because", "\\beta", "\\beth", "\\between", "\\bf", "\\big", "\\bigcap", "\\bigcirc", "\\bigcup", "\\bigg", "\\biggl", "\\biggm", "\\biggr", "\\bigl", "\\bigm", "\\bigodot", "\\bigoplus", "\\bigotimes", "\\bigr\\}", "\\bigsqcup", "\\bigstar", "\\bigtriangledown", "\\bigtriangleup", "\\biguplus", "\\bigvee", "\\bigwedge", "\\binom{#{}}{#{}}", "\\blacklozenge", "\\blacksquare", "\\blacktriangle", "\\blacktriangledown", "\\blacktriangleleft", "\\blacktriangleright", "\\bmod", "\\boldsymbol{#{}}", "\\bot", "\\bowtie", "\\boxdot", "\\boxed{#{}}", "\\boxminus", "\\boxplus", "\\boxtimes", "\\brace", "\\bracevert", "\\brack", "\\breve{#{}}", "\\buildrel", "\\bullet", "\\bumpeq", "\\cal", "\\cap", "\\cases{#{}}", "\\cdot", "\\cdotp", "\\cdots",
            "\\centerdot", "\\cfrac{#{}}{#{}}", "\\check{#{}}", "\\checkmark", "\\chi", "\\choose", "\\circ", "\\circeq", "\\circlearrowleft", "\\circlearrowright", "\\circledS", "\\circledast", "\\circledcirc", "\\circleddash", "\\clubsuit", "\\colon", "\\complement", "\\cong", "\\coprod", "\\cos", "\\cosh", "\\cot", "\\coth", "\\cr", "\\csc", "\\cup", "\\curlyeqprec", "\\curlyeqsucc", "\\curlyvee", "\\curlywedge", "\\curvearrowleft", "\\curvearrowright", "\\dagger", "\\daleth", "\\dashleftarrow", "\\dashrightarrow", "\\dashv", "\\dbinom{#{}}{#{}}", "\\ddagger", "\\ddddot{#{}}", "\\dddot{#{}}", "\\ddot{#{}}", "\\ddots", "\\def", "\\deg", "\\delta", "\\det", "\\dfrac{#{}}{#{}}", "\\diagdown", "\\diagup", "\\diamond", "\\diamondsuit", "\\digamma", "\\dim", "\\displaylines", "\\displaystyle", "\\div", "\\divideontimes", "\\dot{#{}}", "\\doteq", "\\doteqdot", "\\dotplus",
            "\\dots", "\\dotsb", "\\dotsc", "\\dotsi", "\\dotsm", "\\dotso", "\\doublebarwedge", "\\downarrow", "\\downdownarrows", "\\downharpoonleft", "\\downharpoonright", "\\ell", "\\emptyset", "\\enspace", "\\epsilon", "\\eqalign{#{}}", "\\eqalignno{#{}}", "\\eqcirc", "\\eqref{#{}}", "\\eqsim", "\\eqslantgtr", "\\eqslantless", "\\equiv", "\\eta", "\\eth", "\\exists", "\\exp", "\\fallingdotseq", "\\flat", "\\forall", "\\frown", "\\gamma", "\\gcd", "\\ge", "\\geq", "\\geqq", "\\geqslant", "\\gets", "\\gg", "\\ggg", "\\gimel", "\\gnapprox", "\\gneq", "\\gneqq", "\\gnsim", "\\grave{#{}}", "\\gtrapprox", "\\gtrdot", "\\gtreqless", "\\gtreqqless", "\\gtrless", "\\gtrsim", "\\gvertneqq", "\\hat{#{}}", "\\hbar", "\\hbox", "\\heartsuit", "\\hfil", "\\hfill", "\\hom", "\\hookleftarrow", "\\hookrightarrow", "\\hphantom{#{}}", "\\hskip", "\\hslash", "\\idotsint", "\\iff",
            "\\iiiint", "\\iiint", "\\iint", "\\imath", "\\impliedby", "\\implies", "\\in", "\\inf", "\\infty", "\\injlim", "\\int\\limits_{#{}}^{#{}}", "\\intercal", "\\iota", "\\it", "\\jmath", "\\kappa", "\\ker", "\\kern", "\\lVert", "\\lambda", "\\land", "\\langle", "\\lbrace", "\\lbrack", "\\lceil", "\\ldotp", "\\ldots", "\\le", "\\left", "\\leftarrow", "\\leftarrowtail", "\\leftharpoondown", "\\leftharpoonup", "\\leftleftarrows", "\\leftrightarrow", "\\leftrightarrows", "\\leftrightharpoons", "\\leftrightsquigarrow", "\\leftroot{#{}}", "\\leftthreetimes", "\\leq", "\\leqalignno{#{}}", "\\leqq", "\\leqslant", "\\lessapprox", "\\lessdot", "\\lesseqgtr", "\\lesseqqgtr", "\\lessgtr", "\\lesssim", "\\let{#{}}{#{}}", "\\lfloor", "\\lg", "\\lgroup", "\\lhd", "\\lim", "\\liminf", "\\limits_{#{}}^{#{}}", "\\limsup", "\\ll", "\\llap{#{}}", "\\llcorner", "\\lll", "\\lmoustache",
            "\\ln", "\\lnapprox", "\\lneq", "\\lneqq", "\\lnot", "\\lnsim", "\\log", "\\longleftarrow", "\\longleftrightarrow", "\\longmapsto", "\\longrightarrow", "\\looparrowleft", "\\looparrowright", "\\lor", "\\lower", "\\lozenge", "\\lrcorner", "\\ltimes", "\\lvert", "\\lvertneqq", "\\maltese", "\\mapsto", "\\mathbb{#{}}", "\\mathbf{#{}}", "\\mathbin", "\\mathcal{#{}}", "\\mathchoice", "\\mathclose", "\\mathfrak{#{}}", "\\mathinner", "\\mathop", "\\mathopen", "\\mathord", "\\mathpunct", "\\mathrel", "\\mathstrut", "\\matrix{#{}}", "\\max", "\\measuredangle", "\\mho", "\\mid", "\\middle", "\\min", "\\mit", "\\mkern", "\\mod", "\\models", "\\moveleft", "\\moveright", "\\mp", "\\mskip", "\\mspace{#{}}", "\\mu", "\\multimap", "\\nLeftarrow", "\\nLeftrightarrow", "\\nRightarrow", "\\nVDash", "\\nVdash", "\\nabla", "\\natural", "\\ncong", "\\ne", "\\nearrow", "\\neg", "\\negmedspace",
            "\\negthickspace", "\\negthinspace", "\\neq", "\\nexists", "\\ngeq", "\\ngeqq", "\\ngeqslant", "\\ngtr", "\\ni", "\\nleftarrow", "\\nleftrightarrow", "\\nleq", "\\nleqq", "\\nleqslant", "\\nless", "\\nmid", "\\nolimits_{#{}}^{#{}}", "\\not", "\\notag", "\\notin", "\\nparallel", "\\nprec", "\\npreceq", "\\nrightarrow", "\\nshortmid", "\\nshortparallel", "\\nsim", "\\nsubseteq", "\\nsubseteqq", "\\nsucc", "\\nsucceq", "\\nsupseteq", "\\nsupseteqq", "\\ntriangleleft", "\\ntrianglelefteq", "\\ntriangleright", "\\ntrianglerighteq", "\\nu", "\\nvDash", "\\nvdash", "\\nwarrow", "\\odot", "\\oint", "\\oldstyle", "\\omega", "\\ominus", "\\operatorname{#{}}", "\\oplus", "\\oslash", "\\otimes", "\\over", "\\overbrace{#{}}", "\\overleftarrow{#{}}", "\\overleftrightarrow{#{}}", "\\overline{#{}}", "\\overrightarrow{#{}}", "\\overset{#{}}{#{}}", "\\overwithdelims", "\\owns",
            "\\parallel", "\\partial", "\\perp", "\\phantom{#{}}", "\\phi", "\\pi", "\\pitchfork", "\\pm", "\\pmatrix{#{}}", "\\pmb{#{}}", "\\pmod", "\\pod", "\\prec", "\\precapprox", "\\preccurlyeq", "\\preceq", "\\precnapprox", "\\precneqq", "\\precnsim", "\\precsim", "\\prime", "\\prod\\limits_{#{}}^{#{}}", "\\projlim", "\\propto", "\\psi", "\\qquad", "\\quad", "\\rVert", "\\raise", "\\rangle", "\\rbrace", "\\rbrack", "\\rceil", "\\rfloor", "\\rgroup", "\\rhd", "\\rho", "\\right", "\\rightarrow", "\\rightarrowtail", "\\rightharpoondown", "\\rightharpoonup", "\\rightleftarrows", "\\rightleftharpoons", "\\rightrightarrows", "\\rightsquigarrow", "\\rightthreetimes", "\\risingdotseq", "\\rlap{#{}}", "\\rm", "\\rmoustache", "\\root #{} \\of #{}", "\\rtimes", "\\rvert", "\\scriptscriptstyle", "\\scriptstyle", "\\searrow", "\\sec", "\\setminus", "\\sharp", "\\shortmid",
            "\\shortparallel", "\\sideset{#{}}{#{}}{#{}}", "\\sigma", "\\sim", "\\simeq", "\\sin", "\\sinh", "\\skew{#{}}{#{}}{#{}}", "\\smallfrown", "\\smallint", "\\smallsetminus", "\\smallsmile", "\\smash{#{}}", "\\smile", "\\space", "\\spadesuit", "\\sphericalangle", "\\sqcap", "\\sqcup", "\\sqrt{#{}}", "\\sqsubset", "\\sqsubseteq", "\\sqsupset", "\\sqsupseteq", "\\square", "\\star", "\\strut", "\\subset", "\\subseteq", "\\subseteqq", "\\subsetneq", "\\subsetneqq", "\\substack{#{}}", "\\succ", "\\succapprox", "\\succcurlyeq", "\\succeq", "\\succnapprox", "\\succneqq", "\\succnsim", "\\succsim", "\\sum\\limits_{#{}}^{#{}}", "\\sup", "\\supset", "\\supseteq", "\\supseteqq", "\\supsetneq", "\\supsetneqq", "\\surd", "\\swarrow", "\\tag{#{}}", "\\tan", "\\tanh", "\\tau", "\\tbinom{#{}}{#{}}", "\\text{#{}}", "\\textstyle", "\\tfrac{#{}}{#{}}", "\\therefore", "\\theta",
            "\\thickapprox", "\\thicksim", "\\thinspace", "\\tilde{#{}}", "\\times", "\\to", "\\top", "\\triangle", "\\triangledown", "\\triangleleft", "\\trianglelefteq", "\\triangleq", "\\triangleright", "\\trianglerighteq", "\\tt", "\\twoheadleftarrow", "\\twoheadrightarrow", "\\ulcorner", "\\underbrace{#{}}", "\\underleftarrow{#{}}", "\\underleftrightarrow{#{}}", "\\underline{#{}}", "\\underrightarrow{#{}}", "\\underset{#{}}{#{}}", "\\unlhd", "\\unrhd", "\\uparrow", "\\updownarrow", "\\upharpoonleft", "\\upharpoonright", "\\uplus", "\\uproot{#{}}", "\\upsilon", "\\upuparrows", "\\urcorner", "\\vDash", "\\varDelta", "\\varGamma", "\\varLambda", "\\varOmega", "\\varPhi", "\\varPi", "\\varPsi", "\\varSigma", "\\varTheta", "\\varUpsilon", "\\varXi", "\\varepsilon", "\\varinjlim", "\\varkappa", "\\varliminf", "\\varlimsup", "\\varnothing", "\\varphi", "\\varpi",
            "\\varprojlim", "\\varpropto", "\\varrho", "\\varsigma", "\\varsubsetneq", "\\varsubsetneqq", "\\varsupsetneq", "\\varsupsetneqq", "\\vartheta", "\\vartriangle", "\\vartriangleleft", "\\vartriangleright", "\\vcenter", "\\vdash", "\\vec{#{}}", "\\vee", "\\veebar", "\\vert", "\\vphantom{#{}}", "\\wedge", "\\widehat{#{}}", "\\widetilde{#{}}", "\\wp", "\\wr", "\\xi", "\\xleftarrow{#{}}", "\\xrightarrow{#{}}", "\\zeta", "\\begin{definition}", "\\begin{tikzcd}", "\\begin{tikzpicture}", "\\begin{align}", "\\begin{align*}", "\\begin{alignat}", "\\begin{alignat*}", "\\begin{aligned}", "\\begin{alignedat}", "\\begin{array}", "\\begin{Bmatrix}", "\\begin{bmatrix}", "\\begin{cases}", "\\begin{CD}", "\\begin{eqnarray}", "\\begin{eqnarray*}", "\\begin{equation}", "\\begin{equation*}", "\\begin{gather}", "\\begin{gather*}", "\\begin{gathered}", "\\begin{matrix}",
            "\\begin{multline}", "\\begin{multline*}", "\\begin{pmatrix}", "\\begin{smallmatrix}", "\\begin{split}", "\\begin{subarray}", "\\begin{Vmatrix}", "\\begin{vmatrix}", "\\end{definition}", "\\end{tikzcd}", "\\end{tikzpicture}", "\\end{align}", "\\end{align*}", "\\end{alignat}", "\\end{alignat*}", "\\end{aligned}", "\\end{alignedat}", "\\end{array}", "\\end{Bmatrix}", "\\end{bmatrix}", "\\end{cases}", "\\end{CD}", "\\end{eqnarray}", "\\end{eqnarray*}", "\\end{equation}", "\\end{equation*}", "\\end{gather}", "\\end{gather*}", "\\end{gathered}", "\\end{matrix}",
            "\\end{multline}", "\\end{multline*}", "\\end{pmatrix}", "\\end{smallmatrix}", "\\end{split}", "\\end{subarray}", "\\end{Vmatrix}", "\\end{vmatrix}"];
        return _this;
    }
    return LaTexProvider;
}(Provider));

var Autocomplete = /** @class */ (function () {
    function Autocomplete(settings) {
        var _this = this;
        this.keyMaps = {
            // Override code mirror default key maps
            'Ctrl-P': function () { },
            'Ctrl-N': function () { },
            Up: function () { },
            Down: function () { },
            Right: function (editor) { return _this.removeViewFrom(editor); },
            Left: function (editor) { return _this.removeViewFrom(editor); },
            Tab: function (editor) {
                _this.selectSuggestion(editor);
            },
            Enter: function (editor) {
                _this.selectSuggestion(editor);
            },
            Esc: function (editor) {
                _this.removeViewFrom(editor);
                if (editor.getOption('keyMap') === 'vim-insert')
                    editor.operation(function () {
                        // https://github.com/codemirror/CodeMirror/blob/bd37a96d362b8d92895d3960d569168ec39e4165/keymap/vim.js#L5341
                        var vim = editor.state.vim;
                        vim.insertMode = false;
                        editor.setOption('keyMap', 'vim');
                    });
            },
        };
        this.settings = settings;
        this.loadProviders();
        this.suggestions = [];
        this.selected = defaultDirection();
        this.view = null;
    }
    Object.defineProperty(Autocomplete.prototype, "isShown", {
        get: function () {
            return this.view !== null;
        },
        enumerable: false,
        configurable: true
    });
    // TODO: Create settings type
    Autocomplete.prototype.toggleViewIn = function (editor, _a) {
        var _b = _a === void 0 ? {
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        var isEnabled = this.settings.enabled;
        if (this.isShown || !isEnabled) {
            this.cursorAtTrigger = null;
            this.removeViewFrom(editor);
        }
        else if (isEnabled) {
            var cursor = copyObject(editor.getCursor());
            var currentLine = editor.getLine(cursor.line);
            var wordStartIndex = this.tokenizer.lastWordStartPos(currentLine, cursor.ch);
            var cursorAt = cursor.ch;
            cursor.ch = wordStartIndex;
            this.cursorAtTrigger = cursor;
            var word = currentLine.slice(wordStartIndex, cursorAt);
            this.showViewIn(editor, word, { autoSelect: autoSelect, showEmptyMatch: showEmptyMatch });
        }
    };
    Autocomplete.prototype.updateViewIn = function (editor, event, _a) {
        var _b = _a === void 0 ? {
            updateSelected: true,
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, updateSelected = _b.updateSelected, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        if (updateSelected)
            this.selected = updateSelectedSuggestionFrom(event, this.selected, this.suggestions.length);
        var cursor = copyObject(editor.getCursor());
        var currentLine = editor.getLine(cursor.line);
        var completionWord = this.tokenizer.lastWordFrom(currentLine, cursor.ch);
        var recreate = completionWord !== this.lastCompletionWord;
        if (recreate) {
            this.lastCompletionWord = completionWord;
            this.showViewIn(editor, completionWord, { autoSelect: autoSelect, showEmptyMatch: showEmptyMatch });
        }
        else
            updateCachedView(this.view, this.selected.index);
        scrollTo(this.selected, this.view, this.suggestions.length);
    };
    Autocomplete.prototype.removeViewFrom = function (editor) {
        this.selected = defaultDirection();
        editor.removeKeyMap(this.keyMaps);
        if (!this.view)
            return;
        this.addClickListener(this.view, editor, false);
        try {
            var parentNode = this.view.parentNode;
            if (parentNode) {
                var removed = parentNode.removeChild(this.view);
                if (removed)
                    this.view = null;
            }
        }
        catch (e) {
            console.error("Cannot destroy view. Reason: " + e);
        }
    };
    Autocomplete.prototype.updateProvidersFrom = function (event, editor) {
        var tokenizer = this.tokenizer;
        if (!event.ctrlKey &&
            (tokenizer.isWordSeparator(event.key) || event.key === 'Enter')) {
            var cursor_1 = copyObject(editor.getCursor());
            if (event.key === 'Enter') {
                cursor_1.line -= 1;
                var currentLine = editor.getLine(cursor_1.line);
                // Changed editor pane
                if (!currentLine)
                    return;
                cursor_1.ch = currentLine.length;
            }
            var line_1 = editor.getLine(cursor_1.line);
            this.providers.forEach(function (provider) {
                // For now only FlowProvider
                if (provider instanceof FlowProvider)
                    provider.addLastWordFrom(line_1, cursor_1.ch, tokenizer);
            });
        }
    };
    Autocomplete.prototype.scanFile = function (file, strategy) {
        var _this = this;
        var _a;
        if (strategy === void 0) { strategy = 'default'; }
        var providers = this.providers;
        (_a = file.vault) === null || _a === void 0 ? void 0 : _a.read(file).then(function (content) {
            // TODO: Make it async
            providers.forEach(function (provider) {
                if (provider instanceof FlowProvider) {
                    var tokenizer = _this.tokenizer;
                    if (strategy !== _this.tokenizerStrategy)
                        tokenizer = TokenizerFactory.getTokenizer(strategy, _this.getWordSeparatorsFrom(strategy));
                    provider.addWordsFrom(content, tokenizer);
                }
            });
        });
    };
    // TODO: Improve suggestions public API
    Autocomplete.prototype.selectLastSuggestion = function () {
        this.selected = {
            index: this.suggestions.length - 1,
            direction: 'backward',
        };
    };
    Object.defineProperty(Autocomplete.prototype, "tokenizer", {
        get: function () {
            return TokenizerFactory.getTokenizer(this.tokenizerStrategy, this.tokenizerWordSeparators);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Autocomplete.prototype, "tokenizerStrategy", {
        get: function () {
            return this.settings.flowProviderTokenizeStrategy;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Autocomplete.prototype, "tokenizerWordSeparators", {
        get: function () {
            return this.settings.flowWordSeparators[this.tokenizerStrategy];
        },
        enumerable: false,
        configurable: true
    });
    Autocomplete.prototype.getWordSeparatorsFrom = function (strategy) {
        return this.settings.flowWordSeparators[strategy];
    };
    // TODO: Create settings type
    Autocomplete.prototype.showViewIn = function (editor, completionWord, _a) {
        if (completionWord === void 0) { completionWord = ''; }
        var _b = _a === void 0 ? {
            autoSelect: true,
            showEmptyMatch: true,
        } : _a, autoSelect = _b.autoSelect, showEmptyMatch = _b.showEmptyMatch;
        this.suggestions = this.providers.reduce(function (acc, provider) { return acc.concat(provider.matchWith(completionWord || '')); }, []);
        var suggestionsLength = this.suggestions.length;
        if (!this.isShown && autoSelect && suggestionsLength === 1) {
            // Suggest automatically
            this.selected.index = 0;
            this.selectSuggestion(editor);
        }
        else if (!showEmptyMatch && suggestionsLength === 0) {
            this.removeViewFrom(editor);
        }
        else {
            if (this.view)
                this.removeViewFrom(editor);
            editor.addKeyMap(this.keyMaps);
            this.view = generateView(this.suggestions, this.selected.index);
            this.addClickListener(this.view, editor);
            appendWidget(editor, this.view);
        }
    };
    // TODO: Refactor
    Autocomplete.prototype.addClickListener = function (view, editor, add) {
        var _this = this;
        if (add === void 0) { add = true; }
        if (!this.onClickCallback)
            this.onClickCallback = function (event) {
                var element = event.target;
                var hintId = element.id;
                if (!hintId) {
                    var parent_1 = element.parentNode;
                    if (parent_1 && parent_1.id)
                        hintId = parent_1.id;
                }
                var hintIdPrefix = 'suggestion-';
                if (hintId && hintId.startsWith(hintIdPrefix)) {
                    hintId = hintId.replace(hintIdPrefix, '');
                    var id = parseInt(hintId);
                    if (id >= 0 && id < _this.suggestions.length) {
                        _this.selected.index = id;
                        _this.selectSuggestion(editor);
                    }
                }
            };
        if (add)
            view.addEventListener('click', this.onClickCallback);
        else
            view.removeEventListener('click', this.onClickCallback);
    };
    Autocomplete.prototype.selectSuggestion = function (editor) {
        var _this = this;
        var _a;
        var cursor = editor.getCursor();
        var selectedValue = (_a = this.suggestions[this.selected.index]) === null || _a === void 0 ? void 0 : _a.value;
        if (!selectedValue) {
            this.removeViewFrom(editor);
            return;
        }
        var _b = managePlaceholders(selectedValue, this.cursorAtTrigger.ch), normalizedValue = _b.normalizedValue, newCursorPosition = _b.newCursorPosition;
        editor.operation(function () {
            editor.replaceRange(normalizedValue, _this.cursorAtTrigger, cursor);
            var updatedCursor = {
                line: cursor.line,
                ch: newCursorPosition,
            };
            editor.setCursor(updatedCursor);
        });
        // Need to remove it here because of focus
        this.removeViewFrom(editor);
        editor.focus();
    };
    Autocomplete.prototype.loadProviders = function () {
        var providers = [];
        if (this.settings.flowProvider)
            providers.push(new FlowProvider());
        if (this.settings.latexProvider)
            providers.push(new LaTexProvider());
        this.providers = providers;
    };
    return Autocomplete;
}());

var AutocompleteSettings = /** @class */ (function () {
    function AutocompleteSettings() {
        this.enabled = true;
        this.autoSelect = false;
        this.autoTrigger = true;
        this.autoTriggerMinSize = 3;
        /*
         * Trigger on ctrl-p/n bindings
         */
        this.triggerLikeVim = false;
        // TODO: Refactor provider settings
        this.latexProvider = false;
        this.flowProvider = true;
        this.flowProviderScanCurrent = true;
        this.flowProviderTokenizeStrategy = 'default';
        this.flowWordSeparators = {
            default: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/",
            arabic: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/\u060C\u061B",
            japanese: "~?!@#$%^&*()-=+[{]}|;:' \",.<>/",
        };
    }
    return AutocompleteSettings;
}());

var AutocompleteSettingsTab = /** @class */ (function (_super) {
    __extends(AutocompleteSettingsTab, _super);
    function AutocompleteSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.capitalize = function (text) {
            return text.replace(/^\w/, function (c) { return c.toLocaleUpperCase(); });
        };
        _this.plugin = plugin;
        return _this;
    }
    // TODO: Refactor
    AutocompleteSettingsTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Enabled')
            .setDesc('Set the autocomplete state')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.enabled).onChange(function (value) {
                _this.plugin.settings.enabled = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto trigger')
            .setDesc('Trigger autocomplete on printable keystroke that are not word separators')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.autoTrigger).onChange(function (value) {
                if (_this.plugin.settings.triggerLikeVim)
                    _this.plugin.settings.triggerLikeVim = false;
                if (_this.plugin.settings.autoSelect)
                    _this.plugin.settings.autoSelect = false;
                _this.plugin.settings.autoTrigger = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto trigger from n-th character')
            .setDesc('Trigger autocomplete only when there are at least n characters in the last word')
            .addDropdown(function (cb) {
            var options = ['1', '2', '3', '4', '5', '6', '7', '8'];
            options.forEach(function (opt) { return cb.addOption(opt, opt); });
            var minLength = String(_this.plugin.settings.autoTriggerMinSize);
            cb.setValue(minLength).onChange(function (val) {
                if (_this.plugin.settings.autoTrigger) {
                    _this.plugin.settings.autoTriggerMinSize = Number(val);
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else {
                    new obsidian.Notice('Cannot change because Auto Trigger is not enabled.');
                    cb.setValue(minLength);
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Auto select')
            .setDesc('Auto select suggestion if there is only one')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.autoSelect).onChange(function (value) {
                if (_this.plugin.settings.triggerLikeVim)
                    _this.plugin.settings.triggerLikeVim = false;
                if (_this.plugin.settings.autoTrigger)
                    _this.plugin.settings.autoTrigger = false;
                _this.plugin.settings.autoSelect = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Trigger like Vim autocomplete')
            .setDesc('Use CTRL-P/N bindings to trigger autocomplete. Be aware of keybinding clash on Windows (ctrl-n)')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.triggerLikeVim).onChange(function (value) {
                if (_this.plugin.settings.autoSelect)
                    _this.plugin.settings.autoSelect = false;
                if (_this.plugin.settings.autoTrigger)
                    _this.plugin.settings.autoTrigger = false;
                _this.plugin.settings.triggerLikeVim = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        // Providers
        containerEl.createEl('h2', { text: 'Text Providers', cls: 'text-left' });
        containerEl.createEl('div', {
            text: 'The providers below suggest completions based on input. Be aware that enabling multiple providers can decrease performance',
            cls: 'setting-item-description',
        });
        new obsidian.Setting(containerEl)
            .setClass('no-border-top')
            .setName('LaTex Provider')
            .setDesc('Toggle LaTex suggestions')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.latexProvider).onChange(function (value) {
                _this.plugin.settings.latexProvider = value;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Flow Provider')
            .setDesc('Learns as you type. For now limited to current session')
            .setHeading();
        new obsidian.Setting(containerEl)
            .setClass('no-border-top')
            .setName('Enabled')
            .setDesc('Enable Flow Provider')
            .addToggle(function (cb) {
            return cb.setValue(_this.plugin.settings.flowProvider).onChange(function (value) {
                _this.plugin.settings.flowProvider = value;
                if (!value)
                    // Scan current file can be enabled only if flow provider is
                    _this.plugin.settings.flowProviderScanCurrent = false;
                _this.plugin.saveData(_this.plugin.settings);
                _this.plugin.refresh();
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Scan current file')
            .setDesc('Provides current file text suggestions. Be aware of performance issues with large files.')
            .addToggle(function (cb) {
            var settings = _this.plugin.settings;
            cb.setValue(settings.flowProvider && settings.flowProviderScanCurrent).onChange(function (value) {
                if (settings.flowProvider) {
                    _this.plugin.settings.flowProviderScanCurrent = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else if (value) {
                    // Cannot enable plugin
                    cb.setValue(false);
                    new obsidian.Notice('Cannot activate because flow provider is not enabled.');
                }
                // Render again
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Scan strategy')
            .setDesc('Choose the default scan strategy')
            .addDropdown(function (cb) {
            // Add options
            TOKENIZE_STRATEGIES.forEach(function (strategy) {
                cb.addOption(strategy, _this.capitalize(strategy));
            });
            var settings = _this.plugin.settings;
            cb.setValue(settings.flowProviderTokenizeStrategy).onChange(function (value) {
                if (settings.flowProvider) {
                    _this.plugin.settings.flowProviderTokenizeStrategy = value;
                    _this.plugin.saveData(_this.plugin.settings);
                    _this.plugin.refresh();
                }
                else {
                    new obsidian.Notice('Cannot change because flow provider is not enabled.');
                    cb.setValue(settings.flowProviderTokenizeStrategy);
                }
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Word separators')
            .setDesc('Change word separators to personalize the autocomplete suggestions');
        var settings = this.plugin.settings;
        var wordSeparators = settings.flowWordSeparators;
        var strategies = Object.keys(wordSeparators);
        strategies.forEach(function (strategy, index) {
            var separators = wordSeparators[strategy];
            var setting = new obsidian.Setting(containerEl).setName(_this.capitalize(strategy));
            if (index === 1)
                setting.setClass('no-border-top');
            if (strategy === 'japanese')
                setting.setDesc('Used only to remove from suggestions. Word separation is done by Tokenizer');
            setting.addText(function (cb) {
                cb.setValue(separators).onChange(function (value) {
                    if (settings.flowProvider) {
                        settings.flowWordSeparators[strategy] = value;
                        _this.plugin.saveData(settings);
                        _this.plugin.refresh();
                    }
                    else {
                        new obsidian.Notice('Cannot change because flow provider is not enabled.');
                        cb.setValue(separators);
                    }
                });
            });
        });
    };
    return AutocompleteSettingsTab;
}(obsidian.PluginSettingTab));

var StatusBarView = /** @class */ (function () {
    function StatusBarView(plugin, settings) {
        var _this = this;
        this.onStatusBarClick = function () {
            var currentStrategy = _this.settings.flowProviderTokenizeStrategy;
            var currentIndex = TOKENIZE_STRATEGIES.findIndex(function (strategy) { return strategy === currentStrategy; });
            var newStrategy = currentIndex === TOKENIZE_STRATEGIES.length - 1
                ? TOKENIZE_STRATEGIES[0]
                : TOKENIZE_STRATEGIES[currentIndex + 1];
            _this.settings.flowProviderTokenizeStrategy = newStrategy;
            _this.plugin.saveData(_this.settings);
            _this.statusBar.innerHTML = _this.getStatusBarText(newStrategy);
        };
        this.plugin = plugin;
        this.settings = settings;
    }
    StatusBarView.prototype.addStatusBar = function () {
        if (!this.settings.flowProvider)
            return;
        var statusBar = this.plugin.addStatusBarItem();
        statusBar.addClass('mod-clickable');
        statusBar.innerHTML = this.getStatusBarText(this.settings.flowProviderTokenizeStrategy);
        statusBar.addEventListener('click', this.onStatusBarClick);
        this.statusBar = statusBar;
    };
    StatusBarView.prototype.removeStatusBar = function () {
        if (!this.statusBar)
            return;
        this.statusBar.removeEventListener('click', this.onStatusBarClick);
        this.statusBar.remove();
    };
    StatusBarView.prototype.getStatusBarText = function (strategy) {
        return "strategy: " + strategy;
    };
    return StatusBarView;
}());

var AutocompletePlugin = /** @class */ (function (_super) {
    __extends(AutocompletePlugin, _super);
    function AutocompletePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /*
         * Listener used to trigger autocomplete
         * It intercepts inputs that could change the current line (e.g. ctrl+n)
         */
        _this.keyDownListener = function (editor, event) {
            var autocomplete = _this.autocomplete;
            var settings = _this.settings;
            var autoSelect = settings.autoSelect;
            if (autocomplete.isShown &&
                autocomplete.tokenizer.isWordSeparator(event.key)) {
                _this.autocomplete.removeViewFrom(editor);
                return;
            }
            else if (autocomplete.isShown)
                return;
            // Trigger like Vim autocomplete (ctrl+p/n)
            if (isVimTrigger({
                triggerLikeVim: settings.triggerLikeVim,
                editor: editor,
                event: event,
            })) {
                _this.justTriggeredBy = 'vim';
                autocomplete.toggleViewIn(editor, {
                    autoSelect: autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
                if (event.key === 'p')
                    autocomplete.selectLastSuggestion();
            }
            else if (isAutoTrigger(editor, event, autocomplete.tokenizer, settings)) {
                _this.justTriggeredBy = 'autotrigger';
                autocomplete.toggleViewIn(editor, {
                    autoSelect: autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
            }
        };
        /*
         * Listener used to scan current word
         * Updates autocomplete results
         */
        _this.keyUpListener = function (editor, event) {
            var autocomplete = _this.autocomplete;
            autocomplete.updateProvidersFrom(event, editor);
            if (!autocomplete.isShown)
                return;
            _this.updateEditorIfChanged(editor, autocomplete);
            var settings = _this.settings;
            var updateSelected = true;
            if (isVimTrigger({
                triggerLikeVim: settings.triggerLikeVim,
                editor: editor,
                event: event,
            }) &&
                _this.justTriggeredBy === 'vim') {
                // Do not update selected when there is vim trigger
                updateSelected = false;
            }
            if (_this.justTriggeredBy !== 'autotrigger')
                autocomplete.updateViewIn(editor, event, {
                    updateSelected: updateSelected,
                    autoSelect: settings.autoSelect,
                    showEmptyMatch: !settings.autoTrigger,
                });
            if (_this.justTriggeredBy)
                _this.justTriggeredBy = undefined;
        };
        return _this;
    }
    AutocompletePlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log('Loading Autocomplete plugin.');
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [new AutocompleteSettings()];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        this.addSettingTab(new AutocompleteSettingsTab(this.app, this));
                        if (!this.settings.enabled)
                            return [2 /*return*/];
                        this.statusBar = new StatusBarView(this, this.settings);
                        this.enable();
                        this.addCommands();
                        return [2 /*return*/];
                }
            });
        });
    };
    AutocompletePlugin.prototype.onunload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('Unloaded Obsidian Autocomplete');
                this.disable();
                return [2 /*return*/];
            });
        });
    };
    AutocompletePlugin.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.disable();
                this.enable();
                return [2 /*return*/];
            });
        });
    };
    AutocompletePlugin.prototype.addCommands = function () {
        var _this = this;
        this.addCommand({
            id: 'autocomplete-toggle',
            name: 'Toggle Autocomplete',
            hotkeys: [
                {
                    modifiers: ['Ctrl'],
                    key: ' ',
                },
            ],
            callback: function () {
                var autocomplete = _this.autocomplete;
                var editor = _this.getValidEditorFor(autocomplete);
                if (editor) {
                    // Do not open on vim normal mode
                    if (isVimNormalMode(editor))
                        return;
                    autocomplete.toggleViewIn(editor);
                }
            },
        });
        this.addScanCommands();
    };
    AutocompletePlugin.prototype.enable = function () {
        var _this = this;
        this.autocomplete = new Autocomplete(this.settings);
        this.justTriggeredBy = undefined;
        var settings = this.settings;
        if (settings.flowProvider)
            this.statusBar.addStatusBar();
        if (settings.flowProviderScanCurrent) {
            this.app.workspace.on('file-open', this.onFileOpened, this);
            if (this.app.workspace.layoutReady)
                this.onLayoutReady();
            this.app.workspace.on('layout-ready', this.onLayoutReady, this);
        }
        this.registerCodeMirror(function (editor) {
            editor.on('keydown', _this.keyDownListener);
            editor.on('keyup', _this.keyUpListener);
        });
    };
    AutocompletePlugin.prototype.disable = function () {
        var _this = this;
        var workspace = this.app.workspace;
        // Always remove to avoid any kind problem
        workspace.off('file-open', this.onFileOpened);
        workspace.off('layout-ready', this.onLayoutReady);
        this.statusBar.removeStatusBar();
        workspace.iterateCodeMirrors(function (cm) {
            cm.off('keyup', _this.keyUpListener);
            cm.off('keydown', _this.keyDownListener);
            _this.autocomplete.removeViewFrom(cm);
        });
    };
    AutocompletePlugin.prototype.addScanCommands = function () {
        var _this = this;
        TOKENIZE_STRATEGIES.forEach(function (type) {
            var capitalized = type.replace(/^\w/, function (c) { return c.toLocaleUpperCase(); });
            var name = "Scan current file " + (type !== 'default' ? "(" + capitalized + ")" : '');
            _this.addCommand({
                id: "autocomplete-scan-current-file-" + type,
                name: name,
                callback: function () {
                    if (!_this.settings.flowProviderScanCurrent) {
                        new obsidian.Notice('Please activate setting flow Provider: Scan current file');
                    }
                    var autocomplete = _this.autocomplete;
                    var editor = _this.getValidEditorFor(autocomplete);
                    if (editor) {
                        var file = _this.app.workspace.getActiveFile();
                        autocomplete.scanFile(file, type);
                    }
                },
            });
        });
    };
    AutocompletePlugin.prototype.onLayoutReady = function () {
        var file = this.app.workspace.getActiveFile();
        if (file)
            this.autocomplete.scanFile(file);
    };
    AutocompletePlugin.prototype.onFileOpened = function (file) {
        if (file)
            this.autocomplete.scanFile(file);
    };
    AutocompletePlugin.prototype.getValidEditorFor = function (autocomplete) {
        var currentEditor = this.getCurrentEditor();
        if (currentEditor)
            this.updateEditorIfChanged(currentEditor, autocomplete);
        return currentEditor;
    };
    AutocompletePlugin.prototype.updateEditorIfChanged = function (editor, autocomplete) {
        if (!this.lastUsedEditor)
            this.lastUsedEditor = editor;
        if (editor !== this.lastUsedEditor) {
            autocomplete.removeViewFrom(this.lastUsedEditor);
            this.lastUsedEditor = editor;
        }
    };
    AutocompletePlugin.prototype.getCurrentEditor = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        return view ? view.sourceMode.cmEditor : null;
    };
    return AutocompletePlugin;
}(obsidian.Plugin));

module.exports = AutocompletePlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9wcm92aWRlcnMvcHJvdmlkZXIudHMiLCIuLi9zcmMvYXV0b2NvbXBsZXRlL2NvcmUudHMiLCIuLi9zcmMvYXV0b2NvbXBsZXRlL3ZpZXcudHMiLCIuLi9zcmMvcHJvdmlkZXJzL2Zsb3cudHMiLCIuLi9zcmMvcHJvdmlkZXJzL2Zsb3cvdG9rZW5pemVyLnRzIiwiLi4vc3JjL3Byb3ZpZGVycy9mbG93L3Rva2VuaXplci9kZWZhdWx0LnRzIiwiLi4vc3JjL3Byb3ZpZGVycy9mbG93L3Rva2VuaXplci9hcmFiaWMudHMiLCIuLi9zcmMvdmVuZG9yL3Rpbnktc2VnbWVudGVyLnRzIiwiLi4vc3JjL3Byb3ZpZGVycy9mbG93L3Rva2VuaXplci9qYXBhbmVzZS50cyIsIi4uL3NyYy9wcm92aWRlcnMvZmxvdy9mYWN0b3J5LnRzIiwiLi4vc3JjL3Byb3ZpZGVycy9sYXRleC50cyIsIi4uL3NyYy9hdXRvY29tcGxldGUudHMiLCIuLi9zcmMvc2V0dGluZ3Mvc2V0dGluZ3MudHMiLCIuLi9zcmMvc2V0dGluZ3Mvc2V0dGluZ3MtdGFiLnRzIiwiLi4vc3JjL3N0YXR1c2Jhci50cyIsIi4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQcm92aWRlciB7XG4gIGFic3RyYWN0IHJlYWRvbmx5IGNhdGVnb3J5OiBzdHJpbmdcbiAgYWJzdHJhY3QgY29tcGxldGlvbnM6IEFycmF5PHN0cmluZz5cblxuICBzdGF0aWMgcmVhZG9ubHkgd29yZFNlcGFyYXRvclJlZ2V4ID0gLyhcXC58LHw7fDp8J3xcInwhfFxcP3wtfFxcKXxcXF18XFx9fFxcL3wgfEVudGVyKS9nXG4gIHN0YXRpYyByZWFkb25seSBwbGFjZWhvbGRlcjogc3RyaW5nID0gJyN7fSdcblxuICBtYXRjaFdpdGgoaW5wdXQ6IHN0cmluZyk6IENvbXBsZXRpb25bXSB7XG4gICAgY29uc3QgaW5wdXRMb3dlcmVkID0gaW5wdXQudG9Mb3dlckNhc2UoKVxuICAgIGNvbnN0IGlucHV0SGFzVXBwZXJDYXNlID0gL1tBLVpdLy50ZXN0KGlucHV0KVxuXG4gICAgLy8gY2FzZS1zZW5zaXRpdmUgbG9naWMgaWYgaW5wdXQgaGFzIGFuIHVwcGVyIGNhc2UuXG4gICAgLy8gT3RoZXJ3aXNlLCB1c2VzIGNhc2UtaW5zZW5zaXRpdmUgbG9naWNcbiAgICBjb25zdCBzdWdnZXN0aW9ucyA9IHRoaXMuY29tcGxldGlvbnNcbiAgICAgIC5maWx0ZXIoKHN1Z2dlc3Rpb24pID0+XG4gICAgICAgIHN1Z2dlc3Rpb24gIT0gaW5wdXRcbiAgICAgICAgICA/IGlucHV0SGFzVXBwZXJDYXNlXG4gICAgICAgICAgICA/IHN1Z2dlc3Rpb24uaW5jbHVkZXMoaW5wdXQpXG4gICAgICAgICAgICA6IHN1Z2dlc3Rpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhpbnB1dExvd2VyZWQpXG4gICAgICAgICAgOiBmYWxzZVxuICAgICAgKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSlcbiAgICAgIC5zb3J0KFxuICAgICAgICAoYSwgYikgPT5cbiAgICAgICAgICBOdW1iZXIoYi50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoaW5wdXRMb3dlcmVkKSkgLVxuICAgICAgICAgIE51bWJlcihhLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChpbnB1dExvd2VyZWQpKVxuICAgICAgKVxuICAgICAgLm1hcCgoc3VnZ2VzdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4geyBjYXRlZ29yeTogdGhpcy5jYXRlZ29yeSwgdmFsdWU6IHN1Z2dlc3Rpb24gfVxuICAgICAgfSlcblxuICAgIHJldHVybiBzdWdnZXN0aW9uc1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcGxldGlvbiB7XG4gIGNhdGVnb3J5OiBzdHJpbmdcbiAgdmFsdWU6IHN0cmluZ1xufVxuIiwiaW1wb3J0IHsgQXV0b2NvbXBsZXRlIH0gZnJvbSAnc3JjL2F1dG9jb21wbGV0ZSdcbmltcG9ydCB7IFRva2VuaXplciB9IGZyb20gJ3NyYy9wcm92aWRlcnMvZmxvdy90b2tlbml6ZXInXG5pbXBvcnQgeyBBdXRvY29tcGxldGVTZXR0aW5ncyB9IGZyb20gJ3NyYy9zZXR0aW5ncy9zZXR0aW5ncydcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnLi4vcHJvdmlkZXJzL3Byb3ZpZGVyJ1xuXG5leHBvcnQgdHlwZSBEaXJlY3Rpb24gPSB7XG4gIGluZGV4OiBudW1iZXJcbiAgZGlyZWN0aW9uOiAnZm9yd2FyZCcgfCAnYmFja3dhcmQnIHwgJ3N0aWxsJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdERpcmVjdGlvbigpOiBEaXJlY3Rpb24ge1xuICByZXR1cm4geyBpbmRleDogMCwgZGlyZWN0aW9uOiAnc3RpbGwnIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hbmFnZVBsYWNlaG9sZGVycyhcbiAgc2VsZWN0ZWRWYWx1ZTogc3RyaW5nLFxuICBpbml0aWFsQ3Vyc29ySW5kZXg6IG51bWJlclxuKTogeyBub3JtYWxpemVkVmFsdWU6IHN0cmluZzsgbmV3Q3Vyc29yUG9zaXRpb246IG51bWJlciB9IHtcbiAgbGV0IG5vcm1hbGl6ZWRWYWx1ZTogc3RyaW5nXG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gUHJvdmlkZXIucGxhY2Vob2xkZXJcbiAgbGV0IG5ld0N1cnNvclBvc2l0aW9uID0gaW5pdGlhbEN1cnNvckluZGV4XG5cbiAgY29uc3QgcGxhY2Vob2xkZXJJbmRleCA9IHNlbGVjdGVkVmFsdWUuaW5kZXhPZihwbGFjZWhvbGRlcilcbiAgaWYgKHBsYWNlaG9sZGVySW5kZXggPiAtMSkge1xuICAgIC8vIFRPRE86IE1hbmFnZSBtdWx0aXBsZSBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBwbGFjZWhvbGRlclJlZ2V4ID0gbmV3IFJlZ0V4cChwbGFjZWhvbGRlciwgJ2cnKVxuICAgIG5vcm1hbGl6ZWRWYWx1ZSA9IHNlbGVjdGVkVmFsdWUucmVwbGFjZShwbGFjZWhvbGRlclJlZ2V4LCAnJylcbiAgICBuZXdDdXJzb3JQb3NpdGlvbiArPSBwbGFjZWhvbGRlckluZGV4XG4gIH0gZWxzZSB7XG4gICAgbm9ybWFsaXplZFZhbHVlID0gc2VsZWN0ZWRWYWx1ZVxuICAgIG5ld0N1cnNvclBvc2l0aW9uICs9IHNlbGVjdGVkVmFsdWUubGVuZ3RoXG4gIH1cblxuICByZXR1cm4geyBub3JtYWxpemVkVmFsdWUsIG5ld0N1cnNvclBvc2l0aW9uIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdExhc3RTdWdnZXN0aW9uKFxuICBzZWxlY3RlZDogRGlyZWN0aW9uLFxuICBzdWdnZXN0aW9uc0xlbmd0aDogbnVtYmVyXG4pOiBEaXJlY3Rpb24ge1xuICBjb25zdCBkZWNyZWFzZWQgPSBzZWxlY3RlZC5pbmRleCAtIDFcbiAgY29uc3QgdXBkYXRlZFNlbGVjdGVkOiBEaXJlY3Rpb24gPSB7XG4gICAgaW5kZXg6IGRlY3JlYXNlZCA8IDAgPyBzdWdnZXN0aW9uc0xlbmd0aCAtIDEgOiBkZWNyZWFzZWQsXG4gICAgZGlyZWN0aW9uOiAnYmFja3dhcmQnLFxuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZWRTZWxlY3RlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRTdWdnZXN0aW9uRnJvbShcbiAgZXZlbnQ6IEtleWJvYXJkRXZlbnQsXG4gIHNlbGVjdGVkOiBEaXJlY3Rpb24sXG4gIHN1Z2dlc3Rpb25zTGVuZ3RoOiBudW1iZXJcbik6IERpcmVjdGlvbiB7XG4gIGxldCB1cGRhdGVkU2VsZWN0ZWQ6IERpcmVjdGlvbiA9IHNlbGVjdGVkXG4gIHN3aXRjaCAoYCR7ZXZlbnQuY3RybEtleX0gJHtldmVudC5rZXl9YCkge1xuICAgIGNhc2UgJ3RydWUgcCc6XG4gICAgY2FzZSAnZmFsc2UgQXJyb3dVcCc6XG4gICAgICB1cGRhdGVkU2VsZWN0ZWQgPSBzZWxlY3RMYXN0U3VnZ2VzdGlvbihzZWxlY3RlZCwgc3VnZ2VzdGlvbnNMZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3RydWUgbic6XG4gICAgY2FzZSAnZmFsc2UgQXJyb3dEb3duJzpcbiAgICAgIGNvbnN0IGluY3JlYXNlZCA9IHNlbGVjdGVkLmluZGV4ICsgMVxuICAgICAgdXBkYXRlZFNlbGVjdGVkID0ge1xuICAgICAgICBpbmRleDogaW5jcmVhc2VkID49IHN1Z2dlc3Rpb25zTGVuZ3RoID8gMCA6IGluY3JlYXNlZCxcbiAgICAgICAgZGlyZWN0aW9uOiAnZm9yd2FyZCcsXG4gICAgICB9XG4gICAgICBicmVha1xuICB9XG5cbiAgcmV0dXJuIHVwZGF0ZWRTZWxlY3RlZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weU9iamVjdChvYmo6IGFueSk6IGFueSB7XG4gIHJldHVybiB7IC4uLm9iaiB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZpbU5vcm1hbE1vZGUoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcik6IGJvb2xlYW4ge1xuICByZXR1cm4gZWRpdG9yLmdldE9wdGlvbigna2V5TWFwJykgPT09ICd2aW0nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZpbVRyaWdnZXIoe1xuICB0cmlnZ2VyTGlrZVZpbSxcbiAgZWRpdG9yLFxuICBldmVudCxcbn06IHtcbiAgdHJpZ2dlckxpa2VWaW06IGJvb2xlYW5cbiAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvclxuICBldmVudDogS2V5Ym9hcmRFdmVudFxufSkge1xuICByZXR1cm4gKFxuICAgIHRyaWdnZXJMaWtlVmltICYmXG4gICAgIWlzVmltTm9ybWFsTW9kZShlZGl0b3IpICYmXG4gICAgZXZlbnQuY3RybEtleSAmJlxuICAgIChldmVudC5rZXkgPT09ICduJyB8fCBldmVudC5rZXkgPT09ICdwJylcbiAgKVxufVxuXG5jb25zdCBQUklOVEFCTEVfQ0hBUlM6IHN0cmluZ1tdID0gW1wiRGlnaXQwXCIsIFwiRGlnaXQxXCIsIFwiRGlnaXQyXCIsIFwiRGlnaXQzXCIsIFwiRGlnaXQ0XCIsIFwiRGlnaXQ1XCIsIFwiRGlnaXQ2XCIsIFwiRGlnaXQ3XCIsIFwiRGlnaXQ4XCIsIFwiRGlnaXQ5XCIsIFwiTWludXNcIiwgXCJFcXVhbFwiLCBcIktleVFcIiwgXCJLZXlXXCIsIFwiS2V5RVwiLCBcIktleVJcIiwgXCJLZXlUXCIsIFwiS2V5WVwiLCBcIktleVVcIiwgXCJLZXlJXCIsIFwiS2V5T1wiLCBcIktleVBcIiwgXCJCcmFja2V0TGVmdFwiLCBcIkJyYWNrZXRSaWdodFwiLCBcIktleUFcIiwgXCJLZXlTXCIsIFwiS2V5RFwiLCBcIktleUZcIiwgXCJLZXlHXCIsIFwiS2V5SFwiLCBcIktleUpcIiwgXCJLZXlLXCIsIFwiS2V5TFwiLCBcIlNlbWljb2xvblwiLCBcIlF1b3RlXCIsIFwiQmFja3F1b3RlXCIsIFwiQmFja3NsYXNoXCIsIFwiS2V5WlwiLCBcIktleVhcIiwgXCJLZXlDXCIsIFwiS2V5VlwiLCBcIktleUJcIiwgXCJLZXlOXCIsIFwiS2V5TVwiLCBcIkNvbW1hXCIsIFwiUGVyaW9kXCIsIFwiU2xhc2hcIiwgXCJOdW1wYWRNdWx0aXBseVwiLCBcIk51bXBhZDdcIiwgXCJOdW1wYWQ4XCIsIFwiTnVtcGFkOVwiLCBcIk51bXBhZFN1YnRyYWN0XCIsIFwiTnVtcGFkNFwiLCBcIk51bXBhZDVcIiwgXCJOdW1wYWQ2XCIsIFwiTnVtcGFkQWRkXCIsIFwiTnVtcGFkMVwiLCBcIk51bXBhZDJcIiwgXCJOdW1wYWQzXCIsIFwiTnVtcGFkMFwiLCBcIk51bXBhZERlY2ltYWxcIl1cbmV4cG9ydCBmdW5jdGlvbiBpc0tleWJvYXJkQ29kZVByaW50YWJsZShjb2RlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIFBSSU5UQUJMRV9DSEFSUy5pbmNsdWRlcyhjb2RlKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBdXRvVHJpZ2dlcihcbiAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgZXZlbnQ6IEtleWJvYXJkRXZlbnQsXG4gIHRva2VuaXplcjogVG9rZW5pemVyLFxuICBzZXR0aW5nczogQXV0b2NvbXBsZXRlU2V0dGluZ3Ncbikge1xuICBsZXQgdHJpZ2dlciA9IGZhbHNlXG4gIGlmIChcbiAgICBzZXR0aW5ncy5hdXRvVHJpZ2dlciAmJlxuICAgICFpc1ZpbU5vcm1hbE1vZGUoZWRpdG9yKSAmJlxuICAgICF0b2tlbml6ZXIuaXNXb3JkU2VwYXJhdG9yKGV2ZW50LmtleSkgJiZcbiAgICBpc0tleWJvYXJkQ29kZVByaW50YWJsZShldmVudC5jb2RlKSAmJlxuICAgICEoXG4gICAgICAvLyBOb3Qgb24gY29weS9jdXQvcGFzdGUvdW5kb1xuICAgICAgKFxuICAgICAgICAoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSAmJlxuICAgICAgICAoZXZlbnQuY29kZSA9PT0gJ0tleVgnIHx8XG4gICAgICAgICAgZXZlbnQuY29kZSA9PT0gJ0tleUMnIHx8XG4gICAgICAgICAgZXZlbnQuY29kZSA9PT0gJ0tleVYnIHx8XG4gICAgICAgICAgZXZlbnQuY29kZSA9PT0gJ0tleVonKVxuICAgICAgKVxuICAgIClcbiAgKSB7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpXG4gICAgY29uc3QgY3VycmVudExpbmUgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSlcbiAgICAvLyBJZiBsYXN0IHdvcmQgaXMgbG9uZ2VyIG9yIGVxIHRoYW4gdGhyZXNob2xkXG4gICAgdHJpZ2dlciA9XG4gICAgICBjdXJyZW50TGluZS5sZW5ndGggLSB0b2tlbml6ZXIubGFzdFdvcmRTdGFydFBvcyhjdXJyZW50TGluZSwgY3Vyc29yLmNoKSA+PVxuICAgICAgc2V0dGluZ3MuYXV0b1RyaWdnZXJNaW5TaXplXG4gIH1cblxuICByZXR1cm4gdHJpZ2dlclxufVxuIiwiaW1wb3J0IHsgQ29tcGxldGlvbiB9IGZyb20gJy4uL3Byb3ZpZGVycy9wcm92aWRlcidcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJy4vY29yZSdcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVmlldyhzdWdnZXN0aW9uczogQ29tcGxldGlvbltdLCBzZWxlY3RlZEluZGV4OiBudW1iZXIpIHtcbiAgY29uc3Qgc3VnZ2VzdGlvbnNIdG1sID0gc3VnZ2VzdGlvbnMubWFwKCh0aXA6IENvbXBsZXRpb24sIGluZGV4KSA9PiB7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkSW5kZXggPT09IGluZGV4XG4gICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBpZD1cInN1Z2dlc3Rpb24tJHtpbmRleH1cIiBjbGFzcz1cIm5vLXNwYWNlLXdyYXAgc3VnZ2VzdGlvbi1pdGVtJHtcbiAgICAgIGlzU2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnXG4gICAgfVwiPlxuICAgICAgICAgIDxkaXYgaWQ9XCJzdWdnZXN0aW9uLSR7aW5kZXh9XCIgY2xhc3M9XCJzdWdnZXN0aW9uLWNvbnRlbnRcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInN1Z2dlc3Rpb24tZmxhaXJcIj4ke3RpcC5jYXRlZ29yeX08L3NwYW4+XG4gICAgICAgICAgJHt0aXAudmFsdWV9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgYFxuICB9LCBbXSlcbiAgY29uc3Qgc3VnZ2VzdGlvbnNKb2luZWQgPSBzdWdnZXN0aW9uc0h0bWwuam9pbignXFxuJylcbiAgY29uc3Qgdmlld1N0cmluZyA9IGBcbiAgICAgIDxkaXYgaWQ9XCJzdWdnZXN0aW9uLWxpc3RcIiBjbGFzcz1cInN1Z2dlc3Rpb25cIj5cbiAgICAgICAgJHtcbiAgICAgICAgICBzdWdnZXN0aW9uc0pvaW5lZC5sZW5ndGggPiAwXG4gICAgICAgICAgICA/IHN1Z2dlc3Rpb25zSm9pbmVkXG4gICAgICAgICAgICA6ICc8ZGl2IGNsYXNzPVwibm8tc3VnZ2VzdGlvbnNcIj5ObyBtYXRjaCBmb3VuZDwvZGl2PidcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvbXB0LWluc3RydWN0aW9uc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvbXB0LWluc3RydWN0aW9uXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9tcHQtaW5zdHJ1Y3Rpb24tY29tbWFuZFwiPkN0cmwrTiAv4oaRIDwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj5OZXh0IFN1Z2dlc3Rpb248L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvbXB0LWluc3RydWN0aW9uXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcm9tcHQtaW5zdHJ1Y3Rpb24tY29tbWFuZFwiPkN0cmwrUCAv4oaTIDwvc3Bhbj5cbiAgICAgICAgICA8c3Bhbj5QcmV2aW91cyBTdWdnZXN0aW9uPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByb21wdC1pbnN0cnVjdGlvblwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvbXB0LWluc3RydWN0aW9uLWNvbW1hbmRcIj5FbnRlci9UYWI8L3NwYW4+XG4gICAgICAgICAgPHNwYW4+U2VsZWN0IFN1Z2dlc3Rpb248L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgYFxuICBjb25zdCBjb250YWluZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgY29udGFpbmVyTm9kZS5jbGFzc0xpc3QuYWRkKCdzdWdnZXN0aW9uLWNvbnRhaW5lcicpXG4gIGNvbnRhaW5lck5vZGUuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCB2aWV3U3RyaW5nKVxuXG4gIHJldHVybiBjb250YWluZXJOb2RlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDYWNoZWRWaWV3KHZpZXc6IEhUTUxFbGVtZW50LCBzZWxlY3RlZEluZGV4OiBudW1iZXIpIHtcbiAgY29uc3QgY2hpbGRyZW4gPSB2aWV3LmZpcnN0RWxlbWVudENoaWxkPy5jaGlsZHJlblxuXG4gIGlmICghY2hpbGRyZW4pIHJldHVyblxuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2luZGV4XVxuICAgIGNoaWxkLnRvZ2dsZUNsYXNzKCdpcy1zZWxlY3RlZCcsIGluZGV4ID09PSBzZWxlY3RlZEluZGV4KVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbyhcbiAgc2VsZWN0ZWQ6IERpcmVjdGlvbixcbiAgdmlldzogSFRNTEVsZW1lbnQsXG4gIHN1Z2dlc3Rpb25zTGVuZ3RoOiBudW1iZXJcbikge1xuICBpZiAoIXZpZXcgfHwgc3VnZ2VzdGlvbnNMZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIFRPRE86IEltcHJvdmUgc2Nyb2xsaW5nIHdpdGggcGFnZSBzaXplIGFuZCBib3VuZGFyaWVzXG5cbiAgY29uc3QgcGFyZW50ID0gdmlldy5jaGlsZHJlblswXVxuICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWQuaW5kZXhcbiAgY29uc3QgY2hpbGQgPSBwYXJlbnQuY2hpbGRyZW5bMF1cbiAgaWYgKGNoaWxkKSB7XG4gICAgbGV0IHNjcm9sbEFtb3VudCA9IGNoaWxkLnNjcm9sbEhlaWdodCAqIHNlbGVjdGVkSW5kZXhcblxuICAgIHN3aXRjaCAoc2VsZWN0ZWQuZGlyZWN0aW9uKSB7XG4gICAgICBjYXNlICdmb3J3YXJkJzpcbiAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPT09IDApXG4gICAgICAgICAgLy8gRW5kIC0+IFN0YXJ0XG4gICAgICAgICAgcGFyZW50LnNjcm9sbFRvcCA9IDBcbiAgICAgICAgZWxzZSBwYXJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsQW1vdW50XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdiYWNrd2FyZCc6XG4gICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID09PSBzdWdnZXN0aW9uc0xlbmd0aCAtIDEpXG4gICAgICAgICAgLy8gRW5kIDwtIFN0YXJ0XG4gICAgICAgICAgcGFyZW50LnNjcm9sbFRvcCA9IHBhcmVudC5zY3JvbGxIZWlnaHRcbiAgICAgICAgZWxzZSBwYXJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsQW1vdW50XG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRXaWRnZXQoXG4gIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gIHZpZXc6IEhUTUxFbGVtZW50LFxuICBzY3JvbGxhYmxlID0gdHJ1ZVxuKSB7XG4gIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKVxuXG4gIGVkaXRvci5hZGRXaWRnZXQoeyBjaDogY3Vyc29yLmNoLCBsaW5lOiBjdXJzb3IubGluZSB9LCB2aWV3LCBzY3JvbGxhYmxlKVxufVxuIiwiaW1wb3J0IHsgVG9rZW5pemVyRmFjdG9yeSB9IGZyb20gJy4vZmxvdy9mYWN0b3J5J1xuaW1wb3J0IHsgVG9rZW5pemVyLCBUb2tlbml6ZVN0cmF0ZWd5IH0gZnJvbSAnLi9mbG93L3Rva2VuaXplcidcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcidcblxuZXhwb3J0IGNsYXNzIEZsb3dQcm92aWRlciBleHRlbmRzIFByb3ZpZGVyIHtcbiAgY2F0ZWdvcnkgPSAnRidcbiAgY29tcGxldGlvbnM6IHN0cmluZ1tdID0gW11cblxuICBhZGRMYXN0V29yZEZyb20oXG4gICAgbGluZTogc3RyaW5nLFxuICAgIGN1cnNvckluZGV4OiBudW1iZXIsXG4gICAgdG9rZW5pemVyOiBUb2tlbml6ZXJcbiAgKTogdm9pZCB7XG4gICAgY29uc3Qgd29yZCA9IHRva2VuaXplci5sYXN0V29yZEZyb20oXG4gICAgICBsaW5lLFxuICAgICAgY3Vyc29ySW5kZXgsXG4gICAgICB7IG5vcm1hbGl6ZTogdHJ1ZSB9XG4gICAgKVxuXG4gICAgdGhpcy5hZGRXb3JkKHdvcmQpXG4gIH1cblxuICBhZGRXb3Jkc0Zyb20odGV4dDogc3RyaW5nLCB0b2tlbml6ZXI6IFRva2VuaXplcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRva2VuaXplci50b2tlbml6ZSh0ZXh0KVxuXG4gICAgcmVzdWx0LnRva2Vucy5mb3JFYWNoKCh0b2tlbikgPT4gdGhpcy5hZGRXb3JkKHRva2VuKSlcbiAgfVxuXG4gIHByaXZhdGUgYWRkV29yZCh3b3JkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXdvcmQgfHwgdGhpcy5hbHJlYWR5QWRkZWQod29yZCkpIHJldHVyblxuXG4gICAgdGhpcy5jb21wbGV0aW9ucy5wdXNoKHdvcmQpXG4gIH1cblxuICBwcml2YXRlIGFscmVhZHlBZGRlZCh3b3JkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb21wbGV0aW9ucy5pbmNsdWRlcyh3b3JkKVxuICB9XG59XG4iLCJleHBvcnQgdHlwZSBUb2tlbml6ZVN0cmF0ZWd5ID0gJ2RlZmF1bHQnIHwgJ2phcGFuZXNlJyB8ICdhcmFiaWMnXG5leHBvcnQgY29uc3QgVE9LRU5JWkVfU1RSQVRFR0lFUzogVG9rZW5pemVTdHJhdGVneVtdID0gW1xuICAnZGVmYXVsdCcsXG4gICdqYXBhbmVzZScsXG4gICdhcmFiaWMnLFxuXVxuXG5leHBvcnQgaW50ZXJmYWNlIFRva2VuaXplZFJlc3VsdCB7XG4gIHJhbmdlPzogUmFuZ2VcbiAgdG9rZW5zOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgdHlwZSBSYW5nZSA9IHsgc3RhcnQ/OiBudW1iZXI7IGVuZD86IG51bWJlciB9XG5leHBvcnQgdHlwZSBUb2tlbml6ZXJPcHRpb25zID0geyBub3JtYWxpemU6IGJvb2xlYW4gfVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVG9rZW5pemVyIHtcbiAgcHJvdGVjdGVkIHdvcmRTZXBhcmF0b3JQYXR0ZXJuOiBSZWdFeHBcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRyaW1QYXR0ZXJuOiBSZWdFeHBcblxuICBjb25zdHJ1Y3Rvcih3b3JkU2VwYXJhdG9yczogc3RyaW5nKSB7XG4gICAgY29uc3QgZXNjYXBlZFNlcGFyYXRvcnMgPSB3b3JkU2VwYXJhdG9ycy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgdGhpcy53b3JkU2VwYXJhdG9yUGF0dGVybiA9IG5ldyBSZWdFeHAoYFske2VzY2FwZWRTZXBhcmF0b3JzfV1gKVxuXG4gICAgLy8gTk9URTogZ2xvYmFsIGZsYWcgdGFrZXMgbm90ZSBvZiBsYXN0SW5kZXggdXNlZCFcbiAgICB0aGlzLnRyaW1QYXR0ZXJuID0gbmV3IFJlZ0V4cCh0aGlzLndvcmRTZXBhcmF0b3JQYXR0ZXJuLCAnZycpXG4gIH1cblxuICBhYnN0cmFjdCB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcsIHJhbmdlPzogUmFuZ2UpOiBUb2tlbml6ZWRSZXN1bHQgfCB1bmRlZmluZWRcblxuICBsYXN0V29yZFN0YXJ0UG9zKFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IFRva2VuaXplck9wdGlvbnMgPSB7IG5vcm1hbGl6ZTogZmFsc2UgfVxuICApOiBudW1iZXIge1xuICAgIGNvbnN0IHsgbm9ybWFsaXplZCwgdXBkYXRlZEN1cnNvciB9ID0gb3B0aW9ucy5ub3JtYWxpemVcbiAgICAgID8gdGhpcy5ub3JtYWxpemVkTGluZSh0ZXh0LCBpbmRleClcbiAgICAgIDogeyBub3JtYWxpemVkOiB0ZXh0LCB1cGRhdGVkQ3Vyc29yOiBpbmRleCB9XG5cbiAgICBsZXQgd29yZFN0YXJ0SW5kZXggPSB1cGRhdGVkQ3Vyc29yXG4gICAgd2hpbGUgKFxuICAgICAgd29yZFN0YXJ0SW5kZXggJiZcbiAgICAgICF0aGlzLmlzV29yZFNlcGFyYXRvcihub3JtYWxpemVkLmNoYXJBdCh3b3JkU3RhcnRJbmRleCAtIDEpKVxuICAgIClcbiAgICAgIHdvcmRTdGFydEluZGV4IC09IDFcblxuICAgIHJldHVybiB3b3JkU3RhcnRJbmRleFxuICB9XG5cbiAgbGFzdFdvcmRGcm9tKFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBjdXJzb3JJbmRleDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IFRva2VuaXplck9wdGlvbnMgPSB7IG5vcm1hbGl6ZTogZmFsc2UgfVxuICApOiBzdHJpbmcgfCBudWxsIHtcbiAgICBjb25zdCB7IG5vcm1hbGl6ZWQsIHVwZGF0ZWRDdXJzb3IgfSA9IG9wdGlvbnMubm9ybWFsaXplXG4gICAgICA/IHRoaXMubm9ybWFsaXplZExpbmUodGV4dCwgY3Vyc29ySW5kZXgpXG4gICAgICA6IHsgbm9ybWFsaXplZDogdGV4dCwgdXBkYXRlZEN1cnNvcjogY3Vyc29ySW5kZXggfVxuXG4gICAgaWYgKG9wdGlvbnMubm9ybWFsaXplKVxuICAgICAgLy8gQWxyZWFkeSBub3JtYWxpemVkXG4gICAgICBvcHRpb25zLm5vcm1hbGl6ZSA9IGZhbHNlXG5cbiAgICBsZXQgd29yZFN0YXJ0SW5kZXggPSB0aGlzLmxhc3RXb3JkU3RhcnRQb3MoXG4gICAgICBub3JtYWxpemVkLFxuICAgICAgdXBkYXRlZEN1cnNvcixcbiAgICAgIG9wdGlvbnNcbiAgICApXG4gICAgbGV0IHdvcmQ6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gICAgaWYgKHdvcmRTdGFydEluZGV4ICE9PSB1cGRhdGVkQ3Vyc29yKVxuICAgICAgd29yZCA9IHRleHQuc2xpY2Uod29yZFN0YXJ0SW5kZXgsIHVwZGF0ZWRDdXJzb3IpXG5cbiAgICByZXR1cm4gd29yZFxuICB9XG5cbiAgaXNXb3JkU2VwYXJhdG9yKGNoYXI6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLndvcmRTZXBhcmF0b3JQYXR0ZXJuLnRlc3QoY2hhcilcbiAgfVxuXG4gIC8qXG4gICAqIFJlbW92ZSBzcGFjZXMgYW5kIHdvcmQgc2VwYXJhdG9yc1xuICAgKiBuZWFyIHRoZSBsZWZ0IG9mIHRoZSBjdXJzb3JJbmRleFxuICAgKi9cbiAgcHJvdGVjdGVkIG5vcm1hbGl6ZWRMaW5lKFxuICAgIGxpbmU6IHN0cmluZyxcbiAgICBjdXJzb3JJbmRleDogbnVtYmVyXG4gICk6IHsgbm9ybWFsaXplZDogc3RyaW5nOyB1cGRhdGVkQ3Vyc29yOiBudW1iZXIgfSB7XG4gICAgY29uc3QgcGFydGlhbExpbmUgPSBsaW5lLnNsaWNlKDAsIGN1cnNvckluZGV4KVxuICAgIGxldCBub3JtYWxpemVkID0gcGFydGlhbExpbmUudHJpbUVuZCgpXG5cbiAgICAvLyBTdWJ0cmFjdCBob3cgbWFueSBzcGFjZXMgcmVtb3ZlZFxuICAgIGxldCB1cGRhdGVkQ3Vyc29yID0gY3Vyc29ySW5kZXggLSAocGFydGlhbExpbmUubGVuZ3RoIC0gbm9ybWFsaXplZC5sZW5ndGgpXG5cbiAgICBpZiAobm9ybWFsaXplZC5sZW5ndGggPT09IDApIHJldHVybiB7IG5vcm1hbGl6ZWQ6ICcnLCB1cGRhdGVkQ3Vyc29yOiAwIH1cblxuICAgIGNvbnN0IGxhc3RDaGFyID0gbm9ybWFsaXplZC5jaGFyQXQodXBkYXRlZEN1cnNvciAtIDEpXG5cbiAgICBpZiAodGhpcy5pc1dvcmRTZXBhcmF0b3IobGFzdENoYXIpKSB7XG4gICAgICB1cGRhdGVkQ3Vyc29yIC09IDFcbiAgICAgIG5vcm1hbGl6ZWQgPSBub3JtYWxpemVkLnNsaWNlKDAsIHVwZGF0ZWRDdXJzb3IpXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbm9ybWFsaXplZCwgdXBkYXRlZEN1cnNvciB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFJhbmdlLCBUb2tlbml6ZXIgfSBmcm9tICcuLi90b2tlbml6ZXInXG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0VG9rZW5pemVyIGV4dGVuZHMgVG9rZW5pemVyIHtcbiAgdG9rZW5pemUodGV4dDogc3RyaW5nLCByYW5nZT86IFJhbmdlKSB7XG4gICAgY29uc3QgdG9rZW5zID0gdGV4dFxuICAgICAgLnNsaWNlKHJhbmdlPy5zdGFydCwgcmFuZ2U/LmVuZClcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5mbGF0TWFwPHN0cmluZz4oKGxpbmUpID0+IGxpbmUuc3BsaXQodGhpcy50cmltUGF0dGVybikpXG4gICAgICAuZmlsdGVyKCh0KSA9PiB0Lmxlbmd0aCA+IDApXG5cbiAgICByZXR1cm4geyByYW5nZSwgdG9rZW5zIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gJy4vZGVmYXVsdCdcblxuZXhwb3J0IGNsYXNzIEFyYWJpY1Rva2VuaXplciBleHRlbmRzIERlZmF1bHRUb2tlbml6ZXIge31cbiIsIi8vIEB0cy1ub2NoZWNrXG4vLyBCZWNhdXNlIHRoaXMgY29kZSBpcyBvcmlnaW5hbGx5IGphdmFzY3JpcHQgY29kZS5cblxuLy8gVGlueVNlZ21lbnRlciAwLjEgLS0gU3VwZXIgY29tcGFjdCBKYXBhbmVzZSB0b2tlbml6ZXIgaW4gSmF2YXNjcmlwdFxuLy8gKGMpIDIwMDggVGFrdSBLdWRvIDx0YWt1QGNoYXNlbi5vcmc+XG4vLyBUaW55U2VnbWVudGVyIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlIHVuZGVyIHRoZSB0ZXJtcyBvZiBhIG5ldyBCU0QgbGljZW5jZS5cbi8vIEZvciBkZXRhaWxzLCBzZWUgaHR0cDovL2NoYXNlbi5vcmcvfnRha3Uvc29mdHdhcmUvVGlueVNlZ21lbnRlci9MSUNFTkNFLnR4dFxuXG5leHBvcnQgZnVuY3Rpb24gVGlueVNlZ21lbnRlcigpIHtcbiAgdmFyIHBhdHRlcm5zID0ge1xuICAgICdb5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5Lmd5Y2B55m+5Y2D5LiH5YSE5YWGXSc6ICdNJyxcbiAgICAnW+S4gC3pvqDjgIXjgIbjg7Xjg7ZdJzogJ0gnLFxuICAgICdb44GBLeOCk10nOiAnSScsXG4gICAgJ1vjgqEt44O044O8772xLe++ne++nu+9sF0nOiAnSycsXG4gICAgJ1thLXpBLVrvvYEt772a77yhLe+8ul0nOiAnQScsXG4gICAgJ1swLTnvvJAt77yZXSc6ICdOJyxcbiAgfVxuICB0aGlzLmNoYXJ0eXBlXyA9IFtdXG4gIGZvciAodmFyIGkgaW4gcGF0dGVybnMpIHtcbiAgICB2YXIgcmVnZXhwID0gbmV3IFJlZ0V4cCgpXG4gICAgcmVnZXhwLmNvbXBpbGUoaSlcbiAgICB0aGlzLmNoYXJ0eXBlXy5wdXNoKFtyZWdleHAsIHBhdHRlcm5zW2ldXSlcbiAgfVxuXG4gIHRoaXMuQklBU19fID0gLTMzMlxuICB0aGlzLkJDMV9fID0geyBISDogNiwgSUk6IDI0NjEsIEtIOiA0MDYsIE9IOiAtMTM3OCB9XG4gIHRoaXMuQkMyX18gPSB7XG4gICAgQUE6IC0zMjY3LFxuICAgIEFJOiAyNzQ0LFxuICAgIEFOOiAtODc4LFxuICAgIEhIOiAtNDA3MCxcbiAgICBITTogLTE3MTEsXG4gICAgSE46IDQwMTIsXG4gICAgSE86IDM3NjEsXG4gICAgSUE6IDEzMjcsXG4gICAgSUg6IC0xMTg0LFxuICAgIElJOiAtMTMzMixcbiAgICBJSzogMTcyMSxcbiAgICBJTzogNTQ5MixcbiAgICBLSTogMzgzMSxcbiAgICBLSzogLTg3NDEsXG4gICAgTUg6IC0zMTMyLFxuICAgIE1LOiAzMzM0LFxuICAgIE9POiAtMjkyMCxcbiAgfVxuICB0aGlzLkJDM19fID0ge1xuICAgIEhIOiA5OTYsXG4gICAgSEk6IDYyNixcbiAgICBISzogLTcyMSxcbiAgICBITjogLTEzMDcsXG4gICAgSE86IC04MzYsXG4gICAgSUg6IC0zMDEsXG4gICAgS0s6IDI3NjIsXG4gICAgTUs6IDEwNzksXG4gICAgTU06IDQwMzQsXG4gICAgT0E6IC0xNjUyLFxuICAgIE9IOiAyNjYsXG4gIH1cbiAgdGhpcy5CUDFfXyA9IHsgQkI6IDI5NSwgT0I6IDMwNCwgT086IC0xMjUsIFVCOiAzNTIgfVxuICB0aGlzLkJQMl9fID0geyBCTzogNjAsIE9POiAtMTc2MiB9XG4gIHRoaXMuQlExX18gPSB7XG4gICAgQkhIOiAxMTUwLFxuICAgIEJITTogMTUyMSxcbiAgICBCSUk6IC0xMTU4LFxuICAgIEJJTTogODg2LFxuICAgIEJNSDogMTIwOCxcbiAgICBCTkg6IDQ0OSxcbiAgICBCT0g6IC05MSxcbiAgICBCT086IC0yNTk3LFxuICAgIE9ISTogNDUxLFxuICAgIE9JSDogLTI5NixcbiAgICBPS0E6IDE4NTEsXG4gICAgT0tIOiAtMTAyMCxcbiAgICBPS0s6IDkwNCxcbiAgICBPT086IDI5NjUsXG4gIH1cbiAgdGhpcy5CUTJfXyA9IHtcbiAgICBCSEg6IDExOCxcbiAgICBCSEk6IC0xMTU5LFxuICAgIEJITTogNDY2LFxuICAgIEJJSDogLTkxOSxcbiAgICBCS0s6IC0xNzIwLFxuICAgIEJLTzogODY0LFxuICAgIE9ISDogLTExMzksXG4gICAgT0hNOiAtMTgxLFxuICAgIE9JSDogMTUzLFxuICAgIFVISTogLTExNDYsXG4gIH1cbiAgdGhpcy5CUTNfXyA9IHtcbiAgICBCSEg6IC03OTIsXG4gICAgQkhJOiAyNjY0LFxuICAgIEJJSTogLTI5OSxcbiAgICBCS0k6IDQxOSxcbiAgICBCTUg6IDkzNyxcbiAgICBCTU06IDgzMzUsXG4gICAgQk5OOiA5OTgsXG4gICAgQk9IOiA3NzUsXG4gICAgT0hIOiAyMTc0LFxuICAgIE9ITTogNDM5LFxuICAgIE9JSTogMjgwLFxuICAgIE9LSDogMTc5OCxcbiAgICBPS0k6IC03OTMsXG4gICAgT0tPOiAtMjI0MixcbiAgICBPTUg6IC0yNDAyLFxuICAgIE9PTzogMTE2OTksXG4gIH1cbiAgdGhpcy5CUTRfXyA9IHtcbiAgICBCSEg6IC0zODk1LFxuICAgIEJJSDogMzc2MSxcbiAgICBCSUk6IC00NjU0LFxuICAgIEJJSzogMTM0OCxcbiAgICBCS0s6IC0xODA2LFxuICAgIEJNSTogLTMzODUsXG4gICAgQk9POiAtMTIzOTYsXG4gICAgT0FIOiA5MjYsXG4gICAgT0hIOiAyNjYsXG4gICAgT0hLOiAtMjAzNixcbiAgICBPTk46IC05NzMsXG4gIH1cbiAgdGhpcy5CVzFfXyA9IHtcbiAgICAnLOOBqCc6IDY2MCxcbiAgICAnLOWQjCc6IDcyNyxcbiAgICBCMeOBgjogMTQwNCxcbiAgICBCMeWQjDogNTQyLFxuICAgICfjgIHjgagnOiA2NjAsXG4gICAgJ+OAgeWQjCc6IDcyNyxcbiAgICAn44CN44GoJzogMTY4MixcbiAgICDjgYLjgaM6IDE1MDUsXG4gICAg44GE44GGOiAxNzQzLFxuICAgIOOBhOOBozogLTIwNTUsXG4gICAg44GE44KLOiA2NzIsXG4gICAg44GG44GXOiAtNDgxNyxcbiAgICDjgYbjgpM6IDY2NSxcbiAgICDjgYvjgok6IDM0NzIsXG4gICAg44GM44KJOiA2MDAsXG4gICAg44GT44GGOiAtNzkwLFxuICAgIOOBk+OBqDogMjA4MyxcbiAgICDjgZPjgpM6IC0xMjYyLFxuICAgIOOBleOCiTogLTQxNDMsXG4gICAg44GV44KTOiA0NTczLFxuICAgIOOBl+OBnzogMjY0MSxcbiAgICDjgZfjgaY6IDExMDQsXG4gICAg44GZ44GnOiAtMzM5OSxcbiAgICDjgZ3jgZM6IDE5NzcsXG4gICAg44Gd44KMOiAtODcxLFxuICAgIOOBn+OBoTogMTEyMixcbiAgICDjgZ/jgoE6IDYwMSxcbiAgICDjgaPjgZ86IDM0NjMsXG4gICAg44Gk44GEOiAtODAyLFxuICAgIOOBpuOBhDogODA1LFxuICAgIOOBpuOBjTogMTI0OSxcbiAgICDjgafjgY06IDExMjcsXG4gICAg44Gn44GZOiAzNDQ1LFxuICAgIOOBp+OBrzogODQ0LFxuICAgIOOBqOOBhDogLTQ5MTUsXG4gICAg44Go44G/OiAxOTIyLFxuICAgIOOBqeOBkzogMzg4NyxcbiAgICDjgarjgYQ6IDU3MTMsXG4gICAg44Gq44GjOiAzMDE1LFxuICAgIOOBquOBqTogNzM3OSxcbiAgICDjgarjgpM6IC0xMTEzLFxuICAgIOOBq+OBlzogMjQ2OCxcbiAgICDjgavjga86IDE0OTgsXG4gICAg44Gr44KCOiAxNjcxLFxuICAgIOOBq+WvvjogLTkxMixcbiAgICDjga7kuIA6IC01MDEsXG4gICAg44Gu5LitOiA3NDEsXG4gICAg44G+44GbOiAyNDQ4LFxuICAgIOOBvuOBpzogMTcxMSxcbiAgICDjgb7jgb46IDI2MDAsXG4gICAg44G+44KLOiAtMjE1NSxcbiAgICDjgoTjgoA6IC0xOTQ3LFxuICAgIOOCiOOBozogLTI1NjUsXG4gICAg44KM44GfOiAyMzY5LFxuICAgIOOCjOOBpzogLTkxMyxcbiAgICDjgpLjgZc6IDE4NjAsXG4gICAg44KS6KaLOiA3MzEsXG4gICAg5Lqh44GPOiAtMTg4NixcbiAgICDkuqzpg706IDI1NTgsXG4gICAg5Y+W44KKOiAtMjc4NCxcbiAgICDlpKfjgY06IC0yNjA0LFxuICAgIOWkp+mYqjogMTQ5NyxcbiAgICDlubPmlrk6IC0yMzE0LFxuICAgIOW8leOBjTogLTEzMzYsXG4gICAg5pel5pysOiAtMTk1LFxuICAgIOacrOW9kzogLTI0MjMsXG4gICAg5q+O5pelOiAtMjExMyxcbiAgICDnm67mjIc6IC03MjQsXG4gICAg77yi77yR44GCOiAxNDA0LFxuICAgIO+8ou+8keWQjDogNTQyLFxuICAgICfvvaPjgagnOiAxNjgyLFxuICB9XG4gIHRoaXMuQlcyX18gPSB7XG4gICAgJy4uJzogLTExODIyLFxuICAgIDExOiAtNjY5LFxuICAgICfigJXigJUnOiAtNTczMCxcbiAgICAn4oiS4oiSJzogLTEzMTc1LFxuICAgIOOBhOOBhjogLTE2MDksXG4gICAg44GG44GLOiAyNDkwLFxuICAgIOOBi+OBlzogLTEzNTAsXG4gICAg44GL44KCOiAtNjAyLFxuICAgIOOBi+OCiTogLTcxOTQsXG4gICAg44GL44KMOiA0NjEyLFxuICAgIOOBjOOBhDogODUzLFxuICAgIOOBjOOCiTogLTMxOTgsXG4gICAg44GN44GfOiAxOTQxLFxuICAgIOOBj+OBqjogLTE1OTcsXG4gICAg44GT44GoOiAtODM5MixcbiAgICDjgZPjga46IC00MTkzLFxuICAgIOOBleOBmzogNDUzMyxcbiAgICDjgZXjgow6IDEzMTY4LFxuICAgIOOBleOCkzogLTM5NzcsXG4gICAg44GX44GEOiAtMTgxOSxcbiAgICDjgZfjgYs6IC01NDUsXG4gICAg44GX44GfOiA1MDc4LFxuICAgIOOBl+OBpjogOTcyLFxuICAgIOOBl+OBqjogOTM5LFxuICAgIOOBneOBrjogLTM3NDQsXG4gICAg44Gf44GEOiAtMTI1MyxcbiAgICDjgZ/jgZ86IC02NjIsXG4gICAg44Gf44GgOiAtMzg1NyxcbiAgICDjgZ/jgaE6IC03ODYsXG4gICAg44Gf44GoOiAxMjI0LFxuICAgIOOBn+OBrzogLTkzOSxcbiAgICDjgaPjgZ86IDQ1ODksXG4gICAg44Gj44GmOiAxNjQ3LFxuICAgIOOBo+OBqDogLTIwOTQsXG4gICAg44Gm44GEOiA2MTQ0LFxuICAgIOOBpuOBjTogMzY0MCxcbiAgICDjgabjgY86IDI1NTEsXG4gICAg44Gm44GvOiAtMzExMCxcbiAgICDjgabjgoI6IC0zMDY1LFxuICAgIOOBp+OBhDogMjY2NixcbiAgICDjgafjgY06IC0xNTI4LFxuICAgIOOBp+OBlzogLTM4MjgsXG4gICAg44Gn44GZOiAtNDc2MSxcbiAgICDjgafjgoI6IC00MjAzLFxuICAgIOOBqOOBhDogMTg5MCxcbiAgICDjgajjgZM6IC0xNzQ2LFxuICAgIOOBqOOBqDogLTIyNzksXG4gICAg44Go44GuOiA3MjAsXG4gICAg44Go44G/OiA1MTY4LFxuICAgIOOBqOOCgjogLTM5NDEsXG4gICAg44Gq44GEOiAtMjQ4OCxcbiAgICDjgarjgYw6IC0xMzEzLFxuICAgIOOBquOBqTogLTY1MDksXG4gICAg44Gq44GuOiAyNjE0LFxuICAgIOOBquOCkzogMzA5OSxcbiAgICDjgavjgYo6IC0xNjE1LFxuICAgIOOBq+OBlzogMjc0OCxcbiAgICDjgavjgao6IDI0NTQsXG4gICAg44Gr44KIOiAtNzIzNixcbiAgICDjgavlr746IC0xNDk0MyxcbiAgICDjgavlvpM6IC00Njg4LFxuICAgIOOBq+mWojogLTExMzg4LFxuICAgIOOBruOBizogMjA5MyxcbiAgICDjga7jgac6IC03MDU5LFxuICAgIOOBruOBqzogLTYwNDEsXG4gICAg44Gu44GuOiAtNjEyNSxcbiAgICDjga/jgYQ6IDEwNzMsXG4gICAg44Gv44GMOiAtMTAzMyxcbiAgICDjga/jgZo6IC0yNTMyLFxuICAgIOOBsOOCjDogMTgxMyxcbiAgICDjgb7jgZc6IC0xMzE2LFxuICAgIOOBvuOBpzogLTY2MjEsXG4gICAg44G+44KMOiA1NDA5LFxuICAgIOOCgeOBpjogLTMxNTMsXG4gICAg44KC44GEOiAyMjMwLFxuICAgIOOCguOBrjogLTEwNzEzLFxuICAgIOOCieOBizogLTk0NCxcbiAgICDjgonjgZc6IC0xNjExLFxuICAgIOOCieOBqzogLTE4OTcsXG4gICAg44KK44GXOiA2NTEsXG4gICAg44KK44G+OiAxNjIwLFxuICAgIOOCjOOBnzogNDI3MCxcbiAgICDjgozjgaY6IDg0OSxcbiAgICDjgozjgbA6IDQxMTQsXG4gICAg44KN44GGOiA2MDY3LFxuICAgIOOCj+OCjDogNzkwMSxcbiAgICDjgpLpgJo6IC0xMTg3NyxcbiAgICDjgpPjgaA6IDcyOCxcbiAgICDjgpPjgao6IC00MTE1LFxuICAgIOS4gOS6ujogNjAyLFxuICAgIOS4gOaWuTogLTEzNzUsXG4gICAg5LiA5pelOiA5NzAsXG4gICAg5LiA6YOoOiAtMTA1MSxcbiAgICDkuIrjgYw6IC00NDc5LFxuICAgIOS8muekvjogLTExMTYsXG4gICAg5Ye644GmOiAyMTYzLFxuICAgIOWIhuOBrjogLTc3NTgsXG4gICAg5ZCM5YWaOiA5NzAsXG4gICAg5ZCM5pelOiAtOTEzLFxuICAgIOWkp+mYqjogLTI0NzEsXG4gICAg5aeU5ZOhOiAtMTI1MCxcbiAgICDlsJHjgao6IC0xMDUwLFxuICAgIOW5tOW6pjogLTg2NjksXG4gICAg5bm06ZaTOiAtMTYyNixcbiAgICDlupznnIw6IC0yMzYzLFxuICAgIOaJi+aoqTogLTE5ODIsXG4gICAg5paw6IGeOiAtNDA2NixcbiAgICDml6XmlrA6IC03MjIsXG4gICAg5pel5pysOiAtNzA2OCxcbiAgICDml6XnsbM6IDMzNzIsXG4gICAg5puc5pelOiAtNjAxLFxuICAgIOacnemurjogLTIzNTUsXG4gICAg5pys5Lq6OiAtMjY5NyxcbiAgICDmnbHkuqw6IC0xNTQzLFxuICAgIOeEtuOBqDogLTEzODQsXG4gICAg56S+5LyaOiAtMTI3NixcbiAgICDnq4vjgaY6IC05OTAsXG4gICAg56ys44GrOiAtMTYxMixcbiAgICDnsbPlm706IC00MjY4LFxuICAgICfvvJHvvJEnOiAtNjY5LFxuICB9XG4gIHRoaXMuQlczX18gPSB7XG4gICAg44GC44GfOiAtMjE5NCxcbiAgICDjgYLjgoo6IDcxOSxcbiAgICDjgYLjgos6IDM4NDYsXG4gICAgJ+OBhC4nOiAtMTE4NSxcbiAgICAn44GE44CCJzogLTExODUsXG4gICAg44GE44GEOiA1MzA4LFxuICAgIOOBhOOBiDogMjA3OSxcbiAgICDjgYTjgY86IDMwMjksXG4gICAg44GE44GfOiAyMDU2LFxuICAgIOOBhOOBozogMTg4MyxcbiAgICDjgYTjgos6IDU2MDAsXG4gICAg44GE44KPOiAxNTI3LFxuICAgIOOBhuOBoTogMTExNyxcbiAgICDjgYbjgag6IDQ3OTgsXG4gICAg44GI44GoOiAxNDU0LFxuICAgICfjgYsuJzogMjg1NyxcbiAgICAn44GL44CCJzogMjg1NyxcbiAgICDjgYvjgZE6IC03NDMsXG4gICAg44GL44GjOiAtNDA5OCxcbiAgICDjgYvjgas6IC02NjksXG4gICAg44GL44KJOiA2NTIwLFxuICAgIOOBi+OCijogLTI2NzAsXG4gICAgJ+OBjCwnOiAxODE2LFxuICAgICfjgYzjgIEnOiAxODE2LFxuICAgIOOBjOOBjTogLTQ4NTUsXG4gICAg44GM44GROiAtMTEyNyxcbiAgICDjgYzjgaM6IC05MTMsXG4gICAg44GM44KJOiAtNDk3NyxcbiAgICDjgYzjgoo6IC0yMDY0LFxuICAgIOOBjeOBnzogMTY0NSxcbiAgICDjgZHjgak6IDEzNzQsXG4gICAg44GT44GoOiA3Mzk3LFxuICAgIOOBk+OBrjogMTU0MixcbiAgICDjgZPjgo06IC0yNzU3LFxuICAgIOOBleOBhDogLTcxNCxcbiAgICDjgZXjgpI6IDk3NixcbiAgICAn44GXLCc6IDE1NTcsXG4gICAgJ+OBl+OAgSc6IDE1NTcsXG4gICAg44GX44GEOiAtMzcxNCxcbiAgICDjgZfjgZ86IDM1NjIsXG4gICAg44GX44GmOiAxNDQ5LFxuICAgIOOBl+OBqjogMjYwOCxcbiAgICDjgZfjgb46IDEyMDAsXG4gICAgJ+OBmS4nOiAtMTMxMCxcbiAgICAn44GZ44CCJzogLTEzMTAsXG4gICAg44GZ44KLOiA2NTIxLFxuICAgICfjgZosJzogMzQyNixcbiAgICAn44Ga44CBJzogMzQyNixcbiAgICDjgZrjgas6IDg0MSxcbiAgICDjgZ3jgYY6IDQyOCxcbiAgICAn44GfLic6IDg4NzUsXG4gICAgJ+OBn+OAgic6IDg4NzUsXG4gICAg44Gf44GEOiAtNTk0LFxuICAgIOOBn+OBrjogODEyLFxuICAgIOOBn+OCijogLTExODMsXG4gICAg44Gf44KLOiAtODUzLFxuICAgICfjgaAuJzogNDA5OCxcbiAgICAn44Gg44CCJzogNDA5OCxcbiAgICDjgaDjgaM6IDEwMDQsXG4gICAg44Gj44GfOiAtNDc0OCxcbiAgICDjgaPjgaY6IDMwMCxcbiAgICDjgabjgYQ6IDYyNDAsXG4gICAg44Gm44GKOiA4NTUsXG4gICAg44Gm44KCOiAzMDIsXG4gICAg44Gn44GZOiAxNDM3LFxuICAgIOOBp+OBqzogLTE0ODIsXG4gICAg44Gn44GvOiAyMjk1LFxuICAgIOOBqOOBhjogLTEzODcsXG4gICAg44Go44GXOiAyMjY2LFxuICAgIOOBqOOBrjogNTQxLFxuICAgIOOBqOOCgjogLTM1NDMsXG4gICAg44Gp44GGOiA0NjY0LFxuICAgIOOBquOBhDogMTc5NixcbiAgICDjgarjgY86IC05MDMsXG4gICAg44Gq44GpOiAyMTM1LFxuICAgICfjgassJzogLTEwMjEsXG4gICAgJ+OBq+OAgSc6IC0xMDIxLFxuICAgIOOBq+OBlzogMTc3MSxcbiAgICDjgavjgao6IDE5MDYsXG4gICAg44Gr44GvOiAyNjQ0LFxuICAgICfjga4sJzogLTcyNCxcbiAgICAn44Gu44CBJzogLTcyNCxcbiAgICDjga7lrZA6IC0xMDAwLFxuICAgICfjga8sJzogMTMzNyxcbiAgICAn44Gv44CBJzogMTMzNyxcbiAgICDjgbnjgY06IDIxODEsXG4gICAg44G+44GXOiAxMTEzLFxuICAgIOOBvuOBmTogNjk0MyxcbiAgICDjgb7jgaM6IC0xNTQ5LFxuICAgIOOBvuOBpzogNjE1NCxcbiAgICDjgb7jgow6IC03OTMsXG4gICAg44KJ44GXOiAxNDc5LFxuICAgIOOCieOCjDogNjgyMCxcbiAgICDjgovjgos6IDM4MTgsXG4gICAgJ+OCjCwnOiA4NTQsXG4gICAgJ+OCjOOAgSc6IDg1NCxcbiAgICDjgozjgZ86IDE4NTAsXG4gICAg44KM44GmOiAxMzc1LFxuICAgIOOCjOOBsDogLTMyNDYsXG4gICAg44KM44KLOiAxMDkxLFxuICAgIOOCj+OCjDogLTYwNSxcbiAgICDjgpPjgaA6IDYwNixcbiAgICDjgpPjgac6IDc5OCxcbiAgICDjgqvmnIg6IDk5MCxcbiAgICDkvJrorbA6IDg2MCxcbiAgICDlhaXjgoo6IDEyMzIsXG4gICAg5aSn5LyaOiAyMjE3LFxuICAgIOWni+OCgTogMTY4MSxcbiAgICDluII6IDk2NSxcbiAgICDmlrDogZ46IC01MDU1LFxuICAgICfml6UsJzogOTc0LFxuICAgICfml6XjgIEnOiA5NzQsXG4gICAg56S+5LyaOiAyMDI0LFxuICAgIO+9tuaciDogOTkwLFxuICB9XG4gIHRoaXMuVEMxX18gPSB7XG4gICAgQUFBOiAxMDkzLFxuICAgIEhISDogMTAyOSxcbiAgICBISE06IDU4MCxcbiAgICBISUk6IDk5OCxcbiAgICBIT0g6IC0zOTAsXG4gICAgSE9NOiAtMzMxLFxuICAgIElISTogMTE2OSxcbiAgICBJT0g6IC0xNDIsXG4gICAgSU9JOiAtMTAxNSxcbiAgICBJT006IDQ2NyxcbiAgICBNTUg6IDE4NyxcbiAgICBPT0k6IC0xODMyLFxuICB9XG4gIHRoaXMuVEMyX18gPSB7XG4gICAgSEhPOiAyMDg4LFxuICAgIEhJSTogLTEwMjMsXG4gICAgSE1NOiAtMTE1NCxcbiAgICBJSEk6IC0xOTY1LFxuICAgIEtLSDogNzAzLFxuICAgIE9JSTogLTI2NDksXG4gIH1cbiAgdGhpcy5UQzNfXyA9IHtcbiAgICBBQUE6IC0yOTQsXG4gICAgSEhIOiAzNDYsXG4gICAgSEhJOiAtMzQxLFxuICAgIEhJSTogLTEwODgsXG4gICAgSElLOiA3MzEsXG4gICAgSE9IOiAtMTQ4NixcbiAgICBJSEg6IDEyOCxcbiAgICBJSEk6IC0zMDQxLFxuICAgIElITzogLTE5MzUsXG4gICAgSUlIOiAtODI1LFxuICAgIElJTTogLTEwMzUsXG4gICAgSU9JOiAtNTQyLFxuICAgIEtISDogLTEyMTYsXG4gICAgS0tBOiA0OTEsXG4gICAgS0tIOiAtMTIxNyxcbiAgICBLT0s6IC0xMDA5LFxuICAgIE1ISDogLTI2OTQsXG4gICAgTUhNOiAtNDU3LFxuICAgIE1ITzogMTIzLFxuICAgIE1NSDogLTQ3MSxcbiAgICBOTkg6IC0xNjg5LFxuICAgIE5OTzogNjYyLFxuICAgIE9ITzogLTMzOTMsXG4gIH1cbiAgdGhpcy5UQzRfXyA9IHtcbiAgICBISEg6IC0yMDMsXG4gICAgSEhJOiAxMzQ0LFxuICAgIEhISzogMzY1LFxuICAgIEhITTogLTEyMixcbiAgICBISE46IDE4MixcbiAgICBISE86IDY2OSxcbiAgICBISUg6IDgwNCxcbiAgICBISUk6IDY3OSxcbiAgICBIT0g6IDQ0NixcbiAgICBJSEg6IDY5NSxcbiAgICBJSE86IC0yMzI0LFxuICAgIElJSDogMzIxLFxuICAgIElJSTogMTQ5NyxcbiAgICBJSU86IDY1NixcbiAgICBJT086IDU0LFxuICAgIEtBSzogNDg0NSxcbiAgICBLS0E6IDMzODYsXG4gICAgS0tLOiAzMDY1LFxuICAgIE1ISDogLTQwNSxcbiAgICBNSEk6IDIwMSxcbiAgICBNTUg6IC0yNDEsXG4gICAgTU1NOiA2NjEsXG4gICAgTU9NOiA4NDEsXG4gIH1cbiAgdGhpcy5UUTFfXyA9IHtcbiAgICBCSEhIOiAtMjI3LFxuICAgIEJISEk6IDMxNixcbiAgICBCSElIOiAtMTMyLFxuICAgIEJJSEg6IDYwLFxuICAgIEJJSUk6IDE1OTUsXG4gICAgQk5ISDogLTc0NCxcbiAgICBCT0hIOiAyMjUsXG4gICAgQk9PTzogLTkwOCxcbiAgICBPQUtLOiA0ODIsXG4gICAgT0hISDogMjgxLFxuICAgIE9ISUg6IDI0OSxcbiAgICBPSUhJOiAyMDAsXG4gICAgT0lJSDogLTY4LFxuICB9XG4gIHRoaXMuVFEyX18gPSB7IEJJSEg6IC0xNDAxLCBCSUlJOiAtMTAzMywgQktBSzogLTU0MywgQk9PTzogLTU1OTEgfVxuICB0aGlzLlRRM19fID0ge1xuICAgIEJISEg6IDQ3OCxcbiAgICBCSEhNOiAtMTA3MyxcbiAgICBCSElIOiAyMjIsXG4gICAgQkhJSTogLTUwNCxcbiAgICBCSUlIOiAtMTE2LFxuICAgIEJJSUk6IC0xMDUsXG4gICAgQk1ISTogLTg2MyxcbiAgICBCTUhNOiAtNDY0LFxuICAgIEJPTUg6IDYyMCxcbiAgICBPSEhIOiAzNDYsXG4gICAgT0hISTogMTcyOSxcbiAgICBPSElJOiA5OTcsXG4gICAgT0hNSDogNDgxLFxuICAgIE9JSEg6IDYyMyxcbiAgICBPSUlIOiAxMzQ0LFxuICAgIE9LQUs6IDI3OTIsXG4gICAgT0tISDogNTg3LFxuICAgIE9LS0E6IDY3OSxcbiAgICBPT0hIOiAxMTAsXG4gICAgT09JSTogLTY4NSxcbiAgfVxuICB0aGlzLlRRNF9fID0ge1xuICAgIEJISEg6IC03MjEsXG4gICAgQkhITTogLTM2MDQsXG4gICAgQkhJSTogLTk2NixcbiAgICBCSUlIOiAtNjA3LFxuICAgIEJJSUk6IC0yMTgxLFxuICAgIE9BQUE6IC0yNzYzLFxuICAgIE9BS0s6IDE4MCxcbiAgICBPSEhIOiAtMjk0LFxuICAgIE9ISEk6IDI0NDYsXG4gICAgT0hITzogNDgwLFxuICAgIE9ISUg6IC0xNTczLFxuICAgIE9JSEg6IDE5MzUsXG4gICAgT0lISTogLTQ5MyxcbiAgICBPSUlIOiA2MjYsXG4gICAgT0lJSTogLTQwMDcsXG4gICAgT0tBSzogLTgxNTYsXG4gIH1cbiAgdGhpcy5UVzFfXyA9IHsg44Gr44Gk44GEOiAtNDY4MSwg5p2x5Lqs6YO9OiAyMDI2IH1cbiAgdGhpcy5UVzJfXyA9IHtcbiAgICDjgYLjgovnqIs6IC0yMDQ5LFxuICAgIOOBhOOBo+OBnzogLTEyNTYsXG4gICAg44GT44KN44GMOiAtMjQzNCxcbiAgICDjgZfjgofjgYY6IDM4NzMsXG4gICAg44Gd44Gu5b6MOiAtNDQzMCxcbiAgICDjgaDjgaPjgaY6IC0xMDQ5LFxuICAgIOOBpuOBhOOBnzogMTgzMyxcbiAgICDjgajjgZfjgaY6IC00NjU3LFxuICAgIOOBqOOCguOBqzogLTQ1MTcsXG4gICAg44KC44Gu44GnOiAxODgyLFxuICAgIOS4gOawl+OBqzogLTc5MixcbiAgICDliJ3jgoHjgaY6IC0xNTEyLFxuICAgIOWQjOaZguOBqzogLTgwOTcsXG4gICAg5aSn44GN44GqOiAtMTI1NSxcbiAgICDlr77jgZfjgaY6IC0yNzIxLFxuICAgIOekvuS8muWFmjogLTMyMTYsXG4gIH1cbiAgdGhpcy5UVzNfXyA9IHtcbiAgICDjgYTjgZ/jgaA6IC0xNzM0LFxuICAgIOOBl+OBpuOBhDogMTMxNCxcbiAgICDjgajjgZfjgaY6IC00MzE0LFxuICAgIOOBq+OBpOOBhDogLTU0ODMsXG4gICAg44Gr44Go44GjOiAtNTk4OSxcbiAgICDjgavlvZPjgZ86IC02MjQ3LFxuICAgICfjga7jgacsJzogLTcyNyxcbiAgICAn44Gu44Gn44CBJzogLTcyNyxcbiAgICDjga7jgoLjga46IC02MDAsXG4gICAg44KM44GL44KJOiAtMzc1MixcbiAgICDljYHkuozmnIg6IC0yMjg3LFxuICB9XG4gIHRoaXMuVFc0X18gPSB7XG4gICAgJ+OBhOOBhi4nOiA4NTc2LFxuICAgICfjgYTjgYbjgIInOiA4NTc2LFxuICAgIOOBi+OCieOBqjogLTIzNDgsXG4gICAg44GX44Gm44GEOiAyOTU4LFxuICAgICfjgZ/jgYwsJzogMTUxNixcbiAgICAn44Gf44GM44CBJzogMTUxNixcbiAgICDjgabjgYTjgos6IDE1MzgsXG4gICAg44Go44GE44GGOiAxMzQ5LFxuICAgIOOBvuOBl+OBnzogNTU0MyxcbiAgICDjgb7jgZvjgpM6IDEwOTcsXG4gICAg44KI44GG44GoOiAtNDI1OCxcbiAgICDjgojjgovjgag6IDU4NjUsXG4gIH1cbiAgdGhpcy5VQzFfXyA9IHsgQTogNDg0LCBLOiA5MywgTTogNjQ1LCBPOiAtNTA1IH1cbiAgdGhpcy5VQzJfXyA9IHsgQTogODE5LCBIOiAxMDU5LCBJOiA0MDksIE06IDM5ODcsIE46IDU3NzUsIE86IDY0NiB9XG4gIHRoaXMuVUMzX18gPSB7IEE6IC0xMzcwLCBJOiAyMzExIH1cbiAgdGhpcy5VQzRfXyA9IHtcbiAgICBBOiAtMjY0MyxcbiAgICBIOiAxODA5LFxuICAgIEk6IC0xMDMyLFxuICAgIEs6IC0zNDUwLFxuICAgIE06IDM1NjUsXG4gICAgTjogMzg3NixcbiAgICBPOiA2NjQ2LFxuICB9XG4gIHRoaXMuVUM1X18gPSB7IEg6IDMxMywgSTogLTEyMzgsIEs6IC03OTksIE06IDUzOSwgTzogLTgzMSB9XG4gIHRoaXMuVUM2X18gPSB7IEg6IC01MDYsIEk6IC0yNTMsIEs6IDg3LCBNOiAyNDcsIE86IC0zODcgfVxuICB0aGlzLlVQMV9fID0geyBPOiAtMjE0IH1cbiAgdGhpcy5VUDJfXyA9IHsgQjogNjksIE86IDkzNSB9XG4gIHRoaXMuVVAzX18gPSB7IEI6IDE4OSB9XG4gIHRoaXMuVVExX18gPSB7XG4gICAgQkg6IDIxLFxuICAgIEJJOiAtMTIsXG4gICAgQks6IC05OSxcbiAgICBCTjogMTQyLFxuICAgIEJPOiAtNTYsXG4gICAgT0g6IC05NSxcbiAgICBPSTogNDc3LFxuICAgIE9LOiA0MTAsXG4gICAgT086IC0yNDIyLFxuICB9XG4gIHRoaXMuVVEyX18gPSB7IEJIOiAyMTYsIEJJOiAxMTMsIE9LOiAxNzU5IH1cbiAgdGhpcy5VUTNfXyA9IHtcbiAgICBCQTogLTQ3OSxcbiAgICBCSDogNDIsXG4gICAgQkk6IDE5MTMsXG4gICAgQks6IC03MTk4LFxuICAgIEJNOiAzMTYwLFxuICAgIEJOOiA2NDI3LFxuICAgIEJPOiAxNDc2MSxcbiAgICBPSTogLTgyNyxcbiAgICBPTjogLTMyMTIsXG4gIH1cbiAgdGhpcy5VVzFfXyA9IHtcbiAgICAnLCc6IDE1NixcbiAgICAn44CBJzogMTU2LFxuICAgICfjgIwnOiAtNDYzLFxuICAgIOOBgjogLTk0MSxcbiAgICDjgYY6IC0xMjcsXG4gICAg44GMOiAtNTUzLFxuICAgIOOBjTogMTIxLFxuICAgIOOBkzogNTA1LFxuICAgIOOBpzogLTIwMSxcbiAgICDjgag6IC01NDcsXG4gICAg44GpOiAtMTIzLFxuICAgIOOBqzogLTc4OSxcbiAgICDjga46IC0xODUsXG4gICAg44GvOiAtODQ3LFxuICAgIOOCgjogLTQ2NixcbiAgICDjgoQ6IC00NzAsXG4gICAg44KIOiAxODIsXG4gICAg44KJOiAtMjkyLFxuICAgIOOCijogMjA4LFxuICAgIOOCjDogMTY5LFxuICAgIOOCkjogLTQ0NixcbiAgICDjgpM6IC0xMzcsXG4gICAgJ+ODuyc6IC0xMzUsXG4gICAg5Li7OiAtNDAyLFxuICAgIOS6rDogLTI2OCxcbiAgICDljLo6IC05MTIsXG4gICAg5Y2IOiA4NzEsXG4gICAg5Zu9OiAtNDYwLFxuICAgIOWkpzogNTYxLFxuICAgIOWnlDogNzI5LFxuICAgIOW4gjogLTQxMSxcbiAgICDml6U6IC0xNDEsXG4gICAg55CGOiAzNjEsXG4gICAg55SfOiAtNDA4LFxuICAgIOecjDogLTM4NixcbiAgICDpg706IC03MTgsXG4gICAgJ++9oic6IC00NjMsXG4gICAgJ++9pSc6IC0xMzUsXG4gIH1cbiAgdGhpcy5VVzJfXyA9IHtcbiAgICAnLCc6IC04MjksXG4gICAgJ+OAgSc6IC04MjksXG4gICAg44CHOiA4OTIsXG4gICAgJ+OAjCc6IC02NDUsXG4gICAgJ+OAjSc6IDMxNDUsXG4gICAg44GCOiAtNTM4LFxuICAgIOOBhDogNTA1LFxuICAgIOOBhjogMTM0LFxuICAgIOOBijogLTUwMixcbiAgICDjgYs6IDE0NTQsXG4gICAg44GMOiAtODU2LFxuICAgIOOBjzogLTQxMixcbiAgICDjgZM6IDExNDEsXG4gICAg44GVOiA4NzgsXG4gICAg44GWOiA1NDAsXG4gICAg44GXOiAxNTI5LFxuICAgIOOBmTogLTY3NSxcbiAgICDjgZs6IDMwMCxcbiAgICDjgZ06IC0xMDExLFxuICAgIOOBnzogMTg4LFxuICAgIOOBoDogMTgzNyxcbiAgICDjgaQ6IC05NDksXG4gICAg44GmOiAtMjkxLFxuICAgIOOBpzogLTI2OCxcbiAgICDjgag6IC05ODEsXG4gICAg44GpOiAxMjczLFxuICAgIOOBqjogMTA2MyxcbiAgICDjgas6IC0xNzY0LFxuICAgIOOBrjogMTMwLFxuICAgIOOBrzogLTQwOSxcbiAgICDjgbI6IC0xMjczLFxuICAgIOOBuTogMTI2MSxcbiAgICDjgb46IDYwMCxcbiAgICDjgoI6IC0xMjYzLFxuICAgIOOChDogLTQwMixcbiAgICDjgog6IDE2MzksXG4gICAg44KKOiAtNTc5LFxuICAgIOOCizogLTY5NCxcbiAgICDjgow6IDU3MSxcbiAgICDjgpI6IC0yNTE2LFxuICAgIOOCkzogMjA5NSxcbiAgICDjgqI6IC01ODcsXG4gICAg44KrOiAzMDYsXG4gICAg44KtOiA1NjgsXG4gICAg44ODOiA4MzEsXG4gICAg5LiJOiAtNzU4LFxuICAgIOS4jTogLTIxNTAsXG4gICAg5LiWOiAtMzAyLFxuICAgIOS4rTogLTk2OCxcbiAgICDkuLs6IC04NjEsXG4gICAg5LqLOiA0OTIsXG4gICAg5Lq6OiAtMTIzLFxuICAgIOS8mjogOTc4LFxuICAgIOS/nTogMzYyLFxuICAgIOWFpTogNTQ4LFxuICAgIOWInTogLTMwMjUsXG4gICAg5YmvOiAtMTU2NixcbiAgICDljJc6IC0zNDE0LFxuICAgIOWMujogLTQyMixcbiAgICDlpKc6IC0xNzY5LFxuICAgIOWkqTogLTg2NSxcbiAgICDlpKo6IC00ODMsXG4gICAg5a2QOiAtMTUxOSxcbiAgICDlraY6IDc2MCxcbiAgICDlrp86IDEwMjMsXG4gICAg5bCPOiAtMjAwOSxcbiAgICDluII6IC04MTMsXG4gICAg5bm0OiAtMTA2MCxcbiAgICDlvLc6IDEwNjcsXG4gICAg5omLOiAtMTUxOSxcbiAgICDmj7o6IC0xMDMzLFxuICAgIOaUvzogMTUyMixcbiAgICDmloc6IC0xMzU1LFxuICAgIOaWsDogLTE2ODIsXG4gICAg5pelOiAtMTgxNSxcbiAgICDmmI46IC0xNDYyLFxuICAgIOacgDogLTYzMCxcbiAgICDmnJ06IC0xODQzLFxuICAgIOacrDogLTE2NTAsXG4gICAg5p2xOiAtOTMxLFxuICAgIOaenDogLTY2NSxcbiAgICDmrKE6IC0yMzc4LFxuICAgIOawkTogLTE4MCxcbiAgICDmsJc6IC0xNzQwLFxuICAgIOeQhjogNzUyLFxuICAgIOeZujogNTI5LFxuICAgIOebrjogLTE1ODQsXG4gICAg55u4OiAtMjQyLFxuICAgIOecjDogLTExNjUsXG4gICAg56uLOiAtNzYzLFxuICAgIOesrDogODEwLFxuICAgIOexszogNTA5LFxuICAgIOiHqjogLTEzNTMsXG4gICAg6KGMOiA4MzgsXG4gICAg6KW/OiAtNzQ0LFxuICAgIOimizogLTM4NzQsXG4gICAg6Kq/OiAxMDEwLFxuICAgIOitsDogMTE5OCxcbiAgICDovrw6IDMwNDEsXG4gICAg6ZaLOiAxNzU4LFxuICAgIOmWkzogLTEyNTcsXG4gICAgJ++9oic6IC02NDUsXG4gICAgJ++9oyc6IDMxNDUsXG4gICAg772vOiA4MzEsXG4gICAg772xOiAtNTg3LFxuICAgIO+9tjogMzA2LFxuICAgIO+9tzogNTY4LFxuICB9XG4gIHRoaXMuVVczX18gPSB7XG4gICAgJywnOiA0ODg5LFxuICAgIDE6IC04MDAsXG4gICAgJ+KIkic6IC0xNzIzLFxuICAgICfjgIEnOiA0ODg5LFxuICAgIOOAhTogLTIzMTEsXG4gICAg44CHOiA1ODI3LFxuICAgICfjgI0nOiAyNjcwLFxuICAgICfjgJMnOiAtMzU3MyxcbiAgICDjgYI6IC0yNjk2LFxuICAgIOOBhDogMTAwNixcbiAgICDjgYY6IDIzNDIsXG4gICAg44GIOiAxOTgzLFxuICAgIOOBijogLTQ4NjQsXG4gICAg44GLOiAtMTE2MyxcbiAgICDjgYw6IDMyNzEsXG4gICAg44GPOiAxMDA0LFxuICAgIOOBkTogMzg4LFxuICAgIOOBkjogNDAxLFxuICAgIOOBkzogLTM1NTIsXG4gICAg44GUOiAtMzExNixcbiAgICDjgZU6IC0xMDU4LFxuICAgIOOBlzogLTM5NSxcbiAgICDjgZk6IDU4NCxcbiAgICDjgZs6IDM2ODUsXG4gICAg44GdOiAtNTIyOCxcbiAgICDjgZ86IDg0MixcbiAgICDjgaE6IC01MjEsXG4gICAg44GjOiAtMTQ0NCxcbiAgICDjgaQ6IC0xMDgxLFxuICAgIOOBpjogNjE2NyxcbiAgICDjgac6IDIzMTgsXG4gICAg44GoOiAxNjkxLFxuICAgIOOBqTogLTg5OSxcbiAgICDjgao6IC0yNzg4LFxuICAgIOOBqzogMjc0NSxcbiAgICDjga46IDQwNTYsXG4gICAg44GvOiA0NTU1LFxuICAgIOOBsjogLTIxNzEsXG4gICAg44G1OiAtMTc5OCxcbiAgICDjgbg6IDExOTksXG4gICAg44G7OiAtNTUxNixcbiAgICDjgb46IC00Mzg0LFxuICAgIOOBvzogLTEyMCxcbiAgICDjgoE6IDEyMDUsXG4gICAg44KCOiAyMzIzLFxuICAgIOOChDogLTc4OCxcbiAgICDjgog6IC0yMDIsXG4gICAg44KJOiA3MjcsXG4gICAg44KKOiA2NDksXG4gICAg44KLOiA1OTA1LFxuICAgIOOCjDogMjc3MyxcbiAgICDjgo86IC0xMjA3LFxuICAgIOOCkjogNjYyMCxcbiAgICDjgpM6IC01MTgsXG4gICAg44KiOiA1NTEsXG4gICAg44KwOiAxMzE5LFxuICAgIOOCuTogODc0LFxuICAgIOODgzogLTEzNTAsXG4gICAg44OIOiA1MjEsXG4gICAg44OgOiAxMTA5LFxuICAgIOODqzogMTU5MSxcbiAgICDjg606IDIyMDEsXG4gICAg44OzOiAyNzgsXG4gICAgJ+ODuyc6IC0zNzk0LFxuICAgIOS4gDogLTE2MTksXG4gICAg5LiLOiAtMTc1OSxcbiAgICDkuJY6IC0yMDg3LFxuICAgIOS4oTogMzgxNSxcbiAgICDkuK06IDY1MyxcbiAgICDkuLs6IC03NTgsXG4gICAg5LqIOiAtMTE5MyxcbiAgICDkuow6IDk3NCxcbiAgICDkuro6IDI3NDIsXG4gICAg5LuKOiA3OTIsXG4gICAg5LuWOiAxODg5LFxuICAgIOS7pTogLTEzNjgsXG4gICAg5L2OOiA4MTEsXG4gICAg5L2VOiA0MjY1LFxuICAgIOS9nDogLTM2MSxcbiAgICDkv506IC0yNDM5LFxuICAgIOWFgzogNDg1OCxcbiAgICDlhZo6IDM1OTMsXG4gICAg5YWoOiAxNTc0LFxuICAgIOWFrDogLTMwMzAsXG4gICAg5YWtOiA3NTUsXG4gICAg5YWxOiAtMTg4MCxcbiAgICDlhoY6IDU4MDcsXG4gICAg5YaNOiAzMDk1LFxuICAgIOWIhjogNDU3LFxuICAgIOWInTogMjQ3NSxcbiAgICDliKU6IDExMjksXG4gICAg5YmNOiAyMjg2LFxuICAgIOWJrzogNDQzNyxcbiAgICDlips6IDM2NSxcbiAgICDli5U6IC05NDksXG4gICAg5YuZOiAtMTg3MixcbiAgICDljJY6IDEzMjcsXG4gICAg5YyXOiAtMTAzOCxcbiAgICDljLo6IDQ2NDYsXG4gICAg5Y2DOiAtMjMwOSxcbiAgICDljYg6IC03ODMsXG4gICAg5Y2UOiAtMTAwNixcbiAgICDlj6M6IDQ4MyxcbiAgICDlj7M6IDEyMzMsXG4gICAg5ZCEOiAzNTg4LFxuICAgIOWQiDogLTI0MSxcbiAgICDlkIw6IDM5MDYsXG4gICAg5ZKMOiAtODM3LFxuICAgIOWToTogNDUxMyxcbiAgICDlm706IDY0MixcbiAgICDlnos6IDEzODksXG4gICAg5aC0OiAxMjE5LFxuICAgIOWkljogLTI0MSxcbiAgICDlprs6IDIwMTYsXG4gICAg5a2mOiAtMTM1NixcbiAgICDlrok6IC00MjMsXG4gICAg5a6fOiAtMTAwOCxcbiAgICDlrrY6IDEwNzgsXG4gICAg5bCPOiAtNTEzLFxuICAgIOWwkTogLTMxMDIsXG4gICAg5beeOiAxMTU1LFxuICAgIOW4gjogMzE5NyxcbiAgICDlubM6IC0xODA0LFxuICAgIOW5tDogMjQxNixcbiAgICDluoM6IC0xMDMwLFxuICAgIOW6nDogMTYwNSxcbiAgICDluqY6IDE0NTIsXG4gICAg5bu6OiAtMjM1MixcbiAgICDlvZM6IC0zODg1LFxuICAgIOW+lzogMTkwNSxcbiAgICDmgJ06IC0xMjkxLFxuICAgIOaApzogMTgyMixcbiAgICDmiLg6IC00ODgsXG4gICAg5oyHOiAtMzk3MyxcbiAgICDmlL86IC0yMDEzLFxuICAgIOaVmTogLTE0NzksXG4gICAg5pWwOiAzMjIyLFxuICAgIOaWhzogLTE0ODksXG4gICAg5pawOiAxNzY0LFxuICAgIOaXpTogMjA5OSxcbiAgICDml6c6IDU3OTIsXG4gICAg5pioOiAtNjYxLFxuICAgIOaZgjogLTEyNDgsXG4gICAg5pucOiAtOTUxLFxuICAgIOacgDogLTkzNyxcbiAgICDmnIg6IDQxMjUsXG4gICAg5pyfOiAzNjAsXG4gICAg5p2OOiAzMDk0LFxuICAgIOadkTogMzY0LFxuICAgIOadsTogLTgwNSxcbiAgICDmoLg6IDUxNTYsXG4gICAg5qOuOiAyNDM4LFxuICAgIOalrTogNDg0LFxuICAgIOawjzogMjYxMyxcbiAgICDmsJE6IC0xNjk0LFxuICAgIOaxujogLTEwNzMsXG4gICAg5rOVOiAxODY4LFxuICAgIOa1tzogLTQ5NSxcbiAgICDnhKE6IDk3OSxcbiAgICDniak6IDQ2MSxcbiAgICDnibk6IC0zODUwLFxuICAgIOeUnzogLTI3MyxcbiAgICDnlKg6IDkxNCxcbiAgICDnlLo6IDEyMTUsXG4gICAg55qEOiA3MzEzLFxuICAgIOebtDogLTE4MzUsXG4gICAg55yBOiA3OTIsXG4gICAg55yMOiA2MjkzLFxuICAgIOefpTogLTE1MjgsXG4gICAg56eBOiA0MjMxLFxuICAgIOeojjogNDAxLFxuICAgIOerizogLTk2MCxcbiAgICDnrKw6IDEyMDEsXG4gICAg57GzOiA3NzY3LFxuICAgIOezuzogMzA2NixcbiAgICDntIQ6IDM2NjMsXG4gICAg57SaOiAxMzg0LFxuICAgIOe1sTogLTQyMjksXG4gICAg57ePOiAxMTYzLFxuICAgIOe3mjogMTI1NSxcbiAgICDogIU6IDY0NTcsXG4gICAg6IO9OiA3MjUsXG4gICAg6IeqOiAtMjg2OSxcbiAgICDoi7E6IDc4NSxcbiAgICDopos6IDEwNDQsXG4gICAg6Kq/OiAtNTYyLFxuICAgIOiyoTogLTczMyxcbiAgICDosrs6IDE3NzcsXG4gICAg6LuKOiAxODM1LFxuICAgIOi7jTogMTM3NSxcbiAgICDovrw6IC0xNTA0LFxuICAgIOmAmjogLTExMzYsXG4gICAg6YG4OiAtNjgxLFxuICAgIOmDjjogMTAyNixcbiAgICDpg6E6IDQ0MDQsXG4gICAg6YOoOiAxMjAwLFxuICAgIOmHkTogMjE2MyxcbiAgICDplbc6IDQyMSxcbiAgICDplos6IC0xNDMyLFxuICAgIOmWkzogMTMwMixcbiAgICDplqI6IC0xMjgyLFxuICAgIOmbqDogMjAwOSxcbiAgICDpm7s6IC0xMDQ1LFxuICAgIOmdnjogMjA2NixcbiAgICDpp4U6IDE2MjAsXG4gICAgJ++8kSc6IC04MDAsXG4gICAgJ++9oyc6IDI2NzAsXG4gICAgJ++9pSc6IC0zNzk0LFxuICAgIO+9rzogLTEzNTAsXG4gICAg772xOiA1NTEsXG4gICAg7724776eOiAxMzE5LFxuICAgIO+9vTogODc0LFxuICAgIO++hDogNTIxLFxuICAgIO++kTogMTEwOSxcbiAgICDvvpk6IDE1OTEsXG4gICAg776bOiAyMjAxLFxuICAgIO++nTogMjc4LFxuICB9XG4gIHRoaXMuVVc0X18gPSB7XG4gICAgJywnOiAzOTMwLFxuICAgICcuJzogMzUwOCxcbiAgICAn4oCVJzogLTQ4NDEsXG4gICAgJ+OAgSc6IDM5MzAsXG4gICAgJ+OAgic6IDM1MDgsXG4gICAg44CHOiA0OTk5LFxuICAgICfjgIwnOiAxODk1LFxuICAgICfjgI0nOiAzNzk4LFxuICAgICfjgJMnOiAtNTE1NixcbiAgICDjgYI6IDQ3NTIsXG4gICAg44GEOiAtMzQzNSxcbiAgICDjgYY6IC02NDAsXG4gICAg44GIOiAtMjUxNCxcbiAgICDjgYo6IDI0MDUsXG4gICAg44GLOiA1MzAsXG4gICAg44GMOiA2MDA2LFxuICAgIOOBjTogLTQ0ODIsXG4gICAg44GOOiAtMzgyMSxcbiAgICDjgY86IC0zNzg4LFxuICAgIOOBkTogLTQzNzYsXG4gICAg44GSOiAtNDczNCxcbiAgICDjgZM6IDIyNTUsXG4gICAg44GUOiAxOTc5LFxuICAgIOOBlTogMjg2NCxcbiAgICDjgZc6IC04NDMsXG4gICAg44GYOiAtMjUwNixcbiAgICDjgZk6IC03MzEsXG4gICAg44GaOiAxMjUxLFxuICAgIOOBmzogMTgxLFxuICAgIOOBnTogNDA5MSxcbiAgICDjgZ86IDUwMzQsXG4gICAg44GgOiA1NDA4LFxuICAgIOOBoTogLTM2NTQsXG4gICAg44GjOiAtNTg4MixcbiAgICDjgaQ6IC0xNjU5LFxuICAgIOOBpjogMzk5NCxcbiAgICDjgac6IDc0MTAsXG4gICAg44GoOiA0NTQ3LFxuICAgIOOBqjogNTQzMyxcbiAgICDjgas6IDY0OTksXG4gICAg44GsOiAxODUzLFxuICAgIOOBrTogMTQxMyxcbiAgICDjga46IDczOTYsXG4gICAg44GvOiA4NTc4LFxuICAgIOOBsDogMTk0MCxcbiAgICDjgbI6IDQyNDksXG4gICAg44GzOiAtNDEzNCxcbiAgICDjgbU6IDEzNDUsXG4gICAg44G4OiA2NjY1LFxuICAgIOOBuTogLTc0NCxcbiAgICDjgbs6IDE0NjQsXG4gICAg44G+OiAxMDUxLFxuICAgIOOBvzogLTIwODIsXG4gICAg44KAOiAtODgyLFxuICAgIOOCgTogLTUwNDYsXG4gICAg44KCOiA0MTY5LFxuICAgIOOCgzogLTI2NjYsXG4gICAg44KEOiAyNzk1LFxuICAgIOOChzogLTE1NDQsXG4gICAg44KIOiAzMzUxLFxuICAgIOOCiTogLTI5MjIsXG4gICAg44KKOiAtOTcyNixcbiAgICDjgos6IC0xNDg5NixcbiAgICDjgow6IC0yNjEzLFxuICAgIOOCjTogLTQ1NzAsXG4gICAg44KPOiAtMTc4MyxcbiAgICDjgpI6IDEzMTUwLFxuICAgIOOCkzogLTIzNTIsXG4gICAg44KrOiAyMTQ1LFxuICAgIOOCszogMTc4OSxcbiAgICDjgrs6IDEyODcsXG4gICAg44ODOiAtNzI0LFxuICAgIOODiDogLTQwMyxcbiAgICDjg6E6IC0xNjM1LFxuICAgIOODqTogLTg4MSxcbiAgICDjg6o6IC01NDEsXG4gICAg44OrOiAtODU2LFxuICAgIOODszogLTM2MzcsXG4gICAgJ+ODuyc6IC00MzcxLFxuICAgIOODvDogLTExODcwLFxuICAgIOS4gDogLTIwNjksXG4gICAg5LitOiAyMjEwLFxuICAgIOS6iDogNzgyLFxuICAgIOS6izogLTE5MCxcbiAgICDkupU6IC0xNzY4LFxuICAgIOS6ujogMTAzNixcbiAgICDku6U6IDU0NCxcbiAgICDkvJo6IDk1MCxcbiAgICDkvZM6IC0xMjg2LFxuICAgIOS9nDogNTMwLFxuICAgIOWBtDogNDI5MixcbiAgICDlhYg6IDYwMSxcbiAgICDlhZo6IC0yMDA2LFxuICAgIOWFsTogLTEyMTIsXG4gICAg5YaFOiA1ODQsXG4gICAg5YaGOiA3ODgsXG4gICAg5YidOiAxMzQ3LFxuICAgIOWJjTogMTYyMyxcbiAgICDlia86IDM4NzksXG4gICAg5YqbOiAtMzAyLFxuICAgIOWLlTogLTc0MCxcbiAgICDli5k6IC0yNzE1LFxuICAgIOWMljogNzc2LFxuICAgIOWMujogNDUxNyxcbiAgICDljZQ6IDEwMTMsXG4gICAg5Y+COiAxNTU1LFxuICAgIOWQiDogLTE4MzQsXG4gICAg5ZKMOiAtNjgxLFxuICAgIOWToTogLTkxMCxcbiAgICDlmag6IC04NTEsXG4gICAg5ZueOiAxNTAwLFxuICAgIOWbvTogLTYxOSxcbiAgICDlnJI6IC0xMjAwLFxuICAgIOWcsDogODY2LFxuICAgIOWgtDogLTE0MTAsXG4gICAg5aGBOiAtMjA5NCxcbiAgICDlo6s6IC0xNDEzLFxuICAgIOWkmjogMTA2NyxcbiAgICDlpKc6IDU3MSxcbiAgICDlrZA6IC00ODAyLFxuICAgIOWtpjogLTEzOTcsXG4gICAg5a6aOiAtMTA1NyxcbiAgICDlr7o6IC04MDksXG4gICAg5bCPOiAxOTEwLFxuICAgIOWxizogLTEzMjgsXG4gICAg5bGxOiAtMTUwMCxcbiAgICDls7Y6IC0yMDU2LFxuICAgIOW3nTogLTI2NjcsXG4gICAg5biCOiAyNzcxLFxuICAgIOW5tDogMzc0LFxuICAgIOW6gTogLTQ1NTYsXG4gICAg5b6MOiA0NTYsXG4gICAg5oCnOiA1NTMsXG4gICAg5oSfOiA5MTYsXG4gICAg5omAOiAtMTU2NixcbiAgICDmlK86IDg1NixcbiAgICDmlLk6IDc4NyxcbiAgICDmlL86IDIxODIsXG4gICAg5pWZOiA3MDQsXG4gICAg5paHOiA1MjIsXG4gICAg5pa5OiAtODU2LFxuICAgIOaXpTogMTc5OCxcbiAgICDmmYI6IDE4MjksXG4gICAg5pyAOiA4NDUsXG4gICAg5pyIOiAtOTA2NixcbiAgICDmnKg6IC00ODUsXG4gICAg5p2lOiAtNDQyLFxuICAgIOagoTogLTM2MCxcbiAgICDmpa06IC0xMDQzLFxuICAgIOawjzogNTM4OCxcbiAgICDmsJE6IC0yNzE2LFxuICAgIOawlzogLTkxMCxcbiAgICDmsqI6IC05MzksXG4gICAg5riIOiAtNTQzLFxuICAgIOeJqTogLTczNSxcbiAgICDnjoc6IDY3MixcbiAgICDnkIM6IC0xMjY3LFxuICAgIOeUnzogLTEyODYsXG4gICAg55SjOiAtMTEwMSxcbiAgICDnlLA6IC0yOTAwLFxuICAgIOeUujogMTgyNixcbiAgICDnmoQ6IDI1ODYsXG4gICAg55uuOiA5MjIsXG4gICAg55yBOiAtMzQ4NSxcbiAgICDnnIw6IDI5OTcsXG4gICAg56m6OiAtODY3LFxuICAgIOerizogLTIxMTIsXG4gICAg56ysOiA3ODgsXG4gICAg57GzOiAyOTM3LFxuICAgIOezuzogNzg2LFxuICAgIOe0hDogMjE3MSxcbiAgICDntYw6IDExNDYsXG4gICAg57WxOiAtMTE2OSxcbiAgICDnt486IDk0MCxcbiAgICDnt5o6IC05OTQsXG4gICAg572yOiA3NDksXG4gICAg6ICFOiAyMTQ1LFxuICAgIOiDvTogLTczMCxcbiAgICDoiKw6IC04NTIsXG4gICAg6KGMOiAtNzkyLFxuICAgIOimjzogNzkyLFxuICAgIOitpjogLTExODQsXG4gICAg6K2wOiAtMjQ0LFxuICAgIOiwtzogLTEwMDAsXG4gICAg6LOeOiA3MzAsXG4gICAg6LuKOiAtMTQ4MSxcbiAgICDou406IDExNTgsXG4gICAg6LyqOiAtMTQzMyxcbiAgICDovrw6IC0zMzcwLFxuICAgIOi/kTogOTI5LFxuICAgIOmBkzogLTEyOTEsXG4gICAg6YG4OiAyNTk2LFxuICAgIOmDjjogLTQ4NjYsXG4gICAg6YO9OiAxMTkyLFxuICAgIOmHjjogLTExMDAsXG4gICAg6YqAOiAtMjIxMyxcbiAgICDplbc6IDM1NyxcbiAgICDplpM6IC0yMzQ0LFxuICAgIOmZojogLTIyOTcsXG4gICAg6ZqbOiAtMjYwNCxcbiAgICDpm7s6IC04NzgsXG4gICAg6aCYOiAtMTY1OSxcbiAgICDpoYw6IC03OTIsXG4gICAg6aSoOiAtMTk4NCxcbiAgICDpppY6IDE3NDksXG4gICAg6auYOiAyMTIwLFxuICAgICfvvaInOiAxODk1LFxuICAgICfvvaMnOiAzNzk4LFxuICAgICfvvaUnOiAtNDM3MSxcbiAgICDvva86IC03MjQsXG4gICAg772wOiAtMTE4NzAsXG4gICAg7722OiAyMTQ1LFxuICAgIO+9ujogMTc4OSxcbiAgICDvvb46IDEyODcsXG4gICAg776EOiAtNDAzLFxuICAgIO++kjogLTE2MzUsXG4gICAg776XOiAtODgxLFxuICAgIO++mDogLTU0MSxcbiAgICDvvpk6IC04NTYsXG4gICAg776dOiAtMzYzNyxcbiAgfVxuICB0aGlzLlVXNV9fID0ge1xuICAgICcsJzogNDY1LFxuICAgICcuJzogLTI5OSxcbiAgICAxOiAtNTE0LFxuICAgIEUyOiAtMzI3NjgsXG4gICAgJ10nOiAtMjc2MixcbiAgICAn44CBJzogNDY1LFxuICAgICfjgIInOiAtMjk5LFxuICAgICfjgIwnOiAzNjMsXG4gICAg44GCOiAxNjU1LFxuICAgIOOBhDogMzMxLFxuICAgIOOBhjogLTUwMyxcbiAgICDjgYg6IDExOTksXG4gICAg44GKOiA1MjcsXG4gICAg44GLOiA2NDcsXG4gICAg44GMOiAtNDIxLFxuICAgIOOBjTogMTYyNCxcbiAgICDjgY46IDE5NzEsXG4gICAg44GPOiAzMTIsXG4gICAg44GSOiAtOTgzLFxuICAgIOOBlTogLTE1MzcsXG4gICAg44GXOiAtMTM3MSxcbiAgICDjgZk6IC04NTIsXG4gICAg44GgOiAtMTE4NixcbiAgICDjgaE6IDEwOTMsXG4gICAg44GjOiA1MixcbiAgICDjgaQ6IDkyMSxcbiAgICDjgaY6IC0xOCxcbiAgICDjgac6IC04NTAsXG4gICAg44GoOiAtMTI3LFxuICAgIOOBqTogMTY4MixcbiAgICDjgao6IC03ODcsXG4gICAg44GrOiAtMTIyNCxcbiAgICDjga46IC02MzUsXG4gICAg44GvOiAtNTc4LFxuICAgIOOBuTogMTAwMSxcbiAgICDjgb86IDUwMixcbiAgICDjgoE6IDg2NSxcbiAgICDjgoM6IDMzNTAsXG4gICAg44KHOiA4NTQsXG4gICAg44KKOiAtMjA4LFxuICAgIOOCizogNDI5LFxuICAgIOOCjDogNTA0LFxuICAgIOOCjzogNDE5LFxuICAgIOOCkjogLTEyNjQsXG4gICAg44KTOiAzMjcsXG4gICAg44KkOiAyNDEsXG4gICAg44OrOiA0NTEsXG4gICAg44OzOiAtMzQzLFxuICAgIOS4rTogLTg3MSxcbiAgICDkuqw6IDcyMixcbiAgICDkvJo6IC0xMTUzLFxuICAgIOWFmjogLTY1NCxcbiAgICDli5k6IDM1MTksXG4gICAg5Yy6OiAtOTAxLFxuICAgIOWRijogODQ4LFxuICAgIOWToTogMjEwNCxcbiAgICDlpKc6IC0xMjk2LFxuICAgIOWtpjogLTU0OCxcbiAgICDlrpo6IDE3ODUsXG4gICAg5bWQOiAtMTMwNCxcbiAgICDluII6IC0yOTkxLFxuICAgIOW4rTogOTIxLFxuICAgIOW5tDogMTc2MyxcbiAgICDmgJ06IDg3MixcbiAgICDmiYA6IC04MTQsXG4gICAg5oyZOiAxNjE4LFxuICAgIOaWsDogLTE2ODIsXG4gICAg5pelOiAyMTgsXG4gICAg5pyIOiAtNDM1MyxcbiAgICDmn7s6IDkzMixcbiAgICDmoLw6IDEzNTYsXG4gICAg5qmfOiAtMTUwOCxcbiAgICDmsI86IC0xMzQ3LFxuICAgIOeUsDogMjQwLFxuICAgIOeUujogLTM5MTIsXG4gICAg55qEOiAtMzE0OSxcbiAgICDnm7g6IDEzMTksXG4gICAg55yBOiAtMTA1MixcbiAgICDnnIw6IC00MDAzLFxuICAgIOeglDogLTk5NyxcbiAgICDnpL46IC0yNzgsXG4gICAg56m6OiAtODEzLFxuICAgIOe1sTogMTk1NSxcbiAgICDogIU6IC0yMjMzLFxuICAgIOihqDogNjYzLFxuICAgIOiqnjogLTEwNzMsXG4gICAg6K2wOiAxMjE5LFxuICAgIOmBuDogLTEwMTgsXG4gICAg6YOOOiAtMzY4LFxuICAgIOmVtzogNzg2LFxuICAgIOmWkzogMTE5MSxcbiAgICDpoYw6IDIzNjgsXG4gICAg6aSoOiAtNjg5LFxuICAgICfvvJEnOiAtNTE0LFxuICAgIO+8pe+8kjogLTMyNzY4LFxuICAgICfvvaInOiAzNjMsXG4gICAg772yOiAyNDEsXG4gICAg776ZOiA0NTEsXG4gICAg776dOiAtMzQzLFxuICB9XG4gIHRoaXMuVVc2X18gPSB7XG4gICAgJywnOiAyMjcsXG4gICAgJy4nOiA4MDgsXG4gICAgMTogLTI3MCxcbiAgICBFMTogMzA2LFxuICAgICfjgIEnOiAyMjcsXG4gICAgJ+OAgic6IDgwOCxcbiAgICDjgYI6IC0zMDcsXG4gICAg44GGOiAxODksXG4gICAg44GLOiAyNDEsXG4gICAg44GMOiAtNzMsXG4gICAg44GPOiAtMTIxLFxuICAgIOOBkzogLTIwMCxcbiAgICDjgZg6IDE3ODIsXG4gICAg44GZOiAzODMsXG4gICAg44GfOiAtNDI4LFxuICAgIOOBozogNTczLFxuICAgIOOBpjogLTEwMTQsXG4gICAg44GnOiAxMDEsXG4gICAg44GoOiAtMTA1LFxuICAgIOOBqjogLTI1MyxcbiAgICDjgas6IC0xNDksXG4gICAg44GuOiAtNDE3LFxuICAgIOOBrzogLTIzNixcbiAgICDjgoI6IC0yMDYsXG4gICAg44KKOiAxODcsXG4gICAg44KLOiAtMTM1LFxuICAgIOOCkjogMTk1LFxuICAgIOODqzogLTY3MyxcbiAgICDjg7M6IC00OTYsXG4gICAg5LiAOiAtMjc3LFxuICAgIOS4rTogMjAxLFxuICAgIOS7tjogLTgwMCxcbiAgICDkvJo6IDYyNCxcbiAgICDliY06IDMwMixcbiAgICDljLo6IDE3OTIsXG4gICAg5ZOhOiAtMTIxMixcbiAgICDlp5Q6IDc5OCxcbiAgICDlraY6IC05NjAsXG4gICAg5biCOiA4ODcsXG4gICAg5bqDOiAtNjk1LFxuICAgIOW+jDogNTM1LFxuICAgIOalrTogLTY5NyxcbiAgICDnm7g6IDc1MyxcbiAgICDnpL46IC01MDcsXG4gICAg56aPOiA5NzQsXG4gICAg56m6OiAtODIyLFxuICAgIOiAhTogMTgxMSxcbiAgICDpgKM6IDQ2MyxcbiAgICDpg446IDEwODIsXG4gICAgJ++8kSc6IC0yNzAsXG4gICAg77yl77yROiAzMDYsXG4gICAg776ZOiAtNjczLFxuICAgIO++nTogLTQ5NixcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cblRpbnlTZWdtZW50ZXIucHJvdG90eXBlLmN0eXBlXyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgZm9yICh2YXIgaSBpbiB0aGlzLmNoYXJ0eXBlXykge1xuICAgIGlmIChzdHIubWF0Y2godGhpcy5jaGFydHlwZV9baV1bMF0pKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFydHlwZV9baV1bMV1cbiAgICB9XG4gIH1cbiAgcmV0dXJuICdPJ1xufVxuXG5UaW55U2VnbWVudGVyLnByb3RvdHlwZS50c18gPSBmdW5jdGlvbiAodikge1xuICBpZiAodikge1xuICAgIHJldHVybiB2XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuVGlueVNlZ21lbnRlci5wcm90b3R5cGUuc2VnbWVudCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICBpZiAoaW5wdXQgPT0gbnVsbCB8fCBpbnB1dCA9PSB1bmRlZmluZWQgfHwgaW5wdXQgPT0gJycpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuICB2YXIgcmVzdWx0ID0gW11cbiAgdmFyIHNlZyA9IFsnQjMnLCAnQjInLCAnQjEnXVxuICB2YXIgY3R5cGUgPSBbJ08nLCAnTycsICdPJ11cbiAgdmFyIG8gPSBpbnB1dC5zcGxpdCgnJylcbiAgZm9yIChpID0gMDsgaSA8IG8ubGVuZ3RoOyArK2kpIHtcbiAgICBzZWcucHVzaChvW2ldKVxuICAgIGN0eXBlLnB1c2godGhpcy5jdHlwZV8ob1tpXSkpXG4gIH1cbiAgc2VnLnB1c2goJ0UxJylcbiAgc2VnLnB1c2goJ0UyJylcbiAgc2VnLnB1c2goJ0UzJylcbiAgY3R5cGUucHVzaCgnTycpXG4gIGN0eXBlLnB1c2goJ08nKVxuICBjdHlwZS5wdXNoKCdPJylcbiAgdmFyIHdvcmQgPSBzZWdbM11cbiAgdmFyIHAxID0gJ1UnXG4gIHZhciBwMiA9ICdVJ1xuICB2YXIgcDMgPSAnVSdcbiAgZm9yICh2YXIgaSA9IDQ7IGkgPCBzZWcubGVuZ3RoIC0gMzsgKytpKSB7XG4gICAgdmFyIHNjb3JlID0gdGhpcy5CSUFTX19cbiAgICB2YXIgdzEgPSBzZWdbaSAtIDNdXG4gICAgdmFyIHcyID0gc2VnW2kgLSAyXVxuICAgIHZhciB3MyA9IHNlZ1tpIC0gMV1cbiAgICB2YXIgdzQgPSBzZWdbaV1cbiAgICB2YXIgdzUgPSBzZWdbaSArIDFdXG4gICAgdmFyIHc2ID0gc2VnW2kgKyAyXVxuICAgIHZhciBjMSA9IGN0eXBlW2kgLSAzXVxuICAgIHZhciBjMiA9IGN0eXBlW2kgLSAyXVxuICAgIHZhciBjMyA9IGN0eXBlW2kgLSAxXVxuICAgIHZhciBjNCA9IGN0eXBlW2ldXG4gICAgdmFyIGM1ID0gY3R5cGVbaSArIDFdXG4gICAgdmFyIGM2ID0gY3R5cGVbaSArIDJdXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDFfX1twMV0pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDJfX1twMl0pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUDNfX1twM10pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUDFfX1twMSArIHAyXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJQMl9fW3AyICsgcDNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcxX19bdzFdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVcyX19bdzJdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVczX19bdzNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc0X19bdzRdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc1X19bdzVdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVc2X19bdzZdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlcxX19bdzIgKyB3M10pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CVzJfX1t3MyArIHc0XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJXM19fW3c0ICsgdzVdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFcxX19bdzEgKyB3MiArIHczXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRXMl9fW3cyICsgdzMgKyB3NF0pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UVzNfX1t3MyArIHc0ICsgdzVdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFc0X19bdzQgKyB3NSArIHc2XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDMV9fW2MxXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDMl9fW2MyXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDM19fW2MzXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNF9fW2M0XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNV9fW2M1XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVDNl9fW2M2XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJDMV9fW2MyICsgYzNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQkMyX19bYzMgKyBjNF0pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CQzNfX1tjNCArIGM1XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDMV9fW2MxICsgYzIgKyBjM10pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5UQzJfX1tjMiArIGMzICsgYzRdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEMzX19bYzMgKyBjNCArIGM1XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlRDNF9fW2M0ICsgYzUgKyBjNl0pXG4gICAgLy8gIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVEM1X19bYzQgKyBjNSArIGM2XSk7XG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5VUTFfX1twMSArIGMxXSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLlVRMl9fW3AyICsgYzJdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVVEzX19bcDMgKyBjM10pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTFfX1twMiArIGMyICsgYzNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuQlEyX19bcDIgKyBjMyArIGM0XSlcbiAgICBzY29yZSArPSB0aGlzLnRzXyh0aGlzLkJRM19fW3AzICsgYzIgKyBjM10pXG4gICAgc2NvcmUgKz0gdGhpcy50c18odGhpcy5CUTRfX1twMyArIGMzICsgYzRdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFExX19bcDIgKyBjMSArIGMyICsgYzNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFEyX19bcDIgKyBjMiArIGMzICsgYzRdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFEzX19bcDMgKyBjMSArIGMyICsgYzNdKVxuICAgIHNjb3JlICs9IHRoaXMudHNfKHRoaXMuVFE0X19bcDMgKyBjMiArIGMzICsgYzRdKVxuICAgIHZhciBwID0gJ08nXG4gICAgaWYgKHNjb3JlID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2god29yZClcbiAgICAgIHdvcmQgPSAnJ1xuICAgICAgcCA9ICdCJ1xuICAgIH1cbiAgICBwMSA9IHAyXG4gICAgcDIgPSBwM1xuICAgIHAzID0gcFxuICAgIHdvcmQgKz0gc2VnW2ldXG4gIH1cbiAgcmVzdWx0LnB1c2god29yZClcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbnlTZWdtZW50ZXJcbiIsImltcG9ydCB7IFRpbnlTZWdtZW50ZXIgfSBmcm9tICdzcmMvdmVuZG9yL3Rpbnktc2VnbWVudGVyJ1xuaW1wb3J0IHsgUmFuZ2UsIFRva2VuaXplciwgVG9rZW5pemVyT3B0aW9ucyB9IGZyb20gJy4uL3Rva2VuaXplcidcblxuZXhwb3J0IGNsYXNzIEphcGFuZXNlVG9rZW5pemVyIGV4dGVuZHMgVG9rZW5pemVyIHtcbiAgLy8gQHRzLWlnbm9yZVxuICBwcml2YXRlIHRva2VuaXplciA9IG5ldyBUaW55U2VnbWVudGVyKClcblxuICB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcsIHJhbmdlPzogUmFuZ2UpIHtcbiAgICBjb25zdCB0b2tlbnM6IHN0cmluZ1tdID0gdGV4dFxuICAgICAgLnNsaWNlKHJhbmdlPy5zdGFydCwgcmFuZ2U/LmVuZClcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5mbGF0TWFwPHN0cmluZz4oKGxpbmUpID0+IHRoaXMudG9rZW5pemVyLnNlZ21lbnQobGluZSkpXG4gICAgICAubWFwKCh0KSA9PiB0LnJlcGxhY2UodGhpcy50cmltUGF0dGVybiwgJycpKVxuXG4gICAgcmV0dXJuIHsgdG9rZW5zIH1cbiAgfVxuXG4gIGxhc3RXb3JkRnJvbShcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBvcHRpb25zOiBUb2tlbml6ZXJPcHRpb25zID0geyBub3JtYWxpemU6IGZhbHNlIH1cbiAgKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgeyBub3JtYWxpemVkIH0gPSBvcHRpb25zLm5vcm1hbGl6ZVxuICAgICAgPyB0aGlzLm5vcm1hbGl6ZWRMaW5lKHRleHQsIGluZGV4KVxuICAgICAgOiB7IG5vcm1hbGl6ZWQ6IHRleHQgfVxuXG4gICAgY29uc3QgdG9rZW5zID0gdGhpcy50b2tlbml6ZXJcbiAgICAgIC5zZWdtZW50KG5vcm1hbGl6ZWQpXG4gICAgICAubWFwKCh0OiBzdHJpbmcpID0+IHQucmVwbGFjZSh0aGlzLnRyaW1QYXR0ZXJuLCAnJykpXG4gICAgY29uc3QgbGVuZ3RoID0gdG9rZW5zLmxlbmd0aFxuXG4gICAgcmV0dXJuIGxlbmd0aCA+IDAgPyB0b2tlbnNbbGVuZ3RoIC0gMV0gOiBudWxsXG4gIH1cblxuICBsYXN0V29yZFN0YXJ0UG9zKFxuICAgIHRleHQ6IHN0cmluZyxcbiAgICBpbmRleDogbnVtYmVyLFxuICAgIG9wdGlvbnM6IFRva2VuaXplck9wdGlvbnMgPSB7IG5vcm1hbGl6ZTogZmFsc2UgfVxuICApOiBudW1iZXIge1xuICAgIGNvbnN0IGxhc3RXb3JkID0gdGhpcy5sYXN0V29yZEZyb20odGV4dCwgaW5kZXgsIG9wdGlvbnMpXG4gICAgcmV0dXJuIGxhc3RXb3JkID8gdGV4dC5sZW5ndGggLSBsYXN0V29yZC5sZW5ndGggOiAwXG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3ksIFRva2VuaXplciB9IGZyb20gJy4vdG9rZW5pemVyJ1xuaW1wb3J0IHsgQXJhYmljVG9rZW5pemVyIH0gZnJvbSAnLi90b2tlbml6ZXIvYXJhYmljJ1xuaW1wb3J0IHsgRGVmYXVsdFRva2VuaXplciB9IGZyb20gJy4vdG9rZW5pemVyL2RlZmF1bHQnXG5pbXBvcnQgeyBKYXBhbmVzZVRva2VuaXplciB9IGZyb20gJy4vdG9rZW5pemVyL2phcGFuZXNlJ1xuXG5leHBvcnQgY2xhc3MgVG9rZW5pemVyRmFjdG9yeSB7XG4gIHN0YXRpYyBnZXRUb2tlbml6ZXIoc3RyYXRlZ3k6IFRva2VuaXplU3RyYXRlZ3ksIHdvcmRTZXBhcmF0b3JzOiBzdHJpbmcpOiBUb2tlbml6ZXIge1xuICAgIGxldCB0b2tlbml6ZXI6IFRva2VuaXplclxuICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgIGNhc2UgJ2RlZmF1bHQnOlxuICAgICAgICB0b2tlbml6ZXIgPSBuZXcgRGVmYXVsdFRva2VuaXplcih3b3JkU2VwYXJhdG9ycylcbiAgICAgICAgYnJlYWtcblxuICAgICAgY2FzZSAnamFwYW5lc2UnOlxuICAgICAgICB0b2tlbml6ZXIgPSBuZXcgSmFwYW5lc2VUb2tlbml6ZXIod29yZFNlcGFyYXRvcnMpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdhcmFiaWMnOlxuICAgICAgICB0b2tlbml6ZXIgPSBuZXcgQXJhYmljVG9rZW5pemVyKHdvcmRTZXBhcmF0b3JzKVxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0cmF0ZWd5ICcke3N0cmF0ZWd5fScgbm90IGZvdW5kYClcbiAgICB9XG5cbiAgICByZXR1cm4gdG9rZW5pemVyXG4gIH1cbn1cbiIsImltcG9ydCB7UHJvdmlkZXJ9IGZyb20gJy4vcHJvdmlkZXInXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYVRleFByb3ZpZGVyIGV4dGVuZHMgUHJvdmlkZXIge1xuICAgIGNhdGVnb3J5ID0gXCJMXCJcbiAgICBjb21wbGV0aW9ucyA9IFtcIlxcXFxBcnJvd3ZlcnRcIiwgXCJcXFxcQmJia1wiLCBcIlxcXFxCaWdcIiwgXCJcXFxcQmlnZ1wiLCBcIlxcXFxCaWdnbFwiLCBcIlxcXFxCaWdnclwiLCBcIlxcXFxCaWdsXCIsIFwiXFxcXEJpZ21cIiwgXCJcXFxcQmlnclwiLCBcIlxcXFxCb3hcIiwgXCJcXFxcQnVtcGVxXCIsIFwiXFxcXENhcFwiLCBcIlxcXFxjaXRlWyN7fV17I3t9fVwiLCBcIlxcXFxjaXRlXCIsIFwiXFxcXEN1cFwiLCBcIlxcXFxEZWNsYXJlTWF0aE9wZXJhdG9yeyN7fX17I3t9fVwiLCBcIlxcXFxEZWx0YVwiLCBcIlxcXFxEb3duYXJyb3dcIiwgXCJcXFxcRmludlwiLCBcIlxcXFxHYW1lXCIsIFwiXFxcXEdhbW1hXCIsIFwiXFxcXEltXCIsIFwiXFxcXExhbWJkYVwiLCBcIlxcXFxMZWZ0YXJyb3dcIiwgXCJcXFxcTGVmdHJpZ2h0YXJyb3dcIiwgXCJcXFxcTGxlZnRhcnJvd1wiLCBcIlxcXFxMb25nbGVmdGFycm93XCIsIFwiXFxcXExvbmdsZWZ0cmlnaHRhcnJvd1wiLCBcIlxcXFxMb25ncmlnaHRhcnJvd1wiLCBcIlxcXFxMc2hcIiwgXCJcXFxcT21lZ2FcIiwgXCJcXFxcUGhpXCIsIFwiXFxcXFBpXCIsIFwiXFxcXFByXCIsIFwiXFxcXFBzaVwiLCBcIlxcXFxSZVwiLCBcIlxcXFxSaWdodGFycm93XCIsIFwiXFxcXFJyaWdodGFycm93XCIsIFwiXFxcXFJzaFwiLCBcIlxcXFxTXCIsIFwiXFxcXFNpZ21hXCIsIFwiXFxcXFN1YnNldFwiLCBcIlxcXFxTdXBzZXRcIiwgXCJcXFxcVGVYXCIsIFwiXFxcXFRoZXRhXCIsIFwiXFxcXFVwYXJyb3dcIiwgXCJcXFxcVXBkb3duYXJyb3dcIiwgXCJcXFxcVXBzaWxvblwiLCBcIlxcXFxWZGFzaFwiLCBcIlxcXFxWZXJ0XCIsIFwiXFxcXFZ2ZGFzaFwiLCBcIlxcXFxYaVwiLCBcIlxcXFxhYm92ZVwiLCBcIlxcXFxhYm92ZXdpdGhkZWxpbXNcIiwgXCJcXFxcYWN1dGV7I3t9fVwiLCBcIlxcXFxhbGVwaFwiLCBcIlxcXFxhbHBoYVwiLCBcIlxcXFxhbWFsZ1wiLCBcIlxcXFxhbmdsZVwiLCBcIlxcXFxhcHByb3hcIiwgXCJcXFxcYXBwcm94ZXFcIiwgXCJcXFxcYXJjY29zXCIsIFwiXFxcXGFyY3NpblwiLCBcIlxcXFxhcmN0YW5cIiwgXCJcXFxcYXJnXCIsIFwiXFxcXGFycm93dmVydFwiLCBcIlxcXFxhc3RcIiwgXCJcXFxcYXN5bXBcIiwgXCJcXFxcYXRvcFwiLFxuICAgICAgICBcIlxcXFxhdG9wd2l0aGRlbGltc1wiLCBcIlxcXFxiYWNrZXBzaWxvblwiLCBcIlxcXFxiYWNrcHJpbWVcIiwgXCJcXFxcYmFja3NpbVwiLCBcIlxcXFxiYWNrc2ltZXFcIiwgXCJcXFxcYmFja3NsYXNoXCIsIFwiXFxcXGJhcnsje319XCIsIFwiXFxcXGJhcndlZGdlXCIsIFwiXFxcXGJlY2F1c2VcIiwgXCJcXFxcYmV0YVwiLCBcIlxcXFxiZXRoXCIsIFwiXFxcXGJldHdlZW5cIiwgXCJcXFxcYmZcIiwgXCJcXFxcYmlnXCIsIFwiXFxcXGJpZ2NhcFwiLCBcIlxcXFxiaWdjaXJjXCIsIFwiXFxcXGJpZ2N1cFwiLCBcIlxcXFxiaWdnXCIsIFwiXFxcXGJpZ2dsXCIsIFwiXFxcXGJpZ2dtXCIsIFwiXFxcXGJpZ2dyXCIsIFwiXFxcXGJpZ2xcIiwgXCJcXFxcYmlnbVwiLCBcIlxcXFxiaWdvZG90XCIsIFwiXFxcXGJpZ29wbHVzXCIsIFwiXFxcXGJpZ290aW1lc1wiLCBcIlxcXFxiaWdyXFxcXH1cIiwgXCJcXFxcYmlnc3FjdXBcIiwgXCJcXFxcYmlnc3RhclwiLCBcIlxcXFxiaWd0cmlhbmdsZWRvd25cIiwgXCJcXFxcYmlndHJpYW5nbGV1cFwiLCBcIlxcXFxiaWd1cGx1c1wiLCBcIlxcXFxiaWd2ZWVcIiwgXCJcXFxcYmlnd2VkZ2VcIiwgXCJcXFxcYmlub217I3t9fXsje319XCIsIFwiXFxcXGJsYWNrbG96ZW5nZVwiLCBcIlxcXFxibGFja3NxdWFyZVwiLCBcIlxcXFxibGFja3RyaWFuZ2xlXCIsIFwiXFxcXGJsYWNrdHJpYW5nbGVkb3duXCIsIFwiXFxcXGJsYWNrdHJpYW5nbGVsZWZ0XCIsIFwiXFxcXGJsYWNrdHJpYW5nbGVyaWdodFwiLCBcIlxcXFxibW9kXCIsIFwiXFxcXGJvbGRzeW1ib2x7I3t9fVwiLCBcIlxcXFxib3RcIiwgXCJcXFxcYm93dGllXCIsIFwiXFxcXGJveGRvdFwiLCBcIlxcXFxib3hlZHsje319XCIsIFwiXFxcXGJveG1pbnVzXCIsIFwiXFxcXGJveHBsdXNcIiwgXCJcXFxcYm94dGltZXNcIiwgXCJcXFxcYnJhY2VcIiwgXCJcXFxcYnJhY2V2ZXJ0XCIsIFwiXFxcXGJyYWNrXCIsIFwiXFxcXGJyZXZleyN7fX1cIiwgXCJcXFxcYnVpbGRyZWxcIiwgXCJcXFxcYnVsbGV0XCIsIFwiXFxcXGJ1bXBlcVwiLCBcIlxcXFxjYWxcIiwgXCJcXFxcY2FwXCIsIFwiXFxcXGNhc2VzeyN7fX1cIiwgXCJcXFxcY2RvdFwiLCBcIlxcXFxjZG90cFwiLCBcIlxcXFxjZG90c1wiLFxuICAgICAgICBcIlxcXFxjZW50ZXJkb3RcIiwgXCJcXFxcY2ZyYWN7I3t9fXsje319XCIsIFwiXFxcXGNoZWNreyN7fX1cIiwgXCJcXFxcY2hlY2ttYXJrXCIsIFwiXFxcXGNoaVwiLCBcIlxcXFxjaG9vc2VcIiwgXCJcXFxcY2lyY1wiLCBcIlxcXFxjaXJjZXFcIiwgXCJcXFxcY2lyY2xlYXJyb3dsZWZ0XCIsIFwiXFxcXGNpcmNsZWFycm93cmlnaHRcIiwgXCJcXFxcY2lyY2xlZFNcIiwgXCJcXFxcY2lyY2xlZGFzdFwiLCBcIlxcXFxjaXJjbGVkY2lyY1wiLCBcIlxcXFxjaXJjbGVkZGFzaFwiLCBcIlxcXFxjbHVic3VpdFwiLCBcIlxcXFxjb2xvblwiLCBcIlxcXFxjb21wbGVtZW50XCIsIFwiXFxcXGNvbmdcIiwgXCJcXFxcY29wcm9kXCIsIFwiXFxcXGNvc1wiLCBcIlxcXFxjb3NoXCIsIFwiXFxcXGNvdFwiLCBcIlxcXFxjb3RoXCIsIFwiXFxcXGNyXCIsIFwiXFxcXGNzY1wiLCBcIlxcXFxjdXBcIiwgXCJcXFxcY3VybHllcXByZWNcIiwgXCJcXFxcY3VybHllcXN1Y2NcIiwgXCJcXFxcY3VybHl2ZWVcIiwgXCJcXFxcY3VybHl3ZWRnZVwiLCBcIlxcXFxjdXJ2ZWFycm93bGVmdFwiLCBcIlxcXFxjdXJ2ZWFycm93cmlnaHRcIiwgXCJcXFxcZGFnZ2VyXCIsIFwiXFxcXGRhbGV0aFwiLCBcIlxcXFxkYXNobGVmdGFycm93XCIsIFwiXFxcXGRhc2hyaWdodGFycm93XCIsIFwiXFxcXGRhc2h2XCIsIFwiXFxcXGRiaW5vbXsje319eyN7fX1cIiwgXCJcXFxcZGRhZ2dlclwiLCBcIlxcXFxkZGRkb3R7I3t9fVwiLCBcIlxcXFxkZGRvdHsje319XCIsIFwiXFxcXGRkb3R7I3t9fVwiLCBcIlxcXFxkZG90c1wiLCBcIlxcXFxkZWZcIiwgXCJcXFxcZGVnXCIsIFwiXFxcXGRlbHRhXCIsIFwiXFxcXGRldFwiLCBcIlxcXFxkZnJhY3sje319eyN7fX1cIiwgXCJcXFxcZGlhZ2Rvd25cIiwgXCJcXFxcZGlhZ3VwXCIsIFwiXFxcXGRpYW1vbmRcIiwgXCJcXFxcZGlhbW9uZHN1aXRcIiwgXCJcXFxcZGlnYW1tYVwiLCBcIlxcXFxkaW1cIiwgXCJcXFxcZGlzcGxheWxpbmVzXCIsIFwiXFxcXGRpc3BsYXlzdHlsZVwiLCBcIlxcXFxkaXZcIiwgXCJcXFxcZGl2aWRlb250aW1lc1wiLCBcIlxcXFxkb3R7I3t9fVwiLCBcIlxcXFxkb3RlcVwiLCBcIlxcXFxkb3RlcWRvdFwiLCBcIlxcXFxkb3RwbHVzXCIsXG4gICAgICAgIFwiXFxcXGRvdHNcIiwgXCJcXFxcZG90c2JcIiwgXCJcXFxcZG90c2NcIiwgXCJcXFxcZG90c2lcIiwgXCJcXFxcZG90c21cIiwgXCJcXFxcZG90c29cIiwgXCJcXFxcZG91YmxlYmFyd2VkZ2VcIiwgXCJcXFxcZG93bmFycm93XCIsIFwiXFxcXGRvd25kb3duYXJyb3dzXCIsIFwiXFxcXGRvd25oYXJwb29ubGVmdFwiLCBcIlxcXFxkb3duaGFycG9vbnJpZ2h0XCIsIFwiXFxcXGVsbFwiLCBcIlxcXFxlbXB0eXNldFwiLCBcIlxcXFxlbnNwYWNlXCIsIFwiXFxcXGVwc2lsb25cIiwgXCJcXFxcZXFhbGlnbnsje319XCIsIFwiXFxcXGVxYWxpZ25ub3sje319XCIsIFwiXFxcXGVxY2lyY1wiLCBcIlxcXFxlcXJlZnsje319XCIsIFwiXFxcXGVxc2ltXCIsIFwiXFxcXGVxc2xhbnRndHJcIiwgXCJcXFxcZXFzbGFudGxlc3NcIiwgXCJcXFxcZXF1aXZcIiwgXCJcXFxcZXRhXCIsIFwiXFxcXGV0aFwiLCBcIlxcXFxleGlzdHNcIiwgXCJcXFxcZXhwXCIsIFwiXFxcXGZhbGxpbmdkb3RzZXFcIiwgXCJcXFxcZmxhdFwiLCBcIlxcXFxmb3JhbGxcIiwgXCJcXFxcZnJvd25cIiwgXCJcXFxcZ2FtbWFcIiwgXCJcXFxcZ2NkXCIsIFwiXFxcXGdlXCIsIFwiXFxcXGdlcVwiLCBcIlxcXFxnZXFxXCIsIFwiXFxcXGdlcXNsYW50XCIsIFwiXFxcXGdldHNcIiwgXCJcXFxcZ2dcIiwgXCJcXFxcZ2dnXCIsIFwiXFxcXGdpbWVsXCIsIFwiXFxcXGduYXBwcm94XCIsIFwiXFxcXGduZXFcIiwgXCJcXFxcZ25lcXFcIiwgXCJcXFxcZ25zaW1cIiwgXCJcXFxcZ3JhdmV7I3t9fVwiLCBcIlxcXFxndHJhcHByb3hcIiwgXCJcXFxcZ3RyZG90XCIsIFwiXFxcXGd0cmVxbGVzc1wiLCBcIlxcXFxndHJlcXFsZXNzXCIsIFwiXFxcXGd0cmxlc3NcIiwgXCJcXFxcZ3Ryc2ltXCIsIFwiXFxcXGd2ZXJ0bmVxcVwiLCBcIlxcXFxoYXR7I3t9fVwiLCBcIlxcXFxoYmFyXCIsIFwiXFxcXGhib3hcIiwgXCJcXFxcaGVhcnRzdWl0XCIsIFwiXFxcXGhmaWxcIiwgXCJcXFxcaGZpbGxcIiwgXCJcXFxcaG9tXCIsIFwiXFxcXGhvb2tsZWZ0YXJyb3dcIiwgXCJcXFxcaG9va3JpZ2h0YXJyb3dcIiwgXCJcXFxcaHBoYW50b217I3t9fVwiLCBcIlxcXFxoc2tpcFwiLCBcIlxcXFxoc2xhc2hcIiwgXCJcXFxcaWRvdHNpbnRcIiwgXCJcXFxcaWZmXCIsXG4gICAgICAgIFwiXFxcXGlpaWludFwiLCBcIlxcXFxpaWludFwiLCBcIlxcXFxpaW50XCIsIFwiXFxcXGltYXRoXCIsIFwiXFxcXGltcGxpZWRieVwiLCBcIlxcXFxpbXBsaWVzXCIsIFwiXFxcXGluXCIsIFwiXFxcXGluZlwiLCBcIlxcXFxpbmZ0eVwiLCBcIlxcXFxpbmpsaW1cIiwgXCJcXFxcaW50XFxcXGxpbWl0c197I3t9fV57I3t9fVwiLCBcIlxcXFxpbnRlcmNhbFwiLCBcIlxcXFxpb3RhXCIsIFwiXFxcXGl0XCIsIFwiXFxcXGptYXRoXCIsIFwiXFxcXGthcHBhXCIsIFwiXFxcXGtlclwiLCBcIlxcXFxrZXJuXCIsIFwiXFxcXGxWZXJ0XCIsIFwiXFxcXGxhbWJkYVwiLCBcIlxcXFxsYW5kXCIsIFwiXFxcXGxhbmdsZVwiLCBcIlxcXFxsYnJhY2VcIiwgXCJcXFxcbGJyYWNrXCIsIFwiXFxcXGxjZWlsXCIsIFwiXFxcXGxkb3RwXCIsIFwiXFxcXGxkb3RzXCIsIFwiXFxcXGxlXCIsIFwiXFxcXGxlZnRcIiwgXCJcXFxcbGVmdGFycm93XCIsIFwiXFxcXGxlZnRhcnJvd3RhaWxcIiwgXCJcXFxcbGVmdGhhcnBvb25kb3duXCIsIFwiXFxcXGxlZnRoYXJwb29udXBcIiwgXCJcXFxcbGVmdGxlZnRhcnJvd3NcIiwgXCJcXFxcbGVmdHJpZ2h0YXJyb3dcIiwgXCJcXFxcbGVmdHJpZ2h0YXJyb3dzXCIsIFwiXFxcXGxlZnRyaWdodGhhcnBvb25zXCIsIFwiXFxcXGxlZnRyaWdodHNxdWlnYXJyb3dcIiwgXCJcXFxcbGVmdHJvb3R7I3t9fVwiLCBcIlxcXFxsZWZ0dGhyZWV0aW1lc1wiLCBcIlxcXFxsZXFcIiwgXCJcXFxcbGVxYWxpZ25ub3sje319XCIsIFwiXFxcXGxlcXFcIiwgXCJcXFxcbGVxc2xhbnRcIiwgXCJcXFxcbGVzc2FwcHJveFwiLCBcIlxcXFxsZXNzZG90XCIsIFwiXFxcXGxlc3NlcWd0clwiLCBcIlxcXFxsZXNzZXFxZ3RyXCIsIFwiXFxcXGxlc3NndHJcIiwgXCJcXFxcbGVzc3NpbVwiLCBcIlxcXFxsZXR7I3t9fXsje319XCIsIFwiXFxcXGxmbG9vclwiLCBcIlxcXFxsZ1wiLCBcIlxcXFxsZ3JvdXBcIiwgXCJcXFxcbGhkXCIsIFwiXFxcXGxpbVwiLCBcIlxcXFxsaW1pbmZcIiwgXCJcXFxcbGltaXRzX3sje319Xnsje319XCIsIFwiXFxcXGxpbXN1cFwiLCBcIlxcXFxsbFwiLCBcIlxcXFxsbGFweyN7fX1cIiwgXCJcXFxcbGxjb3JuZXJcIiwgXCJcXFxcbGxsXCIsIFwiXFxcXGxtb3VzdGFjaGVcIixcbiAgICAgICAgXCJcXFxcbG5cIiwgXCJcXFxcbG5hcHByb3hcIiwgXCJcXFxcbG5lcVwiLCBcIlxcXFxsbmVxcVwiLCBcIlxcXFxsbm90XCIsIFwiXFxcXGxuc2ltXCIsIFwiXFxcXGxvZ1wiLCBcIlxcXFxsb25nbGVmdGFycm93XCIsIFwiXFxcXGxvbmdsZWZ0cmlnaHRhcnJvd1wiLCBcIlxcXFxsb25nbWFwc3RvXCIsIFwiXFxcXGxvbmdyaWdodGFycm93XCIsIFwiXFxcXGxvb3BhcnJvd2xlZnRcIiwgXCJcXFxcbG9vcGFycm93cmlnaHRcIiwgXCJcXFxcbG9yXCIsIFwiXFxcXGxvd2VyXCIsIFwiXFxcXGxvemVuZ2VcIiwgXCJcXFxcbHJjb3JuZXJcIiwgXCJcXFxcbHRpbWVzXCIsIFwiXFxcXGx2ZXJ0XCIsIFwiXFxcXGx2ZXJ0bmVxcVwiLCBcIlxcXFxtYWx0ZXNlXCIsIFwiXFxcXG1hcHN0b1wiLCBcIlxcXFxtYXRoYmJ7I3t9fVwiLCBcIlxcXFxtYXRoYmZ7I3t9fVwiLCBcIlxcXFxtYXRoYmluXCIsIFwiXFxcXG1hdGhjYWx7I3t9fVwiLCBcIlxcXFxtYXRoY2hvaWNlXCIsIFwiXFxcXG1hdGhjbG9zZVwiLCBcIlxcXFxtYXRoZnJha3sje319XCIsIFwiXFxcXG1hdGhpbm5lclwiLCBcIlxcXFxtYXRob3BcIiwgXCJcXFxcbWF0aG9wZW5cIiwgXCJcXFxcbWF0aG9yZFwiLCBcIlxcXFxtYXRocHVuY3RcIiwgXCJcXFxcbWF0aHJlbFwiLCBcIlxcXFxtYXRoc3RydXRcIiwgXCJcXFxcbWF0cml4eyN7fX1cIiwgXCJcXFxcbWF4XCIsIFwiXFxcXG1lYXN1cmVkYW5nbGVcIiwgXCJcXFxcbWhvXCIsIFwiXFxcXG1pZFwiLCBcIlxcXFxtaWRkbGVcIiwgXCJcXFxcbWluXCIsIFwiXFxcXG1pdFwiLCBcIlxcXFxta2VyblwiLCBcIlxcXFxtb2RcIiwgXCJcXFxcbW9kZWxzXCIsIFwiXFxcXG1vdmVsZWZ0XCIsIFwiXFxcXG1vdmVyaWdodFwiLCBcIlxcXFxtcFwiLCBcIlxcXFxtc2tpcFwiLCBcIlxcXFxtc3BhY2V7I3t9fVwiLCBcIlxcXFxtdVwiLCBcIlxcXFxtdWx0aW1hcFwiLCBcIlxcXFxuTGVmdGFycm93XCIsIFwiXFxcXG5MZWZ0cmlnaHRhcnJvd1wiLCBcIlxcXFxuUmlnaHRhcnJvd1wiLCBcIlxcXFxuVkRhc2hcIiwgXCJcXFxcblZkYXNoXCIsIFwiXFxcXG5hYmxhXCIsIFwiXFxcXG5hdHVyYWxcIiwgXCJcXFxcbmNvbmdcIiwgXCJcXFxcbmVcIiwgXCJcXFxcbmVhcnJvd1wiLCBcIlxcXFxuZWdcIiwgXCJcXFxcbmVnbWVkc3BhY2VcIixcbiAgICAgICAgXCJcXFxcbmVndGhpY2tzcGFjZVwiLCBcIlxcXFxuZWd0aGluc3BhY2VcIiwgXCJcXFxcbmVxXCIsIFwiXFxcXG5leGlzdHNcIiwgXCJcXFxcbmdlcVwiLCBcIlxcXFxuZ2VxcVwiLCBcIlxcXFxuZ2Vxc2xhbnRcIiwgXCJcXFxcbmd0clwiLCBcIlxcXFxuaVwiLCBcIlxcXFxubGVmdGFycm93XCIsIFwiXFxcXG5sZWZ0cmlnaHRhcnJvd1wiLCBcIlxcXFxubGVxXCIsIFwiXFxcXG5sZXFxXCIsIFwiXFxcXG5sZXFzbGFudFwiLCBcIlxcXFxubGVzc1wiLCBcIlxcXFxubWlkXCIsIFwiXFxcXG5vbGltaXRzX3sje319Xnsje319XCIsIFwiXFxcXG5vdFwiLCBcIlxcXFxub3RhZ1wiLCBcIlxcXFxub3RpblwiLCBcIlxcXFxucGFyYWxsZWxcIiwgXCJcXFxcbnByZWNcIiwgXCJcXFxcbnByZWNlcVwiLCBcIlxcXFxucmlnaHRhcnJvd1wiLCBcIlxcXFxuc2hvcnRtaWRcIiwgXCJcXFxcbnNob3J0cGFyYWxsZWxcIiwgXCJcXFxcbnNpbVwiLCBcIlxcXFxuc3Vic2V0ZXFcIiwgXCJcXFxcbnN1YnNldGVxcVwiLCBcIlxcXFxuc3VjY1wiLCBcIlxcXFxuc3VjY2VxXCIsIFwiXFxcXG5zdXBzZXRlcVwiLCBcIlxcXFxuc3Vwc2V0ZXFxXCIsIFwiXFxcXG50cmlhbmdsZWxlZnRcIiwgXCJcXFxcbnRyaWFuZ2xlbGVmdGVxXCIsIFwiXFxcXG50cmlhbmdsZXJpZ2h0XCIsIFwiXFxcXG50cmlhbmdsZXJpZ2h0ZXFcIiwgXCJcXFxcbnVcIiwgXCJcXFxcbnZEYXNoXCIsIFwiXFxcXG52ZGFzaFwiLCBcIlxcXFxud2Fycm93XCIsIFwiXFxcXG9kb3RcIiwgXCJcXFxcb2ludFwiLCBcIlxcXFxvbGRzdHlsZVwiLCBcIlxcXFxvbWVnYVwiLCBcIlxcXFxvbWludXNcIiwgXCJcXFxcb3BlcmF0b3JuYW1leyN7fX1cIiwgXCJcXFxcb3BsdXNcIiwgXCJcXFxcb3NsYXNoXCIsIFwiXFxcXG90aW1lc1wiLCBcIlxcXFxvdmVyXCIsIFwiXFxcXG92ZXJicmFjZXsje319XCIsIFwiXFxcXG92ZXJsZWZ0YXJyb3d7I3t9fVwiLCBcIlxcXFxvdmVybGVmdHJpZ2h0YXJyb3d7I3t9fVwiLCBcIlxcXFxvdmVybGluZXsje319XCIsIFwiXFxcXG92ZXJyaWdodGFycm93eyN7fX1cIiwgXCJcXFxcb3ZlcnNldHsje319eyN7fX1cIiwgXCJcXFxcb3ZlcndpdGhkZWxpbXNcIiwgXCJcXFxcb3duc1wiLFxuICAgICAgICBcIlxcXFxwYXJhbGxlbFwiLCBcIlxcXFxwYXJ0aWFsXCIsIFwiXFxcXHBlcnBcIiwgXCJcXFxccGhhbnRvbXsje319XCIsIFwiXFxcXHBoaVwiLCBcIlxcXFxwaVwiLCBcIlxcXFxwaXRjaGZvcmtcIiwgXCJcXFxccG1cIiwgXCJcXFxccG1hdHJpeHsje319XCIsIFwiXFxcXHBtYnsje319XCIsIFwiXFxcXHBtb2RcIiwgXCJcXFxccG9kXCIsIFwiXFxcXHByZWNcIiwgXCJcXFxccHJlY2FwcHJveFwiLCBcIlxcXFxwcmVjY3VybHllcVwiLCBcIlxcXFxwcmVjZXFcIiwgXCJcXFxccHJlY25hcHByb3hcIiwgXCJcXFxccHJlY25lcXFcIiwgXCJcXFxccHJlY25zaW1cIiwgXCJcXFxccHJlY3NpbVwiLCBcIlxcXFxwcmltZVwiLCBcIlxcXFxwcm9kXFxcXGxpbWl0c197I3t9fV57I3t9fVwiLCBcIlxcXFxwcm9qbGltXCIsIFwiXFxcXHByb3B0b1wiLCBcIlxcXFxwc2lcIiwgXCJcXFxccXF1YWRcIiwgXCJcXFxccXVhZFwiLCBcIlxcXFxyVmVydFwiLCBcIlxcXFxyYWlzZVwiLCBcIlxcXFxyYW5nbGVcIiwgXCJcXFxccmJyYWNlXCIsIFwiXFxcXHJicmFja1wiLCBcIlxcXFxyY2VpbFwiLCBcIlxcXFxyZmxvb3JcIiwgXCJcXFxccmdyb3VwXCIsIFwiXFxcXHJoZFwiLCBcIlxcXFxyaG9cIiwgXCJcXFxccmlnaHRcIiwgXCJcXFxccmlnaHRhcnJvd1wiLCBcIlxcXFxyaWdodGFycm93dGFpbFwiLCBcIlxcXFxyaWdodGhhcnBvb25kb3duXCIsIFwiXFxcXHJpZ2h0aGFycG9vbnVwXCIsIFwiXFxcXHJpZ2h0bGVmdGFycm93c1wiLCBcIlxcXFxyaWdodGxlZnRoYXJwb29uc1wiLCBcIlxcXFxyaWdodHJpZ2h0YXJyb3dzXCIsIFwiXFxcXHJpZ2h0c3F1aWdhcnJvd1wiLCBcIlxcXFxyaWdodHRocmVldGltZXNcIiwgXCJcXFxccmlzaW5nZG90c2VxXCIsIFwiXFxcXHJsYXB7I3t9fVwiLCBcIlxcXFxybVwiLCBcIlxcXFxybW91c3RhY2hlXCIsIFwiXFxcXHJvb3QgI3t9IFxcXFxvZiAje31cIiwgXCJcXFxccnRpbWVzXCIsIFwiXFxcXHJ2ZXJ0XCIsIFwiXFxcXHNjcmlwdHNjcmlwdHN0eWxlXCIsIFwiXFxcXHNjcmlwdHN0eWxlXCIsIFwiXFxcXHNlYXJyb3dcIiwgXCJcXFxcc2VjXCIsIFwiXFxcXHNldG1pbnVzXCIsIFwiXFxcXHNoYXJwXCIsIFwiXFxcXHNob3J0bWlkXCIsXG4gICAgICAgIFwiXFxcXHNob3J0cGFyYWxsZWxcIiwgXCJcXFxcc2lkZXNldHsje319eyN7fX17I3t9fVwiLCBcIlxcXFxzaWdtYVwiLCBcIlxcXFxzaW1cIiwgXCJcXFxcc2ltZXFcIiwgXCJcXFxcc2luXCIsIFwiXFxcXHNpbmhcIiwgXCJcXFxcc2tld3sje319eyN7fX17I3t9fVwiLCBcIlxcXFxzbWFsbGZyb3duXCIsIFwiXFxcXHNtYWxsaW50XCIsIFwiXFxcXHNtYWxsc2V0bWludXNcIiwgXCJcXFxcc21hbGxzbWlsZVwiLCBcIlxcXFxzbWFzaHsje319XCIsIFwiXFxcXHNtaWxlXCIsIFwiXFxcXHNwYWNlXCIsIFwiXFxcXHNwYWRlc3VpdFwiLCBcIlxcXFxzcGhlcmljYWxhbmdsZVwiLCBcIlxcXFxzcWNhcFwiLCBcIlxcXFxzcWN1cFwiLCBcIlxcXFxzcXJ0eyN7fX1cIiwgXCJcXFxcc3FzdWJzZXRcIiwgXCJcXFxcc3FzdWJzZXRlcVwiLCBcIlxcXFxzcXN1cHNldFwiLCBcIlxcXFxzcXN1cHNldGVxXCIsIFwiXFxcXHNxdWFyZVwiLCBcIlxcXFxzdGFyXCIsIFwiXFxcXHN0cnV0XCIsIFwiXFxcXHN1YnNldFwiLCBcIlxcXFxzdWJzZXRlcVwiLCBcIlxcXFxzdWJzZXRlcXFcIiwgXCJcXFxcc3Vic2V0bmVxXCIsIFwiXFxcXHN1YnNldG5lcXFcIiwgXCJcXFxcc3Vic3RhY2t7I3t9fVwiLCBcIlxcXFxzdWNjXCIsIFwiXFxcXHN1Y2NhcHByb3hcIiwgXCJcXFxcc3VjY2N1cmx5ZXFcIiwgXCJcXFxcc3VjY2VxXCIsIFwiXFxcXHN1Y2NuYXBwcm94XCIsIFwiXFxcXHN1Y2NuZXFxXCIsIFwiXFxcXHN1Y2Nuc2ltXCIsIFwiXFxcXHN1Y2NzaW1cIiwgXCJcXFxcc3VtXFxcXGxpbWl0c197I3t9fV57I3t9fVwiLCBcIlxcXFxzdXBcIiwgXCJcXFxcc3Vwc2V0XCIsIFwiXFxcXHN1cHNldGVxXCIsIFwiXFxcXHN1cHNldGVxcVwiLCBcIlxcXFxzdXBzZXRuZXFcIiwgXCJcXFxcc3Vwc2V0bmVxcVwiLCBcIlxcXFxzdXJkXCIsIFwiXFxcXHN3YXJyb3dcIiwgXCJcXFxcdGFneyN7fX1cIiwgXCJcXFxcdGFuXCIsIFwiXFxcXHRhbmhcIiwgXCJcXFxcdGF1XCIsIFwiXFxcXHRiaW5vbXsje319eyN7fX1cIiwgXCJcXFxcdGV4dHsje319XCIsIFwiXFxcXHRleHRzdHlsZVwiLCBcIlxcXFx0ZnJhY3sje319eyN7fX1cIiwgXCJcXFxcdGhlcmVmb3JlXCIsIFwiXFxcXHRoZXRhXCIsXG4gICAgICAgIFwiXFxcXHRoaWNrYXBwcm94XCIsIFwiXFxcXHRoaWNrc2ltXCIsIFwiXFxcXHRoaW5zcGFjZVwiLCBcIlxcXFx0aWxkZXsje319XCIsIFwiXFxcXHRpbWVzXCIsIFwiXFxcXHRvXCIsIFwiXFxcXHRvcFwiLCBcIlxcXFx0cmlhbmdsZVwiLCBcIlxcXFx0cmlhbmdsZWRvd25cIiwgXCJcXFxcdHJpYW5nbGVsZWZ0XCIsIFwiXFxcXHRyaWFuZ2xlbGVmdGVxXCIsIFwiXFxcXHRyaWFuZ2xlcVwiLCBcIlxcXFx0cmlhbmdsZXJpZ2h0XCIsIFwiXFxcXHRyaWFuZ2xlcmlnaHRlcVwiLCBcIlxcXFx0dFwiLCBcIlxcXFx0d29oZWFkbGVmdGFycm93XCIsIFwiXFxcXHR3b2hlYWRyaWdodGFycm93XCIsIFwiXFxcXHVsY29ybmVyXCIsIFwiXFxcXHVuZGVyYnJhY2V7I3t9fVwiLCBcIlxcXFx1bmRlcmxlZnRhcnJvd3sje319XCIsIFwiXFxcXHVuZGVybGVmdHJpZ2h0YXJyb3d7I3t9fVwiLCBcIlxcXFx1bmRlcmxpbmV7I3t9fVwiLCBcIlxcXFx1bmRlcnJpZ2h0YXJyb3d7I3t9fVwiLCBcIlxcXFx1bmRlcnNldHsje319eyN7fX1cIiwgXCJcXFxcdW5saGRcIiwgXCJcXFxcdW5yaGRcIiwgXCJcXFxcdXBhcnJvd1wiLCBcIlxcXFx1cGRvd25hcnJvd1wiLCBcIlxcXFx1cGhhcnBvb25sZWZ0XCIsIFwiXFxcXHVwaGFycG9vbnJpZ2h0XCIsIFwiXFxcXHVwbHVzXCIsIFwiXFxcXHVwcm9vdHsje319XCIsIFwiXFxcXHVwc2lsb25cIiwgXCJcXFxcdXB1cGFycm93c1wiLCBcIlxcXFx1cmNvcm5lclwiLCBcIlxcXFx2RGFzaFwiLCBcIlxcXFx2YXJEZWx0YVwiLCBcIlxcXFx2YXJHYW1tYVwiLCBcIlxcXFx2YXJMYW1iZGFcIiwgXCJcXFxcdmFyT21lZ2FcIiwgXCJcXFxcdmFyUGhpXCIsIFwiXFxcXHZhclBpXCIsIFwiXFxcXHZhclBzaVwiLCBcIlxcXFx2YXJTaWdtYVwiLCBcIlxcXFx2YXJUaGV0YVwiLCBcIlxcXFx2YXJVcHNpbG9uXCIsIFwiXFxcXHZhclhpXCIsIFwiXFxcXHZhcmVwc2lsb25cIiwgXCJcXFxcdmFyaW5qbGltXCIsIFwiXFxcXHZhcmthcHBhXCIsIFwiXFxcXHZhcmxpbWluZlwiLCBcIlxcXFx2YXJsaW1zdXBcIiwgXCJcXFxcdmFybm90aGluZ1wiLCBcIlxcXFx2YXJwaGlcIiwgXCJcXFxcdmFycGlcIixcbiAgICAgICAgXCJcXFxcdmFycHJvamxpbVwiLCBcIlxcXFx2YXJwcm9wdG9cIiwgXCJcXFxcdmFycmhvXCIsIFwiXFxcXHZhcnNpZ21hXCIsIFwiXFxcXHZhcnN1YnNldG5lcVwiLCBcIlxcXFx2YXJzdWJzZXRuZXFxXCIsIFwiXFxcXHZhcnN1cHNldG5lcVwiLCBcIlxcXFx2YXJzdXBzZXRuZXFxXCIsIFwiXFxcXHZhcnRoZXRhXCIsIFwiXFxcXHZhcnRyaWFuZ2xlXCIsIFwiXFxcXHZhcnRyaWFuZ2xlbGVmdFwiLCBcIlxcXFx2YXJ0cmlhbmdsZXJpZ2h0XCIsIFwiXFxcXHZjZW50ZXJcIiwgXCJcXFxcdmRhc2hcIiwgXCJcXFxcdmVjeyN7fX1cIiwgXCJcXFxcdmVlXCIsIFwiXFxcXHZlZWJhclwiLCBcIlxcXFx2ZXJ0XCIsIFwiXFxcXHZwaGFudG9teyN7fX1cIiwgXCJcXFxcd2VkZ2VcIiwgXCJcXFxcd2lkZWhhdHsje319XCIsIFwiXFxcXHdpZGV0aWxkZXsje319XCIsIFwiXFxcXHdwXCIsIFwiXFxcXHdyXCIsIFwiXFxcXHhpXCIsIFwiXFxcXHhsZWZ0YXJyb3d7I3t9fVwiLCBcIlxcXFx4cmlnaHRhcnJvd3sje319XCIsIFwiXFxcXHpldGFcIiwgXCJcXFxcYmVnaW57ZGVmaW5pdGlvbn1cIiwgXCJcXFxcYmVnaW57dGlremNkfVwiLCBcIlxcXFxiZWdpbnt0aWt6cGljdHVyZX1cIiwgXCJcXFxcYmVnaW57YWxpZ259XCIsIFwiXFxcXGJlZ2lue2FsaWduKn1cIiwgXCJcXFxcYmVnaW57YWxpZ25hdH1cIiwgXCJcXFxcYmVnaW57YWxpZ25hdCp9XCIsIFwiXFxcXGJlZ2lue2FsaWduZWR9XCIsIFwiXFxcXGJlZ2lue2FsaWduZWRhdH1cIiwgXCJcXFxcYmVnaW57YXJyYXl9XCIsIFwiXFxcXGJlZ2lue0JtYXRyaXh9XCIsIFwiXFxcXGJlZ2lue2JtYXRyaXh9XCIsIFwiXFxcXGJlZ2lue2Nhc2VzfVwiLCBcIlxcXFxiZWdpbntDRH1cIiwgXCJcXFxcYmVnaW57ZXFuYXJyYXl9XCIsIFwiXFxcXGJlZ2lue2VxbmFycmF5Kn1cIiwgXCJcXFxcYmVnaW57ZXF1YXRpb259XCIsIFwiXFxcXGJlZ2lue2VxdWF0aW9uKn1cIiwgXCJcXFxcYmVnaW57Z2F0aGVyfVwiLCBcIlxcXFxiZWdpbntnYXRoZXIqfVwiLCBcIlxcXFxiZWdpbntnYXRoZXJlZH1cIiwgXCJcXFxcYmVnaW57bWF0cml4fVwiLFxuICAgICAgICBcIlxcXFxiZWdpbnttdWx0bGluZX1cIiwgXCJcXFxcYmVnaW57bXVsdGxpbmUqfVwiLCBcIlxcXFxiZWdpbntwbWF0cml4fVwiLCBcIlxcXFxiZWdpbntzbWFsbG1hdHJpeH1cIiwgXCJcXFxcYmVnaW57c3BsaXR9XCIsIFwiXFxcXGJlZ2lue3N1YmFycmF5fVwiLCBcIlxcXFxiZWdpbntWbWF0cml4fVwiLCBcIlxcXFxiZWdpbnt2bWF0cml4fVwiLCBcIlxcXFxlbmR7ZGVmaW5pdGlvbn1cIiwgXCJcXFxcZW5ke3Rpa3pjZH1cIiwgXCJcXFxcZW5ke3Rpa3pwaWN0dXJlfVwiLCBcIlxcXFxlbmR7YWxpZ259XCIsIFwiXFxcXGVuZHthbGlnbip9XCIsIFwiXFxcXGVuZHthbGlnbmF0fVwiLCBcIlxcXFxlbmR7YWxpZ25hdCp9XCIsIFwiXFxcXGVuZHthbGlnbmVkfVwiLCBcIlxcXFxlbmR7YWxpZ25lZGF0fVwiLCBcIlxcXFxlbmR7YXJyYXl9XCIsIFwiXFxcXGVuZHtCbWF0cml4fVwiLCBcIlxcXFxlbmR7Ym1hdHJpeH1cIiwgXCJcXFxcZW5ke2Nhc2VzfVwiLCBcIlxcXFxlbmR7Q0R9XCIsIFwiXFxcXGVuZHtlcW5hcnJheX1cIiwgXCJcXFxcZW5ke2VxbmFycmF5Kn1cIiwgXCJcXFxcZW5ke2VxdWF0aW9ufVwiLCBcIlxcXFxlbmR7ZXF1YXRpb24qfVwiLCBcIlxcXFxlbmR7Z2F0aGVyfVwiLCBcIlxcXFxlbmR7Z2F0aGVyKn1cIiwgXCJcXFxcZW5ke2dhdGhlcmVkfVwiLCBcIlxcXFxlbmR7bWF0cml4fVwiLFxuICAgICAgICBcIlxcXFxlbmR7bXVsdGxpbmV9XCIsIFwiXFxcXGVuZHttdWx0bGluZSp9XCIsIFwiXFxcXGVuZHtwbWF0cml4fVwiLCBcIlxcXFxlbmR7c21hbGxtYXRyaXh9XCIsIFwiXFxcXGVuZHtzcGxpdH1cIiwgXCJcXFxcZW5ke3N1YmFycmF5fVwiLCBcIlxcXFxlbmR7Vm1hdHJpeH1cIiwgXCJcXFxcZW5ke3ZtYXRyaXh9XCJdXG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3Rpb24sXG4gIGRlZmF1bHREaXJlY3Rpb24sXG4gIG1hbmFnZVBsYWNlaG9sZGVycyxcbiAgdXBkYXRlU2VsZWN0ZWRTdWdnZXN0aW9uRnJvbSxcbiAgY29weU9iamVjdCxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUvY29yZSdcbmltcG9ydCB7XG4gIGdlbmVyYXRlVmlldyxcbiAgYXBwZW5kV2lkZ2V0LFxuICB1cGRhdGVDYWNoZWRWaWV3LFxuICBzY3JvbGxUbyxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUvdmlldydcblxuaW1wb3J0IHsgRmxvd1Byb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZmxvdydcbmltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tICcuL3Byb3ZpZGVycy9mbG93L3Rva2VuaXplcidcbmltcG9ydCB7IFRva2VuaXplckZhY3RvcnkgfSBmcm9tICcuL3Byb3ZpZGVycy9mbG93L2ZhY3RvcnknXG5pbXBvcnQgTGFUZXhQcm92aWRlciBmcm9tICcuL3Byb3ZpZGVycy9sYXRleCdcbmltcG9ydCB7IENvbXBsZXRpb24sIFByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvcHJvdmlkZXInXG5cbmltcG9ydCB7IEF1dG9jb21wbGV0ZVNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncy9zZXR0aW5ncydcblxuaW1wb3J0IHsgVEZpbGUgfSBmcm9tICdvYnNpZGlhbidcblxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZSB7XG4gIHByaXZhdGUgcHJvdmlkZXJzOiBQcm92aWRlcltdXG4gIHByaXZhdGUgc3VnZ2VzdGlvbnM6IENvbXBsZXRpb25bXVxuICBwcml2YXRlIHNlbGVjdGVkOiBEaXJlY3Rpb25cblxuICBwcml2YXRlIHZpZXc6IEhUTUxFbGVtZW50XG4gIHByaXZhdGUgY3Vyc29yQXRUcmlnZ2VyPzogQ29kZU1pcnJvci5Qb3NpdGlvblxuICBwcml2YXRlIGxhc3RDb21wbGV0aW9uV29yZD86IHN0cmluZ1xuICBwcml2YXRlIG9uQ2xpY2tDYWxsYmFjazogKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB2b2lkXG5cbiAgcHJpdmF0ZSBzZXR0aW5nczogQXV0b2NvbXBsZXRlU2V0dGluZ3NcblxuICBjb25zdHJ1Y3RvcihzZXR0aW5nczogQXV0b2NvbXBsZXRlU2V0dGluZ3MpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLmxvYWRQcm92aWRlcnMoKVxuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBbXVxuICAgIHRoaXMuc2VsZWN0ZWQgPSBkZWZhdWx0RGlyZWN0aW9uKClcbiAgICB0aGlzLnZpZXcgPSBudWxsXG4gIH1cblxuICBwdWJsaWMgZ2V0IGlzU2hvd24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudmlldyAhPT0gbnVsbFxuICB9XG5cbiAgLy8gVE9ETzogQ3JlYXRlIHNldHRpbmdzIHR5cGVcbiAgcHVibGljIHRvZ2dsZVZpZXdJbihcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHtcbiAgICAgIGF1dG9TZWxlY3QsXG4gICAgICBzaG93RW1wdHlNYXRjaCxcbiAgICB9OiB7IGF1dG9TZWxlY3Q6IGJvb2xlYW47IHNob3dFbXB0eU1hdGNoOiBib29sZWFuIH0gPSB7XG4gICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuICAgICAgc2hvd0VtcHR5TWF0Y2g6IHRydWUsXG4gICAgfVxuICApIHtcbiAgICBjb25zdCBpc0VuYWJsZWQgPSB0aGlzLnNldHRpbmdzLmVuYWJsZWRcbiAgICBpZiAodGhpcy5pc1Nob3duIHx8ICFpc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuY3Vyc29yQXRUcmlnZ2VyID0gbnVsbFxuICAgICAgdGhpcy5yZW1vdmVWaWV3RnJvbShlZGl0b3IpXG4gICAgfSBlbHNlIGlmIChpc0VuYWJsZWQpIHtcbiAgICAgIGNvbnN0IGN1cnNvciA9IGNvcHlPYmplY3QoZWRpdG9yLmdldEN1cnNvcigpKVxuICAgICAgY29uc3QgY3VycmVudExpbmU6IHN0cmluZyA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKVxuXG4gICAgICBjb25zdCB3b3JkU3RhcnRJbmRleCA9IHRoaXMudG9rZW5pemVyLmxhc3RXb3JkU3RhcnRQb3MoXG4gICAgICAgIGN1cnJlbnRMaW5lLFxuICAgICAgICBjdXJzb3IuY2hcbiAgICAgIClcbiAgICAgIGNvbnN0IGN1cnNvckF0ID0gY3Vyc29yLmNoXG4gICAgICBjdXJzb3IuY2ggPSB3b3JkU3RhcnRJbmRleFxuICAgICAgdGhpcy5jdXJzb3JBdFRyaWdnZXIgPSBjdXJzb3JcblxuICAgICAgY29uc3Qgd29yZCA9IGN1cnJlbnRMaW5lLnNsaWNlKHdvcmRTdGFydEluZGV4LCBjdXJzb3JBdClcblxuICAgICAgdGhpcy5zaG93Vmlld0luKGVkaXRvciwgd29yZCwgeyBhdXRvU2VsZWN0LCBzaG93RW1wdHlNYXRjaCB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVWaWV3SW4oXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBldmVudDogS2V5Ym9hcmRFdmVudCxcbiAgICB7XG4gICAgICB1cGRhdGVTZWxlY3RlZCxcbiAgICAgIGF1dG9TZWxlY3QsXG4gICAgICBzaG93RW1wdHlNYXRjaCxcbiAgICB9OiB7XG4gICAgICB1cGRhdGVTZWxlY3RlZDogYm9vbGVhblxuICAgICAgYXV0b1NlbGVjdDogYm9vbGVhblxuICAgICAgc2hvd0VtcHR5TWF0Y2g6IGJvb2xlYW5cbiAgICB9ID0ge1xuICAgICAgdXBkYXRlU2VsZWN0ZWQ6IHRydWUsXG4gICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuICAgICAgc2hvd0VtcHR5TWF0Y2g6IHRydWUsXG4gICAgfVxuICApIHtcbiAgICBpZiAodXBkYXRlU2VsZWN0ZWQpXG4gICAgICB0aGlzLnNlbGVjdGVkID0gdXBkYXRlU2VsZWN0ZWRTdWdnZXN0aW9uRnJvbShcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQsXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgICApXG5cbiAgICBjb25zdCBjdXJzb3IgPSBjb3B5T2JqZWN0KGVkaXRvci5nZXRDdXJzb3IoKSlcbiAgICBjb25zdCBjdXJyZW50TGluZTogc3RyaW5nID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpXG4gICAgY29uc3QgY29tcGxldGlvbldvcmQgPSB0aGlzLnRva2VuaXplci5sYXN0V29yZEZyb20oY3VycmVudExpbmUsIGN1cnNvci5jaClcblxuICAgIGNvbnN0IHJlY3JlYXRlID0gY29tcGxldGlvbldvcmQgIT09IHRoaXMubGFzdENvbXBsZXRpb25Xb3JkXG4gICAgaWYgKHJlY3JlYXRlKSB7XG4gICAgICB0aGlzLmxhc3RDb21wbGV0aW9uV29yZCA9IGNvbXBsZXRpb25Xb3JkXG4gICAgICB0aGlzLnNob3dWaWV3SW4oZWRpdG9yLCBjb21wbGV0aW9uV29yZCwgeyBhdXRvU2VsZWN0LCBzaG93RW1wdHlNYXRjaCB9KVxuICAgIH0gZWxzZSB1cGRhdGVDYWNoZWRWaWV3KHRoaXMudmlldywgdGhpcy5zZWxlY3RlZC5pbmRleClcblxuICAgIHNjcm9sbFRvKHRoaXMuc2VsZWN0ZWQsIHRoaXMudmlldywgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGgpXG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlVmlld0Zyb20oZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSBkZWZhdWx0RGlyZWN0aW9uKClcbiAgICBlZGl0b3IucmVtb3ZlS2V5TWFwKHRoaXMua2V5TWFwcylcblxuICAgIGlmICghdGhpcy52aWV3KSByZXR1cm5cbiAgICB0aGlzLmFkZENsaWNrTGlzdGVuZXIodGhpcy52aWV3LCBlZGl0b3IsIGZhbHNlKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy52aWV3LnBhcmVudE5vZGVcbiAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgIGNvbnN0IHJlbW92ZWQgPSBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMudmlldylcbiAgICAgICAgaWYgKHJlbW92ZWQpIHRoaXMudmlldyA9IG51bGxcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBDYW5ub3QgZGVzdHJveSB2aWV3LiBSZWFzb246ICR7ZX1gKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVQcm92aWRlcnNGcm9tKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3QgdG9rZW5pemVyID0gdGhpcy50b2tlbml6ZXJcbiAgICBpZiAoXG4gICAgICAhZXZlbnQuY3RybEtleSAmJlxuICAgICAgKHRva2VuaXplci5pc1dvcmRTZXBhcmF0b3IoZXZlbnQua2V5KSB8fCBldmVudC5rZXkgPT09ICdFbnRlcicpXG4gICAgKSB7XG4gICAgICBjb25zdCBjdXJzb3IgPSBjb3B5T2JqZWN0KGVkaXRvci5nZXRDdXJzb3IoKSlcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgY3Vyc29yLmxpbmUgLT0gMVxuICAgICAgICBjb25zdCBjdXJyZW50TGluZSA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKVxuXG4gICAgICAgIC8vIENoYW5nZWQgZWRpdG9yIHBhbmVcbiAgICAgICAgaWYgKCFjdXJyZW50TGluZSkgcmV0dXJuXG5cbiAgICAgICAgY3Vyc29yLmNoID0gY3VycmVudExpbmUubGVuZ3RoXG4gICAgICB9XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpXG4gICAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlcikgPT4ge1xuICAgICAgICAvLyBGb3Igbm93IG9ubHkgRmxvd1Byb3ZpZGVyXG4gICAgICAgIGlmIChwcm92aWRlciBpbnN0YW5jZW9mIEZsb3dQcm92aWRlcilcbiAgICAgICAgICBwcm92aWRlci5hZGRMYXN0V29yZEZyb20obGluZSwgY3Vyc29yLmNoLCB0b2tlbml6ZXIpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzY2FuRmlsZShmaWxlOiBURmlsZSwgc3RyYXRlZ3k6IFRva2VuaXplU3RyYXRlZ3kgPSAnZGVmYXVsdCcpIHtcbiAgICBjb25zdCBwcm92aWRlcnMgPSB0aGlzLnByb3ZpZGVyc1xuICAgIGZpbGUudmF1bHQ/LnJlYWQoZmlsZSkudGhlbigoY29udGVudDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBUT0RPOiBNYWtlIGl0IGFzeW5jXG4gICAgICBwcm92aWRlcnMuZm9yRWFjaCgocHJvdmlkZXIpID0+IHtcbiAgICAgICAgaWYgKHByb3ZpZGVyIGluc3RhbmNlb2YgRmxvd1Byb3ZpZGVyKSB7XG4gICAgICAgICAgbGV0IHRva2VuaXplciA9IHRoaXMudG9rZW5pemVyXG4gICAgICAgICAgaWYgKHN0cmF0ZWd5ICE9PSB0aGlzLnRva2VuaXplclN0cmF0ZWd5KVxuICAgICAgICAgICAgdG9rZW5pemVyID0gVG9rZW5pemVyRmFjdG9yeS5nZXRUb2tlbml6ZXIoXG4gICAgICAgICAgICAgIHN0cmF0ZWd5LFxuICAgICAgICAgICAgICB0aGlzLmdldFdvcmRTZXBhcmF0b3JzRnJvbShzdHJhdGVneSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICBwcm92aWRlci5hZGRXb3Jkc0Zyb20oY29udGVudCwgdG9rZW5pemVyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvLyBUT0RPOiBJbXByb3ZlIHN1Z2dlc3Rpb25zIHB1YmxpYyBBUElcbiAgcHVibGljIHNlbGVjdExhc3RTdWdnZXN0aW9uKCkge1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB7XG4gICAgICBpbmRleDogdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxLFxuICAgICAgZGlyZWN0aW9uOiAnYmFja3dhcmQnLFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgdG9rZW5pemVyKCkge1xuICAgIHJldHVybiBUb2tlbml6ZXJGYWN0b3J5LmdldFRva2VuaXplcihcbiAgICAgIHRoaXMudG9rZW5pemVyU3RyYXRlZ3ksXG4gICAgICB0aGlzLnRva2VuaXplcldvcmRTZXBhcmF0b3JzXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdG9rZW5pemVyU3RyYXRlZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuZmxvd1Byb3ZpZGVyVG9rZW5pemVTdHJhdGVneVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdG9rZW5pemVyV29yZFNlcGFyYXRvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuZmxvd1dvcmRTZXBhcmF0b3JzW3RoaXMudG9rZW5pemVyU3RyYXRlZ3ldXG4gIH1cblxuICBwcml2YXRlIGdldFdvcmRTZXBhcmF0b3JzRnJvbShzdHJhdGVneTogVG9rZW5pemVTdHJhdGVneSkge1xuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmZsb3dXb3JkU2VwYXJhdG9yc1tzdHJhdGVneV1cbiAgfVxuXG4gIC8vIFRPRE86IENyZWF0ZSBzZXR0aW5ncyB0eXBlXG4gIHByaXZhdGUgc2hvd1ZpZXdJbihcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNvbXBsZXRpb25Xb3JkOiBzdHJpbmcgPSAnJyxcbiAgICB7XG4gICAgICBhdXRvU2VsZWN0LFxuICAgICAgc2hvd0VtcHR5TWF0Y2gsXG4gICAgfTogeyBhdXRvU2VsZWN0OiBib29sZWFuOyBzaG93RW1wdHlNYXRjaDogYm9vbGVhbiB9ID0ge1xuICAgICAgYXV0b1NlbGVjdDogdHJ1ZSxcbiAgICAgIHNob3dFbXB0eU1hdGNoOiB0cnVlLFxuICAgIH1cbiAgKSB7XG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IHRoaXMucHJvdmlkZXJzLnJlZHVjZShcbiAgICAgIChhY2MsIHByb3ZpZGVyKSA9PiBhY2MuY29uY2F0KHByb3ZpZGVyLm1hdGNoV2l0aChjb21wbGV0aW9uV29yZCB8fCAnJykpLFxuICAgICAgW11cbiAgICApXG5cbiAgICBjb25zdCBzdWdnZXN0aW9uc0xlbmd0aCA9IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoXG4gICAgaWYgKCF0aGlzLmlzU2hvd24gJiYgYXV0b1NlbGVjdCAmJiBzdWdnZXN0aW9uc0xlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gU3VnZ2VzdCBhdXRvbWF0aWNhbGx5XG4gICAgICB0aGlzLnNlbGVjdGVkLmluZGV4ID0gMFxuICAgICAgdGhpcy5zZWxlY3RTdWdnZXN0aW9uKGVkaXRvcilcbiAgICB9IGVsc2UgaWYgKCFzaG93RW1wdHlNYXRjaCAmJiBzdWdnZXN0aW9uc0xlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5yZW1vdmVWaWV3RnJvbShlZGl0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnZpZXcpIHRoaXMucmVtb3ZlVmlld0Zyb20oZWRpdG9yKVxuXG4gICAgICBlZGl0b3IuYWRkS2V5TWFwKHRoaXMua2V5TWFwcylcblxuICAgICAgdGhpcy52aWV3ID0gZ2VuZXJhdGVWaWV3KHRoaXMuc3VnZ2VzdGlvbnMsIHRoaXMuc2VsZWN0ZWQuaW5kZXgpXG4gICAgICB0aGlzLmFkZENsaWNrTGlzdGVuZXIodGhpcy52aWV3LCBlZGl0b3IpXG4gICAgICBhcHBlbmRXaWRnZXQoZWRpdG9yLCB0aGlzLnZpZXcpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBrZXlNYXBzID0ge1xuICAgIC8vIE92ZXJyaWRlIGNvZGUgbWlycm9yIGRlZmF1bHQga2V5IG1hcHNcbiAgICAnQ3RybC1QJzogKCkgPT4ge30sXG4gICAgJ0N0cmwtTic6ICgpID0+IHt9LFxuICAgIFVwOiAoKSA9PiB7fSxcbiAgICBEb3duOiAoKSA9PiB7fSxcbiAgICBSaWdodDogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IHRoaXMucmVtb3ZlVmlld0Zyb20oZWRpdG9yKSxcbiAgICBMZWZ0OiAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikgPT4gdGhpcy5yZW1vdmVWaWV3RnJvbShlZGl0b3IpLFxuICAgIFRhYjogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0U3VnZ2VzdGlvbihlZGl0b3IpXG4gICAgfSxcbiAgICBFbnRlcjogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0U3VnZ2VzdGlvbihlZGl0b3IpXG4gICAgfSxcbiAgICBFc2M6IChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZVZpZXdGcm9tKGVkaXRvcilcbiAgICAgIGlmIChlZGl0b3IuZ2V0T3B0aW9uKCdrZXlNYXAnKSA9PT0gJ3ZpbS1pbnNlcnQnKVxuICAgICAgICBlZGl0b3Iub3BlcmF0aW9uKCgpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vY29kZW1pcnJvci9Db2RlTWlycm9yL2Jsb2IvYmQzN2E5NmQzNjJiOGQ5Mjg5NWQzOTYwZDU2OTE2OGVjMzllNDE2NS9rZXltYXAvdmltLmpzI0w1MzQxXG4gICAgICAgICAgY29uc3QgdmltID0gZWRpdG9yLnN0YXRlLnZpbVxuICAgICAgICAgIHZpbS5pbnNlcnRNb2RlID0gZmFsc2VcbiAgICAgICAgICBlZGl0b3Iuc2V0T3B0aW9uKCdrZXlNYXAnLCAndmltJylcbiAgICAgICAgfSlcbiAgICB9LFxuICB9XG5cbiAgLy8gVE9ETzogUmVmYWN0b3JcbiAgcHJpdmF0ZSBhZGRDbGlja0xpc3RlbmVyKFxuICAgIHZpZXc6IEhUTUxFbGVtZW50LFxuICAgIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgYWRkID0gdHJ1ZVxuICApIHtcbiAgICBpZiAoIXRoaXMub25DbGlja0NhbGxiYWNrKVxuICAgICAgdGhpcy5vbkNsaWNrQ2FsbGJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudFxuICAgICAgICBsZXQgaGludElkID0gZWxlbWVudC5pZFxuICAgICAgICBpZiAoIWhpbnRJZCkge1xuICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSBhcyBIVE1MRWxlbWVudFxuICAgICAgICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LmlkKSBoaW50SWQgPSBwYXJlbnQuaWRcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhpbnRJZFByZWZpeCA9ICdzdWdnZXN0aW9uLSdcbiAgICAgICAgaWYgKGhpbnRJZCAmJiBoaW50SWQuc3RhcnRzV2l0aChoaW50SWRQcmVmaXgpKSB7XG4gICAgICAgICAgaGludElkID0gaGludElkLnJlcGxhY2UoaGludElkUHJlZml4LCAnJylcbiAgICAgICAgICBjb25zdCBpZCA9IHBhcnNlSW50KGhpbnRJZClcbiAgICAgICAgICBpZiAoaWQgPj0gMCAmJiBpZCA8IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmluZGV4ID0gaWRcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0U3VnZ2VzdGlvbihlZGl0b3IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICBpZiAoYWRkKSB2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrQ2FsbGJhY2spXG4gICAgZWxzZSB2aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrQ2FsbGJhY2spXG4gIH1cblxuICBwcml2YXRlIHNlbGVjdFN1Z2dlc3Rpb24oZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKVxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSB0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuc2VsZWN0ZWQuaW5kZXhdPy52YWx1ZVxuXG4gICAgaWYgKCFzZWxlY3RlZFZhbHVlKSB7XG4gICAgICB0aGlzLnJlbW92ZVZpZXdGcm9tKGVkaXRvcilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IHsgbm9ybWFsaXplZFZhbHVlLCBuZXdDdXJzb3JQb3NpdGlvbiB9ID0gbWFuYWdlUGxhY2Vob2xkZXJzKFxuICAgICAgc2VsZWN0ZWRWYWx1ZSxcbiAgICAgIHRoaXMuY3Vyc29yQXRUcmlnZ2VyIS5jaFxuICAgIClcblxuICAgIGVkaXRvci5vcGVyYXRpb24oKCkgPT4ge1xuICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShub3JtYWxpemVkVmFsdWUsIHRoaXMuY3Vyc29yQXRUcmlnZ2VyLCBjdXJzb3IpXG5cbiAgICAgIGNvbnN0IHVwZGF0ZWRDdXJzb3IgPSB7XG4gICAgICAgIGxpbmU6IGN1cnNvci5saW5lLFxuICAgICAgICBjaDogbmV3Q3Vyc29yUG9zaXRpb24sXG4gICAgICB9XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHVwZGF0ZWRDdXJzb3IpXG4gICAgfSlcbiAgICAvLyBOZWVkIHRvIHJlbW92ZSBpdCBoZXJlIGJlY2F1c2Ugb2YgZm9jdXNcbiAgICB0aGlzLnJlbW92ZVZpZXdGcm9tKGVkaXRvcilcbiAgICBlZGl0b3IuZm9jdXMoKVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkUHJvdmlkZXJzKCkge1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFtdXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZmxvd1Byb3ZpZGVyKSBwcm92aWRlcnMucHVzaChuZXcgRmxvd1Byb3ZpZGVyKCkpXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubGF0ZXhQcm92aWRlcikgcHJvdmlkZXJzLnB1c2gobmV3IExhVGV4UHJvdmlkZXIoKSlcblxuICAgIHRoaXMucHJvdmlkZXJzID0gcHJvdmlkZXJzXG4gIH1cbn1cbiIsImltcG9ydCB7IFRva2VuaXplU3RyYXRlZ3kgfSBmcm9tICdzcmMvcHJvdmlkZXJzL2Zsb3cvdG9rZW5pemVyJ1xuXG5leHBvcnQgY2xhc3MgQXV0b2NvbXBsZXRlU2V0dGluZ3Mge1xuICBlbmFibGVkOiBib29sZWFuID0gdHJ1ZVxuXG4gIGF1dG9TZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZVxuICBhdXRvVHJpZ2dlcjogYm9vbGVhbiA9IHRydWVcbiAgYXV0b1RyaWdnZXJNaW5TaXplOiBudW1iZXIgPSAzXG5cbiAgLypcbiAgICogVHJpZ2dlciBvbiBjdHJsLXAvbiBiaW5kaW5nc1xuICAgKi9cbiAgdHJpZ2dlckxpa2VWaW06IGJvb2xlYW4gPSBmYWxzZVxuXG4gIC8vIFRPRE86IFJlZmFjdG9yIHByb3ZpZGVyIHNldHRpbmdzXG4gIGxhdGV4UHJvdmlkZXI6IGJvb2xlYW4gPSBmYWxzZVxuICBmbG93UHJvdmlkZXI6IGJvb2xlYW4gPSB0cnVlXG4gIGZsb3dQcm92aWRlclNjYW5DdXJyZW50OiBib29sZWFuID0gdHJ1ZVxuICBmbG93UHJvdmlkZXJUb2tlbml6ZVN0cmF0ZWd5OiBUb2tlbml6ZVN0cmF0ZWd5ID0gJ2RlZmF1bHQnXG4gIGZsb3dXb3JkU2VwYXJhdG9yczogeyBbSyBpbiBUb2tlbml6ZVN0cmF0ZWd5XTogc3RyaW5nIH0gPSB7XG4gICAgZGVmYXVsdDogYH4/IUAjJCVeJiooKS09K1t7XX18OzonIFwiLC48Pi9gLFxuICAgIGFyYWJpYzogYH4/IUAjJCVeJiooKS09K1t7XX18OzonIFwiLC48Pi/YjNibYCxcbiAgICBqYXBhbmVzZTogYH4/IUAjJCVeJiooKS09K1t7XX18OzonIFwiLC48Pi9gLFxuICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIE5vdGljZSwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJ1xuaW1wb3J0IHtcbiAgVG9rZW5pemVTdHJhdGVneSxcbiAgVE9LRU5JWkVfU1RSQVRFR0lFUyxcbn0gZnJvbSAnc3JjL3Byb3ZpZGVycy9mbG93L3Rva2VuaXplcidcbmltcG9ydCBBdXRvY29tcGxldGVQbHVnaW4gZnJvbSAnLi4vbWFpbidcblxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZVNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIHBsdWdpbjogQXV0b2NvbXBsZXRlUGx1Z2luXG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogQXV0b2NvbXBsZXRlUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pXG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW5cbiAgfVxuXG4gIC8vIFRPRE86IFJlZmFjdG9yXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpc1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnRW5hYmxlZCcpXG4gICAgICAuc2V0RGVzYygnU2V0IHRoZSBhdXRvY29tcGxldGUgc3RhdGUnKVxuICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWQpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWQgPSB2YWx1ZVxuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKVxuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKVxuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQXV0byB0cmlnZ2VyJylcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICAnVHJpZ2dlciBhdXRvY29tcGxldGUgb24gcHJpbnRhYmxlIGtleXN0cm9rZSB0aGF0IGFyZSBub3Qgd29yZCBzZXBhcmF0b3JzJ1xuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9UcmlnZ2VyKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MudHJpZ2dlckxpa2VWaW0pXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyTGlrZVZpbSA9IGZhbHNlXG4gICAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9TZWxlY3QpXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvU2VsZWN0ID0gZmFsc2VcblxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9UcmlnZ2VyID0gdmFsdWVcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKClcblxuICAgICAgICAgIC8vIFJlbmRlciBhZ2FpblxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdBdXRvIHRyaWdnZXIgZnJvbSBuLXRoIGNoYXJhY3RlcicpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ1RyaWdnZXIgYXV0b2NvbXBsZXRlIG9ubHkgd2hlbiB0aGVyZSBhcmUgYXQgbGVhc3QgbiBjaGFyYWN0ZXJzIGluIHRoZSBsYXN0IHdvcmQnXG4gICAgICApXG4gICAgICAuYWRkRHJvcGRvd24oKGNiKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBbJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCddXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0KSA9PiBjYi5hZGRPcHRpb24ob3B0LCBvcHQpKVxuXG4gICAgICAgIGNvbnN0IG1pbkxlbmd0aCA9IFN0cmluZyh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvVHJpZ2dlck1pblNpemUpXG4gICAgICAgIGNiLnNldFZhbHVlKG1pbkxlbmd0aCkub25DaGFuZ2UoKHZhbCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvVHJpZ2dlcikge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b1RyaWdnZXJNaW5TaXplID0gTnVtYmVyKHZhbClcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKVxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoJ0Nhbm5vdCBjaGFuZ2UgYmVjYXVzZSBBdXRvIFRyaWdnZXIgaXMgbm90IGVuYWJsZWQuJylcbiAgICAgICAgICAgIGNiLnNldFZhbHVlKG1pbkxlbmd0aClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnQXV0byBzZWxlY3QnKVxuICAgICAgLnNldERlc2MoJ0F1dG8gc2VsZWN0IHN1Z2dlc3Rpb24gaWYgdGhlcmUgaXMgb25seSBvbmUnKVxuICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9TZWxlY3QpLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyTGlrZVZpbSlcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJMaWtlVmltID0gZmFsc2VcbiAgICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b1RyaWdnZXIpXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvVHJpZ2dlciA9IGZhbHNlXG5cbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvU2VsZWN0ID0gdmFsdWVcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKClcblxuICAgICAgICAgIC8vIFJlbmRlciBhZ2FpblxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdUcmlnZ2VyIGxpa2UgVmltIGF1dG9jb21wbGV0ZScpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ1VzZSBDVFJMLVAvTiBiaW5kaW5ncyB0byB0cmlnZ2VyIGF1dG9jb21wbGV0ZS4gQmUgYXdhcmUgb2Yga2V5YmluZGluZyBjbGFzaCBvbiBXaW5kb3dzIChjdHJsLW4pJ1xuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJMaWtlVmltKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuYXV0b1NlbGVjdClcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9TZWxlY3QgPSBmYWxzZVxuICAgICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hdXRvVHJpZ2dlcilcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmF1dG9UcmlnZ2VyID0gZmFsc2VcblxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJMaWtlVmltID0gdmFsdWVcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKClcblxuICAgICAgICAgIC8vIFJlbmRlciBhZ2FpblxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICAvLyBQcm92aWRlcnNcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdUZXh0IFByb3ZpZGVycycsIGNsczogJ3RleHQtbGVmdCcgfSlcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jywge1xuICAgICAgdGV4dDpcbiAgICAgICAgJ1RoZSBwcm92aWRlcnMgYmVsb3cgc3VnZ2VzdCBjb21wbGV0aW9ucyBiYXNlZCBvbiBpbnB1dC4gQmUgYXdhcmUgdGhhdCBlbmFibGluZyBtdWx0aXBsZSBwcm92aWRlcnMgY2FuIGRlY3JlYXNlIHBlcmZvcm1hbmNlJyxcbiAgICAgIGNsczogJ3NldHRpbmctaXRlbS1kZXNjcmlwdGlvbicsXG4gICAgfSlcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldENsYXNzKCduby1ib3JkZXItdG9wJylcbiAgICAgIC5zZXROYW1lKCdMYVRleCBQcm92aWRlcicpXG4gICAgICAuc2V0RGVzYygnVG9nZ2xlIExhVGV4IHN1Z2dlc3Rpb25zJylcbiAgICAgIC5hZGRUb2dnbGUoKGNiKSA9PlxuICAgICAgICBjYi5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5sYXRleFByb3ZpZGVyKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5sYXRleFByb3ZpZGVyID0gdmFsdWVcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKClcbiAgICAgICAgfSlcbiAgICAgIClcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ0Zsb3cgUHJvdmlkZXInKVxuICAgICAgLnNldERlc2MoJ0xlYXJucyBhcyB5b3UgdHlwZS4gRm9yIG5vdyBsaW1pdGVkIHRvIGN1cnJlbnQgc2Vzc2lvbicpXG4gICAgICAuc2V0SGVhZGluZygpXG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXRDbGFzcygnbm8tYm9yZGVyLXRvcCcpXG4gICAgICAuc2V0TmFtZSgnRW5hYmxlZCcpXG4gICAgICAuc2V0RGVzYygnRW5hYmxlIEZsb3cgUHJvdmlkZXInKVxuICAgICAgLmFkZFRvZ2dsZSgoY2IpID0+XG4gICAgICAgIGNiLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmZsb3dQcm92aWRlcikub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZmxvd1Byb3ZpZGVyID0gdmFsdWVcbiAgICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgLy8gU2NhbiBjdXJyZW50IGZpbGUgY2FuIGJlIGVuYWJsZWQgb25seSBpZiBmbG93IHByb3ZpZGVyIGlzXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mbG93UHJvdmlkZXJTY2FuQ3VycmVudCA9IGZhbHNlXG5cbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKClcblxuICAgICAgICAgIC8vIFJlbmRlciBhZ2FpblxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpXG4gICAgICAgIH0pXG4gICAgICApXG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTY2FuIGN1cnJlbnQgZmlsZScpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ1Byb3ZpZGVzIGN1cnJlbnQgZmlsZSB0ZXh0IHN1Z2dlc3Rpb25zLiBCZSBhd2FyZSBvZiBwZXJmb3JtYW5jZSBpc3N1ZXMgd2l0aCBsYXJnZSBmaWxlcy4nXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKChjYikgPT4ge1xuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgIGNiLnNldFZhbHVlKFxuICAgICAgICAgIHNldHRpbmdzLmZsb3dQcm92aWRlciAmJiBzZXR0aW5ncy5mbG93UHJvdmlkZXJTY2FuQ3VycmVudFxuICAgICAgICApLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIGlmIChzZXR0aW5ncy5mbG93UHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZsb3dQcm92aWRlclNjYW5DdXJyZW50ID0gdmFsdWVcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKVxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpXG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgLy8gQ2Fubm90IGVuYWJsZSBwbHVnaW5cbiAgICAgICAgICAgIGNiLnNldFZhbHVlKGZhbHNlKVxuICAgICAgICAgICAgbmV3IE5vdGljZSgnQ2Fubm90IGFjdGl2YXRlIGJlY2F1c2UgZmxvdyBwcm92aWRlciBpcyBub3QgZW5hYmxlZC4nKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlbmRlciBhZ2FpblxuICAgICAgICAgIHRoaXMuZGlzcGxheSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2NhbiBzdHJhdGVneScpXG4gICAgICAuc2V0RGVzYygnQ2hvb3NlIHRoZSBkZWZhdWx0IHNjYW4gc3RyYXRlZ3knKVxuICAgICAgLmFkZERyb3Bkb3duKChjYikgPT4ge1xuICAgICAgICAvLyBBZGQgb3B0aW9uc1xuICAgICAgICBUT0tFTklaRV9TVFJBVEVHSUVTLmZvckVhY2goKHN0cmF0ZWd5KSA9PiB7XG4gICAgICAgICAgY2IuYWRkT3B0aW9uKHN0cmF0ZWd5LCB0aGlzLmNhcGl0YWxpemUoc3RyYXRlZ3kpKVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3NcbiAgICAgICAgY2Iuc2V0VmFsdWUoc2V0dGluZ3MuZmxvd1Byb3ZpZGVyVG9rZW5pemVTdHJhdGVneSkub25DaGFuZ2UoXG4gICAgICAgICAgKHZhbHVlOiBUb2tlbml6ZVN0cmF0ZWd5KSA9PiB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZmxvd1Byb3ZpZGVyKSB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZsb3dQcm92aWRlclRva2VuaXplU3RyYXRlZ3kgPSB2YWx1ZVxuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncylcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXcgTm90aWNlKCdDYW5ub3QgY2hhbmdlIGJlY2F1c2UgZmxvdyBwcm92aWRlciBpcyBub3QgZW5hYmxlZC4nKVxuICAgICAgICAgICAgICBjYi5zZXRWYWx1ZShzZXR0aW5ncy5mbG93UHJvdmlkZXJUb2tlbml6ZVN0cmF0ZWd5KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfSlcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoJ1dvcmQgc2VwYXJhdG9ycycpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgJ0NoYW5nZSB3b3JkIHNlcGFyYXRvcnMgdG8gcGVyc29uYWxpemUgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9ucydcbiAgICAgIClcbiAgICBjb25zdCBzZXR0aW5ncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgY29uc3Qgd29yZFNlcGFyYXRvcnMgPSBzZXR0aW5ncy5mbG93V29yZFNlcGFyYXRvcnNcbiAgICBjb25zdCBzdHJhdGVnaWVzID0gT2JqZWN0LmtleXMod29yZFNlcGFyYXRvcnMpIGFzIFRva2VuaXplU3RyYXRlZ3lbXVxuICAgIHN0cmF0ZWdpZXMuZm9yRWFjaCgoc3RyYXRlZ3ksIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBzZXBhcmF0b3JzID0gd29yZFNlcGFyYXRvcnNbc3RyYXRlZ3ldXG4gICAgICBjb25zdCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpLnNldE5hbWUoXG4gICAgICAgIHRoaXMuY2FwaXRhbGl6ZShzdHJhdGVneSlcbiAgICAgIClcbiAgICAgIGlmIChpbmRleCA9PT0gMSkgc2V0dGluZy5zZXRDbGFzcygnbm8tYm9yZGVyLXRvcCcpXG4gICAgICBpZiAoc3RyYXRlZ3kgPT09ICdqYXBhbmVzZScpXG4gICAgICAgIHNldHRpbmcuc2V0RGVzYyhcbiAgICAgICAgICAnVXNlZCBvbmx5IHRvIHJlbW92ZSBmcm9tIHN1Z2dlc3Rpb25zLiBXb3JkIHNlcGFyYXRpb24gaXMgZG9uZSBieSBUb2tlbml6ZXInXG4gICAgICAgIClcblxuICAgICAgc2V0dGluZy5hZGRUZXh0KChjYikgPT4ge1xuICAgICAgICBjYi5zZXRWYWx1ZShzZXBhcmF0b3JzKS5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MuZmxvd1Byb3ZpZGVyKSB7XG4gICAgICAgICAgICBzZXR0aW5ncy5mbG93V29yZFNlcGFyYXRvcnNbc3RyYXRlZ3ldID0gdmFsdWVcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHNldHRpbmdzKVxuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoJ0Nhbm5vdCBjaGFuZ2UgYmVjYXVzZSBmbG93IHByb3ZpZGVyIGlzIG5vdCBlbmFibGVkLicpXG4gICAgICAgICAgICBjYi5zZXRWYWx1ZShzZXBhcmF0b3JzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNhcGl0YWxpemUgPSAodGV4dDogc3RyaW5nKSA9PlxuICAgIHRleHQucmVwbGFjZSgvXlxcdy8sIChjKSA9PiBjLnRvTG9jYWxlVXBwZXJDYXNlKCkpXG59XG4iLCJpbXBvcnQgeyBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbidcbmltcG9ydCB7XG4gIFRva2VuaXplU3RyYXRlZ3ksXG4gIFRPS0VOSVpFX1NUUkFURUdJRVMsXG59IGZyb20gJy4vcHJvdmlkZXJzL2Zsb3cvdG9rZW5pemVyJ1xuaW1wb3J0IHsgQXV0b2NvbXBsZXRlU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzL3NldHRpbmdzJ1xuXG5leHBvcnQgY2xhc3MgU3RhdHVzQmFyVmlldyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcGx1Z2luOiBQbHVnaW5cbiAgcHJpdmF0ZSBzZXR0aW5nczogQXV0b2NvbXBsZXRlU2V0dGluZ3NcblxuICBwcml2YXRlIHN0YXR1c0JhcjogSFRNTEVsZW1lbnRcblxuICBjb25zdHJ1Y3RvcihwbHVnaW46IFBsdWdpbiwgc2V0dGluZ3M6IEF1dG9jb21wbGV0ZVNldHRpbmdzKSB7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW5cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIGFkZFN0YXR1c0JhcigpIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZmxvd1Byb3ZpZGVyKSByZXR1cm5cblxuICAgIGNvbnN0IHN0YXR1c0JhciA9IHRoaXMucGx1Z2luLmFkZFN0YXR1c0Jhckl0ZW0oKVxuICAgIHN0YXR1c0Jhci5hZGRDbGFzcygnbW9kLWNsaWNrYWJsZScpXG4gICAgc3RhdHVzQmFyLmlubmVySFRNTCA9IHRoaXMuZ2V0U3RhdHVzQmFyVGV4dChcbiAgICAgIHRoaXMuc2V0dGluZ3MuZmxvd1Byb3ZpZGVyVG9rZW5pemVTdHJhdGVneVxuICAgIClcbiAgICBzdGF0dXNCYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uU3RhdHVzQmFyQ2xpY2spXG5cbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICB9XG5cbiAgcmVtb3ZlU3RhdHVzQmFyKCkge1xuICAgIGlmICghdGhpcy5zdGF0dXNCYXIpIHJldHVyblxuXG4gICAgdGhpcy5zdGF0dXNCYXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uU3RhdHVzQmFyQ2xpY2spXG4gICAgdGhpcy5zdGF0dXNCYXIucmVtb3ZlKClcbiAgfVxuXG4gIG9uU3RhdHVzQmFyQ2xpY2sgPSAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudFN0cmF0ZWd5ID0gdGhpcy5zZXR0aW5ncy5mbG93UHJvdmlkZXJUb2tlbml6ZVN0cmF0ZWd5XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gVE9LRU5JWkVfU1RSQVRFR0lFUy5maW5kSW5kZXgoXG4gICAgICAoc3RyYXRlZ3kpID0+IHN0cmF0ZWd5ID09PSBjdXJyZW50U3RyYXRlZ3lcbiAgICApXG4gICAgY29uc3QgbmV3U3RyYXRlZ3kgPVxuICAgICAgY3VycmVudEluZGV4ID09PSBUT0tFTklaRV9TVFJBVEVHSUVTLmxlbmd0aCAtIDFcbiAgICAgICAgPyBUT0tFTklaRV9TVFJBVEVHSUVTWzBdXG4gICAgICAgIDogVE9LRU5JWkVfU1RSQVRFR0lFU1tjdXJyZW50SW5kZXggKyAxXVxuXG4gICAgdGhpcy5zZXR0aW5ncy5mbG93UHJvdmlkZXJUb2tlbml6ZVN0cmF0ZWd5ID0gbmV3U3RyYXRlZ3lcbiAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKVxuXG4gICAgdGhpcy5zdGF0dXNCYXIuaW5uZXJIVE1MID0gdGhpcy5nZXRTdGF0dXNCYXJUZXh0KG5ld1N0cmF0ZWd5KVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRTdGF0dXNCYXJUZXh0KHN0cmF0ZWd5OiBUb2tlbml6ZVN0cmF0ZWd5KSB7XG4gICAgcmV0dXJuIGBzdHJhdGVneTogJHtzdHJhdGVneX1gXG4gIH1cbn1cbiIsImltcG9ydCB7IE1hcmtkb3duVmlldywgTm90aWNlLCBQbHVnaW4sIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nXG5pbXBvcnQgeyBBdXRvY29tcGxldGUgfSBmcm9tICcuL2F1dG9jb21wbGV0ZSdcbmltcG9ydCB7XG4gIGlzQXV0b1RyaWdnZXIsXG4gIGlzVmltTm9ybWFsTW9kZSxcbiAgaXNWaW1UcmlnZ2VyLFxufSBmcm9tICcuL2F1dG9jb21wbGV0ZS9jb3JlJ1xuaW1wb3J0IHsgVE9LRU5JWkVfU1RSQVRFR0lFUyB9IGZyb20gJy4vcHJvdmlkZXJzL2Zsb3cvdG9rZW5pemVyJ1xuaW1wb3J0IHsgQXV0b2NvbXBsZXRlU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzL3NldHRpbmdzJ1xuaW1wb3J0IHsgQXV0b2NvbXBsZXRlU2V0dGluZ3NUYWIgfSBmcm9tICcuL3NldHRpbmdzL3NldHRpbmdzLXRhYidcbmltcG9ydCB7IFN0YXR1c0JhclZpZXcgfSBmcm9tICcuL3N0YXR1c2JhcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b2NvbXBsZXRlUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgcHJpdmF0ZSBhdXRvY29tcGxldGU6IEF1dG9jb21wbGV0ZVxuICBwcml2YXRlIGxhc3RVc2VkRWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvclxuICBwcml2YXRlIGp1c3RUcmlnZ2VyZWRCeTogJ3ZpbScgfCAnYXV0b3RyaWdnZXInIHwgdW5kZWZpbmVkXG5cbiAgcHJpdmF0ZSBzdGF0dXNCYXI6IFN0YXR1c0JhclZpZXdcblxuICBzZXR0aW5nczogQXV0b2NvbXBsZXRlU2V0dGluZ3NcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coJ0xvYWRpbmcgQXV0b2NvbXBsZXRlIHBsdWdpbi4nKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKFxuICAgICAgbmV3IEF1dG9jb21wbGV0ZVNldHRpbmdzKCksXG4gICAgICBhd2FpdCB0aGlzLmxvYWREYXRhKClcbiAgICApXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBBdXRvY29tcGxldGVTZXR0aW5nc1RhYih0aGlzLmFwcCwgdGhpcykpXG5cbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZW5hYmxlZCkgcmV0dXJuXG5cbiAgICB0aGlzLnN0YXR1c0JhciA9IG5ldyBTdGF0dXNCYXJWaWV3KHRoaXMsIHRoaXMuc2V0dGluZ3MpXG4gICAgdGhpcy5lbmFibGUoKVxuICAgIHRoaXMuYWRkQ29tbWFuZHMoKVxuICB9XG5cbiAgYXN5bmMgb251bmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coJ1VubG9hZGVkIE9ic2lkaWFuIEF1dG9jb21wbGV0ZScpXG4gICAgdGhpcy5kaXNhYmxlKClcbiAgfVxuXG4gIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgdGhpcy5kaXNhYmxlKClcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cblxuICBwcml2YXRlIGFkZENvbW1hbmRzKCkge1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ2F1dG9jb21wbGV0ZS10b2dnbGUnLFxuICAgICAgbmFtZTogJ1RvZ2dsZSBBdXRvY29tcGxldGUnLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbJ0N0cmwnXSxcbiAgICAgICAgICBrZXk6ICcgJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZVxuICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldFZhbGlkRWRpdG9yRm9yKGF1dG9jb21wbGV0ZSlcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgLy8gRG8gbm90IG9wZW4gb24gdmltIG5vcm1hbCBtb2RlXG4gICAgICAgICAgaWYgKGlzVmltTm9ybWFsTW9kZShlZGl0b3IpKSByZXR1cm5cblxuICAgICAgICAgIGF1dG9jb21wbGV0ZS50b2dnbGVWaWV3SW4oZWRpdG9yKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZFNjYW5Db21tYW5kcygpXG4gIH1cblxuICBlbmFibGUoKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUgPSBuZXcgQXV0b2NvbXBsZXRlKHRoaXMuc2V0dGluZ3MpXG4gICAgdGhpcy5qdXN0VHJpZ2dlcmVkQnkgPSB1bmRlZmluZWRcblxuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmIChzZXR0aW5ncy5mbG93UHJvdmlkZXIpIHRoaXMuc3RhdHVzQmFyLmFkZFN0YXR1c0JhcigpXG4gICAgaWYgKHNldHRpbmdzLmZsb3dQcm92aWRlclNjYW5DdXJyZW50KSB7XG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtb3BlbicsIHRoaXMub25GaWxlT3BlbmVkLCB0aGlzKVxuXG4gICAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmxheW91dFJlYWR5KSB0aGlzLm9uTGF5b3V0UmVhZHkoKVxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKCdsYXlvdXQtcmVhZHknLCB0aGlzLm9uTGF5b3V0UmVhZHksIHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RlckNvZGVNaXJyb3IoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLm9uKCdrZXlkb3duJywgdGhpcy5rZXlEb3duTGlzdGVuZXIpXG4gICAgICBlZGl0b3Iub24oJ2tleXVwJywgdGhpcy5rZXlVcExpc3RlbmVyKVxuICAgIH0pXG4gIH1cblxuICBkaXNhYmxlKCkge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IHRoaXMuYXBwLndvcmtzcGFjZVxuICAgIC8vIEFsd2F5cyByZW1vdmUgdG8gYXZvaWQgYW55IGtpbmQgcHJvYmxlbVxuICAgIHdvcmtzcGFjZS5vZmYoJ2ZpbGUtb3BlbicsIHRoaXMub25GaWxlT3BlbmVkKVxuICAgIHdvcmtzcGFjZS5vZmYoJ2xheW91dC1yZWFkeScsIHRoaXMub25MYXlvdXRSZWFkeSlcblxuICAgIHRoaXMuc3RhdHVzQmFyLnJlbW92ZVN0YXR1c0JhcigpXG5cbiAgICB3b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKCdrZXl1cCcsIHRoaXMua2V5VXBMaXN0ZW5lcilcbiAgICAgIGNtLm9mZigna2V5ZG93bicsIHRoaXMua2V5RG93bkxpc3RlbmVyKVxuICAgICAgdGhpcy5hdXRvY29tcGxldGUucmVtb3ZlVmlld0Zyb20oY20pXG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYWRkU2NhbkNvbW1hbmRzKCkge1xuICAgIFRPS0VOSVpFX1NUUkFURUdJRVMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgY29uc3QgY2FwaXRhbGl6ZWQgPSB0eXBlLnJlcGxhY2UoL15cXHcvLCAoYykgPT4gYy50b0xvY2FsZVVwcGVyQ2FzZSgpKVxuICAgICAgY29uc3QgbmFtZSA9IGBTY2FuIGN1cnJlbnQgZmlsZSAke1xuICAgICAgICB0eXBlICE9PSAnZGVmYXVsdCcgPyBgKCR7Y2FwaXRhbGl6ZWR9KWAgOiAnJ1xuICAgICAgfWBcblxuICAgICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgICAgaWQ6IGBhdXRvY29tcGxldGUtc2Nhbi1jdXJyZW50LWZpbGUtJHt0eXBlfWAsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmZsb3dQcm92aWRlclNjYW5DdXJyZW50KSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKFxuICAgICAgICAgICAgICAnUGxlYXNlIGFjdGl2YXRlIHNldHRpbmcgZmxvdyBQcm92aWRlcjogU2NhbiBjdXJyZW50IGZpbGUnXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGVcbiAgICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmdldFZhbGlkRWRpdG9yRm9yKGF1dG9jb21wbGV0ZSlcblxuICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpXG4gICAgICAgICAgICBhdXRvY29tcGxldGUuc2NhbkZpbGUoZmlsZSwgdHlwZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBMaXN0ZW5lciB1c2VkIHRvIHRyaWdnZXIgYXV0b2NvbXBsZXRlXG4gICAqIEl0IGludGVyY2VwdHMgaW5wdXRzIHRoYXQgY291bGQgY2hhbmdlIHRoZSBjdXJyZW50IGxpbmUgKGUuZy4gY3RybCtuKVxuICAgKi9cbiAgcHJpdmF0ZSBrZXlEb3duTGlzdGVuZXIgPSAoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBldmVudDogS2V5Ym9hcmRFdmVudFxuICApID0+IHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZVxuICAgIGNvbnN0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGNvbnN0IGF1dG9TZWxlY3QgPSBzZXR0aW5ncy5hdXRvU2VsZWN0XG5cbiAgICBpZiAoXG4gICAgICBhdXRvY29tcGxldGUuaXNTaG93biAmJlxuICAgICAgYXV0b2NvbXBsZXRlLnRva2VuaXplci5pc1dvcmRTZXBhcmF0b3IoZXZlbnQua2V5KVxuICAgICkge1xuICAgICAgdGhpcy5hdXRvY29tcGxldGUucmVtb3ZlVmlld0Zyb20oZWRpdG9yKVxuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIGlmIChhdXRvY29tcGxldGUuaXNTaG93bikgcmV0dXJuXG5cbiAgICAvLyBUcmlnZ2VyIGxpa2UgVmltIGF1dG9jb21wbGV0ZSAoY3RybCtwL24pXG4gICAgaWYgKFxuICAgICAgaXNWaW1UcmlnZ2VyKHtcbiAgICAgICAgdHJpZ2dlckxpa2VWaW06IHNldHRpbmdzLnRyaWdnZXJMaWtlVmltLFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIGV2ZW50LFxuICAgICAgfSlcbiAgICApIHtcbiAgICAgIHRoaXMuanVzdFRyaWdnZXJlZEJ5ID0gJ3ZpbSdcblxuICAgICAgYXV0b2NvbXBsZXRlLnRvZ2dsZVZpZXdJbihlZGl0b3IsIHtcbiAgICAgICAgYXV0b1NlbGVjdCxcbiAgICAgICAgc2hvd0VtcHR5TWF0Y2g6ICFzZXR0aW5ncy5hdXRvVHJpZ2dlcixcbiAgICAgIH0pXG5cbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdwJykgYXV0b2NvbXBsZXRlLnNlbGVjdExhc3RTdWdnZXN0aW9uKClcbiAgICB9IGVsc2UgaWYgKGlzQXV0b1RyaWdnZXIoZWRpdG9yLCBldmVudCwgYXV0b2NvbXBsZXRlLnRva2VuaXplciwgc2V0dGluZ3MpKSB7XG4gICAgICB0aGlzLmp1c3RUcmlnZ2VyZWRCeSA9ICdhdXRvdHJpZ2dlcidcblxuICAgICAgYXV0b2NvbXBsZXRlLnRvZ2dsZVZpZXdJbihlZGl0b3IsIHtcbiAgICAgICAgYXV0b1NlbGVjdCxcbiAgICAgICAgc2hvd0VtcHR5TWF0Y2g6ICFzZXR0aW5ncy5hdXRvVHJpZ2dlcixcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogTGlzdGVuZXIgdXNlZCB0byBzY2FuIGN1cnJlbnQgd29yZFxuICAgKiBVcGRhdGVzIGF1dG9jb21wbGV0ZSByZXN1bHRzXG4gICAqL1xuICBwcml2YXRlIGtleVVwTGlzdGVuZXIgPSAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZVxuICAgIGF1dG9jb21wbGV0ZS51cGRhdGVQcm92aWRlcnNGcm9tKGV2ZW50LCBlZGl0b3IpXG5cbiAgICBpZiAoIWF1dG9jb21wbGV0ZS5pc1Nob3duKSByZXR1cm5cblxuICAgIHRoaXMudXBkYXRlRWRpdG9ySWZDaGFuZ2VkKGVkaXRvciwgYXV0b2NvbXBsZXRlKVxuXG4gICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgbGV0IHVwZGF0ZVNlbGVjdGVkID0gdHJ1ZVxuICAgIGlmIChcbiAgICAgIGlzVmltVHJpZ2dlcih7XG4gICAgICAgIHRyaWdnZXJMaWtlVmltOiBzZXR0aW5ncy50cmlnZ2VyTGlrZVZpbSxcbiAgICAgICAgZWRpdG9yLFxuICAgICAgICBldmVudCxcbiAgICAgIH0pICYmXG4gICAgICB0aGlzLmp1c3RUcmlnZ2VyZWRCeSA9PT0gJ3ZpbSdcbiAgICApIHtcbiAgICAgIC8vIERvIG5vdCB1cGRhdGUgc2VsZWN0ZWQgd2hlbiB0aGVyZSBpcyB2aW0gdHJpZ2dlclxuICAgICAgdXBkYXRlU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICh0aGlzLmp1c3RUcmlnZ2VyZWRCeSAhPT0gJ2F1dG90cmlnZ2VyJylcbiAgICAgIGF1dG9jb21wbGV0ZS51cGRhdGVWaWV3SW4oZWRpdG9yLCBldmVudCwge1xuICAgICAgICB1cGRhdGVTZWxlY3RlZCxcbiAgICAgICAgYXV0b1NlbGVjdDogc2V0dGluZ3MuYXV0b1NlbGVjdCxcbiAgICAgICAgc2hvd0VtcHR5TWF0Y2g6ICFzZXR0aW5ncy5hdXRvVHJpZ2dlcixcbiAgICAgIH0pXG5cbiAgICBpZiAodGhpcy5qdXN0VHJpZ2dlcmVkQnkpIHRoaXMuanVzdFRyaWdnZXJlZEJ5ID0gdW5kZWZpbmVkXG4gIH1cblxuICBwcml2YXRlIG9uTGF5b3V0UmVhZHkoKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKClcbiAgICBpZiAoZmlsZSkgdGhpcy5hdXRvY29tcGxldGUuc2NhbkZpbGUoZmlsZSlcbiAgfVxuXG4gIHByaXZhdGUgb25GaWxlT3BlbmVkKGZpbGU6IFRGaWxlKSB7XG4gICAgaWYgKGZpbGUpIHRoaXMuYXV0b2NvbXBsZXRlLnNjYW5GaWxlKGZpbGUpXG4gIH1cblxuICBwcml2YXRlIGdldFZhbGlkRWRpdG9yRm9yKFxuICAgIGF1dG9jb21wbGV0ZTogQXV0b2NvbXBsZXRlXG4gICk6IENvZGVNaXJyb3IuRWRpdG9yIHwgbnVsbCB7XG4gICAgY29uc3QgY3VycmVudEVkaXRvciA9IHRoaXMuZ2V0Q3VycmVudEVkaXRvcigpXG5cbiAgICBpZiAoY3VycmVudEVkaXRvcikgdGhpcy51cGRhdGVFZGl0b3JJZkNoYW5nZWQoY3VycmVudEVkaXRvciwgYXV0b2NvbXBsZXRlKVxuXG4gICAgcmV0dXJuIGN1cnJlbnRFZGl0b3JcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRWRpdG9ySWZDaGFuZ2VkKFxuICAgIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgYXV0b2NvbXBsZXRlOiBBdXRvY29tcGxldGVcbiAgKSB7XG4gICAgaWYgKCF0aGlzLmxhc3RVc2VkRWRpdG9yKSB0aGlzLmxhc3RVc2VkRWRpdG9yID0gZWRpdG9yXG5cbiAgICBpZiAoZWRpdG9yICE9PSB0aGlzLmxhc3RVc2VkRWRpdG9yKSB7XG4gICAgICBhdXRvY29tcGxldGUucmVtb3ZlVmlld0Zyb20odGhpcy5sYXN0VXNlZEVkaXRvcilcbiAgICAgIHRoaXMubGFzdFVzZWRFZGl0b3IgPSBlZGl0b3JcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEN1cnJlbnRFZGl0b3IoKTogQ29kZU1pcnJvci5FZGl0b3IgfCBudWxsIHtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KVxuXG4gICAgcmV0dXJuIHZpZXcgPyB2aWV3LnNvdXJjZU1vZGUuY21FZGl0b3IgOiBudWxsXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJTZXR0aW5nIiwiTm90aWNlIiwiUGx1Z2luU2V0dGluZ1RhYiIsIk1hcmtkb3duVmlldyIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBQ0Q7QUFDTyxJQUFJLFFBQVEsR0FBRyxXQUFXO0FBQ2pDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3JELFFBQVEsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0QsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekYsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLENBQUM7QUFDakIsTUFBSztBQUNMLElBQUksT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMzQyxFQUFDO0FBNEJEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUN6RixvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FB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RSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO0tBQ1IsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQTtJQUNwRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLElBQUk7S0FDVixDQUFBO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEtBQUs7S0FDWCxDQUFBO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsS0FBSztRQUNYLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztLQUNWLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQyxLQUFLO1FBQ1osRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsQ0FBQyxLQUFLO1FBQ1osRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEtBQUs7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztLQUNYLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixFQUFFLEVBQUUsR0FBRztRQUNQLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLENBQUMsR0FBRztRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxDQUFDLEdBQUc7UUFDUixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsRUFBRSxFQUFFLENBQUMsSUFBSTtRQUNULElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxJQUFJO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLElBQUk7UUFDUixFQUFFLEVBQUUsR0FBRztLQUNSLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFBO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO0tBQ1gsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxHQUFHO1FBQ1IsR0FBRyxFQUFFLEVBQUU7UUFDUCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztLQUNULENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxFQUFFO1FBQ1IsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFO0tBQ1YsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNsRSxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxJQUFJO1FBQ1gsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxJQUFJLEVBQUUsQ0FBQyxHQUFHO0tBQ1gsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsQ0FBQyxHQUFHO1FBQ1YsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7UUFDWCxJQUFJLEVBQUUsR0FBRztRQUNULElBQUksRUFBRSxDQUFDLEdBQUc7UUFDVixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLENBQUMsR0FBRztRQUNWLElBQUksRUFBRSxHQUFHO1FBQ1QsSUFBSSxFQUFFLENBQUMsSUFBSTtRQUNYLElBQUksRUFBRSxDQUFDLElBQUk7S0FDWixDQUFBO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDWCxDQUFBO0lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixLQUFLLEVBQUUsQ0FBQyxHQUFHO1FBQ1gsS0FBSyxFQUFFLENBQUMsR0FBRztRQUNYLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsR0FBRyxFQUFFLENBQUMsSUFBSTtLQUNYLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsS0FBSyxFQUFFLElBQUk7UUFDWCxLQUFLLEVBQUUsSUFBSTtRQUNYLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7UUFDWCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtLQUNWLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDL0MsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7SUFDbEUsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRztRQUNYLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO0tBQ1IsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUMzRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDekQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQTtJQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO0lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsRUFBRTtRQUNOLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDUCxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ1AsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsRUFBRSxFQUFFLEdBQUc7UUFDUCxFQUFFLEVBQUUsQ0FBQyxJQUFJO0tBQ1YsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFBO0lBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLEVBQUU7UUFDTixFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxDQUFDLElBQUk7UUFDVCxFQUFFLEVBQUUsSUFBSTtRQUNSLEVBQUUsRUFBRSxJQUFJO1FBQ1IsRUFBRSxFQUFFLEtBQUs7UUFDVCxFQUFFLEVBQUUsQ0FBQyxHQUFHO1FBQ1IsRUFBRSxFQUFFLENBQUMsSUFBSTtLQUNWLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxHQUFHLEVBQUUsQ0FBQyxHQUFHO1FBQ1QsR0FBRyxFQUFFLENBQUMsR0FBRztLQUNWLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsR0FBRztRQUNOLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztLQUNQLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixFQUFFLEVBQUUsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztLQUNQLENBQUE7SUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHO1FBQ1gsR0FBRyxFQUFFLElBQUk7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsQ0FBQyxFQUFFLElBQUk7UUFDUCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsS0FBSztRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxLQUFLO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixHQUFHLEVBQUUsQ0FBQyxJQUFJO1FBQ1YsQ0FBQyxFQUFFLENBQUMsS0FBSztRQUNULENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxHQUFHLEVBQUUsSUFBSTtRQUNULEdBQUcsRUFBRSxJQUFJO1FBQ1QsR0FBRyxFQUFFLENBQUMsSUFBSTtRQUNWLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxLQUFLO1FBQ1QsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO0tBQ1QsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsRUFBRSxFQUFFLENBQUMsS0FBSztRQUNWLEdBQUcsRUFBRSxDQUFDLElBQUk7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsRUFBRTtRQUNMLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxJQUFJO1FBQ1IsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsR0FBRyxFQUFFLENBQUMsR0FBRztRQUNULEVBQUUsRUFBRSxDQUFDLEtBQUs7UUFDVixHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO0tBQ1IsQ0FBQTtJQUNELElBQUksQ0FBQyxLQUFLLEdBQUc7UUFDWCxHQUFHLEVBQUUsR0FBRztRQUNSLEdBQUcsRUFBRSxHQUFHO1FBQ1IsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLEVBQUUsRUFBRSxHQUFHO1FBQ1AsR0FBRyxFQUFFLEdBQUc7UUFDUixHQUFHLEVBQUUsR0FBRztRQUNSLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLElBQUk7UUFDUixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsQ0FBQyxHQUFHO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsR0FBRztRQUNOLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLENBQUMsSUFBSTtRQUNSLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxHQUFHO1FBQ04sQ0FBQyxFQUFFLENBQUMsR0FBRztRQUNQLENBQUMsRUFBRSxJQUFJO1FBQ1AsQ0FBQyxFQUFFLEdBQUc7UUFDTixDQUFDLEVBQUUsSUFBSTtRQUNQLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDVCxFQUFFLEVBQUUsR0FBRztRQUNQLENBQUMsRUFBRSxDQUFDLEdBQUc7UUFDUCxDQUFDLEVBQUUsQ0FBQyxHQUFHO0tBQ1IsQ0FBQTtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVELGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRztJQUM1QyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDNUIsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDNUI7S0FDRjtJQUNELE9BQU8sR0FBRyxDQUFBO0FBQ1osQ0FBQyxDQUFBO0FBRUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxFQUFFO1FBQ0wsT0FBTyxDQUFDLENBQUE7S0FDVDtJQUNELE9BQU8sQ0FBQyxDQUFBO0FBQ1YsQ0FBQyxDQUFBO0FBRUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxLQUFLO0lBQy9DLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxFQUFFLEVBQUU7UUFDdEQsT0FBTyxFQUFFLENBQUE7S0FDVjtJQUNELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM1QixJQUFJLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDM0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN2QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDN0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzlCO0lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNmLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQTtJQUNaLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQTtJQUNaLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQTtJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3ZCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbkIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNuQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ25CLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDbkIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNuQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDckIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNyQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNyQixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3JCLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDakMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDakMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDakMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDakMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDakMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTs7UUFFM0MsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0QyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0MsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0MsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0MsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDM0MsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2hELEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNoRCxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDaEQsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNYLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxD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

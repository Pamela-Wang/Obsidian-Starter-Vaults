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
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

var _a = require('child_process'), spawn = _a.spawn; _a.Buffer; _a.ChildProcess;
var DEFAULT_SHORTCUTS = [
    {
        regex: '^trigger$',
        replacement: '## Example replacement\n- [ ] ',
    },
    {
        regex: '^now$',
        command: 'printf `date +%H:%M`',
    },
    {
        regex: '^py:',
        command: 'echo <text> | cut -c 4- | python3',
    },
    {
        regex: '^eval:',
        command: 'echo <text> | cut -c 6- | python3 -c \'print(eval(input()), end="")\'',
    },
    {
        regex: '^shell:',
        command: 'echo <text> | cut -c 7- | sh',
    },
    {
        regex: '^tool:',
        command: 'echo <text> | cut -c 6- | python3 <scripts_path>/tool.py',
    },
    {
        regex: '^sympy:',
        command: 'echo <text> | cut -c 7- | python3 <scripts_path>/sympy_tool.py',
    },
];
var DEFAULT_SETTINGS = {
    shortcuts: DEFAULT_SHORTCUTS,
    shell: '/bin/sh',
};
var TextExpanderPlugin = /** @class */ (function (_super) {
    __extends(TextExpanderPlugin, _super);
    function TextExpanderPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleSubprocessStdout = function (data) {
            if (_this.waiting) {
                _this.codemirrorEditor.replaceRange(data.toString(), { ch: _this.shortcutStart, line: _this.shortcutLine }, { ch: _this.shortcutEnd, line: _this.shortcutLine });
                _this.waiting = false;
            }
        };
        _this.handleSubprocessStderr = function (data) {
            new obsidian.Notice(data.toString());
        };
        _this.handleKeyDown = function (cm, event) {
            // const pattern = "{{[^{}]*}}";
            var patterns = [
                {
                    pattern: '{{(?:(?!{{|}}).)*?}}',
                    cut_start: 2,
                    cut_end: 2
                },
                {
                    pattern: ':[^\\s]*',
                    cut_start: 1,
                    cut_end: 0
                }
            ];
            for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
                var entry = patterns_1[_i];
                var pattern = entry.pattern;
                var regex = RegExp(pattern, 'g');
                if (event.key === 'Tab') {
                    var cursor = cm.getCursor();
                    var line = cursor.line;
                    var lineString = cm.getLine(line);
                    var match = void 0;
                    while ((match = regex.exec(lineString)) !== null) {
                        var start = match.index;
                        var end = match.index + match[0].length;
                        if (start <= cursor.ch && cursor.ch <= end) {
                            event.preventDefault();
                            // Commented out, as it caused error in case if shortcut commend
                            // did not write to stdout. Example: {{now}} won't work after {{shell:true}}
                            // if (this.waiting) {
                            // 	new Notice("Cannot process two shortcuts in parallel");
                            // 	return;
                            // }
                            _this.replaceShortcut(line, start, end, cm, entry);
                        }
                    }
                }
            }
        };
        return _this;
    }
    TextExpanderPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadSettings()];
                    case 1:
                        _a.sent();
                        this.addSettingTab(new TextExpanderSettingTab(this.app, this));
                        this.registerCodeMirror(function (codemirrorEditor) {
                            codemirrorEditor.on('keydown', _this.handleKeyDown);
                        });
                        this.spawnShell();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    TextExpanderPlugin.prototype.loadSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this;
                        _c = (_b = Object).assign;
                        _d = [DEFAULT_SETTINGS];
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = _c.apply(_b, _d.concat([_e.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.saveSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpanderPlugin.prototype.spawnShell = function () {
        this.child = spawn(this.settings.shell);
        this.child.stdin.setEncoding('utf-8');
        this.child.stdout.on('data', this.handleSubprocessStdout);
        this.child.stderr.on('data', this.handleSubprocessStderr);
        // this.child.on('close', (code: number) => {
        //   console.log(`child process closed all stdio with code ${code}`);
        //   this.spawnShell();
        // });
        // this.child.on('exit', (code: number) => {
        //   console.log(`child process exited with code ${code}`);
        //   this.spawnShell();
        // });
        // this.child.on('error', (err: Error) => {
        //   console.log(`child process: error ${err}`);
        //   this.spawnShell();
        // });
    };
    TextExpanderPlugin.prototype.replaceShortcut = function (line, start, end, cm, entry) {
        var _this = this;
        var content = cm.getRange({ line: line, ch: start + entry.cut_start }, { line: line, ch: end - entry.cut_end });
        this.settings.shortcuts.every(function (value) {
            var regex = RegExp(value.regex);
            if (regex.test(content)) {
                if (value.replacement) {
                    cm.replaceRange(value.replacement, { ch: start, line: line }, { ch: end, line: line });
                    return false;
                }
                if (value.command) {
                    _this.waiting = true;
                    _this.codemirrorEditor = cm;
                    _this.shortcutLine = line;
                    _this.shortcutStart = start;
                    _this.shortcutEnd = end;
                    var command = value.command;
                    var active_view = _this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (active_view === null) {
                        throw new Error('No active view found');
                    }
                    var vault_path = _this.app.vault.adapter.basePath;
                    var inner_path = active_view.file.parent.path;
                    var file_name = active_view.file.name;
                    var file_path = require('path').join(vault_path, inner_path, file_name);
                    var scripts_path = require('path').join(vault_path, '.obsidian', 'scripts');
                    command = replaceAll(command, '<text>', "'" + shellEscape(content) + "'");
                    command = replaceAll(command, '<text_raw>', content);
                    command = replaceAll(command, '<vault_path>', vault_path);
                    command = replaceAll(command, '<inner_path>', inner_path);
                    command = replaceAll(command, '<note_name>', file_name);
                    command = replaceAll(command, '<note_path>', file_path);
                    command = replaceAll(command, '<scripts_path>', scripts_path);
                    _this.child.stdin.write(command + '\n');
                    return false;
                }
            }
            return true;
        });
    };
    return TextExpanderPlugin;
}(obsidian.Plugin));
function shellEscape(cmd) {
    return replaceAll(cmd, "'", "'\"'\"'");
}
function replaceAll(s, search, replacement) {
    var regex = RegExp(search, 'g');
    return s.replace(regex, replacement);
}
var TextExpanderSettingTab = /** @class */ (function (_super) {
    __extends(TextExpanderSettingTab, _super);
    function TextExpanderSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    TextExpanderSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Shortcuts')
            .setDesc(this.shortcutsHelp())
            .addTextArea(function (text) {
            text
                .setPlaceholder(JSON.stringify(DEFAULT_SETTINGS, null, '\t'))
                .setValue(JSON.stringify(_this.plugin.settings.shortcuts, null, '\t'))
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.shortcuts = JSON.parse(value);
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            text.inputEl.rows = 20;
            text.inputEl.cols = 60;
            text.inputEl.style.fontFamily = 'monospace';
        });
        new obsidian.Setting(containerEl)
            .setName('Shell executable')
            .setDesc('All commands will be executed inside it.')
            .addText(function (text) {
            text
                .setPlaceholder(DEFAULT_SETTINGS.shell)
                .setValue(_this.plugin.settings.shell)
                .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.plugin.settings.shell = value;
                            this.plugin.spawnShell();
                            return [4 /*yield*/, this.plugin.saveSettings()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            text.inputEl.style.fontFamily = 'monospace';
        });
    };
    TextExpanderSettingTab.prototype.shortcutsHelp = function () {
        var descEl = document.createDocumentFragment();
        descEl.appendText('Are defined as a JSON-list. Fields:');
        descEl.createEl('br');
        descEl.createEl('b').innerText = 'regex';
        descEl.appendText(' (required) - trigger pattern');
        descEl.createEl('br');
        descEl.createEl('b').innerText = 'replacement';
        descEl.appendText(' (optional) - text replacement, used if provided');
        descEl.createEl('br');
        descEl.createEl('b').innerText = 'command';
        descEl.appendText(' (optional) - shell command whose stdout is used as a replacement');
        return descEl;
    };
    return TextExpanderSettingTab;
}(obsidian.PluginSettingTab));

module.exports = TextExpanderPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtcbiAgQXBwLFxuICBOb3RpY2UsXG4gIFBsdWdpbixcbiAgUGx1Z2luU2V0dGluZ1RhYixcbiAgU2V0dGluZyxcbiAgTWFya2Rvd25WaWV3LFxufSBmcm9tICdvYnNpZGlhbic7XG5cbmNvbnN0IHtzcGF3biwgQnVmZmVyLCBDaGlsZFByb2Nlc3N9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuXG5pbnRlcmZhY2UgU2hvcnRjdXRFbnRyeSB7XG4gIHJlZ2V4OiBzdHJpbmc7XG4gIGNvbW1hbmQ/OiBzdHJpbmc7XG4gIHJlcGxhY2VtZW50Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgVGV4dEV4cGFuZGVyUGx1Z2luU2V0dGluZ3Mge1xuICBzaG9ydGN1dHM6IEFycmF5PFNob3J0Y3V0RW50cnk+O1xuICBzaGVsbDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUGF0dGVybkVudHJ5IHtcbiAgcGF0dGVybjogc3RyaW5nO1xuICBjdXRfc3RhcnQ6IG51bWJlcjtcbiAgY3V0X2VuZDogbnVtYmVyO1xufVxuXG5jb25zdCBERUZBVUxUX1NIT1JUQ1VUUyA9IFtcbiAge1xuICAgIHJlZ2V4OiAnXnRyaWdnZXIkJyxcbiAgICByZXBsYWNlbWVudDogJyMjIEV4YW1wbGUgcmVwbGFjZW1lbnRcXG4tIFsgXSAnLFxuICB9LFxuICB7XG4gICAgcmVnZXg6ICdebm93JCcsXG4gICAgY29tbWFuZDogJ3ByaW50ZiBgZGF0ZSArJUg6JU1gJyxcbiAgfSxcbiAge1xuICAgIHJlZ2V4OiAnXnB5OicsXG4gICAgY29tbWFuZDogJ2VjaG8gPHRleHQ+IHwgY3V0IC1jIDQtIHwgcHl0aG9uMycsXG4gIH0sXG4gIHtcbiAgICByZWdleDogJ15ldmFsOicsXG4gICAgY29tbWFuZDpcbiAgICAgICdlY2hvIDx0ZXh0PiB8IGN1dCAtYyA2LSB8IHB5dGhvbjMgLWMgXFwncHJpbnQoZXZhbChpbnB1dCgpKSwgZW5kPVwiXCIpXFwnJyxcbiAgfSxcbiAge1xuICAgIHJlZ2V4OiAnXnNoZWxsOicsXG4gICAgY29tbWFuZDogJ2VjaG8gPHRleHQ+IHwgY3V0IC1jIDctIHwgc2gnLFxuICB9LFxuICB7XG4gICAgcmVnZXg6ICdedG9vbDonLFxuICAgIGNvbW1hbmQ6ICdlY2hvIDx0ZXh0PiB8IGN1dCAtYyA2LSB8IHB5dGhvbjMgPHNjcmlwdHNfcGF0aD4vdG9vbC5weScsXG4gIH0sXG4gIHtcbiAgICByZWdleDogJ15zeW1weTonLFxuICAgIGNvbW1hbmQ6ICdlY2hvIDx0ZXh0PiB8IGN1dCAtYyA3LSB8IHB5dGhvbjMgPHNjcmlwdHNfcGF0aD4vc3ltcHlfdG9vbC5weScsXG4gIH0sXG5dO1xuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBUZXh0RXhwYW5kZXJQbHVnaW5TZXR0aW5ncyA9IHtcbiAgc2hvcnRjdXRzOiBERUZBVUxUX1NIT1JUQ1VUUyxcbiAgc2hlbGw6ICcvYmluL3NoJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRFeHBhbmRlclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHNldHRpbmdzOiBUZXh0RXhwYW5kZXJQbHVnaW5TZXR0aW5ncztcblxuICBwcml2YXRlIGNvZGVtaXJyb3JFZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yO1xuXG4gIHByaXZhdGUgc2hvcnRjdXRMaW5lOiBudW1iZXI7XG4gIHByaXZhdGUgc2hvcnRjdXRTdGFydDogbnVtYmVyO1xuICBwcml2YXRlIHNob3J0Y3V0RW5kOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB3YWl0aW5nOiBCb29sZWFuO1xuICBwcml2YXRlIGNoaWxkOiB0eXBlb2YgQ2hpbGRQcm9jZXNzO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBUZXh0RXhwYW5kZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29kZU1pcnJvcigoY29kZW1pcnJvckVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcbiAgICAgIGNvZGVtaXJyb3JFZGl0b3Iub24oJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zcGF3blNoZWxsKCk7XG4gIH1cblxuICBvbnVubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZygndW5sb2FkaW5nIHBsdWdpbicpO1xuICB9XG5cbiAgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuXG4gIHNwYXduU2hlbGwoKSB7XG4gICAgdGhpcy5jaGlsZCA9IHNwYXduKHRoaXMuc2V0dGluZ3Muc2hlbGwpO1xuICAgIHRoaXMuY2hpbGQuc3RkaW4uc2V0RW5jb2RpbmcoJ3V0Zi04Jyk7XG4gICAgdGhpcy5jaGlsZC5zdGRvdXQub24oJ2RhdGEnLCB0aGlzLmhhbmRsZVN1YnByb2Nlc3NTdGRvdXQpO1xuICAgIHRoaXMuY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgdGhpcy5oYW5kbGVTdWJwcm9jZXNzU3RkZXJyKTtcblxuICAgIC8vIHRoaXMuY2hpbGQub24oJ2Nsb3NlJywgKGNvZGU6IG51bWJlcikgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coYGNoaWxkIHByb2Nlc3MgY2xvc2VkIGFsbCBzdGRpbyB3aXRoIGNvZGUgJHtjb2RlfWApO1xuICAgIC8vICAgdGhpcy5zcGF3blNoZWxsKCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB0aGlzLmNoaWxkLm9uKCdleGl0JywgKGNvZGU6IG51bWJlcikgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coYGNoaWxkIHByb2Nlc3MgZXhpdGVkIHdpdGggY29kZSAke2NvZGV9YCk7XG4gICAgLy8gICB0aGlzLnNwYXduU2hlbGwoKTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHRoaXMuY2hpbGQub24oJ2Vycm9yJywgKGVycjogRXJyb3IpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGBjaGlsZCBwcm9jZXNzOiBlcnJvciAke2Vycn1gKTtcbiAgICAvLyAgIHRoaXMuc3Bhd25TaGVsbCgpO1xuICAgIC8vIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVTdWJwcm9jZXNzU3Rkb3V0ID0gKGRhdGE6IEJ1ZmZlcik6IHZvaWQgPT4ge1xuICAgIGlmICh0aGlzLndhaXRpbmcpIHtcbiAgICAgIHRoaXMuY29kZW1pcnJvckVkaXRvci5yZXBsYWNlUmFuZ2UoXG4gICAgICAgIGRhdGEudG9TdHJpbmcoKSxcbiAgICAgICAge2NoOiB0aGlzLnNob3J0Y3V0U3RhcnQsIGxpbmU6IHRoaXMuc2hvcnRjdXRMaW5lfSxcbiAgICAgICAge2NoOiB0aGlzLnNob3J0Y3V0RW5kLCBsaW5lOiB0aGlzLnNob3J0Y3V0TGluZX1cbiAgICAgICk7XG4gICAgICB0aGlzLndhaXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVTdWJwcm9jZXNzU3RkZXJyID0gKGRhdGE6IEJ1ZmZlcik6IHZvaWQgPT4ge1xuICAgIG5ldyBOb3RpY2UoZGF0YS50b1N0cmluZygpKTtcbiAgfTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZUtleURvd24gPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGV2ZW50OiBLZXlib2FyZEV2ZW50XG4gICk6IHZvaWQgPT4ge1xuICAgIC8vIGNvbnN0IHBhdHRlcm4gPSBcInt7W157fV0qfX1cIjtcbiAgICBjb25zdCBwYXR0ZXJuczogQXJyYXk8UGF0dGVybkVudHJ5PiA9IFtcbiAgICAgIHtcbiAgICAgICAgcGF0dGVybjogJ3t7KD86KD8he3t8fX0pLikqP319JyxcbiAgICAgICAgY3V0X3N0YXJ0OiAyLFxuICAgICAgICBjdXRfZW5kOiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXR0ZXJuOiAnOlteXFxcXHNdKicsXG4gICAgICAgIGN1dF9zdGFydDogMSxcbiAgICAgICAgY3V0X2VuZDogMFxuICAgICAgfVxuICAgIF1cbiAgICBmb3IgKGxldCBlbnRyeSBvZiBwYXR0ZXJucykge1xuICAgICAgbGV0IHBhdHRlcm4gPSBlbnRyeS5wYXR0ZXJuO1xuICAgICAgY29uc3QgcmVnZXggPSBSZWdFeHAocGF0dGVybiwgJ2cnKTtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdUYWInKSB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGNtLmdldEN1cnNvcigpO1xuICAgICAgICBjb25zdCB7bGluZX0gPSBjdXJzb3I7XG4gICAgICAgIGNvbnN0IGxpbmVTdHJpbmcgPSBjbS5nZXRMaW5lKGxpbmUpO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSByZWdleC5leGVjKGxpbmVTdHJpbmcpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgY29uc3QgZW5kID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgaWYgKHN0YXJ0IDw9IGN1cnNvci5jaCAmJiBjdXJzb3IuY2ggPD0gZW5kKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy8gQ29tbWVudGVkIG91dCwgYXMgaXQgY2F1c2VkIGVycm9yIGluIGNhc2UgaWYgc2hvcnRjdXQgY29tbWVuZFxuICAgICAgICAgICAgLy8gZGlkIG5vdCB3cml0ZSB0byBzdGRvdXQuIEV4YW1wbGU6IHt7bm93fX0gd29uJ3Qgd29yayBhZnRlciB7e3NoZWxsOnRydWV9fVxuICAgICAgICAgICAgLy8gaWYgKHRoaXMud2FpdGluZykge1xuICAgICAgICAgICAgLy8gXHRuZXcgTm90aWNlKFwiQ2Fubm90IHByb2Nlc3MgdHdvIHNob3J0Y3V0cyBpbiBwYXJhbGxlbFwiKTtcbiAgICAgICAgICAgIC8vIFx0cmV0dXJuO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgdGhpcy5yZXBsYWNlU2hvcnRjdXQobGluZSwgc3RhcnQsIGVuZCwgY20sIGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmVwbGFjZVNob3J0Y3V0KFxuICAgIGxpbmU6IG51bWJlcixcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIGVuZDogbnVtYmVyLFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBlbnRyeTogUGF0dGVybkVudHJ5XG4gICkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBjbS5nZXRSYW5nZShcbiAgICAgIHtsaW5lOiBsaW5lLCBjaDogc3RhcnQgKyBlbnRyeS5jdXRfc3RhcnR9LFxuICAgICAge2xpbmU6IGxpbmUsIGNoOiBlbmQgLSBlbnRyeS5jdXRfZW5kfVxuICAgICk7XG5cbiAgICB0aGlzLnNldHRpbmdzLnNob3J0Y3V0cy5ldmVyeShcbiAgICAgICh2YWx1ZTogU2hvcnRjdXRFbnRyeSk6IEJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCByZWdleCA9IFJlZ0V4cCh2YWx1ZS5yZWdleCk7XG4gICAgICAgIGlmIChyZWdleC50ZXN0KGNvbnRlbnQpKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLnJlcGxhY2VtZW50KSB7XG4gICAgICAgICAgICBjbS5yZXBsYWNlUmFuZ2UoXG4gICAgICAgICAgICAgIHZhbHVlLnJlcGxhY2VtZW50LFxuICAgICAgICAgICAgICB7Y2g6IHN0YXJ0LCBsaW5lOiBsaW5lfSxcbiAgICAgICAgICAgICAge2NoOiBlbmQsIGxpbmU6IGxpbmV9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUuY29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy53YWl0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY29kZW1pcnJvckVkaXRvciA9IGNtO1xuICAgICAgICAgICAgdGhpcy5zaG9ydGN1dExpbmUgPSBsaW5lO1xuICAgICAgICAgICAgdGhpcy5zaG9ydGN1dFN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICB0aGlzLnNob3J0Y3V0RW5kID0gZW5kO1xuICAgICAgICAgICAgbGV0IGNvbW1hbmQgPSB2YWx1ZS5jb21tYW5kO1xuXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKFxuICAgICAgICAgICAgICBNYXJrZG93blZpZXdcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhY3RpdmUgdmlldyBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmF1bHRfcGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuYmFzZVBhdGg7XG4gICAgICAgICAgICBjb25zdCBpbm5lcl9wYXRoID0gYWN0aXZlX3ZpZXcuZmlsZS5wYXJlbnQucGF0aDtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVfbmFtZSA9IGFjdGl2ZV92aWV3LmZpbGUubmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVfcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKS5qb2luKFxuICAgICAgICAgICAgICB2YXVsdF9wYXRoLFxuICAgICAgICAgICAgICBpbm5lcl9wYXRoLFxuICAgICAgICAgICAgICBmaWxlX25hbWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzX3BhdGggPSByZXF1aXJlKCdwYXRoJykuam9pbihcbiAgICAgICAgICAgICAgdmF1bHRfcGF0aCxcbiAgICAgICAgICAgICAgJy5vYnNpZGlhbicsXG4gICAgICAgICAgICAgICdzY3JpcHRzJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbW1hbmQgPSByZXBsYWNlQWxsKFxuICAgICAgICAgICAgICBjb21tYW5kLFxuICAgICAgICAgICAgICAnPHRleHQ+JyxcbiAgICAgICAgICAgICAgXCInXCIgKyBzaGVsbEVzY2FwZShjb250ZW50KSArIFwiJ1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29tbWFuZCA9IHJlcGxhY2VBbGwoY29tbWFuZCwgJzx0ZXh0X3Jhdz4nLCBjb250ZW50KTtcbiAgICAgICAgICAgIGNvbW1hbmQgPSByZXBsYWNlQWxsKGNvbW1hbmQsICc8dmF1bHRfcGF0aD4nLCB2YXVsdF9wYXRoKTtcbiAgICAgICAgICAgIGNvbW1hbmQgPSByZXBsYWNlQWxsKGNvbW1hbmQsICc8aW5uZXJfcGF0aD4nLCBpbm5lcl9wYXRoKTtcbiAgICAgICAgICAgIGNvbW1hbmQgPSByZXBsYWNlQWxsKGNvbW1hbmQsICc8bm90ZV9uYW1lPicsIGZpbGVfbmFtZSk7XG4gICAgICAgICAgICBjb21tYW5kID0gcmVwbGFjZUFsbChjb21tYW5kLCAnPG5vdGVfcGF0aD4nLCBmaWxlX3BhdGgpO1xuICAgICAgICAgICAgY29tbWFuZCA9IHJlcGxhY2VBbGwoY29tbWFuZCwgJzxzY3JpcHRzX3BhdGg+Jywgc2NyaXB0c19wYXRoKTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGQuc3RkaW4ud3JpdGUoY29tbWFuZCArICdcXG4nKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzaGVsbEVzY2FwZShjbWQ6IHN0cmluZykge1xuICByZXR1cm4gcmVwbGFjZUFsbChjbWQsIFwiJ1wiLCBcIidcXFwiJ1xcXCInXCIpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlQWxsKHM6IHN0cmluZywgc2VhcmNoOiBzdHJpbmcsIHJlcGxhY2VtZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgcmVnZXggPSBSZWdFeHAoc2VhcmNoLCAnZycpO1xuICByZXR1cm4gcy5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudCk7XG59XG5cbmNsYXNzIFRleHRFeHBhbmRlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgcGx1Z2luOiBUZXh0RXhwYW5kZXJQbHVnaW47XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGV4dEV4cGFuZGVyUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKCdTaG9ydGN1dHMnKVxuICAgICAgLnNldERlc2ModGhpcy5zaG9ydGN1dHNIZWxwKCkpXG4gICAgICAuYWRkVGV4dEFyZWEodGV4dCA9PiB7XG4gICAgICAgIHRleHRcbiAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoSlNPTi5zdHJpbmdpZnkoREVGQVVMVF9TRVRUSU5HUywgbnVsbCwgJ1xcdCcpKVxuICAgICAgICAgIC5zZXRWYWx1ZShKU09OLnN0cmluZ2lmeSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG9ydGN1dHMsIG51bGwsICdcXHQnKSlcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvcnRjdXRzID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdGV4dC5pbnB1dEVsLnJvd3MgPSAyMDtcbiAgICAgICAgdGV4dC5pbnB1dEVsLmNvbHMgPSA2MDtcbiAgICAgICAgdGV4dC5pbnB1dEVsLnN0eWxlLmZvbnRGYW1pbHkgPSAnbW9ub3NwYWNlJztcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU2hlbGwgZXhlY3V0YWJsZScpXG4gICAgICAuc2V0RGVzYygnQWxsIGNvbW1hbmRzIHdpbGwgYmUgZXhlY3V0ZWQgaW5zaWRlIGl0LicpXG4gICAgICAuYWRkVGV4dCh0ZXh0ID0+IHtcbiAgICAgICAgdGV4dFxuICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihERUZBVUxUX1NFVFRJTkdTLnNoZWxsKVxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbClcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGwgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMucGx1Z2luLnNwYXduU2hlbGwoKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0ZXh0LmlucHV0RWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNob3J0Y3V0c0hlbHAoKTogRG9jdW1lbnRGcmFnbWVudCB7XG4gICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGRlc2NFbC5hcHBlbmRUZXh0KCdBcmUgZGVmaW5lZCBhcyBhIEpTT04tbGlzdC4gRmllbGRzOicpO1xuICAgIGRlc2NFbC5jcmVhdGVFbCgnYnInKTtcbiAgICBkZXNjRWwuY3JlYXRlRWwoJ2InKS5pbm5lclRleHQgPSAncmVnZXgnO1xuICAgIGRlc2NFbC5hcHBlbmRUZXh0KCcgKHJlcXVpcmVkKSAtIHRyaWdnZXIgcGF0dGVybicpO1xuICAgIGRlc2NFbC5jcmVhdGVFbCgnYnInKTtcbiAgICBkZXNjRWwuY3JlYXRlRWwoJ2InKS5pbm5lclRleHQgPSAncmVwbGFjZW1lbnQnO1xuICAgIGRlc2NFbC5hcHBlbmRUZXh0KCcgKG9wdGlvbmFsKSAtIHRleHQgcmVwbGFjZW1lbnQsIHVzZWQgaWYgcHJvdmlkZWQnKTtcbiAgICBkZXNjRWwuY3JlYXRlRWwoJ2JyJyk7XG4gICAgZGVzY0VsLmNyZWF0ZUVsKCdiJykuaW5uZXJUZXh0ID0gJ2NvbW1hbmQnO1xuICAgIGRlc2NFbC5hcHBlbmRUZXh0KFxuICAgICAgJyAob3B0aW9uYWwpIC0gc2hlbGwgY29tbWFuZCB3aG9zZSBzdGRvdXQgaXMgdXNlZCBhcyBhIHJlcGxhY2VtZW50J1xuICAgICk7XG4gICAgcmV0dXJuIGRlc2NFbDtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5vdGljZSIsIk1hcmtkb3duVmlldyIsIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUks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

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

var DiscordianPlugin = /** @class */ (function (_super) {
    __extends(DiscordianPlugin, _super);
    function DiscordianPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // refresh function for when we change settings
        _this.refresh = function () {
            // re-load the style
            _this.updateStyle();
        };
        return _this;
    }
    DiscordianPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || {
                            hideVault: true,
                            hideTitleBar: true,
                            hideStatusBar: true,
                            originalMarkings: false,
                            relationLinesPreview: true,
                            prettyTasksEditor: true,
                            darkEnhance: false,
                            fontSizeNotes: 14,
                            fontSizeFileExplorer: 14,
                            writerMode: false,
                            paragraphFocusMode: false,
                            paragraphFocusFade: 75,
                            flatAndyMode: true,
                            readableLength: 45
                        };
                        this.addSettingTab(new DiscordianPluginSettingsTab(this.app, this));
                        this.addStyle();
                        this.addCommands();
                        this.refresh();
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordianPlugin.prototype.onunload = function () {
        this.removeStyle();
    };
    DiscordianPlugin.prototype.addCommands = function () {
        var _this = this;
        this.addCommand({
            id: 'toggle-discordian-writer-mode',
            name: 'Toggle Writer Mode',
            callback: function () {
                _this.settings.writerMode = !_this.settings.writerMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-flat-andy-mode',
            name: 'Toggle Flat Andy Mode',
            callback: function () {
                _this.settings.flatAndyMode = !_this.settings.flatAndyMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-paragraph-focus-mode',
            name: 'Toggle Paragraph Focus Mode',
            callback: function () {
                _this.settings.paragraphFocusMode = !_this.settings.paragraphFocusMode;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-discord-original-markings',
            name: 'Toggle Discord original markings',
            callback: function () {
                _this.settings.originalMarkings = !_this.settings.originalMarkings;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-relationship-lines-preview',
            name: 'Toggle relationship lines in Preview mode',
            callback: function () {
                _this.settings.relationLinesPreview = !_this.settings.relationLinesPreview;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-pretty-tasks-preview',
            name: 'Toggle Pretty Task Lists in Editor mode',
            callback: function () {
                _this.settings.prettyTasksEditor = !_this.settings.prettyTasksEditor;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
        this.addCommand({
            id: 'toggle-dark-enhance',
            name: 'Toggle Dark note headers',
            callback: function () {
                _this.settings.darkEnhance = !_this.settings.darkEnhance;
                _this.saveData(_this.settings);
                _this.refresh();
            }
        });
    };
    // add the styling elements we need
    DiscordianPlugin.prototype.addStyle = function () {
        // add a css block for our settings-dependent styles
        var css = document.createElement('style');
        css.id = 'discordian-theme';
        document.getElementsByTagName("head")[0].appendChild(css);
        // add the main class
        document.body.classList.add('discordian-theme');
        document.body.classList.add('discordian-readable-length');
        document.body.classList.add('discordian-paragraph-focus-fade');
        // update the style with the settings-dependent styles
        this.updateStyle();
    };
    DiscordianPlugin.prototype.removeStyle = function () {
        var discordianClasses = [
            'discordian-theme',
            'discordian-writer-mode',
            'discordian-flat-andy-mode',
            'discordian-paragraph-focus',
            'discordian-paragraph-focus-fade',
            'discordian-readable-length',
            'discordian-font-size-notes',
            'discordian-font-size-file-explorer',
            'discordian-discord-markings',
            'discordian-rel-preview',
            'discordian-pretty-tasks-editor',
            'discordian-dark-enhance',
            'discordian-hide-vault',
            'discordian-hide-titlebar',
            'discordian-hide-statusbar'
        ];
        document.body.removeClasses(discordianClasses);
    };
    DiscordianPlugin.prototype.initStyles = function () {
        var discordianEl = document.getElementById('discordian-theme');
        if (discordianEl) {
            var len = this.settings.readableLength + 'rem';
            var fade = 100 - this.settings.paragraphFocusFade;
            var fontSizeNotes = this.settings.fontSizeNotes / 16 + 'rem';
            var fontSizeFileExplorer = this.settings.fontSizeFileExplorer / 16 + 'rem';
            var letterSpacingNotes = (this.settings.fontSizeNotes < 16 ? -0.2 : -0.4) + 'px';
            discordianEl.innerText = "\n                    body.discordian-theme {\n                        --readable-line-length:" + len + ";\n                        --paragraph-focus-fade: 0." + fade + ";\n                        --font-size-notes: " + fontSizeNotes + ";\n                        --font-size-file-explorer: " + fontSizeFileExplorer + ";\n                        --letter-spacing-notes: " + letterSpacingNotes + ";\n                    }\n                ";
        }
        else {
            throw "Could not find Discordian Theme";
        }
    };
    // update the styles (at the start, or as the result of a settings change)
    DiscordianPlugin.prototype.updateStyle = function () {
        document.body.classList.toggle('discordian-writer-mode', this.settings.writerMode);
        document.body.classList.toggle('discordian-flat-andy-mode', this.settings.flatAndyMode);
        document.body.classList.toggle('discordian-paragraph-focus', this.settings.paragraphFocusMode);
        document.body.classList.toggle('discordian-hide-vault', this.settings.hideVault);
        document.body.classList.toggle('discordian-hide-titlebar', this.settings.hideTitleBar);
        document.body.classList.toggle('discordian-hide-statusbar', this.settings.hideStatusBar);
        document.body.classList.toggle('discordian-original-markings', this.settings.originalMarkings);
        document.body.classList.toggle('discordian-rel-preview', this.settings.relationLinesPreview);
        document.body.classList.toggle('discordian-pretty-tasks-editor', this.settings.prettyTasksEditor);
        document.body.classList.toggle('discordian-dark-enhance', this.settings.darkEnhance);
        this.initStyles();
    };
    return DiscordianPlugin;
}(obsidian.Plugin));
var DiscordianPluginSettingsTab = /** @class */ (function (_super) {
    __extends(DiscordianPluginSettingsTab, _super);
    function DiscordianPluginSettingsTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    DiscordianPluginSettingsTab.prototype.display = function () {
        var containerEl = this.containerEl;
        var settings = this.plugin.settings;
        containerEl.empty();
        this.addPluginDescription(containerEl);
        this.addPluginSettingsHeader(containerEl, 'Theme Settings');
        this.addWriterModeSettings(containerEl, settings);
        this.addFlatAndyModeSettings(containerEl, settings);
        this.addParagraphFocusModeSettings(containerEl, settings);
        this.addReadableLengthSettings(containerEl, settings);
        this.addOriginalMarkingsSettings(containerEl, settings);
        this.addRelationLinesPreviewSettings(containerEl, settings);
        this.addPrettyTasksEditorSettings(containerEl, settings);
        this.addDarkEnhanceSettings(containerEl, settings);
        this.addPluginSettingsSeparator(containerEl);
        this.addPluginSettingsHeader(containerEl, 'Fonts');
        this.addNotesFontSizeSettings(containerEl, settings);
        this.addFileExplorerFontSizeSettings(containerEl, settings);
        this.addPluginSettingsSeparator(containerEl);
        this.addPluginSettingsHeader(containerEl, 'If not using Hider plugin');
        this.addHideVaultSettings(containerEl, settings);
        this.addHideTitleBarSettings(containerEl, settings);
        this.addHideStatusBarSettings(containerEl, settings);
    };
    DiscordianPluginSettingsTab.prototype.addPluginDescription = function (containerEl) {
        var description = containerEl.createEl('div', { cls: 'plugin-description' });
        description.createEl('h3', { text: 'Thanks for using Discordian !' });
        description.createEl('p', { text: 'If you notice any issues, try to update to the latest version and reload Obsidian.' });
        description.createEl('p', { text: 'Otherwise feel free to bring it up on Github or better yet contribute a fix.' });
        description.createEl('a', {
            text: 'https://github.com/radekkozak/discordian/issues/',
            attr: { 'href': 'https://github.com/radekkozak/discordian/issues/', 'target': '_blank' }
        });
    };
    DiscordianPluginSettingsTab.prototype.addPluginSettingsHeader = function (containerEl, headerTitle) {
        containerEl.createEl('h4', { text: headerTitle });
    };
    DiscordianPluginSettingsTab.prototype.addPluginSettingsSeparator = function (containerEl) {
        containerEl.createEl('p', { text: '⊷', cls: 'plugin-description separator' });
    };
    DiscordianPluginSettingsTab.prototype.addWriterModeSettings = function (containerEl, settings) {
        var _this = this;
        var description = new DocumentFragment();
        description.appendText('Hides visual excess when sidebars are collapsed (accessible by hover)');
        description.createEl('br');
        description.appendText('NOTE : this setting will hide Status bar and Title bar ' +
            'regardless of their individual options');
        new obsidian.Setting(containerEl)
            .setName('Writer mode')
            .setDesc(description)
            .addToggle(function (toggle) { return toggle.setValue(settings.writerMode)
            .onChange(function (value) {
            settings.writerMode = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addFlatAndyModeSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Flat Andy Mode')
            .setDesc('Flatter notes stacking when in Andy Mode (no elevation shadow)')
            .addToggle(function (toggle) { return toggle.setValue(settings.flatAndyMode)
            .onChange(function (value) {
            settings.flatAndyMode = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addParagraphFocusModeSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Paragraph focus mode')
            .setDesc('This aims to imitate well-known iA Writer paragraph focus.')
            .addToggle(function (toggle) { return toggle.setValue(settings.paragraphFocusMode)
            .onChange(function (value) {
            settings.paragraphFocusMode = value;
            _this.plugin.saveData(settings);
            setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !value);
            _this.plugin.refresh();
        }); });
        var nameFade = 'Paragraph Focus Mode fade ';
        var setting = new obsidian.Setting(containerEl)
            .setName(nameFade + '( = ' + settings.paragraphFocusFade + '% )')
            .setDesc('Amount of fade out when in Paragraph Focus Mode (default 75%)')
            .addSlider(function (slider) { return slider.setLimits(25, 90, 5)
            .setValue(settings.paragraphFocusFade)
            .onChange(function (value) {
            settings.paragraphFocusFade = value;
            setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !value);
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(nameFade + '( = ' + settings.paragraphFocusFade + '% )');
        }); });
        setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', !settings.paragraphFocusMode);
    };
    DiscordianPluginSettingsTab.prototype.addReadableLengthSettings = function (containerEl, settings) {
        var _this = this;
        var readableLineLength = document.getElementsByClassName('is-readable-line-width');
        var name = 'Readable line length ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.readableLength + 'rem )')
            .setDesc('Obsidian\'s Readable line length needs to be enabled (default 45 rem)')
            .addSlider(function (slider) { return slider.setLimits(45, 120, 5)
            .setValue(settings.readableLength)
            .onChange(function (value) {
            settings.readableLength = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + settings.readableLength + 'rem )');
        }); });
        setting.settingEl.classList.toggle('discordian-plugin-setting-disabled', readableLineLength.length == 0);
    };
    DiscordianPluginSettingsTab.prototype.addOriginalMarkingsSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Discord original markings')
            .setDesc('Use Discord original markings such as bold, italics, inline code, quotes and so on')
            .addToggle(function (toggle) { return toggle.setValue(settings.originalMarkings)
            .onChange(function (value) {
            settings.originalMarkings = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addDarkEnhanceSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Dark note headers')
            .setDesc('Make note headers more prominent')
            .addToggle(function (toggle) { return toggle.setValue(settings.darkEnhance)
            .onChange(function (value) {
            settings.darkEnhance = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addRelationLinesPreviewSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Relationship lines in Preview mode')
            .setDesc('Show lines connecting related bullet points and task lists')
            .addToggle(function (toggle) { return toggle.setValue(settings.relationLinesPreview)
            .onChange(function (value) {
            settings.relationLinesPreview = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addPrettyTasksEditorSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Pretty Task Lists in Editor mode')
            .setDesc("HACKISH : please use both 'Smart indent lists' and 'Use tabs' options for best experience")
            .addToggle(function (toggle) { return toggle.setValue(settings.prettyTasksEditor)
            .onChange(function (value) {
            settings.prettyTasksEditor = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addNotesFontSizeSettings = function (containerEl, settings) {
        var _this = this;
        var name = 'Notes font size ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.fontSizeNotes + 'px )')
            .setDesc('Used in editor/preview mode (default 14px)')
            .addSlider(function (slider) { return slider.setLimits(14, 22, 2)
            .setValue(settings.fontSizeNotes)
            .onChange(function (value) {
            settings.fontSizeNotes = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + value + 'px )');
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addFileExplorerFontSizeSettings = function (containerEl, settings) {
        var _this = this;
        var name = 'File Explorer font size ';
        var setting = new obsidian.Setting(containerEl)
            .setName(name + '( = ' + settings.fontSizeFileExplorer + 'px )')
            .setDesc('Used in File Explorer (default 14px)')
            .addSlider(function (slider) { return slider.setLimits(12, 18, 2)
            .setValue(settings.fontSizeFileExplorer)
            .onChange(function (value) {
            settings.fontSizeFileExplorer = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
            setting.setName(name + '( = ' + value + 'px )');
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideVaultSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide vault name')
            .setDesc('Hides vault name in File Explorer')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideVault)
            .onChange(function (value) {
            settings.hideVault = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideTitleBarSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide title bar')
            .setDesc('Hides main title bar (theme\'s default)')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideTitleBar)
            .onChange(function (value) {
            settings.hideTitleBar = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    DiscordianPluginSettingsTab.prototype.addHideStatusBarSettings = function (containerEl, settings) {
        var _this = this;
        new obsidian.Setting(containerEl)
            .setName('Hide status bar')
            .setDesc('Hides status bar (theme\'s default)')
            .addToggle(function (toggle) { return toggle.setValue(settings.hideStatusBar)
            .onChange(function (value) {
            settings.hideStatusBar = value;
            _this.plugin.saveData(settings);
            _this.plugin.refresh();
        }); });
    };
    return DiscordianPluginSettingsTab;
}(obsidian.PluginSettingTab));

module.exports = DiscordianPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImltcG9ydCB7QXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmd9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzY29yZGlhblBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBzZXR0aW5nczogRGlzY29yZGlhblBsdWdpblNldHRpbmdzO1xyXG5cclxuICAgIGFzeW5jIG9ubG9hZCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IGF3YWl0IHRoaXMubG9hZERhdGEoKSB8fCB7XHJcbiAgICAgICAgICAgIGhpZGVWYXVsdDogdHJ1ZSxcclxuICAgICAgICAgICAgaGlkZVRpdGxlQmFyOiB0cnVlLFxyXG4gICAgICAgICAgICBoaWRlU3RhdHVzQmFyOiB0cnVlLFxyXG4gICAgICAgICAgICBvcmlnaW5hbE1hcmtpbmdzOiBmYWxzZSxcclxuICAgICAgICAgICAgcmVsYXRpb25MaW5lc1ByZXZpZXc6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXR0eVRhc2tzRWRpdG9yOiB0cnVlLFxyXG4gICAgICAgICAgICBkYXJrRW5oYW5jZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGZvbnRTaXplTm90ZXM6IDE0LFxyXG4gICAgICAgICAgICBmb250U2l6ZUZpbGVFeHBsb3JlcjogMTQsXHJcbiAgICAgICAgICAgIHdyaXRlck1vZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJhZ3JhcGhGb2N1c01vZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBwYXJhZ3JhcGhGb2N1c0ZhZGU6IDc1LFxyXG4gICAgICAgICAgICBmbGF0QW5keU1vZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlYWRhYmxlTGVuZ3RoOiA0NVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgRGlzY29yZGlhblBsdWdpblNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkU3R5bGUoKVxyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmRzKClcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcclxuICAgIH1cclxuXHJcbiAgICBvbnVubG9hZCgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZVN0eWxlKClcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb21tYW5kcygpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6ICd0b2dnbGUtZGlzY29yZGlhbi13cml0ZXItbW9kZScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdUb2dnbGUgV3JpdGVyIE1vZGUnLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy53cml0ZXJNb2RlID0gIXRoaXMuc2V0dGluZ3Mud3JpdGVyTW9kZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogJ3RvZ2dsZS1mbGF0LWFuZHktbW9kZScsXHJcbiAgICAgICAgICAgIG5hbWU6ICdUb2dnbGUgRmxhdCBBbmR5IE1vZGUnLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5mbGF0QW5keU1vZGUgPSAhdGhpcy5zZXR0aW5ncy5mbGF0QW5keU1vZGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6ICd0b2dnbGUtcGFyYWdyYXBoLWZvY3VzLW1vZGUnLFxyXG4gICAgICAgICAgICBuYW1lOiAnVG9nZ2xlIFBhcmFncmFwaCBGb2N1cyBNb2RlJyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNNb2RlID0gIXRoaXMuc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNNb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XHJcbiAgICAgICAgICAgIGlkOiAndG9nZ2xlLWRpc2NvcmQtb3JpZ2luYWwtbWFya2luZ3MnLFxyXG4gICAgICAgICAgICBuYW1lOiAnVG9nZ2xlIERpc2NvcmQgb3JpZ2luYWwgbWFya2luZ3MnLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5vcmlnaW5hbE1hcmtpbmdzID0gIXRoaXMuc2V0dGluZ3Mub3JpZ2luYWxNYXJraW5ncztcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogJ3RvZ2dsZS1yZWxhdGlvbnNoaXAtbGluZXMtcHJldmlldycsXHJcbiAgICAgICAgICAgIG5hbWU6ICdUb2dnbGUgcmVsYXRpb25zaGlwIGxpbmVzIGluIFByZXZpZXcgbW9kZScsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnJlbGF0aW9uTGluZXNQcmV2aWV3ID0gIXRoaXMuc2V0dGluZ3MucmVsYXRpb25MaW5lc1ByZXZpZXc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgICAgICAgaWQ6ICd0b2dnbGUtcHJldHR5LXRhc2tzLXByZXZpZXcnLFxyXG4gICAgICAgICAgICBuYW1lOiAnVG9nZ2xlIFByZXR0eSBUYXNrIExpc3RzIGluIEVkaXRvciBtb2RlJyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucHJldHR5VGFza3NFZGl0b3IgPSAhdGhpcy5zZXR0aW5ncy5wcmV0dHlUYXNrc0VkaXRvcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogJ3RvZ2dsZS1kYXJrLWVuaGFuY2UnLFxyXG4gICAgICAgICAgICBuYW1lOiAnVG9nZ2xlIERhcmsgbm90ZSBoZWFkZXJzJyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGFya0VuaGFuY2UgPSAhdGhpcy5zZXR0aW5ncy5kYXJrRW5oYW5jZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCB0aGUgc3R5bGluZyBlbGVtZW50cyB3ZSBuZWVkXHJcbiAgICBhZGRTdHlsZSgpIHtcclxuICAgICAgICAvLyBhZGQgYSBjc3MgYmxvY2sgZm9yIG91ciBzZXR0aW5ncy1kZXBlbmRlbnQgc3R5bGVzXHJcbiAgICAgICAgY29uc3QgY3NzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBjc3MuaWQgPSAnZGlzY29yZGlhbi10aGVtZSc7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKGNzcyk7XHJcblxyXG4gICAgICAgIC8vIGFkZCB0aGUgbWFpbiBjbGFzc1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlzY29yZGlhbi10aGVtZScpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZGlzY29yZGlhbi1yZWFkYWJsZS1sZW5ndGgnKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2Rpc2NvcmRpYW4tcGFyYWdyYXBoLWZvY3VzLWZhZGUnKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzdHlsZSB3aXRoIHRoZSBzZXR0aW5ncy1kZXBlbmRlbnQgc3R5bGVzXHJcbiAgICAgICAgdGhpcy51cGRhdGVTdHlsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVN0eWxlKCkge1xyXG4gICAgICAgIGNvbnN0IGRpc2NvcmRpYW5DbGFzc2VzID0gW1xyXG4gICAgICAgICAgICAnZGlzY29yZGlhbi10aGVtZScsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLXdyaXRlci1tb2RlJyxcclxuICAgICAgICAgICAgJ2Rpc2NvcmRpYW4tZmxhdC1hbmR5LW1vZGUnLFxyXG4gICAgICAgICAgICAnZGlzY29yZGlhbi1wYXJhZ3JhcGgtZm9jdXMnLFxyXG4gICAgICAgICAgICAnZGlzY29yZGlhbi1wYXJhZ3JhcGgtZm9jdXMtZmFkZScsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLXJlYWRhYmxlLWxlbmd0aCcsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLWZvbnQtc2l6ZS1ub3RlcycsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLWZvbnQtc2l6ZS1maWxlLWV4cGxvcmVyJyxcclxuICAgICAgICAgICAgJ2Rpc2NvcmRpYW4tZGlzY29yZC1tYXJraW5ncycsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLXJlbC1wcmV2aWV3JyxcclxuICAgICAgICAgICAgJ2Rpc2NvcmRpYW4tcHJldHR5LXRhc2tzLWVkaXRvcicsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLWRhcmstZW5oYW5jZScsXHJcbiAgICAgICAgICAgICdkaXNjb3JkaWFuLWhpZGUtdmF1bHQnLFxyXG4gICAgICAgICAgICAnZGlzY29yZGlhbi1oaWRlLXRpdGxlYmFyJyxcclxuICAgICAgICAgICAgJ2Rpc2NvcmRpYW4taGlkZS1zdGF0dXNiYXInXHJcbiAgICAgICAgXVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2xhc3NlcyhkaXNjb3JkaWFuQ2xhc3Nlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFN0eWxlcygpIHtcclxuICAgICAgICBjb25zdCBkaXNjb3JkaWFuRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzY29yZGlhbi10aGVtZScpXHJcbiAgICAgICAgaWYgKGRpc2NvcmRpYW5FbCkge1xyXG4gICAgICAgICAgICBjb25zdCBsZW4gPSB0aGlzLnNldHRpbmdzLnJlYWRhYmxlTGVuZ3RoICsgJ3JlbSdcclxuICAgICAgICAgICAgY29uc3QgZmFkZSA9IDEwMCAtIHRoaXMuc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNGYWRlXHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRTaXplTm90ZXMgPSB0aGlzLnNldHRpbmdzLmZvbnRTaXplTm90ZXMgLyAxNiArICdyZW0nXHJcbiAgICAgICAgICAgIGNvbnN0IGZvbnRTaXplRmlsZUV4cGxvcmVyID0gdGhpcy5zZXR0aW5ncy5mb250U2l6ZUZpbGVFeHBsb3JlciAvIDE2ICsgJ3JlbSdcclxuICAgICAgICAgICAgY29uc3QgbGV0dGVyU3BhY2luZ05vdGVzID0gKHRoaXMuc2V0dGluZ3MuZm9udFNpemVOb3RlcyA8IDE2ID8gLTAuMiA6IC0wLjQpICsgJ3B4J1xyXG5cclxuICAgICAgICAgICAgZGlzY29yZGlhbkVsLmlubmVyVGV4dCA9IGBcclxuICAgICAgICAgICAgICAgICAgICBib2R5LmRpc2NvcmRpYW4tdGhlbWUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAtLXJlYWRhYmxlLWxpbmUtbGVuZ3RoOiR7bGVufTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLS1wYXJhZ3JhcGgtZm9jdXMtZmFkZTogMC4ke2ZhZGV9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAtLWZvbnQtc2l6ZS1ub3RlczogJHtmb250U2l6ZU5vdGVzfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLS1mb250LXNpemUtZmlsZS1leHBsb3JlcjogJHtmb250U2l6ZUZpbGVFeHBsb3Jlcn07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC0tbGV0dGVyLXNwYWNpbmctbm90ZXM6ICR7bGV0dGVyU3BhY2luZ05vdGVzfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBgO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGZpbmQgRGlzY29yZGlhbiBUaGVtZVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIHN0eWxlcyAoYXQgdGhlIHN0YXJ0LCBvciBhcyB0aGUgcmVzdWx0IG9mIGEgc2V0dGluZ3MgY2hhbmdlKVxyXG4gICAgdXBkYXRlU3R5bGUoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkaXNjb3JkaWFuLXdyaXRlci1tb2RlJywgdGhpcy5zZXR0aW5ncy53cml0ZXJNb2RlKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4tZmxhdC1hbmR5LW1vZGUnLCB0aGlzLnNldHRpbmdzLmZsYXRBbmR5TW9kZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkaXNjb3JkaWFuLXBhcmFncmFwaC1mb2N1cycsIHRoaXMuc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNNb2RlKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4taGlkZS12YXVsdCcsIHRoaXMuc2V0dGluZ3MuaGlkZVZhdWx0KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4taGlkZS10aXRsZWJhcicsIHRoaXMuc2V0dGluZ3MuaGlkZVRpdGxlQmFyKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4taGlkZS1zdGF0dXNiYXInLCB0aGlzLnNldHRpbmdzLmhpZGVTdGF0dXNCYXIpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnZGlzY29yZGlhbi1vcmlnaW5hbC1tYXJraW5ncycsIHRoaXMuc2V0dGluZ3Mub3JpZ2luYWxNYXJraW5ncyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkaXNjb3JkaWFuLXJlbC1wcmV2aWV3JywgdGhpcy5zZXR0aW5ncy5yZWxhdGlvbkxpbmVzUHJldmlldyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdkaXNjb3JkaWFuLXByZXR0eS10YXNrcy1lZGl0b3InLCB0aGlzLnNldHRpbmdzLnByZXR0eVRhc2tzRWRpdG9yKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4tZGFyay1lbmhhbmNlJywgdGhpcy5zZXR0aW5ncy5kYXJrRW5oYW5jZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFN0eWxlcygpXHJcbiAgICB9XHJcblxyXG4vLyByZWZyZXNoIGZ1bmN0aW9uIGZvciB3aGVuIHdlIGNoYW5nZSBzZXR0aW5nc1xyXG4gICAgcmVmcmVzaCA9ICgpID0+IHtcclxuICAgICAgICAvLyByZS1sb2FkIHRoZSBzdHlsZVxyXG4gICAgICAgIHRoaXMudXBkYXRlU3R5bGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRGlzY29yZGlhblBsdWdpblNldHRpbmdzIHtcclxuICAgIGhpZGVWYXVsdDogYm9vbGVhblxyXG4gICAgaGlkZU1ldGFkYXRhOiBib29sZWFuXHJcbiAgICBoaWRlVGl0bGVCYXI6IGJvb2xlYW5cclxuICAgIGhpZGVTdGF0dXNCYXI6IGJvb2xlYW5cclxuICAgIG9yaWdpbmFsTWFya2luZ3M6IGJvb2xlYW5cclxuICAgIHJlbGF0aW9uTGluZXNQcmV2aWV3OiBib29sZWFuXHJcbiAgICBwcmV0dHlUYXNrc0VkaXRvcjogYm9vbGVhblxyXG4gICAgZGFya0VuaGFuY2U6IGJvb2xlYW5cclxuICAgIGZvbnRTaXplTm90ZXM6IG51bWJlclxyXG4gICAgZm9udFNpemVGaWxlRXhwbG9yZXI6IG51bWJlclxyXG4gICAgbGV0dGVyU3BhY2luZ05vdGVzOiBudW1iZXJcclxuICAgIHdyaXRlck1vZGU6IGJvb2xlYW5cclxuICAgIHBhcmFncmFwaEZvY3VzTW9kZTogYm9vbGVhblxyXG4gICAgcGFyYWdyYXBoRm9jdXNGYWRlOiBudW1iZXJcclxuICAgIGZsYXRBbmR5TW9kZTogYm9vbGVhblxyXG4gICAgcmVhZGFibGVMZW5ndGg6IG51bWJlclxyXG59XHJcblxyXG5jbGFzcyBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICAgIHBsdWdpbjogRGlzY29yZGlhblBsdWdpbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBEaXNjb3JkaWFuUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qge2NvbnRhaW5lckVsfSA9IHRoaXM7XHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB0aGlzLnBsdWdpbi5zZXR0aW5ncztcclxuXHJcbiAgICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQbHVnaW5EZXNjcmlwdGlvbihjb250YWluZXJFbClcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQbHVnaW5TZXR0aW5nc0hlYWRlcihjb250YWluZXJFbCwgJ1RoZW1lIFNldHRpbmdzJylcclxuICAgICAgICB0aGlzLmFkZFdyaXRlck1vZGVTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcbiAgICAgICAgdGhpcy5hZGRGbGF0QW5keU1vZGVTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcbiAgICAgICAgdGhpcy5hZGRQYXJhZ3JhcGhGb2N1c01vZGVTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcbiAgICAgICAgdGhpcy5hZGRSZWFkYWJsZUxlbmd0aFNldHRpbmdzKGNvbnRhaW5lckVsLCBzZXR0aW5ncylcclxuICAgICAgICB0aGlzLmFkZE9yaWdpbmFsTWFya2luZ3NTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcbiAgICAgICAgdGhpcy5hZGRSZWxhdGlvbkxpbmVzUHJldmlld1NldHRpbmdzKGNvbnRhaW5lckVsLCBzZXR0aW5ncylcclxuICAgICAgICB0aGlzLmFkZFByZXR0eVRhc2tzRWRpdG9yU2V0dGluZ3MoY29udGFpbmVyRWwsIHNldHRpbmdzKVxyXG4gICAgICAgIHRoaXMuYWRkRGFya0VuaGFuY2VTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGx1Z2luU2V0dGluZ3NTZXBhcmF0b3IoY29udGFpbmVyRWwpXHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGx1Z2luU2V0dGluZ3NIZWFkZXIoY29udGFpbmVyRWwsICdGb250cycpXHJcbiAgICAgICAgdGhpcy5hZGROb3Rlc0ZvbnRTaXplU2V0dGluZ3MoY29udGFpbmVyRWwsIHNldHRpbmdzKVxyXG4gICAgICAgIHRoaXMuYWRkRmlsZUV4cGxvcmVyRm9udFNpemVTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGx1Z2luU2V0dGluZ3NTZXBhcmF0b3IoY29udGFpbmVyRWwpXHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGx1Z2luU2V0dGluZ3NIZWFkZXIoY29udGFpbmVyRWwsICdJZiBub3QgdXNpbmcgSGlkZXIgcGx1Z2luJylcclxuICAgICAgICB0aGlzLmFkZEhpZGVWYXVsdFNldHRpbmdzKGNvbnRhaW5lckVsLCBzZXR0aW5ncylcclxuICAgICAgICB0aGlzLmFkZEhpZGVUaXRsZUJhclNldHRpbmdzKGNvbnRhaW5lckVsLCBzZXR0aW5ncylcclxuICAgICAgICB0aGlzLmFkZEhpZGVTdGF0dXNCYXJTZXR0aW5ncyhjb250YWluZXJFbCwgc2V0dGluZ3MpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGx1Z2luRGVzY3JpcHRpb24oY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBjb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jywge2NsczogJ3BsdWdpbi1kZXNjcmlwdGlvbid9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpcHRpb24uY3JlYXRlRWwoJ2gzJywge3RleHQ6ICdUaGFua3MgZm9yIHVzaW5nIERpc2NvcmRpYW4gISd9KTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5jcmVhdGVFbCgncCcsIHt0ZXh0OiAnSWYgeW91IG5vdGljZSBhbnkgaXNzdWVzLCB0cnkgdG8gdXBkYXRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBhbmQgcmVsb2FkIE9ic2lkaWFuLid9KTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5jcmVhdGVFbCgncCcsIHt0ZXh0OiAnT3RoZXJ3aXNlIGZlZWwgZnJlZSB0byBicmluZyBpdCB1cCBvbiBHaXRodWIgb3IgYmV0dGVyIHlldCBjb250cmlidXRlIGEgZml4Lid9KTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5jcmVhdGVFbCgnYScsIHtcclxuICAgICAgICAgICAgdGV4dDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9yYWRla2tvemFrL2Rpc2NvcmRpYW4vaXNzdWVzLycsXHJcbiAgICAgICAgICAgIGF0dHI6IHsnaHJlZic6ICdodHRwczovL2dpdGh1Yi5jb20vcmFkZWtrb3phay9kaXNjb3JkaWFuL2lzc3Vlcy8nLCAndGFyZ2V0JzogJ19ibGFuayd9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGx1Z2luU2V0dGluZ3NIZWFkZXIoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBoZWFkZXJUaXRsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2g0Jywge3RleHQ6IGhlYWRlclRpdGxlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGx1Z2luU2V0dGluZ3NTZXBhcmF0b3IoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ3AnLCB7dGV4dDogJ+KKtycsIGNsczogJ3BsdWdpbi1kZXNjcmlwdGlvbiBzZXBhcmF0b3InfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkV3JpdGVyTW9kZVNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgc2V0dGluZ3M6IERpc2NvcmRpYW5QbHVnaW5TZXR0aW5ncykge1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IG5ldyBEb2N1bWVudEZyYWdtZW50KClcclxuICAgICAgICBkZXNjcmlwdGlvbi5hcHBlbmRUZXh0KCdIaWRlcyB2aXN1YWwgZXhjZXNzIHdoZW4gc2lkZWJhcnMgYXJlIGNvbGxhcHNlZCAoYWNjZXNzaWJsZSBieSBob3ZlciknKVxyXG4gICAgICAgIGRlc2NyaXB0aW9uLmNyZWF0ZUVsKCdicicpXHJcbiAgICAgICAgZGVzY3JpcHRpb24uYXBwZW5kVGV4dCgnTk9URSA6IHRoaXMgc2V0dGluZyB3aWxsIGhpZGUgU3RhdHVzIGJhciBhbmQgVGl0bGUgYmFyICcgK1xyXG4gICAgICAgICAgICAncmVnYXJkbGVzcyBvZiB0aGVpciBpbmRpdmlkdWFsIG9wdGlvbnMnKVxyXG5cclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ1dyaXRlciBtb2RlJylcclxuICAgICAgICAgICAgLnNldERlc2MoZGVzY3JpcHRpb24pXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZShzZXR0aW5ncy53cml0ZXJNb2RlKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndyaXRlck1vZGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRGbGF0QW5keU1vZGVTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0ZsYXQgQW5keSBNb2RlJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ0ZsYXR0ZXIgbm90ZXMgc3RhY2tpbmcgd2hlbiBpbiBBbmR5IE1vZGUgKG5vIGVsZXZhdGlvbiBzaGFkb3cpJylcclxuICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlLnNldFZhbHVlKHNldHRpbmdzLmZsYXRBbmR5TW9kZSlcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5mbGF0QW5keU1vZGUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRQYXJhZ3JhcGhGb2N1c01vZGVTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ1BhcmFncmFwaCBmb2N1cyBtb2RlJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ1RoaXMgYWltcyB0byBpbWl0YXRlIHdlbGwta25vd24gaUEgV3JpdGVyIHBhcmFncmFwaCBmb2N1cy4nKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUoc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNNb2RlKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnBhcmFncmFwaEZvY3VzTW9kZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nLnNldHRpbmdFbC5jbGFzc0xpc3QudG9nZ2xlKCdkaXNjb3JkaWFuLXBsdWdpbi1zZXR0aW5nLWRpc2FibGVkJywgIXZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVGYWRlID0gJ1BhcmFncmFwaCBGb2N1cyBNb2RlIGZhZGUgJ1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUobmFtZUZhZGUgKyAnKCA9ICcgKyBzZXR0aW5ncy5wYXJhZ3JhcGhGb2N1c0ZhZGUgKyAnJSApJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ0Ftb3VudCBvZiBmYWRlIG91dCB3aGVuIGluIFBhcmFncmFwaCBGb2N1cyBNb2RlIChkZWZhdWx0IDc1JSknKVxyXG4gICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXIuc2V0TGltaXRzKDI1LCA5MCwgNSlcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5wYXJhZ3JhcGhGb2N1c0ZhZGUpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNGYWRlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZy5zZXR0aW5nRWwuY2xhc3NMaXN0LnRvZ2dsZSgnZGlzY29yZGlhbi1wbHVnaW4tc2V0dGluZy1kaXNhYmxlZCcsICF2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nLnNldE5hbWUobmFtZUZhZGUgKyAnKCA9ICcgKyBzZXR0aW5ncy5wYXJhZ3JhcGhGb2N1c0ZhZGUgKyAnJSApJylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHNldHRpbmcuc2V0dGluZ0VsLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4tcGx1Z2luLXNldHRpbmctZGlzYWJsZWQnLCAhc2V0dGluZ3MucGFyYWdyYXBoRm9jdXNNb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRSZWFkYWJsZUxlbmd0aFNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgc2V0dGluZ3M6IERpc2NvcmRpYW5QbHVnaW5TZXR0aW5ncykge1xyXG4gICAgICAgIGNvbnN0IHJlYWRhYmxlTGluZUxlbmd0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2lzLXJlYWRhYmxlLWxpbmUtd2lkdGgnKVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gJ1JlYWRhYmxlIGxpbmUgbGVuZ3RoICdcclxuICAgICAgICBjb25zdCBzZXR0aW5nID0gbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKG5hbWUgKyAnKCA9ICcgKyBzZXR0aW5ncy5yZWFkYWJsZUxlbmd0aCArICdyZW0gKScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdPYnNpZGlhblxcJ3MgUmVhZGFibGUgbGluZSBsZW5ndGggbmVlZHMgdG8gYmUgZW5hYmxlZCAoZGVmYXVsdCA0NSByZW0pJylcclxuICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyLnNldExpbWl0cyg0NSwgMTIwLCA1KVxyXG4gICAgICAgICAgICAgICAgLnNldFZhbHVlKHNldHRpbmdzLnJlYWRhYmxlTGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnJlYWRhYmxlTGVuZ3RoID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nLnNldE5hbWUobmFtZSArICcoID0gJyArIHNldHRpbmdzLnJlYWRhYmxlTGVuZ3RoICsgJ3JlbSApJylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIHNldHRpbmcuc2V0dGluZ0VsLmNsYXNzTGlzdC50b2dnbGUoJ2Rpc2NvcmRpYW4tcGx1Z2luLXNldHRpbmctZGlzYWJsZWQnLCByZWFkYWJsZUxpbmVMZW5ndGgubGVuZ3RoID09IDApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE9yaWdpbmFsTWFya2luZ3NTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0Rpc2NvcmQgb3JpZ2luYWwgbWFya2luZ3MnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnVXNlIERpc2NvcmQgb3JpZ2luYWwgbWFya2luZ3Mgc3VjaCBhcyBib2xkLCBpdGFsaWNzLCBpbmxpbmUgY29kZSwgcXVvdGVzIGFuZCBzbyBvbicpXHJcbiAgICAgICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZShzZXR0aW5ncy5vcmlnaW5hbE1hcmtpbmdzKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLm9yaWdpbmFsTWFya2luZ3MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGREYXJrRW5oYW5jZVNldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgc2V0dGluZ3M6IERpc2NvcmRpYW5QbHVnaW5TZXR0aW5ncykge1xyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnRGFyayBub3RlIGhlYWRlcnMnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnTWFrZSBub3RlIGhlYWRlcnMgbW9yZSBwcm9taW5lbnQnKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUoc2V0dGluZ3MuZGFya0VuaGFuY2UpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuZGFya0VuaGFuY2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRSZWxhdGlvbkxpbmVzUHJldmlld1NldHRpbmdzKGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudCwgc2V0dGluZ3M6IERpc2NvcmRpYW5QbHVnaW5TZXR0aW5ncykge1xyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnUmVsYXRpb25zaGlwIGxpbmVzIGluIFByZXZpZXcgbW9kZScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdTaG93IGxpbmVzIGNvbm5lY3RpbmcgcmVsYXRlZCBidWxsZXQgcG9pbnRzIGFuZCB0YXNrIGxpc3RzJylcclxuICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlLnNldFZhbHVlKHNldHRpbmdzLnJlbGF0aW9uTGluZXNQcmV2aWV3KVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnJlbGF0aW9uTGluZXNQcmV2aWV3ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUHJldHR5VGFza3NFZGl0b3JTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ1ByZXR0eSBUYXNrIExpc3RzIGluIEVkaXRvciBtb2RlJylcclxuICAgICAgICAgICAgLnNldERlc2MoXCJIQUNLSVNIIDogcGxlYXNlIHVzZSBib3RoICdTbWFydCBpbmRlbnQgbGlzdHMnIGFuZCAnVXNlIHRhYnMnIG9wdGlvbnMgZm9yIGJlc3QgZXhwZXJpZW5jZVwiKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUoc2V0dGluZ3MucHJldHR5VGFza3NFZGl0b3IpXHJcbiAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MucHJldHR5VGFza3NFZGl0b3IgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGROb3Rlc0ZvbnRTaXplU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBzZXR0aW5nczogRGlzY29yZGlhblBsdWdpblNldHRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9ICdOb3RlcyBmb250IHNpemUgJ1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmcgPSBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUobmFtZSArICcoID0gJyArIHNldHRpbmdzLmZvbnRTaXplTm90ZXMgKyAncHggKScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdVc2VkIGluIGVkaXRvci9wcmV2aWV3IG1vZGUgKGRlZmF1bHQgMTRweCknKVxyXG4gICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXIuc2V0TGltaXRzKDE0LCAyMiwgMilcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5mb250U2l6ZU5vdGVzKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmZvbnRTaXplTm90ZXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmcuc2V0TmFtZShuYW1lICsgJyggPSAnICsgdmFsdWUgKyAncHggKScpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEZpbGVFeHBsb3JlckZvbnRTaXplU2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBzZXR0aW5nczogRGlzY29yZGlhblBsdWdpblNldHRpbmdzKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9ICdGaWxlIEV4cGxvcmVyIGZvbnQgc2l6ZSAnXHJcbiAgICAgICAgY29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZShuYW1lICsgJyggPSAnICsgc2V0dGluZ3MuZm9udFNpemVGaWxlRXhwbG9yZXIgKyAncHggKScpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdVc2VkIGluIEZpbGUgRXhwbG9yZXIgKGRlZmF1bHQgMTRweCknKVxyXG4gICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXIuc2V0TGltaXRzKDEyLCAxOCwgMilcclxuICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShzZXR0aW5ncy5mb250U2l6ZUZpbGVFeHBsb3JlcilcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5mb250U2l6ZUZpbGVFeHBsb3JlciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZy5zZXROYW1lKG5hbWUgKyAnKCA9ICcgKyB2YWx1ZSArICdweCApJylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkSGlkZVZhdWx0U2V0dGluZ3MoY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LCBzZXR0aW5nczogRGlzY29yZGlhblBsdWdpblNldHRpbmdzKSB7XHJcbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgICAgIC5zZXROYW1lKCdIaWRlIHZhdWx0IG5hbWUnKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnSGlkZXMgdmF1bHQgbmFtZSBpbiBGaWxlIEV4cGxvcmVyJylcclxuICAgICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlLnNldFZhbHVlKHNldHRpbmdzLmhpZGVWYXVsdClcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5oaWRlVmF1bHQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YShzZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRIaWRlVGl0bGVCYXJTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0hpZGUgdGl0bGUgYmFyJylcclxuICAgICAgICAgICAgLnNldERlc2MoJ0hpZGVzIG1haW4gdGl0bGUgYmFyICh0aGVtZVxcJ3MgZGVmYXVsdCknKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUoc2V0dGluZ3MuaGlkZVRpdGxlQmFyKVxyXG4gICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmhpZGVUaXRsZUJhciA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEhpZGVTdGF0dXNCYXJTZXR0aW5ncyhjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNldHRpbmdzOiBEaXNjb3JkaWFuUGx1Z2luU2V0dGluZ3MpIHtcclxuICAgICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAgICAgLnNldE5hbWUoJ0hpZGUgc3RhdHVzIGJhcicpXHJcbiAgICAgICAgICAgIC5zZXREZXNjKCdIaWRlcyBzdGF0dXMgYmFyICh0aGVtZVxcJ3MgZGVmYXVsdCknKVxyXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUoc2V0dGluZ3MuaGlkZVN0YXR1c0JhcilcclxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5oaWRlU3RhdHVzQmFyID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEoc2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBsdWdpbiIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxD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

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

var WorkbenchPlugin = /** @class */ (function (_super) {
    __extends(WorkbenchPlugin, _super);
    function WorkbenchPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkbenchPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Loading the Workbench plugin.');
                        //load data from saved settings
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        //load data from saved settings
                        _a.settings = (_b.sent()) || new WorkbenchSettings();
                        this.addRibbonIcon('pencil', 'Workbench', function () {
                            var obsidianApp = _this.app;
                            var workbenchNoteTitle = _this.settings.workbenchNoteName;
                            var files = obsidianApp.vault.getFiles();
                            var workbenchNoteFile = files.filter(function (e) { return e.name === workbenchNoteTitle //hat-tip 🎩 to @MrJackPhil for this little workflow 
                                || e.path === workbenchNoteTitle
                                || e.basename === workbenchNoteTitle; })[0];
                            obsidianApp.workspace.openLinkText(workbenchNoteTitle, workbenchNoteFile.path, true, obsidian.MarkdownPreviewView);
                        });
                        this.addCommand({
                            id: 'workbench-link-current-note',
                            name: 'Link the current note/page in your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.linkNoteInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-embed-current-note',
                            name: 'Embed the current note/page in your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.embedNoteInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-link-current-block',
                            name: 'Link the current line/block in your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.linkBlockInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-embed-current-block',
                            name: 'Embed the current line/block into your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.embedBlockInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-copy-current-block',
                            name: 'Copy the current line/block into your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.copyBlockIntoWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-copy-and-link-current-block',
                            name: 'Copy the current line/block into your Workbench as a markdown link to the line/block.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.copyLineAndLinkToBlock();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-link-current-section',
                            name: 'Link the current heading/section into your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.linkSectionInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'workbench-embed-current-section',
                            name: 'Embed the current heading/section into your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.embedSectionInWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'clear-workbench',
                            name: 'Clear the workbench note.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            callback: function () {
                                _this.clearWorkbench();
                            }
                        });
                        this.addCommand({
                            id: 'insert-workbench',
                            name: 'Insert the contents of the workbench note.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.insertWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'choose-new-workbench',
                            name: 'Change your Workbench.',
                            // callback: () => {
                            // 	console.log('Simple Callback');
                            // },
                            checkCallback: function (checking) {
                                var leaf = _this.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        _this.changeWorkbench();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addSettingTab(new WorkbenchSettingTab(this.app, this));
                        /*this.registerEvent(this.app.on('codemirror', (cm: CodeMirror.Editor) => {
                            console.log('codemirror', cm);
                        })); */
                        this.registerDomEvent(document, 'click', function (evt) {
                            if (_this.settings.altClickType != "Nothing") {
                                if (evt.altKey) {
                                    if ((evt.target.className === "internal-link") || (evt.target.className.includes("cm-hmd-internal-link"))) {
                                        console.log("alt");
                                        _this.altClick(evt);
                                    }
                                }
                            }
                            if (_this.settings.metaAltClickType != "Nothing") {
                                if (evt.metaKey && evt.altKey) {
                                    if ((evt.target.className.includes("cm-hmd-internal-link"))) {
                                        new obsidian.Notice("Sorry, this doesn't work when you click directly on a link. Try clicking outside of the link!");
                                    }
                                    else if ((evt.target.className.includes("CodeMirror-line")) || evt.target.className.includes("cm")) {
                                        var currentFile = _this.app.workspace.activeLeaf.view.file;
                                        console.log("meta+alt");
                                        _this.metaAltClick(evt, currentFile);
                                    }
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    WorkbenchPlugin.prototype.onunload = function () {
        console.log('Unloading the Workbench plugin.');
    };
    WorkbenchPlugin.prototype.insertWorkbench = function () {
        var obsidianApp = this.app;
        var workbenchNoteTitle = this.settings.workbenchNoteName;
        var files = obsidianApp.vault.getFiles();
        var workbenchNoteFile = files.filter(function (e) { return e.name === workbenchNoteTitle //hat-tip 🎩 to @MrJackPhil for this little workflow 
            || e.path === workbenchNoteTitle
            || e.basename === workbenchNoteTitle; })[0];
        var currentNoteFile = obsidianApp.workspace.activeLeaf.view.file;
        var editor = obsidianApp.workspace.activeLeaf.view.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        console.log(cursor);
        var doc = editor.getDoc();
        obsidianApp.vault.read(workbenchNoteFile).then(function (result) {
            doc.replaceRange(result, cursor);
            editor.focus();
        });
    };
    WorkbenchPlugin.prototype.clearWorkbench = function () {
        var obsidianApp = this.app;
        var workbenchNoteTitle = this.settings.workbenchNoteName;
        var editor = obsidianApp.workspace.activeLeaf.view.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var files = obsidianApp.vault.getFiles();
        var workbenchNoteFile = files.filter(function (e) { return e.name === workbenchNoteTitle //hat-tip 🎩 to @MrJackPhil for this little workflow 
            || e.path === workbenchNoteTitle
            || e.basename === workbenchNoteTitle; })[0];
        obsidianApp.vault.modify(workbenchNoteFile, "");
        editor.setCursor(cursor);
        editor.focus();
    };
    WorkbenchPlugin.prototype.saveToWorkbench = function (theMaterial, saveAction) {
        var obsidianApp = this.app;
        var editor = obsidianApp.workspace.activeLeaf.view.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var blankLine = this.settings.includeBlankLine;
        var linePrefix = this.settings.workbenchLinePrefix;
        console.log(linePrefix + theMaterial);
        var workbenchNoteTitle = this.settings.workbenchNoteName;
        var files = obsidianApp.vault.getFiles();
        var workbenchNoteFile = files.filter(function (e) { return e.name === workbenchNoteTitle //hat-tip 🎩 to @MrJackPhil for this little workflow 
            || e.path === workbenchNoteTitle
            || e.basename === workbenchNoteTitle; })[0];
        console.log("Workbench note:" + workbenchNoteFile);
        if (!workbenchNoteFile) {
            console.log("The workbench note does not already exist. Creating it, then appending the new content to it.");
            var noteText = linePrefix + theMaterial;
            var newWorkbenchFile = obsidianApp.vault.create(workbenchNoteTitle + ".md", noteText);
        }
        else { // The file exists 
            console.log("The workbench note already exists. Appending the new content to it.");
            obsidianApp.vault.read(workbenchNoteFile).then(function (result) {
                var previousNoteText = result;
                //console.log("Previous note text:\n" + previousNoteText);
                var lineSpacing = "\n";
                if (blankLine) {
                    lineSpacing = "\n\n";
                }
                var newNoteText = previousNoteText + lineSpacing + linePrefix + theMaterial;
                obsidianApp.vault.modify(workbenchNoteFile, newNoteText);
                new obsidian.Notice("Added " + saveAction + " to the workbench.");
            });
        }
        editor.setCursor(cursor);
        editor.focus();
    };
    WorkbenchPlugin.prototype.createBlockHash = function (inputText) {
        var obsidianApp = this.app;
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    WorkbenchPlugin.prototype.getBlock = function (inputLine, noteFile) {
        var obsidianApp = this.app;
        var noteBlocks = obsidianApp.metadataCache.getFileCache(noteFile).blocks;
        console.log("Checking if line '" + inputLine + "' is a block.");
        var blockString = "";
        if (noteBlocks) { // the file does contain blocks. If not, return ""
            for (var eachBlock in noteBlocks) { // iterate through the blocks. 
                console.log("Checking block ^" + eachBlock);
                var blockRegExp = new RegExp("(" + eachBlock + ")$", "gim");
                if (inputLine.match(blockRegExp)) { // if end of inputLine matches block, return it
                    blockString = eachBlock;
                    console.log("Found block ^" + blockString);
                    return blockString;
                }
            }
            return blockString;
        }
        return blockString;
    };
    WorkbenchPlugin.prototype.altClick = function (someMouseEvent) {
        var obsidianApp = this.app;
        var clickType = this.settings.altClickType;
        var linkPrefix = "";
        if (clickType === "Embed") {
            linkPrefix = "!";
        }
        var newMaterial = linkPrefix + "[[" + someMouseEvent.target.innerText + "]]";
        this.saveToWorkbench(newMaterial, "a link to the selected note");
    };
    WorkbenchPlugin.prototype.metaAltClick = function (someMouseEvent, activeFile) {
        console.log("Meta alt click");
        var obsidianApp = this.app;
        var lineText = someMouseEvent.target.innerText;
        if ((someMouseEvent.target.className.includes("cm"))) {
            lineText = someMouseEvent.target.parentNode.innerText;
        }
        console.log("The contents of the line are: " + lineText);
        // Get the file and create a link to it
        var currentNoteFile = activeFile;
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var clickType = this.settings.metaAltClickType;
        if (lineText != "") {
            if (clickType === "Copy") {
                var newMaterial = lineText;
                this.saveToWorkbench(newMaterial, "a copy of the selected line/block");
            }
            else {
                var linkPrefix = "";
                if (clickType === "Embed") {
                    linkPrefix = "!";
                }
                console.log("Checking for block:");
                if (this.getBlock(lineText, currentNoteFile) === "") { // The line is not already a block
                    lineText = lineText.trim();
                    console.log("This line is not currently a block. Adding a block ID.");
                    lineBlockID = this.createBlockHash(lineText).toString();
                    var lineWithBlock_1 = lineText + " ^" + lineBlockID;
                    obsidianApp.vault.read(currentNoteFile).then(function (result) {
                        var previousNoteText = result;
                        var newNoteText = previousNoteText.replace(lineText, lineWithBlock_1);
                        obsidianApp.vault.modify(currentNoteFile, newNoteText);
                    });
                }
                else {
                    var lineBlockID = this.getBlock(lineText, currentNoteFile);
                    console.log(lineBlockID);
                }
                var newMaterial = linkPrefix + "[[" + noteLink + "#^" + lineBlockID + "]]";
                console.log(newMaterial);
                this.saveToWorkbench(newMaterial, "a link to the selected line/block");
            }
        }
        else {
            new obsidian.Notice("There is nothing on the selected line.");
        }
    };
    WorkbenchPlugin.prototype.linkNoteInWorkbench = function () {
        var obsidianApp = this.app;
        var currentView = obsidianApp.workspace.activeLeaf.view;
        // Get the file and create a link to it
        var currentNoteFile = obsidianApp.workspace.activeLeaf.view.file;
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var editor = currentView.sourceMode.cmEditor;
        var newMaterial = "[[" + noteLink + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a link to the current note");
    };
    WorkbenchPlugin.prototype.embedNoteInWorkbench = function () {
        var obsidianApp = this.app;
        // Get the file and create a link to it
        var currentNoteFile = obsidianApp.workspace.activeLeaf.view.file;
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var newMaterial = "![[" + noteLink + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "an embed of the current note");
    };
    WorkbenchPlugin.prototype.linkSectionInWorkbench = function () {
        var obsidianApp = this.app;
        // get the heading
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var currentNoteFile = currentView.file;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var currentLine = editor.doc.sel.ranges[0].anchor.line;
        // Stuck here. For some reason the action only works once on some sections tktktk
        var headings = obsidianApp.metadataCache.getFileCache(currentNoteFile).headings;
        var sectionHeading;
        console.log(headings);
        if (!headings) {
            new obsidian.Notice("No headings found in the current document.");
            return;
        }
        else { // check what heading is closest above the current line
            for (var _i = 0, headings_1 = headings; _i < headings_1.length; _i++) {
                var eachHeading = headings_1[_i];
                var headingLineNumber = eachHeading.position.start.line;
                if (headingLineNumber == currentLine) {
                    sectionHeading = eachHeading;
                    break;
                }
                else if (headingLineNumber > currentLine) {
                    break;
                }
                sectionHeading = eachHeading;
            }
        }
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var newMaterial = "[[" + noteLink + "#" + sectionHeading.heading + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a link to the current section");
    };
    WorkbenchPlugin.prototype.embedSectionInWorkbench = function () {
        var obsidianApp = this.app;
        // get the heading
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var currentNoteFile = currentView.file;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var currentLine = editor.doc.sel.ranges[0].anchor.line;
        // Stuck here. For some reason the action only works once on some sections tktktk
        var headings = obsidianApp.metadataCache.getFileCache(currentNoteFile).headings;
        var sectionHeading;
        console.log(headings);
        if (!headings) {
            new obsidian.Notice("No headings found in the current document.");
            return;
        }
        else { // check what heading is closest above the current line
            for (var _i = 0, headings_2 = headings; _i < headings_2.length; _i++) {
                var eachHeading = headings_2[_i];
                var headingLineNumber = eachHeading.position.start.line;
                if (headingLineNumber == currentLine) {
                    sectionHeading = eachHeading;
                    break;
                }
                else if (headingLineNumber > currentLine) {
                    break;
                }
                sectionHeading = eachHeading;
            }
        }
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var newMaterial = "![[" + noteLink + "#" + sectionHeading.heading + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a link to the current section");
    };
    WorkbenchPlugin.prototype.linkBlockInWorkbench = function () {
        var obsidianApp = this.app;
        // get the block
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var currentNoteFile = currentView.file;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var lineText = editor.getLine(cursor.line);
        console.log(lineText);
        console.log("Checking for block:");
        var lineBlockID = this.getBlock(lineText, currentNoteFile);
        console.log(lineBlockID);
        if (this.getBlock(lineText, currentNoteFile) === "") { // The line is not already a block
            console.log("This line is not currently a block. Adding a block ID.");
            lineBlockID = this.createBlockHash(lineText).toString();
            var lineWithBlock_2 = lineText + " ^" + lineBlockID;
            obsidianApp.vault.read(currentNoteFile).then(function (result) {
                var previousNoteText = result;
                var newNoteText = previousNoteText.replace(lineText, lineWithBlock_2);
                obsidianApp.vault.modify(currentNoteFile, newNoteText);
            });
        }
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var newMaterial = "[[" + noteLink + "#^" + lineBlockID + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a link to the current block");
    };
    WorkbenchPlugin.prototype.embedBlockInWorkbench = function () {
        var obsidianApp = this.app;
        // get the block
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var currentNoteFile = currentView.file;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var lineText = editor.getLine(cursor.line);
        console.log(lineText);
        console.log("Checking for block:");
        var lineBlockID = this.getBlock(lineText, currentNoteFile);
        console.log(lineBlockID);
        if (this.getBlock(lineText, currentNoteFile) === "") { // The line is not already a block
            console.log("This line is not currently a block. Adding a block ID.");
            lineBlockID = this.createBlockHash(lineText).toString();
            var lineWithBlock_3 = lineText + " ^" + lineBlockID;
            obsidianApp.vault.read(currentNoteFile).then(function (result) {
                var previousNoteText = result;
                var newNoteText = previousNoteText.replace(lineText, lineWithBlock_3);
                obsidianApp.vault.modify(currentNoteFile, newNoteText);
            });
        }
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var newMaterial = "![[" + noteLink + "#^" + lineBlockID + "]]";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a link to the current block");
    };
    WorkbenchPlugin.prototype.copyBlockIntoWorkbench = function () {
        var obsidianApp = this.app;
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var lineText = editor.getLine(cursor.line);
        console.log(lineText);
        var newMaterial = lineText;
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a copy of the current block");
    };
    WorkbenchPlugin.prototype.copyLineAndLinkToBlock = function () {
        var obsidianApp = this.app;
        var currentView = obsidianApp.workspace.activeLeaf.view;
        var currentNoteFile = currentView.file;
        var editor = currentView.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var lineText = editor.getLine(cursor.line);
        console.log(lineText);
        //trim block text tktktk
        var blockIDRegex = new RegExp("/(\s){0,1}[\^]{1}([a-zA-Z0-9\-]+)$/", "gim");
        var lineTextWithoutBlockID = lineText.replace(blockIDRegex, "");
        console.log("Checking for block:");
        var lineBlockID = this.getBlock(lineText, currentNoteFile);
        console.log(lineBlockID);
        if (this.getBlock(lineText, currentNoteFile) === "") { // The line is not already a block
            console.log("This line is not currently a block. Adding a block ID.");
            lineBlockID = this.createBlockHash(lineText).toString();
            var lineWithBlock_4 = lineText + " ^" + lineBlockID;
            obsidianApp.vault.read(currentNoteFile).then(function (result) {
                var previousNoteText = result;
                var newNoteText = previousNoteText.replace(lineText, lineWithBlock_4);
                obsidianApp.vault.modify(currentNoteFile, newNoteText);
            });
        }
        var noteLink = obsidianApp.metadataCache.fileToLinktext(currentNoteFile, currentNoteFile.path, true);
        var encodedNoteLink = encodeURIComponent(noteLink);
        var newMaterial = "[" + lineTextWithoutBlockID + "]" + "(" + encodedNoteLink + "#^" + lineBlockID + ")";
        console.log(newMaterial);
        this.saveToWorkbench(newMaterial, "a linked copy of the current block");
    };
    WorkbenchPlugin.prototype.changeWorkbench = function () {
        var obsidianApp = this.app;
        new workbenchNameModal(obsidianApp).open();
    };
    return WorkbenchPlugin;
}(obsidian.Plugin));
var workbenchNameModal = /** @class */ (function (_super) {
    __extends(workbenchNameModal, _super);
    function workbenchNameModal(app) {
        var _this = _super.call(this, app) || this;
        _this.app = app;
        return _this;
    }
    workbenchNameModal.prototype.getItems = function () {
        var files = this.app.vault.getMarkdownFiles();
        var fileList = files.map(function (file) { return file.name; });
        return fileList;
    };
    workbenchNameModal.prototype.getItemText = function (item) {
        return item;
    };
    workbenchNameModal.prototype.onChooseItem = function (item, evt) {
        var workbenchPlugin = this.app.plugins.getPlugin("workbench-obsidian");
        workbenchPlugin.settings.workbenchNoteName = item;
        workbenchPlugin.saveData(workbenchPlugin.settings);
        new obsidian.Notice("Your workbench is now " + item);
    };
    return workbenchNameModal;
}(obsidian.FuzzySuggestModal));
var WorkbenchSettings = /** @class */ (function () {
    function WorkbenchSettings() {
        this.workbenchNoteName = "Workbench";
        this.workbenchLinePrefix = "";
        this.altClickType = "Link";
        this.metaAltClickType = "Embed";
        this.includeBlankLine = false;
    }
    return WorkbenchSettings;
}());
var WorkbenchSettingTab = /** @class */ (function (_super) {
    __extends(WorkbenchSettingTab, _super);
    function WorkbenchSettingTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WorkbenchSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Workbench Settings' });
        new obsidian.Setting(containerEl)
            .setName('Workbench note name')
            .setDesc('Provide a title for the workbench note. Default is Workbench.')
            .addText(function (text) {
            return text
                .setPlaceholder('Workbench')
                .setValue(plugin.settings.workbenchNoteName)
                .onChange(function (value) {
                plugin.settings.workbenchNoteName = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Workbench line prefix')
            .setDesc('Set the prefix to each line added to Workbench. Default is nothing.')
            .addText(function (text) {
            return text
                .setPlaceholder('')
                .setValue(plugin.settings.workbenchLinePrefix)
                .onChange(function (value) {
                plugin.settings.workbenchLinePrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Blank lines')
            .setDesc('Toggle whether there should be a blank line between each Workbench entry.')
            .addToggle(function (toggle) {
            toggle.setValue(plugin.settings.includeBlankLine);
            toggle.onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    plugin.settings.includeBlankLine = value;
                    console.log("Include blank lines between entries:" + value);
                    plugin.saveData(plugin.settings);
                    return [2 /*return*/];
                });
            }); });
        });
        new obsidian.Setting(containerEl)
            .setName('Alt+Click type')
            .setDesc('Set what happens when you alt+click on a link. Default is to copy the link into the Workbench. Note: if your cursor is not already on the targeted line, you may need to double-click!')
            .addDropdown(function (dropDown) {
            return dropDown
                .addOption("Link", "Link selected note in Workbench")
                .addOption("Embed", "Embed selected note in Workbench")
                .addOption("Nothing", "Nothing")
                .setValue(plugin.settings.altClickType)
                .onChange(function (value) {
                plugin.settings.altClickType = value;
                plugin.saveData(plugin.settings);
                _this.display();
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Meta+Alt+Click type')
            .setDesc('Set what happens when you cmd/ctrl+alt+click on a line. Default is to link the line as a block into the Workbench. Note: if your cursor is not already on the targeted line, you may need to double-click!')
            .addDropdown(function (dropDown) {
            return dropDown
                .addOption("Link", "Link block")
                .addOption("Embed", "Embed block")
                .addOption("Copy", "Copy line")
                .addOption("Nothing", "Nothing")
                .setValue(plugin.settings.metaAltClickType)
                .onChange(function (value) {
                plugin.settings.metaAltClickType = value;
                plugin.saveData(plugin.settings);
                _this.display();
            });
        });
    };
    return WorkbenchSettingTab;
}(obsidian.PluginSettingTab));

module.exports = WorkbenchPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgSGFzaCB9IGZyb20gJ2NyeXB0byc7XHJcbmltcG9ydCB7IEFwcCwgTWFya2Rvd25QcmV2aWV3VmlldywgTm90aWNlLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIFRvZ2dsZUNvbXBvbmVudCwgRnV6enlTdWdnZXN0TW9kYWwsIFN1Z2dlc3RNb2RhbCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrYmVuY2hQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG5cdHNldHRpbmdzOiBXb3JrYmVuY2hTZXR0aW5ncztcclxuXHJcblx0YXN5bmMgb25sb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ0xvYWRpbmcgdGhlIFdvcmtiZW5jaCBwbHVnaW4uJyk7XHJcblx0XHRcclxuXHRcdC8vbG9hZCBkYXRhIGZyb20gc2F2ZWQgc2V0dGluZ3NcclxuXHRcdHRoaXMuc2V0dGluZ3MgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB8fCBuZXcgV29ya2JlbmNoU2V0dGluZ3MoKTtcclxuXHJcblxyXG5cdFx0dGhpcy5hZGRSaWJib25JY29uKCdwZW5jaWwnLCAnV29ya2JlbmNoJywgKCkgPT4ge1xyXG5cdFx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHRcdFx0bGV0IHdvcmtiZW5jaE5vdGVUaXRsZSA9IHRoaXMuc2V0dGluZ3Mud29ya2JlbmNoTm90ZU5hbWU7XHJcblxyXG5cdFx0XHRsZXQgZmlsZXMgPSBvYnNpZGlhbkFwcC52YXVsdC5nZXRGaWxlcygpO1xyXG5cdFx0XHRcdGNvbnN0IHdvcmtiZW5jaE5vdGVGaWxlID0gZmlsZXMuZmlsdGVyKGUgPT4gZS5uYW1lID09PSB3b3JrYmVuY2hOb3RlVGl0bGUgLy9oYXQtdGlwIPCfjqkgdG8gQE1ySmFja1BoaWwgZm9yIHRoaXMgbGl0dGxlIHdvcmtmbG93IFxyXG5cdFx0XHRcdFx0fHwgZS5wYXRoID09PSB3b3JrYmVuY2hOb3RlVGl0bGVcclxuXHRcdFx0XHRcdHx8IGUuYmFzZW5hbWUgPT09IHdvcmtiZW5jaE5vdGVUaXRsZVxyXG5cdFx0XHRcdClbMF07XHJcblxyXG5cdFx0XHRvYnNpZGlhbkFwcC53b3Jrc3BhY2Uub3BlbkxpbmtUZXh0KHdvcmtiZW5jaE5vdGVUaXRsZSwgd29ya2JlbmNoTm90ZUZpbGUucGF0aCwgdHJ1ZSwgTWFya2Rvd25QcmV2aWV3Vmlldyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ3dvcmtiZW5jaC1saW5rLWN1cnJlbnQtbm90ZScsXHJcblx0XHRcdG5hbWU6ICdMaW5rIHRoZSBjdXJyZW50IG5vdGUvcGFnZSBpbiB5b3VyIFdvcmtiZW5jaC4nLFxyXG5cdFx0XHQvLyBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdTaW1wbGUgQ2FsbGJhY2snKTtcclxuXHRcdFx0Ly8gfSxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7IFxyXG5cdFx0XHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblx0XHRcdFx0aWYgKGxlYWYpIHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5saW5rTm90ZUluV29ya2JlbmNoKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoeyBcclxuXHRcdFx0aWQ6ICd3b3JrYmVuY2gtZW1iZWQtY3VycmVudC1ub3RlJyxcclxuXHRcdFx0bmFtZTogJ0VtYmVkIHRoZSBjdXJyZW50IG5vdGUvcGFnZSBpbiB5b3VyIFdvcmtiZW5jaC4nLFxyXG5cdFx0XHQvLyBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdTaW1wbGUgQ2FsbGJhY2snKTtcclxuXHRcdFx0Ly8gfSxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7IFxyXG5cdFx0XHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblx0XHRcdFx0aWYgKGxlYWYpIHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbWJlZE5vdGVJbldvcmtiZW5jaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnd29ya2JlbmNoLWxpbmstY3VycmVudC1ibG9jaycsXHJcblx0XHRcdG5hbWU6ICdMaW5rIHRoZSBjdXJyZW50IGxpbmUvYmxvY2sgaW4geW91ciBXb3JrYmVuY2guJyxcclxuXHRcdFx0Ly8gY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnU2ltcGxlIENhbGxiYWNrJyk7XHJcblx0XHRcdC8vIH0sXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4geyBcclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubGlua0Jsb2NrSW5Xb3JrYmVuY2goKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7IFxyXG5cdFx0XHRpZDogJ3dvcmtiZW5jaC1lbWJlZC1jdXJyZW50LWJsb2NrJyxcclxuXHRcdFx0bmFtZTogJ0VtYmVkIHRoZSBjdXJyZW50IGxpbmUvYmxvY2sgaW50byB5b3VyIFdvcmtiZW5jaC4nLFxyXG5cdFx0XHQvLyBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdTaW1wbGUgQ2FsbGJhY2snKTtcclxuXHRcdFx0Ly8gfSxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7IFxyXG5cdFx0XHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblx0XHRcdFx0aWYgKGxlYWYpIHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbWJlZEJsb2NrSW5Xb3JrYmVuY2goKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7IFxyXG5cdFx0XHRpZDogJ3dvcmtiZW5jaC1jb3B5LWN1cnJlbnQtYmxvY2snLFxyXG5cdFx0XHRuYW1lOiAnQ29weSB0aGUgY3VycmVudCBsaW5lL2Jsb2NrIGludG8geW91ciBXb3JrYmVuY2guJyxcclxuXHRcdFx0Ly8gY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnU2ltcGxlIENhbGxiYWNrJyk7XHJcblx0XHRcdC8vIH0sXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4geyBcclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY29weUJsb2NrSW50b1dvcmtiZW5jaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnd29ya2JlbmNoLWNvcHktYW5kLWxpbmstY3VycmVudC1ibG9jaycsXHJcblx0XHRcdG5hbWU6ICdDb3B5IHRoZSBjdXJyZW50IGxpbmUvYmxvY2sgaW50byB5b3VyIFdvcmtiZW5jaCBhcyBhIG1hcmtkb3duIGxpbmsgdG8gdGhlIGxpbmUvYmxvY2suJyxcclxuXHRcdFx0Ly8gY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnU2ltcGxlIENhbGxiYWNrJyk7XHJcblx0XHRcdC8vIH0sXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4geyBcclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY29weUxpbmVBbmRMaW5rVG9CbG9jaygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnd29ya2JlbmNoLWxpbmstY3VycmVudC1zZWN0aW9uJyxcclxuXHRcdFx0bmFtZTogJ0xpbmsgdGhlIGN1cnJlbnQgaGVhZGluZy9zZWN0aW9uIGludG8geW91ciBXb3JrYmVuY2guJyxcclxuXHRcdFx0Ly8gY2FsbGJhY2s6ICgpID0+IHtcclxuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnU2ltcGxlIENhbGxiYWNrJyk7XHJcblx0XHRcdC8vIH0sXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4geyBcclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubGlua1NlY3Rpb25JbldvcmtiZW5jaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnd29ya2JlbmNoLWVtYmVkLWN1cnJlbnQtc2VjdGlvbicsXHJcblx0XHRcdG5hbWU6ICdFbWJlZCB0aGUgY3VycmVudCBoZWFkaW5nL3NlY3Rpb24gaW50byB5b3VyIFdvcmtiZW5jaC4nLFxyXG5cdFx0XHQvLyBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdTaW1wbGUgQ2FsbGJhY2snKTtcclxuXHRcdFx0Ly8gfSxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7IFxyXG5cdFx0XHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblx0XHRcdFx0aWYgKGxlYWYpIHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbWJlZFNlY3Rpb25JbldvcmtiZW5jaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnY2xlYXItd29ya2JlbmNoJyxcclxuXHRcdFx0bmFtZTogJ0NsZWFyIHRoZSB3b3JrYmVuY2ggbm90ZS4nLFxyXG5cdFx0XHQvLyBjYWxsYmFjazogKCkgPT4ge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdTaW1wbGUgQ2FsbGJhY2snKTtcclxuXHRcdFx0Ly8gfSxcclxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHsgXHJcblx0XHRcdFx0dGhpcy5jbGVhcldvcmtiZW5jaCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoeyBcclxuXHRcdFx0aWQ6ICdpbnNlcnQtd29ya2JlbmNoJyxcclxuXHRcdFx0bmFtZTogJ0luc2VydCB0aGUgY29udGVudHMgb2YgdGhlIHdvcmtiZW5jaCBub3RlLicsXHJcblx0XHRcdC8vIGNhbGxiYWNrOiAoKSA9PiB7XHJcblx0XHRcdC8vIFx0Y29uc29sZS5sb2coJ1NpbXBsZSBDYWxsYmFjaycpO1xyXG5cdFx0XHQvLyB9LFxyXG5cdFx0XHRjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHsgXHJcblx0XHRcdFx0bGV0IGxlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcclxuXHRcdFx0XHRpZiAobGVhZikge1xyXG5cdFx0XHRcdFx0aWYgKCFjaGVja2luZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmluc2VydFdvcmtiZW5jaCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHsgXHJcblx0XHRcdGlkOiAnY2hvb3NlLW5ldy13b3JrYmVuY2gnLFxyXG5cdFx0XHRuYW1lOiAnQ2hhbmdlIHlvdXIgV29ya2JlbmNoLicsXHJcblx0XHRcdC8vIGNhbGxiYWNrOiAoKSA9PiB7XHJcblx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZygnU2ltcGxlIENhbGxiYWNrJyk7XHJcblx0XHRcdC8vIH0sXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4geyBcclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY2hhbmdlV29ya2JlbmNoKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFdvcmtiZW5jaFNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcblx0XHQvKnRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5vbignY29kZW1pcnJvcicsIChjbTogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2NvZGVtaXJyb3InLCBjbSk7XHJcblx0XHR9KSk7ICovXHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlckRvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snLCAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLmFsdENsaWNrVHlwZSAhPSBcIk5vdGhpbmdcIikge1xyXG5cdFx0XHRcdGlmIChldnQuYWx0S2V5KSB7XHJcblx0XHRcdFx0XHRpZiAoKGV2dC50YXJnZXQuY2xhc3NOYW1lID09PSBcImludGVybmFsLWxpbmtcIikgfHwgKGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiY20taG1kLWludGVybmFsLWxpbmtcIikpKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiYWx0XCIpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFsdENsaWNrKGV2dCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLnNldHRpbmdzLm1ldGFBbHRDbGlja1R5cGUgIT0gXCJOb3RoaW5nXCIpIHtcclxuXHRcdFx0XHRpZiAoZXZ0Lm1ldGFLZXkgJiYgZXZ0LmFsdEtleSkge1xyXG5cdFx0XHRcdFx0aWYgKChldnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcImNtLWhtZC1pbnRlcm5hbC1saW5rXCIpKSkge1xyXG5cdFx0XHRcdFx0XHRuZXcgTm90aWNlKFwiU29ycnksIHRoaXMgZG9lc24ndCB3b3JrIHdoZW4geW91IGNsaWNrIGRpcmVjdGx5IG9uIGEgbGluay4gVHJ5IGNsaWNraW5nIG91dHNpZGUgb2YgdGhlIGxpbmshXCIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICgoZXZ0LnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoXCJDb2RlTWlycm9yLWxpbmVcIikpIHx8IGV2dC50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiY21cIikpIHtcclxuXHRcdFx0XHRcdFx0bGV0IGN1cnJlbnRGaWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldy5maWxlO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIm1ldGErYWx0XCIpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1ldGFBbHRDbGljayhldnQsIGN1cnJlbnRGaWxlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVW5sb2FkaW5nIHRoZSBXb3JrYmVuY2ggcGx1Z2luLicpO1xyXG5cdH1cclxuXHJcblx0aW5zZXJ0V29ya2JlbmNoKCkge1xyXG5cdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblx0XHRsZXQgd29ya2JlbmNoTm90ZVRpdGxlID0gdGhpcy5zZXR0aW5ncy53b3JrYmVuY2hOb3RlTmFtZTtcclxuXHRcdGxldCBmaWxlcyA9IG9ic2lkaWFuQXBwLnZhdWx0LmdldEZpbGVzKCk7XHJcblx0XHRcdGNvbnN0IHdvcmtiZW5jaE5vdGVGaWxlID0gZmlsZXMuZmlsdGVyKGUgPT4gZS5uYW1lID09PSB3b3JrYmVuY2hOb3RlVGl0bGUgLy9oYXQtdGlwIPCfjqkgdG8gQE1ySmFja1BoaWwgZm9yIHRoaXMgbGl0dGxlIHdvcmtmbG93IFxyXG5cdFx0XHRcdHx8IGUucGF0aCA9PT0gd29ya2JlbmNoTm90ZVRpdGxlXHJcblx0XHRcdFx0fHwgZS5iYXNlbmFtZSA9PT0gd29ya2JlbmNoTm90ZVRpdGxlXHJcblx0XHRcdClbMF07XHJcblx0XHRcclxuXHRcdGxldCBjdXJyZW50Tm90ZUZpbGUgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3LmZpbGU7XHJcblxyXG5cdFx0bGV0IGVkaXRvciA9IG9ic2lkaWFuQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcclxuXHRcdGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XHJcblx0XHRjb25zb2xlLmxvZyhjdXJzb3IpO1xyXG5cdFx0bGV0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcclxuXHJcblx0XHRvYnNpZGlhbkFwcC52YXVsdC5yZWFkKHdvcmtiZW5jaE5vdGVGaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0ZG9jLnJlcGxhY2VSYW5nZShyZXN1bHQsIGN1cnNvcik7XHJcblx0XHRcdGVkaXRvci5mb2N1cygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbGVhcldvcmtiZW5jaCgpIHtcclxuXHRcdGxldCBvYnNpZGlhbkFwcCA9IHRoaXMuYXBwO1xyXG5cdFx0bGV0IHdvcmtiZW5jaE5vdGVUaXRsZSA9IHRoaXMuc2V0dGluZ3Mud29ya2JlbmNoTm90ZU5hbWU7XHJcblx0XHRsZXQgZWRpdG9yID0gb2JzaWRpYW5BcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0bGV0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdGxldCBmaWxlcyA9IG9ic2lkaWFuQXBwLnZhdWx0LmdldEZpbGVzKCk7XHJcblx0XHRcdGNvbnN0IHdvcmtiZW5jaE5vdGVGaWxlID0gZmlsZXMuZmlsdGVyKGUgPT4gZS5uYW1lID09PSB3b3JrYmVuY2hOb3RlVGl0bGUgLy9oYXQtdGlwIPCfjqkgdG8gQE1ySmFja1BoaWwgZm9yIHRoaXMgbGl0dGxlIHdvcmtmbG93IFxyXG5cdFx0XHRcdHx8IGUucGF0aCA9PT0gd29ya2JlbmNoTm90ZVRpdGxlXHJcblx0XHRcdFx0fHwgZS5iYXNlbmFtZSA9PT0gd29ya2JlbmNoTm90ZVRpdGxlXHJcblx0XHRcdClbMF07XHJcblxyXG5cdFx0b2JzaWRpYW5BcHAudmF1bHQubW9kaWZ5KHdvcmtiZW5jaE5vdGVGaWxlLCBcIlwiKTtcclxuXHRcdGVkaXRvci5zZXRDdXJzb3IoY3Vyc29yKTtcclxuXHRcdGVkaXRvci5mb2N1cygpO1xyXG5cdH1cclxuXHJcblx0c2F2ZVRvV29ya2JlbmNoKHRoZU1hdGVyaWFsOiBzdHJpbmcsIHNhdmVBY3Rpb246IHN0cmluZykge1xyXG5cdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblx0XHRsZXQgZWRpdG9yID0gb2JzaWRpYW5BcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0bGV0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdGxldCBibGFua0xpbmUgPSB0aGlzLnNldHRpbmdzLmluY2x1ZGVCbGFua0xpbmU7XHJcblxyXG5cdFx0bGV0IGxpbmVQcmVmaXggPSB0aGlzLnNldHRpbmdzLndvcmtiZW5jaExpbmVQcmVmaXg7XHJcblxyXG5cdFx0Y29uc29sZS5sb2cobGluZVByZWZpeCArIHRoZU1hdGVyaWFsKTtcclxuXHJcblx0XHRsZXQgd29ya2JlbmNoTm90ZVRpdGxlID0gdGhpcy5zZXR0aW5ncy53b3JrYmVuY2hOb3RlTmFtZTtcclxuXHJcblx0XHRsZXQgZmlsZXMgPSBvYnNpZGlhbkFwcC52YXVsdC5nZXRGaWxlcygpO1xyXG5cdFx0XHRjb25zdCB3b3JrYmVuY2hOb3RlRmlsZSA9IGZpbGVzLmZpbHRlcihlID0+IGUubmFtZSA9PT0gd29ya2JlbmNoTm90ZVRpdGxlIC8vaGF0LXRpcCDwn46pIHRvIEBNckphY2tQaGlsIGZvciB0aGlzIGxpdHRsZSB3b3JrZmxvdyBcclxuXHRcdFx0XHR8fCBlLnBhdGggPT09IHdvcmtiZW5jaE5vdGVUaXRsZVxyXG5cdFx0XHRcdHx8IGUuYmFzZW5hbWUgPT09IHdvcmtiZW5jaE5vdGVUaXRsZVxyXG5cdFx0XHQpWzBdO1xyXG5cclxuXHRcdGNvbnNvbGUubG9nKFwiV29ya2JlbmNoIG5vdGU6XCIgKyB3b3JrYmVuY2hOb3RlRmlsZSk7XHJcblxyXG5cdFx0aWYgKCF3b3JrYmVuY2hOb3RlRmlsZSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRoZSB3b3JrYmVuY2ggbm90ZSBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LiBDcmVhdGluZyBpdCwgdGhlbiBhcHBlbmRpbmcgdGhlIG5ldyBjb250ZW50IHRvIGl0LlwiKTtcclxuXHJcblx0XHRcdGxldCBub3RlVGV4dCA9IGxpbmVQcmVmaXggKyB0aGVNYXRlcmlhbDtcclxuXHRcdFx0bGV0IG5ld1dvcmtiZW5jaEZpbGUgPSBvYnNpZGlhbkFwcC52YXVsdC5jcmVhdGUod29ya2JlbmNoTm90ZVRpdGxlICsgXCIubWRcIiwgbm90ZVRleHQpO1xyXG5cdFx0fSBlbHNlIHsgLy8gVGhlIGZpbGUgZXhpc3RzIFxyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlRoZSB3b3JrYmVuY2ggbm90ZSBhbHJlYWR5IGV4aXN0cy4gQXBwZW5kaW5nIHRoZSBuZXcgY29udGVudCB0byBpdC5cIik7XHJcblx0XHRcdGxldCBwcmV2aW91c05vdGVUZXh0ID0gXCJcIjtcclxuXHRcdFx0b2JzaWRpYW5BcHAudmF1bHQucmVhZCh3b3JrYmVuY2hOb3RlRmlsZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0bGV0IHByZXZpb3VzTm90ZVRleHQgPSByZXN1bHQ7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcIlByZXZpb3VzIG5vdGUgdGV4dDpcXG5cIiArIHByZXZpb3VzTm90ZVRleHQpO1xyXG5cdFx0XHRcdGxldCBsaW5lU3BhY2luZyA9IFwiXFxuXCI7XHJcblx0XHRcdFx0aWYgKGJsYW5rTGluZSkge1xyXG5cdFx0XHRcdFx0bGluZVNwYWNpbmcgPSBcIlxcblxcblwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgbmV3Tm90ZVRleHQgPSBwcmV2aW91c05vdGVUZXh0ICsgbGluZVNwYWNpbmcgKyBsaW5lUHJlZml4ICsgdGhlTWF0ZXJpYWw7XHJcblx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQubW9kaWZ5KHdvcmtiZW5jaE5vdGVGaWxlLCBuZXdOb3RlVGV4dCk7XHJcblx0XHRcdFx0bmV3IE5vdGljZShcIkFkZGVkIFwiICsgc2F2ZUFjdGlvbiArIFwiIHRvIHRoZSB3b3JrYmVuY2guXCIpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZWRpdG9yLnNldEN1cnNvcihjdXJzb3IpO1xyXG5cdFx0ZWRpdG9yLmZvY3VzKCk7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVCbG9ja0hhc2goaW5wdXRUZXh0OiBzdHJpbmcpOiBzdHJpbmcgeyAvLyBDcmVkaXQgdG8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzNDk0MjZcclxuXHRcdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblxyXG5cdFx0XHRsZXQgcmVzdWx0ID0gJyc7XHJcblx0XHRcdHZhciBjaGFyYWN0ZXJzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XHJcblx0XHRcdHZhciBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XHJcblx0XHRcdGZvciAoIHZhciBpID0gMDsgaSA8IDc7IGkrKyApIHtcclxuXHRcdFx0ICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0Z2V0QmxvY2soaW5wdXRMaW5lOiBzdHJpbmcsIG5vdGVGaWxlOiBvYmplY3QpOiBzdHJpbmcgeyAvL1JldHVybnMgdGhlIHN0cmluZyBvZiBhIGJsb2NrIElEIGlmIGJsb2NrIGlzIGZvdW5kLCBvciBcIlwiIGlmIG5vdC5cclxuXHRcdGxldCBvYnNpZGlhbkFwcCA9IHRoaXMuYXBwO1xyXG5cdFx0bGV0IG5vdGVCbG9ja3MgPSBvYnNpZGlhbkFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShub3RlRmlsZSkuYmxvY2tzO1xyXG5cdFx0Y29uc29sZS5sb2coXCJDaGVja2luZyBpZiBsaW5lICdcIiArIGlucHV0TGluZSArIFwiJyBpcyBhIGJsb2NrLlwiKTtcclxuXHRcdGxldCBibG9ja1N0cmluZyA9IFwiXCI7XHJcblx0XHRpZiAobm90ZUJsb2NrcykgeyAvLyB0aGUgZmlsZSBkb2VzIGNvbnRhaW4gYmxvY2tzLiBJZiBub3QsIHJldHVybiBcIlwiXHJcblx0XHRcdGZvciAobGV0IGVhY2hCbG9jayBpbiBub3RlQmxvY2tzKSB7IC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgYmxvY2tzLiBcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkNoZWNraW5nIGJsb2NrIF5cIiArIGVhY2hCbG9jayk7XHJcblx0XHRcdFx0bGV0IGJsb2NrUmVnRXhwID0gbmV3IFJlZ0V4cChcIihcIiArIGVhY2hCbG9jayArIFwiKSRcIiwgXCJnaW1cIik7XHJcblx0XHRcdFx0aWYgKGlucHV0TGluZS5tYXRjaChibG9ja1JlZ0V4cCkpIHsgLy8gaWYgZW5kIG9mIGlucHV0TGluZSBtYXRjaGVzIGJsb2NrLCByZXR1cm4gaXRcclxuXHRcdFx0XHRcdGJsb2NrU3RyaW5nID0gZWFjaEJsb2NrO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJGb3VuZCBibG9jayBeXCIgKyBibG9ja1N0cmluZyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gYmxvY2tTdHJpbmc7XHJcblx0XHRcdFx0fSBcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gYmxvY2tTdHJpbmc7XHJcblx0XHR9IFxyXG5cdFx0cmV0dXJuIGJsb2NrU3RyaW5nO1xyXG5cdH1cclxuXHJcblx0YWx0Q2xpY2soc29tZU1vdXNlRXZlbnQ6IEV2ZW50KSB7XHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHJcblx0XHRsZXQgY2xpY2tUeXBlID0gdGhpcy5zZXR0aW5ncy5hbHRDbGlja1R5cGU7XHJcblxyXG5cdFx0bGV0IGxpbmtQcmVmaXggPSBcIlwiO1xyXG5cdFx0aWYgKGNsaWNrVHlwZSA9PT0gXCJFbWJlZFwiKSB7XHJcblx0XHRcdGxpbmtQcmVmaXggPSBcIiFcIjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgbmV3TWF0ZXJpYWwgPSBsaW5rUHJlZml4ICsgXCJbW1wiICsgc29tZU1vdXNlRXZlbnQudGFyZ2V0LmlubmVyVGV4dCArIFwiXV1cIjtcclxuXHRcdHRoaXMuc2F2ZVRvV29ya2JlbmNoKG5ld01hdGVyaWFsLCBcImEgbGluayB0byB0aGUgc2VsZWN0ZWQgbm90ZVwiKTtcclxuXHR9XHJcblxyXG5cdG1ldGFBbHRDbGljayhzb21lTW91c2VFdmVudDogRXZlbnQsIGFjdGl2ZUZpbGU6IG9iamVjdCkge1xyXG5cdFx0Y29uc29sZS5sb2coXCJNZXRhIGFsdCBjbGlja1wiKTtcclxuXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHJcblx0XHRsZXQgbGluZVRleHQgPSBzb21lTW91c2VFdmVudC50YXJnZXQuaW5uZXJUZXh0O1xyXG5cclxuXHRcdGlmICgoc29tZU1vdXNlRXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcImNtXCIpKSkge1xyXG5cdFx0XHRsaW5lVGV4dCA9IHNvbWVNb3VzZUV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmlubmVyVGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLmxvZyhcIlRoZSBjb250ZW50cyBvZiB0aGUgbGluZSBhcmU6IFwiICsgbGluZVRleHQpO1xyXG5cclxuXHRcdC8vIEdldCB0aGUgZmlsZSBhbmQgY3JlYXRlIGEgbGluayB0byBpdFxyXG5cdFx0bGV0IGN1cnJlbnROb3RlRmlsZSA9IGFjdGl2ZUZpbGU7XHJcblx0XHRsZXQgbm90ZUxpbmsgPSBvYnNpZGlhbkFwcC5tZXRhZGF0YUNhY2hlLmZpbGVUb0xpbmt0ZXh0KGN1cnJlbnROb3RlRmlsZSwgY3VycmVudE5vdGVGaWxlLnBhdGgsIHRydWUpO1xyXG5cclxuXHRcdGxldCBjbGlja1R5cGUgPSB0aGlzLnNldHRpbmdzLm1ldGFBbHRDbGlja1R5cGU7XHJcblxyXG5cdFx0aWYgKGxpbmVUZXh0ICE9IFwiXCIpIHtcclxuXHJcblx0XHRcdGlmIChjbGlja1R5cGUgPT09IFwiQ29weVwiKSB7XHJcblx0XHRcdFx0bGV0IG5ld01hdGVyaWFsID0gbGluZVRleHQ7XHJcblx0XHRcdFx0dGhpcy5zYXZlVG9Xb3JrYmVuY2gobmV3TWF0ZXJpYWwsIFwiYSBjb3B5IG9mIHRoZSBzZWxlY3RlZCBsaW5lL2Jsb2NrXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBsaW5rUHJlZml4ID0gXCJcIjtcclxuXHJcblx0XHRcdFx0aWYgKGNsaWNrVHlwZSA9PT0gXCJFbWJlZFwiKSB7XHJcblx0XHRcdFx0XHRsaW5rUHJlZml4ID0gXCIhXCI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkNoZWNraW5nIGZvciBibG9jazpcIik7XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2V0QmxvY2sobGluZVRleHQsIGN1cnJlbnROb3RlRmlsZSkgPT09IFwiXCIpIHsgLy8gVGhlIGxpbmUgaXMgbm90IGFscmVhZHkgYSBibG9ja1xyXG5cdFx0XHRcdFx0bGluZVRleHQgPSBsaW5lVGV4dC50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlRoaXMgbGluZSBpcyBub3QgY3VycmVudGx5IGEgYmxvY2suIEFkZGluZyBhIGJsb2NrIElELlwiKTtcclxuXHRcdFx0XHRcdGxpbmVCbG9ja0lEID0gdGhpcy5jcmVhdGVCbG9ja0hhc2gobGluZVRleHQpLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRsZXQgbGluZVdpdGhCbG9jayA9IGxpbmVUZXh0ICsgXCIgXlwiICsgbGluZUJsb2NrSUQ7XHJcblx0XHRcdFx0XHRvYnNpZGlhbkFwcC52YXVsdC5yZWFkKGN1cnJlbnROb3RlRmlsZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0XHRcdGxldCBwcmV2aW91c05vdGVUZXh0ID0gcmVzdWx0O1xyXG5cdFx0XHRcdFx0XHRsZXQgbmV3Tm90ZVRleHQgPSBwcmV2aW91c05vdGVUZXh0LnJlcGxhY2UobGluZVRleHQsIGxpbmVXaXRoQmxvY2spO1xyXG5cdFx0XHRcdFx0XHRvYnNpZGlhbkFwcC52YXVsdC5tb2RpZnkoY3VycmVudE5vdGVGaWxlLCBuZXdOb3RlVGV4dCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZXQgbGluZUJsb2NrSUQgPSB0aGlzLmdldEJsb2NrKGxpbmVUZXh0LCBjdXJyZW50Tm90ZUZpbGUpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cobGluZUJsb2NrSUQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFxyXG5cdFx0XHRcdGxldCBuZXdNYXRlcmlhbCA9IGxpbmtQcmVmaXggKyBcIltbXCIgKyBub3RlTGluayArIFwiI15cIiArIGxpbmVCbG9ja0lEICsgXCJdXVwiO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKG5ld01hdGVyaWFsKTtcclxuXHRcdFx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmsgdG8gdGhlIHNlbGVjdGVkIGxpbmUvYmxvY2tcIik7XHJcblx0XHRcdH0gXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuZXcgTm90aWNlKFwiVGhlcmUgaXMgbm90aGluZyBvbiB0aGUgc2VsZWN0ZWQgbGluZS5cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsaW5rTm90ZUluV29ya2JlbmNoKCkgeyAvLyBTYXZlcyBhIGxpbmsgdG8gdGhlIGN1cnJlbnQgbm90ZSB0byB0aGUgd29ya2JlbmNoXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHRcdGxldCBjdXJyZW50VmlldyA9IG9ic2lkaWFuQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XHJcblx0XHQvLyBHZXQgdGhlIGZpbGUgYW5kIGNyZWF0ZSBhIGxpbmsgdG8gaXRcclxuXHRcdGxldCBjdXJyZW50Tm90ZUZpbGUgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3LmZpbGU7XHJcblx0XHRsZXQgbm90ZUxpbmsgPSBvYnNpZGlhbkFwcC5tZXRhZGF0YUNhY2hlLmZpbGVUb0xpbmt0ZXh0KGN1cnJlbnROb3RlRmlsZSwgY3VycmVudE5vdGVGaWxlLnBhdGgsIHRydWUpO1xyXG5cdFx0bGV0IGVkaXRvciA9IGN1cnJlbnRWaWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcblx0XHRcclxuXHRcdGxldCBuZXdNYXRlcmlhbCA9IFwiW1tcIiArIG5vdGVMaW5rICsgXCJdXVwiO1xyXG5cdFx0Y29uc29sZS5sb2cobmV3TWF0ZXJpYWwpO1xyXG5cdFx0dGhpcy5zYXZlVG9Xb3JrYmVuY2gobmV3TWF0ZXJpYWwsIFwiYSBsaW5rIHRvIHRoZSBjdXJyZW50IG5vdGVcIik7XHJcblx0fVxyXG5cclxuXHRlbWJlZE5vdGVJbldvcmtiZW5jaCgpIHsgLy8gU2F2ZXMgYW4gZW1iZWQgb2YgdGhlIGN1cnJlbnQgbm90ZSB0byB0aGUgd29ya2JlbmNoXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHRcdC8vIEdldCB0aGUgZmlsZSBhbmQgY3JlYXRlIGEgbGluayB0byBpdFxyXG5cdFx0bGV0IGN1cnJlbnROb3RlRmlsZSA9IG9ic2lkaWFuQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXcuZmlsZTtcclxuXHRcdGxldCBub3RlTGluayA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQoY3VycmVudE5vdGVGaWxlLCBjdXJyZW50Tm90ZUZpbGUucGF0aCwgdHJ1ZSk7XHJcblx0XHRcclxuXHRcdGxldCBuZXdNYXRlcmlhbCA9IFwiIVtbXCIgKyBub3RlTGluayArIFwiXV1cIjtcclxuXHRcdGNvbnNvbGUubG9nKG5ld01hdGVyaWFsKTtcclxuXHRcdHRoaXMuc2F2ZVRvV29ya2JlbmNoKG5ld01hdGVyaWFsLCBcImFuIGVtYmVkIG9mIHRoZSBjdXJyZW50IG5vdGVcIik7XHJcblx0fVxyXG5cclxuXHRsaW5rU2VjdGlvbkluV29ya2JlbmNoKCkgeyAvLyBTYXZlcyBhIGxpbmsgdG8gdGhlIGN1cnJlbnQgaGVhZGluZyB0byB0aGUgd29ya2JlbmNoXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHJcblx0XHQvLyBnZXQgdGhlIGhlYWRpbmdcclxuXHRcdGxldCBjdXJyZW50VmlldyA9IG9ic2lkaWFuQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XHJcblx0XHRsZXQgY3VycmVudE5vdGVGaWxlID0gY3VycmVudFZpZXcuZmlsZTtcclxuXHRcdGxldCBlZGl0b3IgPSBjdXJyZW50Vmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0dmFyIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcclxuXHRcdGxldCBjdXJyZW50TGluZSA9IGVkaXRvci5kb2Muc2VsLnJhbmdlc1swXS5hbmNob3IubGluZTtcclxuXHJcblx0XHQvLyBTdHVjayBoZXJlLiBGb3Igc29tZSByZWFzb24gdGhlIGFjdGlvbiBvbmx5IHdvcmtzIG9uY2Ugb24gc29tZSBzZWN0aW9ucyB0a3RrdGtcclxuXHJcblx0XHRsZXQgaGVhZGluZ3MgPSBvYnNpZGlhbkFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShjdXJyZW50Tm90ZUZpbGUpLmhlYWRpbmdzO1xyXG5cdFx0bGV0IHNlY3Rpb25IZWFkaW5nO1xyXG5cdFx0Y29uc29sZS5sb2coaGVhZGluZ3MpO1xyXG5cdFx0aWYgKCFoZWFkaW5ncykgeyBcclxuXHRcdFx0bmV3IE5vdGljZShcIk5vIGhlYWRpbmdzIGZvdW5kIGluIHRoZSBjdXJyZW50IGRvY3VtZW50LlwiKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fSBlbHNlIHsgLy8gY2hlY2sgd2hhdCBoZWFkaW5nIGlzIGNsb3Nlc3QgYWJvdmUgdGhlIGN1cnJlbnQgbGluZVxyXG5cdFx0XHRmb3IgKGxldCBlYWNoSGVhZGluZyBvZiBoZWFkaW5ncykge1xyXG5cdFx0XHRcdGxldCBoZWFkaW5nTGluZU51bWJlciA9IGVhY2hIZWFkaW5nLnBvc2l0aW9uLnN0YXJ0LmxpbmU7XHJcblx0XHRcdFx0aWYgKGhlYWRpbmdMaW5lTnVtYmVyID09IGN1cnJlbnRMaW5lKSB7XHJcblx0XHRcdFx0XHRzZWN0aW9uSGVhZGluZyA9IGVhY2hIZWFkaW5nO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChoZWFkaW5nTGluZU51bWJlciA+IGN1cnJlbnRMaW5lKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdHNlY3Rpb25IZWFkaW5nID0gZWFjaEhlYWRpbmc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGxldCBub3RlTGluayA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQoY3VycmVudE5vdGVGaWxlLCBjdXJyZW50Tm90ZUZpbGUucGF0aCwgdHJ1ZSk7XHJcblxyXG5cdFx0bGV0IG5ld01hdGVyaWFsID0gXCJbW1wiICsgbm90ZUxpbmsgKyBcIiNcIiArIHNlY3Rpb25IZWFkaW5nLmhlYWRpbmcgKyBcIl1dXCI7XHJcblx0XHRjb25zb2xlLmxvZyhuZXdNYXRlcmlhbCk7XHJcblx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmsgdG8gdGhlIGN1cnJlbnQgc2VjdGlvblwiKTtcclxuXHR9XHJcblxyXG5cdGVtYmVkU2VjdGlvbkluV29ya2JlbmNoKCkgeyAvLyBTYXZlcyBhbiBlbWJlZCBvZiB0aGUgY3VycmVudCBoZWFkaW5nIHRvIHRoZSB3b3JrYmVuY2hcclxuXHRcdGxldCBvYnNpZGlhbkFwcCA9IHRoaXMuYXBwO1xyXG5cclxuXHRcdC8vIGdldCB0aGUgaGVhZGluZ1xyXG5cdFx0bGV0IGN1cnJlbnRWaWV3ID0gb2JzaWRpYW5BcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldztcclxuXHRcdGxldCBjdXJyZW50Tm90ZUZpbGUgPSBjdXJyZW50Vmlldy5maWxlO1xyXG5cdFx0bGV0IGVkaXRvciA9IGN1cnJlbnRWaWV3LnNvdXJjZU1vZGUuY21FZGl0b3I7XHJcblx0XHR2YXIgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xyXG5cdFxyXG5cdFx0bGV0IGN1cnJlbnRMaW5lID0gZWRpdG9yLmRvYy5zZWwucmFuZ2VzWzBdLmFuY2hvci5saW5lO1xyXG5cclxuXHRcdC8vIFN0dWNrIGhlcmUuIEZvciBzb21lIHJlYXNvbiB0aGUgYWN0aW9uIG9ubHkgd29ya3Mgb25jZSBvbiBzb21lIHNlY3Rpb25zIHRrdGt0a1xyXG5cclxuXHRcdGxldCBoZWFkaW5ncyA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGN1cnJlbnROb3RlRmlsZSkuaGVhZGluZ3M7XHJcblx0XHRsZXQgc2VjdGlvbkhlYWRpbmc7XHJcblx0XHRjb25zb2xlLmxvZyhoZWFkaW5ncyk7XHJcblx0XHRpZiAoIWhlYWRpbmdzKSB7IFxyXG5cdFx0XHRuZXcgTm90aWNlKFwiTm8gaGVhZGluZ3MgZm91bmQgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQuXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9IGVsc2UgeyAvLyBjaGVjayB3aGF0IGhlYWRpbmcgaXMgY2xvc2VzdCBhYm92ZSB0aGUgY3VycmVudCBsaW5lXHJcblx0XHRcdGZvciAobGV0IGVhY2hIZWFkaW5nIG9mIGhlYWRpbmdzKSB7XHJcblx0XHRcdFx0bGV0IGhlYWRpbmdMaW5lTnVtYmVyID0gZWFjaEhlYWRpbmcucG9zaXRpb24uc3RhcnQubGluZTtcclxuXHRcdFx0XHRpZiAoaGVhZGluZ0xpbmVOdW1iZXIgPT0gY3VycmVudExpbmUpIHtcclxuXHRcdFx0XHRcdHNlY3Rpb25IZWFkaW5nID0gZWFjaEhlYWRpbmc7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGhlYWRpbmdMaW5lTnVtYmVyID4gY3VycmVudExpbmUpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0c2VjdGlvbkhlYWRpbmcgPSBlYWNoSGVhZGluZztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0bGV0IG5vdGVMaW5rID0gb2JzaWRpYW5BcHAubWV0YWRhdGFDYWNoZS5maWxlVG9MaW5rdGV4dChjdXJyZW50Tm90ZUZpbGUsIGN1cnJlbnROb3RlRmlsZS5wYXRoLCB0cnVlKTtcclxuXHJcblx0XHRsZXQgbmV3TWF0ZXJpYWwgPSBcIiFbW1wiICsgbm90ZUxpbmsgKyBcIiNcIiArIHNlY3Rpb25IZWFkaW5nLmhlYWRpbmcgKyBcIl1dXCI7XHJcblx0XHRjb25zb2xlLmxvZyhuZXdNYXRlcmlhbCk7XHJcblx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmsgdG8gdGhlIGN1cnJlbnQgc2VjdGlvblwiKTtcclxuXHR9XHJcblxyXG5cdGxpbmtCbG9ja0luV29ya2JlbmNoKCkgeyAvLyBMaW5rcyB0aGUgY3VycmVudCBibG9jayB0byB0aGUgd29ya2JlbmNoXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHJcblx0XHQvLyBnZXQgdGhlIGJsb2NrXHJcblx0XHRsZXQgY3VycmVudFZpZXcgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xyXG5cdFx0bGV0IGN1cnJlbnROb3RlRmlsZSA9IGN1cnJlbnRWaWV3LmZpbGU7XHJcblx0XHRsZXQgZWRpdG9yID0gY3VycmVudFZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcclxuXHRcdHZhciBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XHJcblx0XHRsZXQgbGluZVRleHQgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSk7XHJcblx0XHRjb25zb2xlLmxvZyhsaW5lVGV4dCk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJDaGVja2luZyBmb3IgYmxvY2s6XCIpO1xyXG5cdFx0bGV0IGxpbmVCbG9ja0lEID0gdGhpcy5nZXRCbG9jayhsaW5lVGV4dCwgY3VycmVudE5vdGVGaWxlKTtcclxuXHRcdGNvbnNvbGUubG9nKGxpbmVCbG9ja0lEKTtcclxuXHJcblx0XHRpZiAodGhpcy5nZXRCbG9jayhsaW5lVGV4dCwgY3VycmVudE5vdGVGaWxlKSA9PT0gXCJcIikgeyAvLyBUaGUgbGluZSBpcyBub3QgYWxyZWFkeSBhIGJsb2NrXHJcblx0XHRcdGNvbnNvbGUubG9nKFwiVGhpcyBsaW5lIGlzIG5vdCBjdXJyZW50bHkgYSBibG9jay4gQWRkaW5nIGEgYmxvY2sgSUQuXCIpO1xyXG5cdFx0XHRsaW5lQmxvY2tJRCA9IHRoaXMuY3JlYXRlQmxvY2tIYXNoKGxpbmVUZXh0KS50b1N0cmluZygpO1xyXG5cdFx0XHRsZXQgbGluZVdpdGhCbG9jayA9IGxpbmVUZXh0ICsgXCIgXlwiICsgbGluZUJsb2NrSUQ7XHJcblx0XHRcdG9ic2lkaWFuQXBwLnZhdWx0LnJlYWQoY3VycmVudE5vdGVGaWxlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuXHRcdFx0XHRsZXQgcHJldmlvdXNOb3RlVGV4dCA9IHJlc3VsdDtcclxuXHRcdFx0XHRsZXQgbmV3Tm90ZVRleHQgPSBwcmV2aW91c05vdGVUZXh0LnJlcGxhY2UobGluZVRleHQsIGxpbmVXaXRoQmxvY2spO1xyXG5cdFx0XHRcdG9ic2lkaWFuQXBwLnZhdWx0Lm1vZGlmeShjdXJyZW50Tm90ZUZpbGUsIG5ld05vdGVUZXh0KTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgbm90ZUxpbmsgPSBvYnNpZGlhbkFwcC5tZXRhZGF0YUNhY2hlLmZpbGVUb0xpbmt0ZXh0KGN1cnJlbnROb3RlRmlsZSwgY3VycmVudE5vdGVGaWxlLnBhdGgsIHRydWUpO1xyXG5cclxuXHRcdGxldCBuZXdNYXRlcmlhbCA9IFwiW1tcIiArIG5vdGVMaW5rICsgXCIjXlwiICsgbGluZUJsb2NrSUQgKyBcIl1dXCI7XHJcblx0XHRjb25zb2xlLmxvZyhuZXdNYXRlcmlhbCk7XHJcblx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmsgdG8gdGhlIGN1cnJlbnQgYmxvY2tcIik7XHJcblx0fVxyXG5cclxuXHRlbWJlZEJsb2NrSW5Xb3JrYmVuY2goKSB7IC8vIFNhdmVzIGFuIGVtYmVkIG9mIHRoZSBjdXJyZW50IGJsb2NrIHRvIHRoZSB3b3JrYmVuY2hcclxuXHRcdGxldCBvYnNpZGlhbkFwcCA9IHRoaXMuYXBwO1xyXG5cclxuXHRcdC8vIGdldCB0aGUgYmxvY2tcclxuXHRcdGxldCBjdXJyZW50VmlldyA9IG9ic2lkaWFuQXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XHJcblx0XHRsZXQgY3VycmVudE5vdGVGaWxlID0gY3VycmVudFZpZXcuZmlsZTtcclxuXHRcdGxldCBlZGl0b3IgPSBjdXJyZW50Vmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0dmFyIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdGxldCBsaW5lVGV4dCA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKTtcclxuXHRcdGNvbnNvbGUubG9nKGxpbmVUZXh0KTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcIkNoZWNraW5nIGZvciBibG9jazpcIik7XHJcblx0XHRsZXQgbGluZUJsb2NrSUQgPSB0aGlzLmdldEJsb2NrKGxpbmVUZXh0LCBjdXJyZW50Tm90ZUZpbGUpO1xyXG5cdFx0Y29uc29sZS5sb2cobGluZUJsb2NrSUQpO1xyXG5cclxuXHRcdGlmICh0aGlzLmdldEJsb2NrKGxpbmVUZXh0LCBjdXJyZW50Tm90ZUZpbGUpID09PSBcIlwiKSB7IC8vIFRoZSBsaW5lIGlzIG5vdCBhbHJlYWR5IGEgYmxvY2tcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGlzIGxpbmUgaXMgbm90IGN1cnJlbnRseSBhIGJsb2NrLiBBZGRpbmcgYSBibG9jayBJRC5cIik7XHJcblx0XHRcdGxpbmVCbG9ja0lEID0gdGhpcy5jcmVhdGVCbG9ja0hhc2gobGluZVRleHQpLnRvU3RyaW5nKCk7XHJcblx0XHRcdGxldCBsaW5lV2l0aEJsb2NrID0gbGluZVRleHQgKyBcIiBeXCIgKyBsaW5lQmxvY2tJRDtcclxuXHRcdFx0b2JzaWRpYW5BcHAudmF1bHQucmVhZChjdXJyZW50Tm90ZUZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdGxldCBwcmV2aW91c05vdGVUZXh0ID0gcmVzdWx0O1xyXG5cdFx0XHRcdGxldCBuZXdOb3RlVGV4dCA9IHByZXZpb3VzTm90ZVRleHQucmVwbGFjZShsaW5lVGV4dCwgbGluZVdpdGhCbG9jayk7XHJcblx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQubW9kaWZ5KGN1cnJlbnROb3RlRmlsZSwgbmV3Tm90ZVRleHQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBub3RlTGluayA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQoY3VycmVudE5vdGVGaWxlLCBjdXJyZW50Tm90ZUZpbGUucGF0aCwgdHJ1ZSk7XHJcblxyXG5cdFx0bGV0IG5ld01hdGVyaWFsID0gXCIhW1tcIiArIG5vdGVMaW5rICsgXCIjXlwiICsgbGluZUJsb2NrSUQgKyBcIl1dXCI7XHJcblx0XHRjb25zb2xlLmxvZyhuZXdNYXRlcmlhbCk7XHJcblx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmsgdG8gdGhlIGN1cnJlbnQgYmxvY2tcIik7XHJcblx0fVxyXG5cclxuXHRjb3B5QmxvY2tJbnRvV29ya2JlbmNoKCkgeyAvLyBDb3BpZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGN1cnJlbnQgYmxvY2sgdG8gdGhlIHdvcmtiZW5jaFxyXG5cdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblxyXG5cdFx0bGV0IGN1cnJlbnRWaWV3ID0gb2JzaWRpYW5BcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldztcclxuXHRcdGxldCBlZGl0b3IgPSBjdXJyZW50Vmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0dmFyIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdGxldCBsaW5lVGV4dCA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKTtcclxuXHRcdGNvbnNvbGUubG9nKGxpbmVUZXh0KTtcclxuXHJcblx0XHRsZXQgbmV3TWF0ZXJpYWwgPSBsaW5lVGV4dDtcclxuXHRcdGNvbnNvbGUubG9nKG5ld01hdGVyaWFsKTtcclxuXHRcdHRoaXMuc2F2ZVRvV29ya2JlbmNoKG5ld01hdGVyaWFsLCBcImEgY29weSBvZiB0aGUgY3VycmVudCBibG9ja1wiKTtcclxuXHR9XHJcblxyXG5cdGNvcHlMaW5lQW5kTGlua1RvQmxvY2soKSB7IC8vIENvcGllcyB0aGUgY29udGVudCBvZiB0aGUgY3VycmVudCBibG9jayB0byB0aGUgd29ya2JlbmNoXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHJcblx0XHRsZXQgY3VycmVudFZpZXcgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xyXG5cdFx0bGV0IGN1cnJlbnROb3RlRmlsZSA9IGN1cnJlbnRWaWV3LmZpbGU7XHJcblx0XHRsZXQgZWRpdG9yID0gY3VycmVudFZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcclxuXHRcdHZhciBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XHJcblx0XHRsZXQgbGluZVRleHQgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSk7XHJcblx0XHRjb25zb2xlLmxvZyhsaW5lVGV4dCk7XHJcblxyXG5cdFx0Ly90cmltIGJsb2NrIHRleHQgdGt0a3RrXHJcblxyXG5cdFx0bGV0IGJsb2NrSURSZWdleCA9IG5ldyBSZWdFeHAoXCIvKFxccyl7MCwxfVtcXF5dezF9KFthLXpBLVowLTlcXC1dKykkL1wiLCBcImdpbVwiKTtcclxuXHJcblx0XHRsZXQgbGluZVRleHRXaXRob3V0QmxvY2tJRCA9IGxpbmVUZXh0LnJlcGxhY2UoYmxvY2tJRFJlZ2V4LCBcIlwiKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcIkNoZWNraW5nIGZvciBibG9jazpcIik7XHJcblx0XHRsZXQgbGluZUJsb2NrSUQgPSB0aGlzLmdldEJsb2NrKGxpbmVUZXh0LCBjdXJyZW50Tm90ZUZpbGUpO1xyXG5cdFx0Y29uc29sZS5sb2cobGluZUJsb2NrSUQpO1xyXG5cclxuXHRcdGlmICh0aGlzLmdldEJsb2NrKGxpbmVUZXh0LCBjdXJyZW50Tm90ZUZpbGUpID09PSBcIlwiKSB7IC8vIFRoZSBsaW5lIGlzIG5vdCBhbHJlYWR5IGEgYmxvY2tcclxuXHRcdFx0Y29uc29sZS5sb2coXCJUaGlzIGxpbmUgaXMgbm90IGN1cnJlbnRseSBhIGJsb2NrLiBBZGRpbmcgYSBibG9jayBJRC5cIik7XHJcblx0XHRcdGxpbmVCbG9ja0lEID0gdGhpcy5jcmVhdGVCbG9ja0hhc2gobGluZVRleHQpLnRvU3RyaW5nKCk7XHJcblx0XHRcdGxldCBsaW5lV2l0aEJsb2NrID0gbGluZVRleHQgKyBcIiBeXCIgKyBsaW5lQmxvY2tJRDtcclxuXHRcdFx0b2JzaWRpYW5BcHAudmF1bHQucmVhZChjdXJyZW50Tm90ZUZpbGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG5cdFx0XHRcdGxldCBwcmV2aW91c05vdGVUZXh0ID0gcmVzdWx0O1xyXG5cdFx0XHRcdGxldCBuZXdOb3RlVGV4dCA9IHByZXZpb3VzTm90ZVRleHQucmVwbGFjZShsaW5lVGV4dCwgbGluZVdpdGhCbG9jayk7XHJcblx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQubW9kaWZ5KGN1cnJlbnROb3RlRmlsZSwgbmV3Tm90ZVRleHQpO1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBub3RlTGluayA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQoY3VycmVudE5vdGVGaWxlLCBjdXJyZW50Tm90ZUZpbGUucGF0aCwgdHJ1ZSk7XHJcblxyXG5cdFx0bGV0IGVuY29kZWROb3RlTGluayA9IGVuY29kZVVSSUNvbXBvbmVudChub3RlTGluayk7XHJcblxyXG5cdFx0bGV0IG5ld01hdGVyaWFsID0gXCJbXCIgKyBsaW5lVGV4dFdpdGhvdXRCbG9ja0lEICsgXCJdXCIgKyBcIihcIiArIGVuY29kZWROb3RlTGluayArIFwiI15cIiArIGxpbmVCbG9ja0lEICsgXCIpXCI7XHJcblx0XHRjb25zb2xlLmxvZyhuZXdNYXRlcmlhbCk7XHJcblx0XHR0aGlzLnNhdmVUb1dvcmtiZW5jaChuZXdNYXRlcmlhbCwgXCJhIGxpbmtlZCBjb3B5IG9mIHRoZSBjdXJyZW50IGJsb2NrXCIpO1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlV29ya2JlbmNoKCkge1xyXG5cdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblxyXG5cdFx0bmV3IHdvcmtiZW5jaE5hbWVNb2RhbChvYnNpZGlhbkFwcCkub3BlbigpO1xyXG5cdH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIHdvcmtiZW5jaE5hbWVNb2RhbCBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPHN0cmluZz4geyAvLyB0aGFua3MgdG8gTGljYXQgZm9yIHRoZSBhc3Npc3QhXHJcblx0YXBwOiBBcHA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHApIHtcclxuICAgICAgICBzdXBlcihhcHApO1xyXG5cdFx0dGhpcy5hcHAgPSBhcHA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbXMoKTogc3RyaW5nW10ge1xyXG5cdFx0bGV0IGZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG5cdFx0bGV0IGZpbGVMaXN0ID0gZmlsZXMubWFwKGZpbGUgPT4gZmlsZS5uYW1lKTtcclxuICAgICAgICByZXR1cm4gZmlsZUxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNob29zZUl0ZW0oaXRlbTogc3RyaW5nLCBldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcblx0XHRsZXQgd29ya2JlbmNoUGx1Z2luID0gdGhpcy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJ3b3JrYmVuY2gtb2JzaWRpYW5cIik7XHJcblx0XHR3b3JrYmVuY2hQbHVnaW4uc2V0dGluZ3Mud29ya2JlbmNoTm90ZU5hbWUgPSBpdGVtO1xyXG5cdFx0d29ya2JlbmNoUGx1Z2luLnNhdmVEYXRhKHdvcmtiZW5jaFBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRuZXcgTm90aWNlKFwiWW91ciB3b3JrYmVuY2ggaXMgbm93IFwiICsgaXRlbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFdvcmtiZW5jaFNldHRpbmdzIHtcclxuXHR3b3JrYmVuY2hOb3RlTmFtZSA9IFwiV29ya2JlbmNoXCI7XHJcblx0d29ya2JlbmNoTGluZVByZWZpeCA9IFwiXCI7XHJcblx0YWx0Q2xpY2tUeXBlID0gXCJMaW5rXCI7XHJcblx0bWV0YUFsdENsaWNrVHlwZSA9IFwiRW1iZWRcIjtcclxuXHRpbmNsdWRlQmxhbmtMaW5lID0gZmFsc2U7XHJcbn1cclxuXHJcbmNsYXNzIFdvcmtiZW5jaFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuXHRkaXNwbGF5KCk6IHZvaWQge1xyXG5cdFx0bGV0IHtjb250YWluZXJFbH0gPSB0aGlzO1xyXG5cdFx0Y29uc3QgcGx1Z2luOiBhbnkgPSAodGhpcyBhcyBhbnkpLnBsdWdpbjtcclxuXHJcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnV29ya2JlbmNoIFNldHRpbmdzJ30pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnV29ya2JlbmNoIG5vdGUgbmFtZScpXHJcblx0XHRcdC5zZXREZXNjKCdQcm92aWRlIGEgdGl0bGUgZm9yIHRoZSB3b3JrYmVuY2ggbm90ZS4gRGVmYXVsdCBpcyBXb3JrYmVuY2guJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiBcclxuXHRcdFx0XHR0ZXh0XHJcblx0XHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJ1dvcmtiZW5jaCcpXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLndvcmtiZW5jaE5vdGVOYW1lKVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRwbHVnaW4uc2V0dGluZ3Mud29ya2JlbmNoTm90ZU5hbWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0fSkpO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnV29ya2JlbmNoIGxpbmUgcHJlZml4JylcclxuXHRcdFx0LnNldERlc2MoJ1NldCB0aGUgcHJlZml4IHRvIGVhY2ggbGluZSBhZGRlZCB0byBXb3JrYmVuY2guIERlZmF1bHQgaXMgbm90aGluZy4nKVxyXG5cdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IFxyXG5cdFx0XHRcdHRleHRcclxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignJylcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3Mud29ya2JlbmNoTGluZVByZWZpeClcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLndvcmtiZW5jaExpbmVQcmVmaXggPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0JsYW5rIGxpbmVzJylcclxuXHRcdFx0LnNldERlc2MoJ1RvZ2dsZSB3aGV0aGVyIHRoZXJlIHNob3VsZCBiZSBhIGJsYW5rIGxpbmUgYmV0d2VlbiBlYWNoIFdvcmtiZW5jaCBlbnRyeS4nKVxyXG5cdFx0XHQuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcclxuXHRcdFx0XHR0b2dnbGUuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmluY2x1ZGVCbGFua0xpbmUpO1xyXG5cdFx0XHRcdHRvZ2dsZS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdHBsdWdpbi5zZXR0aW5ncy5pbmNsdWRlQmxhbmtMaW5lID0gdmFsdWU7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkluY2x1ZGUgYmxhbmsgbGluZXMgYmV0d2VlbiBlbnRyaWVzOlwiICsgdmFsdWUpO1xyXG5cdFx0XHRcdCAgXHRwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdBbHQrQ2xpY2sgdHlwZScpXHJcblx0XHRcdC5zZXREZXNjKCdTZXQgd2hhdCBoYXBwZW5zIHdoZW4geW91IGFsdCtjbGljayBvbiBhIGxpbmsuIERlZmF1bHQgaXMgdG8gY29weSB0aGUgbGluayBpbnRvIHRoZSBXb3JrYmVuY2guIE5vdGU6IGlmIHlvdXIgY3Vyc29yIGlzIG5vdCBhbHJlYWR5IG9uIHRoZSB0YXJnZXRlZCBsaW5lLCB5b3UgbWF5IG5lZWQgdG8gZG91YmxlLWNsaWNrIScpXHJcblx0XHRcdC5hZGREcm9wZG93bihkcm9wRG93biA9PlxyXG5cdFx0XHRcdGRyb3BEb3duXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9uKFwiTGlua1wiLCBcIkxpbmsgc2VsZWN0ZWQgbm90ZSBpbiBXb3JrYmVuY2hcIilcclxuXHRcdFx0XHRcdC5hZGRPcHRpb24oXCJFbWJlZFwiLCBcIkVtYmVkIHNlbGVjdGVkIG5vdGUgaW4gV29ya2JlbmNoXCIpXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9uKFwiTm90aGluZ1wiLCBcIk5vdGhpbmdcIilcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuYWx0Q2xpY2tUeXBlKVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKCh2YWx1ZTogc3RyaW5nKSA9PiB7XHJcblx0XHRcdFx0XHRcdHBsdWdpbi5zZXR0aW5ncy5hbHRDbGlja1R5cGUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ01ldGErQWx0K0NsaWNrIHR5cGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnU2V0IHdoYXQgaGFwcGVucyB3aGVuIHlvdSBjbWQvY3RybCthbHQrY2xpY2sgb24gYSBsaW5lLiBEZWZhdWx0IGlzIHRvIGxpbmsgdGhlIGxpbmUgYXMgYSBibG9jayBpbnRvIHRoZSBXb3JrYmVuY2guIE5vdGU6IGlmIHlvdXIgY3Vyc29yIGlzIG5vdCBhbHJlYWR5IG9uIHRoZSB0YXJnZXRlZCBsaW5lLCB5b3UgbWF5IG5lZWQgdG8gZG91YmxlLWNsaWNrIScpXHJcblx0XHRcdC5hZGREcm9wZG93bihkcm9wRG93biA9PlxyXG5cdFx0XHRcdGRyb3BEb3duXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9uKFwiTGlua1wiLCBcIkxpbmsgYmxvY2tcIilcclxuXHRcdFx0XHRcdC5hZGRPcHRpb24oXCJFbWJlZFwiLCBcIkVtYmVkIGJsb2NrXCIpXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9uKFwiQ29weVwiLCBcIkNvcHkgbGluZVwiKVxyXG5cdFx0XHRcdFx0LmFkZE9wdGlvbihcIk5vdGhpbmdcIiwgXCJOb3RoaW5nXCIpXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLm1ldGFBbHRDbGlja1R5cGUpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLm1ldGFBbHRDbGlja1R5cGUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHR9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk1hcmtkb3duUHJldmlld1ZpZXciLCJOb3RpY2UiLCJQbHVnaW4iLCJGdXp6eVN1Z2dlc3RNb2RhbCIsIlNldHRpbmciLCJQbHVnaW5TZXR0aW5nVGFiIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElB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

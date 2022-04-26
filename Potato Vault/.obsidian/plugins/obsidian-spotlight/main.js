'use strict';

var obsidian = require('obsidian');

/**
 * Return boolean if all tags present in obsidian note
 * @param file - obsidian note file
 * @param tagList - list of tags
 * @param metadataCache - vault metadata handler
 */
function FilterMDFilesByTags(file, tagList, metadataCache) {
    if (!tagList) {
        return true;
    }
    let tags = obsidian.getAllTags(metadataCache.getFileCache(file)).map(e => e.slice(1, e.length));
    if (tags && tags.length > 0) {
        return tagList.every(function (val) { return tags.indexOf(val) >= 0; });
    }
    return false;
}
/**
 * Return random number between min and max
 * @param min - minimum possible number
 * @param max - maximum possible number
 */
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Return random note based on tags, block presence and path match
 * @param fileList - note md file list
 * @param tagList - list of tags
 * @param metadataCache - vault metadata handler
 * @param match - path regex match
 * @param currentPath - path of current note
 * @param block - whether to consider blocks or note
 */
function chooseRandomNote(fileList, tagList, metadataCache, match, currentPath, block, settings) {
    // Remove "" from tag list if present
    if (tagList.contains("")) {
        if (tagList.length === 1) {
            tagList = null;
        }
        else {
            tagList = tagList.splice(tagList.indexOf(""), 1);
        }
    }
    let regex;
    // Catch errors such as '.**' caused by bad regex expressions
    try {
        regex = new RegExp(match);
    }
    catch (error) {
        regex = ".*";
    }
    let fileFiltered = fileList.filter(file => file.path.match(regex) &&
        FilterMDFilesByTags(file, tagList, metadataCache) &&
        (!block || metadataCache.getFileCache(file).blocks) &&
        !settings.ignoreList.contains(file.path));
    let rand = randomNumber(0, fileFiltered.length - 1);
    if (fileFiltered.length === 0) {
        return null;
    }
    if (fileFiltered[rand].path == currentPath && fileFiltered.length == 1) {
        return null;
    }
    while (fileFiltered[rand].path == currentPath) {
        rand = randomNumber(0, fileFiltered.length - 1);
    }
    return fileFiltered[rand];
}
/**
 * Return random block from note
 * @param text - note full text
 * @param blocks - note metadata cache blocks
 */
function randomBlock(text, blocks) {
    let blockKeys = Object.keys(blocks);
    let rand = randomNumber(0, blockKeys.length - 1);
    let pos = blocks[blockKeys[rand]].position;
    return text.slice(pos.start.offset, pos.end.offset);
}

class SpotlightSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        let ignoreFile = '';
        let unignoreFile = '';
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Spotlight Settings' });
        new obsidian.Setting(containerEl)
            .setName('Default Width')
            .setDesc('Width in %. integer, placeholder shows current value.')
            .addText(text => text
            .setPlaceholder(`${this.plugin.settings.divWidth}`)
            .onChange(async (value) => {
            let numValue = parseInt(value);
            if (isNaN(numValue)) {
                return;
            }
            this.plugin.settings.divWidth = Math.abs(numValue);
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('Default Height')
            .setDesc('Height in pixels. integer, placeholder shows current value.')
            .addText(text => text
            .setPlaceholder(`${this.plugin.settings.divHeight}`)
            .onChange(async (value) => {
            let numValue = parseInt(value);
            if (isNaN(numValue)) {
                return;
            }
            this.plugin.settings.divHeight = Math.abs(numValue);
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName('Ignore file:')
            .setDesc('Add file to ignore list. Must be full vault path file name e.g. Folder 1/SubFolder/File_to_ignore.md')
            .addButton(text => text
            .setButtonText('Save')
            .onClick(() => {
            if (ignoreFile === '/' || ignoreFile === '' || this.plugin.settings.ignoreList.contains(ignoreFile)) {
                return;
            }
            this.plugin.settings.ignoreList.push(ignoreFile);
            ignoreFile = '';
            this.plugin.saveSettings();
        }))
            .addText(text => text
            .setPlaceholder(ignoreFile)
            .onChange(async (value) => {
            ignoreFile = value.trim();
        }));
        new obsidian.Setting(containerEl)
            .setName('Unignore file:')
            .setDesc('Remove file from ignore list. Must be full vault path file name e.g. Folder 1/SubFolder/File_to_ignore.md')
            .addButton(text => text
            .setButtonText('Save')
            .onClick(() => {
            if (unignoreFile === '/' || !this.plugin.settings.ignoreList.contains(unignoreFile)) {
                return;
            }
            this.plugin.settings.ignoreList.splice(this.plugin.settings.ignoreList.indexOf(unignoreFile), 1);
            unignoreFile = '';
            this.plugin.saveSettings();
        }))
            .addText(text => text
            .setPlaceholder(unignoreFile)
            .onChange(async (value) => {
            unignoreFile = value.trim();
        }));
        new obsidian.Setting(containerEl)
            .setName('Ignored List:')
            .setDesc(this.plugin.settings.ignoreList.join(" --------- "));
    }
}

class SpotlightProcessor {
    async run(Comp, source, el, ctx, app, settings, block) {
        let args = {
            tags: '',
            match: '.*',
            divWidth: settings.divWidth,
            divHeight: settings.divHeight,
            divAlign: 'left'
        };
        source.split('\n').map(e => {
            var _a;
            if (e) {
                let param = e.trim().split('=');
                args[param[0]] = (_a = param[1]) === null || _a === void 0 ? void 0 : _a.trim();
            }
        });
        let currentNote = ctx.sourcePath;
        let randomNote = chooseRandomNote(app.vault.getMarkdownFiles(), args.tags.split(';'), app.metadataCache, args.match, currentNote, block, settings);
        let elCanvas = el.createDiv({ cls: 'spotlight-container', attr: { id: 'container' } });
        elCanvas.setAttribute('style', `width:${args.divWidth}%; height:${args.divHeight}px; float: ${args.divAlign};`);
        if (!randomNote) {
            elCanvas.setText('No note was found for the given search parameters!');
            return;
        }
        let text = await app.vault.cachedRead(randomNote);
        elCanvas.createEl('a', { cls: "internal-link", href: `${randomNote.path}` }).createEl('i', {
            cls: 'fa fa-external-link spotlight-link',
            attr: { 'aria-hidden': 'true', 'style': 'float: right; padding-top: 10px; color: var(--text-normal);' }
        });
        if (block) {
            let blocks = app.metadataCache.getFileCache(randomNote).blocks;
            obsidian.MarkdownRenderer.renderMarkdown(randomBlock(text, blocks), elCanvas, currentNote, Comp);
            return;
        }
        obsidian.MarkdownRenderer.renderMarkdown(text, elCanvas, currentNote, Comp);
    }
}

const SETTINGS = {
    ignoreList: [],
    divWidth: 50,
    divHeight: 400
};

class SpotlightPlugin extends obsidian.Plugin {
    async onload() {
        // Load message
        await this.loadSettings();
        console.log('Loaded Spotlight Plugin');
        // Register note spotlight renderer
        this.registerMarkdownCodeBlockProcessor('spotlight-note', async (source, el, ctx) => {
            const proc = new SpotlightProcessor();
            await proc.run(this, source, el, ctx, this.app, this.settings, false);
        });
        // Register block spotlight renderer
        this.registerMarkdownCodeBlockProcessor('spotlight-block', async (source, el, ctx) => {
            const proc = new SpotlightProcessor();
            await proc.run(this, source, el, ctx, this.app, this.settings, true);
        });
        this.addSettingTab(new SpotlightSettingTab(this.app, this));
    }
    onunload() {
        console.log('unloading Spotlight Plugin');
    }
    async loadSettings() {
        this.settings = Object.assign({}, SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}

module.exports = SpotlightPlugin;

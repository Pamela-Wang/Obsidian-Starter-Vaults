var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => ImageCaptionPlugin
});
var import_obsidian2 = __toModule(require("obsidian"));

// src/md_processor.ts
var import_obsidian = __toModule(require("obsidian"));
function internalCaptionObserver(plugin, ctx) {
  return new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      if (!mutation.target.matches("span.image-embed")) {
        continue;
      }
      let caption_text = mutation.target.getAttribute("alt");
      if (caption_text === mutation.target.getAttribute("src")) {
        continue;
      }
      if (mutation.target.querySelector(ImageCaptionPlugin.caption_selector)) {
        continue;
      }
      const parsed = parseCaptionText(caption_text, plugin.settings.delimeter);
      const size = parsed.size;
      caption_text = parsed.text;
      if (caption_text) {
        const caption = addCaption(mutation.target, caption_text, plugin.settings.htmlCaption);
        ctx.addChild(caption);
      }
      if (size) {
        setSize(mutation.target, size);
      }
    }
    updateFigureIndices();
    plugin.removeObserver(observer);
  });
}
function externalCaptionObserver(plugin) {
  return new MutationObserver((mutations, observer) => {
    let update = false;
    for (const mutation of mutations) {
      const captions = [...mutation.addedNodes].filter((elm) => {
        return elm.matches(ImageCaptionPlugin.caption_selector);
      });
      if (captions.length) {
        update = true;
      }
    }
    if (update) {
      updateFigureIndices();
      plugin.removeObserver(observer);
    }
  });
}
function parseCaptionText(text, delimeter) {
  let start, end;
  let start_delim, end_delim;
  if (delimeter.length === 0) {
    start_delim = "";
    end_delim = "";
    start = 0;
    end = text.length;
  } else if (delimeter.length == 1) {
    start_delim = delimeter[0];
    end_delim = delimeter[0];
    start = text.indexOf(start_delim);
    end = text.lastIndexOf(end_delim);
  } else if (delimeter.length === 2) {
    start_delim = delimeter[0];
    end_delim = delimeter[1];
    start = text.indexOf(start_delim);
    end = text.lastIndexOf(end_delim);
  } else {
    return {
      text: void 0,
      size: void 0
    };
  }
  let caption, remaining_text;
  if (start === -1 || end === -1 || start === end) {
    caption = void 0;
    remaining_text = [text];
  } else {
    const start_offset = start_delim.length;
    const end_offset = end_delim.length;
    caption = text.slice(start + start_offset, end);
    remaining_text = [
      text.slice(0, start),
      text.slice(end + end_offset)
    ];
  }
  let size = parseSize(remaining_text[0]);
  if (!size) {
    size = parseSize(remaining_text[1]);
  }
  return { text: caption, size };
}
function parseSize(text) {
  if (!text) {
    return void 0;
  }
  const size_pattern = /(\d+|auto)x(\d+|auto)/i;
  const match = text.match(size_pattern);
  if (!match) {
    return void 0;
  }
  return {
    width: match[1],
    height: match[2]
  };
}
function addCaption(target, caption_text, asHtml = false) {
  const caption = document.createElement(ImageCaptionPlugin.caption_tag);
  caption.addClass(ImageCaptionPlugin.caption_class);
  if (asHtml) {
    caption.innerHTML = caption_text;
  } else {
    caption.innerText = caption_text;
  }
  target.appendChild(caption);
  return new import_obsidian.MarkdownRenderChild(caption);
}
function setSize(target, size) {
  const { width, height } = size;
  const img = target.querySelector("img");
  target.setAttribute("width", width);
  target.setAttribute("height", height);
  img.setAttribute("width", width);
  img.setAttribute("height", height);
}
function updateFigureIndices() {
  document.querySelectorAll("div.workspace-leaf").forEach((workspace) => {
    let index = 1;
    workspace.querySelectorAll(ImageCaptionPlugin.caption_selector).forEach((el) => {
      el.dataset.imageCaptionIndex = index;
      index += 1;
    });
  });
}
function processInternalImageCaption(plugin) {
  return function(el, ctx) {
    el.querySelectorAll("span.internal-embed").forEach((container) => {
      const observer = internalCaptionObserver(plugin, ctx);
      observer.observe(container, { attributes: true, attributesFilter: ["class"] });
      plugin.addObserver(observer);
    });
  };
}
function processExternalImageCaption(plugin) {
  return function(el, ctx) {
    const container_css_class = "obsidian-image-caption-external-embed";
    elms = [...el.querySelectorAll("img")];
    elms.filter((elm) => {
      return !elm.closest("span.internal-embed");
    }).forEach((img) => {
      if (img.closest(`.${container_css_class}`)) {
        return;
      }
      let caption_text = img.getAttribute("alt");
      const parsed = parseCaptionText(caption_text, plugin.settings.delimeter);
      const size = parsed.size;
      caption_text = parsed.text;
      if (!(caption_text || size)) {
        return;
      }
      const container = document.createElement("span");
      container.addClass(container_css_class);
      const observer = externalCaptionObserver(plugin, ctx);
      observer.observe(container, { childList: true });
      plugin.addObserver(observer);
      img.replaceWith(container);
      container.appendChild(img);
      if (caption_text) {
        const caption = addCaption(container, caption_text, plugin.settings.htmlCaption);
        ctx.addChild(new import_obsidian.MarkdownRenderChild(container));
        ctx.addChild(caption);
      }
      if (size) {
        setSize(container, size);
      }
    });
  };
}

// src/main.ts
var DEFAULT_SETTINGS = {
  css: "",
  label: "",
  delimeter: []
};
var _ImageCaptionPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.caption_observers = [];
      this.registerMarkdownPostProcessor(processInternalImageCaption(this));
      this.registerMarkdownPostProcessor(processExternalImageCaption(this));
      this.addStylesheet();
      this.addSettingTab(new ImageCaptionSettingTab(this.app, this));
    });
  }
  onunload() {
    this.stylesheet.remove();
    this.clearObservers();
    this.removeCaptions();
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  addObserver(observer) {
    this.caption_observers.push(observer);
  }
  removeObserver(observer) {
    observer.disconnect();
    const index = this.caption_observers.indexOf(observer);
    this.caption_observers.splice(index, 1);
  }
  clearObservers() {
    for (const observer of this.caption_observers) {
      observer.disconnect();
    }
    this.caption_observers = [];
  }
  addStylesheet() {
    this.stylesheet = document.createElement("style");
    this.stylesheet.setAttribute("type", "text/css");
    this.updateStylesheet();
    document.head.append(this.stylesheet);
  }
  updateStylesheet() {
    const css = this.settings.css ? `${_ImageCaptionPlugin.caption_selector} { ${this.settings.css} }` : "";
    let label = this.settings.label;
    if (label) {
      const number_pattern = /(^|[^\\])#/g;
      label = label.replace(number_pattern, "$1' attr(data-image-caption-index) '");
      label = label.replace("\\#", "#");
      label = `${_ImageCaptionPlugin.caption_selector}::before { content: '${label} ' }`;
    }
    this.stylesheet.innerText = `${css} ${label}`;
  }
  removeCaptions() {
    for (const caption of document.querySelectorAll(_ImageCaptionPlugin.caption_selector)) {
      caption.remove();
    }
  }
};
var ImageCaptionPlugin = _ImageCaptionPlugin;
ImageCaptionPlugin.caption_tag = "figcaption";
ImageCaptionPlugin.caption_class = "obsidian-image-caption";
ImageCaptionPlugin.caption_selector = `${_ImageCaptionPlugin.caption_tag}.${_ImageCaptionPlugin.caption_class}`;
var ImageCaptionSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    let { containerEl } = this;
    containerEl.empty();
    new import_obsidian2.Setting(containerEl).setName("Label").setDesc("Prepend this text before each caption.").addText((text) => text.setPlaceholder("Label").setValue(this.plugin.settings.label).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.label = value.trim();
      yield this.plugin.saveSettings();
      this.plugin.updateStylesheet();
    })));
    new import_obsidian2.Setting(containerEl).setName("CSS").setDesc("Custom CSS styling for captions.").addTextArea((text) => text.setPlaceholder("Enter your CSS").setValue(this.plugin.settings.css).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.css = value.trim();
      yield this.plugin.saveSettings();
      this.plugin.updateStylesheet();
    })));
    const delimeter = new import_obsidian2.Setting(containerEl).setName("Delimeter").setDesc("Identify the caption by surrounding it with the delimeter. Start and end delimeters mays be specified by separation with a comma (,).").setTooltip("If no delimeter is provided the entire alt text is taken to be the caption. If a single delimeter is specified it must indicate the start and end of the caption. If two delimeters are specified, by separation with a comma, the caption is taken to be the text between the start and end delimeters.");
    delimeter.addText((text) => text.setPlaceholder("Delimeter").setValue(this.plugin.settings.delimeter.join(", ")).onChange((value) => __async(this, null, function* () {
      let delimeters = value.split(",").map((d) => d.trim());
      if (delimeters.length > 2) {
        delimeter.controlEl.addClass("setting-error");
        return;
      }
      if (delimeters.length === 2 && delimeters.some((d) => !d)) {
        delimeter.controlEl.addClass("setting-error");
        return;
      }
      if (delimeters.length === 1 && delimeters[0] === "") {
        delimeters = [];
      }
      delimeter.controlEl.removeClass("setting-error");
      this.plugin.settings.delimeter = delimeters;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian2.Setting(containerEl).setName("Caption as HTML").setDesc("Insert caption text as HTML.").addToggle((toggle) => toggle.setValue(this.plugin.settings.htmlCaption).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.htmlCaption = value;
      yield this.plugin.saveSettings();
    })));
  }
};

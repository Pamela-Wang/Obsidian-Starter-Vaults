'use strict';

var obsidian = require('obsidian');

const VIEW_TYPE = "cross-reference-navigation";

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function tagParts(tag) {
    let temp = tag.slice();
    if (tag.startsWith("#")) {
        temp = temp.slice(1);
    }
    if (temp.contains('/')) {
        const split = temp.split('/');
        const label = split.shift();
        const title = split.join('/');
        return {
            tag: tag,
            label: label,
            title: title
        };
    }
    else {
        return {
            tag: tag,
            title: temp
        };
    }
}

/* src/ui/TagTitle.svelte generated by Svelte v3.35.0 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-thzrmn-style";
	style.textContent = "p.svelte-thzrmn{margin:0}.strong.svelte-thzrmn{font-weight:bold}.small.svelte-thzrmn{font-size:12px;line-height:14px}.muted.svelte-thzrmn{opacity:0.5}";
	append(document.head, style);
}

// (20:0) {:else}
function create_else_block$1(ctx) {
	let p;
	let span;
	let t0_value = (/*label*/ ctx[2] ? /*label*/ ctx[2] + "/" : "") + "";
	let t0;
	let t1;
	let p_class_value;

	return {
		c() {
			p = element("p");
			span = element("span");
			t0 = text(t0_value);
			t1 = text(/*title*/ ctx[3]);
			attr(span, "class", "muted svelte-thzrmn");
			attr(p, "class", p_class_value = "" + (null_to_empty(/*strong*/ ctx[1] ? "strong" : "") + " svelte-thzrmn"));
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, span);
			append(span, t0);
			append(p, t1);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 4 && t0_value !== (t0_value = (/*label*/ ctx[2] ? /*label*/ ctx[2] + "/" : "") + "")) set_data(t0, t0_value);
			if (dirty & /*title*/ 8) set_data(t1, /*title*/ ctx[3]);

			if (dirty & /*strong*/ 2 && p_class_value !== (p_class_value = "" + (null_to_empty(/*strong*/ ctx[1] ? "strong" : "") + " svelte-thzrmn"))) {
				attr(p, "class", p_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (15:0) {#if !inline}
function create_if_block$1(ctx) {
	let div;
	let p0;
	let t0_value = (/*label*/ ctx[2] ? /*label*/ ctx[2] + "/" : "") + "";
	let t0;
	let t1;
	let p1;
	let t2;
	let div_class_value;

	return {
		c() {
			div = element("div");
			p0 = element("p");
			t0 = text(t0_value);
			t1 = space();
			p1 = element("p");
			t2 = text(/*title*/ ctx[3]);
			attr(p0, "class", "small muted svelte-thzrmn");
			attr(p1, "class", "svelte-thzrmn");
			attr(div, "class", div_class_value = "" + (null_to_empty(/*strong*/ ctx[1] ? "strong" : "") + " svelte-thzrmn"));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, p0);
			append(p0, t0);
			append(div, t1);
			append(div, p1);
			append(p1, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*label*/ 4 && t0_value !== (t0_value = (/*label*/ ctx[2] ? /*label*/ ctx[2] + "/" : "") + "")) set_data(t0, t0_value);
			if (dirty & /*title*/ 8) set_data(t2, /*title*/ ctx[3]);

			if (dirty & /*strong*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*strong*/ ctx[1] ? "strong" : "") + " svelte-thzrmn"))) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

function create_fragment$1(ctx) {
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (!/*inline*/ ctx[0]) return create_if_block$1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { tag } = $$props;
	let { inline = false } = $$props;
	let { strong = false } = $$props;
	let label;
	let title;

	function recalc(tag) {
		let parts = tagParts(tag);
		$$invalidate(2, label = parts.label);
		$$invalidate(3, title = parts.title);
	}

	$$self.$$set = $$props => {
		if ("tag" in $$props) $$invalidate(4, tag = $$props.tag);
		if ("inline" in $$props) $$invalidate(0, inline = $$props.inline);
		if ("strong" in $$props) $$invalidate(1, strong = $$props.strong);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*tag*/ 16) {
			recalc(tag);
		}
	};

	return [inline, strong, label, title, tag];
}

class TagTitle extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-thzrmn-style")) add_css$1();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { tag: 4, inline: 0, strong: 1 });
	}
}

/* src/ui/TagMenu.svelte generated by Svelte v3.35.0 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1597r1-style";
	style.textContent = "p.svelte-1597r1.svelte-1597r1{margin:0}.path.svelte-1597r1.svelte-1597r1{display:flex;align-items:flex-end}.path.svelte-1597r1>.svelte-1597r1{margin:0 5px}.muted.svelte-1597r1.svelte-1597r1{opacity:0.5}.strong.svelte-1597r1.svelte-1597r1{font-weight:bold}.small.svelte-1597r1.svelte-1597r1{font-size:12px}.label.svelte-1597r1.svelte-1597r1{white-space:nowrap;margin-right:4px}.flex.svelte-1597r1.svelte-1597r1{display:flex;justify-content:flex-start}.align-bottom.svelte-1597r1.svelte-1597r1{align-items:flex-end}.align-center.svelte-1597r1.svelte-1597r1{align-items:center}.flex-wrap.svelte-1597r1.svelte-1597r1{flex-wrap:wrap}.spacer.svelte-1597r1.svelte-1597r1{width:10px;height:10px}.flex-spacer.svelte-1597r1.svelte-1597r1{flex-grow:1;flex-shrink:0;width:5px}.hscroll.svelte-1597r1.svelte-1597r1{max-width:100%;overflow:auto}.mutedLink.svelte-1597r1.svelte-1597r1{cursor:pointer;opacity:0.5;transition:all 0.2 ease}.mutedLink.svelte-1597r1.svelte-1597r1:hover{opacity:1}.link.svelte-1597r1.svelte-1597r1{cursor:pointer;background:transparent;border-radius:3px;transition:all 0.25s ease;font-size:14px}.link.svelte-1597r1.svelte-1597r1:hover{background:var(--interactive-accent);color:var(--text-on-accent);padding-left:4px}.small.svelte-1597r1.svelte-1597r1{font-size:13px}ul.svelte-1597r1.svelte-1597r1{list-style:none;padding-left:0;margin:0}li.intersection.svelte-1597r1.svelte-1597r1:before{content:\"+\";margin-right:4px;opacity:0.5}li.note.svelte-1597r1.svelte-1597r1:before{content:\"→\";margin-right:4px}.cutoff.svelte-1597r1.svelte-1597r1{max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.btn.svelte-1597r1.svelte-1597r1{cursor:pointer;padding:4px 10px;border-radius:100px;border:1px solid var(--interactive-accent);font-weight:bold;font-size:12px;margin-right:10px;transition:all 0.2s ease}.btn.svelte-1597r1.svelte-1597r1:hover,.btn.selected.svelte-1597r1.svelte-1597r1{background:var(--interactive-accent);color:var(--text-on-accent)}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[25] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[28] = list[i];
	return child_ctx;
}

function get_each_context_3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	return child_ctx;
}

function get_each_context_4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	return child_ctx;
}

function get_each_context_5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[28] = list[i];
	return child_ctx;
}

function get_each_context_6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[28] = list[i];
	return child_ctx;
}

function get_each_context_7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[25] = list[i];
	return child_ctx;
}

function get_each_context_8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[28] = list[i];
	child_ctx[43] = i;
	return child_ctx;
}

// (44:6) {#each $viewStore.selectedTags as tag, index}
function create_each_block_8(ctx) {
	let div0;
	let t1;
	let div1;
	let tagtitle;
	let current;
	let mounted;
	let dispose;
	tagtitle = new TagTitle({ props: { tag: /*tag*/ ctx[28] } });

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[9](/*tag*/ ctx[28], /*index*/ ctx[43], ...args);
	}

	return {
		c() {
			div0 = element("div");
			div0.textContent = "›";
			t1 = space();
			div1 = element("div");
			create_component(tagtitle.$$.fragment);
			attr(div0, "class", "svelte-1597r1");
			attr(div1, "class", "link svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			mount_component(tagtitle, div1, null);
			current = true;

			if (!mounted) {
				dispose = listen(div1, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const tagtitle_changes = {};
			if (dirty[0] & /*$viewStore*/ 32) tagtitle_changes.tag = /*tag*/ ctx[28];
			tagtitle.$set(tagtitle_changes);
		},
		i(local) {
			if (current) return;
			transition_in(tagtitle.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tagtitle.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div0);
			if (detaching) detach(t1);
			if (detaching) detach(div1);
			destroy_component(tagtitle);
			mounted = false;
			dispose();
		}
	};
}

// (62:10) {#if label !== "" && label !== "favorite tags"}
function create_if_block_5(ctx) {
	let div;
	let t_value = /*label*/ ctx[25] + "";
	let t;
	let div_class_value;
	let mounted;
	let dispose;

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[10](/*label*/ ctx[25], ...args);
	}

	return {
		c() {
			div = element("div");
			t = text(t_value);

			attr(div, "class", div_class_value = "" + (null_to_empty(/*$settingsStore*/ ctx[6].favoriteGroups.includes(/*label*/ ctx[25])
			? "btn selected"
			: "btn") + " svelte-1597r1"));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_2);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore*/ 32 && t_value !== (t_value = /*label*/ ctx[25] + "")) set_data(t, t_value);

			if (dirty[0] & /*$settingsStore, $viewStore*/ 96 && div_class_value !== (div_class_value = "" + (null_to_empty(/*$settingsStore*/ ctx[6].favoriteGroups.includes(/*label*/ ctx[25])
			? "btn selected"
			: "btn") + " svelte-1597r1"))) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (61:8) {#each $viewStore.groupsSorted as label}
function create_each_block_7(ctx) {
	let if_block_anchor;
	let if_block = /*label*/ ctx[25] !== "" && /*label*/ ctx[25] !== "favorite tags" && create_if_block_5(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (/*label*/ ctx[25] !== "" && /*label*/ ctx[25] !== "favorite tags") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (72:8) {#each $viewStore.tagsSorted["favorite tags"] || [] as tag}
function create_each_block_6(ctx) {
	let div;
	let t_value = /*tag*/ ctx[28] + "";
	let t;
	let mounted;
	let dispose;

	function click_handler_3(...args) {
		return /*click_handler_3*/ ctx[11](/*tag*/ ctx[28], ...args);
	}

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", "btn selected svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_3);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore*/ 32 && t_value !== (t_value = /*tag*/ ctx[28] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (75:8) {#each $viewStore.tagsSorted[""] || [] as tag}
function create_each_block_5(ctx) {
	let div;
	let t_value = /*tag*/ ctx[28] + "";
	let t;
	let mounted;
	let dispose;

	function click_handler_4(...args) {
		return /*click_handler_4*/ ctx[12](/*tag*/ ctx[28], ...args);
	}

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", "btn svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_4);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore*/ 32 && t_value !== (t_value = /*tag*/ ctx[28] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (83:4) {#if $viewStore.allMatchingFiles.length > 3}
function create_if_block_1(ctx) {
	let each_1_anchor;
	let current;
	let each_value_1 = /*$viewStore*/ ctx[5].groupsSorted;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty[0] & /*viewStore, $viewStore, columns, openFile*/ 170) {
				each_value_1 = /*$viewStore*/ ctx[5].groupsSorted;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (94:14) {#if $viewStore.toShow[label][tag].files.length > 5}
function create_if_block_4(ctx) {
	let ul;
	let t;
	let div;
	let current;
	let each_value_4 = /*$viewStore*/ ctx[5].crossrefsSorted[/*label*/ ctx[25]][/*tag*/ ctx[28]].slice(0, 5);
	let each_blocks = [];

	for (let i = 0; i < each_value_4.length; i += 1) {
		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			div = element("div");
			attr(ul, "class", "svelte-1597r1");
			attr(div, "class", "spacer svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, ul, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			insert(target, t, anchor);
			insert(target, div, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty[0] & /*viewStore, $viewStore, columns*/ 42) {
				each_value_4 = /*$viewStore*/ ctx[5].crossrefsSorted[/*label*/ ctx[25]][/*tag*/ ctx[28]].slice(0, 5);
				let i;

				for (i = 0; i < each_value_4.length; i += 1) {
					const child_ctx = get_each_context_4(ctx, each_value_4, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_4(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(ul, null);
					}
				}

				group_outros();

				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_4.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(ul);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t);
			if (detaching) detach(div);
		}
	};
}

// (96:18) {#each $viewStore.crossrefsSorted[label][tag].slice(0, 5) as tag2}
function create_each_block_4(ctx) {
	let li;
	let div0;
	let tagtitle;
	let t0;
	let div1;
	let t1;
	let span;
	let t2_value = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].crossrefs[/*tag2*/ ctx[33]] + "";
	let t2;
	let t3;
	let current;
	let mounted;
	let dispose;

	tagtitle = new TagTitle({
			props: { tag: /*tag2*/ ctx[33], inline: true }
		});

	function click_handler_6(...args) {
		return /*click_handler_6*/ ctx[14](/*tag*/ ctx[28], /*tag2*/ ctx[33], ...args);
	}

	return {
		c() {
			li = element("li");
			div0 = element("div");
			create_component(tagtitle.$$.fragment);
			t0 = space();
			div1 = element("div");
			t1 = space();
			span = element("span");
			t2 = text(t2_value);
			t3 = space();
			attr(div0, "class", "flex small svelte-1597r1");
			attr(div1, "class", "flex-spacer svelte-1597r1");
			attr(span, "class", "muted svelte-1597r1");
			attr(li, "class", "intersection flex link svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, div0);
			mount_component(tagtitle, div0, null);
			append(li, t0);
			append(li, div1);
			append(li, t1);
			append(li, span);
			append(span, t2);
			append(li, t3);
			current = true;

			if (!mounted) {
				dispose = listen(li, "click", click_handler_6);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const tagtitle_changes = {};
			if (dirty[0] & /*$viewStore, columns*/ 40) tagtitle_changes.tag = /*tag2*/ ctx[33];
			tagtitle.$set(tagtitle_changes);
			if ((!current || dirty[0] & /*$viewStore, columns*/ 40) && t2_value !== (t2_value = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].crossrefs[/*tag2*/ ctx[33]] + "")) set_data(t2, t2_value);
		},
		i(local) {
			if (current) return;
			transition_in(tagtitle.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(tagtitle.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(li);
			destroy_component(tagtitle);
			mounted = false;
			dispose();
		}
	};
}

// (109:16) {#each $viewStore.toShow[label][tag].files.slice(0, 5) as file}
function create_each_block_3(ctx) {
	let li;
	let t_value = /*file*/ ctx[22].basename + "";
	let t;
	let mounted;
	let dispose;

	function click_handler_7(...args) {
		return /*click_handler_7*/ ctx[15](/*file*/ ctx[22], ...args);
	}

	return {
		c() {
			li = element("li");
			t = text(t_value);
			attr(li, "class", "small note cutoff link svelte-1597r1");
			attr(li, "style", "max-width:" + columnWidth + "px");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);

			if (!mounted) {
				dispose = listen(li, "click", click_handler_7);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore, columns*/ 40 && t_value !== (t_value = /*file*/ ctx[22].basename + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

// (86:10) {#each $viewStore.tagsSorted[label].slice(0, $viewStore.expandedGroups.includes(label) ? $viewStore.tagsSorted[label].length : columns) as tag}
function create_each_block_2(ctx) {
	let div2;
	let div1;
	let tagtitle;
	let t0;
	let div0;
	let t1;
	let span;
	let t2_value = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.length + "";
	let t2;
	let t3;
	let t4;
	let ul;
	let t5;
	let current;
	let mounted;
	let dispose;

	tagtitle = new TagTitle({
			props: {
				tag: /*tag*/ ctx[28],
				inline: false,
				strong: true
			}
		});

	function click_handler_5(...args) {
		return /*click_handler_5*/ ctx[13](/*tag*/ ctx[28], ...args);
	}

	let if_block = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.length > 5 && create_if_block_4(ctx);
	let each_value_3 = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.slice(0, 5);
	let each_blocks = [];

	for (let i = 0; i < each_value_3.length; i += 1) {
		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
	}

	return {
		c() {
			div2 = element("div");
			div1 = element("div");
			create_component(tagtitle.$$.fragment);
			t0 = space();
			div0 = element("div");
			t1 = space();
			span = element("span");
			t2 = text(t2_value);
			t3 = space();
			if (if_block) if_block.c();
			t4 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t5 = space();
			attr(div0, "class", "flex-spacer svelte-1597r1");
			attr(span, "class", "muted strong svelte-1597r1");
			attr(div1, "class", "flex align-bottom link svelte-1597r1");
			attr(ul, "class", "svelte-1597r1");
			attr(div2, "style", "margin: " + columnMargin + "px; width: " + columnWidth + "px;");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div1);
			mount_component(tagtitle, div1, null);
			append(div1, t0);
			append(div1, div0);
			append(div1, t1);
			append(div1, span);
			append(span, t2);
			append(div2, t3);
			if (if_block) if_block.m(div2, null);
			append(div2, t4);
			append(div2, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			append(div2, t5);
			current = true;

			if (!mounted) {
				dispose = listen(div1, "click", click_handler_5);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const tagtitle_changes = {};
			if (dirty[0] & /*$viewStore, columns*/ 40) tagtitle_changes.tag = /*tag*/ ctx[28];
			tagtitle.$set(tagtitle_changes);
			if ((!current || dirty[0] & /*$viewStore, columns*/ 40) && t2_value !== (t2_value = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.length + "")) set_data(t2, t2_value);

			if (/*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.length > 5) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty[0] & /*$viewStore, columns*/ 40) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div2, t4);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty[0] & /*openFile, $viewStore, columns*/ 168) {
				each_value_3 = /*$viewStore*/ ctx[5].toShow[/*label*/ ctx[25]][/*tag*/ ctx[28]].files.slice(0, 5);
				let i;

				for (i = 0; i < each_value_3.length; i += 1) {
					const child_ctx = get_each_context_3(ctx, each_value_3, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_3.length;
			}
		},
		i(local) {
			if (current) return;
			transition_in(tagtitle.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(tagtitle.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div2);
			destroy_component(tagtitle);
			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

// (116:8) {#if $viewStore.tagsSorted[label].length > columns && label.length > 0}
function create_if_block_2(ctx) {
	let show_if;
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (show_if == null || dirty[0] & /*$viewStore*/ 32) show_if = !!!/*$viewStore*/ ctx[5].expandedGroups.includes(/*label*/ ctx[25]);
		if (show_if) return create_if_block_3;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx, [-1]);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (119:10) {:else}
function create_else_block(ctx) {
	let div;
	let t0;
	let t1_value = /*label*/ ctx[25] + "";
	let t1;
	let mounted;
	let dispose;

	function click_handler_9(...args) {
		return /*click_handler_9*/ ctx[17](/*label*/ ctx[25], ...args);
	}

	return {
		c() {
			div = element("div");
			t0 = text("Show less in ");
			t1 = text(t1_value);
			attr(div, "class", "small mutedLink svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_9);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore*/ 32 && t1_value !== (t1_value = /*label*/ ctx[25] + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (117:10) {#if !$viewStore.expandedGroups.includes(label)}
function create_if_block_3(ctx) {
	let div;
	let t0;
	let t1_value = /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length - /*columns*/ ctx[3] + "";
	let t1;
	let t2;
	let t3_value = /*label*/ ctx[25] + "";
	let t3;
	let mounted;
	let dispose;

	function click_handler_8(...args) {
		return /*click_handler_8*/ ctx[16](/*label*/ ctx[25], ...args);
	}

	return {
		c() {
			div = element("div");
			t0 = text("Show ");
			t1 = text(t1_value);
			t2 = text(" more in ");
			t3 = text(t3_value);
			attr(div, "class", "small mutedLink svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, t1);
			append(div, t2);
			append(div, t3);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_8);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore, columns*/ 40 && t1_value !== (t1_value = /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length - /*columns*/ ctx[3] + "")) set_data(t1, t1_value);
			if (dirty[0] & /*$viewStore*/ 32 && t3_value !== (t3_value = /*label*/ ctx[25] + "")) set_data(t3, t3_value);
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (84:6) {#each $viewStore.groupsSorted as label}
function create_each_block_1(ctx) {
	let div;
	let t0;
	let t1;
	let hr;
	let current;

	let each_value_2 = /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].slice(0, /*$viewStore*/ ctx[5].expandedGroups.includes(/*label*/ ctx[25])
	? /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length
	: /*columns*/ ctx[3]);

	let each_blocks = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	let if_block = /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length > /*columns*/ ctx[3] && /*label*/ ctx[25].length > 0 && create_if_block_2(ctx);

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			hr = element("hr");
			attr(div, "class", "flex flex-wrap svelte-1597r1");
			attr(div, "style", "margin: 0 -" + columnMargin + "px;");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			insert(target, t0, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, hr, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty[0] & /*$viewStore, columns, openFile, viewStore*/ 170) {
				each_value_2 = /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].slice(0, /*$viewStore*/ ctx[5].expandedGroups.includes(/*label*/ ctx[25])
				? /*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length
				: /*columns*/ ctx[3]);

				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_2(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (/*$viewStore*/ ctx[5].tagsSorted[/*label*/ ctx[25]].length > /*columns*/ ctx[3] && /*label*/ ctx[25].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(t1.parentNode, t1);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_2.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			if (detaching) detach(t0);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(t1);
			if (detaching) detach(hr);
		}
	};
}

// (126:4) {#if $viewStore.selectedTags.length > 0}
function create_if_block(ctx) {
	let strong;
	let t1;
	let div;
	let t2;
	let ul;
	let each_value = /*$viewStore*/ ctx[5].allMatchingFiles;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			strong = element("strong");
			strong.textContent = "All notes";
			t1 = space();
			div = element("div");
			t2 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "spacer svelte-1597r1");
			attr(ul, "class", "svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, strong, anchor);
			insert(target, t1, anchor);
			insert(target, div, anchor);
			insert(target, t2, anchor);
			insert(target, ul, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*openFile, $viewStore*/ 160) {
				each_value = /*$viewStore*/ ctx[5].allMatchingFiles;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) detach(strong);
			if (detaching) detach(t1);
			if (detaching) detach(div);
			if (detaching) detach(t2);
			if (detaching) detach(ul);
			destroy_each(each_blocks, detaching);
		}
	};
}

// (130:8) {#each $viewStore.allMatchingFiles as file}
function create_each_block(ctx) {
	let li;
	let t_value = /*file*/ ctx[22].basename + "";
	let t;
	let mounted;
	let dispose;

	function click_handler_10(...args) {
		return /*click_handler_10*/ ctx[18](/*file*/ ctx[22], ...args);
	}

	return {
		c() {
			li = element("li");
			t = text(t_value);
			attr(li, "class", "note link svelte-1597r1");
		},
		m(target, anchor) {
			insert(target, li, anchor);
			append(li, t);

			if (!mounted) {
				dispose = listen(li, "click", click_handler_10);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*$viewStore*/ 32 && t_value !== (t_value = /*file*/ ctx[22].basename + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(li);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let div10;
	let div9;
	let div2;
	let div0;
	let tagtitle0;
	let t0;
	let t1;
	let p0;
	let t2_value = /*$viewStore*/ ctx[5].allMatchingFiles.length + "";
	let t2;
	let t3;
	let t4;
	let div1;
	let tagtitle1;
	let t5;
	let hr0;
	let t6;
	let div8;
	let div4;
	let p1;
	let t8;
	let div3;
	let t9;
	let t10;
	let div5;
	let t11;
	let div7;
	let p2;
	let t13;
	let div6;
	let t14;
	let t15;
	let t16;
	let hr1;
	let t17;
	let t18;
	let div9_style_value;
	let div10_resize_listener;
	let current;
	let mounted;
	let dispose;
	tagtitle0 = new TagTitle({ props: { tag: "All Tags" } });
	let each_value_8 = /*$viewStore*/ ctx[5].selectedTags;
	let each_blocks_3 = [];

	for (let i = 0; i < each_value_8.length; i += 1) {
		each_blocks_3[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
	}

	const out = i => transition_out(each_blocks_3[i], 1, 1, () => {
		each_blocks_3[i] = null;
	});

	tagtitle1 = new TagTitle({ props: { tag: "A/A" } });
	let each_value_7 = /*$viewStore*/ ctx[5].groupsSorted;
	let each_blocks_2 = [];

	for (let i = 0; i < each_value_7.length; i += 1) {
		each_blocks_2[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
	}

	let each_value_6 = /*$viewStore*/ ctx[5].tagsSorted["favorite tags"] || [];
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_6.length; i += 1) {
		each_blocks_1[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
	}

	let each_value_5 = /*$viewStore*/ ctx[5].tagsSorted[""] || [];
	let each_blocks = [];

	for (let i = 0; i < each_value_5.length; i += 1) {
		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
	}

	let if_block0 = /*$viewStore*/ ctx[5].allMatchingFiles.length > 3 && create_if_block_1(ctx);
	let if_block1 = /*$viewStore*/ ctx[5].selectedTags.length > 0 && create_if_block(ctx);

	return {
		c() {
			div10 = element("div");
			div9 = element("div");
			div2 = element("div");
			div0 = element("div");
			create_component(tagtitle0.$$.fragment);
			t0 = space();

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				each_blocks_3[i].c();
			}

			t1 = space();
			p0 = element("p");
			t2 = text(t2_value);
			t3 = text(" notes");
			t4 = space();
			div1 = element("div");
			create_component(tagtitle1.$$.fragment);
			t5 = space();
			hr0 = element("hr");
			t6 = space();
			div8 = element("div");
			div4 = element("div");
			p1 = element("p");
			p1.textContent = "Favorite groups:";
			t8 = space();
			div3 = element("div");
			t9 = space();

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t10 = space();
			div5 = element("div");
			t11 = space();
			div7 = element("div");
			p2 = element("p");
			p2.textContent = "Favorite tags:";
			t13 = space();
			div6 = element("div");
			t14 = space();

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t15 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t16 = space();
			hr1 = element("hr");
			t17 = space();
			if (if_block0) if_block0.c();
			t18 = space();
			if (if_block1) if_block1.c();
			attr(div0, "class", "link svelte-1597r1");
			attr(p0, "class", "muted small svelte-1597r1");
			set_style(p0, "margin-left", "10px");
			set_style(p0, "align-self", "flex-end");
			set_style(div1, "visibility", "hidden");
			attr(div1, "class", "svelte-1597r1");
			attr(div2, "class", "path svelte-1597r1");
			attr(p1, "class", "small muted label svelte-1597r1");
			attr(div3, "class", "spacer svelte-1597r1");
			attr(div4, "class", "flex align-center svelte-1597r1");
			attr(div5, "class", "spacer svelte-1597r1");
			attr(p2, "class", "small muted label svelte-1597r1");
			attr(div6, "class", "spacer svelte-1597r1");
			attr(div7, "class", "flex align-center svelte-1597r1");
			attr(div8, "class", "hscroll svelte-1597r1");
			attr(div9, "style", div9_style_value = "width: " + /*contentWidth*/ ctx[4] + "px; margin: 0 auto;");
			add_render_callback(() => /*div10_elementresize_handler*/ ctx[19].call(div10));
		},
		m(target, anchor) {
			insert(target, div10, anchor);
			append(div10, div9);
			append(div9, div2);
			append(div2, div0);
			mount_component(tagtitle0, div0, null);
			append(div2, t0);

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				each_blocks_3[i].m(div2, null);
			}

			append(div2, t1);
			append(div2, p0);
			append(p0, t2);
			append(p0, t3);
			append(div2, t4);
			append(div2, div1);
			mount_component(tagtitle1, div1, null);
			append(div9, t5);
			append(div9, hr0);
			append(div9, t6);
			append(div9, div8);
			append(div8, div4);
			append(div4, p1);
			append(div4, t8);
			append(div4, div3);
			append(div4, t9);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(div4, null);
			}

			append(div8, t10);
			append(div8, div5);
			append(div8, t11);
			append(div8, div7);
			append(div7, p2);
			append(div7, t13);
			append(div7, div6);
			append(div7, t14);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div7, null);
			}

			append(div7, t15);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div7, null);
			}

			append(div9, t16);
			append(div9, hr1);
			append(div9, t17);
			if (if_block0) if_block0.m(div9, null);
			append(div9, t18);
			if (if_block1) if_block1.m(div9, null);
			div10_resize_listener = add_resize_listener(div10, /*div10_elementresize_handler*/ ctx[19].bind(div10));
			current = true;

			if (!mounted) {
				dispose = listen(div0, "click", /*click_handler*/ ctx[8]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*viewStore, $viewStore*/ 34) {
				each_value_8 = /*$viewStore*/ ctx[5].selectedTags;
				let i;

				for (i = 0; i < each_value_8.length; i += 1) {
					const child_ctx = get_each_context_8(ctx, each_value_8, i);

					if (each_blocks_3[i]) {
						each_blocks_3[i].p(child_ctx, dirty);
						transition_in(each_blocks_3[i], 1);
					} else {
						each_blocks_3[i] = create_each_block_8(child_ctx);
						each_blocks_3[i].c();
						transition_in(each_blocks_3[i], 1);
						each_blocks_3[i].m(div2, t1);
					}
				}

				group_outros();

				for (i = each_value_8.length; i < each_blocks_3.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if ((!current || dirty[0] & /*$viewStore*/ 32) && t2_value !== (t2_value = /*$viewStore*/ ctx[5].allMatchingFiles.length + "")) set_data(t2, t2_value);

			if (dirty[0] & /*$settingsStore, $viewStore, settingsStore*/ 97) {
				each_value_7 = /*$viewStore*/ ctx[5].groupsSorted;
				let i;

				for (i = 0; i < each_value_7.length; i += 1) {
					const child_ctx = get_each_context_7(ctx, each_value_7, i);

					if (each_blocks_2[i]) {
						each_blocks_2[i].p(child_ctx, dirty);
					} else {
						each_blocks_2[i] = create_each_block_7(child_ctx);
						each_blocks_2[i].c();
						each_blocks_2[i].m(div4, null);
					}
				}

				for (; i < each_blocks_2.length; i += 1) {
					each_blocks_2[i].d(1);
				}

				each_blocks_2.length = each_value_7.length;
			}

			if (dirty[0] & /*settingsStore, $viewStore*/ 33) {
				each_value_6 = /*$viewStore*/ ctx[5].tagsSorted["favorite tags"] || [];
				let i;

				for (i = 0; i < each_value_6.length; i += 1) {
					const child_ctx = get_each_context_6(ctx, each_value_6, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_6(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div7, t15);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_6.length;
			}

			if (dirty[0] & /*settingsStore, $viewStore*/ 33) {
				each_value_5 = /*$viewStore*/ ctx[5].tagsSorted[""] || [];
				let i;

				for (i = 0; i < each_value_5.length; i += 1) {
					const child_ctx = get_each_context_5(ctx, each_value_5, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div7, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_5.length;
			}

			if (/*$viewStore*/ ctx[5].allMatchingFiles.length > 3) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty[0] & /*$viewStore*/ 32) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div9, t18);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*$viewStore*/ ctx[5].selectedTags.length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div9, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (!current || dirty[0] & /*contentWidth*/ 16 && div9_style_value !== (div9_style_value = "width: " + /*contentWidth*/ ctx[4] + "px; margin: 0 auto;")) {
				attr(div9, "style", div9_style_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(tagtitle0.$$.fragment, local);

			for (let i = 0; i < each_value_8.length; i += 1) {
				transition_in(each_blocks_3[i]);
			}

			transition_in(tagtitle1.$$.fragment, local);
			transition_in(if_block0);
			current = true;
		},
		o(local) {
			transition_out(tagtitle0.$$.fragment, local);
			each_blocks_3 = each_blocks_3.filter(Boolean);

			for (let i = 0; i < each_blocks_3.length; i += 1) {
				transition_out(each_blocks_3[i]);
			}

			transition_out(tagtitle1.$$.fragment, local);
			transition_out(if_block0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div10);
			destroy_component(tagtitle0);
			destroy_each(each_blocks_3, detaching);
			destroy_component(tagtitle1);
			destroy_each(each_blocks_2, detaching);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			div10_resize_listener();
			mounted = false;
			dispose();
		}
	};
}

const columnWidth = 250;
const columnMargin = 20;

function instance($$self, $$props, $$invalidate) {
	let columns;
	let contentWidth;

	let $viewStore,
		$$unsubscribe_viewStore = noop,
		$$subscribe_viewStore = () => ($$unsubscribe_viewStore(), $$unsubscribe_viewStore = subscribe(viewStore, $$value => $$invalidate(5, $viewStore = $$value)), viewStore);

	let $settingsStore,
		$$unsubscribe_settingsStore = noop,
		$$subscribe_settingsStore = () => ($$unsubscribe_settingsStore(), $$unsubscribe_settingsStore = subscribe(settingsStore, $$value => $$invalidate(6, $settingsStore = $$value)), settingsStore);

	$$self.$$.on_destroy.push(() => $$unsubscribe_viewStore());
	$$self.$$.on_destroy.push(() => $$unsubscribe_settingsStore());

	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	
	let { settingsStore } = $$props;
	$$subscribe_settingsStore();
	let { viewStore } = $$props;
	$$subscribe_viewStore();
	const totalColumnWidth = columnWidth + columnMargin * 2;
	let clientWidth;

	function openFile(e, file) {
		return __awaiter(this, void 0, void 0, function* () {
			let inNewSplit = obsidian.Keymap.isModEvent(e);
			const mode = window.app.vault.getConfig("defaultViewMode");

			const leaf = inNewSplit
			? window.app.workspace.splitActiveLeaf()
			: window.app.workspace.getUnpinnedLeaf();

			yield leaf.openFile(file, { active: true, mode });
		});
	}

	onMount(() => {
		// Ensures we've loaded everything when presented
		viewStore.selectTags($viewStore.selectedTags);
	});

	const click_handler = _ => viewStore.selectTags([]);

	const click_handler_1 = (tag, index, e) => obsidian.Keymap.isModEvent(e)
	? viewStore.selectTags([tag])
	: viewStore.selectTags($viewStore.selectedTags.slice(0, index + 1));

	const click_handler_2 = (label, _) => settingsStore.toggleFavoriteGroup(label);
	const click_handler_3 = (tag, _) => settingsStore.toggleFavoriteTag(tag);
	const click_handler_4 = (tag, _) => settingsStore.toggleFavoriteTag(tag);
	const click_handler_5 = (tag, _) => viewStore.selectTags([...$viewStore.selectedTags, tag]);
	const click_handler_6 = (tag, tag2, _) => viewStore.selectTags([...$viewStore.selectedTags, tag, tag2]);
	const click_handler_7 = (file, e) => openFile(e, file);
	const click_handler_8 = (label, _) => viewStore.toggleExpandedGroup(label);
	const click_handler_9 = (label, _) => viewStore.toggleExpandedGroup(label);
	const click_handler_10 = (file, e) => openFile(e, file);

	function div10_elementresize_handler() {
		clientWidth = this.clientWidth;
		$$invalidate(2, clientWidth);
	}

	$$self.$$set = $$props => {
		if ("settingsStore" in $$props) $$subscribe_settingsStore($$invalidate(0, settingsStore = $$props.settingsStore));
		if ("viewStore" in $$props) $$subscribe_viewStore($$invalidate(1, viewStore = $$props.viewStore));
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*clientWidth*/ 4) {
			$$invalidate(3, columns = Math.max(1, Math.trunc(clientWidth / totalColumnWidth)));
		}

		if ($$self.$$.dirty[0] & /*columns*/ 8) {
			$$invalidate(4, contentWidth = columns * totalColumnWidth);
		}
	};

	return [
		settingsStore,
		viewStore,
		clientWidth,
		columns,
		contentWidth,
		$viewStore,
		$settingsStore,
		openFile,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7,
		click_handler_8,
		click_handler_9,
		click_handler_10,
		div10_elementresize_handler
	];
}

class TagMenu extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1597r1-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { settingsStore: 0, viewStore: 1 }, [-1, -1]);
	}
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

class CRNView extends obsidian.ItemView {
    constructor(leaf, settingsStore, tagMenuStore) {
        super(leaf);
        this.settingsStore = settingsStore;
        this.tagMenuStore = tagMenuStore;
    }
    getViewType() {
        return VIEW_TYPE;
    }
    getDisplayText() {
        return "Cross-reference Navigation";
    }
    getIcon() {
        return "go-to-file";
    }
    getEphemeralState() {
        const state = get_store_value(this.tagMenuStore);
        return {
            selectedTags: state.selectedTags,
            expandedGroups: state.expandedGroups
        };
    }
    setEphemeralState(state) {
        if (state) {
            this.tagMenuStore.loadState(state.selectedTags, state.expandedGroups);
        }
    }
    onClose() {
        if (this.tagMenu) {
            this.tagMenu.$destroy();
        }
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        return Promise.resolve();
    }
    onOpen() {
        this.tagMenu = new TagMenu({
            target: this.contentEl,
            props: {
                settingsStore: this.settingsStore,
                viewStore: this.tagMenuStore,
            },
        });
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.unsubscribe = this.tagMenuStore.subscribe(_ => {
            this.app.workspace.requestSaveHistory();
        });
        return Promise.resolve();
    }
}

const defaultSettings = {
    favoriteGroups: ["status", "activity"],
    favoriteTags: []
};
async function createSettingsStore(plugin) {
    const initialData = await plugin.loadData();
    const { subscribe, update } = writable(Object.assign(Object.assign({}, defaultSettings), initialData));
    function toggleFavoriteGroup(group) {
        update(settings => {
            const favoriteGroups = settings.favoriteGroups;
            const index = favoriteGroups.indexOf(group);
            if (index > -1) {
                favoriteGroups.splice(index, 1);
            }
            else {
                favoriteGroups.push(group);
            }
            const newState = Object.assign(Object.assign({}, settings), { favoriteGroups });
            plugin.saveData(newState);
            return newState;
        });
    }
    function toggleFavoriteTag(tag) {
        update(settings => {
            const favoriteTags = settings.favoriteTags;
            const index = favoriteTags.indexOf(tag);
            if (index > -1) {
                favoriteTags.splice(index, 1);
            }
            else {
                favoriteTags.push(tag);
            }
            const newState = Object.assign(Object.assign({}, settings), { favoriteTags });
            plugin.saveData(newState);
            return newState;
        });
    }
    return {
        subscribe,
        toggleFavoriteGroup,
        toggleFavoriteTag
    };
}
function generateInitialTagMenuState() {
    return {
        toShow: {},
        groupsSorted: [],
        tagsSorted: {},
        crossrefsSorted: {},
        allMatchingFiles: [],
        selectedTags: [],
        expandedGroups: [""] // always expand ungrouped tags section
    };
}
function createTagMenuStore(settingsStore) {
    const { subscribe, set, update } = writable(generateInitialTagMenuState());
    function selectTags(selectTags) {
        const newState = generateInitialTagMenuState();
        newState.selectedTags = selectTags;
        const groupCounts = {};
        const tagCounts = {};
        const allFiles = window.app.vault.getMarkdownFiles();
        const allFileTags = {};
        allFiles.forEach(file => {
            const fileTags = obsidian.getAllTags(window.app.metadataCache.getFileCache(file));
            allFileTags[file.name] = fileTags;
            if (selectTags.every(t => fileTags.includes(t))) {
                newState.allMatchingFiles.push(file);
                fileTags.forEach(tag => {
                    if (selectTags.includes(tag)) {
                        return;
                    }
                    const parts = tagParts(tag);
                    const label = parts.label || "";
                    const title = parts.title;
                    if (!newState.toShow[label]) {
                        newState.toShow[label] = {};
                    }
                    if (!newState.toShow[label][tag]) {
                        newState.toShow[label][tag] = { displayName: title, files: [], crossrefs: {} };
                    }
                    newState.toShow[label][tag].files.push(file);
                    if (!tagCounts[label]) {
                        tagCounts[label] = {};
                    }
                    groupCounts[label] = (groupCounts[label] || 0) + 1;
                    tagCounts[label][tag] = (tagCounts[label][tag] || 0) + 1;
                });
            }
        });
        // Generate groupsSorted
        newState.groupsSorted = Object.keys(newState.toShow).sort((a, b) => (groupCounts[b] + Object.keys(tagCounts[b] || {}).length) - (groupCounts[a] + Object.keys(tagCounts[a] || {}).length)); // tagCounts included to prioritize groups that have more columns
        const settingsState = get_store_value(settingsStore);
        const _favoriteGroups = settingsState.favoriteGroups.sort((a, b) => ((groupCounts[a] || 0) + Object.keys(tagCounts[a] || {}).length) - ((groupCounts[b] || 0)) + Object.keys(tagCounts[b] || {}).length);
        _favoriteGroups.forEach(group => {
            const index = newState.groupsSorted.indexOf(group);
            if (index > -1) {
                newState.groupsSorted.splice(index, 1);
                newState.groupsSorted.unshift(group);
            }
        });
        // Put list of all ungrouped tags at bottom, it will always be expanded
        const index = newState.groupsSorted.indexOf("");
        if (index > -1) {
            newState.groupsSorted.splice(index, 1);
            newState.groupsSorted.push("");
        }
        // Put list of favorite tags at top
        if (settingsState.favoriteTags.length > 0 && newState.toShow[""]) {
            newState.groupsSorted.unshift("favorite tags");
            newState.toShow["favorite tags"] = {};
            tagCounts["favorite tags"] = {};
            settingsState.favoriteTags.forEach(tag => {
                if (newState.toShow[""][tag]) {
                    newState.toShow["favorite tags"][tag] = newState.toShow[""][tag];
                    delete newState.toShow[""][tag];
                    tagCounts["favorite tags"][tag] = tagCounts[""][tag];
                    delete tagCounts[""][tag];
                }
            });
        }
        // Generate tagsSorted, crossrefs
        Object.keys(newState.toShow).forEach(group => {
            newState.tagsSorted[group] = Object.keys(newState.toShow[group]).sort((a, b) => tagCounts[group][b] - tagCounts[group][a]);
            Object.keys(newState.toShow[group]).forEach(tag => {
                const files = newState.toShow[group][tag].files;
                const crossrefs = {};
                files.forEach(file => {
                    allFileTags[file.name].forEach(tag2 => {
                        if (tag2 === tag) {
                            return;
                        }
                        if (selectTags.includes(tag2)) {
                            return;
                        }
                        crossrefs[tag2] = (crossrefs[tag2] || 0) + 1;
                    });
                });
                newState.toShow[group][tag].crossrefs = crossrefs;
            });
        });
        // Generate crossrefsSorted
        Object.keys(newState.toShow).forEach(group => {
            newState.crossrefsSorted[group] = {};
            Object.keys(newState.toShow[group]).forEach(tag => {
                const crossrefs = newState.toShow[group][tag].crossrefs;
                const sorted = Object.keys(crossrefs).sort((a, b) => crossrefs[b] - crossrefs[a]);
                sorted.slice().reverse().forEach(tag => {
                    if (settingsState.favoriteTags.find(ftag => tag === ftag)
                        || settingsState.favoriteGroups.find(fgroup => tag.startsWith("#" + fgroup))) {
                        sorted.splice(sorted.indexOf(tag), 1);
                        sorted.unshift(tag);
                    }
                });
                newState.crossrefsSorted[group][tag] = sorted;
            });
        });
        set(newState);
    }
    function toggleExpandedGroup(group) {
        update(state => {
            const expandedGroups = state.expandedGroups;
            const index = expandedGroups.indexOf(group);
            if (index > -1) {
                expandedGroups.splice(index, 1);
            }
            else {
                expandedGroups.push(group);
            }
            return Object.assign(Object.assign({}, state), { expandedGroups });
        });
    }
    function loadState(selectedTags, expandedGroups) {
        if (selectedTags) {
            selectTags(selectedTags);
        }
        if (expandedGroups) {
            update(state => (Object.assign(Object.assign({}, state), { expandedGroups })));
        }
    }
    const unsubscribe = settingsStore.subscribe(_ => {
        selectTags(get_store_value({ subscribe }).selectedTags);
    });
    const destroy = unsubscribe;
    return { subscribe, destroy, loadState, selectTags, toggleExpandedGroup };
}

class CrossNavPlugin extends obsidian.Plugin {
    onunload() {
        this.app.workspace
            .getLeavesOfType(VIEW_TYPE)
            .forEach((leaf) => leaf.detach());
        this.tagMenuStore.destroy();
    }
    async onload() {
        this.settingsStore = await createSettingsStore(this);
        this.tagMenuStore = createTagMenuStore(this.settingsStore);
        this.registerView(VIEW_TYPE, (leaf) => (this.view = new CRNView(leaf, this.settingsStore, this.tagMenuStore)));
        this.addCommand({
            id: "show-refnav-view",
            name: "Open Cross-references View",
            callback: () => {
                const leaf = this.app.workspace.activeLeaf;
                leaf.open(new CRNView(leaf, this.settingsStore, this.tagMenuStore));
            },
        });
    }
}

module.exports = CrossNavPlugin;

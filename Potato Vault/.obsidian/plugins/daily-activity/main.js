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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/** @format */
class ActivityLogger {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    getLinksToFilesModifiedOnDate(moment, makeLink = true) {
        let files = this.app.vault.getFiles();
        let links = [];
        files.forEach((f) => {
            if (moment.isSame(new Date(f.stat.mtime), 'day')) {
                makeLink ? links.push(`[[${obsidian.getLinkpath(f.path)}]]`) : links.push(obsidian.getLinkpath(f.path));
            }
        });
        return links;
    }
    getLinksToFilesCreatedOnDate(moment, makeLink = true) {
        let files = this.app.vault.getFiles();
        let links = [];
        files.forEach((f) => {
            if (moment.isSame(new Date(f.stat.ctime), 'day')) {
                makeLink ? links.push(`[[${obsidian.getLinkpath(f.path)}]]`) : links.push(obsidian.getLinkpath(f.path));
            }
        });
        return links;
    }
    appendLinksToContent(existingContent, links, header) {
        return (existingContent +
            `

${links.join('\n')}
`);
    }
    insertActivityLog({ insertCreatedOnDateFiles = false, insertModifiedOnDateFiles = false, moments = [window.moment()], activeView = null, makeLink = true }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (activeView == null) {
                return;
            }
            let editor = activeView.editor;
            editor.getDoc();
            let content = yield this.app.vault.read(activeView.file);
            let createdTodayLinks = [];
            if (insertCreatedOnDateFiles) {
                createdTodayLinks = moments.flatMap((moment) => this.getLinksToFilesCreatedOnDate(moment, makeLink));
                console.log(createdTodayLinks.length, ' Files found created on these date(s): ', moments.map(m => m.date()));
                content = this.appendLinksToContent(content, createdTodayLinks, 'Created');
            }
            if (insertModifiedOnDateFiles) {
                let modifiedTodayLinks = moments.flatMap((moment) => this.getLinksToFilesModifiedOnDate(moment, makeLink).filter((link) => createdTodayLinks.indexOf(link) === -1));
                console.log(modifiedTodayLinks.length, ' Files found modified on these date(s): ', moments.map(m => m.date()));
                content = this.appendLinksToContent(content, modifiedTodayLinks, 'Modified');
            }
            yield this.app.vault.modify(activeView.file, content);
        });
    }
    generateFileStatRow(moment, stats) {
        let row = `|${moment.format('YYYY-MM-DD')}|`;
        stats.forEach((stat) => {
            let statValue;
            if (stat == 'created') {
                statValue = this.getLinksToFilesCreatedOnDate(moment).length;
            }
            if (stat == 'modified') {
                statValue = this.getLinksToFilesModifiedOnDate(moment).length;
            }
            row = row + `${statValue}|`;
        });
        return row;
    }
    generateFileStatHeader(stats) {
        return (`| Date |` +
            stats.join(' | ') +
            `|
|-------|${stats.map((s) => '----------').join('|')}|`);
    }
    insertFileStats({ stats = ['created', 'modified'], moments = [window.moment()], activeView = null, allTime = false, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (activeView == null) {
                return;
            }
            let content = yield this.app.vault.read(activeView.file);
            let header = this.generateFileStatHeader(stats);
            console.log(header);
            let rows = [];
            moments.forEach((moment) => {
                console.log('Moment: ' + moment);
                rows.push(this.generateFileStatRow(moment, stats));
            });
            let table = header + `${'\n' + rows.join('\n')}`;
            let newContent = content +
                `

${table}
`;
            yield this.app.vault.modify(activeView.file, newContent);
        });
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var pattern = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAnyPattern = exports.extractTerms = exports.repeatedTimeunitPattern = void 0;
function repeatedTimeunitPattern(prefix, singleTimeunitPattern) {
    const singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
    return `${prefix}${singleTimeunitPatternNoCapture}\\s*(?:,?\\s{0,5}${singleTimeunitPatternNoCapture}){0,10}`;
}
exports.repeatedTimeunitPattern = repeatedTimeunitPattern;
function extractTerms(dictionary) {
    let keys;
    if (dictionary instanceof Array) {
        keys = [...dictionary];
    }
    else if (dictionary instanceof Map) {
        keys = Array.from(dictionary.keys());
    }
    else {
        keys = Object.keys(dictionary);
    }
    return keys;
}
exports.extractTerms = extractTerms;
function matchAnyPattern(dictionary) {
    const joinedTerms = extractTerms(dictionary)
        .sort((a, b) => b.length - a.length)
        .join("|")
        .replace(/\./g, "\\.");
    return `(?:${joinedTerms})`;
}
exports.matchAnyPattern = matchAnyPattern;
});

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",f="date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,c=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},$=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},l={s:$,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+$(r,2,"0")+":"+$(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,u),s=n-i<0,a=e.clone().add(r+(s?-1:1),u);return +(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:o,w:s,d:i,D:f,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},y="en",M={};M[y]=d;var m=function(t){return t instanceof S},D=function(t,e,n){var r;if(!t)return y;if("string"==typeof t)M[t]&&(r=t),e&&(M[t]=e,r=t);else {var i=t.name;M[i]=t,r=i;}return !n&&r&&(y=r),r||!n&&y},v=function(t,e){if(m(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},g=l;g.l=D,g.i=m,g.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function d(t){this.$L=D(t.locale,null,!0),this.parse(t);}var $=d.prototype;return $.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},$.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},$.$utils=function(){return g},$.isValid=function(){return !("Invalid Date"===this.$d.toString())},$.isSame=function(t,e){var n=v(t);return this.startOf(e)<=n&&n<=this.endOf(e)},$.isAfter=function(t,e){return v(t)<this.startOf(e)},$.isBefore=function(t,e){return this.endOf(e)<v(t)},$.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},$.unix=function(){return Math.floor(this.valueOf()/1e3)},$.valueOf=function(){return this.$d.getTime()},$.startOf=function(t,a){var h=this,c=!!g.u(a)||a,d=g.p(t),$=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return c?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},y=this.$W,M=this.$M,m=this.$D,D="set"+(this.$u?"UTC":"");switch(d){case o:return c?$(1,0):$(31,11);case u:return c?$(1,M):$(0,M+1);case s:var v=this.$locale().weekStart||0,S=(y<v?y+7:y)-v;return $(c?m-S:m+(6-S),M);case i:case f:return l(D+"Hours",0);case r:return l(D+"Minutes",1);case n:return l(D+"Seconds",2);case e:return l(D+"Milliseconds",3);default:return this.clone()}},$.endOf=function(t){return this.startOf(t,!1)},$.$set=function(s,a){var h,c=g.p(s),d="set"+(this.$u?"UTC":""),$=(h={},h[i]=d+"Date",h[f]=d+"Date",h[u]=d+"Month",h[o]=d+"FullYear",h[r]=d+"Hours",h[n]=d+"Minutes",h[e]=d+"Seconds",h[t]=d+"Milliseconds",h)[c],l=c===i?this.$D+(a-this.$W):a;if(c===u||c===o){var y=this.clone().set(f,1);y.$d[$](l),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},$.set=function(t,e){return this.clone().$set(t,e)},$.get=function(t){return this[g.p(t)]()},$.add=function(t,a){var f,h=this;t=Number(t);var c=g.p(a),d=function(e){var n=v(h);return g.w(n.date(n.date()+Math.round(e*t)),h)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(f={},f[n]=6e4,f[r]=36e5,f[e]=1e3,f)[c]||1,l=this.$d.getTime()+t*$;return g.w(l,this)},$.subtract=function(t,e){return this.add(-1*t,e)},$.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,f=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:h(i.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(c,function(t,e){return e||l[t]||r.replace(":","")})},$.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},$.diff=function(t,f,h){var c,d=g.p(f),$=v(t),l=6e4*($.utcOffset()-this.utcOffset()),y=this-$,M=g.m(this,$);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(y-l)/6048e5,c[i]=(y-l)/864e5,c[r]=y/36e5,c[n]=y/6e4,c[e]=y/1e3,c)[d]||y,h?M:g.a(M)},$.daysInMonth=function(){return this.endOf(u).$D},$.$locale=function(){return M[this.$L]},$.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},$.clone=function(){return g.w(this.$d,this)},$.toDate=function(){return new Date(this.valueOf())},$.toJSON=function(){return this.isValid()?this.toISOString():null},$.toISOString=function(){return this.$d.toISOString()},$.toString=function(){return this.$d.toUTCString()},d}(),p=S.prototype;return v.prototype=p,[["$ms",t],["$s",e],["$m",n],["$H",r],["$W",i],["$M",u],["$y",o],["$D",f]].forEach(function(t){p[t[1]]=function(e){return this.$g(e,t[0],t[1])};}),v.extend=function(t,e){return t.$i||(t(e,S,v),t.$i=!0),v},v.locale=D,v.isDayjs=m,v.unix=function(t){return v(1e3*t)},v.en=M[y],v.Ls=M,v.p={},v});
});

var years = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYearClosestToRef = exports.findMostLikelyADYear = void 0;
const dayjs_1 = __importDefault(dayjs_min);
function findMostLikelyADYear(yearNumber) {
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.findMostLikelyADYear = findMostLikelyADYear;
function findYearClosestToRef(refDate, day, month) {
    const refMoment = dayjs_1.default(refDate);
    let dateMoment = refMoment;
    dateMoment = dateMoment.month(month - 1);
    dateMoment = dateMoment.date(day);
    dateMoment = dateMoment.year(refMoment.year());
    const nextYear = dateMoment.add(1, "y");
    const lastYear = dateMoment.add(-1, "y");
    if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = nextYear;
    }
    else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
        dateMoment = lastYear;
    }
    return dateMoment.year();
}
exports.findYearClosestToRef = findYearClosestToRef;
});

var constants$5 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    sunday: 0,
    sun: 0,
    "sun.": 0,
    monday: 1,
    mon: 1,
    "mon.": 1,
    tuesday: 2,
    tue: 2,
    "tue.": 2,
    wednesday: 3,
    wed: 3,
    "wed.": 3,
    thursday: 4,
    thurs: 4,
    "thurs.": 4,
    thur: 4,
    "thur.": 4,
    thu: 4,
    "thu.": 4,
    friday: 5,
    fri: 5,
    "fri.": 5,
    saturday: 6,
    sat: 6,
    "sat.": 6,
};
exports.FULL_MONTH_NAME_DICTIONARY = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};
exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
exports.INTEGER_WORD_DICTIONARY = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    twentieth: 20,
    "twenty first": 21,
    "twenty-first": 21,
    "twenty second": 22,
    "twenty-second": 22,
    "twenty third": 23,
    "twenty-third": 23,
    "twenty fourth": 24,
    "twenty-fourth": 24,
    "twenty fifth": 25,
    "twenty-fifth": 25,
    "twenty sixth": 26,
    "twenty-sixth": 26,
    "twenty seventh": 27,
    "twenty-seventh": 27,
    "twenty eighth": 28,
    "twenty-eighth": 28,
    "twenty ninth": 29,
    "twenty-ninth": 29,
    "thirtieth": 30,
    "thirty first": 31,
    "thirty-first": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:st|nd|rd|th)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:st|nd|rd|th)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:BE|AD|BC)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/BE/i.test(match)) {
        match = match.replace(/BE/i, "");
        return parseInt(match) - 543;
    }
    if (/BC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }
    if (/AD/i.test(match)) {
        match = match.replace(/AD/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:about|around)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var quarterOfYear = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="month",n="quarter";return function(r,i){var e=i.prototype;e.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var u=e.add;e.add=function(r,i){return r=Number(r),this.$utils().p(i)===n?this.add(3*r,t):u.bind(this)(r,i)};var s=e.startOf;e.startOf=function(r,i){var e=this.$utils(),u=!!e.u(i)||i;if(e.p(r)===n){var a=this.quarter()-1;return u?this.month(3*a).startOf(t).startOf("day"):this.month(3*a+2).endOf(t).endOf("day")}return s.bind(this)(r,i)};}});
});

var dayjs = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.implySimilarTime = exports.assignSimilarTime = exports.assignSimilarDate = exports.assignTheNextDay = void 0;
function assignTheNextDay(component, targetDayJs) {
    targetDayJs = targetDayJs.add(1, "day");
    assignSimilarDate(component, targetDayJs);
    implySimilarTime(component, targetDayJs);
}
exports.assignTheNextDay = assignTheNextDay;
function assignSimilarDate(component, targetDayJs) {
    component.assign("day", targetDayJs.date());
    component.assign("month", targetDayJs.month() + 1);
    component.assign("year", targetDayJs.year());
}
exports.assignSimilarDate = assignSimilarDate;
function assignSimilarTime(component, targetDayJs) {
    component.assign("hour", targetDayJs.hour());
    component.assign("minute", targetDayJs.minute());
    component.assign("second", targetDayJs.second());
    component.assign("millisecond", targetDayJs.millisecond());
    component.assign("timezoneOffset", targetDayJs.utcOffset());
}
exports.assignSimilarTime = assignSimilarTime;
function implySimilarTime(component, targetDayJs) {
    component.imply("hour", targetDayJs.hour());
    component.imply("minute", targetDayJs.minute());
    component.imply("second", targetDayJs.second());
    component.imply("millisecond", targetDayJs.millisecond());
    component.imply("timezoneOffset", targetDayJs.utcOffset());
}
exports.implySimilarTime = implySimilarTime;
});

var results = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingResult = exports.ParsingComponents = void 0;
const quarterOfYear_1 = __importDefault(quarterOfYear);
const dayjs_1 = __importDefault(dayjs_min);

dayjs_1.default.extend(quarterOfYear_1.default);
class ParsingComponents {
    constructor(refDate, knownComponents) {
        this.knownValues = {};
        this.impliedValues = {};
        if (knownComponents) {
            for (const key in knownComponents) {
                this.knownValues[key] = knownComponents[key];
            }
        }
        const refDayJs = dayjs_1.default(refDate);
        this.imply("day", refDayJs.date());
        this.imply("month", refDayJs.month() + 1);
        this.imply("year", refDayJs.year());
        this.imply("hour", 12);
        this.imply("minute", 0);
        this.imply("second", 0);
        this.imply("millisecond", 0);
    }
    get(component) {
        if (component in this.knownValues) {
            return this.knownValues[component];
        }
        if (component in this.impliedValues) {
            return this.impliedValues[component];
        }
        return null;
    }
    isCertain(component) {
        return component in this.knownValues;
    }
    getCertainComponents() {
        return Object.keys(this.knownValues);
    }
    imply(component, value) {
        if (component in this.knownValues) {
            return this;
        }
        this.impliedValues[component] = value;
        return this;
    }
    assign(component, value) {
        this.knownValues[component] = value;
        delete this.impliedValues[component];
        return this;
    }
    delete(component) {
        delete this.knownValues[component];
        delete this.impliedValues[component];
    }
    clone() {
        const component = new ParsingComponents(new Date());
        component.knownValues = {};
        component.impliedValues = {};
        for (const key in this.knownValues) {
            component.knownValues[key] = this.knownValues[key];
        }
        for (const key in this.impliedValues) {
            component.impliedValues[key] = this.impliedValues[key];
        }
        return component;
    }
    isOnlyDate() {
        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
    }
    isOnlyTime() {
        return !this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyWeekdayComponent() {
        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
    }
    isOnlyDayMonthComponent() {
        return this.isCertain("day") && this.isCertain("month") && !this.isCertain("year");
    }
    isValidDate() {
        const date = this.isCertain("timezoneOffset") ? this.dateWithoutTimezoneAdjustment() : this.date();
        if (date.getFullYear() !== this.get("year"))
            return false;
        if (date.getMonth() !== this.get("month") - 1)
            return false;
        if (date.getDate() !== this.get("day"))
            return false;
        if (this.get("hour") != null && date.getHours() != this.get("hour"))
            return false;
        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
            return false;
        return true;
    }
    toString() {
        return `[ParsingComponents {knownValues: ${JSON.stringify(this.knownValues)}, impliedValues: ${JSON.stringify(this.impliedValues)}}]`;
    }
    dayjs() {
        return dayjs_1.default(this.date());
    }
    date() {
        const date = this.dateWithoutTimezoneAdjustment();
        return new Date(date.getTime() + this.getTimezoneAdjustmentMinute(date) * 60000);
    }
    dateWithoutTimezoneAdjustment() {
        const date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
        date.setFullYear(this.get("year"));
        return date;
    }
    getTimezoneAdjustmentMinute(date) {
        var _a;
        date = date !== null && date !== void 0 ? date : new Date();
        const currentTimezoneOffset = -date.getTimezoneOffset();
        const targetTimezoneOffset = (_a = this.get("timezoneOffset")) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
        return currentTimezoneOffset - targetTimezoneOffset;
    }
    static createRelativeFromRefDate(refDate, fragments) {
        let date = dayjs_1.default(refDate);
        for (const key in fragments) {
            date = date.add(fragments[key], key);
        }
        const components = new ParsingComponents(refDate);
        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
            dayjs.assignSimilarTime(components, date);
            dayjs.assignSimilarDate(components, date);
        }
        else {
            dayjs.implySimilarTime(components, date);
            if (fragments["d"]) {
                components.assign("day", date.date());
                components.assign("month", date.month() + 1);
                components.assign("year", date.year());
            }
            else {
                if (fragments["week"]) {
                    components.imply("weekday", date.day());
                }
                components.imply("day", date.date());
                if (fragments["month"]) {
                    components.assign("month", date.month() + 1);
                    components.assign("year", date.year());
                }
                else {
                    components.imply("month", date.month() + 1);
                    if (fragments["year"]) {
                        components.assign("year", date.year());
                    }
                    else {
                        components.imply("year", date.year());
                    }
                }
            }
        }
        return components;
    }
}
exports.ParsingComponents = ParsingComponents;
class ParsingResult {
    constructor(refDate, index, text, start, end) {
        this.refDate = refDate;
        this.index = index;
        this.text = text;
        this.start = start || new ParsingComponents(this.refDate);
        this.end = end;
    }
    clone() {
        const result = new ParsingResult(this.refDate, this.index, this.text);
        result.start = this.start ? this.start.clone() : null;
        result.end = this.end ? this.end.clone() : null;
        return result;
    }
    date() {
        return this.start.date();
    }
    toString() {
        return `[ParsingResult {index: ${this.index}, text: '${this.text}', ...}]`;
    }
}
exports.ParsingResult = ParsingResult;
});

var AbstractParserWithWordBoundary = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractParserWithWordBoundaryChecking = void 0;
class AbstractParserWithWordBoundaryChecking {
    constructor() {
        this.cachedInnerPattern = null;
        this.cachedPattern = null;
    }
    pattern(context) {
        const innerPattern = this.innerPattern(context);
        if (innerPattern == this.cachedInnerPattern) {
            return this.cachedPattern;
        }
        this.cachedPattern = new RegExp(`(\\W|^)${innerPattern.source}`, innerPattern.flags);
        this.cachedInnerPattern = innerPattern;
        return this.cachedPattern;
    }
    extract(context, match) {
        const header = match[1];
        match.index = match.index + header.length;
        match[0] = match[0].substring(header.length);
        for (let i = 2; i < match.length; i++) {
            match[i - 1] = match[i];
        }
        return this.innerExtract(context, match);
    }
}
exports.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;
});

var ENTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN_WITH_PREFIX = new RegExp(`(?:within|in|for)\\s*` +
    `(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
const PATTERN_WITHOUT_PREFIX = new RegExp(`(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return context.option.forwardDate ? PATTERN_WITHOUT_PREFIX : PATTERN_WITH_PREFIX;
    }
    innerExtract(context, match) {
        const timeUnits = constants$5.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = ENTimeUnitWithinFormatParser;
});

var ENMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$5;
const constants_3 = constants$5;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    "(?:\\s*" +
    "(?:to|\\-|\\–|until|through|till|\\s)\\s*" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    "(?:-|/|\\s*(?:of)?\\s*)" +
    "(" +
    pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY) +
    ")" +
    "(?:" +
    "(?:-|/|,?\\s*)" +
    `(${constants_2.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = ENMonthNameLittleEndianParser;
});

var ENMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$5;
const constants_3 = constants$5;


const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})` +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})(?!\\s*(?:am|pm))\\s*` +
    "(?:" +
    "(?:to|\\-)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})\\s*` +
    ")?" +
    "(?:" +
    "(?:-|/|\\s*,?\\s*)" +
    `(${constants_3.YEAR_PATTERN})` +
    ")?" +
    "(?=\\W|$)(?!\\:\\d)", "i");
const MONTH_NAME_GROUP = 1;
const DATE_GROUP = 2;
const DATE_TO_GROUP = 3;
const YEAR_GROUP = 4;
class ENMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = ENMonthNameMiddleEndianParser;
});

var ENMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants$5;

const PATTERN = new RegExp(`((?:in)\\s*)?` +
    `(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const PREFIX_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const YEAR_GROUP = 3;
class ENMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const monthName = match[MONTH_NAME_GROUP].toLowerCase();
        if (match[0].length <= 3 && !constants$5.FULL_MONTH_NAME_DICTIONARY[monthName]) {
            return null;
        }
        const result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
        result.start.imply("day", 1);
        const month = constants$5.MONTH_DICTIONARY[monthName];
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = ENMonthNameParser;
});

var ENCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants$5.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class ENCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants$5.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = ENCasualYearMonthDayParser;
});

var ENSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class ENSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = ENSlashMonthFormatParser;
});

var AbstractTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTimeExpressionParser = void 0;

function primaryTimePattern(primaryPrefix, primarySuffix) {
    return new RegExp("(^|\\s|T|\\b)" +
        `${primaryPrefix}` +
        "(\\d{1,4})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})" +
        "(?:" +
        "(?:\\:|\\：)" +
        "(\\d{2})" +
        "(?:\\.(\\d{1,6}))?" +
        ")?" +
        ")?" +
        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
        `${primarySuffix}`, "i");
}
function followingTimePatten(followingPhase, followingSuffix) {
    return new RegExp(`^(${followingPhase})` +
        "(\\d{1,4})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})" +
        "(?:" +
        "(?:\\.|\\:|\\：)" +
        "(\\d{1,2})(?:\\.(\\d{1,6}))?" +
        ")?" +
        ")?" +
        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
        `${followingSuffix}`, "i");
}
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const MILLI_SECOND_GROUP = 5;
const AM_PM_HOUR_GROUP = 6;
class AbstractTimeExpressionParser {
    constructor(strictMode = false) {
        this.cachedPrimaryPrefix = null;
        this.cachedPrimarySuffix = null;
        this.cachedPrimaryTimePattern = null;
        this.cachedFollowingPhase = null;
        this.cachedFollowingSuffix = null;
        this.cachedFollowingTimePatten = null;
        this.strictMode = strictMode;
    }
    primarySuffix() {
        return "(?=\\W|$)";
    }
    followingSuffix() {
        return "(?=\\W|$)";
    }
    pattern(context) {
        return this.getPrimaryTimePatternThroughCache();
    }
    extract(context, match) {
        const startComponents = this.extractPrimaryTimeComponents(context, match);
        if (!startComponents) {
            match.index += match[0].length;
            return null;
        }
        const index = match.index + match[1].length;
        const text = match[0].substring(match[1].length);
        const result = context.createParsingResult(index, text, startComponents);
        match.index += match[0].length;
        const remainingText = context.text.substring(match.index);
        const followingPattern = this.getFollowingTimePatternThroughCache();
        const followingMatch = followingPattern.exec(remainingText);
        if (!followingMatch ||
            followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
            return this.checkAndReturnWithoutFollowingPattern(result);
        }
        result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
        if (result.end) {
            result.text += followingMatch[0];
        }
        return this.checkAndReturnWithFollowingPattern(result);
    }
    extractPrimaryTimeComponents(context, match, strict = false) {
        const components = context.createParsingComponents();
        let minute = 0;
        let meridiem = null;
        let hour = parseInt(match[HOUR_GROUP]);
        if (hour > 100) {
            if (this.strictMode || match[MINUTE_GROUP] != null) {
                return null;
            }
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (hour > 24) {
            return null;
        }
        if (match[MINUTE_GROUP] != null) {
            if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
                return null;
            }
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60) {
            return null;
        }
        if (hour > 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem !== null) {
            components.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                components.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        return components;
    }
    extractFollowingTimeComponents(context, match, result) {
        const components = context.createParsingComponents();
        if (match[MILLI_SECOND_GROUP] != null) {
            const millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
            if (millisecond >= 1000)
                return null;
            components.assign("millisecond", millisecond);
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            components.assign("second", second);
        }
        let hour = parseInt(match[HOUR_GROUP]);
        let minute = 0;
        let meridiem = -1;
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        else if (hour > 100) {
            minute = hour % 100;
            hour = Math.floor(hour / 100);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12) {
                return null;
            }
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                    if (!components.isCertain("day")) {
                        components.imply("day", components.get("day") + 1);
                    }
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12)
                    hour += 12;
            }
            if (!result.start.isCertain("meridiem")) {
                if (meridiem == dist.Meridiem.AM) {
                    result.start.imply("meridiem", dist.Meridiem.AM);
                    if (result.start.get("hour") == 12) {
                        result.start.assign("hour", 0);
                    }
                }
                else {
                    result.start.imply("meridiem", dist.Meridiem.PM);
                    if (result.start.get("hour") != 12) {
                        result.start.assign("hour", result.start.get("hour") + 12);
                    }
                }
            }
        }
        components.assign("hour", hour);
        components.assign("minute", minute);
        if (meridiem >= 0) {
            components.assign("meridiem", meridiem);
        }
        else {
            const startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
            if (startAtPM) {
                if (result.start.get("hour") - 12 > hour) {
                    components.imply("meridiem", dist.Meridiem.AM);
                }
                else if (hour <= 12) {
                    components.assign("hour", hour + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
            }
            else if (hour > 12) {
                components.imply("meridiem", dist.Meridiem.PM);
            }
            else if (hour <= 12) {
                components.imply("meridiem", dist.Meridiem.AM);
            }
        }
        if (components.date().getTime() < result.start.date().getTime()) {
            components.imply("day", components.get("day") + 1);
        }
        return components;
    }
    checkAndReturnWithoutFollowingPattern(result) {
        if (result.text.match(/^\d$/)) {
            return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
        if (endingWithNumbers) {
            const endingNumbers = endingWithNumbers[1];
            if (this.strictMode) {
                return null;
            }
            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                return null;
            }
            const endingNumberVal = parseInt(endingNumbers);
            if (endingNumberVal > 24) {
                return null;
            }
        }
        return result;
    }
    checkAndReturnWithFollowingPattern(result) {
        if (result.text.match(/^\d+-\d+$/)) {
            return null;
        }
        const endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
        if (endingWithNumbers) {
            if (this.strictMode) {
                return null;
            }
            const startingNumbers = endingWithNumbers[1];
            const endingNumbers = endingWithNumbers[2];
            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                return null;
            }
            const endingNumberVal = parseInt(endingNumbers);
            const startingNumberVal = parseInt(startingNumbers);
            if (endingNumberVal > 24 || startingNumberVal > 24) {
                return null;
            }
        }
        return result;
    }
    getPrimaryTimePatternThroughCache() {
        const primaryPrefix = this.primaryPrefix();
        const primarySuffix = this.primarySuffix();
        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
            return this.cachedPrimaryTimePattern;
        }
        this.cachedPrimaryTimePattern = primaryTimePattern(primaryPrefix, primarySuffix);
        this.cachedPrimaryPrefix = primaryPrefix;
        this.cachedPrimarySuffix = primarySuffix;
        return this.cachedPrimaryTimePattern;
    }
    getFollowingTimePatternThroughCache() {
        const followingPhase = this.followingPhase();
        const followingSuffix = this.followingSuffix();
        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
            return this.cachedFollowingTimePatten;
        }
        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
        this.cachedFollowingPhase = followingPhase;
        this.cachedFollowingSuffix = followingSuffix;
        return this.cachedFollowingTimePatten;
    }
}
exports.AbstractTimeExpressionParser = AbstractTimeExpressionParser;
});

var ENTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class ENTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    constructor(strictMode) {
        super(strictMode);
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|to|\\?)\\s*";
    }
    primaryPrefix() {
        return "(?:(?:at|from)\\s*)??";
    }
    primarySuffix() {
        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("night")) {
                const hour = components.get("hour");
                if (hour >= 6 && hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                    components.assign("meridiem", dist.Meridiem.PM);
                }
                else if (hour < 6) {
                    components.assign("meridiem", dist.Meridiem.AM);
                }
            }
            if (match[0].endsWith("afternoon")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour >= 0 && hour <= 6) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
            if (match[0].endsWith("morning")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
        }
        return components;
    }
}
exports.default = ENTimeExpressionParser;
});

var timeunits = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImpliedTimeUnits = exports.reverseTimeUnits = void 0;
function reverseTimeUnits(timeUnits) {
    const reversed = {};
    for (const key in timeUnits) {
        reversed[key] = -timeUnits[key];
    }
    return reversed;
}
exports.reverseTimeUnits = reverseTimeUnits;
function addImpliedTimeUnits(components, timeUnits) {
    const output = components.clone();
    let date = components.dayjs();
    for (const key in timeUnits) {
        date = date.add(timeUnits[key], key);
    }
    if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
        output.imply("day", date.date());
        output.imply("month", date.month() + 1);
        output.imply("year", date.year());
    }
    if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
        output.imply("second", date.second());
        output.imply("minute", date.minute());
        output.imply("hour", date.hour());
    }
    return output;
}
exports.addImpliedTimeUnits = addImpliedTimeUnits;
});

var ENTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(?:ago|before|earlier)(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "ago(?=(?:\\W|$))", "i");
class ENTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const timeUnits = constants$5.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
    }
}
exports.default = ENTimeUnitAgoFormatParser;
});

var ENTimeUnitLaterFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(later|after|from now|henceforth|forward|out)" + "(?=(?:\\W|$))", "i");
const STRICT_PATTERN = new RegExp("" + "(" + constants$5.TIME_UNITS_PATTERN + ")" + "(later|from now)" + "(?=(?:\\W|$))", "i");
const GROUP_NUM_TIMEUNITS = 1;
class ENTimeUnitLaterFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    innerPattern() {
        return this.strictMode ? STRICT_PATTERN : PATTERN;
    }
    innerExtract(context, match) {
        const fragments = constants$5.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, fragments);
    }
}
exports.default = ENTimeUnitLaterFormatParser;
});

var abstractRefiners = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergingRefiner = exports.Filter = void 0;
class Filter {
    refine(context, results) {
        return results.filter((r) => this.isValid(context, r));
    }
}
exports.Filter = Filter;
class MergingRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const mergedResults = [];
        let curResult = results[0];
        let nextResult = null;
        for (let i = 1; i < results.length; i++) {
            nextResult = results[i];
            const textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
            if (!this.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                mergedResults.push(curResult);
                curResult = nextResult;
            }
            else {
                const left = curResult;
                const right = nextResult;
                const mergedResult = this.mergeResults(textBetween, left, right, context);
                context.debug(() => {
                    console.log(`${this.constructor.name} merged ${left} and ${right} into ${mergedResult}`);
                });
                curResult = mergedResult;
            }
        }
        if (curResult != null) {
            mergedResults.push(curResult);
        }
        return mergedResults;
    }
}
exports.MergingRefiner = MergingRefiner;
});

var AbstractMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class AbstractMergeDateRangeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
    }
    mergeResults(textBetween, fromResult, toResult) {
        if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
            toResult.start.getCertainComponents().forEach((key) => {
                if (!fromResult.start.isCertain(key)) {
                    fromResult.start.assign(key, toResult.start.get(key));
                }
            });
            fromResult.start.getCertainComponents().forEach((key) => {
                if (!toResult.start.isCertain(key)) {
                    toResult.start.assign(key, fromResult.start.get(key));
                }
            });
        }
        if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
            let fromMoment = fromResult.start.dayjs();
            let toMoment = toResult.start.dayjs();
            if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
                fromMoment = fromMoment.add(-7, "days");
                fromResult.start.imply("day", fromMoment.date());
                fromResult.start.imply("month", fromMoment.month() + 1);
                fromResult.start.imply("year", fromMoment.year());
            }
            else if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
                toMoment = toMoment.add(7, "days");
                toResult.start.imply("day", toMoment.date());
                toResult.start.imply("month", toMoment.month() + 1);
                toResult.start.imply("year", toMoment.year());
            }
            else {
                [toResult, fromResult] = [fromResult, toResult];
            }
        }
        const result = fromResult.clone();
        result.start = fromResult.start;
        result.end = toResult.start;
        result.index = Math.min(fromResult.index, toResult.index);
        if (fromResult.index < toResult.index) {
            result.text = fromResult.text + textBetween + toResult.text;
        }
        else {
            result.text = toResult.text + textBetween + fromResult.text;
        }
        return result;
    }
}
exports.default = AbstractMergeDateRangeRefiner;
});

var ENMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class ENMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(to|-)\s*$/i;
    }
}
exports.default = ENMergeDateRangeRefiner;
});

var mergingCalculation = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDateTimeComponent = exports.mergeDateTimeResult = void 0;

function mergeDateTimeResult(dateResult, timeResult) {
    const result = dateResult.clone();
    const beginDate = dateResult.start;
    const beginTime = timeResult.start;
    result.start = mergeDateTimeComponent(beginDate, beginTime);
    if (dateResult.end != null || timeResult.end != null) {
        const endDate = dateResult.end == null ? dateResult.start : dateResult.end;
        const endTime = timeResult.end == null ? timeResult.start : timeResult.end;
        const endDateTime = mergeDateTimeComponent(endDate, endTime);
        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
            if (endDateTime.isCertain("day")) {
                endDateTime.assign("day", endDateTime.get("day") + 1);
            }
            else {
                endDateTime.imply("day", endDateTime.get("day") + 1);
            }
        }
        result.end = endDateTime;
    }
    return result;
}
exports.mergeDateTimeResult = mergeDateTimeResult;
function mergeDateTimeComponent(dateComponent, timeComponent) {
    const dateTimeComponent = dateComponent.clone();
    if (timeComponent.isCertain("hour")) {
        dateTimeComponent.assign("hour", timeComponent.get("hour"));
        dateTimeComponent.assign("minute", timeComponent.get("minute"));
        if (timeComponent.isCertain("second")) {
            dateTimeComponent.assign("second", timeComponent.get("second"));
            if (timeComponent.isCertain("millisecond")) {
                dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
            }
            else {
                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
            }
        }
        else {
            dateTimeComponent.imply("second", timeComponent.get("second"));
            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
        }
    }
    else {
        dateTimeComponent.imply("hour", timeComponent.get("hour"));
        dateTimeComponent.imply("minute", timeComponent.get("minute"));
        dateTimeComponent.imply("second", timeComponent.get("second"));
        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
    }
    if (timeComponent.isCertain("timezoneOffset")) {
        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
    }
    if (timeComponent.isCertain("meridiem")) {
        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
    }
    else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
    }
    if (dateTimeComponent.get("meridiem") == dist.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
        if (timeComponent.isCertain("hour")) {
            dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
        }
        else {
            dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
        }
    }
    return dateTimeComponent;
}
exports.mergeDateTimeComponent = mergeDateTimeComponent;
});

var AbstractMergeDateTimeRefiner = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class ENMergeDateTimeRefiner extends abstractRefiners.MergingRefiner {
    shouldMergeResults(textBetween, currentResult, nextResult) {
        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
            textBetween.match(this.patternBetween()) != null);
    }
    mergeResults(textBetween, currentResult, nextResult) {
        const result = currentResult.start.isOnlyDate()
            ? mergingCalculation.mergeDateTimeResult(currentResult, nextResult)
            : mergingCalculation.mergeDateTimeResult(nextResult, currentResult);
        result.index = currentResult.index;
        result.text = currentResult.text + textBetween + nextResult.text;
        return result;
    }
}
exports.default = ENMergeDateTimeRefiner;
});

var ENMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class ENMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|at|after|before|on|of|,|-)?\\s*$");
    }
}
exports.default = ENMergeDateTimeRefiner;
});

var ExtractTimezoneAbbrRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_NAME_PATTERN = new RegExp("^\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
const DEFAULT_TIMEZONE_ABBR_MAP = {
    ACDT: 630,
    ACST: 570,
    ADT: -180,
    AEDT: 660,
    AEST: 600,
    AFT: 270,
    AKDT: -480,
    AKST: -540,
    ALMT: 360,
    AMST: -180,
    AMT: -240,
    ANAST: 720,
    ANAT: 720,
    AQTT: 300,
    ART: -180,
    AST: -240,
    AWDT: 540,
    AWST: 480,
    AZOST: 0,
    AZOT: -60,
    AZST: 300,
    AZT: 240,
    BNT: 480,
    BOT: -240,
    BRST: -120,
    BRT: -180,
    BST: 60,
    BTT: 360,
    CAST: 480,
    CAT: 120,
    CCT: 390,
    CDT: -300,
    CEST: 120,
    CET: 60,
    CHADT: 825,
    CHAST: 765,
    CKT: -600,
    CLST: -180,
    CLT: -240,
    COT: -300,
    CST: -360,
    CVT: -60,
    CXT: 420,
    ChST: 600,
    DAVT: 420,
    EASST: -300,
    EAST: -360,
    EAT: 180,
    ECT: -300,
    EDT: -240,
    EEST: 180,
    EET: 120,
    EGST: 0,
    EGT: -60,
    EST: -300,
    ET: -300,
    FJST: 780,
    FJT: 720,
    FKST: -180,
    FKT: -240,
    FNT: -120,
    GALT: -360,
    GAMT: -540,
    GET: 240,
    GFT: -180,
    GILT: 720,
    GMT: 0,
    GST: 240,
    GYT: -240,
    HAA: -180,
    HAC: -300,
    HADT: -540,
    HAE: -240,
    HAP: -420,
    HAR: -360,
    HAST: -600,
    HAT: -90,
    HAY: -480,
    HKT: 480,
    HLV: -210,
    HNA: -240,
    HNC: -360,
    HNE: -300,
    HNP: -480,
    HNR: -420,
    HNT: -150,
    HNY: -540,
    HOVT: 420,
    ICT: 420,
    IDT: 180,
    IOT: 360,
    IRDT: 270,
    IRKST: 540,
    IRKT: 540,
    IRST: 210,
    IST: 330,
    JST: 540,
    KGT: 360,
    KRAST: 480,
    KRAT: 480,
    KST: 540,
    KUYT: 240,
    LHDT: 660,
    LHST: 630,
    LINT: 840,
    MAGST: 720,
    MAGT: 720,
    MART: -510,
    MAWT: 300,
    MDT: -360,
    MESZ: 120,
    MEZ: 60,
    MHT: 720,
    MMT: 390,
    MSD: 240,
    MSK: 240,
    MST: -420,
    MUT: 240,
    MVT: 300,
    MYT: 480,
    NCT: 660,
    NDT: -90,
    NFT: 690,
    NOVST: 420,
    NOVT: 360,
    NPT: 345,
    NST: -150,
    NUT: -660,
    NZDT: 780,
    NZST: 720,
    OMSST: 420,
    OMST: 420,
    PDT: -420,
    PET: -300,
    PETST: 720,
    PETT: 720,
    PGT: 600,
    PHOT: 780,
    PHT: 480,
    PKT: 300,
    PMDT: -120,
    PMST: -180,
    PONT: 660,
    PST: -480,
    PT: -480,
    PWT: 540,
    PYST: -180,
    PYT: -240,
    RET: 240,
    SAMT: 240,
    SAST: 120,
    SBT: 660,
    SCT: 240,
    SGT: 480,
    SRT: -180,
    SST: -660,
    TAHT: -600,
    TFT: 300,
    TJT: 300,
    TKT: 780,
    TLT: 540,
    TMT: 300,
    TVT: 720,
    ULAT: 480,
    UTC: 0,
    UYST: -120,
    UYT: -180,
    UZT: 300,
    VET: -210,
    VLAST: 660,
    VLAT: 660,
    VUT: 660,
    WAST: 120,
    WAT: 60,
    WEST: 60,
    WESZ: 60,
    WET: 0,
    WEZ: 0,
    WFT: 720,
    WGST: -120,
    WGT: -180,
    WIB: 420,
    WIT: 540,
    WITA: 480,
    WST: 780,
    WT: 0,
    YAKST: 600,
    YAKT: 600,
    YAPT: 600,
    YEKST: 360,
    YEKT: 360,
};
class ExtractTimezoneAbbrRefiner {
    constructor(timezoneOverrides) {
        this.timezone = Object.assign(Object.assign({}, DEFAULT_TIMEZONE_ABBR_MAP), timezoneOverrides);
    }
    refine(context, results) {
        var _a;
        const timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
        results.forEach((result) => {
            var _a, _b;
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_NAME_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            const timezoneAbbr = match[1].toUpperCase();
            const extractedTimezoneOffset = (_b = (_a = timezoneOverrides[timezoneAbbr]) !== null && _a !== void 0 ? _a : this.timezone[timezoneAbbr]) !== null && _b !== void 0 ? _b : null;
            if (extractedTimezoneOffset === null) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${timezoneAbbr}' into : ${extractedTimezoneOffset}`);
            });
            const currentTimezoneOffset = result.start.get("timezoneOffset");
            if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                return;
            }
            result.text += match[0];
            if (!result.start.isCertain("timezoneOffset")) {
                result.start.assign("timezoneOffset", extractedTimezoneOffset);
            }
            if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                result.end.assign("timezoneOffset", extractedTimezoneOffset);
            }
        });
        return results;
    }
}
exports.default = ExtractTimezoneAbbrRefiner;
});

var ExtractTimezoneOffsetRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
const TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?", "i");
const TIMEZONE_OFFSET_SIGN_GROUP = 1;
const TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
const TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
class ExtractTimezoneOffsetRefiner {
    refine(context, results) {
        results.forEach(function (result) {
            if (result.start.isCertain("timezoneOffset")) {
                return;
            }
            const suffix = context.text.substring(result.index + result.text.length);
            const match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
            if (!match) {
                return;
            }
            context.debug(() => {
                console.log(`Extracting timezone: '${match[0]}' into : ${result}`);
            });
            const hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
            const minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
            let timezoneOffset = hourOffset * 60 + minuteOffset;
            if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                timezoneOffset = -timezoneOffset;
            }
            if (result.end != null) {
                result.end.assign("timezoneOffset", timezoneOffset);
            }
            result.start.assign("timezoneOffset", timezoneOffset);
            result.text += match[0];
        });
        return results;
    }
}
exports.default = ExtractTimezoneOffsetRefiner;
});

var OverlapRemovalRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
class OverlapRemovalRefiner {
    refine(context, results) {
        if (results.length < 2) {
            return results;
        }
        const filteredResults = [];
        let prevResult = results[0];
        for (let i = 1; i < results.length; i++) {
            const result = results[i];
            if (result.index < prevResult.index + prevResult.text.length) {
                if (result.text.length > prevResult.text.length) {
                    prevResult = result;
                }
            }
            else {
                filteredResults.push(prevResult);
                prevResult = result;
            }
        }
        if (prevResult != null) {
            filteredResults.push(prevResult);
        }
        return filteredResults;
    }
}
exports.default = OverlapRemovalRefiner;
});

var ForwardDateRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);
class ForwardDateRefiner {
    refine(context, results) {
        if (!context.option.forwardDate) {
            return results;
        }
        results.forEach(function (result) {
            let refMoment = dayjs_1.default(context.refDate);
            if (result.start.isOnlyDayMonthComponent() && refMoment.isAfter(result.start.dayjs())) {
                for (let i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
                    result.start.imply("year", result.start.get("year") + 1);
                    context.debug(() => {
                        console.log(`Forward yearly adjusted for ${result} (${result.start})`);
                    });
                    if (result.end && !result.end.isCertain("year")) {
                        result.end.imply("year", result.end.get("year") + 1);
                        context.debug(() => {
                            console.log(`Forward yearly adjusted for ${result} (${result.end})`);
                        });
                    }
                }
            }
            if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
                if (refMoment.day() > result.start.get("weekday")) {
                    refMoment = refMoment.day(result.start.get("weekday") + 7);
                }
                else {
                    refMoment = refMoment.day(result.start.get("weekday"));
                }
                result.start.imply("day", refMoment.date());
                result.start.imply("month", refMoment.month() + 1);
                result.start.imply("year", refMoment.year());
                context.debug(() => {
                    console.log(`Forward weekly adjusted for ${result} (${result.start})`);
                });
                if (result.end && result.end.isOnlyWeekdayComponent()) {
                    if (refMoment.day() > result.end.get("weekday")) {
                        refMoment = refMoment.day(result.end.get("weekday") + 7);
                    }
                    else {
                        refMoment = refMoment.day(result.end.get("weekday"));
                    }
                    result.end.imply("day", refMoment.date());
                    result.end.imply("month", refMoment.month() + 1);
                    result.end.imply("year", refMoment.year());
                    context.debug(() => {
                        console.log(`Forward weekly adjusted for ${result} (${result.end})`);
                    });
                }
            }
        });
        return results;
    }
}
exports.default = ForwardDateRefiner;
});

var UnlikelyFormatFilter_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class UnlikelyFormatFilter extends abstractRefiners.Filter {
    constructor(strictMode) {
        super();
        this.strictMode = strictMode;
    }
    isValid(context, result) {
        if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
            context.debug(() => {
                console.log(`Removing unlikely result '${result.text}'`);
            });
            return false;
        }
        if (!result.start.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.start})`);
            });
            return false;
        }
        if (result.end && !result.end.isValidDate()) {
            context.debug(() => {
                console.log(`Removing invalid result: ${result} (${result.end})`);
            });
            return false;
        }
        if (this.strictMode) {
            return this.isStrictModeValid(context, result);
        }
        return true;
    }
    isStrictModeValid(context, result) {
        if (result.start.isOnlyWeekdayComponent()) {
            context.debug(() => {
                console.log(`(Strict) Removing weekday only component: ${result} (${result.end})`);
            });
            return false;
        }
        if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
            context.debug(() => {
                console.log(`(Strict) Removing uncertain time component: ${result} (${result.end})`);
            });
            return false;
        }
        return true;
    }
}
exports.default = UnlikelyFormatFilter;
});

var ISOFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
    "(?:T" +
    "([0-9]{1,2}):([0-9]{1,2})" +
    "(?:" +
    ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
    ")?" +
    "(?:" +
    "Z|([+-]\\d{2}):?(\\d{2})?" +
    ")?" +
    ")?" +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NUMBER_GROUP = 2;
const DATE_NUMBER_GROUP = 3;
const HOUR_NUMBER_GROUP = 4;
const MINUTE_NUMBER_GROUP = 5;
const SECOND_NUMBER_GROUP = 6;
const MILLISECOND_NUMBER_GROUP = 7;
const TZD_HOUR_OFFSET_GROUP = 8;
const TZD_MINUTE_OFFSET_GROUP = 9;
class ISOFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = {};
        components["year"] = parseInt(match[YEAR_NUMBER_GROUP]);
        components["month"] = parseInt(match[MONTH_NUMBER_GROUP]);
        components["day"] = parseInt(match[DATE_NUMBER_GROUP]);
        if (match[HOUR_NUMBER_GROUP] != null) {
            components["hour"] = parseInt(match[HOUR_NUMBER_GROUP]);
            components["minute"] = parseInt(match[MINUTE_NUMBER_GROUP]);
            if (match[SECOND_NUMBER_GROUP] != null) {
                components["second"] = parseInt(match[SECOND_NUMBER_GROUP]);
            }
            if (match[MILLISECOND_NUMBER_GROUP] != null) {
                components["millisecond"] = parseInt(match[MILLISECOND_NUMBER_GROUP]);
            }
            if (match[TZD_HOUR_OFFSET_GROUP] == null) {
                components["timezoneOffset"] = 0;
            }
            else {
                const hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                let minuteOffset = 0;
                if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                    minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                }
                let offset = hourOffset * 60;
                if (offset < 0) {
                    offset -= minuteOffset;
                }
                else {
                    offset += minuteOffset;
                }
                components["timezoneOffset"] = offset;
            }
        }
        return components;
    }
}
exports.default = ISOFormatParser;
});

var MergeWeekdayComponentRefiner_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class MergeWeekdayComponentRefiner extends abstractRefiners.MergingRefiner {
    mergeResults(textBetween, currentResult, nextResult) {
        const newResult = nextResult.clone();
        newResult.index = currentResult.index;
        newResult.text = currentResult.text + textBetween + newResult.text;
        newResult.start.assign("weekday", currentResult.start.get("weekday"));
        if (newResult.end) {
            newResult.end.assign("weekday", currentResult.start.get("weekday"));
        }
        return newResult;
    }
    shouldMergeResults(textBetween, currentResult, nextResult) {
        const weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
            !currentResult.start.isCertain("hour") &&
            nextResult.start.isCertain("day");
        return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
    }
}
exports.default = MergeWeekdayComponentRefiner;
});

var configurations = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeCommonConfiguration = void 0;
const ExtractTimezoneAbbrRefiner_1$1 = __importDefault(ExtractTimezoneAbbrRefiner_1);
const ExtractTimezoneOffsetRefiner_1$1 = __importDefault(ExtractTimezoneOffsetRefiner_1);
const OverlapRemovalRefiner_1$1 = __importDefault(OverlapRemovalRefiner_1);
const ForwardDateRefiner_1$1 = __importDefault(ForwardDateRefiner_1);
const UnlikelyFormatFilter_1$1 = __importDefault(UnlikelyFormatFilter_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const MergeWeekdayComponentRefiner_1$1 = __importDefault(MergeWeekdayComponentRefiner_1);
function includeCommonConfiguration(configuration, strictMode = false) {
    configuration.parsers.unshift(new ISOFormatParser_1$1.default());
    configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneAbbrRefiner_1$1.default());
    configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1$1.default());
    configuration.refiners.unshift(new OverlapRemovalRefiner_1$1.default());
    configuration.refiners.push(new OverlapRemovalRefiner_1$1.default());
    configuration.refiners.push(new ForwardDateRefiner_1$1.default());
    configuration.refiners.push(new UnlikelyFormatFilter_1$1.default(strictMode));
    return configuration;
}
exports.includeCommonConfiguration = includeCommonConfiguration;
});

var casualReferences = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonight = exports.tomorrow = exports.yesterday = exports.today = exports.now = void 0;

const dayjs_1 = __importDefault(dayjs_min);


function now(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.assignSimilarTime(component, targetDate);
    return component;
}
exports.now = now;
function today(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.today = today;
function yesterday(refDate) {
    let targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    targetDate = targetDate.add(-1, "day");
    dayjs.assignSimilarDate(component, targetDate);
    dayjs.implySimilarTime(component, targetDate);
    return component;
}
exports.yesterday = yesterday;
function tomorrow(refDate) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    dayjs.assignTheNextDay(component, targetDate);
    return component;
}
exports.tomorrow = tomorrow;
function tonight(refDate, implyHour = 22) {
    const targetDate = dayjs_1.default(refDate);
    const component = new results.ParsingComponents(refDate, {});
    component.imply("hour", implyHour);
    component.imply("meridiem", dist.Meridiem.PM);
    dayjs.assignSimilarDate(component, targetDate);
    return component;
}
exports.tonight = tonight;
});

var ENCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const references = __importStar(casualReferences);
const PATTERN = /(now|today|tonight|tomorrow|tmr|yesterday|last\s*night)(?=\W|$)/i;
class ENCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "now":
                return references.now(context.refDate);
            case "today":
                return references.today(context.refDate);
            case "yesterday":
                return references.yesterday(context.refDate);
            case "tomorrow":
            case "tmr":
                return references.tomorrow(context.refDate);
            case "tonight":
                return references.tonight(context.refDate);
            default:
                if (lowerText.match(/last\s*night/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        return component;
    }
}
exports.default = ENCasualDateParser;
});

var ENCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);

const PATTERN = /(?:this)?\s*(morning|afternoon|evening|night|midnight|noon)(?=\W|$)/i;
class ENCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "afternoon":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "evening":
            case "night":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
            case "midnight":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "morning":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "noon":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = ENCasualTimeParser;
});

var weeks = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDayJSClosestWeekday = exports.toDayJSWeekday = void 0;
const dayjs_1 = __importDefault(dayjs_min);
function toDayJSWeekday(refDate, offset, modifier) {
    if (!modifier) {
        return toDayJSClosestWeekday(refDate, offset);
    }
    let date = dayjs_1.default(refDate);
    switch (modifier) {
        case "this":
            date = date.day(offset);
            break;
        case "next":
            date = date.day(offset + 7);
            break;
        case "last":
            date = date.day(offset - 7);
            break;
    }
    return date;
}
exports.toDayJSWeekday = toDayJSWeekday;
function toDayJSClosestWeekday(refDate, offset) {
    let date = dayjs_1.default(refDate);
    const refOffset = date.day();
    if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset - 7);
    }
    else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
        date = date.day(offset + 7);
    }
    else {
        date = date.day(offset);
    }
    return date;
}
exports.toDayJSClosestWeekday = toDayJSClosestWeekday;
});

var ENWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:on\\s*?)?" +
    "(?:(this|last|past|next)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$5.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(this|last|past|next)\\s*week)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class ENWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$5.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "last" || modifierWord == "past") {
            modifier = "last";
        }
        else if (modifierWord == "next") {
            modifier = "next";
        }
        else if (modifierWord == "this") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = ENWeekdayParser;
});

var ENRelativeDateFormatParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);


const PATTERN = new RegExp(`(this|next|last|past)\\s*(${pattern.matchAnyPattern(constants$5.TIME_UNIT_DICTIONARY)})(?=\\s*)` + "(?=\\W|$)", "i");
const MODIFIER_WORD_GROUP = 1;
const RELATIVE_WORD_GROUP = 2;
class ENRelativeDateFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
        const unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
        const timeunit = constants$5.TIME_UNIT_DICTIONARY[unitWord];
        if (modifier == "next") {
            const timeUnits = {};
            timeUnits[timeunit] = 1;
            return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        if (modifier == "last" || modifier == "past") {
            const timeUnits = {};
            timeUnits[timeunit] = -1;
            return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
        }
        const components = context.createParsingComponents();
        let date = dayjs_1.default(context.refDate);
        if (unitWord.match(/week/i)) {
            date = date.add(-date.get("d"), "d");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.imply("year", date.year());
        }
        else if (unitWord.match(/month/i)) {
            date = date.add(-date.date() + 1, "d");
            components.imply("day", date.date());
            components.assign("year", date.year());
            components.assign("month", date.month() + 1);
        }
        else if (unitWord.match(/year/i)) {
            date = date.add(-date.date() + 1, "d");
            date = date.add(-date.month(), "month");
            components.imply("day", date.date());
            components.imply("month", date.month() + 1);
            components.assign("year", date.year());
        }
        return components;
    }
}
exports.default = ENRelativeDateFormatParser;
});

var chrono$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingContext = exports.Chrono = void 0;


class Chrono {
    constructor(configuration) {
        configuration = configuration || en.createCasualConfiguration();
        this.parsers = [...configuration.parsers];
        this.refiners = [...configuration.refiners];
    }
    clone() {
        return new Chrono({
            parsers: [...this.parsers],
            refiners: [...this.refiners],
        });
    }
    parseDate(text, referenceDate, option) {
        const results = this.parse(text, referenceDate, option);
        return results.length > 0 ? results[0].start.date() : null;
    }
    parse(text, referenceDate, option) {
        const context = new ParsingContext(text, referenceDate || new Date(), option || {});
        let results = [];
        this.parsers.forEach((parser) => {
            const parsedResults = Chrono.executeParser(context, parser);
            results = results.concat(parsedResults);
        });
        results.sort((a, b) => {
            return a.index - b.index;
        });
        this.refiners.forEach(function (refiner) {
            results = refiner.refine(context, results);
        });
        return results;
    }
    static executeParser(context, parser) {
        const results$1 = [];
        const pattern = parser.pattern(context);
        const originalText = context.text;
        let remainingText = context.text;
        let match = pattern.exec(remainingText);
        while (match) {
            const index = match.index + originalText.length - remainingText.length;
            match.index = index;
            const result = parser.extract(context, match);
            if (!result) {
                remainingText = originalText.substring(match.index + 1);
                match = pattern.exec(remainingText);
                continue;
            }
            let parsedResult = null;
            if (result instanceof results.ParsingResult) {
                parsedResult = result;
            }
            else if (result instanceof results.ParsingComponents) {
                parsedResult = context.createParsingResult(match.index, match[0]);
                parsedResult.start = result;
            }
            else {
                parsedResult = context.createParsingResult(match.index, match[0], result);
            }
            context.debug(() => console.log(`${parser.constructor.name} extracted result ${parsedResult}`));
            results$1.push(parsedResult);
            remainingText = originalText.substring(index + parsedResult.text.length);
            match = pattern.exec(remainingText);
        }
        return results$1;
    }
}
exports.Chrono = Chrono;
class ParsingContext {
    constructor(text, refDate, option) {
        this.text = text;
        this.refDate = refDate;
        this.option = option;
    }
    createParsingComponents(components) {
        if (components instanceof results.ParsingComponents) {
            return components;
        }
        return new results.ParsingComponents(this.refDate, components);
    }
    createParsingResult(index, textOrEndIndex, startComponents, endComponents) {
        const text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
        const start = startComponents ? this.createParsingComponents(startComponents) : null;
        const end = endComponents ? this.createParsingComponents(endComponents) : null;
        return new results.ParsingResult(this.refDate, index, text, start, end);
    }
    debug(block) {
        if (this.option.debug) {
            if (this.option.debug instanceof Function) {
                this.option.debug(block);
            }
            else {
                const handler = this.option.debug;
                handler.debug(block);
            }
        }
    }
}
exports.ParsingContext = ParsingContext;
});

var SlashDateFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([^\\d]|^)" +
    "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
    "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
    "(\\W|$)", "i");
const OPENING_GROUP = 1;
const ENDING_GROUP = 5;
const FIRST_NUMBERS_GROUP = 2;
const SECOND_NUMBERS_GROUP = 3;
const YEAR_GROUP = 4;
class SlashDateFormatParser {
    constructor(littleEndian) {
        this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
        this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
    }
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        if (match[OPENING_GROUP] == "/" || match[ENDING_GROUP] == "/") {
            match.index += match[0].length;
            return;
        }
        const index = match.index + match[OPENING_GROUP].length;
        const text = match[0].substr(match[OPENING_GROUP].length, match[0].length - match[OPENING_GROUP].length - match[ENDING_GROUP].length);
        if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
            return;
        }
        if (!match[YEAR_GROUP] && match[0].indexOf("/") < 0) {
            return;
        }
        const result = context.createParsingResult(index, text);
        let month = parseInt(match[this.groupNumberMonth]);
        let day = parseInt(match[this.groupNumberDay]);
        if (month < 1 || month > 12) {
            if (month > 12) {
                if (day >= 1 && day <= 12 && month <= 31) {
                    [day, month] = [month, day];
                }
                else {
                    return null;
                }
            }
        }
        if (day < 1 || day > 31) {
            return null;
        }
        result.start.assign("day", day);
        result.start.assign("month", month);
        if (match[YEAR_GROUP]) {
            const rawYearNumber = parseInt(match[YEAR_GROUP]);
            const year = years.findMostLikelyADYear(rawYearNumber);
            result.start.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        return result;
    }
}
exports.default = SlashDateFormatParser;
});

var ENTimeUnitCasualRelativeFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp(`(this|last|past|next|\\+|-)\\s*(${constants$5.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
class ENTimeUnitCasualRelativeFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const prefix = match[1].toLowerCase();
        let timeUnits = constants$5.parseTimeUnits(match[2]);
        switch (prefix) {
            case "last":
            case "past":
            case "-":
                timeUnits = timeunits.reverseTimeUnits(timeUnits);
                break;
        }
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = ENTimeUnitCasualRelativeFormatParser;
});

var en = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = void 0;
const ENTimeUnitWithinFormatParser_1$1 = __importDefault(ENTimeUnitWithinFormatParser_1);
const ENMonthNameLittleEndianParser_1$1 = __importDefault(ENMonthNameLittleEndianParser_1);
const ENMonthNameMiddleEndianParser_1$1 = __importDefault(ENMonthNameMiddleEndianParser_1);
const ENMonthNameParser_1$1 = __importDefault(ENMonthNameParser_1);
const ENCasualYearMonthDayParser_1$1 = __importDefault(ENCasualYearMonthDayParser_1);
const ENSlashMonthFormatParser_1$1 = __importDefault(ENSlashMonthFormatParser_1);
const ENTimeExpressionParser_1$1 = __importDefault(ENTimeExpressionParser_1);
const ENTimeUnitAgoFormatParser_1$1 = __importDefault(ENTimeUnitAgoFormatParser_1);
const ENTimeUnitLaterFormatParser_1$1 = __importDefault(ENTimeUnitLaterFormatParser_1);
const ENMergeDateRangeRefiner_1$1 = __importDefault(ENMergeDateRangeRefiner_1);
const ENMergeDateTimeRefiner_1$1 = __importDefault(ENMergeDateTimeRefiner_1);

const ENCasualDateParser_1$1 = __importDefault(ENCasualDateParser_1);
const ENCasualTimeParser_1$1 = __importDefault(ENCasualTimeParser_1);
const ENWeekdayParser_1$1 = __importDefault(ENWeekdayParser_1);
const ENRelativeDateFormatParser_1$1 = __importDefault(ENRelativeDateFormatParser_1);

const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ENTimeUnitCasualRelativeFormatParser_1$1 = __importDefault(ENTimeUnitCasualRelativeFormatParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration(false));
exports.strict = new chrono$1.Chrono(createConfiguration(true, false));
exports.GB = new chrono$1.Chrono(createConfiguration(false, true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = false) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new ENCasualDateParser_1$1.default());
    option.parsers.unshift(new ENCasualTimeParser_1$1.default());
    option.parsers.unshift(new ENMonthNameParser_1$1.default());
    option.parsers.unshift(new ENRelativeDateFormatParser_1$1.default());
    option.parsers.unshift(new ENTimeUnitCasualRelativeFormatParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = false) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new ENTimeUnitWithinFormatParser_1$1.default(),
            new ENMonthNameLittleEndianParser_1$1.default(),
            new ENMonthNameMiddleEndianParser_1$1.default(),
            new ENWeekdayParser_1$1.default(),
            new ENCasualYearMonthDayParser_1$1.default(),
            new ENSlashMonthFormatParser_1$1.default(),
            new ENTimeExpressionParser_1$1.default(strictMode),
            new ENTimeUnitAgoFormatParser_1$1.default(strictMode),
            new ENTimeUnitLaterFormatParser_1$1.default(strictMode),
        ],
        refiners: [new ENMergeDateTimeRefiner_1$1.default(), new ENMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var DETimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class DETimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:um|von)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|bis)\\s*";
    }
    primarySuffix() {
        return "(?:\\s*uhr)?(?:\\s*(?:morgens|vormittags|nachmittags|abends|nachts))?(?=\\W|$)";
    }
    extractPrimaryTimeComponents(context, match) {
        const components = super.extractPrimaryTimeComponents(context, match);
        if (components) {
            if (match[0].endsWith("morgens") || match[0].endsWith("vormittags")) {
                components.assign("meridiem", dist.Meridiem.AM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour"));
                }
            }
            if (match[0].endsWith("nachmittags") || match[0].endsWith("abends") || match[0].endsWith("nachts")) {
                components.assign("meridiem", dist.Meridiem.PM);
                const hour = components.get("hour");
                if (hour < 12) {
                    components.assign("hour", components.get("hour") + 12);
                }
            }
        }
        return components;
    }
}
exports.default = DETimeExpressionParser;
});

var constants$4 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    "sonntag": 0,
    "so": 0,
    "montag": 1,
    "mo": 1,
    "dienstag": 2,
    "di": 2,
    "mittwoch": 3,
    "mi": 3,
    "donnerstag": 4,
    "do": 4,
    "freitag": 5,
    "fr": 5,
    "samstag": 6,
    "sa": 6,
};
exports.MONTH_DICTIONARY = {
    "januar": 1,
    "jan": 1,
    "jan.": 1,
    "februar": 2,
    "feb": 2,
    "feb.": 2,
    "märz": 3,
    "maerz": 3,
    "mär": 3,
    "mär.": 3,
    "mrz": 3,
    "mrz.": 3,
    "april": 4,
    "apr": 4,
    "apr.": 4,
    "mai": 5,
    "juni": 6,
    "jun": 6,
    "jun.": 6,
    "juli": 7,
    "jul": 7,
    "jul.": 7,
    "august": 8,
    "aug": 8,
    "aug.": 8,
    "september": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "oktober": 10,
    "okt": 10,
    "okt.": 10,
    "november": 11,
    "nov": 11,
    "nov.": 11,
    "dezember": 12,
    "dez": 12,
    "dez.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "eins": 1,
    "zwei": 2,
    "drei": 3,
    "vier": 4,
    "fünf": 5,
    "fuenf": 5,
    "sechs": 6,
    "sieben": 7,
    "acht": 8,
    "neun": 9,
    "zehn": 10,
    "elf": 11,
    "zwölf": 12,
    "zwoelf": 12,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconds: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minutes: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    hour: "hour",
    hours: "hour",
    day: "d",
    days: "d",
    week: "week",
    weeks: "week",
    month: "month",
    months: "month",
    y: "year",
    yr: "year",
    year: "year",
    years: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s*an?)?|an?(?:\\s*few)?|few|several|a?\\s*couple\\s*(?:of)?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "a" || num === "an") {
        return 1;
    }
    else if (num.match(/few/)) {
        return 3;
    }
    else if (num.match(/half/)) {
        return 0.5;
    }
    else if (num.match(/couple/)) {
        return 2;
    }
    else if (num.match(/several/)) {
        return 7;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.YEAR_PATTERN = `(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*C(?:hr)?\\.?)?)`;
function parseYear(match) {
    if (/v/i.test(match)) {
        return -parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    if (/n/i.test(match)) {
        return parseInt(match.replace(/[^0-9]+/gi, ""));
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var DEWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:a[mn]\\s*?)?" +
    "(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?" +
    `(${pattern.matchAnyPattern(constants$4.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?" +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const SUFFIX_GROUP = 3;
const WEEKDAY_GROUP = 2;
class DEWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$4.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[SUFFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord.match(/letzte/)) {
            modifier = "last";
        }
        else if (modifierWord.match(/chste/)) {
            modifier = "next";
        }
        else if (modifierWord.match(/diese/)) {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = DEWeekdayParser;
});

var DEMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class DEMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
    }
}
exports.default = DEMergeDateRangeRefiner;
});

var DEMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class DEMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
    }
}
exports.default = DEMergeDateTimeRefiner;
});

var DECasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);




class DECasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const timeKeywordPattern = match[2].toLowerCase();
        const component = context.createParsingComponents();
        dayjs.implySimilarTime(component, targetDate);
        return DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
    }
    static extractTimeComponents(component, timeKeywordPattern) {
        switch (timeKeywordPattern) {
            case "morgen":
                component.imply("hour", 6);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "vormittag":
                component.imply("hour", 9);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "mittag":
            case "mittags":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "nachmittag":
                component.imply("hour", 15);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "abend":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "nacht":
                component.imply("hour", 22);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "mitternacht":
                if (component.get("hour") > 1) {
                    component = timeunits.addImpliedTimeUnits(component, { "day": 1 });
                }
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = DECasualTimeParser;
});

var DECasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);


const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const references = __importStar(casualReferences);
const PATTERN = new RegExp(`(jetzt|heute|morgen|übermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)` +
    `(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const TIME_GROUP = 2;
class DECasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return PATTERN;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
        const timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
        let component = context.createParsingComponents();
        switch (dateKeyword) {
            case "jetzt":
                component = references.now(context.refDate);
                break;
            case "heute":
                component = references.today(context.refDate);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "übermorgen":
            case "uebermorgen":
                targetDate = targetDate.add(1, "day");
                dayjs.assignTheNextDay(component, targetDate);
                break;
            case "gestern":
                targetDate = targetDate.add(-1, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            case "vorgestern":
                targetDate = targetDate.add(-2, "day");
                dayjs.assignSimilarDate(component, targetDate);
                dayjs.implySimilarTime(component, targetDate);
                break;
            default:
                if (dateKeyword.match(/letzte\s*nacht/)) {
                    if (targetDate.hour() > 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
                break;
        }
        if (timeKeyword) {
            component = DECasualTimeParser_1$1.default.extractTimeComponents(component, timeKeyword);
        }
        return component;
    }
}
exports.default = DECasualDateParser;
});

var DEMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$4;


const PATTERN = new RegExp("(?:am\\s*?)?" +
    "(?:den\\s*?)?" +
    `([0-9]{1,2})\\.` +
    `(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\–|\\s)\\s*([0-9]{1,2})\\.?)?\\s*` +
    `(${pattern.matchAnyPattern(constants$4.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class DEMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$4.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = DEMonthNameLittleEndianParser;
});

var de = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const ISOFormatParser_1$1 = __importDefault(ISOFormatParser_1);
const DETimeExpressionParser_1$1 = __importDefault(DETimeExpressionParser_1);
const DEWeekdayParser_1$1 = __importDefault(DEWeekdayParser_1);
const DEMergeDateRangeRefiner_1$1 = __importDefault(DEMergeDateRangeRefiner_1);
const DEMergeDateTimeRefiner_1$1 = __importDefault(DEMergeDateTimeRefiner_1);
const DECasualDateParser_1$1 = __importDefault(DECasualDateParser_1);
const DECasualTimeParser_1$1 = __importDefault(DECasualTimeParser_1);
const DEMonthNameLittleEndianParser_1$1 = __importDefault(DEMonthNameLittleEndianParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new DECasualTimeParser_1$1.default());
    option.parsers.unshift(new DECasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new ISOFormatParser_1$1.default(),
            new SlashDateFormatParser_1$1.default(littleEndian),
            new DETimeExpressionParser_1$1.default(),
            new DEMonthNameLittleEndianParser_1$1.default(),
            new DEWeekdayParser_1$1.default(),
        ],
        refiners: [new DEMergeDateRangeRefiner_1$1.default(), new DEMergeDateTimeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var FRCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);



const references = __importStar(casualReferences);
class FRCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        let targetDate = dayjs_1.default(context.refDate);
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "maintenant":
                return references.now(context.refDate);
            case "aujourd'hui":
                return references.today(context.refDate);
            case "hier":
                return references.yesterday(context.refDate);
            case "demain":
                return references.tomorrow(context.refDate);
            default:
                if (lowerText.match(/cette\s*nuit/)) {
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 22);
                    component.imply("meridiem", dist.Meridiem.PM);
                }
                else if (lowerText.match(/la\s*veille/)) {
                    targetDate = targetDate.add(-1, "day");
                    dayjs.assignSimilarDate(component, targetDate);
                    component.imply("hour", 0);
                }
        }
        return component;
    }
}
exports.default = FRCasualDateParser;
});

var FRCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


class FRCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const suffixLower = match[2].toLowerCase();
        const component = context.createParsingComponents();
        switch (suffixLower) {
            case "après-midi":
            case "aprem":
                component.imply("hour", 14);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "soir":
                component.imply("hour", 18);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.PM);
                break;
            case "matin":
                component.imply("hour", 8);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "a midi":
                component.imply("hour", 12);
                component.imply("minute", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
            case "à minuit":
                component.imply("hour", 0);
                component.imply("meridiem", dist.Meridiem.AM);
                break;
        }
        return component;
    }
}
exports.default = FRCasualTimeParser;
});

var FRTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class FRTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:[àa])\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = FRTimeExpressionParser;
});

var FRMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class FRMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(T|à|a|vers|de|,|-)?\\s*$");
    }
}
exports.default = FRMergeDateTimeRefiner;
});

var FRMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class FRMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(à|a|-)\s*$/i;
    }
}
exports.default = FRMergeDateRangeRefiner;
});

var constants$3 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;

exports.WEEKDAY_DICTIONARY = {
    "dimanche": 0,
    "dim": 0,
    "lundi": 1,
    "lun": 1,
    "mardi": 2,
    "mar": 2,
    "mercredi": 3,
    "mer": 3,
    "jeudi": 4,
    "jeu": 4,
    "vendredi": 5,
    "ven": 5,
    "samedi": 6,
    "sam": 6,
};
exports.MONTH_DICTIONARY = {
    "janvier": 1,
    "jan": 1,
    "jan.": 1,
    "février": 2,
    "fév": 2,
    "fév.": 2,
    "fevrier": 2,
    "fev": 2,
    "fev.": 2,
    "mars": 3,
    "mar": 3,
    "mar.": 3,
    "avril": 4,
    "avr": 4,
    "avr.": 4,
    "mai": 5,
    "juin": 6,
    "jun": 6,
    "juillet": 7,
    "juil": 7,
    "jul": 7,
    "jul.": 7,
    "août": 8,
    "aout": 8,
    "septembre": 9,
    "sep": 9,
    "sep.": 9,
    "sept": 9,
    "sept.": 9,
    "octobre": 10,
    "oct": 10,
    "oct.": 10,
    "novembre": 11,
    "nov": 11,
    "nov.": 11,
    "décembre": 12,
    "decembre": 12,
    "dec": 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    "un": 1,
    "deux": 2,
    "trois": 3,
    "quatre": 4,
    "cinq": 5,
    "six": 6,
    "sept": 7,
    "huit": 8,
    "neuf": 9,
    "dix": 10,
    "onze": 11,
    "douze": 12,
    "treize": 13,
};
exports.TIME_UNIT_DICTIONARY = {
    "sec": "second",
    "seconde": "second",
    "secondes": "second",
    "min": "minute",
    "mins": "minute",
    "minute": "minute",
    "minutes": "minute",
    "h": "hour",
    "hr": "hour",
    "hrs": "hour",
    "heure": "hour",
    "heures": "hour",
    "jour": "d",
    "jours": "d",
    "semaine": "week",
    "semaines": "week",
    "mois": "month",
    "trimestre": "quarter",
    "trimestres": "quarter",
    "ans": "year",
    "année": "year",
    "années": "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|une?|quelques?|demi-?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "une" || num === "un") {
        return 1;
    }
    else if (num.match(/quelques?/)) {
        return 3;
    }
    else if (num.match(/demi-?/)) {
        return 0.5;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:[0-9]{1,2}(?:er)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    num = num.replace(/(?:er)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/AC/i.test(match)) {
        match = match.replace(/BC/i, "");
        return -parseInt(match);
    }
    if (/AD/i.test(match) || /C/i.test(match)) {
        match = match.replace(/[^\d]+/i, "");
        return parseInt(match);
    }
    let yearNumber = parseInt(match);
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        }
        else {
            yearNumber = yearNumber + 2000;
        }
    }
    return yearNumber;
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var FRWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(?:ce)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$3.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(dernier|prochain)\\s*)?" +
    "(?=\\W|\\d|$)", "i");
const WEEKDAY_GROUP = 1;
const POSTFIX_GROUP = 2;
class FRWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$3.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === undefined) {
            return null;
        }
        let suffix = match[POSTFIX_GROUP];
        suffix = suffix || "";
        suffix = suffix.toLowerCase();
        let modifier = null;
        if (suffix == "dernier") {
            modifier = "last";
        }
        else if (suffix == "prochain") {
            modifier = "next";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = FRWeekdayParser;
});

var FRSpecificTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
    "(?:(?:[àa])\\s*)?" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" +
    "(\\d{1,2})(?:h|:)?" +
    "(?:(\\d{1,2})(?:m|:)?)?" +
    "(?:(\\d{1,2})(?:s|:)?)?" +
    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
    "(?=\\W|$)", "i");
const HOUR_GROUP = 2;
const MINUTE_GROUP = 3;
const SECOND_GROUP = 4;
const AM_PM_HOUR_GROUP = 5;
class FRSpecificTimeExpressionParser {
    pattern(context) {
        return FIRST_REG_PATTERN;
    }
    extract(context, match) {
        const result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
        if (result.text.match(/^\d{4}$/)) {
            match.index += match[0].length;
            return null;
        }
        result.start = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
        if (!result.start) {
            match.index += match[0].length;
            return null;
        }
        const remainingText = context.text.substring(match.index + match[0].length);
        const secondMatch = SECOND_REG_PATTERN.exec(remainingText);
        if (secondMatch) {
            result.end = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
            if (result.end) {
                result.text += secondMatch[0];
            }
        }
        return result;
    }
    static extractTimeComponent(extractingComponents, match) {
        let hour = 0;
        let minute = 0;
        let meridiem = null;
        hour = parseInt(match[HOUR_GROUP]);
        if (match[MINUTE_GROUP] != null) {
            minute = parseInt(match[MINUTE_GROUP]);
        }
        if (minute >= 60 || hour > 24) {
            return null;
        }
        if (hour >= 12) {
            meridiem = dist.Meridiem.PM;
        }
        if (match[AM_PM_HOUR_GROUP] != null) {
            if (hour > 12)
                return null;
            const ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
            if (ampm == "a") {
                meridiem = dist.Meridiem.AM;
                if (hour == 12) {
                    hour = 0;
                }
            }
            if (ampm == "p") {
                meridiem = dist.Meridiem.PM;
                if (hour != 12) {
                    hour += 12;
                }
            }
        }
        extractingComponents.assign("hour", hour);
        extractingComponents.assign("minute", minute);
        if (meridiem !== null) {
            extractingComponents.assign("meridiem", meridiem);
        }
        else {
            if (hour < 12) {
                extractingComponents.imply("meridiem", dist.Meridiem.AM);
            }
            else {
                extractingComponents.imply("meridiem", dist.Meridiem.PM);
            }
        }
        if (match[SECOND_GROUP] != null) {
            const second = parseInt(match[SECOND_GROUP]);
            if (second >= 60)
                return null;
            extractingComponents.assign("second", second);
        }
        return extractingComponents;
    }
}
exports.default = FRSpecificTimeExpressionParser;
});

var FRMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$3;
const constants_3 = constants$3;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_3.ORDINAL_NUMBER_PATTERN})` +
    `(?:\\s*(?:au|\\-|\\–|jusqu'au?|\\s)\\s*(${constants_3.ORDINAL_NUMBER_PATTERN}))?` +
    `(?:-|/|\\s*(?:de)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$3.MONTH_DICTIONARY)})` +
    `(?:(?:-|/|,?\\s*)(${constants_2.YEAR_PATTERN}(?![^\\s]\\d)))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class FRMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$3.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = FRMonthNameLittleEndianParser;
});

var FRTimeUnitAgoFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`il y a\\s*(${constants$3.TIME_UNITS_PATTERN})(?=(?:\\W|$))`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$3.parseTimeUnits(match[1]);
        const outputTimeUnits = timeunits.reverseTimeUnits(timeUnits);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, outputTimeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
});

var FRTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class FRTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:dans|en|pour|pendant)\\s*(${constants$3.TIME_UNITS_PATTERN})(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants$3.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = FRTimeUnitWithinFormatParser;
});

var FRTimeUnitRelativeFormatParser = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





class FRTimeUnitAgoFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    constructor() {
        super();
    }
    innerPattern() {
        return new RegExp(`(?:les?|la|l'|du|des?)\\s*` +
            `(${constants$3.NUMBER_PATTERN})?` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?` +
            `\\s*(${pattern.matchAnyPattern(constants$3.TIME_UNIT_DICTIONARY)})` +
            `(?:\\s*(prochaine?s?|derni[eè]re?s?|pass[ée]e?s?|pr[ée]c[ée]dents?|suivante?s?))?`, "i");
    }
    innerExtract(context, match) {
        const num = match[1] ? constants$3.parseNumberPattern(match[1]) : 1;
        const unit = constants$3.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
        let timeUnits = {};
        timeUnits[unit] = num;
        let modifier = match[2] || match[4] || "";
        modifier = modifier.toLowerCase();
        if (!modifier) {
            return;
        }
        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
            timeUnits = timeunits.reverseTimeUnits(timeUnits);
        }
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = FRTimeUnitAgoFormatParser;
});

var fr = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const FRCasualDateParser_1$1 = __importDefault(FRCasualDateParser_1);
const FRCasualTimeParser_1$1 = __importDefault(FRCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const FRTimeExpressionParser_1$1 = __importDefault(FRTimeExpressionParser_1);
const FRMergeDateTimeRefiner_1$1 = __importDefault(FRMergeDateTimeRefiner_1);
const FRMergeDateRangeRefiner_1$1 = __importDefault(FRMergeDateRangeRefiner_1);
const FRWeekdayParser_1$1 = __importDefault(FRWeekdayParser_1);
const FRSpecificTimeExpressionParser_1$1 = __importDefault(FRSpecificTimeExpressionParser_1);
const FRMonthNameLittleEndianParser_1$1 = __importDefault(FRMonthNameLittleEndianParser_1);
const FRTimeUnitAgoFormatParser_1$1 = __importDefault(FRTimeUnitAgoFormatParser_1);
const FRTimeUnitWithinFormatParser_1$1 = __importDefault(FRTimeUnitWithinFormatParser_1);
const FRTimeUnitRelativeFormatParser_1 = __importDefault(FRTimeUnitRelativeFormatParser);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new FRCasualDateParser_1$1.default());
    option.parsers.unshift(new FRCasualTimeParser_1$1.default());
    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new FRMonthNameLittleEndianParser_1$1.default(),
            new FRTimeExpressionParser_1$1.default(),
            new FRSpecificTimeExpressionParser_1$1.default(),
            new FRTimeUnitAgoFormatParser_1$1.default(),
            new FRTimeUnitWithinFormatParser_1$1.default(),
            new FRWeekdayParser_1$1.default(),
        ],
        refiners: [new FRMergeDateTimeRefiner_1$1.default(), new FRMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var constants$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHankaku = void 0;
function toHankaku(text) {
    return String(text)
        .replace(/\u2019/g, "\u0027")
        .replace(/\u201D/g, "\u0022")
        .replace(/\u3000/g, "\u0020")
        .replace(/\uFFE5/g, "\u00A5")
        .replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
}
exports.toHankaku = toHankaku;
function alphaNum(token) {
    return String.fromCharCode(token.charCodeAt(0) - 65248);
}
});

var JPStandardParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);
const PATTERN = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
const SPECIAL_YEAR_GROUP = 1;
const TYPICAL_YEAR_GROUP = 2;
const ERA_GROUP = 3;
const YEAR_NUMBER_GROUP = 4;
const MONTH_GROUP = 5;
const DAY_GROUP = 6;
class JPStandardParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const month = parseInt(constants$2.toHankaku(match[MONTH_GROUP]));
        const day = parseInt(constants$2.toHankaku(match[DAY_GROUP]));
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("同|今|本")) {
            const moment = dayjs_1.default(context.refDate);
            components.assign("year", moment.year());
        }
        if (match[TYPICAL_YEAR_GROUP]) {
            const yearNumText = match[YEAR_NUMBER_GROUP];
            let year = yearNumText == "元" ? 1 : parseInt(constants$2.toHankaku(yearNumText));
            if (match[ERA_GROUP] == "令和") {
                year += 2018;
            }
            else if (match[ERA_GROUP] == "平成") {
                year += 1988;
            }
            else if (match[ERA_GROUP] == "昭和") {
                year += 1925;
            }
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = JPStandardParser;
});

var JPMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class JPMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(から|ー|-)\s*$/i;
    }
}
exports.default = JPMergeDateRangeRefiner;
});

var JPCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(dayjs_min);

const references = __importStar(casualReferences);
const PATTERN = /今日|当日|昨日|明日|今夜|今夕|今晩|今朝/i;
class JPCasualDateParser {
    pattern() {
        return PATTERN;
    }
    extract(context, match) {
        const text = match[0];
        const date = dayjs_1.default(context.refDate);
        const components = context.createParsingComponents();
        switch (text) {
            case "昨日":
                return references.yesterday(context.refDate);
            case "明日":
                return references.tomorrow(context.refDate);
            case "今日":
            case "当日":
                return references.today(context.refDate);
        }
        if (text == "今夜" || text == "今夕" || text == "今晩") {
            components.imply("hour", 22);
            components.assign("meridiem", dist.Meridiem.PM);
        }
        else if (text.match("今朝")) {
            components.imply("hour", 6);
            components.assign("meridiem", dist.Meridiem.AM);
        }
        components.assign("day", date.date());
        components.assign("month", date.month() + 1);
        components.assign("year", date.year());
        return components;
    }
}
exports.default = JPCasualDateParser;
});

var ja = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;
const JPStandardParser_1$1 = __importDefault(JPStandardParser_1);
const JPMergeDateRangeRefiner_1$1 = __importDefault(JPMergeDateRangeRefiner_1);
const JPCasualDateParser_1$1 = __importDefault(JPCasualDateParser_1);

exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration());
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration() {
    const option = createConfiguration();
    option.parsers.unshift(new JPCasualDateParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration() {
    return {
        parsers: [new JPStandardParser_1$1.default()],
        refiners: [new JPMergeDateRangeRefiner_1$1.default()],
    };
}
exports.createConfiguration = createConfiguration;
});

var constants$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYear = exports.YEAR_PATTERN = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
exports.WEEKDAY_DICTIONARY = {
    "domingo": 0,
    "dom": 0,
    "segunda": 1,
    "segunda-feira": 1,
    "seg": 1,
    "terça": 2,
    "terça-feira": 2,
    "ter": 2,
    "quarta": 3,
    "quarta-feira": 3,
    "qua": 3,
    "quinta": 4,
    "quinta-feira": 4,
    "qui": 4,
    "sexta": 5,
    "sexta-feira": 5,
    "sex": 5,
    "sábado": 6,
    "sabado": 6,
    "sab": 6,
};
exports.MONTH_DICTIONARY = {
    "janeiro": 1,
    "jan": 1,
    "jan.": 1,
    "fevereiro": 2,
    "fev": 2,
    "fev.": 2,
    "março": 3,
    "mar": 3,
    "mar.": 3,
    "abril": 4,
    "abr": 4,
    "abr.": 4,
    "maio": 5,
    "mai": 5,
    "mai.": 5,
    "junho": 6,
    "jun": 6,
    "jun.": 6,
    "julho": 7,
    "jul": 7,
    "jul.": 7,
    "agosto": 8,
    "ago": 8,
    "ago.": 8,
    "setembro": 9,
    "set": 9,
    "set.": 9,
    "outubro": 10,
    "out": 10,
    "out.": 10,
    "novembro": 11,
    "nov": 11,
    "nov.": 11,
    "dezembro": 12,
    "dez": 12,
    "dez.": 12,
};
exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
function parseYear(match) {
    if (match.match(/^[0-9]{1,4}$/)) {
        let yearNumber = parseInt(match);
        if (yearNumber < 100) {
            if (yearNumber > 50) {
                yearNumber = yearNumber + 1900;
            }
            else {
                yearNumber = yearNumber + 2000;
            }
        }
        return yearNumber;
    }
    if (match.match(/a\.?\s*c\.?/i)) {
        match = match.replace(/a\.?\s*c\.?/i, "");
        return -parseInt(match);
    }
    return parseInt(match);
}
exports.parseYear = parseYear;
});

var PTWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:(este|esta|passado|pr[oó]ximo)\\s*)?" +
    `(${pattern.matchAnyPattern(constants$1.WEEKDAY_DICTIONARY)})` +
    "(?:\\s*(?:\\,|\\)|\\）))?" +
    "(?:\\s*(este|esta|passado|pr[óo]ximo)\\s*semana)?" +
    "(?=\\W|\\d|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class PTWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants$1.WEEKDAY_DICTIONARY[dayOfWeek];
        if (offset === undefined) {
            return null;
        }
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let norm = prefix || postfix || "";
        norm = norm.toLowerCase();
        let modifier = null;
        if (norm == "passado") {
            modifier = "this";
        }
        else if (norm == "próximo" || norm == "proximo") {
            modifier = "next";
        }
        else if (norm == "este") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = PTWeekdayParser;
});

var PTTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class PTTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:ao?|às?|das|da|de|do)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:o)?|\\?)\\s*";
    }
}
exports.default = PTTimeExpressionParser;
});

var PTMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class PTMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(?:,|à)?\\s*$");
    }
}
exports.default = PTMergeDateTimeRefiner;
});

var PTMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class PTMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(?:-)\s*$/i;
    }
}
exports.default = PTMergeDateRangeRefiner;
});

var PTMonthNameLittleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants$1;


const PATTERN = new RegExp(`([0-9]{1,2})(?:º|ª|°)?` +
    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
    `(?:-|/|\\s*(?:de|,)?\\s*)` +
    `(${pattern.matchAnyPattern(constants$1.MONTH_DICTIONARY)})` +
    `(?:\\s*(?:de|,)?\\s*(${constants_2.YEAR_PATTERN}))?` +
    `(?=\\W|$)`, "i");
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const MONTH_NAME_GROUP = 3;
const YEAR_GROUP = 4;
class PTMonthNameLittleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const result = context.createParsingResult(match.index, match[0]);
        const month = constants$1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = parseInt(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        result.start.assign("month", month);
        result.start.assign("day", day);
        if (match[YEAR_GROUP]) {
            const yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
            result.start.assign("year", yearNumber);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            result.start.imply("year", year);
        }
        if (match[DATE_TO_GROUP]) {
            const endDate = parseInt(match[DATE_TO_GROUP]);
            result.end = result.start.clone();
            result.end.assign("day", endDate);
        }
        return result;
    }
}
exports.default = PTMonthNameLittleEndianParser;
});

var PTCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class PTCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "agora":
                return references.now(context.refDate);
            case "hoje":
                return references.today(context.refDate);
            case "amanha":
            case "amanhã":
                return references.tomorrow(context.refDate);
            case "ontem":
                return references.yesterday(context.refDate);
        }
        return component;
    }
}
exports.default = PTCasualDateParser;
});

var PTCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
class PTCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_2.default(context.refDate);
        const component = context.createParsingComponents();
        switch (match[1].toLowerCase()) {
            case "tarde":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "noite":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 22);
                break;
            case "manha":
            case "manhã":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "meia-noite":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "meio-dia":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = PTCasualTimeParser;
});

var pt = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const PTWeekdayParser_1$1 = __importDefault(PTWeekdayParser_1);
const PTTimeExpressionParser_1$1 = __importDefault(PTTimeExpressionParser_1);
const PTMergeDateTimeRefiner_1$1 = __importDefault(PTMergeDateTimeRefiner_1);
const PTMergeDateRangeRefiner_1$1 = __importDefault(PTMergeDateRangeRefiner_1);
const PTMonthNameLittleEndianParser_1$1 = __importDefault(PTMonthNameLittleEndianParser_1);
const PTCasualDateParser_1$1 = __importDefault(PTCasualDateParser_1);
const PTCasualTimeParser_1$1 = __importDefault(PTCasualTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.push(new PTCasualDateParser_1$1.default());
    option.parsers.push(new PTCasualTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new PTWeekdayParser_1$1.default(),
            new PTTimeExpressionParser_1$1.default(),
            new PTMonthNameLittleEndianParser_1$1.default(),
        ],
        refiners: [new PTMergeDateTimeRefiner_1$1.default(), new PTMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var NLMergeDateRangeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateRangeRefiner_1$1 = __importDefault(AbstractMergeDateRangeRefiner_1);
class NLMergeDateRangeRefiner extends AbstractMergeDateRangeRefiner_1$1.default {
    patternBetween() {
        return /^\s*(tot|-)\s*$/i;
    }
}
exports.default = NLMergeDateRangeRefiner;
});

var NLMergeDateTimeRefiner_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMergeDateTimeRefiner_1 = __importDefault(AbstractMergeDateTimeRefiner);
class NLMergeDateTimeRefiner extends AbstractMergeDateTimeRefiner_1.default {
    patternBetween() {
        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
    }
}
exports.default = NLMergeDateTimeRefiner;
});

var NLCasualDateParser_1 = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });

const references = __importStar(casualReferences);
class NLCasualDateParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const lowerText = match[0].toLowerCase();
        const component = context.createParsingComponents();
        switch (lowerText) {
            case "nu":
                return references.now(context.refDate);
            case "vandaag":
                return references.today(context.refDate);
            case "morgen":
            case "morgend":
                return references.tomorrow(context.refDate);
            case "gisteren":
                return references.yesterday(context.refDate);
        }
        return component;
    }
}
exports.default = NLCasualDateParser;
});

var NLCasualTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });


const dayjs_1 = __importDefault(dayjs_min);

const DAY_GROUP = 1;
const MOMENT_GROUP = 2;
class NLCasualTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const targetDate = dayjs_1.default(context.refDate);
        const component = context.createParsingComponents();
        if (match[DAY_GROUP] === "deze") {
            component.assign("day", context.refDate.getDate());
            component.assign("month", context.refDate.getMonth() + 1);
            component.assign("year", context.refDate.getFullYear());
        }
        switch (match[MOMENT_GROUP].toLowerCase()) {
            case "namiddag":
            case "'s namiddags":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
            case "'s avonds'":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
            case "middernacht":
                dayjs.assignTheNextDay(component, targetDate);
                component.imply("hour", 0);
                component.imply("minute", 0);
                component.imply("second", 0);
                break;
            case "ochtend":
            case "'s ochtends":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
            case "'s middags":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
        }
        return component;
    }
}
exports.default = NLCasualTimeParser;
});

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;


exports.WEEKDAY_DICTIONARY = {
    zondag: 0,
    zon: 0,
    "zon.": 0,
    zo: 0,
    "zo.": 0,
    maandag: 1,
    ma: 1,
    "ma.": 1,
    dinsdag: 2,
    din: 2,
    "din.": 2,
    di: 2,
    "di.": 2,
    woensdag: 3,
    woe: 3,
    "woe.": 3,
    wo: 3,
    "wo.": 3,
    donderdag: 4,
    dond: 4,
    "dond.": 4,
    do: 4,
    "do.": 4,
    vrijdag: 5,
    vrij: 5,
    "vrij.": 5,
    vr: 5,
    "vr.": 5,
    zaterdag: 6,
    zat: 6,
    "zat.": 6,
    "za": 6,
    "za.": 6,
};
exports.MONTH_DICTIONARY = {
    januari: 1,
    jan: 1,
    "jan.": 1,
    februari: 2,
    feb: 2,
    "feb.": 2,
    maart: 3,
    mar: 3,
    "mar.": 3,
    april: 4,
    apr: 4,
    "apr.": 4,
    mei: 5,
    juni: 6,
    jun: 6,
    "jun.": 6,
    juli: 7,
    jul: 7,
    "jul.": 7,
    augustus: 8,
    aug: 8,
    "aug.": 8,
    september: 9,
    sep: 9,
    "sep.": 9,
    sept: 9,
    "sept.": 9,
    oktober: 10,
    okt: 10,
    "okt.": 10,
    november: 11,
    nov: 11,
    "nov.": 11,
    december: 12,
    dec: 12,
    "dec.": 12,
};
exports.INTEGER_WORD_DICTIONARY = {
    een: 1,
    twee: 2,
    drie: 3,
    vier: 4,
    vijf: 5,
    zes: 6,
    zeven: 7,
    acht: 8,
    negen: 9,
    tien: 10,
    elf: 11,
    twaalf: 12,
};
exports.ORDINAL_WORD_DICTIONARY = {
    eerste: 1,
    tweede: 2,
    derde: 3,
    vierde: 4,
    vijfde: 5,
    zesde: 6,
    zevende: 7,
    achtste: 8,
    negende: 9,
    tiende: 10,
    elfde: 11,
    twaalfde: 12,
    dertiende: 13,
    veertiende: 14,
    vijftiende: 15,
    zestiende: 16,
    zeventiende: 17,
    achttiende: 18,
    negentiende: 19,
    twintigste: 20,
    "eenentwintigste": 21,
    "tweeëntwintigste": 22,
    "drieentwintigste": 23,
    "vierentwintigste": 24,
    "vijfentwintigste": 25,
    "zesentwintigste": 26,
    "zevenentwintigste": 27,
    "achtentwintig": 28,
    "negenentwintig": 29,
    "dertigste": 30,
    "eenendertigste": 31,
};
exports.TIME_UNIT_DICTIONARY = {
    sec: "second",
    second: "second",
    seconden: "second",
    min: "minute",
    mins: "minute",
    minute: "minute",
    minuten: "minute",
    h: "hour",
    hr: "hour",
    hrs: "hour",
    uur: "hour",
    uren: "hour",
    dag: "d",
    dagen: "d",
    week: "week",
    weken: "week",
    maand: "month",
    maanden: "month",
    jaar: "year",
    jr: "year",
    jaren: "year",
};
exports.NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY)}|[0-9]+|[0-9]+\\.[0-9]+|een?|halve?)`;
function parseNumberPattern(match) {
    const num = match.toLowerCase();
    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
        return exports.INTEGER_WORD_DICTIONARY[num];
    }
    else if (num === "een") {
        return 1;
    }
    else if (num.match(/halve?/)) {
        return 0.5;
    }
    return parseFloat(num);
}
exports.parseNumberPattern = parseNumberPattern;
exports.ORDINAL_NUMBER_PATTERN = `(?:${pattern.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY)}|[0-9]{1,2}(?:ste|de)?)`;
function parseOrdinalNumberPattern(match) {
    let num = match.toLowerCase();
    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
        return exports.ORDINAL_WORD_DICTIONARY[num];
    }
    num = num.replace(/(?:ste|de)$/i, "");
    return parseInt(num);
}
exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
exports.YEAR_PATTERN = `(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])`;
function parseYear(match) {
    if (/voor Christus/i.test(match)) {
        match = match.replace(/voor Christus/i, "");
        return -parseInt(match);
    }
    if (/na Christus/i.test(match)) {
        match = match.replace(/na Christus/i, "");
        return parseInt(match);
    }
    const rawYearNumber = parseInt(match);
    return years.findMostLikelyADYear(rawYearNumber);
}
exports.parseYear = parseYear;
const SINGLE_TIME_UNIT_PATTERN = `(${exports.NUMBER_PATTERN})\\s{0,5}(${pattern.matchAnyPattern(exports.TIME_UNIT_DICTIONARY)})\\s{0,5}`;
const SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
exports.TIME_UNITS_PATTERN = pattern.repeatedTimeunitPattern(`(?:(?:binnen|in)\\s*)?`, SINGLE_TIME_UNIT_PATTERN);
function parseTimeUnits(timeunitText) {
    const fragments = {};
    let remainingText = timeunitText;
    let match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    while (match) {
        collectDateTimeFragment(fragments, match);
        remainingText = remainingText.substring(match[0].length);
        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
    }
    return fragments;
}
exports.parseTimeUnits = parseTimeUnits;
function collectDateTimeFragment(fragments, match) {
    const num = parseNumberPattern(match[1]);
    const unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
    fragments[unit] = num;
}
});

var NLTimeUnitWithinFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



class NLTimeUnitWithinFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return new RegExp(`(?:binnen|in|binnen de|voor)\\s*` + "(" + constants.TIME_UNITS_PATTERN + ")" + `(?=\\W|$)`, "i");
    }
    innerExtract(context, match) {
        const timeUnits = constants.parseTimeUnits(match[1]);
        return results.ParsingComponents.createRelativeFromRefDate(context.refDate, timeUnits);
    }
}
exports.default = NLTimeUnitWithinFormatParser;
});

var NLWeekdayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });




const PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
    "(?:op\\s*?)?" +
    "(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?" +
    `(${pattern.matchAnyPattern(constants.WEEKDAY_DICTIONARY)})` +
    "(?=\\W|$)", "i");
const PREFIX_GROUP = 1;
const WEEKDAY_GROUP = 2;
const POSTFIX_GROUP = 3;
class NLWeekdayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
        const offset = constants.WEEKDAY_DICTIONARY[dayOfWeek];
        const prefix = match[PREFIX_GROUP];
        const postfix = match[POSTFIX_GROUP];
        let modifierWord = prefix || postfix;
        modifierWord = modifierWord || "";
        modifierWord = modifierWord.toLowerCase();
        let modifier = null;
        if (modifierWord == "vorige") {
            modifier = "last";
        }
        else if (modifierWord == "volgende") {
            modifier = "next";
        }
        else if (modifierWord == "deze") {
            modifier = "this";
        }
        const date = weeks.toDayJSWeekday(context.refDate, offset, modifier);
        return context
            .createParsingComponents()
            .assign("weekday", offset)
            .imply("day", date.date())
            .imply("month", date.month() + 1)
            .imply("year", date.year());
    }
}
exports.default = NLWeekdayParser;
});

var NLMonthNameMiddleEndianParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });


const constants_2 = constants;
const constants_3 = constants;


const PATTERN = new RegExp("(?:on\\s*?)?" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    "(?:\\s*" +
    "(?:tot|\\-|\\–|until|through|till|\\s)\\s*" +
    `(${constants_2.ORDINAL_NUMBER_PATTERN})` +
    ")?" +
    "(?:-|/|\\s*(?:of)?\\s*)" +
    "(" +
    pattern.matchAnyPattern(constants.MONTH_DICTIONARY) +
    ")" +
    "(?:" +
    "(?:-|/|,?\\s*)" +
    `(${constants_3.YEAR_PATTERN}(?![^\\s]\\d))` +
    ")?" +
    "(?=\\W|$)", "i");
const MONTH_NAME_GROUP = 3;
const DATE_GROUP = 1;
const DATE_TO_GROUP = 2;
const YEAR_GROUP = 4;
class NLMonthNameMiddleEndianParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = constants.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        const day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
        if (day > 31) {
            match.index = match.index + match[DATE_GROUP].length;
            return null;
        }
        const components = context.createParsingComponents({
            day: day,
            month: month,
        });
        if (match[YEAR_GROUP]) {
            const year = constants_3.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, day, month);
            components.imply("year", year);
        }
        if (!match[DATE_TO_GROUP]) {
            return components;
        }
        const endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
        const result = context.createParsingResult(match.index, match[0]);
        result.start = components;
        result.end = components.clone();
        result.end.assign("day", endDate);
        return result;
    }
}
exports.default = NLMonthNameMiddleEndianParser;
});

var NLMonthNameParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const constants_2 = constants;

const PATTERN = new RegExp(`(${pattern.matchAnyPattern(constants.MONTH_DICTIONARY)})` +
    `\\s*` +
    `(?:` +
    `[,-]?\\s*(${constants_2.YEAR_PATTERN})?` +
    ")?" +
    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
const MONTH_NAME_GROUP = 1;
const YEAR_GROUP = 2;
class NLMonthNameParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const components = context.createParsingComponents();
        components.imply("day", 1);
        const monthName = match[MONTH_NAME_GROUP];
        const month = constants.MONTH_DICTIONARY[monthName.toLowerCase()];
        components.assign("month", month);
        if (match[YEAR_GROUP]) {
            const year = constants_2.parseYear(match[YEAR_GROUP]);
            components.assign("year", year);
        }
        else {
            const year = years.findYearClosestToRef(context.refDate, 1, month);
            components.imply("year", year);
        }
        return components;
    }
}
exports.default = NLMonthNameParser;
});

var NLSlashMonthFormatParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

const PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
const MONTH_GROUP = 1;
const YEAR_GROUP = 2;
class NLSlashMonthFormatParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const year = parseInt(match[YEAR_GROUP]);
        const month = parseInt(match[MONTH_GROUP]);
        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
    }
}
exports.default = NLSlashMonthFormatParser;
});

var NLTimeExpressionParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

class NLTimeExpressionParser extends AbstractTimeExpressionParser_1.AbstractTimeExpressionParser {
    primaryPrefix() {
        return "(?:(?:om)\\s*)?";
    }
    followingPhase() {
        return "\\s*(?:\\-|\\–|\\~|\\〜|om|\\?)\\s*";
    }
    extractPrimaryTimeComponents(context, match) {
        if (match[0].match(/^\s*\d{4}\s*$/)) {
            return null;
        }
        return super.extractPrimaryTimeComponents(context, match);
    }
}
exports.default = NLTimeExpressionParser;
});

var NLCasualYearMonthDayParser_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });



const PATTERN = new RegExp(`([0-9]{4})[\\.\\/\\s]` +
    `(?:(${pattern.matchAnyPattern(constants.MONTH_DICTIONARY)})|([0-9]{1,2}))[\\.\\/\\s]` +
    `([0-9]{1,2})` +
    "(?=\\W|$)", "i");
const YEAR_NUMBER_GROUP = 1;
const MONTH_NAME_GROUP = 2;
const MONTH_NUMBER_GROUP = 3;
const DATE_NUMBER_GROUP = 4;
class NLCasualYearMonthDayParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern() {
        return PATTERN;
    }
    innerExtract(context, match) {
        const month = match[MONTH_NUMBER_GROUP]
            ? parseInt(match[MONTH_NUMBER_GROUP])
            : constants.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
        if (month < 1 || month > 12) {
            return null;
        }
        const year = parseInt(match[YEAR_NUMBER_GROUP]);
        const day = parseInt(match[DATE_NUMBER_GROUP]);
        return {
            day: day,
            month: month,
            year: year,
        };
    }
}
exports.default = NLCasualYearMonthDayParser;
});

var NLCasualDateTimeParser_1 = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });



const dayjs_2 = __importDefault(dayjs_min);
const DATE_GROUP = 1;
const TIME_OF_DAY_GROUP = 2;
class NLCasualDateTimeParser extends AbstractParserWithWordBoundary.AbstractParserWithWordBoundaryChecking {
    innerPattern(context) {
        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
    }
    innerExtract(context, match) {
        const dateText = match[DATE_GROUP].toLowerCase();
        const timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
        const component = context.createParsingComponents();
        const targetDate = dayjs_2.default(context.refDate);
        switch (dateText) {
            case "gisteren":
                dayjs.assignSimilarDate(component, targetDate.add(-1, "day"));
                break;
            case "van":
                dayjs.assignSimilarDate(component, targetDate);
                break;
            case "morgen":
                dayjs.assignTheNextDay(component, targetDate);
                break;
        }
        switch (timeText) {
            case "ochtend":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 6);
                break;
            case "middag":
                component.imply("meridiem", dist.Meridiem.AM);
                component.imply("hour", 12);
                break;
            case "namiddag":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 15);
                break;
            case "avond":
                component.imply("meridiem", dist.Meridiem.PM);
                component.imply("hour", 20);
                break;
        }
        return component;
    }
}
exports.default = NLCasualDateTimeParser;
});

var nl = createCommonjsModule(function (module, exports) {
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = void 0;


const NLMergeDateRangeRefiner_1$1 = __importDefault(NLMergeDateRangeRefiner_1);
const NLMergeDateTimeRefiner_1$1 = __importDefault(NLMergeDateTimeRefiner_1);
const NLCasualDateParser_1$1 = __importDefault(NLCasualDateParser_1);
const NLCasualTimeParser_1$1 = __importDefault(NLCasualTimeParser_1);
const SlashDateFormatParser_1$1 = __importDefault(SlashDateFormatParser_1);
const NLTimeUnitWithinFormatParser_1$1 = __importDefault(NLTimeUnitWithinFormatParser_1);
const NLWeekdayParser_1$1 = __importDefault(NLWeekdayParser_1);
const NLMonthNameMiddleEndianParser_1$1 = __importDefault(NLMonthNameMiddleEndianParser_1);
const NLMonthNameParser_1$1 = __importDefault(NLMonthNameParser_1);
const NLSlashMonthFormatParser_1$1 = __importDefault(NLSlashMonthFormatParser_1);
const NLTimeExpressionParser_1$1 = __importDefault(NLTimeExpressionParser_1);
const NLCasualYearMonthDayParser_1$1 = __importDefault(NLCasualYearMonthDayParser_1);
const NLCasualDateTimeParser_1$1 = __importDefault(NLCasualDateTimeParser_1);
exports.casual = new chrono$1.Chrono(createCasualConfiguration());
exports.strict = new chrono$1.Chrono(createConfiguration(true));
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
function createCasualConfiguration(littleEndian = true) {
    const option = createConfiguration(false, littleEndian);
    option.parsers.unshift(new NLCasualDateParser_1$1.default());
    option.parsers.unshift(new NLCasualTimeParser_1$1.default());
    option.parsers.unshift(new NLCasualDateTimeParser_1$1.default());
    return option;
}
exports.createCasualConfiguration = createCasualConfiguration;
function createConfiguration(strictMode = true, littleEndian = true) {
    return configurations.includeCommonConfiguration({
        parsers: [
            new SlashDateFormatParser_1$1.default(littleEndian),
            new NLMonthNameMiddleEndianParser_1$1.default(),
            new NLMonthNameParser_1$1.default(),
            new NLTimeExpressionParser_1$1.default(),
            new NLTimeUnitWithinFormatParser_1$1.default(),
            new NLSlashMonthFormatParser_1$1.default(),
            new NLWeekdayParser_1$1.default(),
            new NLCasualYearMonthDayParser_1$1.default(),
        ],
        refiners: [new NLMergeDateTimeRefiner_1$1.default(), new NLMergeDateRangeRefiner_1$1.default()],
    }, strictMode);
}
exports.createConfiguration = createConfiguration;
});

var dist = createCommonjsModule(function (module, exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (commonjsGlobal && commonjsGlobal.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = exports.parse = exports.casual = exports.strict = exports.nl = exports.pt = exports.ja = exports.fr = exports.de = exports.Meridiem = exports.Chrono = exports.en = void 0;
const en$1 = __importStar(en);
exports.en = en$1;

Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono$1.Chrono; } });
(function (Meridiem) {
    Meridiem[Meridiem["AM"] = 0] = "AM";
    Meridiem[Meridiem["PM"] = 1] = "PM";
})(exports.Meridiem || (exports.Meridiem = {}));
const de$1 = __importStar(de);
exports.de = de$1;
const fr$1 = __importStar(fr);
exports.fr = fr$1;
const ja$1 = __importStar(ja);
exports.ja = ja$1;
const pt$1 = __importStar(pt);
exports.pt = pt$1;
const nl$1 = __importStar(nl);
exports.nl = nl$1;
exports.strict = en$1.strict;
exports.casual = en$1.casual;
function parse(text, ref, option) {
    return exports.casual.parse(text, ref, option);
}
exports.parse = parse;
function parseDate(text, ref, option) {
    return exports.casual.parseDate(text, ref, option);
}
exports.parseDate = parseDate;
});

var chrono = /*@__PURE__*/getDefaultExportFromCjs(dist);

/** @format */
class DateParser {
    parseDateRangeFromSelection(selection) {
        let moments = [];
        const [start, end] = selection.split(' to ').map((s) => window.moment(this.parseDate(s)));
        console.debug('Start: ' + start);
        console.debug('End: ' + end);
        let next = start;
        do {
            console.debug('Next: ' + next);
            moments.push(window.moment(next));
            next.add(1, 'd');
        } while (next.isSameOrBefore(end, 'day'));
        return moments;
    }
    parseDate(input) {
        console.debug('entered parseDate with input: ', input);
        try {
            const parsed = chrono.parseDate(input);
            console.debug('parsed: ', parsed);
            return parsed;
        }
        catch (exception) {
            console.error(exception);
        }
    }
}

/** @format */
// TODO:
// Track activity using events (file created, file modified, file opened, track additions/deletions by capturing file length on open/close (or focus/lose focus))
const DEFAULT_SETTINGS = {};
class DailyActivityPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading plugin');
            // await this.loadSettings();
            this.activityLogger = new ActivityLogger(this.app, this);
            this.addCommand({
                id: 'links-to-files-created-today',
                name: "Links to Files Created Today for date (default's for today)",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    this.activityLogger.insertActivityLog({ insertCreatedOnDateFiles: true, activeView, moments: this.getDates(activeView) });
                },
                hotkeys: [
                    {
                        modifiers: ['Alt'],
                        key: 'c',
                    },
                ],
            });
            this.addCommand({
                id: 'links-to-files-modified-today',
                name: "Links to Files Modified for date (default's for today)",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    this.activityLogger.insertActivityLog({ insertModifiedOnDateFiles: true, activeView, moments: this.getDates(activeView) });
                },
                hotkeys: [
                    {
                        modifiers: ['Alt'],
                        key: 'm',
                    },
                ],
            });
            this.addCommand({
                id: 'files-created-today',
                name: "Plain Text List of Files Created for date (default's for today)",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    this.activityLogger.insertActivityLog({ insertCreatedOnDateFiles: true, activeView, makeLink: false, moments: this.getDates(activeView) });
                },
                hotkeys: [],
            });
            this.addCommand({
                id: 'files-modified-today',
                name: "Plain Text List of Files Modified for date (default's for today)",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    this.activityLogger.insertActivityLog({ insertModifiedOnDateFiles: true, activeView, makeLink: false, moments: this.getDates(activeView) });
                },
                hotkeys: [],
            });
            this.addCommand({
                id: 'file-stats-today',
                name: "(Deprecated) Today's Stats",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    this.activityLogger.insertFileStats({ activeView });
                },
            });
            this.addCommand({
                id: 'obsidian-stats',
                name: "Stats for date (default's for today)",
                checkCallback: (checking) => {
                    let activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (activeView == null) {
                        return false;
                    }
                    if (checking) {
                        return true;
                    }
                    let moments = this.getDates(activeView);
                    console.log(`${moments}`);
                    this.activityLogger.insertFileStats({ activeView, moments });
                },
            });
        });
    }
    onunload() {
        console.log('unloading plugin');
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    getDates(activeView) {
        let editor = activeView.editor;
        const dp = new DateParser();
        if (!editor || !editor.somethingSelected()) {
            // Return today for start & end
            return [window.moment()];
        }
        let selection = editor.getSelection();
        console.log('Selection contains a date range: ', selection.contains('to'));
        let moments = [];
        if (selection.contains('to')) {
            moments = dp.parseDateRangeFromSelection(selection);
        }
        else {
            moments.push(window.moment(dp.parseDate(selection)));
        }
        return moments;
    }
}

module.exports = DailyActivityPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9BY3Rpdml0eUxvZ2dlci50cyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L3V0aWxzL3BhdHRlcm4uanMiLCIuLi9ub2RlX21vZHVsZXMvZGF5anMvZGF5anMubWluLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY2FsY3VsYXRpb24veWVhcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL2NvbnN0YW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9kYXlqcy9wbHVnaW4vcXVhcnRlck9mWWVhci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L3V0aWxzL2RheWpzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvcmVzdWx0cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOTW9udGhOYW1lUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOU2xhc2hNb250aEZvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5UaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L3V0aWxzL3RpbWV1bml0cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOVGltZVVuaXRMYXRlckZvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9hYnN0cmFjdFJlZmluZXJzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9yZWZpbmVycy9FTk1lcmdlRGF0ZVJhbmdlUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NhbGN1bGF0aW9uL21lcmdpbmdDYWxjdWxhdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9yZWZpbmVycy9FTk1lcmdlRGF0ZVRpbWVSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL0V4dHJhY3RUaW1lem9uZUFiYnJSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL0V4dHJhY3RUaW1lem9uZU9mZnNldFJlZmluZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vcmVmaW5lcnMvT3ZlcmxhcFJlbW92YWxSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3JlZmluZXJzL0ZvcndhcmREYXRlUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9yZWZpbmVycy9Vbmxpa2VseUZvcm1hdEZpbHRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9wYXJzZXJzL0lTT0Zvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2NvbW1vbi9yZWZpbmVycy9NZXJnZVdlZWtkYXlDb21wb25lbnRSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29uZmlndXJhdGlvbnMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9jb21tb24vY2FzdWFsUmVmZXJlbmNlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vcGFyc2Vycy9FTkNhc3VhbERhdGVQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5DYXN1YWxUaW1lUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY2FsY3VsYXRpb24vd2Vla3MuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2VuL3BhcnNlcnMvRU5XZWVrZGF5UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOUmVsYXRpdmVEYXRlRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY2hyb25vLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvY29tbW9uL3BhcnNlcnMvU2xhc2hEYXRlRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9lbi9wYXJzZXJzL0VOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZW4vaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2RlL3BhcnNlcnMvREVUaW1lRXhwcmVzc2lvblBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvY29uc3RhbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9wYXJzZXJzL0RFV2Vla2RheVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvcmVmaW5lcnMvREVNZXJnZURhdGVSYW5nZVJlZmluZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2RlL3JlZmluZXJzL0RFTWVyZ2VEYXRlVGltZVJlZmluZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2RlL3BhcnNlcnMvREVDYXN1YWxUaW1lUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9kZS9wYXJzZXJzL0RFQ2FzdWFsRGF0ZVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvcGFyc2Vycy9ERU1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZGUvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJDYXN1YWxEYXRlUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSQ2FzdWFsVGltZVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUlRpbWVFeHByZXNzaW9uUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9yZWZpbmVycy9GUk1lcmdlRGF0ZVRpbWVSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9yZWZpbmVycy9GUk1lcmdlRGF0ZVJhbmdlUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvY29uc3RhbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSV2Vla2RheVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2ZyL3BhcnNlcnMvRlJUaW1lVW5pdEFnb0Zvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvcGFyc2Vycy9GUlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9mci9wYXJzZXJzL0ZSVGltZVVuaXRSZWxhdGl2ZUZvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvZnIvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2phL2NvbnN0YW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvamEvcGFyc2Vycy9KUFN0YW5kYXJkUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9qYS9yZWZpbmVycy9KUE1lcmdlRGF0ZVJhbmdlUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvamEvcGFyc2Vycy9KUENhc3VhbERhdGVQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL2phL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9wdC9jb25zdGFudHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3BhcnNlcnMvUFRXZWVrZGF5UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9wdC9wYXJzZXJzL1BUVGltZUV4cHJlc3Npb25QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3JlZmluZXJzL1BUTWVyZ2VEYXRlVGltZVJlZmluZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L3JlZmluZXJzL1BUTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9wdC9wYXJzZXJzL1BUTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9wdC9wYXJzZXJzL1BUQ2FzdWFsRGF0ZVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvcHQvcGFyc2Vycy9QVENhc3VhbFRpbWVQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL3B0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9yZWZpbmVycy9OTE1lcmdlRGF0ZVJhbmdlUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcmVmaW5lcnMvTkxNZXJnZURhdGVUaW1lUmVmaW5lci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTENhc3VhbERhdGVQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxDYXN1YWxUaW1lUGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9jb25zdGFudHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxUaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvcGFyc2Vycy9OTFdlZWtkYXlQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxNb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxNb250aE5hbWVQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nocm9uby1ub2RlL2Rpc3QvbG9jYWxlcy9ubC9wYXJzZXJzL05MVGltZUV4cHJlc3Npb25QYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxDYXN1YWxZZWFyTW9udGhEYXlQYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9sb2NhbGVzL25sL3BhcnNlcnMvTkxDYXN1YWxEYXRlVGltZVBhcnNlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jaHJvbm8tbm9kZS9kaXN0L2xvY2FsZXMvbmwvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY2hyb25vLW5vZGUvZGlzdC9pbmRleC5qcyIsIi4uL3NyYy9EYXRlUGFyc2VyLnRzIiwiLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbi8qKiBAZGVwcmVjYXRlZCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20pIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZyb20ubGVuZ3RoLCBqID0gdG8ubGVuZ3RoOyBpIDwgaWw7IGkrKywgaisrKVxyXG4gICAgICAgIHRvW2pdID0gZnJvbVtpXTtcclxuICAgIHJldHVybiB0bztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsIi8qKiBAZm9ybWF0ICovXG5cbmltcG9ydCBEYWlseUFjdGl2aXR5UGx1Z2luIGZyb20gJ3NyYy9tYWluJ1xuaW1wb3J0IHsgQXBwLCBnZXRMaW5rcGF0aCwgTWFya2Rvd25WaWV3LCBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbidcbmltcG9ydCB7IE1vbWVudCB9IGZyb20gJ21vbWVudCdcblxuZXhwb3J0IGNsYXNzIEFjdGl2aXR5TG9nZ2VyIHtcbiAgYXBwOiBBcHBcbiAgcGx1Z2luOiBQbHVnaW5cblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBEYWlseUFjdGl2aXR5UGx1Z2luKSB7XG4gICAgdGhpcy5hcHAgPSBhcHBcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpblxuICB9XG5cbiAgcHJpdmF0ZSBnZXRMaW5rc1RvRmlsZXNNb2RpZmllZE9uRGF0ZShtb21lbnQ6IE1vbWVudCwgbWFrZUxpbms9dHJ1ZSkge1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKClcbiAgICBsZXQgbGlua3M6IHN0cmluZ1tdID0gW11cbiAgICBmaWxlcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAobW9tZW50LmlzU2FtZShuZXcgRGF0ZShmLnN0YXQubXRpbWUpLCAnZGF5JykpIHtcbiAgICAgICAgbWFrZUxpbmsgPyBsaW5rcy5wdXNoKGBbWyR7Z2V0TGlua3BhdGgoZi5wYXRoKX1dXWApIDogbGlua3MucHVzaChnZXRMaW5rcGF0aChmLnBhdGgpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbGlua3NcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGlua3NUb0ZpbGVzQ3JlYXRlZE9uRGF0ZShtb21lbnQ6IE1vbWVudCwgbWFrZUxpbms9dHJ1ZSkge1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVzKClcbiAgICBsZXQgbGlua3M6IHN0cmluZ1tdID0gW11cbiAgICBmaWxlcy5mb3JFYWNoKChmKSA9PiB7XG4gICAgICBpZiAobW9tZW50LmlzU2FtZShuZXcgRGF0ZShmLnN0YXQuY3RpbWUpLCAnZGF5JykpIHtcbiAgICAgICAgbWFrZUxpbmsgPyBsaW5rcy5wdXNoKGBbWyR7Z2V0TGlua3BhdGgoZi5wYXRoKX1dXWApIDogbGlua3MucHVzaChnZXRMaW5rcGF0aChmLnBhdGgpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbGlua3NcbiAgfVxuXG4gIGFwcGVuZExpbmtzVG9Db250ZW50KGV4aXN0aW5nQ29udGVudDogc3RyaW5nLCBsaW5rczogc3RyaW5nW10sIGhlYWRlcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGV4aXN0aW5nQ29udGVudCArXG4gICAgICBgXG5cbiR7bGlua3Muam9pbignXFxuJyl9XG5gXG4gICAgKVxuICB9XG5cbiAgYXN5bmMgaW5zZXJ0QWN0aXZpdHlMb2coe1xuICAgIGluc2VydENyZWF0ZWRPbkRhdGVGaWxlcyA9IGZhbHNlLFxuICAgIGluc2VydE1vZGlmaWVkT25EYXRlRmlsZXMgPSBmYWxzZSxcbiAgICBtb21lbnRzID0gW3dpbmRvdy5tb21lbnQoKV0sXG4gICAgYWN0aXZlVmlldyA9IG51bGwsXG4gICAgbWFrZUxpbmsgPSB0cnVlXG4gIH06IHtcbiAgICBpbnNlcnRDcmVhdGVkT25EYXRlRmlsZXM/OiBib29sZWFuXG4gICAgaW5zZXJ0TW9kaWZpZWRPbkRhdGVGaWxlcz86IGJvb2xlYW5cbiAgICBtb21lbnRzPzogTW9tZW50W11cbiAgICBhY3RpdmVWaWV3PzogTWFya2Rvd25WaWV3LFxuICAgIG1ha2VMaW5rPzogYm9vbGVhblxuICB9KSB7XG4gICAgaWYgKGFjdGl2ZVZpZXcgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxldCBlZGl0b3IgPSBhY3RpdmVWaWV3LmVkaXRvclxuICAgIGxldCBkb2MgPSBlZGl0b3IuZ2V0RG9jKClcblxuICAgIGxldCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChhY3RpdmVWaWV3LmZpbGUpXG4gICAgbGV0IGNyZWF0ZWRUb2RheUxpbmtzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKGluc2VydENyZWF0ZWRPbkRhdGVGaWxlcykge1xuICAgICAgY3JlYXRlZFRvZGF5TGlua3MgPSBtb21lbnRzLmZsYXRNYXAoKG1vbWVudCkgPT4gdGhpcy5nZXRMaW5rc1RvRmlsZXNDcmVhdGVkT25EYXRlKG1vbWVudCwgbWFrZUxpbmspKVxuICAgICAgY29uc29sZS5sb2coY3JlYXRlZFRvZGF5TGlua3MubGVuZ3RoLCAnIEZpbGVzIGZvdW5kIGNyZWF0ZWQgb24gdGhlc2UgZGF0ZShzKTogJywgbW9tZW50cy5tYXAobSA9PiBtLmRhdGUoKSkpXG4gICAgICBjb250ZW50ID0gdGhpcy5hcHBlbmRMaW5rc1RvQ29udGVudChjb250ZW50LCBjcmVhdGVkVG9kYXlMaW5rcywgJ0NyZWF0ZWQnKVxuICAgIH1cbiAgICBpZiAoaW5zZXJ0TW9kaWZpZWRPbkRhdGVGaWxlcykge1xuICAgICAgbGV0IG1vZGlmaWVkVG9kYXlMaW5rczogc3RyaW5nW10gPSBtb21lbnRzLmZsYXRNYXAoKG1vbWVudCkgPT50aGlzLmdldExpbmtzVG9GaWxlc01vZGlmaWVkT25EYXRlKG1vbWVudCwgbWFrZUxpbmspLmZpbHRlcihcbiAgICAgICAgKGxpbmspID0+IGNyZWF0ZWRUb2RheUxpbmtzLmluZGV4T2YobGluaykgPT09IC0xXG4gICAgICApKVxuICAgICAgY29uc29sZS5sb2cobW9kaWZpZWRUb2RheUxpbmtzLmxlbmd0aCwgJyBGaWxlcyBmb3VuZCBtb2RpZmllZCBvbiB0aGVzZSBkYXRlKHMpOiAnLCBtb21lbnRzLm1hcChtID0+IG0uZGF0ZSgpKSlcbiAgICAgIGNvbnRlbnQgPSB0aGlzLmFwcGVuZExpbmtzVG9Db250ZW50KGNvbnRlbnQsIG1vZGlmaWVkVG9kYXlMaW5rcywgJ01vZGlmaWVkJylcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoYWN0aXZlVmlldy5maWxlLCBjb250ZW50KVxuICB9XG5cbiAgZ2VuZXJhdGVGaWxlU3RhdFJvdyhtb21lbnQ6IE1vbWVudCwgc3RhdHM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBsZXQgcm93ID0gYHwke21vbWVudC5mb3JtYXQoJ1lZWVktTU0tREQnKX18YFxuICAgIHN0YXRzLmZvckVhY2goKHN0YXQpID0+IHtcbiAgICAgIGxldCBzdGF0VmFsdWVcbiAgICAgIGlmIChzdGF0ID09ICdjcmVhdGVkJykge1xuICAgICAgICBzdGF0VmFsdWUgPSB0aGlzLmdldExpbmtzVG9GaWxlc0NyZWF0ZWRPbkRhdGUobW9tZW50KS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ID09ICdtb2RpZmllZCcpIHtcbiAgICAgICAgc3RhdFZhbHVlID0gdGhpcy5nZXRMaW5rc1RvRmlsZXNNb2RpZmllZE9uRGF0ZShtb21lbnQpLmxlbmd0aFxuICAgICAgfVxuXG4gICAgICByb3cgPSByb3cgKyBgJHtzdGF0VmFsdWV9fGBcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJvd1xuICB9XG5cbiAgZ2VuZXJhdGVGaWxlU3RhdEhlYWRlcihzdGF0czogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIHJldHVybiAoXG4gICAgICBgfCBEYXRlIHxgICtcbiAgICAgIHN0YXRzLmpvaW4oJyB8ICcpICtcbiAgICAgIGB8XG58LS0tLS0tLXwke3N0YXRzLm1hcCgocykgPT4gJy0tLS0tLS0tLS0nKS5qb2luKCd8Jyl9fGBcbiAgICApXG4gIH1cbiAgYXN5bmMgaW5zZXJ0RmlsZVN0YXRzKHtcbiAgICBzdGF0cyA9IFsnY3JlYXRlZCcsICdtb2RpZmllZCddLFxuICAgIG1vbWVudHMgPSBbd2luZG93Lm1vbWVudCgpXSxcbiAgICBhY3RpdmVWaWV3ID0gbnVsbCxcbiAgICBhbGxUaW1lID0gZmFsc2UsXG4gIH06IHtcbiAgICBzdGF0cz86IHN0cmluZ1tdXG4gICAgbW9tZW50cz86IE1vbWVudFtdXG4gICAgYWN0aXZlVmlldz86IE1hcmtkb3duVmlld1xuICAgIGFsbFRpbWU/OiBib29sZWFuXG4gIH0pIHtcbiAgICBpZiAoYWN0aXZlVmlldyA9PSBudWxsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoYWN0aXZlVmlldy5maWxlKVxuXG4gICAgbGV0IGhlYWRlciA9IHRoaXMuZ2VuZXJhdGVGaWxlU3RhdEhlYWRlcihzdGF0cylcbiAgICBjb25zb2xlLmxvZyhoZWFkZXIpXG5cbiAgICBsZXQgcm93czogc3RyaW5nW10gPSBbXVxuICAgIG1vbWVudHMuZm9yRWFjaCgobW9tZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnTW9tZW50OiAnICsgbW9tZW50KVxuXG4gICAgICByb3dzLnB1c2godGhpcy5nZW5lcmF0ZUZpbGVTdGF0Um93KG1vbWVudCwgc3RhdHMpKVxuICAgIH0pXG4gICAgbGV0IHRhYmxlID0gaGVhZGVyICsgYCR7J1xcbicgKyByb3dzLmpvaW4oJ1xcbicpfWBcblxuICAgIGxldCBuZXdDb250ZW50ID1cbiAgICAgIGNvbnRlbnQgK1xuICAgICAgYFxuXG4ke3RhYmxlfVxuYFxuICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShhY3RpdmVWaWV3LmZpbGUsIG5ld0NvbnRlbnQpXG4gIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tYXRjaEFueVBhdHRlcm4gPSBleHBvcnRzLmV4dHJhY3RUZXJtcyA9IGV4cG9ydHMucmVwZWF0ZWRUaW1ldW5pdFBhdHRlcm4gPSB2b2lkIDA7XG5mdW5jdGlvbiByZXBlYXRlZFRpbWV1bml0UGF0dGVybihwcmVmaXgsIHNpbmdsZVRpbWV1bml0UGF0dGVybikge1xuICAgIGNvbnN0IHNpbmdsZVRpbWV1bml0UGF0dGVybk5vQ2FwdHVyZSA9IHNpbmdsZVRpbWV1bml0UGF0dGVybi5yZXBsYWNlKC9cXCgoPyFcXD8pL2csIFwiKD86XCIpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9JHtzaW5nbGVUaW1ldW5pdFBhdHRlcm5Ob0NhcHR1cmV9XFxcXHMqKD86LD9cXFxcc3swLDV9JHtzaW5nbGVUaW1ldW5pdFBhdHRlcm5Ob0NhcHR1cmV9KXswLDEwfWA7XG59XG5leHBvcnRzLnJlcGVhdGVkVGltZXVuaXRQYXR0ZXJuID0gcmVwZWF0ZWRUaW1ldW5pdFBhdHRlcm47XG5mdW5jdGlvbiBleHRyYWN0VGVybXMoZGljdGlvbmFyeSkge1xuICAgIGxldCBrZXlzO1xuICAgIGlmIChkaWN0aW9uYXJ5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAga2V5cyA9IFsuLi5kaWN0aW9uYXJ5XTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGljdGlvbmFyeSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICBrZXlzID0gQXJyYXkuZnJvbShkaWN0aW9uYXJ5LmtleXMoKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMoZGljdGlvbmFyeSk7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xufVxuZXhwb3J0cy5leHRyYWN0VGVybXMgPSBleHRyYWN0VGVybXM7XG5mdW5jdGlvbiBtYXRjaEFueVBhdHRlcm4oZGljdGlvbmFyeSkge1xuICAgIGNvbnN0IGpvaW5lZFRlcm1zID0gZXh0cmFjdFRlcm1zKGRpY3Rpb25hcnkpXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKVxuICAgICAgICAuam9pbihcInxcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcLi9nLCBcIlxcXFwuXCIpO1xuICAgIHJldHVybiBgKD86JHtqb2luZWRUZXJtc30pYDtcbn1cbmV4cG9ydHMubWF0Y2hBbnlQYXR0ZXJuID0gbWF0Y2hBbnlQYXR0ZXJuO1xuIiwiIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6dC5kYXlqcz1lKCl9KHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjt2YXIgdD1cIm1pbGxpc2Vjb25kXCIsZT1cInNlY29uZFwiLG49XCJtaW51dGVcIixyPVwiaG91clwiLGk9XCJkYXlcIixzPVwid2Vla1wiLHU9XCJtb250aFwiLGE9XCJxdWFydGVyXCIsbz1cInllYXJcIixmPVwiZGF0ZVwiLGg9L14oXFxkezR9KVstL10/KFxcZHsxLDJ9KT9bLS9dPyhcXGR7MCwyfSlbXjAtOV0qKFxcZHsxLDJ9KT86PyhcXGR7MSwyfSk/Oj8oXFxkezEsMn0pP1suOl0/KFxcZCspPyQvLGM9L1xcWyhbXlxcXV0rKV18WXsxLDR9fE17MSw0fXxEezEsMn18ZHsxLDR9fEh7MSwyfXxoezEsMn18YXxBfG17MSwyfXxzezEsMn18WnsxLDJ9fFNTUy9nLGQ9e25hbWU6XCJlblwiLHdlZWtkYXlzOlwiU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXlcIi5zcGxpdChcIl9cIiksbW9udGhzOlwiSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlclwiLnNwbGl0KFwiX1wiKX0sJD1mdW5jdGlvbih0LGUsbil7dmFyIHI9U3RyaW5nKHQpO3JldHVybiFyfHxyLmxlbmd0aD49ZT90OlwiXCIrQXJyYXkoZSsxLXIubGVuZ3RoKS5qb2luKG4pK3R9LGw9e3M6JCx6OmZ1bmN0aW9uKHQpe3ZhciBlPS10LnV0Y09mZnNldCgpLG49TWF0aC5hYnMoZSkscj1NYXRoLmZsb29yKG4vNjApLGk9biU2MDtyZXR1cm4oZTw9MD9cIitcIjpcIi1cIikrJChyLDIsXCIwXCIpK1wiOlwiKyQoaSwyLFwiMFwiKX0sbTpmdW5jdGlvbiB0KGUsbil7aWYoZS5kYXRlKCk8bi5kYXRlKCkpcmV0dXJuLXQobixlKTt2YXIgcj0xMioobi55ZWFyKCktZS55ZWFyKCkpKyhuLm1vbnRoKCktZS5tb250aCgpKSxpPWUuY2xvbmUoKS5hZGQocix1KSxzPW4taTwwLGE9ZS5jbG9uZSgpLmFkZChyKyhzPy0xOjEpLHUpO3JldHVybisoLShyKyhuLWkpLyhzP2ktYTphLWkpKXx8MCl9LGE6ZnVuY3Rpb24odCl7cmV0dXJuIHQ8MD9NYXRoLmNlaWwodCl8fDA6TWF0aC5mbG9vcih0KX0scDpmdW5jdGlvbihoKXtyZXR1cm57TTp1LHk6byx3OnMsZDppLEQ6ZixoOnIsbTpuLHM6ZSxtczp0LFE6YX1baF18fFN0cmluZyhofHxcIlwiKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL3MkLyxcIlwiKX0sdTpmdW5jdGlvbih0KXtyZXR1cm4gdm9pZCAwPT09dH19LHk9XCJlblwiLE09e307TVt5XT1kO3ZhciBtPWZ1bmN0aW9uKHQpe3JldHVybiB0IGluc3RhbmNlb2YgU30sRD1mdW5jdGlvbih0LGUsbil7dmFyIHI7aWYoIXQpcmV0dXJuIHk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpTVt0XSYmKHI9dCksZSYmKE1bdF09ZSxyPXQpO2Vsc2V7dmFyIGk9dC5uYW1lO01baV09dCxyPWl9cmV0dXJuIW4mJnImJih5PXIpLHJ8fCFuJiZ5fSx2PWZ1bmN0aW9uKHQsZSl7aWYobSh0KSlyZXR1cm4gdC5jbG9uZSgpO3ZhciBuPVwib2JqZWN0XCI9PXR5cGVvZiBlP2U6e307cmV0dXJuIG4uZGF0ZT10LG4uYXJncz1hcmd1bWVudHMsbmV3IFMobil9LGc9bDtnLmw9RCxnLmk9bSxnLnc9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdih0LHtsb2NhbGU6ZS4kTCx1dGM6ZS4kdSx4OmUuJHgsJG9mZnNldDplLiRvZmZzZXR9KX07dmFyIFM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBkKHQpe3RoaXMuJEw9RCh0LmxvY2FsZSxudWxsLCEwKSx0aGlzLnBhcnNlKHQpfXZhciAkPWQucHJvdG90eXBlO3JldHVybiAkLnBhcnNlPWZ1bmN0aW9uKHQpe3RoaXMuJGQ9ZnVuY3Rpb24odCl7dmFyIGU9dC5kYXRlLG49dC51dGM7aWYobnVsbD09PWUpcmV0dXJuIG5ldyBEYXRlKE5hTik7aWYoZy51KGUpKXJldHVybiBuZXcgRGF0ZTtpZihlIGluc3RhbmNlb2YgRGF0ZSlyZXR1cm4gbmV3IERhdGUoZSk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUmJiEvWiQvaS50ZXN0KGUpKXt2YXIgcj1lLm1hdGNoKGgpO2lmKHIpe3ZhciBpPXJbMl0tMXx8MCxzPShyWzddfHxcIjBcIikuc3Vic3RyaW5nKDAsMyk7cmV0dXJuIG4/bmV3IERhdGUoRGF0ZS5VVEMoclsxXSxpLHJbM118fDEscls0XXx8MCxyWzVdfHwwLHJbNl18fDAscykpOm5ldyBEYXRlKHJbMV0saSxyWzNdfHwxLHJbNF18fDAscls1XXx8MCxyWzZdfHwwLHMpfX1yZXR1cm4gbmV3IERhdGUoZSl9KHQpLHRoaXMuJHg9dC54fHx7fSx0aGlzLmluaXQoKX0sJC5pbml0PWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy4kZDt0aGlzLiR5PXQuZ2V0RnVsbFllYXIoKSx0aGlzLiRNPXQuZ2V0TW9udGgoKSx0aGlzLiREPXQuZ2V0RGF0ZSgpLHRoaXMuJFc9dC5nZXREYXkoKSx0aGlzLiRIPXQuZ2V0SG91cnMoKSx0aGlzLiRtPXQuZ2V0TWludXRlcygpLHRoaXMuJHM9dC5nZXRTZWNvbmRzKCksdGhpcy4kbXM9dC5nZXRNaWxsaXNlY29uZHMoKX0sJC4kdXRpbHM9ZnVuY3Rpb24oKXtyZXR1cm4gZ30sJC5pc1ZhbGlkPWZ1bmN0aW9uKCl7cmV0dXJuIShcIkludmFsaWQgRGF0ZVwiPT09dGhpcy4kZC50b1N0cmluZygpKX0sJC5pc1NhbWU9ZnVuY3Rpb24odCxlKXt2YXIgbj12KHQpO3JldHVybiB0aGlzLnN0YXJ0T2YoZSk8PW4mJm48PXRoaXMuZW5kT2YoZSl9LCQuaXNBZnRlcj1mdW5jdGlvbih0LGUpe3JldHVybiB2KHQpPHRoaXMuc3RhcnRPZihlKX0sJC5pc0JlZm9yZT1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmVuZE9mKGUpPHYodCl9LCQuJGc9ZnVuY3Rpb24odCxlLG4pe3JldHVybiBnLnUodCk/dGhpc1tlXTp0aGlzLnNldChuLHQpfSwkLnVuaXg9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5mbG9vcih0aGlzLnZhbHVlT2YoKS8xZTMpfSwkLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kZC5nZXRUaW1lKCl9LCQuc3RhcnRPZj1mdW5jdGlvbih0LGEpe3ZhciBoPXRoaXMsYz0hIWcudShhKXx8YSxkPWcucCh0KSwkPWZ1bmN0aW9uKHQsZSl7dmFyIG49Zy53KGguJHU/RGF0ZS5VVEMoaC4keSxlLHQpOm5ldyBEYXRlKGguJHksZSx0KSxoKTtyZXR1cm4gYz9uOm4uZW5kT2YoaSl9LGw9ZnVuY3Rpb24odCxlKXtyZXR1cm4gZy53KGgudG9EYXRlKClbdF0uYXBwbHkoaC50b0RhdGUoXCJzXCIpLChjP1swLDAsMCwwXTpbMjMsNTksNTksOTk5XSkuc2xpY2UoZSkpLGgpfSx5PXRoaXMuJFcsTT10aGlzLiRNLG09dGhpcy4kRCxEPVwic2V0XCIrKHRoaXMuJHU/XCJVVENcIjpcIlwiKTtzd2l0Y2goZCl7Y2FzZSBvOnJldHVybiBjPyQoMSwwKTokKDMxLDExKTtjYXNlIHU6cmV0dXJuIGM/JCgxLE0pOiQoMCxNKzEpO2Nhc2Ugczp2YXIgdj10aGlzLiRsb2NhbGUoKS53ZWVrU3RhcnR8fDAsUz0oeTx2P3krNzp5KS12O3JldHVybiAkKGM/bS1TOm0rKDYtUyksTSk7Y2FzZSBpOmNhc2UgZjpyZXR1cm4gbChEK1wiSG91cnNcIiwwKTtjYXNlIHI6cmV0dXJuIGwoRCtcIk1pbnV0ZXNcIiwxKTtjYXNlIG46cmV0dXJuIGwoRCtcIlNlY29uZHNcIiwyKTtjYXNlIGU6cmV0dXJuIGwoRCtcIk1pbGxpc2Vjb25kc1wiLDMpO2RlZmF1bHQ6cmV0dXJuIHRoaXMuY2xvbmUoKX19LCQuZW5kT2Y9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuc3RhcnRPZih0LCExKX0sJC4kc2V0PWZ1bmN0aW9uKHMsYSl7dmFyIGgsYz1nLnAocyksZD1cInNldFwiKyh0aGlzLiR1P1wiVVRDXCI6XCJcIiksJD0oaD17fSxoW2ldPWQrXCJEYXRlXCIsaFtmXT1kK1wiRGF0ZVwiLGhbdV09ZCtcIk1vbnRoXCIsaFtvXT1kK1wiRnVsbFllYXJcIixoW3JdPWQrXCJIb3Vyc1wiLGhbbl09ZCtcIk1pbnV0ZXNcIixoW2VdPWQrXCJTZWNvbmRzXCIsaFt0XT1kK1wiTWlsbGlzZWNvbmRzXCIsaClbY10sbD1jPT09aT90aGlzLiREKyhhLXRoaXMuJFcpOmE7aWYoYz09PXV8fGM9PT1vKXt2YXIgeT10aGlzLmNsb25lKCkuc2V0KGYsMSk7eS4kZFskXShsKSx5LmluaXQoKSx0aGlzLiRkPXkuc2V0KGYsTWF0aC5taW4odGhpcy4kRCx5LmRheXNJbk1vbnRoKCkpKS4kZH1lbHNlICQmJnRoaXMuJGRbJF0obCk7cmV0dXJuIHRoaXMuaW5pdCgpLHRoaXN9LCQuc2V0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuY2xvbmUoKS4kc2V0KHQsZSl9LCQuZ2V0PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzW2cucCh0KV0oKX0sJC5hZGQ9ZnVuY3Rpb24odCxhKXt2YXIgZixoPXRoaXM7dD1OdW1iZXIodCk7dmFyIGM9Zy5wKGEpLGQ9ZnVuY3Rpb24oZSl7dmFyIG49dihoKTtyZXR1cm4gZy53KG4uZGF0ZShuLmRhdGUoKStNYXRoLnJvdW5kKGUqdCkpLGgpfTtpZihjPT09dSlyZXR1cm4gdGhpcy5zZXQodSx0aGlzLiRNK3QpO2lmKGM9PT1vKXJldHVybiB0aGlzLnNldChvLHRoaXMuJHkrdCk7aWYoYz09PWkpcmV0dXJuIGQoMSk7aWYoYz09PXMpcmV0dXJuIGQoNyk7dmFyICQ9KGY9e30sZltuXT02ZTQsZltyXT0zNmU1LGZbZV09MWUzLGYpW2NdfHwxLGw9dGhpcy4kZC5nZXRUaW1lKCkrdCokO3JldHVybiBnLncobCx0aGlzKX0sJC5zdWJ0cmFjdD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLmFkZCgtMSp0LGUpfSwkLmZvcm1hdD1mdW5jdGlvbih0KXt2YXIgZT10aGlzO2lmKCF0aGlzLmlzVmFsaWQoKSlyZXR1cm5cIkludmFsaWQgRGF0ZVwiO3ZhciBuPXR8fFwiWVlZWS1NTS1ERFRISDptbTpzc1pcIixyPWcueih0aGlzKSxpPXRoaXMuJGxvY2FsZSgpLHM9dGhpcy4kSCx1PXRoaXMuJG0sYT10aGlzLiRNLG89aS53ZWVrZGF5cyxmPWkubW9udGhzLGg9ZnVuY3Rpb24odCxyLGkscyl7cmV0dXJuIHQmJih0W3JdfHx0KGUsbikpfHxpW3JdLnN1YnN0cigwLHMpfSxkPWZ1bmN0aW9uKHQpe3JldHVybiBnLnMocyUxMnx8MTIsdCxcIjBcIil9LCQ9aS5tZXJpZGllbXx8ZnVuY3Rpb24odCxlLG4pe3ZhciByPXQ8MTI/XCJBTVwiOlwiUE1cIjtyZXR1cm4gbj9yLnRvTG93ZXJDYXNlKCk6cn0sbD17WVk6U3RyaW5nKHRoaXMuJHkpLnNsaWNlKC0yKSxZWVlZOnRoaXMuJHksTTphKzEsTU06Zy5zKGErMSwyLFwiMFwiKSxNTU06aChpLm1vbnRoc1Nob3J0LGEsZiwzKSxNTU1NOmgoZixhKSxEOnRoaXMuJEQsREQ6Zy5zKHRoaXMuJEQsMixcIjBcIiksZDpTdHJpbmcodGhpcy4kVyksZGQ6aChpLndlZWtkYXlzTWluLHRoaXMuJFcsbywyKSxkZGQ6aChpLndlZWtkYXlzU2hvcnQsdGhpcy4kVyxvLDMpLGRkZGQ6b1t0aGlzLiRXXSxIOlN0cmluZyhzKSxISDpnLnMocywyLFwiMFwiKSxoOmQoMSksaGg6ZCgyKSxhOiQocyx1LCEwKSxBOiQocyx1LCExKSxtOlN0cmluZyh1KSxtbTpnLnModSwyLFwiMFwiKSxzOlN0cmluZyh0aGlzLiRzKSxzczpnLnModGhpcy4kcywyLFwiMFwiKSxTU1M6Zy5zKHRoaXMuJG1zLDMsXCIwXCIpLFo6cn07cmV0dXJuIG4ucmVwbGFjZShjLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIGV8fGxbdF18fHIucmVwbGFjZShcIjpcIixcIlwiKX0pfSwkLnV0Y09mZnNldD1mdW5jdGlvbigpe3JldHVybiAxNSotTWF0aC5yb3VuZCh0aGlzLiRkLmdldFRpbWV6b25lT2Zmc2V0KCkvMTUpfSwkLmRpZmY9ZnVuY3Rpb24odCxmLGgpe3ZhciBjLGQ9Zy5wKGYpLCQ9dih0KSxsPTZlNCooJC51dGNPZmZzZXQoKS10aGlzLnV0Y09mZnNldCgpKSx5PXRoaXMtJCxNPWcubSh0aGlzLCQpO3JldHVybiBNPShjPXt9LGNbb109TS8xMixjW3VdPU0sY1thXT1NLzMsY1tzXT0oeS1sKS82MDQ4ZTUsY1tpXT0oeS1sKS84NjRlNSxjW3JdPXkvMzZlNSxjW25dPXkvNmU0LGNbZV09eS8xZTMsYylbZF18fHksaD9NOmcuYShNKX0sJC5kYXlzSW5Nb250aD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVuZE9mKHUpLiREfSwkLiRsb2NhbGU9ZnVuY3Rpb24oKXtyZXR1cm4gTVt0aGlzLiRMXX0sJC5sb2NhbGU9ZnVuY3Rpb24odCxlKXtpZighdClyZXR1cm4gdGhpcy4kTDt2YXIgbj10aGlzLmNsb25lKCkscj1EKHQsZSwhMCk7cmV0dXJuIHImJihuLiRMPXIpLG59LCQuY2xvbmU9ZnVuY3Rpb24oKXtyZXR1cm4gZy53KHRoaXMuJGQsdGhpcyl9LCQudG9EYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBEYXRlKHRoaXMudmFsdWVPZigpKX0sJC50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5pc1ZhbGlkKCk/dGhpcy50b0lTT1N0cmluZygpOm51bGx9LCQudG9JU09TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kZC50b0lTT1N0cmluZygpfSwkLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJGQudG9VVENTdHJpbmcoKX0sZH0oKSxwPVMucHJvdG90eXBlO3JldHVybiB2LnByb3RvdHlwZT1wLFtbXCIkbXNcIix0XSxbXCIkc1wiLGVdLFtcIiRtXCIsbl0sW1wiJEhcIixyXSxbXCIkV1wiLGldLFtcIiRNXCIsdV0sW1wiJHlcIixvXSxbXCIkRFwiLGZdXS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3BbdFsxXV09ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuJGcoZSx0WzBdLHRbMV0pfX0pLHYuZXh0ZW5kPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuJGl8fCh0KGUsUyx2KSx0LiRpPSEwKSx2fSx2LmxvY2FsZT1ELHYuaXNEYXlqcz1tLHYudW5peD1mdW5jdGlvbih0KXtyZXR1cm4gdigxZTMqdCl9LHYuZW49TVt5XSx2LkxzPU0sdi5wPXt9LHZ9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5maW5kWWVhckNsb3Nlc3RUb1JlZiA9IGV4cG9ydHMuZmluZE1vc3RMaWtlbHlBRFllYXIgPSB2b2lkIDA7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5mdW5jdGlvbiBmaW5kTW9zdExpa2VseUFEWWVhcih5ZWFyTnVtYmVyKSB7XG4gICAgaWYgKHllYXJOdW1iZXIgPCAxMDApIHtcbiAgICAgICAgaWYgKHllYXJOdW1iZXIgPiA1MCkge1xuICAgICAgICAgICAgeWVhck51bWJlciA9IHllYXJOdW1iZXIgKyAxOTAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeWVhck51bWJlciA9IHllYXJOdW1iZXIgKyAyMDAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB5ZWFyTnVtYmVyO1xufVxuZXhwb3J0cy5maW5kTW9zdExpa2VseUFEWWVhciA9IGZpbmRNb3N0TGlrZWx5QURZZWFyO1xuZnVuY3Rpb24gZmluZFllYXJDbG9zZXN0VG9SZWYocmVmRGF0ZSwgZGF5LCBtb250aCkge1xuICAgIGNvbnN0IHJlZk1vbWVudCA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBsZXQgZGF0ZU1vbWVudCA9IHJlZk1vbWVudDtcbiAgICBkYXRlTW9tZW50ID0gZGF0ZU1vbWVudC5tb250aChtb250aCAtIDEpO1xuICAgIGRhdGVNb21lbnQgPSBkYXRlTW9tZW50LmRhdGUoZGF5KTtcbiAgICBkYXRlTW9tZW50ID0gZGF0ZU1vbWVudC55ZWFyKHJlZk1vbWVudC55ZWFyKCkpO1xuICAgIGNvbnN0IG5leHRZZWFyID0gZGF0ZU1vbWVudC5hZGQoMSwgXCJ5XCIpO1xuICAgIGNvbnN0IGxhc3RZZWFyID0gZGF0ZU1vbWVudC5hZGQoLTEsIFwieVwiKTtcbiAgICBpZiAoTWF0aC5hYnMobmV4dFllYXIuZGlmZihyZWZNb21lbnQpKSA8IE1hdGguYWJzKGRhdGVNb21lbnQuZGlmZihyZWZNb21lbnQpKSkge1xuICAgICAgICBkYXRlTW9tZW50ID0gbmV4dFllYXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKE1hdGguYWJzKGxhc3RZZWFyLmRpZmYocmVmTW9tZW50KSkgPCBNYXRoLmFicyhkYXRlTW9tZW50LmRpZmYocmVmTW9tZW50KSkpIHtcbiAgICAgICAgZGF0ZU1vbWVudCA9IGxhc3RZZWFyO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZU1vbWVudC55ZWFyKCk7XG59XG5leHBvcnRzLmZpbmRZZWFyQ2xvc2VzdFRvUmVmID0gZmluZFllYXJDbG9zZXN0VG9SZWY7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2VUaW1lVW5pdHMgPSBleHBvcnRzLlRJTUVfVU5JVFNfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VZZWFyID0gZXhwb3J0cy5ZRUFSX1BBVFRFUk4gPSBleHBvcnRzLnBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4gPSBleHBvcnRzLk9SRElOQUxfTlVNQkVSX1BBVFRFUk4gPSBleHBvcnRzLnBhcnNlTnVtYmVyUGF0dGVybiA9IGV4cG9ydHMuTlVNQkVSX1BBVFRFUk4gPSBleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZID0gZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWSA9IGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSBleHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSBleHBvcnRzLkZVTExfTU9OVEhfTkFNRV9ESUNUSU9OQVJZID0gZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB2b2lkIDA7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5leHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHtcbiAgICBzdW5kYXk6IDAsXG4gICAgc3VuOiAwLFxuICAgIFwic3VuLlwiOiAwLFxuICAgIG1vbmRheTogMSxcbiAgICBtb246IDEsXG4gICAgXCJtb24uXCI6IDEsXG4gICAgdHVlc2RheTogMixcbiAgICB0dWU6IDIsXG4gICAgXCJ0dWUuXCI6IDIsXG4gICAgd2VkbmVzZGF5OiAzLFxuICAgIHdlZDogMyxcbiAgICBcIndlZC5cIjogMyxcbiAgICB0aHVyc2RheTogNCxcbiAgICB0aHVyczogNCxcbiAgICBcInRodXJzLlwiOiA0LFxuICAgIHRodXI6IDQsXG4gICAgXCJ0aHVyLlwiOiA0LFxuICAgIHRodTogNCxcbiAgICBcInRodS5cIjogNCxcbiAgICBmcmlkYXk6IDUsXG4gICAgZnJpOiA1LFxuICAgIFwiZnJpLlwiOiA1LFxuICAgIHNhdHVyZGF5OiA2LFxuICAgIHNhdDogNixcbiAgICBcInNhdC5cIjogNixcbn07XG5leHBvcnRzLkZVTExfTU9OVEhfTkFNRV9ESUNUSU9OQVJZID0ge1xuICAgIGphbnVhcnk6IDEsXG4gICAgZmVicnVhcnk6IDIsXG4gICAgbWFyY2g6IDMsXG4gICAgYXByaWw6IDQsXG4gICAgbWF5OiA1LFxuICAgIGp1bmU6IDYsXG4gICAganVseTogNyxcbiAgICBhdWd1c3Q6IDgsXG4gICAgc2VwdGVtYmVyOiA5LFxuICAgIG9jdG9iZXI6IDEwLFxuICAgIG5vdmVtYmVyOiAxMSxcbiAgICBkZWNlbWJlcjogMTIsXG59O1xuZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBleHBvcnRzLkZVTExfTU9OVEhfTkFNRV9ESUNUSU9OQVJZKSwgeyBqYW46IDEsIFwiamFuLlwiOiAxLCBmZWI6IDIsIFwiZmViLlwiOiAyLCBtYXI6IDMsIFwibWFyLlwiOiAzLCBhcHI6IDQsIFwiYXByLlwiOiA0LCBqdW46IDYsIFwianVuLlwiOiA2LCBqdWw6IDcsIFwianVsLlwiOiA3LCBhdWc6IDgsIFwiYXVnLlwiOiA4LCBzZXA6IDksIFwic2VwLlwiOiA5LCBzZXB0OiA5LCBcInNlcHQuXCI6IDksIG9jdDogMTAsIFwib2N0LlwiOiAxMCwgbm92OiAxMSwgXCJub3YuXCI6IDExLCBkZWM6IDEyLCBcImRlYy5cIjogMTIgfSk7XG5leHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZID0ge1xuICAgIG9uZTogMSxcbiAgICB0d286IDIsXG4gICAgdGhyZWU6IDMsXG4gICAgZm91cjogNCxcbiAgICBmaXZlOiA1LFxuICAgIHNpeDogNixcbiAgICBzZXZlbjogNyxcbiAgICBlaWdodDogOCxcbiAgICBuaW5lOiA5LFxuICAgIHRlbjogMTAsXG4gICAgZWxldmVuOiAxMSxcbiAgICB0d2VsdmU6IDEyLFxufTtcbmV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUlkgPSB7XG4gICAgZmlyc3Q6IDEsXG4gICAgc2Vjb25kOiAyLFxuICAgIHRoaXJkOiAzLFxuICAgIGZvdXJ0aDogNCxcbiAgICBmaWZ0aDogNSxcbiAgICBzaXh0aDogNixcbiAgICBzZXZlbnRoOiA3LFxuICAgIGVpZ2h0aDogOCxcbiAgICBuaW50aDogOSxcbiAgICB0ZW50aDogMTAsXG4gICAgZWxldmVudGg6IDExLFxuICAgIHR3ZWxmdGg6IDEyLFxuICAgIHRoaXJ0ZWVudGg6IDEzLFxuICAgIGZvdXJ0ZWVudGg6IDE0LFxuICAgIGZpZnRlZW50aDogMTUsXG4gICAgc2l4dGVlbnRoOiAxNixcbiAgICBzZXZlbnRlZW50aDogMTcsXG4gICAgZWlnaHRlZW50aDogMTgsXG4gICAgbmluZXRlZW50aDogMTksXG4gICAgdHdlbnRpZXRoOiAyMCxcbiAgICBcInR3ZW50eSBmaXJzdFwiOiAyMSxcbiAgICBcInR3ZW50eS1maXJzdFwiOiAyMSxcbiAgICBcInR3ZW50eSBzZWNvbmRcIjogMjIsXG4gICAgXCJ0d2VudHktc2Vjb25kXCI6IDIyLFxuICAgIFwidHdlbnR5IHRoaXJkXCI6IDIzLFxuICAgIFwidHdlbnR5LXRoaXJkXCI6IDIzLFxuICAgIFwidHdlbnR5IGZvdXJ0aFwiOiAyNCxcbiAgICBcInR3ZW50eS1mb3VydGhcIjogMjQsXG4gICAgXCJ0d2VudHkgZmlmdGhcIjogMjUsXG4gICAgXCJ0d2VudHktZmlmdGhcIjogMjUsXG4gICAgXCJ0d2VudHkgc2l4dGhcIjogMjYsXG4gICAgXCJ0d2VudHktc2l4dGhcIjogMjYsXG4gICAgXCJ0d2VudHkgc2V2ZW50aFwiOiAyNyxcbiAgICBcInR3ZW50eS1zZXZlbnRoXCI6IDI3LFxuICAgIFwidHdlbnR5IGVpZ2h0aFwiOiAyOCxcbiAgICBcInR3ZW50eS1laWdodGhcIjogMjgsXG4gICAgXCJ0d2VudHkgbmludGhcIjogMjksXG4gICAgXCJ0d2VudHktbmludGhcIjogMjksXG4gICAgXCJ0aGlydGlldGhcIjogMzAsXG4gICAgXCJ0aGlydHkgZmlyc3RcIjogMzEsXG4gICAgXCJ0aGlydHktZmlyc3RcIjogMzEsXG59O1xuZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSA9IHtcbiAgICBzZWM6IFwic2Vjb25kXCIsXG4gICAgc2Vjb25kOiBcInNlY29uZFwiLFxuICAgIHNlY29uZHM6IFwic2Vjb25kXCIsXG4gICAgbWluOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnM6IFwibWludXRlXCIsXG4gICAgbWludXRlOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnV0ZXM6IFwibWludXRlXCIsXG4gICAgaDogXCJob3VyXCIsXG4gICAgaHI6IFwiaG91clwiLFxuICAgIGhyczogXCJob3VyXCIsXG4gICAgaG91cjogXCJob3VyXCIsXG4gICAgaG91cnM6IFwiaG91clwiLFxuICAgIGRheTogXCJkXCIsXG4gICAgZGF5czogXCJkXCIsXG4gICAgd2VlazogXCJ3ZWVrXCIsXG4gICAgd2Vla3M6IFwid2Vla1wiLFxuICAgIG1vbnRoOiBcIm1vbnRoXCIsXG4gICAgbW9udGhzOiBcIm1vbnRoXCIsXG4gICAgeTogXCJ5ZWFyXCIsXG4gICAgeXI6IFwieWVhclwiLFxuICAgIHllYXI6IFwieWVhclwiLFxuICAgIHllYXJzOiBcInllYXJcIixcbn07XG5leHBvcnRzLk5VTUJFUl9QQVRURVJOID0gYCg/OiR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZKX18WzAtOV0rfFswLTldK1xcXFwuWzAtOV0rfGhhbGYoPzpcXFxccyphbj8pP3xhbj8oPzpcXFxccypmZXcpP3xmZXd8c2V2ZXJhbHxhP1xcXFxzKmNvdXBsZVxcXFxzKig/Om9mKT8pYDtcbmZ1bmN0aW9uIHBhcnNlTnVtYmVyUGF0dGVybihtYXRjaCkge1xuICAgIGNvbnN0IG51bSA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZW251bV07XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bSA9PT0gXCJhXCIgfHwgbnVtID09PSBcImFuXCIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bS5tYXRjaCgvZmV3LykpIHtcbiAgICAgICAgcmV0dXJuIDM7XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bS5tYXRjaCgvaGFsZi8pKSB7XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bS5tYXRjaCgvY291cGxlLykpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bS5tYXRjaCgvc2V2ZXJhbC8pKSB7XG4gICAgICAgIHJldHVybiA3O1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBwYXJzZU51bWJlclBhdHRlcm47XG5leHBvcnRzLk9SRElOQUxfTlVNQkVSX1BBVFRFUk4gPSBgKD86JHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUlkpfXxbMC05XXsxLDJ9KD86c3R8bmR8cmR8dGgpPylgO1xuZnVuY3Rpb24gcGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaCkge1xuICAgIGxldCBudW0gPSBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZW251bV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5PUkRJTkFMX1dPUkRfRElDVElPTkFSWVtudW1dO1xuICAgIH1cbiAgICBudW0gPSBudW0ucmVwbGFjZSgvKD86c3R8bmR8cmR8dGgpJC9pLCBcIlwiKTtcbiAgICByZXR1cm4gcGFyc2VJbnQobnVtKTtcbn1cbmV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm47XG5leHBvcnRzLllFQVJfUEFUVEVSTiA9IGAoPzpbMS05XVswLTldezAsM31cXFxccyooPzpCRXxBRHxCQyl8WzEtMl1bMC05XXszfXxbNS05XVswLTldKWA7XG5mdW5jdGlvbiBwYXJzZVllYXIobWF0Y2gpIHtcbiAgICBpZiAoL0JFL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9CRS9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoKSAtIDU0MztcbiAgICB9XG4gICAgaWYgKC9CQy9pLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIG1hdGNoID0gbWF0Y2gucmVwbGFjZSgvQkMvaSwgXCJcIik7XG4gICAgICAgIHJldHVybiAtcGFyc2VJbnQobWF0Y2gpO1xuICAgIH1cbiAgICBpZiAoL0FEL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9BRC9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoKTtcbiAgICB9XG4gICAgY29uc3QgcmF3WWVhck51bWJlciA9IHBhcnNlSW50KG1hdGNoKTtcbiAgICByZXR1cm4geWVhcnNfMS5maW5kTW9zdExpa2VseUFEWWVhcihyYXdZZWFyTnVtYmVyKTtcbn1cbmV4cG9ydHMucGFyc2VZZWFyID0gcGFyc2VZZWFyO1xuY29uc3QgU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOID0gYCgke2V4cG9ydHMuTlVNQkVSX1BBVFRFUk59KVxcXFxzezAsNX0oJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkpfSlcXFxcc3swLDV9YDtcbmNvbnN0IFNJTkdMRV9USU1FX1VOSVRfUkVHRVggPSBuZXcgUmVnRXhwKFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTiwgXCJpXCIpO1xuZXhwb3J0cy5USU1FX1VOSVRTX1BBVFRFUk4gPSBwYXR0ZXJuXzEucmVwZWF0ZWRUaW1ldW5pdFBhdHRlcm4oYCg/Oig/OmFib3V0fGFyb3VuZClcXFxccyopP2AsIFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTik7XG5mdW5jdGlvbiBwYXJzZVRpbWVVbml0cyh0aW1ldW5pdFRleHQpIHtcbiAgICBjb25zdCBmcmFnbWVudHMgPSB7fTtcbiAgICBsZXQgcmVtYWluaW5nVGV4dCA9IHRpbWV1bml0VGV4dDtcbiAgICBsZXQgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpO1xuICAgICAgICByZW1haW5pbmdUZXh0ID0gcmVtYWluaW5nVGV4dC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudHM7XG59XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gcGFyc2VUaW1lVW5pdHM7XG5mdW5jdGlvbiBjb2xsZWN0RGF0ZVRpbWVGcmFnbWVudChmcmFnbWVudHMsIG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoWzFdKTtcbiAgICBjb25zdCB1bml0ID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWVttYXRjaFsyXS50b0xvd2VyQ2FzZSgpXTtcbiAgICBmcmFnbWVudHNbdW5pdF0gPSBudW07XG59XG4iLCIhZnVuY3Rpb24odCxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1uKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShuKTp0LmRheWpzX3BsdWdpbl9xdWFydGVyT2ZZZWFyPW4oKX0odGhpcyxmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO3ZhciB0PVwibW9udGhcIixuPVwicXVhcnRlclwiO3JldHVybiBmdW5jdGlvbihyLGkpe3ZhciBlPWkucHJvdG90eXBlO2UucXVhcnRlcj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy4kdXRpbHMoKS51KHQpP01hdGguY2VpbCgodGhpcy5tb250aCgpKzEpLzMpOnRoaXMubW9udGgodGhpcy5tb250aCgpJTMrMyoodC0xKSl9O3ZhciB1PWUuYWRkO2UuYWRkPWZ1bmN0aW9uKHIsaSl7cmV0dXJuIHI9TnVtYmVyKHIpLHRoaXMuJHV0aWxzKCkucChpKT09PW4/dGhpcy5hZGQoMypyLHQpOnUuYmluZCh0aGlzKShyLGkpfTt2YXIgcz1lLnN0YXJ0T2Y7ZS5zdGFydE9mPWZ1bmN0aW9uKHIsaSl7dmFyIGU9dGhpcy4kdXRpbHMoKSx1PSEhZS51KGkpfHxpO2lmKGUucChyKT09PW4pe3ZhciBhPXRoaXMucXVhcnRlcigpLTE7cmV0dXJuIHU/dGhpcy5tb250aCgzKmEpLnN0YXJ0T2YodCkuc3RhcnRPZihcImRheVwiKTp0aGlzLm1vbnRoKDMqYSsyKS5lbmRPZih0KS5lbmRPZihcImRheVwiKX1yZXR1cm4gcy5iaW5kKHRoaXMpKHIsaSl9fX0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmltcGx5U2ltaWxhclRpbWUgPSBleHBvcnRzLmFzc2lnblNpbWlsYXJUaW1lID0gZXhwb3J0cy5hc3NpZ25TaW1pbGFyRGF0ZSA9IGV4cG9ydHMuYXNzaWduVGhlTmV4dERheSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGFzc2lnblRoZU5leHREYXkoY29tcG9uZW50LCB0YXJnZXREYXlKcykge1xuICAgIHRhcmdldERheUpzID0gdGFyZ2V0RGF5SnMuYWRkKDEsIFwiZGF5XCIpO1xuICAgIGFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF5SnMpO1xuICAgIGltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXlKcyk7XG59XG5leHBvcnRzLmFzc2lnblRoZU5leHREYXkgPSBhc3NpZ25UaGVOZXh0RGF5O1xuZnVuY3Rpb24gYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXlKcykge1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJkYXlcIiwgdGFyZ2V0RGF5SnMuZGF0ZSgpKTtcbiAgICBjb21wb25lbnQuYXNzaWduKFwibW9udGhcIiwgdGFyZ2V0RGF5SnMubW9udGgoKSArIDEpO1xuICAgIGNvbXBvbmVudC5hc3NpZ24oXCJ5ZWFyXCIsIHRhcmdldERheUpzLnllYXIoKSk7XG59XG5leHBvcnRzLmFzc2lnblNpbWlsYXJEYXRlID0gYXNzaWduU2ltaWxhckRhdGU7XG5mdW5jdGlvbiBhc3NpZ25TaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERheUpzKSB7XG4gICAgY29tcG9uZW50LmFzc2lnbihcImhvdXJcIiwgdGFyZ2V0RGF5SnMuaG91cigpKTtcbiAgICBjb21wb25lbnQuYXNzaWduKFwibWludXRlXCIsIHRhcmdldERheUpzLm1pbnV0ZSgpKTtcbiAgICBjb21wb25lbnQuYXNzaWduKFwic2Vjb25kXCIsIHRhcmdldERheUpzLnNlY29uZCgpKTtcbiAgICBjb21wb25lbnQuYXNzaWduKFwibWlsbGlzZWNvbmRcIiwgdGFyZ2V0RGF5SnMubWlsbGlzZWNvbmQoKSk7XG4gICAgY29tcG9uZW50LmFzc2lnbihcInRpbWV6b25lT2Zmc2V0XCIsIHRhcmdldERheUpzLnV0Y09mZnNldCgpKTtcbn1cbmV4cG9ydHMuYXNzaWduU2ltaWxhclRpbWUgPSBhc3NpZ25TaW1pbGFyVGltZTtcbmZ1bmN0aW9uIGltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXlKcykge1xuICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgdGFyZ2V0RGF5SnMuaG91cigpKTtcbiAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgdGFyZ2V0RGF5SnMubWludXRlKCkpO1xuICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCB0YXJnZXREYXlKcy5zZWNvbmQoKSk7XG4gICAgY29tcG9uZW50LmltcGx5KFwibWlsbGlzZWNvbmRcIiwgdGFyZ2V0RGF5SnMubWlsbGlzZWNvbmQoKSk7XG4gICAgY29tcG9uZW50LmltcGx5KFwidGltZXpvbmVPZmZzZXRcIiwgdGFyZ2V0RGF5SnMudXRjT2Zmc2V0KCkpO1xufVxuZXhwb3J0cy5pbXBseVNpbWlsYXJUaW1lID0gaW1wbHlTaW1pbGFyVGltZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJzaW5nUmVzdWx0ID0gZXhwb3J0cy5QYXJzaW5nQ29tcG9uZW50cyA9IHZvaWQgMDtcbmNvbnN0IHF1YXJ0ZXJPZlllYXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anMvcGx1Z2luL3F1YXJ0ZXJPZlllYXJcIikpO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY29uc3QgZGF5anNfMiA9IHJlcXVpcmUoXCIuL3V0aWxzL2RheWpzXCIpO1xuZGF5anNfMS5kZWZhdWx0LmV4dGVuZChxdWFydGVyT2ZZZWFyXzEuZGVmYXVsdCk7XG5jbGFzcyBQYXJzaW5nQ29tcG9uZW50cyB7XG4gICAgY29uc3RydWN0b3IocmVmRGF0ZSwga25vd25Db21wb25lbnRzKSB7XG4gICAgICAgIHRoaXMua25vd25WYWx1ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5pbXBsaWVkVmFsdWVzID0ge307XG4gICAgICAgIGlmIChrbm93bkNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGtub3duQ29tcG9uZW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMua25vd25WYWx1ZXNba2V5XSA9IGtub3duQ29tcG9uZW50c1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlZkRheUpzID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgICAgICB0aGlzLmltcGx5KFwiZGF5XCIsIHJlZkRheUpzLmRhdGUoKSk7XG4gICAgICAgIHRoaXMuaW1wbHkoXCJtb250aFwiLCByZWZEYXlKcy5tb250aCgpICsgMSk7XG4gICAgICAgIHRoaXMuaW1wbHkoXCJ5ZWFyXCIsIHJlZkRheUpzLnllYXIoKSk7XG4gICAgICAgIHRoaXMuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgdGhpcy5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgdGhpcy5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgdGhpcy5pbXBseShcIm1pbGxpc2Vjb25kXCIsIDApO1xuICAgIH1cbiAgICBnZXQoY29tcG9uZW50KSB7XG4gICAgICAgIGlmIChjb21wb25lbnQgaW4gdGhpcy5rbm93blZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua25vd25WYWx1ZXNbY29tcG9uZW50XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50IGluIHRoaXMuaW1wbGllZFZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW1wbGllZFZhbHVlc1tjb21wb25lbnRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpc0NlcnRhaW4oY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBjb21wb25lbnQgaW4gdGhpcy5rbm93blZhbHVlcztcbiAgICB9XG4gICAgZ2V0Q2VydGFpbkNvbXBvbmVudHMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmtub3duVmFsdWVzKTtcbiAgICB9XG4gICAgaW1wbHkoY29tcG9uZW50LCB2YWx1ZSkge1xuICAgICAgICBpZiAoY29tcG9uZW50IGluIHRoaXMua25vd25WYWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW1wbGllZFZhbHVlc1tjb21wb25lbnRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBhc3NpZ24oY29tcG9uZW50LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmtub3duVmFsdWVzW2NvbXBvbmVudF0gPSB2YWx1ZTtcbiAgICAgICAgZGVsZXRlIHRoaXMuaW1wbGllZFZhbHVlc1tjb21wb25lbnRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGVsZXRlKGNvbXBvbmVudCkge1xuICAgICAgICBkZWxldGUgdGhpcy5rbm93blZhbHVlc1tjb21wb25lbnRdO1xuICAgICAgICBkZWxldGUgdGhpcy5pbXBsaWVkVmFsdWVzW2NvbXBvbmVudF07XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgUGFyc2luZ0NvbXBvbmVudHMobmV3IERhdGUoKSk7XG4gICAgICAgIGNvbXBvbmVudC5rbm93blZhbHVlcyA9IHt9O1xuICAgICAgICBjb21wb25lbnQuaW1wbGllZFZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmtub3duVmFsdWVzKSB7XG4gICAgICAgICAgICBjb21wb25lbnQua25vd25WYWx1ZXNba2V5XSA9IHRoaXMua25vd25WYWx1ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmltcGxpZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5pbXBsaWVkVmFsdWVzW2tleV0gPSB0aGlzLmltcGxpZWRWYWx1ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbiAgICBpc09ubHlEYXRlKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDZXJ0YWluKFwiaG91clwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJtaW51dGVcIikgJiYgIXRoaXMuaXNDZXJ0YWluKFwic2Vjb25kXCIpO1xuICAgIH1cbiAgICBpc09ubHlUaW1lKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNDZXJ0YWluKFwid2Vla2RheVwiKSAmJiAhdGhpcy5pc0NlcnRhaW4oXCJkYXlcIikgJiYgIXRoaXMuaXNDZXJ0YWluKFwibW9udGhcIik7XG4gICAgfVxuICAgIGlzT25seVdlZWtkYXlDb21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQ2VydGFpbihcIndlZWtkYXlcIikgJiYgIXRoaXMuaXNDZXJ0YWluKFwiZGF5XCIpICYmICF0aGlzLmlzQ2VydGFpbihcIm1vbnRoXCIpO1xuICAgIH1cbiAgICBpc09ubHlEYXlNb250aENvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDZXJ0YWluKFwiZGF5XCIpICYmIHRoaXMuaXNDZXJ0YWluKFwibW9udGhcIikgJiYgIXRoaXMuaXNDZXJ0YWluKFwieWVhclwiKTtcbiAgICB9XG4gICAgaXNWYWxpZERhdGUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmlzQ2VydGFpbihcInRpbWV6b25lT2Zmc2V0XCIpID8gdGhpcy5kYXRlV2l0aG91dFRpbWV6b25lQWRqdXN0bWVudCgpIDogdGhpcy5kYXRlKCk7XG4gICAgICAgIGlmIChkYXRlLmdldEZ1bGxZZWFyKCkgIT09IHRoaXMuZ2V0KFwieWVhclwiKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGRhdGUuZ2V0TW9udGgoKSAhPT0gdGhpcy5nZXQoXCJtb250aFwiKSAtIDEpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChkYXRlLmdldERhdGUoKSAhPT0gdGhpcy5nZXQoXCJkYXlcIikpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmdldChcImhvdXJcIikgIT0gbnVsbCAmJiBkYXRlLmdldEhvdXJzKCkgIT0gdGhpcy5nZXQoXCJob3VyXCIpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5nZXQoXCJtaW51dGVcIikgIT0gbnVsbCAmJiBkYXRlLmdldE1pbnV0ZXMoKSAhPSB0aGlzLmdldChcIm1pbnV0ZVwiKSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYFtQYXJzaW5nQ29tcG9uZW50cyB7a25vd25WYWx1ZXM6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5rbm93blZhbHVlcyl9LCBpbXBsaWVkVmFsdWVzOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuaW1wbGllZFZhbHVlcyl9fV1gO1xuICAgIH1cbiAgICBkYXlqcygpIHtcbiAgICAgICAgcmV0dXJuIGRheWpzXzEuZGVmYXVsdCh0aGlzLmRhdGUoKSk7XG4gICAgfVxuICAgIGRhdGUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB0aGlzLmRhdGVXaXRob3V0VGltZXpvbmVBZGp1c3RtZW50KCk7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArIHRoaXMuZ2V0VGltZXpvbmVBZGp1c3RtZW50TWludXRlKGRhdGUpICogNjAwMDApO1xuICAgIH1cbiAgICBkYXRlV2l0aG91dFRpbWV6b25lQWRqdXN0bWVudCgpIHtcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMuZ2V0KFwieWVhclwiKSwgdGhpcy5nZXQoXCJtb250aFwiKSAtIDEsIHRoaXMuZ2V0KFwiZGF5XCIpLCB0aGlzLmdldChcImhvdXJcIiksIHRoaXMuZ2V0KFwibWludXRlXCIpLCB0aGlzLmdldChcInNlY29uZFwiKSwgdGhpcy5nZXQoXCJtaWxsaXNlY29uZFwiKSk7XG4gICAgICAgIGRhdGUuc2V0RnVsbFllYXIodGhpcy5nZXQoXCJ5ZWFyXCIpKTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIGdldFRpbWV6b25lQWRqdXN0bWVudE1pbnV0ZShkYXRlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgZGF0ZSA9IGRhdGUgIT09IG51bGwgJiYgZGF0ZSAhPT0gdm9pZCAwID8gZGF0ZSA6IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lem9uZU9mZnNldCA9IC1kYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgIGNvbnN0IHRhcmdldFRpbWV6b25lT2Zmc2V0ID0gKF9hID0gdGhpcy5nZXQoXCJ0aW1lem9uZU9mZnNldFwiKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogY3VycmVudFRpbWV6b25lT2Zmc2V0O1xuICAgICAgICByZXR1cm4gY3VycmVudFRpbWV6b25lT2Zmc2V0IC0gdGFyZ2V0VGltZXpvbmVPZmZzZXQ7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKHJlZkRhdGUsIGZyYWdtZW50cykge1xuICAgICAgICBsZXQgZGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZnJhZ21lbnRzKSB7XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5hZGQoZnJhZ21lbnRzW2tleV0sIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IG5ldyBQYXJzaW5nQ29tcG9uZW50cyhyZWZEYXRlKTtcbiAgICAgICAgaWYgKGZyYWdtZW50c1tcImhvdXJcIl0gfHwgZnJhZ21lbnRzW1wibWludXRlXCJdIHx8IGZyYWdtZW50c1tcInNlY29uZFwiXSkge1xuICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyVGltZShjb21wb25lbnRzLCBkYXRlKTtcbiAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50cywgZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkYXlqc18yLmltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50cywgZGF0ZSk7XG4gICAgICAgICAgICBpZiAoZnJhZ21lbnRzW1wiZFwiXSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJhZ21lbnRzW1wid2Vla1wiXSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwid2Vla2RheVwiLCBkYXRlLmRheSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50c1tcIm1vbnRoXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudHNbXCJ5ZWFyXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuUGFyc2luZ0NvbXBvbmVudHMgPSBQYXJzaW5nQ29tcG9uZW50cztcbmNsYXNzIFBhcnNpbmdSZXN1bHQge1xuICAgIGNvbnN0cnVjdG9yKHJlZkRhdGUsIGluZGV4LCB0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgICAgIHRoaXMucmVmRGF0ZSA9IHJlZkRhdGU7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0IHx8IG5ldyBQYXJzaW5nQ29tcG9uZW50cyh0aGlzLnJlZkRhdGUpO1xuICAgICAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBQYXJzaW5nUmVzdWx0KHRoaXMucmVmRGF0ZSwgdGhpcy5pbmRleCwgdGhpcy50ZXh0KTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0ID0gdGhpcy5zdGFydCA/IHRoaXMuc3RhcnQuY2xvbmUoKSA6IG51bGw7XG4gICAgICAgIHJlc3VsdC5lbmQgPSB0aGlzLmVuZCA/IHRoaXMuZW5kLmNsb25lKCkgOiBudWxsO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBkYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFydC5kYXRlKCk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYFtQYXJzaW5nUmVzdWx0IHtpbmRleDogJHt0aGlzLmluZGV4fSwgdGV4dDogJyR7dGhpcy50ZXh0fScsIC4uLn1dYDtcbiAgICB9XG59XG5leHBvcnRzLlBhcnNpbmdSZXN1bHQgPSBQYXJzaW5nUmVzdWx0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nID0gdm9pZCAwO1xuY2xhc3MgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNhY2hlZElubmVyUGF0dGVybiA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FjaGVkUGF0dGVybiA9IG51bGw7XG4gICAgfVxuICAgIHBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICBjb25zdCBpbm5lclBhdHRlcm4gPSB0aGlzLmlubmVyUGF0dGVybihjb250ZXh0KTtcbiAgICAgICAgaWYgKGlubmVyUGF0dGVybiA9PSB0aGlzLmNhY2hlZElubmVyUGF0dGVybikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUGF0dGVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlZFBhdHRlcm4gPSBuZXcgUmVnRXhwKGAoXFxcXFd8Xikke2lubmVyUGF0dGVybi5zb3VyY2V9YCwgaW5uZXJQYXR0ZXJuLmZsYWdzKTtcbiAgICAgICAgdGhpcy5jYWNoZWRJbm5lclBhdHRlcm4gPSBpbm5lclBhdHRlcm47XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFBhdHRlcm47XG4gICAgfVxuICAgIGV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyID0gbWF0Y2hbMV07XG4gICAgICAgIG1hdGNoLmluZGV4ID0gbWF0Y2guaW5kZXggKyBoZWFkZXIubGVuZ3RoO1xuICAgICAgICBtYXRjaFswXSA9IG1hdGNoWzBdLnN1YnN0cmluZyhoZWFkZXIubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBtYXRjaC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2hbaSAtIDFdID0gbWF0Y2hbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKTtcbiAgICB9XG59XG5leHBvcnRzLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nID0gQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTl9XSVRIX1BSRUZJWCA9IG5ldyBSZWdFeHAoYCg/OndpdGhpbnxpbnxmb3IpXFxcXHMqYCArXG4gICAgYCg/Oig/OmFib3V0fGFyb3VuZHxyb3VnaGx5fGFwcHJveGltYXRlbHl8anVzdClcXFxccyooPzp+XFxcXHMqKT8pPygke2NvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTn0pKD89XFxcXFd8JClgLCBcImlcIik7XG5jb25zdCBQQVRURVJOX1dJVEhPVVRfUFJFRklYID0gbmV3IFJlZ0V4cChgKD86KD86YWJvdXR8YXJvdW5kfHJvdWdobHl8YXBwcm94aW1hdGVseXxqdXN0KVxcXFxzKig/On5cXFxccyopPyk/KCR7Y29uc3RhbnRzXzEuVElNRV9VTklUU19QQVRURVJOfSkoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNsYXNzIEVOVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQub3B0aW9uLmZvcndhcmREYXRlID8gUEFUVEVSTl9XSVRIT1VUX1BSRUZJWCA6IFBBVFRFUk5fV0lUSF9QUkVGSVg7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0aW1lVW5pdHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFsxXSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMuY3JlYXRlUmVsYXRpdmVGcm9tUmVmRGF0ZShjb250ZXh0LnJlZkRhdGUsIHRpbWVVbml0cyk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5UaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18zID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzpvblxcXFxzKj8pP1wiICtcbiAgICBgKCR7Y29uc3RhbnRzXzMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTn0pYCArXG4gICAgXCIoPzpcXFxccypcIiArXG4gICAgXCIoPzp0b3xcXFxcLXxcXFxc4oCTfHVudGlsfHRocm91Z2h8dGlsbHxcXFxccylcXFxccypcIiArXG4gICAgYCgke2NvbnN0YW50c18zLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KWAgK1xuICAgIFwiKT9cIiArXG4gICAgXCIoPzotfC98XFxcXHMqKD86b2YpP1xcXFxzKilcIiArXG4gICAgXCIoXCIgK1xuICAgIHBhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSkgK1xuICAgIFwiKVwiICtcbiAgICBcIig/OlwiICtcbiAgICBcIig/Oi18L3wsP1xcXFxzKilcIiArXG4gICAgYCgke2NvbnN0YW50c18yLllFQVJfUEFUVEVSTn0oPyFbXlxcXFxzXVxcXFxkKSlgICtcbiAgICBcIik/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgREFURV9HUk9VUCA9IDE7XG5jb25zdCBEQVRFX1RPX0dST1VQID0gMjtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAzO1xuY29uc3QgWUVBUl9HUk9VUCA9IDQ7XG5jbGFzcyBFTk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KG1hdGNoLmluZGV4LCBtYXRjaFswXSk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgZGF5ID0gY29uc3RhbnRzXzMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaFtEQVRFX0dST1VQXSk7XG4gICAgICAgIGlmIChkYXkgPiAzMSkge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoW0RBVEVfR1JPVVBdLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJtb250aFwiLCBtb250aCk7XG4gICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJkYXlcIiwgZGF5KTtcbiAgICAgICAgaWYgKG1hdGNoW1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyTnVtYmVyID0gY29uc3RhbnRzXzIucGFyc2VZZWFyKG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJ5ZWFyXCIsIHllYXJOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCBkYXksIG1vbnRoKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW0RBVEVfVE9fR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCBlbmREYXRlID0gY29uc3RhbnRzXzMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaFtEQVRFX1RPX0dST1VQXSk7XG4gICAgICAgICAgICByZXN1bHQuZW5kID0gcmVzdWx0LnN0YXJ0LmNsb25lKCk7XG4gICAgICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcImRheVwiLCBlbmREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzIgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgY29uc3RhbnRzXzMgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pYCArXG4gICAgXCIoPzotfC98XFxcXHMqLD9cXFxccyopXCIgK1xuICAgIGAoJHtjb25zdGFudHNfMi5PUkRJTkFMX05VTUJFUl9QQVRURVJOfSkoPyFcXFxccyooPzphbXxwbSkpXFxcXHMqYCArXG4gICAgXCIoPzpcIiArXG4gICAgXCIoPzp0b3xcXFxcLSlcXFxccypcIiArXG4gICAgYCgke2NvbnN0YW50c18yLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KVxcXFxzKmAgK1xuICAgIFwiKT9cIiArXG4gICAgXCIoPzpcIiArXG4gICAgXCIoPzotfC98XFxcXHMqLD9cXFxccyopXCIgK1xuICAgIGAoJHtjb25zdGFudHNfMy5ZRUFSX1BBVFRFUk59KWAgK1xuICAgIFwiKT9cIiArXG4gICAgXCIoPz1cXFxcV3wkKSg/IVxcXFw6XFxcXGQpXCIsIFwiaVwiKTtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAxO1xuY29uc3QgREFURV9HUk9VUCA9IDI7XG5jb25zdCBEQVRFX1RPX0dST1VQID0gMztcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgZGF5ID0gY29uc3RhbnRzXzIucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaFtEQVRFX0dST1VQXSk7XG4gICAgICAgIGlmIChkYXkgPiAzMSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoe1xuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBjb25zdGFudHNfMy5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCBkYXksIG1vbnRoKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBjb25zdGFudHNfMi5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfVE9fR1JPVVBdKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KG1hdGNoLmluZGV4LCBtYXRjaFswXSk7XG4gICAgICAgIHJlc3VsdC5zdGFydCA9IGNvbXBvbmVudHM7XG4gICAgICAgIHJlc3VsdC5lbmQgPSBjb21wb25lbnRzLmNsb25lKCk7XG4gICAgICAgIHJlc3VsdC5lbmQuYXNzaWduKFwiZGF5XCIsIGVuZERhdGUpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKCg/OmluKVxcXFxzKik/YCArXG4gICAgYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSl9KWAgK1xuICAgIGBcXFxccypgICtcbiAgICBgKD86YCArXG4gICAgYFssLV0/XFxcXHMqKCR7Y29uc3RhbnRzXzIuWUVBUl9QQVRURVJOfSk/YCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVteXFxcXHNcXFxcd118XFxcXHMrW14wLTldfFxcXFxzKyR8JClcIiwgXCJpXCIpO1xuY29uc3QgUFJFRklYX0dST1VQID0gMTtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAyO1xuY29uc3QgWUVBUl9HUk9VUCA9IDM7XG5jbGFzcyBFTk1vbnRoTmFtZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbW9udGhOYW1lID0gbWF0Y2hbTU9OVEhfTkFNRV9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKG1hdGNoWzBdLmxlbmd0aCA8PSAzICYmICFjb25zdGFudHNfMS5GVUxMX01PTlRIX05BTUVfRElDVElPTkFSWVttb250aE5hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXggKyAobWF0Y2hbUFJFRklYX0dST1VQXSB8fCBcIlwiKS5sZW5ndGgsIG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwiZGF5XCIsIDEpO1xuICAgICAgICBjb25zdCBtb250aCA9IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbW9udGhOYW1lXTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgaWYgKG1hdGNoW1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gY29uc3RhbnRzXzIucGFyc2VZZWFyKG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCAxLCBtb250aCk7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5Nb250aE5hbWVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYChbMC05XXs0fSlbXFxcXC5cXFxcL1xcXFxzXWAgK1xuICAgIGAoPzooJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSl8KFswLTldezEsMn0pKVtcXFxcLlxcXFwvXFxcXHNdYCArXG4gICAgYChbMC05XXsxLDJ9KWAgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgWUVBUl9OVU1CRVJfR1JPVVAgPSAxO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDI7XG5jb25zdCBNT05USF9OVU1CRVJfR1JPVVAgPSAzO1xuY29uc3QgREFURV9OVU1CRVJfR1JPVVAgPSA0O1xuY2xhc3MgRU5DYXN1YWxZZWFyTW9udGhEYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gbWF0Y2hbTU9OVEhfTlVNQkVSX0dST1VQXVxuICAgICAgICAgICAgPyBwYXJzZUludChtYXRjaFtNT05USF9OVU1CRVJfR1JPVVBdKVxuICAgICAgICAgICAgOiBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBpZiAobW9udGggPCAxIHx8IG1vbnRoID4gMTIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChtYXRjaFtZRUFSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICBjb25zdCBkYXkgPSBwYXJzZUludChtYXRjaFtEQVRFX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIihbMC05XXwwWzEtOV18MVswMTJdKS8oWzAtOV17NH0pXCIgKyBcIlwiLCBcImlcIik7XG5jb25zdCBNT05USF9HUk9VUCA9IDE7XG5jb25zdCBZRUFSX0dST1VQID0gMjtcbmNsYXNzIEVOU2xhc2hNb250aEZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgeWVhciA9IHBhcnNlSW50KG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChtYXRjaFtNT05USF9HUk9VUF0pO1xuICAgICAgICByZXR1cm4gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpLmltcGx5KFwiZGF5XCIsIDEpLmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKS5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOU2xhc2hNb250aEZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyID0gdm9pZCAwO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi9pbmRleFwiKTtcbmZ1bmN0aW9uIHByaW1hcnlUaW1lUGF0dGVybihwcmltYXJ5UHJlZml4LCBwcmltYXJ5U3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxcc3xUfFxcXFxiKVwiICtcbiAgICAgICAgYCR7cHJpbWFyeVByZWZpeH1gICtcbiAgICAgICAgXCIoXFxcXGR7MSw0fSlcIiArXG4gICAgICAgIFwiKD86XCIgK1xuICAgICAgICBcIig/OlxcXFwufFxcXFw6fFxcXFzvvJopXCIgK1xuICAgICAgICBcIihcXFxcZHsxLDJ9KVwiICtcbiAgICAgICAgXCIoPzpcIiArXG4gICAgICAgIFwiKD86XFxcXDp8XFxcXO+8milcIiArXG4gICAgICAgIFwiKFxcXFxkezJ9KVwiICtcbiAgICAgICAgXCIoPzpcXFxcLihcXFxcZHsxLDZ9KSk/XCIgK1xuICAgICAgICBcIik/XCIgK1xuICAgICAgICBcIik/XCIgK1xuICAgICAgICBcIig/OlxcXFxzKihhXFxcXC5tXFxcXC58cFxcXFwubVxcXFwufGFtP3xwbT8pKT9cIiArXG4gICAgICAgIGAke3ByaW1hcnlTdWZmaXh9YCwgXCJpXCIpO1xufVxuZnVuY3Rpb24gZm9sbG93aW5nVGltZVBhdHRlbihmb2xsb3dpbmdQaGFzZSwgZm9sbG93aW5nU3VmZml4KSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4oJHtmb2xsb3dpbmdQaGFzZX0pYCArXG4gICAgICAgIFwiKFxcXFxkezEsNH0pXCIgK1xuICAgICAgICBcIig/OlwiICtcbiAgICAgICAgXCIoPzpcXFxcLnxcXFxcOnxcXFxc77yaKVwiICtcbiAgICAgICAgXCIoXFxcXGR7MSwyfSlcIiArXG4gICAgICAgIFwiKD86XCIgK1xuICAgICAgICBcIig/OlxcXFwufFxcXFw6fFxcXFzvvJopXCIgK1xuICAgICAgICBcIihcXFxcZHsxLDJ9KSg/OlxcXFwuKFxcXFxkezEsNn0pKT9cIiArXG4gICAgICAgIFwiKT9cIiArXG4gICAgICAgIFwiKT9cIiArXG4gICAgICAgIFwiKD86XFxcXHMqKGFcXFxcLm1cXFxcLnxwXFxcXC5tXFxcXC58YW0/fHBtPykpP1wiICtcbiAgICAgICAgYCR7Zm9sbG93aW5nU3VmZml4fWAsIFwiaVwiKTtcbn1cbmNvbnN0IEhPVVJfR1JPVVAgPSAyO1xuY29uc3QgTUlOVVRFX0dST1VQID0gMztcbmNvbnN0IFNFQ09ORF9HUk9VUCA9IDQ7XG5jb25zdCBNSUxMSV9TRUNPTkRfR1JPVVAgPSA1O1xuY29uc3QgQU1fUE1fSE9VUl9HUk9VUCA9IDY7XG5jbGFzcyBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpY3RNb2RlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5jYWNoZWRQcmltYXJ5UHJlZml4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYWNoZWRQcmltYXJ5U3VmZml4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYWNoZWRQcmltYXJ5VGltZVBhdHRlcm4gPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlZEZvbGxvd2luZ1BoYXNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYWNoZWRGb2xsb3dpbmdTdWZmaXggPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlZEZvbGxvd2luZ1RpbWVQYXR0ZW4gPSBudWxsO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBwcmltYXJ5U3VmZml4KCkge1xuICAgICAgICByZXR1cm4gXCIoPz1cXFxcV3wkKVwiO1xuICAgIH1cbiAgICBmb2xsb3dpbmdTdWZmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/PVxcXFxXfCQpXCI7XG4gICAgfVxuICAgIHBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQcmltYXJ5VGltZVBhdHRlcm5UaHJvdWdoQ2FjaGUoKTtcbiAgICB9XG4gICAgZXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBzdGFydENvbXBvbmVudHMgPSB0aGlzLmV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gpO1xuICAgICAgICBpZiAoIXN0YXJ0Q29tcG9uZW50cykge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdGV4dCA9IG1hdGNoWzBdLnN1YnN0cmluZyhtYXRjaFsxXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQoaW5kZXgsIHRleHQsIHN0YXJ0Q29tcG9uZW50cyk7XG4gICAgICAgIG1hdGNoLmluZGV4ICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nVGV4dCA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcobWF0Y2guaW5kZXgpO1xuICAgICAgICBjb25zdCBmb2xsb3dpbmdQYXR0ZXJuID0gdGhpcy5nZXRGb2xsb3dpbmdUaW1lUGF0dGVyblRocm91Z2hDYWNoZSgpO1xuICAgICAgICBjb25zdCBmb2xsb3dpbmdNYXRjaCA9IGZvbGxvd2luZ1BhdHRlcm4uZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICAgICAgaWYgKCFmb2xsb3dpbmdNYXRjaCB8fFxuICAgICAgICAgICAgZm9sbG93aW5nTWF0Y2hbMF0ubWF0Y2goL15cXHMqKFsrLV0pXFxzKlxcZHszLDR9JC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0FuZFJldHVybldpdGhvdXRGb2xsb3dpbmdQYXR0ZXJuKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmVuZCA9IHRoaXMuZXh0cmFjdEZvbGxvd2luZ1RpbWVDb21wb25lbnRzKGNvbnRleHQsIGZvbGxvd2luZ01hdGNoLCByZXN1bHQpO1xuICAgICAgICBpZiAocmVzdWx0LmVuZCkge1xuICAgICAgICAgICAgcmVzdWx0LnRleHQgKz0gZm9sbG93aW5nTWF0Y2hbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tBbmRSZXR1cm5XaXRoRm9sbG93aW5nUGF0dGVybihyZXN1bHQpO1xuICAgIH1cbiAgICBleHRyYWN0UHJpbWFyeVRpbWVDb21wb25lbnRzKGNvbnRleHQsIG1hdGNoLCBzdHJpY3QgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBsZXQgbWludXRlID0gMDtcbiAgICAgICAgbGV0IG1lcmlkaWVtID0gbnVsbDtcbiAgICAgICAgbGV0IGhvdXIgPSBwYXJzZUludChtYXRjaFtIT1VSX0dST1VQXSk7XG4gICAgICAgIGlmIChob3VyID4gMTAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdHJpY3RNb2RlIHx8IG1hdGNoW01JTlVURV9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWludXRlID0gaG91ciAlIDEwMDtcbiAgICAgICAgICAgIGhvdXIgPSBNYXRoLmZsb29yKGhvdXIgLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob3VyID4gMjQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFtNSU5VVEVfR1JPVVBdLmxlbmd0aCA9PSAxICYmICFtYXRjaFtBTV9QTV9IT1VSX0dST1VQXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWludXRlID0gcGFyc2VJbnQobWF0Y2hbTUlOVVRFX0dST1VQXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbnV0ZSA+PSA2MCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvdXIgPiAxMikge1xuICAgICAgICAgICAgbWVyaWRpZW0gPSBpbmRleF8xLk1lcmlkaWVtLlBNO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtBTV9QTV9IT1VSX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaG91ciA+IDEyKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29uc3QgYW1wbSA9IG1hdGNoW0FNX1BNX0hPVVJfR1JPVVBdWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAoYW1wbSA9PSBcImFcIikge1xuICAgICAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5BTTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA9PSAxMikge1xuICAgICAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW1wbSA9PSBcInBcIikge1xuICAgICAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5QTTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciAhPSAxMikge1xuICAgICAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcImhvdXJcIiwgaG91cik7XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWludXRlXCIsIG1pbnV0ZSk7XG4gICAgICAgIGlmIChtZXJpZGllbSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBtZXJpZGllbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtNSUxMSV9TRUNPTkRfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pbGxpc2Vjb25kID0gcGFyc2VJbnQobWF0Y2hbTUlMTElfU0VDT05EX0dST1VQXS5zdWJzdHJpbmcoMCwgMykpO1xuICAgICAgICAgICAgaWYgKG1pbGxpc2Vjb25kID49IDEwMDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1pbGxpc2Vjb25kXCIsIG1pbGxpc2Vjb25kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbU0VDT05EX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzZWNvbmQgPSBwYXJzZUludChtYXRjaFtTRUNPTkRfR1JPVVBdKTtcbiAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gNjApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInNlY29uZFwiLCBzZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbiAgICBleHRyYWN0Rm9sbG93aW5nVGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gsIHJlc3VsdCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBpZiAobWF0Y2hbTUlMTElfU0VDT05EX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBtaWxsaXNlY29uZCA9IHBhcnNlSW50KG1hdGNoW01JTExJX1NFQ09ORF9HUk9VUF0uc3Vic3RyaW5nKDAsIDMpKTtcbiAgICAgICAgICAgIGlmIChtaWxsaXNlY29uZCA+PSAxMDAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtaWxsaXNlY29uZFwiLCBtaWxsaXNlY29uZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW1NFQ09ORF9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gcGFyc2VJbnQobWF0Y2hbU0VDT05EX0dST1VQXSk7XG4gICAgICAgICAgICBpZiAoc2Vjb25kID49IDYwKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJzZWNvbmRcIiwgc2Vjb25kKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaG91ciA9IHBhcnNlSW50KG1hdGNoW0hPVVJfR1JPVVBdKTtcbiAgICAgICAgbGV0IG1pbnV0ZSA9IDA7XG4gICAgICAgIGxldCBtZXJpZGllbSA9IC0xO1xuICAgICAgICBpZiAobWF0Y2hbTUlOVVRFX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtaW51dGUgPSBwYXJzZUludChtYXRjaFtNSU5VVEVfR1JPVVBdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChob3VyID4gMTAwKSB7XG4gICAgICAgICAgICBtaW51dGUgPSBob3VyICUgMTAwO1xuICAgICAgICAgICAgaG91ciA9IE1hdGguZmxvb3IoaG91ciAvIDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbnV0ZSA+PSA2MCB8fCBob3VyID4gMjQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob3VyID49IDEyKSB7XG4gICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uUE07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW0FNX1BNX0hPVVJfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChob3VyID4gMTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFtcG0gPSBtYXRjaFtBTV9QTV9IT1VSX0dST1VQXVswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGFtcG0gPT0gXCJhXCIpIHtcbiAgICAgICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uQU07XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50cy5pc0NlcnRhaW4oXCJkYXlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJkYXlcIiwgY29tcG9uZW50cy5nZXQoXCJkYXlcIikgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbXBtID09IFwicFwiKSB7XG4gICAgICAgICAgICAgICAgbWVyaWRpZW0gPSBpbmRleF8xLk1lcmlkaWVtLlBNO1xuICAgICAgICAgICAgICAgIGlmIChob3VyICE9IDEyKVxuICAgICAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwibWVyaWRpZW1cIikpIHtcbiAgICAgICAgICAgICAgICBpZiAobWVyaWRpZW0gPT0gaW5kZXhfMS5NZXJpZGllbS5BTSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5nZXQoXCJob3VyXCIpID09IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhcnQuZ2V0KFwiaG91clwiKSAhPSAxMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImhvdXJcIiwgcmVzdWx0LnN0YXJ0LmdldChcImhvdXJcIikgKyAxMik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGhvdXIpO1xuICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1pbnV0ZVwiLCBtaW51dGUpO1xuICAgICAgICBpZiAobWVyaWRpZW0gPj0gMCkge1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBtZXJpZGllbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydEF0UE0gPSByZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwibWVyaWRpZW1cIikgJiYgcmVzdWx0LnN0YXJ0LmdldChcImhvdXJcIikgPiAxMjtcbiAgICAgICAgICAgIGlmIChzdGFydEF0UE0pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXJ0LmdldChcImhvdXJcIikgLSAxMiA+IGhvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChob3VyIDw9IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwiaG91clwiLCBob3VyICsgMTIpO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGhvdXIgPiAxMikge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGhvdXIgPD0gMTIpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudHMuZGF0ZSgpLmdldFRpbWUoKSA8IHJlc3VsdC5zdGFydC5kYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIGNvbXBvbmVudHMuZ2V0KFwiZGF5XCIpICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxuICAgIGNoZWNrQW5kUmV0dXJuV2l0aG91dEZvbGxvd2luZ1BhdHRlcm4ocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQudGV4dC5tYXRjaCgvXlxcZCQvKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5kaW5nV2l0aE51bWJlcnMgPSByZXN1bHQudGV4dC5tYXRjaCgvW15cXGQ6Ll0oXFxkW1xcZC5dKykkLyk7XG4gICAgICAgIGlmIChlbmRpbmdXaXRoTnVtYmVycykge1xuICAgICAgICAgICAgY29uc3QgZW5kaW5nTnVtYmVycyA9IGVuZGluZ1dpdGhOdW1iZXJzWzFdO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RyaWN0TW9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVuZGluZ051bWJlcnMuaW5jbHVkZXMoXCIuXCIpICYmICFlbmRpbmdOdW1iZXJzLm1hdGNoKC9cXGQoXFwuXFxkezJ9KSskLykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGVuZGluZ051bWJlclZhbCA9IHBhcnNlSW50KGVuZGluZ051bWJlcnMpO1xuICAgICAgICAgICAgaWYgKGVuZGluZ051bWJlclZhbCA+IDI0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgY2hlY2tBbmRSZXR1cm5XaXRoRm9sbG93aW5nUGF0dGVybihyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC50ZXh0Lm1hdGNoKC9eXFxkKy1cXGQrJC8pKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmRpbmdXaXRoTnVtYmVycyA9IHJlc3VsdC50ZXh0Lm1hdGNoKC9bXlxcZDouXShcXGRbXFxkLl0rKVxccyotXFxzKihcXGRbXFxkLl0rKSQvKTtcbiAgICAgICAgaWYgKGVuZGluZ1dpdGhOdW1iZXJzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdHJpY3RNb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzdGFydGluZ051bWJlcnMgPSBlbmRpbmdXaXRoTnVtYmVyc1sxXTtcbiAgICAgICAgICAgIGNvbnN0IGVuZGluZ051bWJlcnMgPSBlbmRpbmdXaXRoTnVtYmVyc1syXTtcbiAgICAgICAgICAgIGlmIChlbmRpbmdOdW1iZXJzLmluY2x1ZGVzKFwiLlwiKSAmJiAhZW5kaW5nTnVtYmVycy5tYXRjaCgvXFxkKFxcLlxcZHsyfSkrJC8pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlbmRpbmdOdW1iZXJWYWwgPSBwYXJzZUludChlbmRpbmdOdW1iZXJzKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0aW5nTnVtYmVyVmFsID0gcGFyc2VJbnQoc3RhcnRpbmdOdW1iZXJzKTtcbiAgICAgICAgICAgIGlmIChlbmRpbmdOdW1iZXJWYWwgPiAyNCB8fCBzdGFydGluZ051bWJlclZhbCA+IDI0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZ2V0UHJpbWFyeVRpbWVQYXR0ZXJuVGhyb3VnaENhY2hlKCkge1xuICAgICAgICBjb25zdCBwcmltYXJ5UHJlZml4ID0gdGhpcy5wcmltYXJ5UHJlZml4KCk7XG4gICAgICAgIGNvbnN0IHByaW1hcnlTdWZmaXggPSB0aGlzLnByaW1hcnlTdWZmaXgoKTtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkUHJpbWFyeVByZWZpeCA9PT0gcHJpbWFyeVByZWZpeCAmJiB0aGlzLmNhY2hlZFByaW1hcnlTdWZmaXggPT09IHByaW1hcnlTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFByaW1hcnlUaW1lUGF0dGVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlZFByaW1hcnlUaW1lUGF0dGVybiA9IHByaW1hcnlUaW1lUGF0dGVybihwcmltYXJ5UHJlZml4LCBwcmltYXJ5U3VmZml4KTtcbiAgICAgICAgdGhpcy5jYWNoZWRQcmltYXJ5UHJlZml4ID0gcHJpbWFyeVByZWZpeDtcbiAgICAgICAgdGhpcy5jYWNoZWRQcmltYXJ5U3VmZml4ID0gcHJpbWFyeVN1ZmZpeDtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUHJpbWFyeVRpbWVQYXR0ZXJuO1xuICAgIH1cbiAgICBnZXRGb2xsb3dpbmdUaW1lUGF0dGVyblRocm91Z2hDYWNoZSgpIHtcbiAgICAgICAgY29uc3QgZm9sbG93aW5nUGhhc2UgPSB0aGlzLmZvbGxvd2luZ1BoYXNlKCk7XG4gICAgICAgIGNvbnN0IGZvbGxvd2luZ1N1ZmZpeCA9IHRoaXMuZm9sbG93aW5nU3VmZml4KCk7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZEZvbGxvd2luZ1BoYXNlID09PSBmb2xsb3dpbmdQaGFzZSAmJiB0aGlzLmNhY2hlZEZvbGxvd2luZ1N1ZmZpeCA9PT0gZm9sbG93aW5nU3VmZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRGb2xsb3dpbmdUaW1lUGF0dGVuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FjaGVkRm9sbG93aW5nVGltZVBhdHRlbiA9IGZvbGxvd2luZ1RpbWVQYXR0ZW4oZm9sbG93aW5nUGhhc2UsIGZvbGxvd2luZ1N1ZmZpeCk7XG4gICAgICAgIHRoaXMuY2FjaGVkRm9sbG93aW5nUGhhc2UgPSBmb2xsb3dpbmdQaGFzZTtcbiAgICAgICAgdGhpcy5jYWNoZWRGb2xsb3dpbmdTdWZmaXggPSBmb2xsb3dpbmdTdWZmaXg7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZEZvbGxvd2luZ1RpbWVQYXR0ZW47XG4gICAgfVxufVxuZXhwb3J0cy5BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyID0gQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNvbnN0IEFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXCIpO1xuY2xhc3MgRU5UaW1lRXhwcmVzc2lvblBhcnNlciBleHRlbmRzIEFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJfMS5BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpY3RNb2RlKSB7XG4gICAgICAgIHN1cGVyKHN0cmljdE1vZGUpO1xuICAgIH1cbiAgICBmb2xsb3dpbmdQaGFzZSgpIHtcbiAgICAgICAgcmV0dXJuIFwiXFxcXHMqKD86XFxcXC18XFxcXOKAk3xcXFxcfnxcXFxc44CcfHRvfFxcXFw/KVxcXFxzKlwiO1xuICAgIH1cbiAgICBwcmltYXJ5UHJlZml4KCkge1xuICAgICAgICByZXR1cm4gXCIoPzooPzphdHxmcm9tKVxcXFxzKik/P1wiO1xuICAgIH1cbiAgICBwcmltYXJ5U3VmZml4KCkge1xuICAgICAgICByZXR1cm4gXCIoPzpcXFxccyooPzpvXFxcXFcqY2xvY2t8YXRcXFxccypuaWdodHxpblxcXFxzKnRoZVxcXFxzKig/Om1vcm5pbmd8YWZ0ZXJub29uKSkpPyg/IS8pKD89XFxcXFd8JClcIjtcbiAgICB9XG4gICAgZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gc3VwZXIuZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCk7XG4gICAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJuaWdodFwiKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvdXIgPSBjb21wb25lbnRzLmdldChcImhvdXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPj0gNiAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaG91ciA8IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJhZnRlcm5vb25cIikpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvdXIgPSBjb21wb25lbnRzLmdldChcImhvdXJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPj0gMCAmJiBob3VyIDw9IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJtb3JuaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb25zdCBob3VyID0gY29tcG9uZW50cy5nZXQoXCJob3VyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOVGltZUV4cHJlc3Npb25QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWRkSW1wbGllZFRpbWVVbml0cyA9IGV4cG9ydHMucmV2ZXJzZVRpbWVVbml0cyA9IHZvaWQgMDtcbmZ1bmN0aW9uIHJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKSB7XG4gICAgY29uc3QgcmV2ZXJzZWQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aW1lVW5pdHMpIHtcbiAgICAgICAgcmV2ZXJzZWRba2V5XSA9IC10aW1lVW5pdHNba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHJldmVyc2VkO1xufVxuZXhwb3J0cy5yZXZlcnNlVGltZVVuaXRzID0gcmV2ZXJzZVRpbWVVbml0cztcbmZ1bmN0aW9uIGFkZEltcGxpZWRUaW1lVW5pdHMoY29tcG9uZW50cywgdGltZVVuaXRzKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gY29tcG9uZW50cy5jbG9uZSgpO1xuICAgIGxldCBkYXRlID0gY29tcG9uZW50cy5kYXlqcygpO1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRpbWVVbml0cykge1xuICAgICAgICBkYXRlID0gZGF0ZS5hZGQodGltZVVuaXRzW2tleV0sIGtleSk7XG4gICAgfVxuICAgIGlmIChcImRheVwiIGluIHRpbWVVbml0cyB8fCBcImRcIiBpbiB0aW1lVW5pdHMgfHwgXCJ3ZWVrXCIgaW4gdGltZVVuaXRzIHx8IFwibW9udGhcIiBpbiB0aW1lVW5pdHMgfHwgXCJ5ZWFyXCIgaW4gdGltZVVuaXRzKSB7XG4gICAgICAgIG91dHB1dC5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSk7XG4gICAgICAgIG91dHB1dC5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICBvdXRwdXQuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICB9XG4gICAgaWYgKFwic2Vjb25kXCIgaW4gdGltZVVuaXRzIHx8IFwibWludXRlXCIgaW4gdGltZVVuaXRzIHx8IFwiaG91clwiIGluIHRpbWVVbml0cykge1xuICAgICAgICBvdXRwdXQuaW1wbHkoXCJzZWNvbmRcIiwgZGF0ZS5zZWNvbmQoKSk7XG4gICAgICAgIG91dHB1dC5pbXBseShcIm1pbnV0ZVwiLCBkYXRlLm1pbnV0ZSgpKTtcbiAgICAgICAgb3V0cHV0LmltcGx5KFwiaG91clwiLCBkYXRlLmhvdXIoKSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG5leHBvcnRzLmFkZEltcGxpZWRUaW1lVW5pdHMgPSBhZGRJbXBsaWVkVGltZVVuaXRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHRpbWV1bml0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3RpbWV1bml0c1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXCIgKyBcIihcIiArIGNvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTiArIFwiKVwiICsgXCIoPzphZ298YmVmb3JlfGVhcmxpZXIpKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNvbnN0IFNUUklDVF9QQVRURVJOID0gbmV3IFJlZ0V4cChcIlwiICsgXCIoXCIgKyBjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk4gKyBcIilcIiArIFwiYWdvKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNsYXNzIEVOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmljdE1vZGUgPyBTVFJJQ1RfUEFUVEVSTiA6IFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0aW1lVW5pdHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFsxXSk7XG4gICAgICAgIGNvbnN0IG91dHB1dFRpbWVVbml0cyA9IHRpbWV1bml0c18xLnJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgb3V0cHV0VGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiXCIgKyBcIihcIiArIGNvbnN0YW50c18xLlRJTUVfVU5JVFNfUEFUVEVSTiArIFwiKVwiICsgXCIobGF0ZXJ8YWZ0ZXJ8ZnJvbSBub3d8aGVuY2Vmb3J0aHxmb3J3YXJkfG91dClcIiArIFwiKD89KD86XFxcXFd8JCkpXCIsIFwiaVwiKTtcbmNvbnN0IFNUUklDVF9QQVRURVJOID0gbmV3IFJlZ0V4cChcIlwiICsgXCIoXCIgKyBjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk4gKyBcIilcIiArIFwiKGxhdGVyfGZyb20gbm93KVwiICsgXCIoPz0oPzpcXFxcV3wkKSlcIiwgXCJpXCIpO1xuY29uc3QgR1JPVVBfTlVNX1RJTUVVTklUUyA9IDE7XG5jbGFzcyBFTlRpbWVVbml0TGF0ZXJGb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmljdE1vZGUgPyBTVFJJQ1RfUEFUVEVSTiA6IFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBmcmFnbWVudHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFtHUk9VUF9OVU1fVElNRVVOSVRTXSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMuY3JlYXRlUmVsYXRpdmVGcm9tUmVmRGF0ZShjb250ZXh0LnJlZkRhdGUsIGZyYWdtZW50cyk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk1lcmdpbmdSZWZpbmVyID0gZXhwb3J0cy5GaWx0ZXIgPSB2b2lkIDA7XG5jbGFzcyBGaWx0ZXIge1xuICAgIHJlZmluZShjb250ZXh0LCByZXN1bHRzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzLmZpbHRlcigocikgPT4gdGhpcy5pc1ZhbGlkKGNvbnRleHQsIHIpKTtcbiAgICB9XG59XG5leHBvcnRzLkZpbHRlciA9IEZpbHRlcjtcbmNsYXNzIE1lcmdpbmdSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXJnZWRSZXN1bHRzID0gW107XG4gICAgICAgIGxldCBjdXJSZXN1bHQgPSByZXN1bHRzWzBdO1xuICAgICAgICBsZXQgbmV4dFJlc3VsdCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbmV4dFJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICBjb25zdCB0ZXh0QmV0d2VlbiA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcoY3VyUmVzdWx0LmluZGV4ICsgY3VyUmVzdWx0LnRleHQubGVuZ3RoLCBuZXh0UmVzdWx0LmluZGV4KTtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG91bGRNZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGN1clJlc3VsdCwgbmV4dFJlc3VsdCwgY29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWRSZXN1bHRzLnB1c2goY3VyUmVzdWx0KTtcbiAgICAgICAgICAgICAgICBjdXJSZXN1bHQgPSBuZXh0UmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdCA9IGN1clJlc3VsdDtcbiAgICAgICAgICAgICAgICBjb25zdCByaWdodCA9IG5leHRSZXN1bHQ7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkUmVzdWx0ID0gdGhpcy5tZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGxlZnQsIHJpZ2h0LCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSBtZXJnZWQgJHtsZWZ0fSBhbmQgJHtyaWdodH0gaW50byAke21lcmdlZFJlc3VsdH1gKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjdXJSZXN1bHQgPSBtZXJnZWRSZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1clJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtZXJnZWRSZXN1bHRzLnB1c2goY3VyUmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVyZ2VkUmVzdWx0cztcbiAgICB9XG59XG5leHBvcnRzLk1lcmdpbmdSZWZpbmVyID0gTWVyZ2luZ1JlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFic3RyYWN0UmVmaW5lcnNfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdFJlZmluZXJzXCIpO1xuY2xhc3MgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBhYnN0cmFjdFJlZmluZXJzXzEuTWVyZ2luZ1JlZmluZXIge1xuICAgIHNob3VsZE1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICByZXR1cm4gIWN1cnJlbnRSZXN1bHQuZW5kICYmICFuZXh0UmVzdWx0LmVuZCAmJiB0ZXh0QmV0d2Vlbi5tYXRjaCh0aGlzLnBhdHRlcm5CZXR3ZWVuKCkpICE9IG51bGw7XG4gICAgfVxuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgZnJvbVJlc3VsdCwgdG9SZXN1bHQpIHtcbiAgICAgICAgaWYgKCFmcm9tUmVzdWx0LnN0YXJ0LmlzT25seVdlZWtkYXlDb21wb25lbnQoKSAmJiAhdG9SZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpKSB7XG4gICAgICAgICAgICB0b1Jlc3VsdC5zdGFydC5nZXRDZXJ0YWluQ29tcG9uZW50cygpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZnJvbVJlc3VsdC5zdGFydC5pc0NlcnRhaW4oa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmFzc2lnbihrZXksIHRvUmVzdWx0LnN0YXJ0LmdldChrZXkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZyb21SZXN1bHQuc3RhcnQuZ2V0Q2VydGFpbkNvbXBvbmVudHMoKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRvUmVzdWx0LnN0YXJ0LmlzQ2VydGFpbihrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmFzc2lnbihrZXksIGZyb21SZXN1bHQuc3RhcnQuZ2V0KGtleSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcm9tUmVzdWx0LnN0YXJ0LmRhdGUoKS5nZXRUaW1lKCkgPiB0b1Jlc3VsdC5zdGFydC5kYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBsZXQgZnJvbU1vbWVudCA9IGZyb21SZXN1bHQuc3RhcnQuZGF5anMoKTtcbiAgICAgICAgICAgIGxldCB0b01vbWVudCA9IHRvUmVzdWx0LnN0YXJ0LmRheWpzKCk7XG4gICAgICAgICAgICBpZiAoZnJvbVJlc3VsdC5zdGFydC5pc09ubHlXZWVrZGF5Q29tcG9uZW50KCkgJiYgZnJvbU1vbWVudC5hZGQoLTcsIFwiZGF5c1wiKS5pc0JlZm9yZSh0b01vbWVudCkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTW9tZW50ID0gZnJvbU1vbWVudC5hZGQoLTcsIFwiZGF5c1wiKTtcbiAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmltcGx5KFwiZGF5XCIsIGZyb21Nb21lbnQuZGF0ZSgpKTtcbiAgICAgICAgICAgICAgICBmcm9tUmVzdWx0LnN0YXJ0LmltcGx5KFwibW9udGhcIiwgZnJvbU1vbWVudC5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgZnJvbVJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgZnJvbU1vbWVudC55ZWFyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG9SZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpICYmIHRvTW9tZW50LmFkZCg3LCBcImRheXNcIikuaXNBZnRlcihmcm9tTW9tZW50KSkge1xuICAgICAgICAgICAgICAgIHRvTW9tZW50ID0gdG9Nb21lbnQuYWRkKDcsIFwiZGF5c1wiKTtcbiAgICAgICAgICAgICAgICB0b1Jlc3VsdC5zdGFydC5pbXBseShcImRheVwiLCB0b01vbWVudC5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmltcGx5KFwibW9udGhcIiwgdG9Nb21lbnQubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgIHRvUmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB0b01vbWVudC55ZWFyKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgW3RvUmVzdWx0LCBmcm9tUmVzdWx0XSA9IFtmcm9tUmVzdWx0LCB0b1Jlc3VsdF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZnJvbVJlc3VsdC5jbG9uZSgpO1xuICAgICAgICByZXN1bHQuc3RhcnQgPSBmcm9tUmVzdWx0LnN0YXJ0O1xuICAgICAgICByZXN1bHQuZW5kID0gdG9SZXN1bHQuc3RhcnQ7XG4gICAgICAgIHJlc3VsdC5pbmRleCA9IE1hdGgubWluKGZyb21SZXN1bHQuaW5kZXgsIHRvUmVzdWx0LmluZGV4KTtcbiAgICAgICAgaWYgKGZyb21SZXN1bHQuaW5kZXggPCB0b1Jlc3VsdC5pbmRleCkge1xuICAgICAgICAgICAgcmVzdWx0LnRleHQgPSBmcm9tUmVzdWx0LnRleHQgKyB0ZXh0QmV0d2VlbiArIHRvUmVzdWx0LnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQudGV4dCA9IHRvUmVzdWx0LnRleHQgKyB0ZXh0QmV0d2VlbiArIGZyb21SZXN1bHQudGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY2xhc3MgRU5NZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gL15cXHMqKHRvfC0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTk1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tZXJnZURhdGVUaW1lQ29tcG9uZW50ID0gZXhwb3J0cy5tZXJnZURhdGVUaW1lUmVzdWx0ID0gdm9pZCAwO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi9pbmRleFwiKTtcbmZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVSZXN1bHQoZGF0ZVJlc3VsdCwgdGltZVJlc3VsdCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGRhdGVSZXN1bHQuY2xvbmUoKTtcbiAgICBjb25zdCBiZWdpbkRhdGUgPSBkYXRlUmVzdWx0LnN0YXJ0O1xuICAgIGNvbnN0IGJlZ2luVGltZSA9IHRpbWVSZXN1bHQuc3RhcnQ7XG4gICAgcmVzdWx0LnN0YXJ0ID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudChiZWdpbkRhdGUsIGJlZ2luVGltZSk7XG4gICAgaWYgKGRhdGVSZXN1bHQuZW5kICE9IG51bGwgfHwgdGltZVJlc3VsdC5lbmQgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBlbmREYXRlID0gZGF0ZVJlc3VsdC5lbmQgPT0gbnVsbCA/IGRhdGVSZXN1bHQuc3RhcnQgOiBkYXRlUmVzdWx0LmVuZDtcbiAgICAgICAgY29uc3QgZW5kVGltZSA9IHRpbWVSZXN1bHQuZW5kID09IG51bGwgPyB0aW1lUmVzdWx0LnN0YXJ0IDogdGltZVJlc3VsdC5lbmQ7XG4gICAgICAgIGNvbnN0IGVuZERhdGVUaW1lID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudChlbmREYXRlLCBlbmRUaW1lKTtcbiAgICAgICAgaWYgKGRhdGVSZXN1bHQuZW5kID09IG51bGwgJiYgZW5kRGF0ZVRpbWUuZGF0ZSgpLmdldFRpbWUoKSA8IHJlc3VsdC5zdGFydC5kYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICBpZiAoZW5kRGF0ZVRpbWUuaXNDZXJ0YWluKFwiZGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgZW5kRGF0ZVRpbWUuYXNzaWduKFwiZGF5XCIsIGVuZERhdGVUaW1lLmdldChcImRheVwiKSArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kRGF0ZVRpbWUuaW1wbHkoXCJkYXlcIiwgZW5kRGF0ZVRpbWUuZ2V0KFwiZGF5XCIpICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LmVuZCA9IGVuZERhdGVUaW1lO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5tZXJnZURhdGVUaW1lUmVzdWx0ID0gbWVyZ2VEYXRlVGltZVJlc3VsdDtcbmZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVDb21wb25lbnQoZGF0ZUNvbXBvbmVudCwgdGltZUNvbXBvbmVudCkge1xuICAgIGNvbnN0IGRhdGVUaW1lQ29tcG9uZW50ID0gZGF0ZUNvbXBvbmVudC5jbG9uZSgpO1xuICAgIGlmICh0aW1lQ29tcG9uZW50LmlzQ2VydGFpbihcImhvdXJcIikpIHtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwiaG91clwiLCB0aW1lQ29tcG9uZW50LmdldChcImhvdXJcIikpO1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5hc3NpZ24oXCJtaW51dGVcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJtaW51dGVcIikpO1xuICAgICAgICBpZiAodGltZUNvbXBvbmVudC5pc0NlcnRhaW4oXCJzZWNvbmRcIikpIHtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcInNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcInNlY29uZFwiKSk7XG4gICAgICAgICAgICBpZiAodGltZUNvbXBvbmVudC5pc0NlcnRhaW4oXCJtaWxsaXNlY29uZFwiKSkge1xuICAgICAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcIm1pbGxpc2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWlsbGlzZWNvbmRcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJtaWxsaXNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbGxpc2Vjb25kXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwic2Vjb25kXCIpKTtcbiAgICAgICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwibWlsbGlzZWNvbmRcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJtaWxsaXNlY29uZFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwiaG91clwiLCB0aW1lQ29tcG9uZW50LmdldChcImhvdXJcIikpO1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbnV0ZVwiKSk7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwic2Vjb25kXCIpKTtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJtaWxsaXNlY29uZFwiLCB0aW1lQ29tcG9uZW50LmdldChcIm1pbGxpc2Vjb25kXCIpKTtcbiAgICB9XG4gICAgaWYgKHRpbWVDb21wb25lbnQuaXNDZXJ0YWluKFwidGltZXpvbmVPZmZzZXRcIikpIHtcbiAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwidGltZXpvbmVPZmZzZXRcIiwgdGltZUNvbXBvbmVudC5nZXQoXCJ0aW1lem9uZU9mZnNldFwiKSk7XG4gICAgfVxuICAgIGlmICh0aW1lQ29tcG9uZW50LmlzQ2VydGFpbihcIm1lcmlkaWVtXCIpKSB7XG4gICAgICAgIGRhdGVUaW1lQ29tcG9uZW50LmFzc2lnbihcIm1lcmlkaWVtXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aW1lQ29tcG9uZW50LmdldChcIm1lcmlkaWVtXCIpICE9IG51bGwgJiYgZGF0ZVRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikgPT0gbnVsbCkge1xuICAgICAgICBkYXRlVGltZUNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIHRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikpO1xuICAgIH1cbiAgICBpZiAoZGF0ZVRpbWVDb21wb25lbnQuZ2V0KFwibWVyaWRpZW1cIikgPT0gaW5kZXhfMS5NZXJpZGllbS5QTSAmJiBkYXRlVGltZUNvbXBvbmVudC5nZXQoXCJob3VyXCIpIDwgMTIpIHtcbiAgICAgICAgaWYgKHRpbWVDb21wb25lbnQuaXNDZXJ0YWluKFwiaG91clwiKSkge1xuICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuYXNzaWduKFwiaG91clwiLCBkYXRlVGltZUNvbXBvbmVudC5nZXQoXCJob3VyXCIpICsgMTIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGF0ZVRpbWVDb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIGRhdGVUaW1lQ29tcG9uZW50LmdldChcImhvdXJcIikgKyAxMik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGVUaW1lQ29tcG9uZW50O1xufVxuZXhwb3J0cy5tZXJnZURhdGVUaW1lQ29tcG9uZW50ID0gbWVyZ2VEYXRlVGltZUNvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWJzdHJhY3RSZWZpbmVyc18xID0gcmVxdWlyZShcIi4uL2Fic3RyYWN0UmVmaW5lcnNcIik7XG5jb25zdCBtZXJnaW5nQ2FsY3VsYXRpb25fMSA9IHJlcXVpcmUoXCIuLi8uLi9jYWxjdWxhdGlvbi9tZXJnaW5nQ2FsY3VsYXRpb25cIik7XG5jbGFzcyBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgYWJzdHJhY3RSZWZpbmVyc18xLk1lcmdpbmdSZWZpbmVyIHtcbiAgICBzaG91bGRNZXJnZVJlc3VsdHModGV4dEJldHdlZW4sIGN1cnJlbnRSZXN1bHQsIG5leHRSZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuICgoKGN1cnJlbnRSZXN1bHQuc3RhcnQuaXNPbmx5RGF0ZSgpICYmIG5leHRSZXN1bHQuc3RhcnQuaXNPbmx5VGltZSgpKSB8fFxuICAgICAgICAgICAgKG5leHRSZXN1bHQuc3RhcnQuaXNPbmx5RGF0ZSgpICYmIGN1cnJlbnRSZXN1bHQuc3RhcnQuaXNPbmx5VGltZSgpKSkgJiZcbiAgICAgICAgICAgIHRleHRCZXR3ZWVuLm1hdGNoKHRoaXMucGF0dGVybkJldHdlZW4oKSkgIT0gbnVsbCk7XG4gICAgfVxuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjdXJyZW50UmVzdWx0LnN0YXJ0LmlzT25seURhdGUoKVxuICAgICAgICAgICAgPyBtZXJnaW5nQ2FsY3VsYXRpb25fMS5tZXJnZURhdGVUaW1lUmVzdWx0KGN1cnJlbnRSZXN1bHQsIG5leHRSZXN1bHQpXG4gICAgICAgICAgICA6IG1lcmdpbmdDYWxjdWxhdGlvbl8xLm1lcmdlRGF0ZVRpbWVSZXN1bHQobmV4dFJlc3VsdCwgY3VycmVudFJlc3VsdCk7XG4gICAgICAgIHJlc3VsdC5pbmRleCA9IGN1cnJlbnRSZXN1bHQuaW5kZXg7XG4gICAgICAgIHJlc3VsdC50ZXh0ID0gY3VycmVudFJlc3VsdC50ZXh0ICsgdGV4dEJldHdlZW4gKyBuZXh0UmVzdWx0LnRleHQ7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5NZXJnZURhdGVUaW1lUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jbGFzcyBFTk1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cXFxccyooVHxhdHxhZnRlcnxiZWZvcmV8b258b2Z8LHwtKT9cXFxccyokXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOTWVyZ2VEYXRlVGltZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRJTUVaT05FX05BTUVfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqXFxcXCg/KFtBLVpdezIsNH0pXFxcXCk/KD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgREVGQVVMVF9USU1FWk9ORV9BQkJSX01BUCA9IHtcbiAgICBBQ0RUOiA2MzAsXG4gICAgQUNTVDogNTcwLFxuICAgIEFEVDogLTE4MCxcbiAgICBBRURUOiA2NjAsXG4gICAgQUVTVDogNjAwLFxuICAgIEFGVDogMjcwLFxuICAgIEFLRFQ6IC00ODAsXG4gICAgQUtTVDogLTU0MCxcbiAgICBBTE1UOiAzNjAsXG4gICAgQU1TVDogLTE4MCxcbiAgICBBTVQ6IC0yNDAsXG4gICAgQU5BU1Q6IDcyMCxcbiAgICBBTkFUOiA3MjAsXG4gICAgQVFUVDogMzAwLFxuICAgIEFSVDogLTE4MCxcbiAgICBBU1Q6IC0yNDAsXG4gICAgQVdEVDogNTQwLFxuICAgIEFXU1Q6IDQ4MCxcbiAgICBBWk9TVDogMCxcbiAgICBBWk9UOiAtNjAsXG4gICAgQVpTVDogMzAwLFxuICAgIEFaVDogMjQwLFxuICAgIEJOVDogNDgwLFxuICAgIEJPVDogLTI0MCxcbiAgICBCUlNUOiAtMTIwLFxuICAgIEJSVDogLTE4MCxcbiAgICBCU1Q6IDYwLFxuICAgIEJUVDogMzYwLFxuICAgIENBU1Q6IDQ4MCxcbiAgICBDQVQ6IDEyMCxcbiAgICBDQ1Q6IDM5MCxcbiAgICBDRFQ6IC0zMDAsXG4gICAgQ0VTVDogMTIwLFxuICAgIENFVDogNjAsXG4gICAgQ0hBRFQ6IDgyNSxcbiAgICBDSEFTVDogNzY1LFxuICAgIENLVDogLTYwMCxcbiAgICBDTFNUOiAtMTgwLFxuICAgIENMVDogLTI0MCxcbiAgICBDT1Q6IC0zMDAsXG4gICAgQ1NUOiAtMzYwLFxuICAgIENWVDogLTYwLFxuICAgIENYVDogNDIwLFxuICAgIENoU1Q6IDYwMCxcbiAgICBEQVZUOiA0MjAsXG4gICAgRUFTU1Q6IC0zMDAsXG4gICAgRUFTVDogLTM2MCxcbiAgICBFQVQ6IDE4MCxcbiAgICBFQ1Q6IC0zMDAsXG4gICAgRURUOiAtMjQwLFxuICAgIEVFU1Q6IDE4MCxcbiAgICBFRVQ6IDEyMCxcbiAgICBFR1NUOiAwLFxuICAgIEVHVDogLTYwLFxuICAgIEVTVDogLTMwMCxcbiAgICBFVDogLTMwMCxcbiAgICBGSlNUOiA3ODAsXG4gICAgRkpUOiA3MjAsXG4gICAgRktTVDogLTE4MCxcbiAgICBGS1Q6IC0yNDAsXG4gICAgRk5UOiAtMTIwLFxuICAgIEdBTFQ6IC0zNjAsXG4gICAgR0FNVDogLTU0MCxcbiAgICBHRVQ6IDI0MCxcbiAgICBHRlQ6IC0xODAsXG4gICAgR0lMVDogNzIwLFxuICAgIEdNVDogMCxcbiAgICBHU1Q6IDI0MCxcbiAgICBHWVQ6IC0yNDAsXG4gICAgSEFBOiAtMTgwLFxuICAgIEhBQzogLTMwMCxcbiAgICBIQURUOiAtNTQwLFxuICAgIEhBRTogLTI0MCxcbiAgICBIQVA6IC00MjAsXG4gICAgSEFSOiAtMzYwLFxuICAgIEhBU1Q6IC02MDAsXG4gICAgSEFUOiAtOTAsXG4gICAgSEFZOiAtNDgwLFxuICAgIEhLVDogNDgwLFxuICAgIEhMVjogLTIxMCxcbiAgICBITkE6IC0yNDAsXG4gICAgSE5DOiAtMzYwLFxuICAgIEhORTogLTMwMCxcbiAgICBITlA6IC00ODAsXG4gICAgSE5SOiAtNDIwLFxuICAgIEhOVDogLTE1MCxcbiAgICBITlk6IC01NDAsXG4gICAgSE9WVDogNDIwLFxuICAgIElDVDogNDIwLFxuICAgIElEVDogMTgwLFxuICAgIElPVDogMzYwLFxuICAgIElSRFQ6IDI3MCxcbiAgICBJUktTVDogNTQwLFxuICAgIElSS1Q6IDU0MCxcbiAgICBJUlNUOiAyMTAsXG4gICAgSVNUOiAzMzAsXG4gICAgSlNUOiA1NDAsXG4gICAgS0dUOiAzNjAsXG4gICAgS1JBU1Q6IDQ4MCxcbiAgICBLUkFUOiA0ODAsXG4gICAgS1NUOiA1NDAsXG4gICAgS1VZVDogMjQwLFxuICAgIExIRFQ6IDY2MCxcbiAgICBMSFNUOiA2MzAsXG4gICAgTElOVDogODQwLFxuICAgIE1BR1NUOiA3MjAsXG4gICAgTUFHVDogNzIwLFxuICAgIE1BUlQ6IC01MTAsXG4gICAgTUFXVDogMzAwLFxuICAgIE1EVDogLTM2MCxcbiAgICBNRVNaOiAxMjAsXG4gICAgTUVaOiA2MCxcbiAgICBNSFQ6IDcyMCxcbiAgICBNTVQ6IDM5MCxcbiAgICBNU0Q6IDI0MCxcbiAgICBNU0s6IDI0MCxcbiAgICBNU1Q6IC00MjAsXG4gICAgTVVUOiAyNDAsXG4gICAgTVZUOiAzMDAsXG4gICAgTVlUOiA0ODAsXG4gICAgTkNUOiA2NjAsXG4gICAgTkRUOiAtOTAsXG4gICAgTkZUOiA2OTAsXG4gICAgTk9WU1Q6IDQyMCxcbiAgICBOT1ZUOiAzNjAsXG4gICAgTlBUOiAzNDUsXG4gICAgTlNUOiAtMTUwLFxuICAgIE5VVDogLTY2MCxcbiAgICBOWkRUOiA3ODAsXG4gICAgTlpTVDogNzIwLFxuICAgIE9NU1NUOiA0MjAsXG4gICAgT01TVDogNDIwLFxuICAgIFBEVDogLTQyMCxcbiAgICBQRVQ6IC0zMDAsXG4gICAgUEVUU1Q6IDcyMCxcbiAgICBQRVRUOiA3MjAsXG4gICAgUEdUOiA2MDAsXG4gICAgUEhPVDogNzgwLFxuICAgIFBIVDogNDgwLFxuICAgIFBLVDogMzAwLFxuICAgIFBNRFQ6IC0xMjAsXG4gICAgUE1TVDogLTE4MCxcbiAgICBQT05UOiA2NjAsXG4gICAgUFNUOiAtNDgwLFxuICAgIFBUOiAtNDgwLFxuICAgIFBXVDogNTQwLFxuICAgIFBZU1Q6IC0xODAsXG4gICAgUFlUOiAtMjQwLFxuICAgIFJFVDogMjQwLFxuICAgIFNBTVQ6IDI0MCxcbiAgICBTQVNUOiAxMjAsXG4gICAgU0JUOiA2NjAsXG4gICAgU0NUOiAyNDAsXG4gICAgU0dUOiA0ODAsXG4gICAgU1JUOiAtMTgwLFxuICAgIFNTVDogLTY2MCxcbiAgICBUQUhUOiAtNjAwLFxuICAgIFRGVDogMzAwLFxuICAgIFRKVDogMzAwLFxuICAgIFRLVDogNzgwLFxuICAgIFRMVDogNTQwLFxuICAgIFRNVDogMzAwLFxuICAgIFRWVDogNzIwLFxuICAgIFVMQVQ6IDQ4MCxcbiAgICBVVEM6IDAsXG4gICAgVVlTVDogLTEyMCxcbiAgICBVWVQ6IC0xODAsXG4gICAgVVpUOiAzMDAsXG4gICAgVkVUOiAtMjEwLFxuICAgIFZMQVNUOiA2NjAsXG4gICAgVkxBVDogNjYwLFxuICAgIFZVVDogNjYwLFxuICAgIFdBU1Q6IDEyMCxcbiAgICBXQVQ6IDYwLFxuICAgIFdFU1Q6IDYwLFxuICAgIFdFU1o6IDYwLFxuICAgIFdFVDogMCxcbiAgICBXRVo6IDAsXG4gICAgV0ZUOiA3MjAsXG4gICAgV0dTVDogLTEyMCxcbiAgICBXR1Q6IC0xODAsXG4gICAgV0lCOiA0MjAsXG4gICAgV0lUOiA1NDAsXG4gICAgV0lUQTogNDgwLFxuICAgIFdTVDogNzgwLFxuICAgIFdUOiAwLFxuICAgIFlBS1NUOiA2MDAsXG4gICAgWUFLVDogNjAwLFxuICAgIFlBUFQ6IDYwMCxcbiAgICBZRUtTVDogMzYwLFxuICAgIFlFS1Q6IDM2MCxcbn07XG5jbGFzcyBFeHRyYWN0VGltZXpvbmVBYmJyUmVmaW5lciB7XG4gICAgY29uc3RydWN0b3IodGltZXpvbmVPdmVycmlkZXMpIHtcbiAgICAgICAgdGhpcy50aW1lem9uZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9USU1FWk9ORV9BQkJSX01BUCksIHRpbWV6b25lT3ZlcnJpZGVzKTtcbiAgICB9XG4gICAgcmVmaW5lKGNvbnRleHQsIHJlc3VsdHMpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB0aW1lem9uZU92ZXJyaWRlcyA9IChfYSA9IGNvbnRleHQub3B0aW9uLnRpbWV6b25lcykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgY29uc3Qgc3VmZml4ID0gY29udGV4dC50ZXh0LnN1YnN0cmluZyhyZXN1bHQuaW5kZXggKyByZXN1bHQudGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBUSU1FWk9ORV9OQU1FX1BBVFRFUk4uZXhlYyhzdWZmaXgpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRpbWV6b25lQWJiciA9IG1hdGNoWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBleHRyYWN0ZWRUaW1lem9uZU9mZnNldCA9IChfYiA9IChfYSA9IHRpbWV6b25lT3ZlcnJpZGVzW3RpbWV6b25lQWJicl0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRoaXMudGltZXpvbmVbdGltZXpvbmVBYmJyXSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChleHRyYWN0ZWRUaW1lem9uZU9mZnNldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFeHRyYWN0aW5nIHRpbWV6b25lOiAnJHt0aW1lem9uZUFiYnJ9JyBpbnRvIDogJHtleHRyYWN0ZWRUaW1lem9uZU9mZnNldH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbWV6b25lT2Zmc2V0ID0gcmVzdWx0LnN0YXJ0LmdldChcInRpbWV6b25lT2Zmc2V0XCIpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lem9uZU9mZnNldCAhPT0gbnVsbCAmJiBleHRyYWN0ZWRUaW1lem9uZU9mZnNldCAhPSBjdXJyZW50VGltZXpvbmVPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQudGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0LnN0YXJ0LmlzQ2VydGFpbihcInRpbWV6b25lT2Zmc2V0XCIpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInRpbWV6b25lT2Zmc2V0XCIsIGV4dHJhY3RlZFRpbWV6b25lT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQuZW5kICE9IG51bGwgJiYgIXJlc3VsdC5lbmQuaXNDZXJ0YWluKFwidGltZXpvbmVPZmZzZXRcIikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcInRpbWV6b25lT2Zmc2V0XCIsIGV4dHJhY3RlZFRpbWV6b25lT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEV4dHJhY3RUaW1lem9uZUFiYnJSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBUSU1FWk9ORV9PRkZTRVRfUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCJeXFxcXHMqKD86KD86R01UfFVUQylcXFxccz8pPyhbKy1dKShcXFxcZHsxLDJ9KSg/Ojo/KFxcXFxkezJ9KSk/XCIsIFwiaVwiKTtcbmNvbnN0IFRJTUVaT05FX09GRlNFVF9TSUdOX0dST1VQID0gMTtcbmNvbnN0IFRJTUVaT05FX09GRlNFVF9IT1VSX09GRlNFVF9HUk9VUCA9IDI7XG5jb25zdCBUSU1FWk9ORV9PRkZTRVRfTUlOVVRFX09GRlNFVF9HUk9VUCA9IDM7XG5jbGFzcyBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJ0aW1lem9uZU9mZnNldFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN1ZmZpeCA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcocmVzdWx0LmluZGV4ICsgcmVzdWx0LnRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gVElNRVpPTkVfT0ZGU0VUX1BBVFRFUk4uZXhlYyhzdWZmaXgpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFeHRyYWN0aW5nIHRpbWV6b25lOiAnJHttYXRjaFswXX0nIGludG8gOiAke3Jlc3VsdH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaG91ck9mZnNldCA9IHBhcnNlSW50KG1hdGNoW1RJTUVaT05FX09GRlNFVF9IT1VSX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgY29uc3QgbWludXRlT2Zmc2V0ID0gcGFyc2VJbnQobWF0Y2hbVElNRVpPTkVfT0ZGU0VUX01JTlVURV9PRkZTRVRfR1JPVVBdIHx8IFwiMFwiKTtcbiAgICAgICAgICAgIGxldCB0aW1lem9uZU9mZnNldCA9IGhvdXJPZmZzZXQgKiA2MCArIG1pbnV0ZU9mZnNldDtcbiAgICAgICAgICAgIGlmIChtYXRjaFtUSU1FWk9ORV9PRkZTRVRfU0lHTl9HUk9VUF0gPT09IFwiLVwiKSB7XG4gICAgICAgICAgICAgICAgdGltZXpvbmVPZmZzZXQgPSAtdGltZXpvbmVPZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0LmVuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmVuZC5hc3NpZ24oXCJ0aW1lem9uZU9mZnNldFwiLCB0aW1lem9uZU9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwidGltZXpvbmVPZmZzZXRcIiwgdGltZXpvbmVPZmZzZXQpO1xuICAgICAgICAgICAgcmVzdWx0LnRleHQgKz0gbWF0Y2hbMF07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBPdmVybGFwUmVtb3ZhbFJlZmluZXIge1xuICAgIHJlZmluZShjb250ZXh0LCByZXN1bHRzKSB7XG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkUmVzdWx0cyA9IFtdO1xuICAgICAgICBsZXQgcHJldlJlc3VsdCA9IHJlc3VsdHNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaW5kZXggPCBwcmV2UmVzdWx0LmluZGV4ICsgcHJldlJlc3VsdC50ZXh0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQudGV4dC5sZW5ndGggPiBwcmV2UmVzdWx0LnRleHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyZWRSZXN1bHRzLnB1c2gocHJldlJlc3VsdCk7XG4gICAgICAgICAgICAgICAgcHJldlJlc3VsdCA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldlJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFJlc3VsdHMucHVzaChwcmV2UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWRSZXN1bHRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE92ZXJsYXBSZW1vdmFsUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY2xhc3MgRm9yd2FyZERhdGVSZWZpbmVyIHtcbiAgICByZWZpbmUoY29udGV4dCwgcmVzdWx0cykge1xuICAgICAgICBpZiAoIWNvbnRleHQub3B0aW9uLmZvcndhcmREYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IHJlZk1vbWVudCA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc09ubHlEYXlNb250aENvbXBvbmVudCgpICYmIHJlZk1vbWVudC5pc0FmdGVyKHJlc3VsdC5zdGFydC5kYXlqcygpKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMyAmJiByZWZNb21lbnQuaXNBZnRlcihyZXN1bHQuc3RhcnQuZGF5anMoKSk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQuaW1wbHkoXCJ5ZWFyXCIsIHJlc3VsdC5zdGFydC5nZXQoXCJ5ZWFyXCIpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgeWVhcmx5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LnN0YXJ0fSlgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZW5kICYmICFyZXN1bHQuZW5kLmlzQ2VydGFpbihcInllYXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJ5ZWFyXCIsIHJlc3VsdC5lbmQuZ2V0KFwieWVhclwiKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgeWVhcmx5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhcnQuaXNPbmx5V2Vla2RheUNvbXBvbmVudCgpICYmIHJlZk1vbWVudC5pc0FmdGVyKHJlc3VsdC5zdGFydC5kYXlqcygpKSkge1xuICAgICAgICAgICAgICAgIGlmIChyZWZNb21lbnQuZGF5KCkgPiByZXN1bHQuc3RhcnQuZ2V0KFwid2Vla2RheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpICsgNyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwiZGF5XCIsIHJlZk1vbWVudC5kYXRlKCkpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcIm1vbnRoXCIsIHJlZk1vbWVudC5tb250aCgpICsgMSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCByZWZNb21lbnQueWVhcigpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEZvcndhcmQgd2Vla2x5IGFkanVzdGVkIGZvciAke3Jlc3VsdH0gKCR7cmVzdWx0LnN0YXJ0fSlgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVuZCAmJiByZXN1bHQuZW5kLmlzT25seVdlZWtkYXlDb21wb25lbnQoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVmTW9tZW50LmRheSgpID4gcmVzdWx0LmVuZC5nZXQoXCJ3ZWVrZGF5XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZNb21lbnQgPSByZWZNb21lbnQuZGF5KHJlc3VsdC5lbmQuZ2V0KFwid2Vla2RheVwiKSArIDcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVmTW9tZW50ID0gcmVmTW9tZW50LmRheShyZXN1bHQuZW5kLmdldChcIndlZWtkYXlcIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJkYXlcIiwgcmVmTW9tZW50LmRhdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQuaW1wbHkoXCJtb250aFwiLCByZWZNb21lbnQubW9udGgoKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZW5kLmltcGx5KFwieWVhclwiLCByZWZNb21lbnQueWVhcigpKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRm9yd2FyZCB3ZWVrbHkgYWRqdXN0ZWQgZm9yICR7cmVzdWx0fSAoJHtyZXN1bHQuZW5kfSlgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRm9yd2FyZERhdGVSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhYnN0cmFjdFJlZmluZXJzXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3RSZWZpbmVyc1wiKTtcbmNsYXNzIFVubGlrZWx5Rm9ybWF0RmlsdGVyIGV4dGVuZHMgYWJzdHJhY3RSZWZpbmVyc18xLkZpbHRlciB7XG4gICAgY29uc3RydWN0b3Ioc3RyaWN0TW9kZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0cmljdE1vZGUgPSBzdHJpY3RNb2RlO1xuICAgIH1cbiAgICBpc1ZhbGlkKGNvbnRleHQsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnRleHQucmVwbGFjZShcIiBcIiwgXCJcIikubWF0Y2goL15cXGQqKFxcLlxcZCopPyQvKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlbW92aW5nIHVubGlrZWx5IHJlc3VsdCAnJHtyZXN1bHQudGV4dH0nYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3VsdC5zdGFydC5pc1ZhbGlkRGF0ZSgpKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlYnVnKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZpbmcgaW52YWxpZCByZXN1bHQ6ICR7cmVzdWx0fSAoJHtyZXN1bHQuc3RhcnR9KWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5lbmQgJiYgIXJlc3VsdC5lbmQuaXNWYWxpZERhdGUoKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlbW92aW5nIGludmFsaWQgcmVzdWx0OiAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdHJpY3RNb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc1N0cmljdE1vZGVWYWxpZChjb250ZXh0LCByZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpc1N0cmljdE1vZGVWYWxpZChjb250ZXh0LCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdGFydC5pc09ubHlXZWVrZGF5Q29tcG9uZW50KCkpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVidWcoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAoU3RyaWN0KSBSZW1vdmluZyB3ZWVrZGF5IG9ubHkgY29tcG9uZW50OiAke3Jlc3VsdH0gKCR7cmVzdWx0LmVuZH0pYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LnN0YXJ0LmlzT25seVRpbWUoKSAmJiAoIXJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJob3VyXCIpIHx8ICFyZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwibWludXRlXCIpKSkge1xuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYChTdHJpY3QpIFJlbW92aW5nIHVuY2VydGFpbiB0aW1lIGNvbXBvbmVudDogJHtyZXN1bHR9ICgke3Jlc3VsdC5lbmR9KWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVW5saWtlbHlGb3JtYXRGaWx0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4vQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoWzAtOV17NH0pXFxcXC0oWzAtOV17MSwyfSlcXFxcLShbMC05XXsxLDJ9KVwiICtcbiAgICBcIig/OlRcIiArXG4gICAgXCIoWzAtOV17MSwyfSk6KFswLTldezEsMn0pXCIgK1xuICAgIFwiKD86XCIgK1xuICAgIFwiOihbMC05XXsxLDJ9KSg/OlxcXFwuKFxcXFxkezEsNH0pKT9cIiArXG4gICAgXCIpP1wiICtcbiAgICBcIig/OlwiICtcbiAgICBcIlp8KFsrLV1cXFxcZHsyfSk6PyhcXFxcZHsyfSk/XCIgK1xuICAgIFwiKT9cIiArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFlFQVJfTlVNQkVSX0dST1VQID0gMTtcbmNvbnN0IE1PTlRIX05VTUJFUl9HUk9VUCA9IDI7XG5jb25zdCBEQVRFX05VTUJFUl9HUk9VUCA9IDM7XG5jb25zdCBIT1VSX05VTUJFUl9HUk9VUCA9IDQ7XG5jb25zdCBNSU5VVEVfTlVNQkVSX0dST1VQID0gNTtcbmNvbnN0IFNFQ09ORF9OVU1CRVJfR1JPVVAgPSA2O1xuY29uc3QgTUlMTElTRUNPTkRfTlVNQkVSX0dST1VQID0gNztcbmNvbnN0IFRaRF9IT1VSX09GRlNFVF9HUk9VUCA9IDg7XG5jb25zdCBUWkRfTUlOVVRFX09GRlNFVF9HUk9VUCA9IDk7XG5jbGFzcyBJU09Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSB7fTtcbiAgICAgICAgY29tcG9uZW50c1tcInllYXJcIl0gPSBwYXJzZUludChtYXRjaFtZRUFSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICBjb21wb25lbnRzW1wibW9udGhcIl0gPSBwYXJzZUludChtYXRjaFtNT05USF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgY29tcG9uZW50c1tcImRheVwiXSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfTlVNQkVSX0dST1VQXSk7XG4gICAgICAgIGlmIChtYXRjaFtIT1VSX05VTUJFUl9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcG9uZW50c1tcImhvdXJcIl0gPSBwYXJzZUludChtYXRjaFtIT1VSX05VTUJFUl9HUk9VUF0pO1xuICAgICAgICAgICAgY29tcG9uZW50c1tcIm1pbnV0ZVwiXSA9IHBhcnNlSW50KG1hdGNoW01JTlVURV9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIGlmIChtYXRjaFtTRUNPTkRfTlVNQkVSX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50c1tcInNlY29uZFwiXSA9IHBhcnNlSW50KG1hdGNoW1NFQ09ORF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFtNSUxMSVNFQ09ORF9OVU1CRVJfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1wibWlsbGlzZWNvbmRcIl0gPSBwYXJzZUludChtYXRjaFtNSUxMSVNFQ09ORF9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFtUWkRfSE9VUl9PRkZTRVRfR1JPVVBdID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1widGltZXpvbmVPZmZzZXRcIl0gPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaG91ck9mZnNldCA9IHBhcnNlSW50KG1hdGNoW1RaRF9IT1VSX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgICAgIGxldCBtaW51dGVPZmZzZXQgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFtUWkRfTUlOVVRFX09GRlNFVF9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBtaW51dGVPZmZzZXQgPSBwYXJzZUludChtYXRjaFtUWkRfTUlOVVRFX09GRlNFVF9HUk9VUF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0ID0gaG91ck9mZnNldCAqIDYwO1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCAtPSBtaW51dGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgKz0gbWludXRlT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21wb25lbnRzW1widGltZXpvbmVPZmZzZXRcIl0gPSBvZmZzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gSVNPRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhYnN0cmFjdFJlZmluZXJzXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3RSZWZpbmVyc1wiKTtcbmNsYXNzIE1lcmdlV2Vla2RheUNvbXBvbmVudFJlZmluZXIgZXh0ZW5kcyBhYnN0cmFjdFJlZmluZXJzXzEuTWVyZ2luZ1JlZmluZXIge1xuICAgIG1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCBuZXdSZXN1bHQgPSBuZXh0UmVzdWx0LmNsb25lKCk7XG4gICAgICAgIG5ld1Jlc3VsdC5pbmRleCA9IGN1cnJlbnRSZXN1bHQuaW5kZXg7XG4gICAgICAgIG5ld1Jlc3VsdC50ZXh0ID0gY3VycmVudFJlc3VsdC50ZXh0ICsgdGV4dEJldHdlZW4gKyBuZXdSZXN1bHQudGV4dDtcbiAgICAgICAgbmV3UmVzdWx0LnN0YXJ0LmFzc2lnbihcIndlZWtkYXlcIiwgY3VycmVudFJlc3VsdC5zdGFydC5nZXQoXCJ3ZWVrZGF5XCIpKTtcbiAgICAgICAgaWYgKG5ld1Jlc3VsdC5lbmQpIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdC5lbmQuYXNzaWduKFwid2Vla2RheVwiLCBjdXJyZW50UmVzdWx0LnN0YXJ0LmdldChcIndlZWtkYXlcIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdSZXN1bHQ7XG4gICAgfVxuICAgIHNob3VsZE1lcmdlUmVzdWx0cyh0ZXh0QmV0d2VlbiwgY3VycmVudFJlc3VsdCwgbmV4dFJlc3VsdCkge1xuICAgICAgICBjb25zdCB3ZWVrZGF5VGhlbk5vcm1hbERhdGUgPSBjdXJyZW50UmVzdWx0LnN0YXJ0LmlzT25seVdlZWtkYXlDb21wb25lbnQoKSAmJlxuICAgICAgICAgICAgIWN1cnJlbnRSZXN1bHQuc3RhcnQuaXNDZXJ0YWluKFwiaG91clwiKSAmJlxuICAgICAgICAgICAgbmV4dFJlc3VsdC5zdGFydC5pc0NlcnRhaW4oXCJkYXlcIik7XG4gICAgICAgIHJldHVybiB3ZWVrZGF5VGhlbk5vcm1hbERhdGUgJiYgdGV4dEJldHdlZW4ubWF0Y2goL14sP1xccyokLykgIT0gbnVsbDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBNZXJnZVdlZWtkYXlDb21wb25lbnRSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uID0gdm9pZCAwO1xuY29uc3QgRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb21tb24vcmVmaW5lcnMvRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXJcIikpO1xuY29uc3QgRXh0cmFjdFRpbWV6b25lT2Zmc2V0UmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9FeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyXCIpKTtcbmNvbnN0IE92ZXJsYXBSZW1vdmFsUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9PdmVybGFwUmVtb3ZhbFJlZmluZXJcIikpO1xuY29uc3QgRm9yd2FyZERhdGVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29tbW9uL3JlZmluZXJzL0ZvcndhcmREYXRlUmVmaW5lclwiKSk7XG5jb25zdCBVbmxpa2VseUZvcm1hdEZpbHRlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9Vbmxpa2VseUZvcm1hdEZpbHRlclwiKSk7XG5jb25zdCBJU09Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb21tb24vcGFyc2Vycy9JU09Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgTWVyZ2VXZWVrZGF5Q29tcG9uZW50UmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvbW1vbi9yZWZpbmVycy9NZXJnZVdlZWtkYXlDb21wb25lbnRSZWZpbmVyXCIpKTtcbmZ1bmN0aW9uIGluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24sIHN0cmljdE1vZGUgPSBmYWxzZSkge1xuICAgIGNvbmZpZ3VyYXRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBJU09Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIGNvbmZpZ3VyYXRpb24ucmVmaW5lcnMudW5zaGlmdChuZXcgTWVyZ2VXZWVrZGF5Q29tcG9uZW50UmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy51bnNoaWZ0KG5ldyBFeHRyYWN0VGltZXpvbmVBYmJyUmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy51bnNoaWZ0KG5ldyBFeHRyYWN0VGltZXpvbmVPZmZzZXRSZWZpbmVyXzEuZGVmYXVsdCgpKTtcbiAgICBjb25maWd1cmF0aW9uLnJlZmluZXJzLnVuc2hpZnQobmV3IE92ZXJsYXBSZW1vdmFsUmVmaW5lcl8xLmRlZmF1bHQoKSk7XG4gICAgY29uZmlndXJhdGlvbi5yZWZpbmVycy5wdXNoKG5ldyBPdmVybGFwUmVtb3ZhbFJlZmluZXJfMS5kZWZhdWx0KCkpO1xuICAgIGNvbmZpZ3VyYXRpb24ucmVmaW5lcnMucHVzaChuZXcgRm9yd2FyZERhdGVSZWZpbmVyXzEuZGVmYXVsdCgpKTtcbiAgICBjb25maWd1cmF0aW9uLnJlZmluZXJzLnB1c2gobmV3IFVubGlrZWx5Rm9ybWF0RmlsdGVyXzEuZGVmYXVsdChzdHJpY3RNb2RlKSk7XG4gICAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG59XG5leHBvcnRzLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uID0gaW5jbHVkZUNvbW1vbkNvbmZpZ3VyYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudG9uaWdodCA9IGV4cG9ydHMudG9tb3Jyb3cgPSBleHBvcnRzLnllc3RlcmRheSA9IGV4cG9ydHMudG9kYXkgPSBleHBvcnRzLm5vdyA9IHZvaWQgMDtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi9yZXN1bHRzXCIpO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY29uc3QgZGF5anNfMiA9IHJlcXVpcmUoXCIuLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vaW5kZXhcIik7XG5mdW5jdGlvbiBub3cocmVmRGF0ZSkge1xuICAgIGNvbnN0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cyhyZWZEYXRlLCB7fSk7XG4gICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgIGRheWpzXzIuYXNzaWduU2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZXhwb3J0cy5ub3cgPSBub3c7XG5mdW5jdGlvbiB0b2RheShyZWZEYXRlKSB7XG4gICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgcmVzdWx0c18xLlBhcnNpbmdDb21wb25lbnRzKHJlZkRhdGUsIHt9KTtcbiAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgZGF5anNfMi5pbXBseVNpbWlsYXJUaW1lKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmV4cG9ydHMudG9kYXkgPSB0b2RheTtcbmZ1bmN0aW9uIHllc3RlcmRheShyZWZEYXRlKSB7XG4gICAgbGV0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cyhyZWZEYXRlLCB7fSk7XG4gICAgdGFyZ2V0RGF0ZSA9IHRhcmdldERhdGUuYWRkKC0xLCBcImRheVwiKTtcbiAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgZGF5anNfMi5pbXBseVNpbWlsYXJUaW1lKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmV4cG9ydHMueWVzdGVyZGF5ID0geWVzdGVyZGF5O1xuZnVuY3Rpb24gdG9tb3Jyb3cocmVmRGF0ZSkge1xuICAgIGNvbnN0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgY29uc3QgY29tcG9uZW50ID0gbmV3IHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cyhyZWZEYXRlLCB7fSk7XG4gICAgZGF5anNfMi5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmV4cG9ydHMudG9tb3Jyb3cgPSB0b21vcnJvdztcbmZ1bmN0aW9uIHRvbmlnaHQocmVmRGF0ZSwgaW1wbHlIb3VyID0gMjIpIHtcbiAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KHJlZkRhdGUpO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IG5ldyByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMocmVmRGF0ZSwge30pO1xuICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgaW1wbHlIb3VyKTtcbiAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn1cbmV4cG9ydHMudG9uaWdodCA9IHRvbmlnaHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgZGF5anNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IHJlZmVyZW5jZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzXCIpKTtcbmNvbnN0IFBBVFRFUk4gPSAvKG5vd3x0b2RheXx0b25pZ2h0fHRvbW9ycm93fHRtcnx5ZXN0ZXJkYXl8bGFzdFxccypuaWdodCkoPz1cXFd8JCkvaTtcbmNsYXNzIEVOQ2FzdWFsRGF0ZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGxldCB0YXJnZXREYXRlID0gZGF5anNfMS5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGxvd2VyVGV4dCA9IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgc3dpdGNoIChsb3dlclRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJub3dcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy5ub3coY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJ0b2RheVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwieWVzdGVyZGF5XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMueWVzdGVyZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwidG9tb3Jyb3dcIjpcbiAgICAgICAgICAgIGNhc2UgXCJ0bXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy50b21vcnJvdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcInRvbmlnaHRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy50b25pZ2h0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmIChsb3dlclRleHQubWF0Y2goL2xhc3RcXHMqbmlnaHQvKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0RGF0ZS5ob3VyKCkgPiA2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoLTEsIFwiZGF5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTkNhc3VhbERhdGVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgUEFUVEVSTiA9IC8oPzp0aGlzKT9cXHMqKG1vcm5pbmd8YWZ0ZXJub29ufGV2ZW5pbmd8bmlnaHR8bWlkbmlnaHR8bm9vbikoPz1cXFd8JCkvaTtcbmNsYXNzIEVOQ2FzdWFsVGltZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAobWF0Y2hbMV0udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgY2FzZSBcImFmdGVybm9vblwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImV2ZW5pbmdcIjpcbiAgICAgICAgICAgIGNhc2UgXCJuaWdodFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pZG5pZ2h0XCI6XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1vcm5pbmdcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm5vb25cIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVOQ2FzdWFsVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50b0RheUpTQ2xvc2VzdFdlZWtkYXkgPSBleHBvcnRzLnRvRGF5SlNXZWVrZGF5ID0gdm9pZCAwO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuZnVuY3Rpb24gdG9EYXlKU1dlZWtkYXkocmVmRGF0ZSwgb2Zmc2V0LCBtb2RpZmllcikge1xuICAgIGlmICghbW9kaWZpZXIpIHtcbiAgICAgICAgcmV0dXJuIHRvRGF5SlNDbG9zZXN0V2Vla2RheShyZWZEYXRlLCBvZmZzZXQpO1xuICAgIH1cbiAgICBsZXQgZGF0ZSA9IGRheWpzXzEuZGVmYXVsdChyZWZEYXRlKTtcbiAgICBzd2l0Y2ggKG1vZGlmaWVyKSB7XG4gICAgICAgIGNhc2UgXCJ0aGlzXCI6XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5kYXkob2Zmc2V0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV4dFwiOlxuICAgICAgICAgICAgZGF0ZSA9IGRhdGUuZGF5KG9mZnNldCArIDcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJsYXN0XCI6XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5kYXkob2Zmc2V0IC0gNyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRhdGU7XG59XG5leHBvcnRzLnRvRGF5SlNXZWVrZGF5ID0gdG9EYXlKU1dlZWtkYXk7XG5mdW5jdGlvbiB0b0RheUpTQ2xvc2VzdFdlZWtkYXkocmVmRGF0ZSwgb2Zmc2V0KSB7XG4gICAgbGV0IGRhdGUgPSBkYXlqc18xLmRlZmF1bHQocmVmRGF0ZSk7XG4gICAgY29uc3QgcmVmT2Zmc2V0ID0gZGF0ZS5kYXkoKTtcbiAgICBpZiAoTWF0aC5hYnMob2Zmc2V0IC0gNyAtIHJlZk9mZnNldCkgPCBNYXRoLmFicyhvZmZzZXQgLSByZWZPZmZzZXQpKSB7XG4gICAgICAgIGRhdGUgPSBkYXRlLmRheShvZmZzZXQgLSA3KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoTWF0aC5hYnMob2Zmc2V0ICsgNyAtIHJlZk9mZnNldCkgPCBNYXRoLmFicyhvZmZzZXQgLSByZWZPZmZzZXQpKSB7XG4gICAgICAgIGRhdGUgPSBkYXRlLmRheShvZmZzZXQgKyA3KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRhdGUgPSBkYXRlLmRheShvZmZzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZTtcbn1cbmV4cG9ydHMudG9EYXlKU0Nsb3Nlc3RXZWVrZGF5ID0gdG9EYXlKU0Nsb3Nlc3RXZWVrZGF5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHdlZWtzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24vd2Vla3NcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Oig/OlxcXFwsfFxcXFwofFxcXFzvvIgpXFxcXHMqKT9cIiArXG4gICAgXCIoPzpvblxcXFxzKj8pP1wiICtcbiAgICBcIig/Oih0aGlzfGxhc3R8cGFzdHxuZXh0KVxcXFxzKik/XCIgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWSl9KWAgK1xuICAgIFwiKD86XFxcXHMqKD86XFxcXCx8XFxcXCl8XFxcXO+8iSkpP1wiICtcbiAgICBcIig/OlxcXFxzKih0aGlzfGxhc3R8cGFzdHxuZXh0KVxcXFxzKndlZWspP1wiICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFBSRUZJWF9HUk9VUCA9IDE7XG5jb25zdCBXRUVLREFZX0dST1VQID0gMjtcbmNvbnN0IFBPU1RGSVhfR1JPVVAgPSAzO1xuY2xhc3MgRU5XZWVrZGF5UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBtYXRjaFtXRUVLREFZX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUllbZGF5T2ZXZWVrXTtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gbWF0Y2hbUFJFRklYX0dST1VQXTtcbiAgICAgICAgY29uc3QgcG9zdGZpeCA9IG1hdGNoW1BPU1RGSVhfR1JPVVBdO1xuICAgICAgICBsZXQgbW9kaWZpZXJXb3JkID0gcHJlZml4IHx8IHBvc3RmaXg7XG4gICAgICAgIG1vZGlmaWVyV29yZCA9IG1vZGlmaWVyV29yZCB8fCBcIlwiO1xuICAgICAgICBtb2RpZmllcldvcmQgPSBtb2RpZmllcldvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IG1vZGlmaWVyID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZGlmaWVyV29yZCA9PSBcImxhc3RcIiB8fCBtb2RpZmllcldvcmQgPT0gXCJwYXN0XCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJsYXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW9kaWZpZXJXb3JkID09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibmV4dFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vZGlmaWVyV29yZCA9PSBcInRoaXNcIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcInRoaXNcIjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRlID0gd2Vla3NfMS50b0RheUpTV2Vla2RheShjb250ZXh0LnJlZkRhdGUsIG9mZnNldCwgbW9kaWZpZXIpO1xuICAgICAgICByZXR1cm4gY29udGV4dFxuICAgICAgICAgICAgLmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKClcbiAgICAgICAgICAgIC5hc3NpZ24oXCJ3ZWVrZGF5XCIsIG9mZnNldClcbiAgICAgICAgICAgIC5pbXBseShcImRheVwiLCBkYXRlLmRhdGUoKSlcbiAgICAgICAgICAgIC5pbXBseShcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpXG4gICAgICAgICAgICAuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTldlZWtkYXlQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChgKHRoaXN8bmV4dHxsYXN0fHBhc3QpXFxcXHMqKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5USU1FX1VOSVRfRElDVElPTkFSWSl9KSg/PVxcXFxzKilgICsgXCIoPz1cXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBNT0RJRklFUl9XT1JEX0dST1VQID0gMTtcbmNvbnN0IFJFTEFUSVZFX1dPUkRfR1JPVVAgPSAyO1xuY2xhc3MgRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVyID0gbWF0Y2hbTU9ESUZJRVJfV09SRF9HUk9VUF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgdW5pdFdvcmQgPSBtYXRjaFtSRUxBVElWRV9XT1JEX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCB0aW1ldW5pdCA9IGNvbnN0YW50c18xLlRJTUVfVU5JVF9ESUNUSU9OQVJZW3VuaXRXb3JkXTtcbiAgICAgICAgaWYgKG1vZGlmaWVyID09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lVW5pdHMgPSB7fTtcbiAgICAgICAgICAgIHRpbWVVbml0c1t0aW1ldW5pdF0gPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9kaWZpZXIgPT0gXCJsYXN0XCIgfHwgbW9kaWZpZXIgPT0gXCJwYXN0XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IHt9O1xuICAgICAgICAgICAgdGltZVVuaXRzW3RpbWV1bml0XSA9IC0xO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBsZXQgZGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBpZiAodW5pdFdvcmQubWF0Y2goL3dlZWsvaSkpIHtcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmFkZCgtZGF0ZS5nZXQoXCJkXCIpLCBcImRcIik7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJ5ZWFyXCIsIGRhdGUueWVhcigpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1bml0V29yZC5tYXRjaCgvbW9udGgvaSkpIHtcbiAgICAgICAgICAgIGRhdGUgPSBkYXRlLmFkZCgtZGF0ZS5kYXRlKCkgKyAxLCBcImRcIik7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1vbnRoXCIsIGRhdGUubW9udGgoKSArIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVuaXRXb3JkLm1hdGNoKC95ZWFyL2kpKSB7XG4gICAgICAgICAgICBkYXRlID0gZGF0ZS5hZGQoLWRhdGUuZGF0ZSgpICsgMSwgXCJkXCIpO1xuICAgICAgICAgICAgZGF0ZSA9IGRhdGUuYWRkKC1kYXRlLm1vbnRoKCksIFwibW9udGhcIik7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGFyc2luZ0NvbnRleHQgPSBleHBvcnRzLkNocm9ubyA9IHZvaWQgMDtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuL3Jlc3VsdHNcIik7XG5jb25zdCBlbl8xID0gcmVxdWlyZShcIi4vbG9jYWxlcy9lblwiKTtcbmNsYXNzIENocm9ubyB7XG4gICAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgICAgICBjb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB8fCBlbl8xLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oKTtcbiAgICAgICAgdGhpcy5wYXJzZXJzID0gWy4uLmNvbmZpZ3VyYXRpb24ucGFyc2Vyc107XG4gICAgICAgIHRoaXMucmVmaW5lcnMgPSBbLi4uY29uZmlndXJhdGlvbi5yZWZpbmVyc107XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IENocm9ubyh7XG4gICAgICAgICAgICBwYXJzZXJzOiBbLi4udGhpcy5wYXJzZXJzXSxcbiAgICAgICAgICAgIHJlZmluZXJzOiBbLi4udGhpcy5yZWZpbmVyc10sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwYXJzZURhdGUodGV4dCwgcmVmZXJlbmNlRGF0ZSwgb3B0aW9uKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLnBhcnNlKHRleHQsIHJlZmVyZW5jZURhdGUsIG9wdGlvbik7XG4gICAgICAgIHJldHVybiByZXN1bHRzLmxlbmd0aCA+IDAgPyByZXN1bHRzWzBdLnN0YXJ0LmRhdGUoKSA6IG51bGw7XG4gICAgfVxuICAgIHBhcnNlKHRleHQsIHJlZmVyZW5jZURhdGUsIG9wdGlvbikge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gbmV3IFBhcnNpbmdDb250ZXh0KHRleHQsIHJlZmVyZW5jZURhdGUgfHwgbmV3IERhdGUoKSwgb3B0aW9uIHx8IHt9KTtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJzZXJzLmZvckVhY2goKHBhcnNlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkUmVzdWx0cyA9IENocm9uby5leGVjdXRlUGFyc2VyKGNvbnRleHQsIHBhcnNlcik7XG4gICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5jb25jYXQocGFyc2VkUmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXN1bHRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVmaW5lcnMuZm9yRWFjaChmdW5jdGlvbiAocmVmaW5lcikge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlZmluZXIucmVmaW5lKGNvbnRleHQsIHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICAgIHN0YXRpYyBleGVjdXRlUGFyc2VyKGNvbnRleHQsIHBhcnNlcikge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSBwYXJzZXIucGF0dGVybihjb250ZXh0KTtcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxUZXh0ID0gY29udGV4dC50ZXh0O1xuICAgICAgICBsZXQgcmVtYWluaW5nVGV4dCA9IGNvbnRleHQudGV4dDtcbiAgICAgICAgbGV0IG1hdGNoID0gcGF0dGVybi5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbWF0Y2guaW5kZXggKyBvcmlnaW5hbFRleHQubGVuZ3RoIC0gcmVtYWluaW5nVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VyLmV4dHJhY3QoY29udGV4dCwgbWF0Y2gpO1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZW1haW5pbmdUZXh0ID0gb3JpZ2luYWxUZXh0LnN1YnN0cmluZyhtYXRjaC5pbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBhcnNlZFJlc3VsdCA9IG51bGw7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgcmVzdWx0c18xLlBhcnNpbmdSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHMpIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRSZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdKTtcbiAgICAgICAgICAgICAgICBwYXJzZWRSZXN1bHQuc3RhcnQgPSByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRSZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdLCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGV4dC5kZWJ1ZygoKSA9PiBjb25zb2xlLmxvZyhgJHtwYXJzZXIuY29uc3RydWN0b3IubmFtZX0gZXh0cmFjdGVkIHJlc3VsdCAke3BhcnNlZFJlc3VsdH1gKSk7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gocGFyc2VkUmVzdWx0KTtcbiAgICAgICAgICAgIHJlbWFpbmluZ1RleHQgPSBvcmlnaW5hbFRleHQuc3Vic3RyaW5nKGluZGV4ICsgcGFyc2VkUmVzdWx0LnRleHQubGVuZ3RoKTtcbiAgICAgICAgICAgIG1hdGNoID0gcGF0dGVybi5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn1cbmV4cG9ydHMuQ2hyb25vID0gQ2hyb25vO1xuY2xhc3MgUGFyc2luZ0NvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRleHQsIHJlZkRhdGUsIG9wdGlvbikge1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnJlZkRhdGUgPSByZWZEYXRlO1xuICAgICAgICB0aGlzLm9wdGlvbiA9IG9wdGlvbjtcbiAgICB9XG4gICAgY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoY29tcG9uZW50cykge1xuICAgICAgICBpZiAoY29tcG9uZW50cyBpbnN0YW5jZW9mIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyByZXN1bHRzXzEuUGFyc2luZ0NvbXBvbmVudHModGhpcy5yZWZEYXRlLCBjb21wb25lbnRzKTtcbiAgICB9XG4gICAgY3JlYXRlUGFyc2luZ1Jlc3VsdChpbmRleCwgdGV4dE9yRW5kSW5kZXgsIHN0YXJ0Q29tcG9uZW50cywgZW5kQ29tcG9uZW50cykge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdHlwZW9mIHRleHRPckVuZEluZGV4ID09PSBcInN0cmluZ1wiID8gdGV4dE9yRW5kSW5kZXggOiB0aGlzLnRleHQuc3Vic3RyaW5nKGluZGV4LCB0ZXh0T3JFbmRJbmRleCk7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gc3RhcnRDb21wb25lbnRzID8gdGhpcy5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cyhzdGFydENvbXBvbmVudHMpIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kID0gZW5kQ29tcG9uZW50cyA/IHRoaXMuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoZW5kQ29tcG9uZW50cykgOiBudWxsO1xuICAgICAgICByZXR1cm4gbmV3IHJlc3VsdHNfMS5QYXJzaW5nUmVzdWx0KHRoaXMucmVmRGF0ZSwgaW5kZXgsIHRleHQsIHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgICBkZWJ1ZyhibG9jaykge1xuICAgICAgICBpZiAodGhpcy5vcHRpb24uZGVidWcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbi5kZWJ1ZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb24uZGVidWcoYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMub3B0aW9uLmRlYnVnO1xuICAgICAgICAgICAgICAgIGhhbmRsZXIuZGVidWcoYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5QYXJzaW5nQ29udGV4dCA9IFBhcnNpbmdDb250ZXh0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoW15cXFxcZF18XilcIiArXG4gICAgXCIoWzAtM117MCwxfVswLTldezF9KVtcXFxcL1xcXFwuXFxcXC1dKFswLTNdezAsMX1bMC05XXsxfSlcIiArXG4gICAgXCIoPzpbXFxcXC9cXFxcLlxcXFwtXShbMC05XXs0fXxbMC05XXsyfSkpP1wiICtcbiAgICBcIihcXFxcV3wkKVwiLCBcImlcIik7XG5jb25zdCBPUEVOSU5HX0dST1VQID0gMTtcbmNvbnN0IEVORElOR19HUk9VUCA9IDU7XG5jb25zdCBGSVJTVF9OVU1CRVJTX0dST1VQID0gMjtcbmNvbnN0IFNFQ09ORF9OVU1CRVJTX0dST1VQID0gMztcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgU2xhc2hEYXRlRm9ybWF0UGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihsaXR0bGVFbmRpYW4pIHtcbiAgICAgICAgdGhpcy5ncm91cE51bWJlck1vbnRoID0gbGl0dGxlRW5kaWFuID8gU0VDT05EX05VTUJFUlNfR1JPVVAgOiBGSVJTVF9OVU1CRVJTX0dST1VQO1xuICAgICAgICB0aGlzLmdyb3VwTnVtYmVyRGF5ID0gbGl0dGxlRW5kaWFuID8gRklSU1RfTlVNQkVSU19HUk9VUCA6IFNFQ09ORF9OVU1CRVJTX0dST1VQO1xuICAgIH1cbiAgICBwYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgZXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBpZiAobWF0Y2hbT1BFTklOR19HUk9VUF0gPT0gXCIvXCIgfHwgbWF0Y2hbRU5ESU5HX0dST1VQXSA9PSBcIi9cIikge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbWF0Y2guaW5kZXggKyBtYXRjaFtPUEVOSU5HX0dST1VQXS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaFswXS5zdWJzdHIobWF0Y2hbT1BFTklOR19HUk9VUF0ubGVuZ3RoLCBtYXRjaFswXS5sZW5ndGggLSBtYXRjaFtPUEVOSU5HX0dST1VQXS5sZW5ndGggLSBtYXRjaFtFTkRJTkdfR1JPVVBdLmxlbmd0aCk7XG4gICAgICAgIGlmICh0ZXh0Lm1hdGNoKC9eXFxkXFwuXFxkJC8pIHx8IHRleHQubWF0Y2goL15cXGRcXC5cXGR7MSwyfVxcLlxcZHsxLDJ9XFxzKiQvKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWF0Y2hbWUVBUl9HUk9VUF0gJiYgbWF0Y2hbMF0uaW5kZXhPZihcIi9cIikgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nUmVzdWx0KGluZGV4LCB0ZXh0KTtcbiAgICAgICAgbGV0IG1vbnRoID0gcGFyc2VJbnQobWF0Y2hbdGhpcy5ncm91cE51bWJlck1vbnRoXSk7XG4gICAgICAgIGxldCBkYXkgPSBwYXJzZUludChtYXRjaFt0aGlzLmdyb3VwTnVtYmVyRGF5XSk7XG4gICAgICAgIGlmIChtb250aCA8IDEgfHwgbW9udGggPiAxMikge1xuICAgICAgICAgICAgaWYgKG1vbnRoID4gMTIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF5ID49IDEgJiYgZGF5IDw9IDEyICYmIG1vbnRoIDw9IDMxKSB7XG4gICAgICAgICAgICAgICAgICAgIFtkYXksIG1vbnRoXSA9IFttb250aCwgZGF5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5IDwgMSB8fCBkYXkgPiAzMSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImRheVwiLCBkYXkpO1xuICAgICAgICByZXN1bHQuc3RhcnQuYXNzaWduKFwibW9udGhcIiwgbW9udGgpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd1llYXJOdW1iZXIgPSBwYXJzZUludChtYXRjaFtZRUFSX0dST1VQXSk7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kTW9zdExpa2VseUFEWWVhcihyYXdZZWFyTnVtYmVyKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCBkYXksIG1vbnRoKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBTbGFzaERhdGVGb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgdGltZXVuaXRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvdGltZXVuaXRzXCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYCh0aGlzfGxhc3R8cGFzdHxuZXh0fFxcXFwrfC0pXFxcXHMqKCR7Y29uc3RhbnRzXzEuVElNRV9VTklUU19QQVRURVJOfSkoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNsYXNzIEVOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IHRpbWVVbml0cyA9IGNvbnN0YW50c18xLnBhcnNlVGltZVVuaXRzKG1hdGNoWzJdKTtcbiAgICAgICAgc3dpdGNoIChwcmVmaXgpIHtcbiAgICAgICAgICAgIGNhc2UgXCJsYXN0XCI6XG4gICAgICAgICAgICBjYXNlIFwicGFzdFwiOlxuICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgICB0aW1lVW5pdHMgPSB0aW1ldW5pdHNfMS5yZXZlcnNlVGltZVVuaXRzKHRpbWVVbml0cyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFTlRpbWVVbml0Q2FzdWFsUmVsYXRpdmVGb3JtYXRQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMucGFyc2VEYXRlID0gZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMuR0IgPSBleHBvcnRzLnN0cmljdCA9IGV4cG9ydHMuY2FzdWFsID0gdm9pZCAwO1xuY29uc3QgRU5UaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5UaW1lVW5pdFdpdGhpbkZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBFTk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5Nb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJcIikpO1xuY29uc3QgRU5Nb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0VOTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyXCIpKTtcbmNvbnN0IEVOTW9udGhOYW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTk1vbnRoTmFtZVBhcnNlclwiKSk7XG5jb25zdCBFTkNhc3VhbFllYXJNb250aERheVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5DYXN1YWxZZWFyTW9udGhEYXlQYXJzZXJcIikpO1xuY29uc3QgRU5TbGFzaE1vbnRoRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlNsYXNoTW9udGhGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRU5UaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5UaW1lRXhwcmVzc2lvblBhcnNlclwiKSk7XG5jb25zdCBFTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IEVOVGltZVVuaXRMYXRlckZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IEVOTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvRU5NZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY29uc3QgRU5NZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL0VOTWVyZ2VEYXRlVGltZVJlZmluZXJcIikpO1xuY29uc3QgY29uZmlndXJhdGlvbnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb25maWd1cmF0aW9uc1wiKTtcbmNvbnN0IEVOQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5DYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IEVOQ2FzdWFsVGltZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5DYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmNvbnN0IEVOV2Vla2RheVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5XZWVrZGF5UGFyc2VyXCIpKTtcbmNvbnN0IEVOUmVsYXRpdmVEYXRlRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9FTlJlbGF0aXZlRGF0ZUZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuLi8uLi9jaHJvbm9cIik7XG5jb25zdCBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vY29tbW9uL3BhcnNlcnMvU2xhc2hEYXRlRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IEVOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRU5UaW1lVW5pdENhc3VhbFJlbGF0aXZlRm9ybWF0UGFyc2VyXCIpKTtcbmV4cG9ydHMuY2FzdWFsID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKGZhbHNlKSk7XG5leHBvcnRzLnN0cmljdCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ29uZmlndXJhdGlvbih0cnVlLCBmYWxzZSkpO1xuZXhwb3J0cy5HQiA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ29uZmlndXJhdGlvbihmYWxzZSwgdHJ1ZSkpO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbmZ1bmN0aW9uIGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24obGl0dGxlRW5kaWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBvcHRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uKGZhbHNlLCBsaXR0bGVFbmRpYW4pO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEVOQ2FzdWFsRGF0ZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRU5DYXN1YWxUaW1lUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBFTk1vbnRoTmFtZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEVOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgcmV0dXJuIG9wdGlvbjtcbn1cbmV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb247XG5mdW5jdGlvbiBjcmVhdGVDb25maWd1cmF0aW9uKHN0cmljdE1vZGUgPSB0cnVlLCBsaXR0bGVFbmRpYW4gPSBmYWxzZSkge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uc18xLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICAgICAgbmV3IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQobGl0dGxlRW5kaWFuKSxcbiAgICAgICAgICAgIG5ldyBFTlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEVOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEVOTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEVOV2Vla2RheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBFTkNhc3VhbFllYXJNb250aERheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBFTlNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRU5UaW1lRXhwcmVzc2lvblBhcnNlcl8xLmRlZmF1bHQoc3RyaWN0TW9kZSksXG4gICAgICAgICAgICBuZXcgRU5UaW1lVW5pdEFnb0Zvcm1hdFBhcnNlcl8xLmRlZmF1bHQoc3RyaWN0TW9kZSksXG4gICAgICAgICAgICBuZXcgRU5UaW1lVW5pdExhdGVyRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChzdHJpY3RNb2RlKSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVmaW5lcnM6IFtuZXcgRU5NZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQoKSwgbmV3IEVOTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpXSxcbiAgICB9LCBzdHJpY3RNb2RlKTtcbn1cbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXCIpO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNsYXNzIERFVGltZUV4cHJlc3Npb25QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlciB7XG4gICAgcHJpbWFyeVByZWZpeCgpIHtcbiAgICAgICAgcmV0dXJuIFwiKD86KD86dW18dm9uKVxcXFxzKik/XCI7XG4gICAgfVxuICAgIGZvbGxvd2luZ1BoYXNlKCkge1xuICAgICAgICByZXR1cm4gXCJcXFxccyooPzpcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8YmlzKVxcXFxzKlwiO1xuICAgIH1cbiAgICBwcmltYXJ5U3VmZml4KCkge1xuICAgICAgICByZXR1cm4gXCIoPzpcXFxccyp1aHIpPyg/OlxcXFxzKig/Om1vcmdlbnN8dm9ybWl0dGFnc3xuYWNobWl0dGFnc3xhYmVuZHN8bmFjaHRzKSk/KD89XFxcXFd8JClcIjtcbiAgICB9XG4gICAgZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gc3VwZXIuZXh0cmFjdFByaW1hcnlUaW1lQ29tcG9uZW50cyhjb250ZXh0LCBtYXRjaCk7XG4gICAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMF0uZW5kc1dpdGgoXCJtb3JnZW5zXCIpIHx8IG1hdGNoWzBdLmVuZHNXaXRoKFwidm9ybWl0dGFnc1wiKSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaG91ciA9IGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKTtcbiAgICAgICAgICAgICAgICBpZiAoaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwiaG91clwiLCBjb21wb25lbnRzLmdldChcImhvdXJcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXRjaFswXS5lbmRzV2l0aChcIm5hY2htaXR0YWdzXCIpIHx8IG1hdGNoWzBdLmVuZHNXaXRoKFwiYWJlbmRzXCIpIHx8IG1hdGNoWzBdLmVuZHNXaXRoKFwibmFjaHRzXCIpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb25zdCBob3VyID0gY29tcG9uZW50cy5nZXQoXCJob3VyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJob3VyXCIsIGNvbXBvbmVudHMuZ2V0KFwiaG91clwiKSArIDEyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gREVUaW1lRXhwcmVzc2lvblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IGV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gZXhwb3J0cy5wYXJzZVllYXIgPSBleHBvcnRzLllFQVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZID0gZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0gZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB2b2lkIDA7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5leHBvcnRzLldFRUtEQVlfRElDVElPTkFSWSA9IHtcbiAgICBcInNvbm50YWdcIjogMCxcbiAgICBcInNvXCI6IDAsXG4gICAgXCJtb250YWdcIjogMSxcbiAgICBcIm1vXCI6IDEsXG4gICAgXCJkaWVuc3RhZ1wiOiAyLFxuICAgIFwiZGlcIjogMixcbiAgICBcIm1pdHR3b2NoXCI6IDMsXG4gICAgXCJtaVwiOiAzLFxuICAgIFwiZG9ubmVyc3RhZ1wiOiA0LFxuICAgIFwiZG9cIjogNCxcbiAgICBcImZyZWl0YWdcIjogNSxcbiAgICBcImZyXCI6IDUsXG4gICAgXCJzYW1zdGFnXCI6IDYsXG4gICAgXCJzYVwiOiA2LFxufTtcbmV4cG9ydHMuTU9OVEhfRElDVElPTkFSWSA9IHtcbiAgICBcImphbnVhclwiOiAxLFxuICAgIFwiamFuXCI6IDEsXG4gICAgXCJqYW4uXCI6IDEsXG4gICAgXCJmZWJydWFyXCI6IDIsXG4gICAgXCJmZWJcIjogMixcbiAgICBcImZlYi5cIjogMixcbiAgICBcIm3DpHJ6XCI6IDMsXG4gICAgXCJtYWVyelwiOiAzLFxuICAgIFwibcOkclwiOiAzLFxuICAgIFwibcOkci5cIjogMyxcbiAgICBcIm1yelwiOiAzLFxuICAgIFwibXJ6LlwiOiAzLFxuICAgIFwiYXByaWxcIjogNCxcbiAgICBcImFwclwiOiA0LFxuICAgIFwiYXByLlwiOiA0LFxuICAgIFwibWFpXCI6IDUsXG4gICAgXCJqdW5pXCI6IDYsXG4gICAgXCJqdW5cIjogNixcbiAgICBcImp1bi5cIjogNixcbiAgICBcImp1bGlcIjogNyxcbiAgICBcImp1bFwiOiA3LFxuICAgIFwianVsLlwiOiA3LFxuICAgIFwiYXVndXN0XCI6IDgsXG4gICAgXCJhdWdcIjogOCxcbiAgICBcImF1Zy5cIjogOCxcbiAgICBcInNlcHRlbWJlclwiOiA5LFxuICAgIFwic2VwXCI6IDksXG4gICAgXCJzZXAuXCI6IDksXG4gICAgXCJzZXB0XCI6IDksXG4gICAgXCJzZXB0LlwiOiA5LFxuICAgIFwib2t0b2JlclwiOiAxMCxcbiAgICBcIm9rdFwiOiAxMCxcbiAgICBcIm9rdC5cIjogMTAsXG4gICAgXCJub3ZlbWJlclwiOiAxMSxcbiAgICBcIm5vdlwiOiAxMSxcbiAgICBcIm5vdi5cIjogMTEsXG4gICAgXCJkZXplbWJlclwiOiAxMixcbiAgICBcImRlelwiOiAxMixcbiAgICBcImRlei5cIjogMTIsXG59O1xuZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSA9IHtcbiAgICBcImVpbnNcIjogMSxcbiAgICBcInp3ZWlcIjogMixcbiAgICBcImRyZWlcIjogMyxcbiAgICBcInZpZXJcIjogNCxcbiAgICBcImbDvG5mXCI6IDUsXG4gICAgXCJmdWVuZlwiOiA1LFxuICAgIFwic2VjaHNcIjogNixcbiAgICBcInNpZWJlblwiOiA3LFxuICAgIFwiYWNodFwiOiA4LFxuICAgIFwibmV1blwiOiA5LFxuICAgIFwiemVoblwiOiAxMCxcbiAgICBcImVsZlwiOiAxMSxcbiAgICBcInp3w7ZsZlwiOiAxMixcbiAgICBcInp3b2VsZlwiOiAxMixcbn07XG5leHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZID0ge1xuICAgIHNlYzogXCJzZWNvbmRcIixcbiAgICBzZWNvbmQ6IFwic2Vjb25kXCIsXG4gICAgc2Vjb25kczogXCJzZWNvbmRcIixcbiAgICBtaW46IFwibWludXRlXCIsXG4gICAgbWluczogXCJtaW51dGVcIixcbiAgICBtaW51dGU6IFwibWludXRlXCIsXG4gICAgbWludXRlczogXCJtaW51dGVcIixcbiAgICBoOiBcImhvdXJcIixcbiAgICBocjogXCJob3VyXCIsXG4gICAgaHJzOiBcImhvdXJcIixcbiAgICBob3VyOiBcImhvdXJcIixcbiAgICBob3VyczogXCJob3VyXCIsXG4gICAgZGF5OiBcImRcIixcbiAgICBkYXlzOiBcImRcIixcbiAgICB3ZWVrOiBcIndlZWtcIixcbiAgICB3ZWVrczogXCJ3ZWVrXCIsXG4gICAgbW9udGg6IFwibW9udGhcIixcbiAgICBtb250aHM6IFwibW9udGhcIixcbiAgICB5OiBcInllYXJcIixcbiAgICB5cjogXCJ5ZWFyXCIsXG4gICAgeWVhcjogXCJ5ZWFyXCIsXG4gICAgeWVhcnM6IFwieWVhclwiLFxufTtcbmV4cG9ydHMuTlVNQkVSX1BBVFRFUk4gPSBgKD86JHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkpfXxbMC05XSt8WzAtOV0rXFxcXC5bMC05XSt8aGFsZig/OlxcXFxzKmFuPyk/fGFuPyg/OlxcXFxzKmZldyk/fGZld3xzZXZlcmFsfGE/XFxcXHMqY291cGxlXFxcXHMqKD86b2YpPylgO1xuZnVuY3Rpb24gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWVtudW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtID09PSBcImFcIiB8fCBudW0gPT09IFwiYW5cIikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9mZXcvKSkge1xuICAgICAgICByZXR1cm4gMztcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9oYWxmLykpIHtcbiAgICAgICAgcmV0dXJuIDAuNTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9jb3VwbGUvKSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9zZXZlcmFsLykpIHtcbiAgICAgICAgcmV0dXJuIDc7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KG51bSk7XG59XG5leHBvcnRzLnBhcnNlTnVtYmVyUGF0dGVybiA9IHBhcnNlTnVtYmVyUGF0dGVybjtcbmV4cG9ydHMuWUVBUl9QQVRURVJOID0gYCg/OlswLTldezEsNH0oPzpcXFxccypbdm5dXFxcXC4/XFxcXHMqQyg/OmhyKT9cXFxcLj8pPylgO1xuZnVuY3Rpb24gcGFyc2VZZWFyKG1hdGNoKSB7XG4gICAgaWYgKC92L2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgcmV0dXJuIC1wYXJzZUludChtYXRjaC5yZXBsYWNlKC9bXjAtOV0rL2dpLCBcIlwiKSk7XG4gICAgfVxuICAgIGlmICgvbi9pLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChtYXRjaC5yZXBsYWNlKC9bXjAtOV0rL2dpLCBcIlwiKSk7XG4gICAgfVxuICAgIGNvbnN0IHJhd1llYXJOdW1iZXIgPSBwYXJzZUludChtYXRjaCk7XG4gICAgcmV0dXJuIHllYXJzXzEuZmluZE1vc3RMaWtlbHlBRFllYXIocmF3WWVhck51bWJlcik7XG59XG5leHBvcnRzLnBhcnNlWWVhciA9IHBhcnNlWWVhcjtcbmNvbnN0IFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTiA9IGAoJHtleHBvcnRzLk5VTUJFUl9QQVRURVJOfSlcXFxcc3swLDV9KCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZKX0pXFxcXHN7MCw1fWA7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1JFR0VYID0gbmV3IFJlZ0V4cChTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4sIFwiaVwiKTtcbmV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gcGF0dGVybl8xLnJlcGVhdGVkVGltZXVuaXRQYXR0ZXJuKFwiXCIsIFNJTkdMRV9USU1FX1VOSVRfUEFUVEVSTik7XG5mdW5jdGlvbiBwYXJzZVRpbWVVbml0cyh0aW1ldW5pdFRleHQpIHtcbiAgICBjb25zdCBmcmFnbWVudHMgPSB7fTtcbiAgICBsZXQgcmVtYWluaW5nVGV4dCA9IHRpbWV1bml0VGV4dDtcbiAgICBsZXQgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpO1xuICAgICAgICByZW1haW5pbmdUZXh0ID0gcmVtYWluaW5nVGV4dC5zdWJzdHJpbmcobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgICAgICAgbWF0Y2ggPSBTSU5HTEVfVElNRV9VTklUX1JFR0VYLmV4ZWMocmVtYWluaW5nVGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBmcmFnbWVudHM7XG59XG5leHBvcnRzLnBhcnNlVGltZVVuaXRzID0gcGFyc2VUaW1lVW5pdHM7XG5mdW5jdGlvbiBjb2xsZWN0RGF0ZVRpbWVGcmFnbWVudChmcmFnbWVudHMsIG1hdGNoKSB7XG4gICAgY29uc3QgbnVtID0gcGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoWzFdKTtcbiAgICBjb25zdCB1bml0ID0gZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWVttYXRjaFsyXS50b0xvd2VyQ2FzZSgpXTtcbiAgICBmcmFnbWVudHNbdW5pdF0gPSBudW07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3Qgd2Vla3NfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi93ZWVrc1wiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKD86KD86XFxcXCx8XFxcXCh8XFxcXO+8iClcXFxccyopP1wiICtcbiAgICBcIig/OmFbbW5dXFxcXHMqPyk/XCIgK1xuICAgIFwiKD86KGRpZXNlW21uXXxsZXR6dGVbbW5dfG4oPzrDpHxhZSljaHN0ZVttbl0pXFxcXHMqKT9cIiArXG4gICAgYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuV0VFS0RBWV9ESUNUSU9OQVJZKX0pYCArXG4gICAgXCIoPzpcXFxccyooPzpcXFxcLHxcXFxcKXxcXFxc77yJKSk/XCIgK1xuICAgIFwiKD86XFxcXHMqKGRpZXNlfGxldHp0ZXxuKD86w6R8YWUpY2hzdGUpXFxcXHMqd29jaGUpP1wiICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFBSRUZJWF9HUk9VUCA9IDE7XG5jb25zdCBTVUZGSVhfR1JPVVAgPSAzO1xuY29uc3QgV0VFS0RBWV9HUk9VUCA9IDI7XG5jbGFzcyBERVdlZWtkYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IG1hdGNoW1dFRUtEQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWVtkYXlPZldlZWtdO1xuICAgICAgICBjb25zdCBwcmVmaXggPSBtYXRjaFtQUkVGSVhfR1JPVVBdO1xuICAgICAgICBjb25zdCBwb3N0Zml4ID0gbWF0Y2hbU1VGRklYX0dST1VQXTtcbiAgICAgICAgbGV0IG1vZGlmaWVyV29yZCA9IHByZWZpeCB8fCBwb3N0Zml4O1xuICAgICAgICBtb2RpZmllcldvcmQgPSBtb2RpZmllcldvcmQgfHwgXCJcIjtcbiAgICAgICAgbW9kaWZpZXJXb3JkID0gbW9kaWZpZXJXb3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBtb2RpZmllciA9IG51bGw7XG4gICAgICAgIGlmIChtb2RpZmllcldvcmQubWF0Y2goL2xldHp0ZS8pKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibGFzdFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vZGlmaWVyV29yZC5tYXRjaCgvY2hzdGUvKSkge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcIm5leHRcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtb2RpZmllcldvcmQubWF0Y2goL2RpZXNlLykpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJ0aGlzXCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZSA9IHdlZWtzXzEudG9EYXlKU1dlZWtkYXkoY29udGV4dC5yZWZEYXRlLCBvZmZzZXQsIG1vZGlmaWVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRcbiAgICAgICAgICAgIC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpXG4gICAgICAgICAgICAuYXNzaWduKFwid2Vla2RheVwiLCBvZmZzZXQpXG4gICAgICAgICAgICAuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpXG4gICAgICAgICAgICAuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKVxuICAgICAgICAgICAgLmltcGx5KFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gREVXZWVrZGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY2xhc3MgREVNZXJnZURhdGVSYW5nZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gL15cXHMqKGJpcyg/OlxccyooPzphbXx6dW0pKT98LSlcXHMqJC9pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERFTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNsYXNzIERFTWVyZ2VEYXRlVGltZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlxcXFxzKihUfHVtfGFtfCx8LSk/XFxcXHMqJFwiKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBERU1lcmdlRGF0ZVRpbWVSZWZpbmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgZGF5anNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IHRpbWV1bml0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3RpbWV1bml0c1wiKTtcbmNsYXNzIERFQ2FzdWFsVGltZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gLyhkaWVzZW4pP1xccyoobW9yZ2VufHZvcm1pdHRhZ3xtaXR0YWdzP3xuYWNobWl0dGFnfGFiZW5kfG5hY2h0fG1pdHRlcm5hY2h0KSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCB0aW1lS2V5d29yZFBhdHRlcm4gPSBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGRheWpzXzIuaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICByZXR1cm4gREVDYXN1YWxUaW1lUGFyc2VyLmV4dHJhY3RUaW1lQ29tcG9uZW50cyhjb21wb25lbnQsIHRpbWVLZXl3b3JkUGF0dGVybik7XG4gICAgfVxuICAgIHN0YXRpYyBleHRyYWN0VGltZUNvbXBvbmVudHMoY29tcG9uZW50LCB0aW1lS2V5d29yZFBhdHRlcm4pIHtcbiAgICAgICAgc3dpdGNoICh0aW1lS2V5d29yZFBhdHRlcm4pIHtcbiAgICAgICAgICAgIGNhc2UgXCJtb3JnZW5cIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidm9ybWl0dGFnXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCA5KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pdHRhZ1wiOlxuICAgICAgICAgICAgY2FzZSBcIm1pdHRhZ3NcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm5hY2htaXR0YWdcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE1KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImFiZW5kXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxOCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJuYWNodFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjIpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJzZWNvbmRcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWl0dGVybmFjaHRcIjpcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldChcImhvdXJcIikgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IHRpbWV1bml0c18xLmFkZEltcGxpZWRUaW1lVW5pdHMoY29tcG9uZW50LCB7IFwiZGF5XCI6IDEgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERFQ2FzdWFsVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgREVDYXN1YWxUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vREVDYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmNvbnN0IHJlZmVyZW5jZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzXCIpKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAoamV0enR8aGV1dGV8bW9yZ2VufMO8YmVybW9yZ2VufHVlYmVybW9yZ2VufGdlc3Rlcm58dm9yZ2VzdGVybnxsZXR6dGVcXFxccypuYWNodClgICtcbiAgICBgKD86XFxcXHMqKG1vcmdlbnx2b3JtaXR0YWd8bWl0dGFncz98bmFjaG1pdHRhZ3xhYmVuZHxuYWNodHxtaXR0ZXJuYWNodCkpP2AgK1xuICAgIGAoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNvbnN0IERBVEVfR1JPVVAgPSAxO1xuY29uc3QgVElNRV9HUk9VUCA9IDI7XG5jbGFzcyBERUNhc3VhbERhdGVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBsZXQgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCBkYXRlS2V5d29yZCA9IChtYXRjaFtEQVRFX0dST1VQXSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCB0aW1lS2V5d29yZCA9IChtYXRjaFtUSU1FX0dST1VQXSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKGRhdGVLZXl3b3JkKSB7XG4gICAgICAgICAgICBjYXNlIFwiamV0enRcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQgPSByZWZlcmVuY2VzLm5vdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImhldXRlXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gcmVmZXJlbmNlcy50b2RheShjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1vcmdlblwiOlxuICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduVGhlTmV4dERheShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIsO8YmVybW9yZ2VuXCI6XG4gICAgICAgICAgICBjYXNlIFwidWViZXJtb3JnZW5cIjpcbiAgICAgICAgICAgICAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoMSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZ2VzdGVyblwiOlxuICAgICAgICAgICAgICAgIHRhcmdldERhdGUgPSB0YXJnZXREYXRlLmFkZCgtMSwgXCJkYXlcIik7XG4gICAgICAgICAgICAgICAgZGF5anNfMi5hc3NpZ25TaW1pbGFyRGF0ZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGRheWpzXzIuaW1wbHlTaW1pbGFyVGltZShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInZvcmdlc3Rlcm5cIjpcbiAgICAgICAgICAgICAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoLTIsIFwiZGF5XCIpO1xuICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBkYXlqc18yLmltcGx5U2ltaWxhclRpbWUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYgKGRhdGVLZXl3b3JkLm1hdGNoKC9sZXR6dGVcXHMqbmFjaHQvKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0RGF0ZS5ob3VyKCkgPiA2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoLTEsIFwiZGF5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduU2ltaWxhckRhdGUoY29tcG9uZW50LCB0YXJnZXREYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWVLZXl3b3JkKSB7XG4gICAgICAgICAgICBjb21wb25lbnQgPSBERUNhc3VhbFRpbWVQYXJzZXJfMS5kZWZhdWx0LmV4dHJhY3RUaW1lQ29tcG9uZW50cyhjb21wb25lbnQsIHRpbWVLZXl3b3JkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IERFQ2FzdWFsRGF0ZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzphbVxcXFxzKj8pP1wiICtcbiAgICBcIig/OmRlblxcXFxzKj8pP1wiICtcbiAgICBgKFswLTldezEsMn0pXFxcXC5gICtcbiAgICBgKD86XFxcXHMqKD86YmlzKD86XFxcXHMqKD86YW18enVtKSk/fFxcXFwtfFxcXFzigJN8XFxcXHMpXFxcXHMqKFswLTldezEsMn0pXFxcXC4/KT9cXFxccypgICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pYCArXG4gICAgYCg/Oig/Oi18L3wsP1xcXFxzKikoJHtjb25zdGFudHNfMi5ZRUFSX1BBVFRFUk59KD8hW15cXFxcc11cXFxcZCkpKT9gICtcbiAgICBgKD89XFxcXFd8JClgLCBcImlcIik7XG5jb25zdCBEQVRFX0dST1VQID0gMTtcbmNvbnN0IERBVEVfVE9fR1JPVVAgPSAyO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDM7XG5jb25zdCBZRUFSX0dST1VQID0gNDtcbmNsYXNzIERFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBkYXkgPSBwYXJzZUludChtYXRjaFtEQVRFX0dST1VQXSk7XG4gICAgICAgIGlmIChkYXkgPiAzMSkge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoW0RBVEVfR1JPVVBdLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJtb250aFwiLCBtb250aCk7XG4gICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJkYXlcIiwgZGF5KTtcbiAgICAgICAgaWYgKG1hdGNoW1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyTnVtYmVyID0gY29uc3RhbnRzXzIucGFyc2VZZWFyKG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5hc3NpZ24oXCJ5ZWFyXCIsIHllYXJOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IHllYXJzXzEuZmluZFllYXJDbG9zZXN0VG9SZWYoY29udGV4dC5yZWZEYXRlLCBkYXksIG1vbnRoKTtcbiAgICAgICAgICAgIHJlc3VsdC5zdGFydC5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoW0RBVEVfVE9fR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCBlbmREYXRlID0gcGFyc2VJbnQobWF0Y2hbREFURV9UT19HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LmVuZCA9IHJlc3VsdC5zdGFydC5jbG9uZSgpO1xuICAgICAgICAgICAgcmVzdWx0LmVuZC5hc3NpZ24oXCJkYXlcIiwgZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBERU1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5zdHJpY3QgPSBleHBvcnRzLmNhc3VhbCA9IHZvaWQgMDtcbmNvbnN0IGNvbmZpZ3VyYXRpb25zXzEgPSByZXF1aXJlKFwiLi4vLi4vY29uZmlndXJhdGlvbnNcIik7XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuLi8uLi9jaHJvbm9cIik7XG5jb25zdCBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vY29tbW9uL3BhcnNlcnMvU2xhc2hEYXRlRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IElTT0Zvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGFyc2Vycy9JU09Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgREVUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvREVUaW1lRXhwcmVzc2lvblBhcnNlclwiKSk7XG5jb25zdCBERVdlZWtkYXlQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0RFV2Vla2RheVBhcnNlclwiKSk7XG5jb25zdCBERU1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL0RFTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNvbnN0IERFTWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9ERU1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNvbnN0IERFQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvREVDYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IERFQ2FzdWFsVGltZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvREVDYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmNvbnN0IERFTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9ERU1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlclwiKSk7XG5leHBvcnRzLmNhc3VhbCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbigpKTtcbmV4cG9ydHMuc3RyaWN0ID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDb25maWd1cmF0aW9uKHRydWUpKTtcbmZ1bmN0aW9uIHBhcnNlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcbmZ1bmN0aW9uIHBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZURhdGUgPSBwYXJzZURhdGU7XG5mdW5jdGlvbiBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKGxpdHRsZUVuZGlhbiA9IHRydWUpIHtcbiAgICBjb25zdCBvcHRpb24gPSBjcmVhdGVDb25maWd1cmF0aW9uKGZhbHNlLCBsaXR0bGVFbmRpYW4pO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IERFQ2FzdWFsVGltZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgREVDYXN1YWxEYXRlUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICByZXR1cm4gb3B0aW9uO1xufVxuZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbjtcbmZ1bmN0aW9uIGNyZWF0ZUNvbmZpZ3VyYXRpb24oc3RyaWN0TW9kZSA9IHRydWUsIGxpdHRsZUVuZGlhbiA9IHRydWUpIHtcbiAgICByZXR1cm4gY29uZmlndXJhdGlvbnNfMS5pbmNsdWRlQ29tbW9uQ29uZmlndXJhdGlvbih7XG4gICAgICAgIHBhcnNlcnM6IFtcbiAgICAgICAgICAgIG5ldyBJU09Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdChsaXR0bGVFbmRpYW4pLFxuICAgICAgICAgICAgbmV3IERFVGltZUV4cHJlc3Npb25QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgREVNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgREVXZWVrZGF5UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICBdLFxuICAgICAgICByZWZpbmVyczogW25ldyBERU1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xLmRlZmF1bHQoKSwgbmV3IERFTWVyZ2VEYXRlVGltZVJlZmluZXJfMS5kZWZhdWx0KCldLFxuICAgIH0sIHN0cmljdE1vZGUpO1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgZGF5anNfMiA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9kYXlqc1wiKTtcbmNvbnN0IHJlZmVyZW5jZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzXCIpKTtcbmNsYXNzIEZSQ2FzdWFsRGF0ZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gLyhtYWludGVuYW50fGF1am91cmQnaHVpfGRlbWFpbnxoaWVyfGNldHRlXFxzKm51aXR8bGFcXHMqdmVpbGxlKSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgbGV0IHRhcmdldERhdGUgPSBkYXlqc18xLmRlZmF1bHQoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgY29uc3QgbG93ZXJUZXh0ID0gbWF0Y2hbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKGxvd2VyVGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcIm1haW50ZW5hbnRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy5ub3coY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCJhdWpvdXJkJ2h1aVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwiaGllclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnllc3RlcmRheShjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcImRlbWFpblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbW9ycm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmIChsb3dlclRleHQubWF0Y2goL2NldHRlXFxzKm51aXQvKSkge1xuICAgICAgICAgICAgICAgICAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjIpO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobG93ZXJUZXh0Lm1hdGNoKC9sYVxccyp2ZWlsbGUvKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXREYXRlID0gdGFyZ2V0RGF0ZS5hZGQoLTEsIFwiZGF5XCIpO1xuICAgICAgICAgICAgICAgICAgICBkYXlqc18yLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRlJDYXN1YWxEYXRlUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY2xhc3MgRlJDYXN1YWxUaW1lUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiAvKGNldD8pP1xccyoobWF0aW58c29pcnxhcHLDqHMtbWlkaXxhcHJlbXxhIG1pZGl8w6AgbWludWl0KSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3Qgc3VmZml4TG93ZXIgPSBtYXRjaFsyXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIHN3aXRjaCAoc3VmZml4TG93ZXIpIHtcbiAgICAgICAgICAgIGNhc2UgXCJhcHLDqHMtbWlkaVwiOlxuICAgICAgICAgICAgY2FzZSBcImFwcmVtXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxNCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNvaXJcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE4KTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibWF0aW5cIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDgpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1pbnV0ZVwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhIG1pZGlcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiw6AgbWludWl0XCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZSQ2FzdWFsVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJcIik7XG5jbGFzcyBGUlRpbWVFeHByZXNzaW9uUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIHByaW1hcnlQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/Oig/OlvDoGFdKVxcXFxzKik/XCI7XG4gICAgfVxuICAgIGZvbGxvd2luZ1BoYXNlKCkge1xuICAgICAgICByZXR1cm4gXCJcXFxccyooPzpcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8W8OgYV18XFxcXD8pXFxcXHMqXCI7XG4gICAgfVxuICAgIGV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgaWYgKG1hdGNoWzBdLm1hdGNoKC9eXFxzKlxcZHs0fVxccyokLykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5leHRyYWN0UHJpbWFyeVRpbWVDb21wb25lbnRzKGNvbnRleHQsIG1hdGNoKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUlRpbWVFeHByZXNzaW9uUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNsYXNzIEZSTWVyZ2VEYXRlVGltZVJlZmluZXIgZXh0ZW5kcyBBYnN0cmFjdE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXlxcXFxzKihUfMOgfGF8dmVyc3xkZXwsfC0pP1xcXFxzKiRcIik7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRlJNZXJnZURhdGVUaW1lUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNsYXNzIEZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxzKijDoHxhfC0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUk1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IGV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gZXhwb3J0cy5wYXJzZVllYXIgPSBleHBvcnRzLllFQVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IGV4cG9ydHMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZID0gZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0gZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB2b2lkIDA7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmV4cG9ydHMuV0VFS0RBWV9ESUNUSU9OQVJZID0ge1xuICAgIFwiZGltYW5jaGVcIjogMCxcbiAgICBcImRpbVwiOiAwLFxuICAgIFwibHVuZGlcIjogMSxcbiAgICBcImx1blwiOiAxLFxuICAgIFwibWFyZGlcIjogMixcbiAgICBcIm1hclwiOiAyLFxuICAgIFwibWVyY3JlZGlcIjogMyxcbiAgICBcIm1lclwiOiAzLFxuICAgIFwiamV1ZGlcIjogNCxcbiAgICBcImpldVwiOiA0LFxuICAgIFwidmVuZHJlZGlcIjogNSxcbiAgICBcInZlblwiOiA1LFxuICAgIFwic2FtZWRpXCI6IDYsXG4gICAgXCJzYW1cIjogNixcbn07XG5leHBvcnRzLk1PTlRIX0RJQ1RJT05BUlkgPSB7XG4gICAgXCJqYW52aWVyXCI6IDEsXG4gICAgXCJqYW5cIjogMSxcbiAgICBcImphbi5cIjogMSxcbiAgICBcImbDqXZyaWVyXCI6IDIsXG4gICAgXCJmw6l2XCI6IDIsXG4gICAgXCJmw6l2LlwiOiAyLFxuICAgIFwiZmV2cmllclwiOiAyLFxuICAgIFwiZmV2XCI6IDIsXG4gICAgXCJmZXYuXCI6IDIsXG4gICAgXCJtYXJzXCI6IDMsXG4gICAgXCJtYXJcIjogMyxcbiAgICBcIm1hci5cIjogMyxcbiAgICBcImF2cmlsXCI6IDQsXG4gICAgXCJhdnJcIjogNCxcbiAgICBcImF2ci5cIjogNCxcbiAgICBcIm1haVwiOiA1LFxuICAgIFwianVpblwiOiA2LFxuICAgIFwianVuXCI6IDYsXG4gICAgXCJqdWlsbGV0XCI6IDcsXG4gICAgXCJqdWlsXCI6IDcsXG4gICAgXCJqdWxcIjogNyxcbiAgICBcImp1bC5cIjogNyxcbiAgICBcImFvw7t0XCI6IDgsXG4gICAgXCJhb3V0XCI6IDgsXG4gICAgXCJzZXB0ZW1icmVcIjogOSxcbiAgICBcInNlcFwiOiA5LFxuICAgIFwic2VwLlwiOiA5LFxuICAgIFwic2VwdFwiOiA5LFxuICAgIFwic2VwdC5cIjogOSxcbiAgICBcIm9jdG9icmVcIjogMTAsXG4gICAgXCJvY3RcIjogMTAsXG4gICAgXCJvY3QuXCI6IDEwLFxuICAgIFwibm92ZW1icmVcIjogMTEsXG4gICAgXCJub3ZcIjogMTEsXG4gICAgXCJub3YuXCI6IDExLFxuICAgIFwiZMOpY2VtYnJlXCI6IDEyLFxuICAgIFwiZGVjZW1icmVcIjogMTIsXG4gICAgXCJkZWNcIjogMTIsXG4gICAgXCJkZWMuXCI6IDEyLFxufTtcbmV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSB7XG4gICAgXCJ1blwiOiAxLFxuICAgIFwiZGV1eFwiOiAyLFxuICAgIFwidHJvaXNcIjogMyxcbiAgICBcInF1YXRyZVwiOiA0LFxuICAgIFwiY2lucVwiOiA1LFxuICAgIFwic2l4XCI6IDYsXG4gICAgXCJzZXB0XCI6IDcsXG4gICAgXCJodWl0XCI6IDgsXG4gICAgXCJuZXVmXCI6IDksXG4gICAgXCJkaXhcIjogMTAsXG4gICAgXCJvbnplXCI6IDExLFxuICAgIFwiZG91emVcIjogMTIsXG4gICAgXCJ0cmVpemVcIjogMTMsXG59O1xuZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSA9IHtcbiAgICBcInNlY1wiOiBcInNlY29uZFwiLFxuICAgIFwic2Vjb25kZVwiOiBcInNlY29uZFwiLFxuICAgIFwic2Vjb25kZXNcIjogXCJzZWNvbmRcIixcbiAgICBcIm1pblwiOiBcIm1pbnV0ZVwiLFxuICAgIFwibWluc1wiOiBcIm1pbnV0ZVwiLFxuICAgIFwibWludXRlXCI6IFwibWludXRlXCIsXG4gICAgXCJtaW51dGVzXCI6IFwibWludXRlXCIsXG4gICAgXCJoXCI6IFwiaG91clwiLFxuICAgIFwiaHJcIjogXCJob3VyXCIsXG4gICAgXCJocnNcIjogXCJob3VyXCIsXG4gICAgXCJoZXVyZVwiOiBcImhvdXJcIixcbiAgICBcImhldXJlc1wiOiBcImhvdXJcIixcbiAgICBcImpvdXJcIjogXCJkXCIsXG4gICAgXCJqb3Vyc1wiOiBcImRcIixcbiAgICBcInNlbWFpbmVcIjogXCJ3ZWVrXCIsXG4gICAgXCJzZW1haW5lc1wiOiBcIndlZWtcIixcbiAgICBcIm1vaXNcIjogXCJtb250aFwiLFxuICAgIFwidHJpbWVzdHJlXCI6IFwicXVhcnRlclwiLFxuICAgIFwidHJpbWVzdHJlc1wiOiBcInF1YXJ0ZXJcIixcbiAgICBcImFuc1wiOiBcInllYXJcIixcbiAgICBcImFubsOpZVwiOiBcInllYXJcIixcbiAgICBcImFubsOpZXNcIjogXCJ5ZWFyXCIsXG59O1xuZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGAoPzoke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSl9fFswLTldK3xbMC05XStcXFxcLlswLTldK3x1bmU/fHF1ZWxxdWVzP3xkZW1pLT8pYDtcbmZ1bmN0aW9uIHBhcnNlTnVtYmVyUGF0dGVybihtYXRjaCkge1xuICAgIGNvbnN0IG51bSA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUllbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZW251bV07XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bSA9PT0gXCJ1bmVcIiB8fCBudW0gPT09IFwidW5cIikge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9xdWVscXVlcz8vKSkge1xuICAgICAgICByZXR1cm4gMztcbiAgICB9XG4gICAgZWxzZSBpZiAobnVtLm1hdGNoKC9kZW1pLT8vKSkge1xuICAgICAgICByZXR1cm4gMC41O1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VGbG9hdChudW0pO1xufVxuZXhwb3J0cy5wYXJzZU51bWJlclBhdHRlcm4gPSBwYXJzZU51bWJlclBhdHRlcm47XG5leHBvcnRzLk9SRElOQUxfTlVNQkVSX1BBVFRFUk4gPSBgKD86WzAtOV17MSwyfSg/OmVyKT8pYDtcbmZ1bmN0aW9uIHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4obWF0Y2gpIHtcbiAgICBsZXQgbnVtID0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICBudW0gPSBudW0ucmVwbGFjZSgvKD86ZXIpJC9pLCBcIlwiKTtcbiAgICByZXR1cm4gcGFyc2VJbnQobnVtKTtcbn1cbmV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm47XG5leHBvcnRzLllFQVJfUEFUVEVSTiA9IGAoPzpbMS05XVswLTldezAsM31cXFxccyooPzpBQ3xBRHxwXFxcXC5cXFxccypDKD86aHI/KT9cXFxcLlxcXFxzKm5cXFxcLil8WzEtMl1bMC05XXszfXxbNS05XVswLTldKWA7XG5mdW5jdGlvbiBwYXJzZVllYXIobWF0Y2gpIHtcbiAgICBpZiAoL0FDL2kudGVzdChtYXRjaCkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9CQy9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIC1wYXJzZUludChtYXRjaCk7XG4gICAgfVxuICAgIGlmICgvQUQvaS50ZXN0KG1hdGNoKSB8fCAvQy9pLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIG1hdGNoID0gbWF0Y2gucmVwbGFjZSgvW15cXGRdKy9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoKTtcbiAgICB9XG4gICAgbGV0IHllYXJOdW1iZXIgPSBwYXJzZUludChtYXRjaCk7XG4gICAgaWYgKHllYXJOdW1iZXIgPCAxMDApIHtcbiAgICAgICAgaWYgKHllYXJOdW1iZXIgPiA1MCkge1xuICAgICAgICAgICAgeWVhck51bWJlciA9IHllYXJOdW1iZXIgKyAxOTAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeWVhck51bWJlciA9IHllYXJOdW1iZXIgKyAyMDAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB5ZWFyTnVtYmVyO1xufVxuZXhwb3J0cy5wYXJzZVllYXIgPSBwYXJzZVllYXI7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4gPSBgKCR7ZXhwb3J0cy5OVU1CRVJfUEFUVEVSTn0pXFxcXHN7MCw1fSgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSl9KVxcXFxzezAsNX1gO1xuY29uc3QgU0lOR0xFX1RJTUVfVU5JVF9SRUdFWCA9IG5ldyBSZWdFeHAoU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOLCBcImlcIik7XG5leHBvcnRzLlRJTUVfVU5JVFNfUEFUVEVSTiA9IHBhdHRlcm5fMS5yZXBlYXRlZFRpbWV1bml0UGF0dGVybihcIlwiLCBTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4pO1xuZnVuY3Rpb24gcGFyc2VUaW1lVW5pdHModGltZXVuaXRUZXh0KSB7XG4gICAgY29uc3QgZnJhZ21lbnRzID0ge307XG4gICAgbGV0IHJlbWFpbmluZ1RleHQgPSB0aW1ldW5pdFRleHQ7XG4gICAgbGV0IG1hdGNoID0gU0lOR0xFX1RJTUVfVU5JVF9SRUdFWC5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgIHdoaWxlIChtYXRjaCkge1xuICAgICAgICBjb2xsZWN0RGF0ZVRpbWVGcmFnbWVudChmcmFnbWVudHMsIG1hdGNoKTtcbiAgICAgICAgcmVtYWluaW5nVGV4dCA9IHJlbWFpbmluZ1RleHQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIG1hdGNoID0gU0lOR0xFX1RJTUVfVU5JVF9SRUdFWC5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgIH1cbiAgICByZXR1cm4gZnJhZ21lbnRzO1xufVxuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IHBhcnNlVGltZVVuaXRzO1xuZnVuY3Rpb24gY29sbGVjdERhdGVUaW1lRnJhZ21lbnQoZnJhZ21lbnRzLCBtYXRjaCkge1xuICAgIGNvbnN0IG51bSA9IHBhcnNlTnVtYmVyUGF0dGVybihtYXRjaFsxXSk7XG4gICAgY29uc3QgdW5pdCA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUllbbWF0Y2hbMl0udG9Mb3dlckNhc2UoKV07XG4gICAgZnJhZ21lbnRzW3VuaXRdID0gbnVtO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHdlZWtzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24vd2Vla3NcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Oig/OlxcXFwsfFxcXFwofFxcXFzvvIgpXFxcXHMqKT9cIiArXG4gICAgXCIoPzooPzpjZSlcXFxccyopP1wiICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUlkpfSlgICtcbiAgICBcIig/OlxcXFxzKig/OlxcXFwsfFxcXFwpfFxcXFzvvIkpKT9cIiArXG4gICAgXCIoPzpcXFxccyooZGVybmllcnxwcm9jaGFpbilcXFxccyopP1wiICtcbiAgICBcIig/PVxcXFxXfFxcXFxkfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFdFRUtEQVlfR1JPVVAgPSAxO1xuY29uc3QgUE9TVEZJWF9HUk9VUCA9IDI7XG5jbGFzcyBGUldlZWtkYXlQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IG1hdGNoW1dFRUtEQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWVtkYXlPZldlZWtdO1xuICAgICAgICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdWZmaXggPSBtYXRjaFtQT1NURklYX0dST1VQXTtcbiAgICAgICAgc3VmZml4ID0gc3VmZml4IHx8IFwiXCI7XG4gICAgICAgIHN1ZmZpeCA9IHN1ZmZpeC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgbW9kaWZpZXIgPSBudWxsO1xuICAgICAgICBpZiAoc3VmZml4ID09IFwiZGVybmllclwiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibGFzdFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN1ZmZpeCA9PSBcInByb2NoYWluXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJuZXh0XCI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZSA9IHdlZWtzXzEudG9EYXlKU1dlZWtkYXkoY29udGV4dC5yZWZEYXRlLCBvZmZzZXQsIG1vZGlmaWVyKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRcbiAgICAgICAgICAgIC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpXG4gICAgICAgICAgICAuYXNzaWduKFwid2Vla2RheVwiLCBvZmZzZXQpXG4gICAgICAgICAgICAuaW1wbHkoXCJkYXlcIiwgZGF0ZS5kYXRlKCkpXG4gICAgICAgICAgICAuaW1wbHkoXCJtb250aFwiLCBkYXRlLm1vbnRoKCkgKyAxKVxuICAgICAgICAgICAgLmltcGx5KFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRlJXZWVrZGF5UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgRklSU1RfUkVHX1BBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKF58XFxcXHN8VClcIiArXG4gICAgXCIoPzooPzpbw6BhXSlcXFxccyopP1wiICtcbiAgICBcIihcXFxcZHsxLDJ9KSg/Omh8Oik/XCIgK1xuICAgIFwiKD86KFxcXFxkezEsMn0pKD86bXw6KT8pP1wiICtcbiAgICBcIig/OihcXFxcZHsxLDJ9KSg/OnN8Oik/KT9cIiArXG4gICAgXCIoPzpcXFxccyooQVxcXFwuTVxcXFwufFBcXFxcLk1cXFxcLnxBTT98UE0/KSk/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgU0VDT05EX1JFR19QQVRURVJOID0gbmV3IFJlZ0V4cChcIl5cXFxccyooXFxcXC18XFxcXOKAk3xcXFxcfnxcXFxc44CcfFvDoGFdfFxcXFw/KVxcXFxzKlwiICtcbiAgICBcIihcXFxcZHsxLDJ9KSg/Omh8Oik/XCIgK1xuICAgIFwiKD86KFxcXFxkezEsMn0pKD86bXw6KT8pP1wiICtcbiAgICBcIig/OihcXFxcZHsxLDJ9KSg/OnN8Oik/KT9cIiArXG4gICAgXCIoPzpcXFxccyooQVxcXFwuTVxcXFwufFBcXFxcLk1cXFxcLnxBTT98UE0/KSk/XCIgK1xuICAgIFwiKD89XFxcXFd8JClcIiwgXCJpXCIpO1xuY29uc3QgSE9VUl9HUk9VUCA9IDI7XG5jb25zdCBNSU5VVEVfR1JPVVAgPSAzO1xuY29uc3QgU0VDT05EX0dST1VQID0gNDtcbmNvbnN0IEFNX1BNX0hPVVJfR1JPVVAgPSA1O1xuY2xhc3MgRlJTcGVjaWZpY1RpbWVFeHByZXNzaW9uUGFyc2VyIHtcbiAgICBwYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIEZJUlNUX1JFR19QQVRURVJOO1xuICAgIH1cbiAgICBleHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCArIG1hdGNoWzFdLmxlbmd0aCwgbWF0Y2hbMF0uc3Vic3RyaW5nKG1hdGNoWzFdLmxlbmd0aCkpO1xuICAgICAgICBpZiAocmVzdWx0LnRleHQubWF0Y2goL15cXGR7NH0kLykpIHtcbiAgICAgICAgICAgIG1hdGNoLmluZGV4ICs9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5zdGFydCA9IEZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlci5leHRyYWN0VGltZUNvbXBvbmVudChyZXN1bHQuc3RhcnQuY2xvbmUoKSwgbWF0Y2gpO1xuICAgICAgICBpZiAoIXJlc3VsdC5zdGFydCkge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVtYWluaW5nVGV4dCA9IGNvbnRleHQudGV4dC5zdWJzdHJpbmcobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBzZWNvbmRNYXRjaCA9IFNFQ09ORF9SRUdfUEFUVEVSTi5leGVjKHJlbWFpbmluZ1RleHQpO1xuICAgICAgICBpZiAoc2Vjb25kTWF0Y2gpIHtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQgPSBGUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXIuZXh0cmFjdFRpbWVDb21wb25lbnQocmVzdWx0LnN0YXJ0LmNsb25lKCksIHNlY29uZE1hdGNoKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZW5kKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnRleHQgKz0gc2Vjb25kTWF0Y2hbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgc3RhdGljIGV4dHJhY3RUaW1lQ29tcG9uZW50KGV4dHJhY3RpbmdDb21wb25lbnRzLCBtYXRjaCkge1xuICAgICAgICBsZXQgaG91ciA9IDA7XG4gICAgICAgIGxldCBtaW51dGUgPSAwO1xuICAgICAgICBsZXQgbWVyaWRpZW0gPSBudWxsO1xuICAgICAgICBob3VyID0gcGFyc2VJbnQobWF0Y2hbSE9VUl9HUk9VUF0pO1xuICAgICAgICBpZiAobWF0Y2hbTUlOVVRFX0dST1VQXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtaW51dGUgPSBwYXJzZUludChtYXRjaFtNSU5VVEVfR1JPVVBdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWludXRlID49IDYwIHx8IGhvdXIgPiAyNCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvdXIgPj0gMTIpIHtcbiAgICAgICAgICAgIG1lcmlkaWVtID0gaW5kZXhfMS5NZXJpZGllbS5QTTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbQU1fUE1fSE9VUl9HUk9VUF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGhvdXIgPiAxMilcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGFtcG0gPSBtYXRjaFtBTV9QTV9IT1VSX0dST1VQXVswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGFtcG0gPT0gXCJhXCIpIHtcbiAgICAgICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uQU07XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFtcG0gPT0gXCJwXCIpIHtcbiAgICAgICAgICAgICAgICBtZXJpZGllbSA9IGluZGV4XzEuTWVyaWRpZW0uUE07XG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgIT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFjdGluZ0NvbXBvbmVudHMuYXNzaWduKFwiaG91clwiLCBob3VyKTtcbiAgICAgICAgZXh0cmFjdGluZ0NvbXBvbmVudHMuYXNzaWduKFwibWludXRlXCIsIG1pbnV0ZSk7XG4gICAgICAgIGlmIChtZXJpZGllbSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0cmFjdGluZ0NvbXBvbmVudHMuYXNzaWduKFwibWVyaWRpZW1cIiwgbWVyaWRpZW0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGV4dHJhY3RpbmdDb21wb25lbnRzLmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBleHRyYWN0aW5nQ29tcG9uZW50cy5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtTRUNPTkRfR1JPVVBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZCA9IHBhcnNlSW50KG1hdGNoW1NFQ09ORF9HUk9VUF0pO1xuICAgICAgICAgICAgaWYgKHNlY29uZCA+PSA2MClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGV4dHJhY3RpbmdDb21wb25lbnRzLmFzc2lnbihcInNlY29uZFwiLCBzZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHRyYWN0aW5nQ29tcG9uZW50cztcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBjb25zdGFudHNfMyA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKFwiKD86b25cXFxccyo/KT9cIiArXG4gICAgYCgke2NvbnN0YW50c18zLk9SRElOQUxfTlVNQkVSX1BBVFRFUk59KWAgK1xuICAgIGAoPzpcXFxccyooPzphdXxcXFxcLXxcXFxc4oCTfGp1c3F1J2F1P3xcXFxccylcXFxccyooJHtjb25zdGFudHNfMy5PUkRJTkFMX05VTUJFUl9QQVRURVJOfSkpP2AgK1xuICAgIGAoPzotfC98XFxcXHMqKD86ZGUpP1xcXFxzKilgICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pYCArXG4gICAgYCg/Oig/Oi18L3wsP1xcXFxzKikoJHtjb25zdGFudHNfMi5ZRUFSX1BBVFRFUk59KD8hW15cXFxcc11cXFxcZCkpKT9gICtcbiAgICBgKD89XFxcXFd8JClgLCBcImlcIik7XG5jb25zdCBEQVRFX0dST1VQID0gMTtcbmNvbnN0IERBVEVfVE9fR1JPVVAgPSAyO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDM7XG5jb25zdCBZRUFSX0dST1VQID0gNDtcbmNsYXNzIEZSTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdSZXN1bHQobWF0Y2guaW5kZXgsIG1hdGNoWzBdKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21hdGNoW01PTlRIX05BTUVfR1JPVVBdLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBkYXkgPSBjb25zdGFudHNfMy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbREFURV9HUk9VUF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImRheVwiLCBkYXkpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJOdW1iZXIgPSBjb25zdGFudHNfMi5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhck51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSBjb25zdGFudHNfMy5wYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoW0RBVEVfVE9fR1JPVVBdKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQgPSByZXN1bHQuc3RhcnQuY2xvbmUoKTtcbiAgICAgICAgICAgIHJlc3VsdC5lbmQuYXNzaWduKFwiZGF5XCIsIGVuZERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRlJNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHJlc3VsdHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9yZXN1bHRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgdGltZXVuaXRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvdGltZXVuaXRzXCIpO1xuY2xhc3MgRlJUaW1lVW5pdEFnb0Zvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgaWwgeSBhXFxcXHMqKCR7Y29uc3RhbnRzXzEuVElNRV9VTklUU19QQVRURVJOfSkoPz0oPzpcXFxcV3wkKSlgLCBcImlcIik7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0aW1lVW5pdHMgPSBjb25zdGFudHNfMS5wYXJzZVRpbWVVbml0cyhtYXRjaFsxXSk7XG4gICAgICAgIGNvbnN0IG91dHB1dFRpbWVVbml0cyA9IHRpbWV1bml0c18xLnJldmVyc2VUaW1lVW5pdHModGltZVVuaXRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgb3V0cHV0VGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNsYXNzIEZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgKD86ZGFuc3xlbnxwb3VyfHBlbmRhbnQpXFxcXHMqKCR7Y29uc3RhbnRzXzEuVElNRV9VTklUU19QQVRURVJOfSkoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IGNvbnN0YW50c18xLnBhcnNlVGltZVVuaXRzKG1hdGNoWzFdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCByZXN1bHRzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vcmVzdWx0c1wiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHRpbWV1bml0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3RpbWV1bml0c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY2xhc3MgRlJUaW1lVW5pdEFnb0Zvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgKD86bGVzP3xsYXxsJ3xkdXxkZXM/KVxcXFxzKmAgK1xuICAgICAgICAgICAgYCgke2NvbnN0YW50c18xLk5VTUJFUl9QQVRURVJOfSk/YCArXG4gICAgICAgICAgICBgKD86XFxcXHMqKHByb2NoYWluZT9zP3xkZXJuaVtlw6hdcmU/cz98cGFzc1vDqWVdZT9zP3xwclvDqWVdY1vDqWVdZGVudHM/fHN1aXZhbnRlP3M/KSk/YCArXG4gICAgICAgICAgICBgXFxcXHMqKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5USU1FX1VOSVRfRElDVElPTkFSWSl9KWAgK1xuICAgICAgICAgICAgYCg/OlxcXFxzKihwcm9jaGFpbmU/cz98ZGVybmlbZcOoXXJlP3M/fHBhc3Nbw6llXWU/cz98cHJbw6llXWNbw6llXWRlbnRzP3xzdWl2YW50ZT9zPykpP2AsIFwiaVwiKTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG51bSA9IG1hdGNoWzFdID8gY29uc3RhbnRzXzEucGFyc2VOdW1iZXJQYXR0ZXJuKG1hdGNoWzFdKSA6IDE7XG4gICAgICAgIGNvbnN0IHVuaXQgPSBjb25zdGFudHNfMS5USU1FX1VOSVRfRElDVElPTkFSWVttYXRjaFszXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgbGV0IHRpbWVVbml0cyA9IHt9O1xuICAgICAgICB0aW1lVW5pdHNbdW5pdF0gPSBudW07XG4gICAgICAgIGxldCBtb2RpZmllciA9IG1hdGNoWzJdIHx8IG1hdGNoWzRdIHx8IFwiXCI7XG4gICAgICAgIG1vZGlmaWVyID0gbW9kaWZpZXIudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCFtb2RpZmllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvZGVybmlbZcOoXXJlP3M/Ly50ZXN0KG1vZGlmaWVyKSB8fCAvcGFzc1vDqWVdZT9zPy8udGVzdChtb2RpZmllcikgfHwgL3ByW8OpZV1jW8OpZV1kZW50cz8vLnRlc3QobW9kaWZpZXIpKSB7XG4gICAgICAgICAgICB0aW1lVW5pdHMgPSB0aW1ldW5pdHNfMS5yZXZlcnNlVGltZVVuaXRzKHRpbWVVbml0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUNvbmZpZ3VyYXRpb24gPSBleHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBleHBvcnRzLnBhcnNlRGF0ZSA9IGV4cG9ydHMucGFyc2UgPSBleHBvcnRzLnN0cmljdCA9IGV4cG9ydHMuY2FzdWFsID0gdm9pZCAwO1xuY29uc3QgY29uZmlndXJhdGlvbnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9jb25maWd1cmF0aW9uc1wiKTtcbmNvbnN0IGNocm9ub18xID0gcmVxdWlyZShcIi4uLy4uL2Nocm9ub1wiKTtcbmNvbnN0IEZSQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJDYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IEZSQ2FzdWFsVGltZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJDYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmNvbnN0IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9jb21tb24vcGFyc2Vycy9TbGFzaERhdGVGb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRlJUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJUaW1lRXhwcmVzc2lvblBhcnNlclwiKSk7XG5jb25zdCBGUk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvRlJNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jb25zdCBGUk1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlZmluZXJzL0ZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNvbnN0IEZSV2Vla2RheVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJXZWVrZGF5UGFyc2VyXCIpKTtcbmNvbnN0IEZSU3BlY2lmaWNUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvRlJTcGVjaWZpY1RpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IEZSTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUk1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlclwiKSk7XG5jb25zdCBGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IEZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0ZSVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgRlJUaW1lVW5pdFJlbGF0aXZlRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9GUlRpbWVVbml0UmVsYXRpdmVGb3JtYXRQYXJzZXJcIikpO1xuZXhwb3J0cy5jYXN1YWwgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oKSk7XG5leHBvcnRzLnN0cmljdCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ29uZmlndXJhdGlvbih0cnVlKSk7XG5mdW5jdGlvbiBwYXJzZSh0ZXh0LCByZWYsIG9wdGlvbikge1xuICAgIHJldHVybiBleHBvcnRzLmNhc3VhbC5wYXJzZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG5mdW5jdGlvbiBwYXJzZURhdGUodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKTtcbn1cbmV4cG9ydHMucGFyc2VEYXRlID0gcGFyc2VEYXRlO1xuZnVuY3Rpb24gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbihsaXR0bGVFbmRpYW4gPSB0cnVlKSB7XG4gICAgY29uc3Qgb3B0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbihmYWxzZSwgbGl0dGxlRW5kaWFuKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBGUkNhc3VhbERhdGVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEZSQ2FzdWFsVGltZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgRlJUaW1lVW5pdFJlbGF0aXZlRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICByZXR1cm4gb3B0aW9uO1xufVxuZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbjtcbmZ1bmN0aW9uIGNyZWF0ZUNvbmZpZ3VyYXRpb24oc3RyaWN0TW9kZSA9IHRydWUsIGxpdHRsZUVuZGlhbiA9IHRydWUpIHtcbiAgICByZXR1cm4gY29uZmlndXJhdGlvbnNfMS5pbmNsdWRlQ29tbW9uQ29uZmlndXJhdGlvbih7XG4gICAgICAgIHBhcnNlcnM6IFtcbiAgICAgICAgICAgIG5ldyBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMS5kZWZhdWx0KGxpdHRsZUVuZGlhbiksXG4gICAgICAgICAgICBuZXcgRlJNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRlJUaW1lRXhwcmVzc2lvblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBGUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgRlJUaW1lVW5pdEFnb0Zvcm1hdFBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBGUlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IEZSV2Vla2RheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVmaW5lcnM6IFtuZXcgRlJNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQoKSwgbmV3IEZSTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpXSxcbiAgICB9LCBzdHJpY3RNb2RlKTtcbn1cbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudG9IYW5rYWt1ID0gdm9pZCAwO1xuZnVuY3Rpb24gdG9IYW5rYWt1KHRleHQpIHtcbiAgICByZXR1cm4gU3RyaW5nKHRleHQpXG4gICAgICAgIC5yZXBsYWNlKC9cXHUyMDE5L2csIFwiXFx1MDAyN1wiKVxuICAgICAgICAucmVwbGFjZSgvXFx1MjAxRC9nLCBcIlxcdTAwMjJcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcdTMwMDAvZywgXCJcXHUwMDIwXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHVGRkU1L2csIFwiXFx1MDBBNVwiKVxuICAgICAgICAucmVwbGFjZSgvW1xcdUZGMDFcXHVGRjAzLVxcdUZGMDZcXHVGRjA4XFx1RkYwOVxcdUZGMEMtXFx1RkYxOVxcdUZGMUMtXFx1RkYxRlxcdUZGMjEtXFx1RkYzQlxcdUZGM0RcXHVGRjNGXFx1RkY0MS1cXHVGRjVCXFx1RkY1RFxcdUZGNUVdL2csIGFscGhhTnVtKTtcbn1cbmV4cG9ydHMudG9IYW5rYWt1ID0gdG9IYW5rYWt1O1xuZnVuY3Rpb24gYWxwaGFOdW0odG9rZW4pIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSh0b2tlbi5jaGFyQ29kZUF0KDApIC0gNjUyNDgpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuY29uc3QgZGF5anNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGF5anNcIikpO1xuY29uc3QgUEFUVEVSTiA9IC8oPzooPzooW+WQjOS7iuacrF0pfCgo5pit5ZKMfOW5s+aIkHzku6TlkowpPyhbMC0577yQLe+8mV17MSw0fXzlhYMpKSnlubRcXHMqKT8oWzAtOe+8kC3vvJldezEsMn0p5pyIXFxzKihbMC0577yQLe+8mV17MSwyfSnml6UvaTtcbmNvbnN0IFNQRUNJQUxfWUVBUl9HUk9VUCA9IDE7XG5jb25zdCBUWVBJQ0FMX1lFQVJfR1JPVVAgPSAyO1xuY29uc3QgRVJBX0dST1VQID0gMztcbmNvbnN0IFlFQVJfTlVNQkVSX0dST1VQID0gNDtcbmNvbnN0IE1PTlRIX0dST1VQID0gNTtcbmNvbnN0IERBWV9HUk9VUCA9IDY7XG5jbGFzcyBKUFN0YW5kYXJkUGFyc2VyIHtcbiAgICBwYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgZXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBtb250aCA9IHBhcnNlSW50KGNvbnN0YW50c18xLnRvSGFua2FrdShtYXRjaFtNT05USF9HUk9VUF0pKTtcbiAgICAgICAgY29uc3QgZGF5ID0gcGFyc2VJbnQoY29uc3RhbnRzXzEudG9IYW5rYWt1KG1hdGNoW0RBWV9HUk9VUF0pKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoe1xuICAgICAgICAgICAgZGF5OiBkYXksXG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobWF0Y2hbU1BFQ0lBTF9ZRUFSX0dST1VQXSAmJiBtYXRjaFtTUEVDSUFMX1lFQVJfR1JPVVBdLm1hdGNoKFwi5ZCMfOS7inzmnKxcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vbWVudCA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJ5ZWFyXCIsIG1vbWVudC55ZWFyKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFtUWVBJQ0FMX1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyTnVtVGV4dCA9IG1hdGNoW1lFQVJfTlVNQkVSX0dST1VQXTtcbiAgICAgICAgICAgIGxldCB5ZWFyID0geWVhck51bVRleHQgPT0gXCLlhYNcIiA/IDEgOiBwYXJzZUludChjb25zdGFudHNfMS50b0hhbmtha3UoeWVhck51bVRleHQpKTtcbiAgICAgICAgICAgIGlmIChtYXRjaFtFUkFfR1JPVVBdID09IFwi5Luk5ZKMXCIpIHtcbiAgICAgICAgICAgICAgICB5ZWFyICs9IDIwMTg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtYXRjaFtFUkFfR1JPVVBdID09IFwi5bmz5oiQXCIpIHtcbiAgICAgICAgICAgICAgICB5ZWFyICs9IDE5ODg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtYXRjaFtFUkFfR1JPVVBdID09IFwi5pit5ZKMXCIpIHtcbiAgICAgICAgICAgICAgICB5ZWFyICs9IDE5MjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5pbXBseShcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudHM7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gSlBTdGFuZGFyZFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3JlZmluZXJzL0Fic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXCIpKTtcbmNsYXNzIEpQTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMS5kZWZhdWx0IHtcbiAgICBwYXR0ZXJuQmV0d2VlbigpIHtcbiAgICAgICAgcmV0dXJuIC9eXFxzKijjgYvjgol844O8fC0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBKUE1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2luZGV4XCIpO1xuY29uc3QgcmVmZXJlbmNlcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL2Nhc3VhbFJlZmVyZW5jZXNcIikpO1xuY29uc3QgUEFUVEVSTiA9IC/ku4rml6V85b2T5pelfOaYqOaXpXzmmI7ml6V85LuK5aScfOS7iuWklXzku4rmmal85LuK5pydL2k7XG5jbGFzcyBKUENhc3VhbERhdGVQYXJzZXIge1xuICAgIHBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBleHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaFswXTtcbiAgICAgICAgY29uc3QgZGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKHRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgXCLmmKjml6VcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy55ZXN0ZXJkYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgICAgIGNhc2UgXCLmmI7ml6VcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy50b21vcnJvdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcIuS7iuaXpVwiOlxuICAgICAgICAgICAgY2FzZSBcIuW9k+aXpVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHQgPT0gXCLku4rlpJxcIiB8fCB0ZXh0ID09IFwi5LuK5aSVXCIgfHwgdGV4dCA9PSBcIuS7iuaZqVwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiaG91clwiLCAyMik7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRleHQubWF0Y2goXCLku4rmnJ1cIikpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcImRheVwiLCBkYXRlLmRhdGUoKSk7XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSk7XG4gICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCBkYXRlLnllYXIoKSk7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEpQQ2FzdWFsRGF0ZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gZXhwb3J0cy5jcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uID0gZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5zdHJpY3QgPSBleHBvcnRzLmNhc3VhbCA9IHZvaWQgMDtcbmNvbnN0IEpQU3RhbmRhcmRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0pQU3RhbmRhcmRQYXJzZXJcIikpO1xuY29uc3QgSlBNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9KUE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jb25zdCBKUENhc3VhbERhdGVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL0pQQ2FzdWFsRGF0ZVBhcnNlclwiKSk7XG5jb25zdCBjaHJvbm9fMSA9IHJlcXVpcmUoXCIuLi8uLi9jaHJvbm9cIik7XG5leHBvcnRzLmNhc3VhbCA9IG5ldyBjaHJvbm9fMS5DaHJvbm8oY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbigpKTtcbmV4cG9ydHMuc3RyaWN0ID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDb25maWd1cmF0aW9uKCkpO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbmZ1bmN0aW9uIGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24oKSB7XG4gICAgY29uc3Qgb3B0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbigpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IEpQQ2FzdWFsRGF0ZVBhcnNlcl8xLmRlZmF1bHQoKSk7XG4gICAgcmV0dXJuIG9wdGlvbjtcbn1cbmV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb247XG5mdW5jdGlvbiBjcmVhdGVDb25maWd1cmF0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlcnM6IFtuZXcgSlBTdGFuZGFyZFBhcnNlcl8xLmRlZmF1bHQoKV0sXG4gICAgICAgIHJlZmluZXJzOiBbbmV3IEpQTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpXSxcbiAgICB9O1xufVxuZXhwb3J0cy5jcmVhdGVDb25maWd1cmF0aW9uID0gY3JlYXRlQ29uZmlndXJhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVllYXIgPSBleHBvcnRzLllFQVJfUEFUVEVSTiA9IGV4cG9ydHMuTU9OVEhfRElDVElPTkFSWSA9IGV4cG9ydHMuV0VFS0RBWV9ESUNUSU9OQVJZID0gdm9pZCAwO1xuZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB7XG4gICAgXCJkb21pbmdvXCI6IDAsXG4gICAgXCJkb21cIjogMCxcbiAgICBcInNlZ3VuZGFcIjogMSxcbiAgICBcInNlZ3VuZGEtZmVpcmFcIjogMSxcbiAgICBcInNlZ1wiOiAxLFxuICAgIFwidGVyw6dhXCI6IDIsXG4gICAgXCJ0ZXLDp2EtZmVpcmFcIjogMixcbiAgICBcInRlclwiOiAyLFxuICAgIFwicXVhcnRhXCI6IDMsXG4gICAgXCJxdWFydGEtZmVpcmFcIjogMyxcbiAgICBcInF1YVwiOiAzLFxuICAgIFwicXVpbnRhXCI6IDQsXG4gICAgXCJxdWludGEtZmVpcmFcIjogNCxcbiAgICBcInF1aVwiOiA0LFxuICAgIFwic2V4dGFcIjogNSxcbiAgICBcInNleHRhLWZlaXJhXCI6IDUsXG4gICAgXCJzZXhcIjogNSxcbiAgICBcInPDoWJhZG9cIjogNixcbiAgICBcInNhYmFkb1wiOiA2LFxuICAgIFwic2FiXCI6IDYsXG59O1xuZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0ge1xuICAgIFwiamFuZWlyb1wiOiAxLFxuICAgIFwiamFuXCI6IDEsXG4gICAgXCJqYW4uXCI6IDEsXG4gICAgXCJmZXZlcmVpcm9cIjogMixcbiAgICBcImZldlwiOiAyLFxuICAgIFwiZmV2LlwiOiAyLFxuICAgIFwibWFyw6dvXCI6IDMsXG4gICAgXCJtYXJcIjogMyxcbiAgICBcIm1hci5cIjogMyxcbiAgICBcImFicmlsXCI6IDQsXG4gICAgXCJhYnJcIjogNCxcbiAgICBcImFici5cIjogNCxcbiAgICBcIm1haW9cIjogNSxcbiAgICBcIm1haVwiOiA1LFxuICAgIFwibWFpLlwiOiA1LFxuICAgIFwianVuaG9cIjogNixcbiAgICBcImp1blwiOiA2LFxuICAgIFwianVuLlwiOiA2LFxuICAgIFwianVsaG9cIjogNyxcbiAgICBcImp1bFwiOiA3LFxuICAgIFwianVsLlwiOiA3LFxuICAgIFwiYWdvc3RvXCI6IDgsXG4gICAgXCJhZ29cIjogOCxcbiAgICBcImFnby5cIjogOCxcbiAgICBcInNldGVtYnJvXCI6IDksXG4gICAgXCJzZXRcIjogOSxcbiAgICBcInNldC5cIjogOSxcbiAgICBcIm91dHVicm9cIjogMTAsXG4gICAgXCJvdXRcIjogMTAsXG4gICAgXCJvdXQuXCI6IDEwLFxuICAgIFwibm92ZW1icm9cIjogMTEsXG4gICAgXCJub3ZcIjogMTEsXG4gICAgXCJub3YuXCI6IDExLFxuICAgIFwiZGV6ZW1icm9cIjogMTIsXG4gICAgXCJkZXpcIjogMTIsXG4gICAgXCJkZXouXCI6IDEyLFxufTtcbmV4cG9ydHMuWUVBUl9QQVRURVJOID0gXCJbMC05XXsxLDR9KD8hW15cXFxcc11cXFxcZCkoPzpcXFxccypbYXxkXVxcXFwuP1xcXFxzKmNcXFxcLj98XFxcXHMqYVxcXFwuP1xcXFxzKmRcXFxcLj8pP1wiO1xuZnVuY3Rpb24gcGFyc2VZZWFyKG1hdGNoKSB7XG4gICAgaWYgKG1hdGNoLm1hdGNoKC9eWzAtOV17MSw0fSQvKSkge1xuICAgICAgICBsZXQgeWVhck51bWJlciA9IHBhcnNlSW50KG1hdGNoKTtcbiAgICAgICAgaWYgKHllYXJOdW1iZXIgPCAxMDApIHtcbiAgICAgICAgICAgIGlmICh5ZWFyTnVtYmVyID4gNTApIHtcbiAgICAgICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDE5MDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck51bWJlciArIDIwMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHllYXJOdW1iZXI7XG4gICAgfVxuICAgIGlmIChtYXRjaC5tYXRjaCgvYVxcLj9cXHMqY1xcLj8vaSkpIHtcbiAgICAgICAgbWF0Y2ggPSBtYXRjaC5yZXBsYWNlKC9hXFwuP1xccypjXFwuPy9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIC1wYXJzZUludChtYXRjaCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUludChtYXRjaCk7XG59XG5leHBvcnRzLnBhcnNlWWVhciA9IHBhcnNlWWVhcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCB3ZWVrc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NhbGN1bGF0aW9uL3dlZWtzXCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzooPzpcXFxcLHxcXFxcKHxcXFxc77yIKVxcXFxzKik/XCIgK1xuICAgIFwiKD86KGVzdGV8ZXN0YXxwYXNzYWRvfHByW2/Ds114aW1vKVxcXFxzKik/XCIgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLldFRUtEQVlfRElDVElPTkFSWSl9KWAgK1xuICAgIFwiKD86XFxcXHMqKD86XFxcXCx8XFxcXCl8XFxcXO+8iSkpP1wiICtcbiAgICBcIig/OlxcXFxzKihlc3RlfGVzdGF8cGFzc2Fkb3xwclvDs29deGltbylcXFxccypzZW1hbmEpP1wiICtcbiAgICBcIig/PVxcXFxXfFxcXFxkfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFBSRUZJWF9HUk9VUCA9IDE7XG5jb25zdCBXRUVLREFZX0dST1VQID0gMjtcbmNvbnN0IFBPU1RGSVhfR1JPVVAgPSAzO1xuY2xhc3MgUFRXZWVrZGF5UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBtYXRjaFtXRUVLREFZX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUllbZGF5T2ZXZWVrXTtcbiAgICAgICAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcmVmaXggPSBtYXRjaFtQUkVGSVhfR1JPVVBdO1xuICAgICAgICBjb25zdCBwb3N0Zml4ID0gbWF0Y2hbUE9TVEZJWF9HUk9VUF07XG4gICAgICAgIGxldCBub3JtID0gcHJlZml4IHx8IHBvc3RmaXggfHwgXCJcIjtcbiAgICAgICAgbm9ybSA9IG5vcm0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IG1vZGlmaWVyID0gbnVsbDtcbiAgICAgICAgaWYgKG5vcm0gPT0gXCJwYXNzYWRvXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJ0aGlzXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9ybSA9PSBcInByw7N4aW1vXCIgfHwgbm9ybSA9PSBcInByb3hpbW9cIikge1xuICAgICAgICAgICAgbW9kaWZpZXIgPSBcIm5leHRcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub3JtID09IFwiZXN0ZVwiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwidGhpc1wiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGUgPSB3ZWVrc18xLnRvRGF5SlNXZWVrZGF5KGNvbnRleHQucmVmRGF0ZSwgb2Zmc2V0LCBtb2RpZmllcik7XG4gICAgICAgIHJldHVybiBjb250ZXh0XG4gICAgICAgICAgICAuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKVxuICAgICAgICAgICAgLmFzc2lnbihcIndlZWtkYXlcIiwgb2Zmc2V0KVxuICAgICAgICAgICAgLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKVxuICAgICAgICAgICAgLmltcGx5KFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSlcbiAgICAgICAgICAgIC5pbXBseShcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBUV2Vla2RheVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJcIik7XG5jbGFzcyBQVFRpbWVFeHByZXNzaW9uUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIHByaW1hcnlQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/Oig/OmFvP3zDoHM/fGRhc3xkYXxkZXxkbylcXFxccyopP1wiO1xuICAgIH1cbiAgICBmb2xsb3dpbmdQaGFzZSgpIHtcbiAgICAgICAgcmV0dXJuIFwiXFxcXHMqKD86XFxcXC18XFxcXOKAk3xcXFxcfnxcXFxc44CcfGEoPzpvKT98XFxcXD8pXFxcXHMqXCI7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRUaW1lRXhwcmVzc2lvblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jbGFzcyBQVE1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cXFxccyooPzosfMOgKT9cXFxccyokXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBUTWVyZ2VEYXRlVGltZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jbGFzcyBQVE1lcmdlRGF0ZVJhbmdlUmVmaW5lciBleHRlbmRzIEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiAvXlxccyooPzotKVxccyokL2k7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUFRNZXJnZURhdGVSYW5nZVJlZmluZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHllYXJzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24veWVhcnNcIik7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBjb25zdGFudHNfMiA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAoWzAtOV17MSwyfSkoPzrCunzCqnzCsCk/YCArXG4gICAgXCIoPzpcXFxccyooPzpkZXNkZXxkZXxcXFxcLXxcXFxc4oCTfGFvP3xcXFxccylcXFxccyooWzAtOV17MSwyfSkoPzrCunzCqnzCsCk/KT9cXFxccyooPzpkZSk/XFxcXHMqXCIgK1xuICAgIGAoPzotfC98XFxcXHMqKD86ZGV8LCk/XFxcXHMqKWAgK1xuICAgIGAoJHtwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpfSlgICtcbiAgICBgKD86XFxcXHMqKD86ZGV8LCk/XFxcXHMqKCR7Y29uc3RhbnRzXzIuWUVBUl9QQVRURVJOfSkpP2AgK1xuICAgIGAoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbmNvbnN0IERBVEVfR1JPVVAgPSAxO1xuY29uc3QgREFURV9UT19HUk9VUCA9IDI7XG5jb25zdCBNT05USF9OQU1FX0dST1VQID0gMztcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0pO1xuICAgICAgICBjb25zdCBtb250aCA9IGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUllbbWF0Y2hbTU9OVEhfTkFNRV9HUk9VUF0udG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGNvbnN0IGRheSA9IHBhcnNlSW50KG1hdGNoW0RBVEVfR1JPVVBdKTtcbiAgICAgICAgaWYgKGRheSA+IDMxKSB7XG4gICAgICAgICAgICBtYXRjaC5pbmRleCA9IG1hdGNoLmluZGV4ICsgbWF0Y2hbREFURV9HUk9VUF0ubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKTtcbiAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcImRheVwiLCBkYXkpO1xuICAgICAgICBpZiAobWF0Y2hbWUVBUl9HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXJOdW1iZXIgPSBjb25zdGFudHNfMi5wYXJzZVllYXIobWF0Y2hbWUVBUl9HUk9VUF0pO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmFzc2lnbihcInllYXJcIiwgeWVhck51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIGRheSwgbW9udGgpO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0LmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hbREFURV9UT19HUk9VUF0pIHtcbiAgICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSBwYXJzZUludChtYXRjaFtEQVRFX1RPX0dST1VQXSk7XG4gICAgICAgICAgICByZXN1bHQuZW5kID0gcmVzdWx0LnN0YXJ0LmNsb25lKCk7XG4gICAgICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcImRheVwiLCBlbmREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBUTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHJlZmVyZW5jZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9jYXN1YWxSZWZlcmVuY2VzXCIpKTtcbmNsYXNzIFBUQ2FzdWFsRGF0ZVBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oY29udGV4dCkge1xuICAgICAgICByZXR1cm4gLyhhZ29yYXxob2plfGFtYW5oYXxhbWFuaMOjfG9udGVtKSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgbG93ZXJUZXh0ID0gbWF0Y2hbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBzd2l0Y2ggKGxvd2VyVGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcImFnb3JhXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMubm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwiaG9qZVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwiYW1hbmhhXCI6XG4gICAgICAgICAgICBjYXNlIFwiYW1hbmjDo1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLnRvbW9ycm93KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgICAgICBjYXNlIFwib250ZW1cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy55ZXN0ZXJkYXkoY29udGV4dC5yZWZEYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFBUQ2FzdWFsRGF0ZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IGRheWpzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvZGF5anNcIik7XG5jb25zdCBkYXlqc18yID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jbGFzcyBQVENhc3VhbFRpbWVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gLyg/OmVzdGFcXHMqKT8obWFuaGF8bWFuaMOjfHRhcmRlfG1laWEtbm9pdGV8bWVpby1kaWF8bm9pdGUpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCB0YXJnZXREYXRlID0gZGF5anNfMi5kZWZhdWx0KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgc3dpdGNoIChtYXRjaFsxXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwidGFyZGVcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE1KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJub2l0ZVwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uUE0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMjIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1hbmhhXCI6XG4gICAgICAgICAgICBjYXNlIFwibWFuaMOjXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCA2KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtZWlhLW5vaXRlXCI6XG4gICAgICAgICAgICAgICAgZGF5anNfMS5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAwKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtaW51dGVcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwic2Vjb25kXCIsIDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1laW8tZGlhXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5BTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBQVENhc3VhbFRpbWVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMucGFyc2VEYXRlID0gZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5jYXN1YWwgPSB2b2lkIDA7XG5jb25zdCBjb25maWd1cmF0aW9uc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbmZpZ3VyYXRpb25zXCIpO1xuY29uc3QgY2hyb25vXzEgPSByZXF1aXJlKFwiLi4vLi4vY2hyb25vXCIpO1xuY29uc3QgU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uL2NvbW1vbi9wYXJzZXJzL1NsYXNoRGF0ZUZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBQVFdlZWtkYXlQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL1BUV2Vla2RheVBhcnNlclwiKSk7XG5jb25zdCBQVFRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9QVFRpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IFBUTWVyZ2VEYXRlVGltZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9QVE1lcmdlRGF0ZVRpbWVSZWZpbmVyXCIpKTtcbmNvbnN0IFBUTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvUFRNZXJnZURhdGVSYW5nZVJlZmluZXJcIikpO1xuY29uc3QgUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL1BUTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXCIpKTtcbmNvbnN0IFBUQ2FzdWFsRGF0ZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvUFRDYXN1YWxEYXRlUGFyc2VyXCIpKTtcbmNvbnN0IFBUQ2FzdWFsVGltZVBhcnNlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3BhcnNlcnMvUFRDYXN1YWxUaW1lUGFyc2VyXCIpKTtcbmV4cG9ydHMuY2FzdWFsID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKCkpO1xuZXhwb3J0cy5zdHJpY3QgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNvbmZpZ3VyYXRpb24odHJ1ZSkpO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbmZ1bmN0aW9uIGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24obGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIGNvbnN0IG9wdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb24oZmFsc2UsIGxpdHRsZUVuZGlhbik7XG4gICAgb3B0aW9uLnBhcnNlcnMucHVzaChuZXcgUFRDYXN1YWxEYXRlUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy5wdXNoKG5ldyBQVENhc3VhbFRpbWVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIHJldHVybiBvcHRpb247XG59XG5leHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uO1xuZnVuY3Rpb24gY3JlYXRlQ29uZmlndXJhdGlvbihzdHJpY3RNb2RlID0gdHJ1ZSwgbGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uc18xLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICAgICAgbmV3IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQobGl0dGxlRW5kaWFuKSxcbiAgICAgICAgICAgIG5ldyBQVFdlZWtkYXlQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgUFRUaW1lRXhwcmVzc2lvblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBQVE1vbnRoTmFtZUxpdHRsZUVuZGlhblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVmaW5lcnM6IFtuZXcgUFRNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQoKSwgbmV3IFBUTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpXSxcbiAgICB9LCBzdHJpY3RNb2RlKTtcbn1cbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9yZWZpbmVycy9BYnN0cmFjdE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jbGFzcyBOTE1lcmdlRGF0ZVJhbmdlUmVmaW5lciBleHRlbmRzIEFic3RyYWN0TWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCB7XG4gICAgcGF0dGVybkJldHdlZW4oKSB7XG4gICAgICAgIHJldHVybiAvXlxccyoodG90fC0pXFxzKiQvaTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTE1lcmdlRGF0ZVJhbmdlUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcmVmaW5lcnMvQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jbGFzcyBOTE1lcmdlRGF0ZVRpbWVSZWZpbmVyIGV4dGVuZHMgQWJzdHJhY3RNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQge1xuICAgIHBhdHRlcm5CZXR3ZWVuKCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl5cXFxccyoob218bmF8dm9vcnxpbiBkZXwsfC0pP1xcXFxzKiRcIik7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gTkxNZXJnZURhdGVUaW1lUmVmaW5lcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCByZWZlcmVuY2VzID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vY2FzdWFsUmVmZXJlbmNlc1wiKSk7XG5jbGFzcyBOTENhc3VhbERhdGVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIC8obnV8dmFuZGFhZ3xtb3JnZW58bW9yZ2VuZHxnaXN0ZXJlbikoPz1cXFd8JCkvaTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGxvd2VyVGV4dCA9IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgc3dpdGNoIChsb3dlclRleHQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJudVwiOlxuICAgICAgICAgICAgICAgIHJldHVybiByZWZlcmVuY2VzLm5vdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcInZhbmRhYWdcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy50b2RheShjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcIm1vcmdlblwiOlxuICAgICAgICAgICAgY2FzZSBcIm1vcmdlbmRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlcy50b21vcnJvdyhjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICAgICAgY2FzZSBcImdpc3RlcmVuXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlZmVyZW5jZXMueWVzdGVyZGF5KGNvbnRleHQucmVmRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTENhc3VhbERhdGVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vaW5kZXhcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBkYXlqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBkYXlqc18yID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzL2RheWpzXCIpO1xuY29uc3QgREFZX0dST1VQID0gMTtcbmNvbnN0IE1PTUVOVF9HUk9VUCA9IDI7XG5jbGFzcyBOTENhc3VhbFRpbWVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gLyhkZXplKT9cXHMqKG5hbWlkZGFnfGF2b25kfG1pZGRlcm5hY2h0fG9jaHRlbmR8bWlkZGFnfCdzIG1pZGRhZ3N8J3MgYXZvbmRzfCdzIG9jaHRlbmRzKSg/PVxcV3wkKS9pO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzEuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKCk7XG4gICAgICAgIGlmIChtYXRjaFtEQVlfR1JPVVBdID09PSBcImRlemVcIikge1xuICAgICAgICAgICAgY29tcG9uZW50LmFzc2lnbihcImRheVwiLCBjb250ZXh0LnJlZkRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5hc3NpZ24oXCJtb250aFwiLCBjb250ZXh0LnJlZkRhdGUuZ2V0TW9udGgoKSArIDEpO1xuICAgICAgICAgICAgY29tcG9uZW50LmFzc2lnbihcInllYXJcIiwgY29udGV4dC5yZWZEYXRlLmdldEZ1bGxZZWFyKCkpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAobWF0Y2hbTU9NRU5UX0dST1VQXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICBjYXNlIFwibmFtaWRkYWdcIjpcbiAgICAgICAgICAgIGNhc2UgXCIncyBuYW1pZGRhZ3NcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDE1KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhdm9uZFwiOlxuICAgICAgICAgICAgY2FzZSBcIidzIGF2b25kcydcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDIwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJtaWRkZXJuYWNodFwiOlxuICAgICAgICAgICAgICAgIGRheWpzXzIuYXNzaWduVGhlTmV4dERheShjb21wb25lbnQsIHRhcmdldERhdGUpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWludXRlXCIsIDApO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcInNlY29uZFwiLCAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJvY2h0ZW5kXCI6XG4gICAgICAgICAgICBjYXNlIFwiJ3Mgb2NodGVuZHNcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pZGRhZ1wiOlxuICAgICAgICAgICAgY2FzZSBcIidzIG1pZGRhZ3NcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDEyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MQ2FzdWFsVGltZVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZVRpbWVVbml0cyA9IGV4cG9ydHMuVElNRV9VTklUU19QQVRURVJOID0gZXhwb3J0cy5wYXJzZVllYXIgPSBleHBvcnRzLllFQVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IGV4cG9ydHMuT1JESU5BTF9OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gZXhwb3J0cy5OVU1CRVJfUEFUVEVSTiA9IGV4cG9ydHMuVElNRV9VTklUX0RJQ1RJT05BUlkgPSBleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZID0gZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWSA9IGV4cG9ydHMuTU9OVEhfRElDVElPTkFSWSA9IGV4cG9ydHMuV0VFS0RBWV9ESUNUSU9OQVJZID0gdm9pZCAwO1xuY29uc3QgcGF0dGVybl8xID0gcmVxdWlyZShcIi4uLy4uL3V0aWxzL3BhdHRlcm5cIik7XG5jb25zdCB5ZWFyc18xID0gcmVxdWlyZShcIi4uLy4uL2NhbGN1bGF0aW9uL3llYXJzXCIpO1xuZXhwb3J0cy5XRUVLREFZX0RJQ1RJT05BUlkgPSB7XG4gICAgem9uZGFnOiAwLFxuICAgIHpvbjogMCxcbiAgICBcInpvbi5cIjogMCxcbiAgICB6bzogMCxcbiAgICBcInpvLlwiOiAwLFxuICAgIG1hYW5kYWc6IDEsXG4gICAgbWE6IDEsXG4gICAgXCJtYS5cIjogMSxcbiAgICBkaW5zZGFnOiAyLFxuICAgIGRpbjogMixcbiAgICBcImRpbi5cIjogMixcbiAgICBkaTogMixcbiAgICBcImRpLlwiOiAyLFxuICAgIHdvZW5zZGFnOiAzLFxuICAgIHdvZTogMyxcbiAgICBcIndvZS5cIjogMyxcbiAgICB3bzogMyxcbiAgICBcIndvLlwiOiAzLFxuICAgIGRvbmRlcmRhZzogNCxcbiAgICBkb25kOiA0LFxuICAgIFwiZG9uZC5cIjogNCxcbiAgICBkbzogNCxcbiAgICBcImRvLlwiOiA0LFxuICAgIHZyaWpkYWc6IDUsXG4gICAgdnJpajogNSxcbiAgICBcInZyaWouXCI6IDUsXG4gICAgdnI6IDUsXG4gICAgXCJ2ci5cIjogNSxcbiAgICB6YXRlcmRhZzogNixcbiAgICB6YXQ6IDYsXG4gICAgXCJ6YXQuXCI6IDYsXG4gICAgXCJ6YVwiOiA2LFxuICAgIFwiemEuXCI6IDYsXG59O1xuZXhwb3J0cy5NT05USF9ESUNUSU9OQVJZID0ge1xuICAgIGphbnVhcmk6IDEsXG4gICAgamFuOiAxLFxuICAgIFwiamFuLlwiOiAxLFxuICAgIGZlYnJ1YXJpOiAyLFxuICAgIGZlYjogMixcbiAgICBcImZlYi5cIjogMixcbiAgICBtYWFydDogMyxcbiAgICBtYXI6IDMsXG4gICAgXCJtYXIuXCI6IDMsXG4gICAgYXByaWw6IDQsXG4gICAgYXByOiA0LFxuICAgIFwiYXByLlwiOiA0LFxuICAgIG1laTogNSxcbiAgICBqdW5pOiA2LFxuICAgIGp1bjogNixcbiAgICBcImp1bi5cIjogNixcbiAgICBqdWxpOiA3LFxuICAgIGp1bDogNyxcbiAgICBcImp1bC5cIjogNyxcbiAgICBhdWd1c3R1czogOCxcbiAgICBhdWc6IDgsXG4gICAgXCJhdWcuXCI6IDgsXG4gICAgc2VwdGVtYmVyOiA5LFxuICAgIHNlcDogOSxcbiAgICBcInNlcC5cIjogOSxcbiAgICBzZXB0OiA5LFxuICAgIFwic2VwdC5cIjogOSxcbiAgICBva3RvYmVyOiAxMCxcbiAgICBva3Q6IDEwLFxuICAgIFwib2t0LlwiOiAxMCxcbiAgICBub3ZlbWJlcjogMTEsXG4gICAgbm92OiAxMSxcbiAgICBcIm5vdi5cIjogMTEsXG4gICAgZGVjZW1iZXI6IDEyLFxuICAgIGRlYzogMTIsXG4gICAgXCJkZWMuXCI6IDEyLFxufTtcbmV4cG9ydHMuSU5URUdFUl9XT1JEX0RJQ1RJT05BUlkgPSB7XG4gICAgZWVuOiAxLFxuICAgIHR3ZWU6IDIsXG4gICAgZHJpZTogMyxcbiAgICB2aWVyOiA0LFxuICAgIHZpamY6IDUsXG4gICAgemVzOiA2LFxuICAgIHpldmVuOiA3LFxuICAgIGFjaHQ6IDgsXG4gICAgbmVnZW46IDksXG4gICAgdGllbjogMTAsXG4gICAgZWxmOiAxMSxcbiAgICB0d2FhbGY6IDEyLFxufTtcbmV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUlkgPSB7XG4gICAgZWVyc3RlOiAxLFxuICAgIHR3ZWVkZTogMixcbiAgICBkZXJkZTogMyxcbiAgICB2aWVyZGU6IDQsXG4gICAgdmlqZmRlOiA1LFxuICAgIHplc2RlOiA2LFxuICAgIHpldmVuZGU6IDcsXG4gICAgYWNodHN0ZTogOCxcbiAgICBuZWdlbmRlOiA5LFxuICAgIHRpZW5kZTogMTAsXG4gICAgZWxmZGU6IDExLFxuICAgIHR3YWFsZmRlOiAxMixcbiAgICBkZXJ0aWVuZGU6IDEzLFxuICAgIHZlZXJ0aWVuZGU6IDE0LFxuICAgIHZpamZ0aWVuZGU6IDE1LFxuICAgIHplc3RpZW5kZTogMTYsXG4gICAgemV2ZW50aWVuZGU6IDE3LFxuICAgIGFjaHR0aWVuZGU6IDE4LFxuICAgIG5lZ2VudGllbmRlOiAxOSxcbiAgICB0d2ludGlnc3RlOiAyMCxcbiAgICBcImVlbmVudHdpbnRpZ3N0ZVwiOiAyMSxcbiAgICBcInR3ZWXDq250d2ludGlnc3RlXCI6IDIyLFxuICAgIFwiZHJpZWVudHdpbnRpZ3N0ZVwiOiAyMyxcbiAgICBcInZpZXJlbnR3aW50aWdzdGVcIjogMjQsXG4gICAgXCJ2aWpmZW50d2ludGlnc3RlXCI6IDI1LFxuICAgIFwiemVzZW50d2ludGlnc3RlXCI6IDI2LFxuICAgIFwiemV2ZW5lbnR3aW50aWdzdGVcIjogMjcsXG4gICAgXCJhY2h0ZW50d2ludGlnXCI6IDI4LFxuICAgIFwibmVnZW5lbnR3aW50aWdcIjogMjksXG4gICAgXCJkZXJ0aWdzdGVcIjogMzAsXG4gICAgXCJlZW5lbmRlcnRpZ3N0ZVwiOiAzMSxcbn07XG5leHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZID0ge1xuICAgIHNlYzogXCJzZWNvbmRcIixcbiAgICBzZWNvbmQ6IFwic2Vjb25kXCIsXG4gICAgc2Vjb25kZW46IFwic2Vjb25kXCIsXG4gICAgbWluOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnM6IFwibWludXRlXCIsXG4gICAgbWludXRlOiBcIm1pbnV0ZVwiLFxuICAgIG1pbnV0ZW46IFwibWludXRlXCIsXG4gICAgaDogXCJob3VyXCIsXG4gICAgaHI6IFwiaG91clwiLFxuICAgIGhyczogXCJob3VyXCIsXG4gICAgdXVyOiBcImhvdXJcIixcbiAgICB1cmVuOiBcImhvdXJcIixcbiAgICBkYWc6IFwiZFwiLFxuICAgIGRhZ2VuOiBcImRcIixcbiAgICB3ZWVrOiBcIndlZWtcIixcbiAgICB3ZWtlbjogXCJ3ZWVrXCIsXG4gICAgbWFhbmQ6IFwibW9udGhcIixcbiAgICBtYWFuZGVuOiBcIm1vbnRoXCIsXG4gICAgamFhcjogXCJ5ZWFyXCIsXG4gICAganI6IFwieWVhclwiLFxuICAgIGphcmVuOiBcInllYXJcIixcbn07XG5leHBvcnRzLk5VTUJFUl9QQVRURVJOID0gYCg/OiR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZKX18WzAtOV0rfFswLTldK1xcXFwuWzAtOV0rfGVlbj98aGFsdmU/KWA7XG5mdW5jdGlvbiBwYXJzZU51bWJlclBhdHRlcm4obWF0Y2gpIHtcbiAgICBjb25zdCBudW0gPSBtYXRjaC50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChleHBvcnRzLklOVEVHRVJfV09SRF9ESUNUSU9OQVJZW251bV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5JTlRFR0VSX1dPUkRfRElDVElPTkFSWVtudW1dO1xuICAgIH1cbiAgICBlbHNlIGlmIChudW0gPT09IFwiZWVuXCIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGVsc2UgaWYgKG51bS5tYXRjaCgvaGFsdmU/LykpIHtcbiAgICAgICAgcmV0dXJuIDAuNTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtKTtcbn1cbmV4cG9ydHMucGFyc2VOdW1iZXJQYXR0ZXJuID0gcGFyc2VOdW1iZXJQYXR0ZXJuO1xuZXhwb3J0cy5PUkRJTkFMX05VTUJFUl9QQVRURVJOID0gYCg/OiR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZKX18WzAtOV17MSwyfSg/OnN0ZXxkZSk/KWA7XG5mdW5jdGlvbiBwYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuKG1hdGNoKSB7XG4gICAgbGV0IG51bSA9IG1hdGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGV4cG9ydHMuT1JESU5BTF9XT1JEX0RJQ1RJT05BUllbbnVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLk9SRElOQUxfV09SRF9ESUNUSU9OQVJZW251bV07XG4gICAgfVxuICAgIG51bSA9IG51bS5yZXBsYWNlKC8oPzpzdGV8ZGUpJC9pLCBcIlwiKTtcbiAgICByZXR1cm4gcGFyc2VJbnQobnVtKTtcbn1cbmV4cG9ydHMucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybiA9IHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm47XG5leHBvcnRzLllFQVJfUEFUVEVSTiA9IGAoPzpbMS05XVswLTldezAsM31cXFxccyooPzp2b29yIENocmlzdHVzfG5hIENocmlzdHVzKXxbMS0yXVswLTldezN9fFs1LTldWzAtOV0pYDtcbmZ1bmN0aW9uIHBhcnNlWWVhcihtYXRjaCkge1xuICAgIGlmICgvdm9vciBDaHJpc3R1cy9pLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIG1hdGNoID0gbWF0Y2gucmVwbGFjZSgvdm9vciBDaHJpc3R1cy9pLCBcIlwiKTtcbiAgICAgICAgcmV0dXJuIC1wYXJzZUludChtYXRjaCk7XG4gICAgfVxuICAgIGlmICgvbmEgQ2hyaXN0dXMvaS50ZXN0KG1hdGNoKSkge1xuICAgICAgICBtYXRjaCA9IG1hdGNoLnJlcGxhY2UoL25hIENocmlzdHVzL2ksIFwiXCIpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQobWF0Y2gpO1xuICAgIH1cbiAgICBjb25zdCByYXdZZWFyTnVtYmVyID0gcGFyc2VJbnQobWF0Y2gpO1xuICAgIHJldHVybiB5ZWFyc18xLmZpbmRNb3N0TGlrZWx5QURZZWFyKHJhd1llYXJOdW1iZXIpO1xufVxuZXhwb3J0cy5wYXJzZVllYXIgPSBwYXJzZVllYXI7XG5jb25zdCBTSU5HTEVfVElNRV9VTklUX1BBVFRFUk4gPSBgKCR7ZXhwb3J0cy5OVU1CRVJfUEFUVEVSTn0pXFxcXHN7MCw1fSgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oZXhwb3J0cy5USU1FX1VOSVRfRElDVElPTkFSWSl9KVxcXFxzezAsNX1gO1xuY29uc3QgU0lOR0xFX1RJTUVfVU5JVF9SRUdFWCA9IG5ldyBSZWdFeHAoU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOLCBcImlcIik7XG5leHBvcnRzLlRJTUVfVU5JVFNfUEFUVEVSTiA9IHBhdHRlcm5fMS5yZXBlYXRlZFRpbWV1bml0UGF0dGVybihgKD86KD86YmlubmVufGluKVxcXFxzKik/YCwgU0lOR0xFX1RJTUVfVU5JVF9QQVRURVJOKTtcbmZ1bmN0aW9uIHBhcnNlVGltZVVuaXRzKHRpbWV1bml0VGV4dCkge1xuICAgIGNvbnN0IGZyYWdtZW50cyA9IHt9O1xuICAgIGxldCByZW1haW5pbmdUZXh0ID0gdGltZXVuaXRUZXh0O1xuICAgIGxldCBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgY29sbGVjdERhdGVUaW1lRnJhZ21lbnQoZnJhZ21lbnRzLCBtYXRjaCk7XG4gICAgICAgIHJlbWFpbmluZ1RleHQgPSByZW1haW5pbmdUZXh0LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICBtYXRjaCA9IFNJTkdMRV9USU1FX1VOSVRfUkVHRVguZXhlYyhyZW1haW5pbmdUZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGZyYWdtZW50cztcbn1cbmV4cG9ydHMucGFyc2VUaW1lVW5pdHMgPSBwYXJzZVRpbWVVbml0cztcbmZ1bmN0aW9uIGNvbGxlY3REYXRlVGltZUZyYWdtZW50KGZyYWdtZW50cywgbWF0Y2gpIHtcbiAgICBjb25zdCBudW0gPSBwYXJzZU51bWJlclBhdHRlcm4obWF0Y2hbMV0pO1xuICAgIGNvbnN0IHVuaXQgPSBleHBvcnRzLlRJTUVfVU5JVF9ESUNUSU9OQVJZW21hdGNoWzJdLnRvTG93ZXJDYXNlKCldO1xuICAgIGZyYWdtZW50c1t1bml0XSA9IG51bTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgcmVzdWx0c18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3Jlc3VsdHNcIik7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jbGFzcyBOTFRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYCg/OmJpbm5lbnxpbnxiaW5uZW4gZGV8dm9vcilcXFxccypgICsgXCIoXCIgKyBjb25zdGFudHNfMS5USU1FX1VOSVRTX1BBVFRFUk4gKyBcIilcIiArIGAoPz1cXFxcV3wkKWAsIFwiaVwiKTtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IHRpbWVVbml0cyA9IGNvbnN0YW50c18xLnBhcnNlVGltZVVuaXRzKG1hdGNoWzFdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNfMS5QYXJzaW5nQ29tcG9uZW50cy5jcmVhdGVSZWxhdGl2ZUZyb21SZWZEYXRlKGNvbnRleHQucmVmRGF0ZSwgdGltZVVuaXRzKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTFRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9ubC9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IHdlZWtzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY2FsY3VsYXRpb24vd2Vla3NcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIig/Oig/OlxcXFwsfFxcXFwofFxcXFzvvIgpXFxcXHMqKT9cIiArXG4gICAgXCIoPzpvcFxcXFxzKj8pP1wiICtcbiAgICBcIig/OihkZXplfHZvcmlnZXx2b2xnZW5kZSlcXFxccyooPzp3ZWVrXFxcXHMqKT8pP1wiICtcbiAgICBgKCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUlkpfSlgICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFBSRUZJWF9HUk9VUCA9IDE7XG5jb25zdCBXRUVLREFZX0dST1VQID0gMjtcbmNvbnN0IFBPU1RGSVhfR1JPVVAgPSAzO1xuY2xhc3MgTkxXZWVrZGF5UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBtYXRjaFtXRUVLREFZX0dST1VQXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBjb25zdGFudHNfMS5XRUVLREFZX0RJQ1RJT05BUllbZGF5T2ZXZWVrXTtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gbWF0Y2hbUFJFRklYX0dST1VQXTtcbiAgICAgICAgY29uc3QgcG9zdGZpeCA9IG1hdGNoW1BPU1RGSVhfR1JPVVBdO1xuICAgICAgICBsZXQgbW9kaWZpZXJXb3JkID0gcHJlZml4IHx8IHBvc3RmaXg7XG4gICAgICAgIG1vZGlmaWVyV29yZCA9IG1vZGlmaWVyV29yZCB8fCBcIlwiO1xuICAgICAgICBtb2RpZmllcldvcmQgPSBtb2RpZmllcldvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IG1vZGlmaWVyID0gbnVsbDtcbiAgICAgICAgaWYgKG1vZGlmaWVyV29yZCA9PSBcInZvcmlnZVwiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwibGFzdFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1vZGlmaWVyV29yZCA9PSBcInZvbGdlbmRlXCIpIHtcbiAgICAgICAgICAgIG1vZGlmaWVyID0gXCJuZXh0XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobW9kaWZpZXJXb3JkID09IFwiZGV6ZVwiKSB7XG4gICAgICAgICAgICBtb2RpZmllciA9IFwidGhpc1wiO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGUgPSB3ZWVrc18xLnRvRGF5SlNXZWVrZGF5KGNvbnRleHQucmVmRGF0ZSwgb2Zmc2V0LCBtb2RpZmllcik7XG4gICAgICAgIHJldHVybiBjb250ZXh0XG4gICAgICAgICAgICAuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKVxuICAgICAgICAgICAgLmFzc2lnbihcIndlZWtkYXlcIiwgb2Zmc2V0KVxuICAgICAgICAgICAgLmltcGx5KFwiZGF5XCIsIGRhdGUuZGF0ZSgpKVxuICAgICAgICAgICAgLmltcGx5KFwibW9udGhcIiwgZGF0ZS5tb250aCgpICsgMSlcbiAgICAgICAgICAgIC5pbXBseShcInllYXJcIiwgZGF0ZS55ZWFyKCkpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MV2Vla2RheVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IGNvbnN0YW50c18xID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18yID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IGNvbnN0YW50c18zID0gcmVxdWlyZShcIi4uL2NvbnN0YW50c1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoXCIoPzpvblxcXFxzKj8pP1wiICtcbiAgICBgKCR7Y29uc3RhbnRzXzIuT1JESU5BTF9OVU1CRVJfUEFUVEVSTn0pYCArXG4gICAgXCIoPzpcXFxccypcIiArXG4gICAgXCIoPzp0b3R8XFxcXC18XFxcXOKAk3x1bnRpbHx0aHJvdWdofHRpbGx8XFxcXHMpXFxcXHMqXCIgK1xuICAgIGAoJHtjb25zdGFudHNfMi5PUkRJTkFMX05VTUJFUl9QQVRURVJOfSlgICtcbiAgICBcIik/XCIgK1xuICAgIFwiKD86LXwvfFxcXFxzKig/Om9mKT9cXFxccyopXCIgK1xuICAgIFwiKFwiICtcbiAgICBwYXR0ZXJuXzEubWF0Y2hBbnlQYXR0ZXJuKGNvbnN0YW50c18xLk1PTlRIX0RJQ1RJT05BUlkpICtcbiAgICBcIilcIiArXG4gICAgXCIoPzpcIiArXG4gICAgXCIoPzotfC98LD9cXFxccyopXCIgK1xuICAgIGAoJHtjb25zdGFudHNfMy5ZRUFSX1BBVFRFUk59KD8hW15cXFxcc11cXFxcZCkpYCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAzO1xuY29uc3QgREFURV9HUk9VUCA9IDE7XG5jb25zdCBEQVRFX1RPX0dST1VQID0gMjtcbmNvbnN0IFlFQVJfR1JPVVAgPSA0O1xuY2xhc3MgTkxNb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKCkge1xuICAgICAgICByZXR1cm4gUEFUVEVSTjtcbiAgICB9XG4gICAgaW5uZXJFeHRyYWN0KGNvbnRleHQsIG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgZGF5ID0gY29uc3RhbnRzXzIucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaFtEQVRFX0dST1VQXSk7XG4gICAgICAgIGlmIChkYXkgPiAzMSkge1xuICAgICAgICAgICAgbWF0Y2guaW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoW0RBVEVfR1JPVVBdLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSBjb250ZXh0LmNyZWF0ZVBhcnNpbmdDb21wb25lbnRzKHtcbiAgICAgICAgICAgIGRheTogZGF5LFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG1hdGNoW1lFQVJfR1JPVVBdKSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0gY29uc3RhbnRzXzMucGFyc2VZZWFyKG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuYXNzaWduKFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSB5ZWFyc18xLmZpbmRZZWFyQ2xvc2VzdFRvUmVmKGNvbnRleHQucmVmRGF0ZSwgZGF5LCBtb250aCk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmltcGx5KFwieWVhclwiLCB5ZWFyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1hdGNoW0RBVEVfVE9fR1JPVVBdKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50cztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbmREYXRlID0gY29uc3RhbnRzXzIucGFyc2VPcmRpbmFsTnVtYmVyUGF0dGVybihtYXRjaFtEQVRFX1RPX0dST1VQXSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ1Jlc3VsdChtYXRjaC5pbmRleCwgbWF0Y2hbMF0pO1xuICAgICAgICByZXN1bHQuc3RhcnQgPSBjb21wb25lbnRzO1xuICAgICAgICByZXN1bHQuZW5kID0gY29tcG9uZW50cy5jbG9uZSgpO1xuICAgICAgICByZXN1bHQuZW5kLmFzc2lnbihcImRheVwiLCBlbmREYXRlKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTE1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgeWVhcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jYWxjdWxhdGlvbi95ZWFyc1wiKTtcbmNvbnN0IHBhdHRlcm5fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlscy9wYXR0ZXJuXCIpO1xuY29uc3QgY29uc3RhbnRzXzIgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgUEFUVEVSTiA9IG5ldyBSZWdFeHAoYCgke3BhdHRlcm5fMS5tYXRjaEFueVBhdHRlcm4oY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWSl9KWAgK1xuICAgIGBcXFxccypgICtcbiAgICBgKD86YCArXG4gICAgYFssLV0/XFxcXHMqKCR7Y29uc3RhbnRzXzIuWUVBUl9QQVRURVJOfSk/YCArXG4gICAgXCIpP1wiICtcbiAgICBcIig/PVteXFxcXHNcXFxcd118XFxcXHMrW14wLTldfFxcXFxzKyR8JClcIiwgXCJpXCIpO1xuY29uc3QgTU9OVEhfTkFNRV9HUk9VUCA9IDE7XG5jb25zdCBZRUFSX0dST1VQID0gMjtcbmNsYXNzIE5MTW9udGhOYW1lUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBjb21wb25lbnRzID0gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpO1xuICAgICAgICBjb21wb25lbnRzLmltcGx5KFwiZGF5XCIsIDEpO1xuICAgICAgICBjb25zdCBtb250aE5hbWUgPSBtYXRjaFtNT05USF9OQU1FX0dST1VQXTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZW21vbnRoTmFtZS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29tcG9uZW50cy5hc3NpZ24oXCJtb250aFwiLCBtb250aCk7XG4gICAgICAgIGlmIChtYXRjaFtZRUFSX0dST1VQXSkge1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IGNvbnN0YW50c18yLnBhcnNlWWVhcihtYXRjaFtZRUFSX0dST1VQXSk7XG4gICAgICAgICAgICBjb21wb25lbnRzLmFzc2lnbihcInllYXJcIiwgeWVhcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyID0geWVhcnNfMS5maW5kWWVhckNsb3Nlc3RUb1JlZihjb250ZXh0LnJlZkRhdGUsIDEsIG1vbnRoKTtcbiAgICAgICAgICAgIGNvbXBvbmVudHMuaW1wbHkoXCJ5ZWFyXCIsIHllYXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRzO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MTW9udGhOYW1lUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9jb21tb24vcGFyc2Vycy9BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlcIik7XG5jb25zdCBQQVRURVJOID0gbmV3IFJlZ0V4cChcIihbMC05XXwwWzEtOV18MVswMTJdKS8oWzAtOV17NH0pXCIgKyBcIlwiLCBcImlcIik7XG5jb25zdCBNT05USF9HUk9VUCA9IDE7XG5jb25zdCBZRUFSX0dST1VQID0gMjtcbmNsYXNzIE5MU2xhc2hNb250aEZvcm1hdFBhcnNlciBleHRlbmRzIEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xLkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeUNoZWNraW5nIHtcbiAgICBpbm5lclBhdHRlcm4oKSB7XG4gICAgICAgIHJldHVybiBQQVRURVJOO1xuICAgIH1cbiAgICBpbm5lckV4dHJhY3QoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgY29uc3QgeWVhciA9IHBhcnNlSW50KG1hdGNoW1lFQVJfR1JPVVBdKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChtYXRjaFtNT05USF9HUk9VUF0pO1xuICAgICAgICByZXR1cm4gY29udGV4dC5jcmVhdGVQYXJzaW5nQ29tcG9uZW50cygpLmltcGx5KFwiZGF5XCIsIDEpLmFzc2lnbihcIm1vbnRoXCIsIG1vbnRoKS5hc3NpZ24oXCJ5ZWFyXCIsIHllYXIpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MU2xhc2hNb250aEZvcm1hdFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXJcIik7XG5jbGFzcyBOTFRpbWVFeHByZXNzaW9uUGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RUaW1lRXhwcmVzc2lvblBhcnNlcl8xLkFic3RyYWN0VGltZUV4cHJlc3Npb25QYXJzZXIge1xuICAgIHByaW1hcnlQcmVmaXgoKSB7XG4gICAgICAgIHJldHVybiBcIig/Oig/Om9tKVxcXFxzKik/XCI7XG4gICAgfVxuICAgIGZvbGxvd2luZ1BoYXNlKCkge1xuICAgICAgICByZXR1cm4gXCJcXFxccyooPzpcXFxcLXxcXFxc4oCTfFxcXFx+fFxcXFzjgJx8b218XFxcXD8pXFxcXHMqXCI7XG4gICAgfVxuICAgIGV4dHJhY3RQcmltYXJ5VGltZUNvbXBvbmVudHMoY29udGV4dCwgbWF0Y2gpIHtcbiAgICAgICAgaWYgKG1hdGNoWzBdLm1hdGNoKC9eXFxzKlxcZHs0fVxccyokLykpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5leHRyYWN0UHJpbWFyeVRpbWVDb21wb25lbnRzKGNvbnRleHQsIG1hdGNoKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTFRpbWVFeHByZXNzaW9uUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG5jb25zdCBwYXR0ZXJuXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvcGF0dGVyblwiKTtcbmNvbnN0IEFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL2NvbW1vbi9wYXJzZXJzL0Fic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeVwiKTtcbmNvbnN0IFBBVFRFUk4gPSBuZXcgUmVnRXhwKGAoWzAtOV17NH0pW1xcXFwuXFxcXC9cXFxcc11gICtcbiAgICBgKD86KCR7cGF0dGVybl8xLm1hdGNoQW55UGF0dGVybihjb25zdGFudHNfMS5NT05USF9ESUNUSU9OQVJZKX0pfChbMC05XXsxLDJ9KSlbXFxcXC5cXFxcL1xcXFxzXWAgK1xuICAgIGAoWzAtOV17MSwyfSlgICtcbiAgICBcIig/PVxcXFxXfCQpXCIsIFwiaVwiKTtcbmNvbnN0IFlFQVJfTlVNQkVSX0dST1VQID0gMTtcbmNvbnN0IE1PTlRIX05BTUVfR1JPVVAgPSAyO1xuY29uc3QgTU9OVEhfTlVNQkVSX0dST1VQID0gMztcbmNvbnN0IERBVEVfTlVNQkVSX0dST1VQID0gNDtcbmNsYXNzIE5MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyIGV4dGVuZHMgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEuQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5Q2hlY2tpbmcge1xuICAgIGlubmVyUGF0dGVybigpIHtcbiAgICAgICAgcmV0dXJuIFBBVFRFUk47XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBtb250aCA9IG1hdGNoW01PTlRIX05VTUJFUl9HUk9VUF1cbiAgICAgICAgICAgID8gcGFyc2VJbnQobWF0Y2hbTU9OVEhfTlVNQkVSX0dST1VQXSlcbiAgICAgICAgICAgIDogY29uc3RhbnRzXzEuTU9OVEhfRElDVElPTkFSWVttYXRjaFtNT05USF9OQU1FX0dST1VQXS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgaWYgKG1vbnRoIDwgMSB8fCBtb250aCA+IDEyKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQobWF0Y2hbWUVBUl9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgY29uc3QgZGF5ID0gcGFyc2VJbnQobWF0Y2hbREFURV9OVU1CRVJfR1JPVVBdKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRheTogZGF5LFxuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBOTENhc3VhbFllYXJNb250aERheVBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vY29tbW9uL3BhcnNlcnMvQWJzdHJhY3RQYXJzZXJXaXRoV29yZEJvdW5kYXJ5XCIpO1xuY29uc3QgaW5kZXhfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9pbmRleFwiKTtcbmNvbnN0IGRheWpzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHMvZGF5anNcIik7XG5jb25zdCBkYXlqc18yID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkYXlqc1wiKSk7XG5jb25zdCBEQVRFX0dST1VQID0gMTtcbmNvbnN0IFRJTUVfT0ZfREFZX0dST1VQID0gMjtcbmNsYXNzIE5MQ2FzdWFsRGF0ZVRpbWVQYXJzZXIgZXh0ZW5kcyBBYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlfMS5BYnN0cmFjdFBhcnNlcldpdGhXb3JkQm91bmRhcnlDaGVja2luZyB7XG4gICAgaW5uZXJQYXR0ZXJuKGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIC8oZ2lzdGVyZW58bW9yZ2VufHZhbikob2NodGVuZHxtaWRkYWd8bmFtaWRkYWd8YXZvbmR8bmFjaHQpKD89XFxXfCQpL2k7XG4gICAgfVxuICAgIGlubmVyRXh0cmFjdChjb250ZXh0LCBtYXRjaCkge1xuICAgICAgICBjb25zdCBkYXRlVGV4dCA9IG1hdGNoW0RBVEVfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IHRpbWVUZXh0ID0gbWF0Y2hbVElNRV9PRl9EQVlfR1JPVVBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbnRleHQuY3JlYXRlUGFyc2luZ0NvbXBvbmVudHMoKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0RGF0ZSA9IGRheWpzXzIuZGVmYXVsdChjb250ZXh0LnJlZkRhdGUpO1xuICAgICAgICBzd2l0Y2ggKGRhdGVUZXh0KSB7XG4gICAgICAgICAgICBjYXNlIFwiZ2lzdGVyZW5cIjpcbiAgICAgICAgICAgICAgICBkYXlqc18xLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZS5hZGQoLTEsIFwiZGF5XCIpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ2YW5cIjpcbiAgICAgICAgICAgICAgICBkYXlqc18xLmFzc2lnblNpbWlsYXJEYXRlKGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwibW9yZ2VuXCI6XG4gICAgICAgICAgICAgICAgZGF5anNfMS5hc3NpZ25UaGVOZXh0RGF5KGNvbXBvbmVudCwgdGFyZ2V0RGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aW1lVGV4dCkge1xuICAgICAgICAgICAgY2FzZSBcIm9jaHRlbmRcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLkFNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDYpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm1pZGRhZ1wiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcIm1lcmlkaWVtXCIsIGluZGV4XzEuTWVyaWRpZW0uQU0pO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbXBseShcImhvdXJcIiwgMTIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIm5hbWlkZGFnXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwibWVyaWRpZW1cIiwgaW5kZXhfMS5NZXJpZGllbS5QTSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmltcGx5KFwiaG91clwiLCAxNSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYXZvbmRcIjpcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJtZXJpZGllbVwiLCBpbmRleF8xLk1lcmlkaWVtLlBNKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuaW1wbHkoXCJob3VyXCIsIDIwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IE5MQ2FzdWFsRGF0ZVRpbWVQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMuY3JlYXRlQ2FzdWFsQ29uZmlndXJhdGlvbiA9IGV4cG9ydHMucGFyc2VEYXRlID0gZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMuc3RyaWN0ID0gZXhwb3J0cy5jYXN1YWwgPSB2b2lkIDA7XG5jb25zdCBjb25maWd1cmF0aW9uc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbmZpZ3VyYXRpb25zXCIpO1xuY29uc3QgY2hyb25vXzEgPSByZXF1aXJlKFwiLi4vLi4vY2hyb25vXCIpO1xuY29uc3QgTkxNZXJnZURhdGVSYW5nZVJlZmluZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWZpbmVycy9OTE1lcmdlRGF0ZVJhbmdlUmVmaW5lclwiKSk7XG5jb25zdCBOTE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVmaW5lcnMvTkxNZXJnZURhdGVUaW1lUmVmaW5lclwiKSk7XG5jb25zdCBOTENhc3VhbERhdGVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MQ2FzdWFsRGF0ZVBhcnNlclwiKSk7XG5jb25zdCBOTENhc3VhbFRpbWVQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MQ2FzdWFsVGltZVBhcnNlclwiKSk7XG5jb25zdCBTbGFzaERhdGVGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vY29tbW9uL3BhcnNlcnMvU2xhc2hEYXRlRm9ybWF0UGFyc2VyXCIpKTtcbmNvbnN0IE5MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJcIikpO1xuY29uc3QgTkxXZWVrZGF5UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9OTFdlZWtkYXlQYXJzZXJcIikpO1xuY29uc3QgTkxNb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MTW9udGhOYW1lTWlkZGxlRW5kaWFuUGFyc2VyXCIpKTtcbmNvbnN0IE5MTW9udGhOYW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9OTE1vbnRoTmFtZVBhcnNlclwiKSk7XG5jb25zdCBOTFNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9wYXJzZXJzL05MU2xhc2hNb250aEZvcm1hdFBhcnNlclwiKSk7XG5jb25zdCBOTFRpbWVFeHByZXNzaW9uUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9OTFRpbWVFeHByZXNzaW9uUGFyc2VyXCIpKTtcbmNvbnN0IE5MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9OTENhc3VhbFllYXJNb250aERheVBhcnNlclwiKSk7XG5jb25zdCBOTENhc3VhbERhdGVUaW1lUGFyc2VyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcGFyc2Vycy9OTENhc3VhbERhdGVUaW1lUGFyc2VyXCIpKTtcbmV4cG9ydHMuY2FzdWFsID0gbmV3IGNocm9ub18xLkNocm9ubyhjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uKCkpO1xuZXhwb3J0cy5zdHJpY3QgPSBuZXcgY2hyb25vXzEuQ2hyb25vKGNyZWF0ZUNvbmZpZ3VyYXRpb24odHJ1ZSkpO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbmZ1bmN0aW9uIGNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24obGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIGNvbnN0IG9wdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb24oZmFsc2UsIGxpdHRsZUVuZGlhbik7XG4gICAgb3B0aW9uLnBhcnNlcnMudW5zaGlmdChuZXcgTkxDYXN1YWxEYXRlUGFyc2VyXzEuZGVmYXVsdCgpKTtcbiAgICBvcHRpb24ucGFyc2Vycy51bnNoaWZ0KG5ldyBOTENhc3VhbFRpbWVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIG9wdGlvbi5wYXJzZXJzLnVuc2hpZnQobmV3IE5MQ2FzdWFsRGF0ZVRpbWVQYXJzZXJfMS5kZWZhdWx0KCkpO1xuICAgIHJldHVybiBvcHRpb247XG59XG5leHBvcnRzLmNyZWF0ZUNhc3VhbENvbmZpZ3VyYXRpb24gPSBjcmVhdGVDYXN1YWxDb25maWd1cmF0aW9uO1xuZnVuY3Rpb24gY3JlYXRlQ29uZmlndXJhdGlvbihzdHJpY3RNb2RlID0gdHJ1ZSwgbGl0dGxlRW5kaWFuID0gdHJ1ZSkge1xuICAgIHJldHVybiBjb25maWd1cmF0aW9uc18xLmluY2x1ZGVDb21tb25Db25maWd1cmF0aW9uKHtcbiAgICAgICAgcGFyc2VyczogW1xuICAgICAgICAgICAgbmV3IFNsYXNoRGF0ZUZvcm1hdFBhcnNlcl8xLmRlZmF1bHQobGl0dGxlRW5kaWFuKSxcbiAgICAgICAgICAgIG5ldyBOTE1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBOTE1vbnRoTmFtZVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBOTFRpbWVFeHByZXNzaW9uUGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IE5MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMS5kZWZhdWx0KCksXG4gICAgICAgICAgICBuZXcgTkxTbGFzaE1vbnRoRm9ybWF0UGFyc2VyXzEuZGVmYXVsdCgpLFxuICAgICAgICAgICAgbmV3IE5MV2Vla2RheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgICAgIG5ldyBOTENhc3VhbFllYXJNb250aERheVBhcnNlcl8xLmRlZmF1bHQoKSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVmaW5lcnM6IFtuZXcgTkxNZXJnZURhdGVUaW1lUmVmaW5lcl8xLmRlZmF1bHQoKSwgbmV3IE5MTWVyZ2VEYXRlUmFuZ2VSZWZpbmVyXzEuZGVmYXVsdCgpXSxcbiAgICB9LCBzdHJpY3RNb2RlKTtcbn1cbmV4cG9ydHMuY3JlYXRlQ29uZmlndXJhdGlvbiA9IGNyZWF0ZUNvbmZpZ3VyYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XG59KTtcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xuICAgIHJldHVybiByZXN1bHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZURhdGUgPSBleHBvcnRzLnBhcnNlID0gZXhwb3J0cy5jYXN1YWwgPSBleHBvcnRzLnN0cmljdCA9IGV4cG9ydHMubmwgPSBleHBvcnRzLnB0ID0gZXhwb3J0cy5qYSA9IGV4cG9ydHMuZnIgPSBleHBvcnRzLmRlID0gZXhwb3J0cy5NZXJpZGllbSA9IGV4cG9ydHMuQ2hyb25vID0gZXhwb3J0cy5lbiA9IHZvaWQgMDtcbmNvbnN0IGVuID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2xvY2FsZXMvZW5cIikpO1xuZXhwb3J0cy5lbiA9IGVuO1xuY29uc3QgY2hyb25vXzEgPSByZXF1aXJlKFwiLi9jaHJvbm9cIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJDaHJvbm9cIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNocm9ub18xLkNocm9ubzsgfSB9KTtcbnZhciBNZXJpZGllbTtcbihmdW5jdGlvbiAoTWVyaWRpZW0pIHtcbiAgICBNZXJpZGllbVtNZXJpZGllbVtcIkFNXCJdID0gMF0gPSBcIkFNXCI7XG4gICAgTWVyaWRpZW1bTWVyaWRpZW1bXCJQTVwiXSA9IDFdID0gXCJQTVwiO1xufSkoTWVyaWRpZW0gPSBleHBvcnRzLk1lcmlkaWVtIHx8IChleHBvcnRzLk1lcmlkaWVtID0ge30pKTtcbmNvbnN0IGRlID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2xvY2FsZXMvZGVcIikpO1xuZXhwb3J0cy5kZSA9IGRlO1xuY29uc3QgZnIgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vbG9jYWxlcy9mclwiKSk7XG5leHBvcnRzLmZyID0gZnI7XG5jb25zdCBqYSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9sb2NhbGVzL2phXCIpKTtcbmV4cG9ydHMuamEgPSBqYTtcbmNvbnN0IHB0ID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2xvY2FsZXMvcHRcIikpO1xuZXhwb3J0cy5wdCA9IHB0O1xuY29uc3QgbmwgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vbG9jYWxlcy9ubFwiKSk7XG5leHBvcnRzLm5sID0gbmw7XG5leHBvcnRzLnN0cmljdCA9IGVuLnN0cmljdDtcbmV4cG9ydHMuY2FzdWFsID0gZW4uY2FzdWFsO1xuZnVuY3Rpb24gcGFyc2UodGV4dCwgcmVmLCBvcHRpb24pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jYXN1YWwucGFyc2UodGV4dCwgcmVmLCBvcHRpb24pO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuZnVuY3Rpb24gcGFyc2VEYXRlKHRleHQsIHJlZiwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuY2FzdWFsLnBhcnNlRGF0ZSh0ZXh0LCByZWYsIG9wdGlvbik7XG59XG5leHBvcnRzLnBhcnNlRGF0ZSA9IHBhcnNlRGF0ZTtcbiIsIi8qKiBAZm9ybWF0ICovXG5pbXBvcnQgY2hyb25vIGZyb20gJ2Nocm9uby1ub2RlJ1xuaW1wb3J0IHsgTW9tZW50IH0gZnJvbSAnbW9tZW50J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEYXRlUGFyc2VyIHtcbiAgcGFyc2VEYXRlUmFuZ2VGcm9tU2VsZWN0aW9uKHNlbGVjdGlvbjogc3RyaW5nKSB7XG4gICAgbGV0IG1vbWVudHM6IE1vbWVudFtdID0gW11cbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSBzZWxlY3Rpb24uc3BsaXQoJyB0byAnKS5tYXAoKHMpID0+IHdpbmRvdy5tb21lbnQodGhpcy5wYXJzZURhdGUocykpKVxuICAgIGNvbnNvbGUuZGVidWcoJ1N0YXJ0OiAnICsgc3RhcnQpXG4gICAgY29uc29sZS5kZWJ1ZygnRW5kOiAnICsgZW5kKVxuXG4gICAgbGV0IG5leHQgPSBzdGFydFxuICAgIGRvIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ05leHQ6ICcgKyBuZXh0KVxuICAgICAgbW9tZW50cy5wdXNoKHdpbmRvdy5tb21lbnQobmV4dCkpXG4gICAgICBuZXh0LmFkZCgxLCAnZCcpXG4gICAgfSB3aGlsZSAobmV4dC5pc1NhbWVPckJlZm9yZShlbmQsICdkYXknKSlcblxuICAgIHJldHVybiBtb21lbnRzXG4gIH1cbiAgcGFyc2VEYXRlKGlucHV0OiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmRlYnVnKCdlbnRlcmVkIHBhcnNlRGF0ZSB3aXRoIGlucHV0OiAnLCBpbnB1dClcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gY2hyb25vLnBhcnNlRGF0ZShpbnB1dClcbiAgICAgIGNvbnNvbGUuZGVidWcoJ3BhcnNlZDogJywgcGFyc2VkKVxuXG4gICAgICByZXR1cm4gcGFyc2VkXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbilcbiAgICB9XG4gIH1cbn1cbiIsIi8qKiBAZm9ybWF0ICovXG5cbmltcG9ydCB7IE1vbWVudCB9IGZyb20gJ21vbWVudCdcbmltcG9ydCB7IE1hcmtkb3duVmlldywgUGx1Z2luIH0gZnJvbSAnb2JzaWRpYW4nXG5pbXBvcnQgeyBBY3Rpdml0eUxvZ2dlciB9IGZyb20gJ3NyYy9BY3Rpdml0eUxvZ2dlcidcbmltcG9ydCBEYXRlUGFyc2VyIGZyb20gJ3NyYy9EYXRlUGFyc2VyJ1xuXG5pbnRlcmZhY2UgRGFpbHlBY3Rpdml0eVBsdWdpblNldHRpbmdzIHtcbiAgLy8gVE9ETzpcbiAgLy8gaW5zZXJ0IGxvY2F0aW9uOiBjdXJzb3IsIHRvcCBvZiBmaWxlLCBlbmQgb2YgZmlsZVxuICAvLyBsaXN0cyB0byBnZW5lcmF0ZTogQ3JlYXRlZCAmIG1vZGlmaWVkPyBKdXN0IGNyZWF0ZWQ/IEp1c3QgbW9kaWZpZWQ/XG4gIC8vIEV4Y2x1ZGUgbW9kaWZpZWQgZnJvbSBjcmVhdGVkIHRhYmxlXG4gIC8vIGV4Y2x1ZGUgZmlsZSByZWdleFxuICAvLyBpbmNsdWRlIGZpbGUgcmVnZXhcbiAgLy8gaW5jbHVkZSBmaWxlIHBhdGhzXG4gIC8vIGV4Y2x1ZGUgZmlsZSBwYXRoc1xuICAvLyBJbmNsdWRlIGN1cnJlbnQgbm90ZT9cbiAgLy8gSW5jbHVkZSBoZWFkZXI/XG4gIC8vIEN1c3RvbSBoZWFkZXIgdmFsdWVzXG4gIC8vIHRlbXBsYXRlIGZvciBpbnNlcnRpbmc/XG4gIC8vIHBsYWluIHRleHQgb3IgbGluaz9cbn1cblxuLy8gVE9ETzpcbi8vIFRyYWNrIGFjdGl2aXR5IHVzaW5nIGV2ZW50cyAoZmlsZSBjcmVhdGVkLCBmaWxlIG1vZGlmaWVkLCBmaWxlIG9wZW5lZCwgdHJhY2sgYWRkaXRpb25zL2RlbGV0aW9ucyBieSBjYXB0dXJpbmcgZmlsZSBsZW5ndGggb24gb3Blbi9jbG9zZSAob3IgZm9jdXMvbG9zZSBmb2N1cykpXG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERhaWx5QWN0aXZpdHlQbHVnaW5TZXR0aW5ncyA9IHt9XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhaWx5QWN0aXZpdHlQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICBzZXR0aW5nczogRGFpbHlBY3Rpdml0eVBsdWdpblNldHRpbmdzXG4gIGFjdGl2aXR5TG9nZ2VyOiBBY3Rpdml0eUxvZ2dlclxuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZygnbG9hZGluZyBwbHVnaW4nKVxuXG4gICAgLy8gYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblxuICAgIHRoaXMuYWN0aXZpdHlMb2dnZXIgPSBuZXcgQWN0aXZpdHlMb2dnZXIodGhpcy5hcHAsIHRoaXMpXG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdsaW5rcy10by1maWxlcy1jcmVhdGVkLXRvZGF5JyxcbiAgICAgIG5hbWU6IFwiTGlua3MgdG8gRmlsZXMgQ3JlYXRlZCBUb2RheSBmb3IgZGF0ZSAoZGVmYXVsdCdzIGZvciB0b2RheSlcIixcbiAgICAgIGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xuICAgICAgICBsZXQgYWN0aXZlVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldylcbiAgICAgICAgaWYgKGFjdGl2ZVZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoZWNraW5nKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWN0aXZpdHlMb2dnZXIuaW5zZXJ0QWN0aXZpdHlMb2coeyBpbnNlcnRDcmVhdGVkT25EYXRlRmlsZXM6IHRydWUsIGFjdGl2ZVZpZXcsIG1vbWVudHM6IHRoaXMuZ2V0RGF0ZXMoYWN0aXZlVmlldykgfSlcbiAgICAgIH0sXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFsnQWx0J10sXG4gICAgICAgICAga2V5OiAnYycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdsaW5rcy10by1maWxlcy1tb2RpZmllZC10b2RheScsXG4gICAgICBuYW1lOiBcIkxpbmtzIHRvIEZpbGVzIE1vZGlmaWVkIGZvciBkYXRlIChkZWZhdWx0J3MgZm9yIHRvZGF5KVwiLFxuICAgICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KVxuICAgICAgICBpZiAoYWN0aXZlVmlldyA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hlY2tpbmcpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpdml0eUxvZ2dlci5pbnNlcnRBY3Rpdml0eUxvZyh7IGluc2VydE1vZGlmaWVkT25EYXRlRmlsZXM6IHRydWUsIGFjdGl2ZVZpZXcsIG1vbWVudHM6IHRoaXMuZ2V0RGF0ZXMoYWN0aXZlVmlldykgfSlcbiAgICAgIH0sXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFsnQWx0J10sXG4gICAgICAgICAga2V5OiAnbScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdmaWxlcy1jcmVhdGVkLXRvZGF5JyxcbiAgICAgIG5hbWU6IFwiUGxhaW4gVGV4dCBMaXN0IG9mIEZpbGVzIENyZWF0ZWQgZm9yIGRhdGUgKGRlZmF1bHQncyBmb3IgdG9kYXkpXCIsXG4gICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgbGV0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpXG4gICAgICAgIGlmIChhY3RpdmVWaWV3ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGVja2luZykge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGl2aXR5TG9nZ2VyLmluc2VydEFjdGl2aXR5TG9nKHsgaW5zZXJ0Q3JlYXRlZE9uRGF0ZUZpbGVzOiB0cnVlLCBhY3RpdmVWaWV3LCBtYWtlTGluazogZmFsc2UsIG1vbWVudHM6IHRoaXMuZ2V0RGF0ZXMoYWN0aXZlVmlldykgfSlcbiAgICAgIH0sXG4gICAgICBob3RrZXlzOiBbXSxcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAnZmlsZXMtbW9kaWZpZWQtdG9kYXknLFxuICAgICAgbmFtZTogXCJQbGFpbiBUZXh0IExpc3Qgb2YgRmlsZXMgTW9kaWZpZWQgZm9yIGRhdGUgKGRlZmF1bHQncyBmb3IgdG9kYXkpXCIsXG4gICAgICBjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgbGV0IGFjdGl2ZVZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpXG4gICAgICAgIGlmIChhY3RpdmVWaWV3ID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGVja2luZykge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjdGl2aXR5TG9nZ2VyLmluc2VydEFjdGl2aXR5TG9nKHsgaW5zZXJ0TW9kaWZpZWRPbkRhdGVGaWxlczogdHJ1ZSwgYWN0aXZlVmlldywgbWFrZUxpbms6IGZhbHNlLCBtb21lbnRzOiB0aGlzLmdldERhdGVzKGFjdGl2ZVZpZXcpIH0pXG4gICAgICB9LFxuICAgICAgaG90a2V5czogW10sXG4gICAgfSlcblxuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ2ZpbGUtc3RhdHMtdG9kYXknLFxuICAgICAgbmFtZTogXCIoRGVwcmVjYXRlZCkgVG9kYXkncyBTdGF0c1wiLFxuICAgICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KVxuICAgICAgICBpZiAoYWN0aXZlVmlldyA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hlY2tpbmcpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpdml0eUxvZ2dlci5pbnNlcnRGaWxlU3RhdHMoeyBhY3RpdmVWaWV3IH0pXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICdvYnNpZGlhbi1zdGF0cycsXG4gICAgICBuYW1lOiBcIlN0YXRzIGZvciBkYXRlIChkZWZhdWx0J3MgZm9yIHRvZGF5KVwiLFxuICAgICAgY2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KVxuICAgICAgICBpZiAoYWN0aXZlVmlldyA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hlY2tpbmcpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1vbWVudHMgPSB0aGlzLmdldERhdGVzKGFjdGl2ZVZpZXcpXG4gICAgICAgIGNvbnNvbGUubG9nKGAke21vbWVudHN9YClcblxuICAgICAgICB0aGlzLmFjdGl2aXR5TG9nZ2VyLmluc2VydEZpbGVTdGF0cyh7IGFjdGl2ZVZpZXcsIG1vbWVudHMgfSlcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIG9udW5sb2FkKCkge1xuICAgIGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgcGx1Z2luJylcbiAgfVxuXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKVxuICB9XG5cbiAgYXN5bmMgc2F2ZVNldHRpbmdzKCkge1xuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncylcbiAgfVxuXG4gIGdldERhdGVzKGFjdGl2ZVZpZXc6IE1hcmtkb3duVmlldyk6IE1vbWVudFtdIHtcbiAgICBsZXQgZWRpdG9yID0gYWN0aXZlVmlldy5lZGl0b3JcbiAgICBjb25zdCBkcCA9IG5ldyBEYXRlUGFyc2VyKClcblxuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3Iuc29tZXRoaW5nU2VsZWN0ZWQoKSkge1xuICAgICAgLy8gUmV0dXJuIHRvZGF5IGZvciBzdGFydCAmIGVuZFxuICAgICAgcmV0dXJuIFt3aW5kb3cubW9tZW50KCldXG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGlvbiA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKVxuICAgIGNvbnNvbGUubG9nKCdTZWxlY3Rpb24gY29udGFpbnMgYSBkYXRlIHJhbmdlOiAnLCBzZWxlY3Rpb24uY29udGFpbnMoJ3RvJykpXG5cbiAgICBsZXQgbW9tZW50czogTW9tZW50W10gPSBbXVxuICAgIGlmIChzZWxlY3Rpb24uY29udGFpbnMoJ3RvJykpIHtcbiAgICAgIG1vbWVudHMgPSBkcC5wYXJzZURhdGVSYW5nZUZyb21TZWxlY3Rpb24oc2VsZWN0aW9uKVxuICAgIH0gZWxzZSB7XG4gICAgICBtb21lbnRzLnB1c2god2luZG93Lm1vbWVudChkcC5wYXJzZURhdGUoc2VsZWN0aW9uKSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIG1vbWVudHNcbiAgfVxufVxuIl0sIm5hbWVzIjpbImdldExpbmtwYXRoIiwidGhpcyIsInJlcXVpcmUkJDAiLCJwYXR0ZXJuXzEiLCJ5ZWFyc18xIiwicmVxdWlyZSQkMSIsImRheWpzXzIiLCJjb25zdGFudHNfMSIsIkFic3RyYWN0UGFyc2VyV2l0aFdvcmRCb3VuZGFyeV8xIiwicmVzdWx0c18xIiwiaW5kZXhfMSIsInRpbWV1bml0c18xIiwiYWJzdHJhY3RSZWZpbmVyc18xIiwiQWJzdHJhY3RNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIm1lcmdpbmdDYWxjdWxhdGlvbl8xIiwiRXh0cmFjdFRpbWV6b25lQWJiclJlZmluZXJfMSIsIkV4dHJhY3RUaW1lem9uZU9mZnNldFJlZmluZXJfMSIsIk92ZXJsYXBSZW1vdmFsUmVmaW5lcl8xIiwicmVxdWlyZSQkMiIsIkZvcndhcmREYXRlUmVmaW5lcl8xIiwicmVxdWlyZSQkMyIsIlVubGlrZWx5Rm9ybWF0RmlsdGVyXzEiLCJyZXF1aXJlJCQ0IiwiSVNPRm9ybWF0UGFyc2VyXzEiLCJyZXF1aXJlJCQ1IiwiTWVyZ2VXZWVrZGF5Q29tcG9uZW50UmVmaW5lcl8xIiwicmVxdWlyZSQkNiIsIndlZWtzXzEiLCJlbl8xIiwicmVzdWx0cyIsIkVOVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMSIsIkVOTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEiLCJFTk1vbnRoTmFtZU1pZGRsZUVuZGlhblBhcnNlcl8xIiwiRU5Nb250aE5hbWVQYXJzZXJfMSIsIkVOQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEiLCJFTlNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMSIsIkVOVGltZUV4cHJlc3Npb25QYXJzZXJfMSIsIkVOVGltZVVuaXRBZ29Gb3JtYXRQYXJzZXJfMSIsInJlcXVpcmUkJDciLCJFTlRpbWVVbml0TGF0ZXJGb3JtYXRQYXJzZXJfMSIsInJlcXVpcmUkJDgiLCJFTk1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xIiwicmVxdWlyZSQkOSIsIkVOTWVyZ2VEYXRlVGltZVJlZmluZXJfMSIsInJlcXVpcmUkJDEwIiwiRU5DYXN1YWxEYXRlUGFyc2VyXzEiLCJyZXF1aXJlJCQxMSIsIkVOQ2FzdWFsVGltZVBhcnNlcl8xIiwicmVxdWlyZSQkMTIiLCJFTldlZWtkYXlQYXJzZXJfMSIsInJlcXVpcmUkJDEzIiwiRU5SZWxhdGl2ZURhdGVGb3JtYXRQYXJzZXJfMSIsInJlcXVpcmUkJDE0IiwiU2xhc2hEYXRlRm9ybWF0UGFyc2VyXzEiLCJyZXF1aXJlJCQxNSIsIkVOVGltZVVuaXRDYXN1YWxSZWxhdGl2ZUZvcm1hdFBhcnNlcl8xIiwicmVxdWlyZSQkMTYiLCJjaHJvbm9fMSIsImNvbmZpZ3VyYXRpb25zXzEiLCJERUNhc3VhbFRpbWVQYXJzZXJfMSIsIkRFVGltZUV4cHJlc3Npb25QYXJzZXJfMSIsIkRFV2Vla2RheVBhcnNlcl8xIiwiREVNZXJnZURhdGVSYW5nZVJlZmluZXJfMSIsIkRFTWVyZ2VEYXRlVGltZVJlZmluZXJfMSIsIkRFQ2FzdWFsRGF0ZVBhcnNlcl8xIiwiREVNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMSIsIkZSQ2FzdWFsRGF0ZVBhcnNlcl8xIiwiRlJDYXN1YWxUaW1lUGFyc2VyXzEiLCJGUlRpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJGUk1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEiLCJGUk1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xIiwiRlJXZWVrZGF5UGFyc2VyXzEiLCJGUlNwZWNpZmljVGltZUV4cHJlc3Npb25QYXJzZXJfMSIsIkZSTW9udGhOYW1lTGl0dGxlRW5kaWFuUGFyc2VyXzEiLCJGUlRpbWVVbml0QWdvRm9ybWF0UGFyc2VyXzEiLCJGUlRpbWVVbml0V2l0aGluRm9ybWF0UGFyc2VyXzEiLCJKUFN0YW5kYXJkUGFyc2VyXzEiLCJKUE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xIiwiSlBDYXN1YWxEYXRlUGFyc2VyXzEiLCJkYXlqc18xIiwiUFRXZWVrZGF5UGFyc2VyXzEiLCJQVFRpbWVFeHByZXNzaW9uUGFyc2VyXzEiLCJQVE1lcmdlRGF0ZVRpbWVSZWZpbmVyXzEiLCJQVE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xIiwiUFRNb250aE5hbWVMaXR0bGVFbmRpYW5QYXJzZXJfMSIsIlBUQ2FzdWFsRGF0ZVBhcnNlcl8xIiwiUFRDYXN1YWxUaW1lUGFyc2VyXzEiLCJOTE1lcmdlRGF0ZVJhbmdlUmVmaW5lcl8xIiwiTkxNZXJnZURhdGVUaW1lUmVmaW5lcl8xIiwiTkxDYXN1YWxEYXRlUGFyc2VyXzEiLCJOTENhc3VhbFRpbWVQYXJzZXJfMSIsIk5MVGltZVVuaXRXaXRoaW5Gb3JtYXRQYXJzZXJfMSIsIk5MV2Vla2RheVBhcnNlcl8xIiwiTkxNb250aE5hbWVNaWRkbGVFbmRpYW5QYXJzZXJfMSIsIk5MTW9udGhOYW1lUGFyc2VyXzEiLCJOTFNsYXNoTW9udGhGb3JtYXRQYXJzZXJfMSIsIk5MVGltZUV4cHJlc3Npb25QYXJzZXJfMSIsIk5MQ2FzdWFsWWVhck1vbnRoRGF5UGFyc2VyXzEiLCJOTENhc3VhbERhdGVUaW1lUGFyc2VyXzEiLCJlbiIsImRlIiwiZnIiLCJqYSIsInB0IiwibmwiLCJQbHVnaW4iLCJNYXJrZG93blZpZXciXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENB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QUFDLE1BQU0sQ0FBQyx1RkFBdUYsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU0sRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU0sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQ0N6eE0sSUFBSSxlQUFlLEdBQUcsQ0FBQ0EsY0FBSSxJQUFJ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QUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7QUNDN3NCLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELHdCQUF3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SUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ1gsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksS0FBSyxFQUFFLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxDQUFDLEdBQUc7QUFDZixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxDQUFDO0FBQ1gsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksS0FBSyxFQUFFLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ1gsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxHQUFHO0FBQ2QsSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksS0FBSyxFQUFFLEdBQUc7QUFDZCxJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHO0FBQ2QsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJLElBQUksRUFBRSxDQUFDLEdBQUc7QUFDZCxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHO0FBQ2IsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLElBQUksRUFBRSxFQUFFO0FBQ1osSUFBSSxJQUFJLEVBQUUsRUFBRTtBQUNaLElBQUksR0FBRyxFQUFFLENBQUM7QUFDVixJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ1YsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRztBQUNkLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEdBQUcsRUFBRSxHQUFHO0FBQ1osSUFBSSxJQUFJLEVBQUUsR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLEVBQUUsRUFBRSxDQUFDO0FBQ1QsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixJQUFJLElBQUksRUFBRSxHQUFHO0FBQ2IsSUFBSSxLQUFLLEVBQUUsR0FBRztBQUNkLElBQUksSUFBSSxFQUFFLEdBQUc7QUFDYixDQUFDLENBQUM7QUFDRixNQUFNLDBCQUEwQixDQUFDO0FBQ2pDLElBQUksV0FBVyxDQUFDLGlCQUFpQixFQUFFO0FBQ25DLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLHlCQUF5QixDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUN2RyxLQUFLO0FBQ0wsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFRLElBQUksRUFBRSxDQUFDO0FBQ2YsUUFBUSxNQUFNLGlCQUFpQixHQUFHLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxNQUFNLElBQUksSUFBSSxFQUFFLEtBQUssS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN0RyxRQUFRLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUs7QUFDcEMsWUFBWSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDdkIsWUFBWSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckYsWUFBWSxNQUFNLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0QsWUFBWSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3hCLGdCQUFnQixPQUFPO0FBQ3ZCLGFBQWE7QUFDYixZQUFZLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN4RCxZQUFZLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDN0wsWUFBWSxJQUFJLHVCQUF1QixLQUFLLElBQUksRUFBRTtBQUNsRCxnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2IsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDaEMsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxZQUFZLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hHLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsWUFBWSxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDN0UsWUFBWSxJQUFJLHFCQUFxQixLQUFLLElBQUksSUFBSSx1QkFBdUIsSUFBSSxxQkFBcUIsRUFBRTtBQUNwRyxnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2IsWUFBWSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQzNELGdCQUFnQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9FLGFBQWE7QUFDYixZQUFZLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0FBQy9FLGdCQUFnQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQzdFLGFBQWE7QUFDYixTQUFTLENBQUMsQ0FBQztBQUNYLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLENBQUM7QUFDRCxlQUFlLEdBQUcsMEJBQTBCOzs7O0FDeE81QyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxNQUFNLHVCQUF1QixHQUFHLElBQUksTUFBTSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVHLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0saUNBQWlDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLE1BQU0sbUNBQW1DLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sNEJBQTRCLENBQUM7QUFDbkMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFRLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxNQUFNLEVBQUU7QUFDMUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7QUFDMUQsZ0JBQWdCLE9BQU87QUFDdkIsYUFBYTtBQUNiLFlBQVksTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JGLFlBQVksTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9ELFlBQVksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN4QixnQkFBZ0IsT0FBTztBQUN2QixhQUFhO0FBQ2IsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDaEMsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRixhQUFhLENBQUMsQ0FBQztBQUNmLFlBQVksTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUM7QUFDbEYsWUFBWSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDN0YsWUFBWSxJQUFJLGNBQWMsR0FBRyxVQUFVLEdBQUcsRUFBRSxHQUFHLFlBQVksQ0FBQztBQUNoRSxZQUFZLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLEtBQUssR0FBRyxFQUFFO0FBQzNELGdCQUFnQixjQUFjLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDakQsYUFBYTtBQUNiLFlBQVksSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRTtBQUNwQyxnQkFBZ0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDcEUsYUFBYTtBQUNiLFlBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbEUsWUFBWSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxTQUFTLENBQUMsQ0FBQztBQUNYLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLENBQUM7QUFDRCxlQUFlLEdBQUcsNEJBQTRCOzs7O0FDbEM5QyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxNQUFNLHFCQUFxQixDQUFDO0FBQzVCLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDN0IsUUFBUSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFlBQVksT0FBTyxPQUFPLENBQUM7QUFDM0IsU0FBUztBQUNULFFBQVEsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ25DLFFBQVEsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDakQsWUFBWSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUMxRSxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNqRSxvQkFBb0IsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUN4QyxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQixnQkFBZ0IsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNqRCxnQkFBZ0IsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFO0FBQ2hDLFlBQVksZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxTQUFTO0FBQ1QsUUFBUSxPQUFPLGVBQWUsQ0FBQztBQUMvQixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxxQkFBcUI7Ozs7QUMxQnZDLElBQUksZUFBZSxHQUFHLENBQUNELGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsS0FBSyxVQUFVLEdBQUcsRUFBRTtBQUN2RSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUQsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDQyxTQUFnQixDQUFDLENBQUM7QUFDbEQsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzdCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ3pDLFlBQVksT0FBTyxPQUFPLENBQUM7QUFDM0IsU0FBUztBQUNULFFBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLE1BQU0sRUFBRTtBQUMxQyxZQUFZLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdELFlBQVksSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7QUFDbkcsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdkYsb0JBQW9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3RSxvQkFBb0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQ3hDLHdCQUF3QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0YscUJBQXFCLENBQUMsQ0FBQztBQUN2QixvQkFBb0IsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDckUsd0JBQXdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM3RSx3QkFBd0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQzVDLDRCQUE0QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakcseUJBQXlCLENBQUMsQ0FBQztBQUMzQixxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQ2xHLGdCQUFnQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNuRSxvQkFBb0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0UsaUJBQWlCO0FBQ2pCLHFCQUFxQjtBQUNyQixvQkFBb0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUMzRSxpQkFBaUI7QUFDakIsZ0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxnQkFBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuRSxnQkFBZ0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzdELGdCQUFnQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDcEMsb0JBQW9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzRixpQkFBaUIsQ0FBQyxDQUFDO0FBQ25CLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFO0FBQ3ZFLG9CQUFvQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNyRSx3QkFBd0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakYscUJBQXFCO0FBQ3JCLHlCQUF5QjtBQUN6Qix3QkFBd0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUM3RSxxQkFBcUI7QUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxvQkFBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRSxvQkFBb0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELG9CQUFvQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDeEMsd0JBQXdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RixxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUyxDQUFDLENBQUM7QUFDWCxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsZUFBZSxHQUFHLGtCQUFrQjs7OztBQzFEcEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDSjtBQUMxRCxNQUFNLG9CQUFvQixTQUFTVSxnQkFBa0IsQ0FBQyxNQUFNLENBQUM7QUFDN0QsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFO0FBQzVCLFFBQVEsS0FBSyxFQUFFLENBQUM7QUFDaEIsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUNyQyxLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUM3QixRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUNqRSxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUNoQyxnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RSxhQUFhLENBQUMsQ0FBQztBQUNmLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsU0FBUztBQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDekMsWUFBWSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07QUFDaEMsZ0JBQWdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRixhQUFhLENBQUMsQ0FBQztBQUNmLFlBQVksT0FBTyxLQUFLLENBQUM7QUFDekIsU0FBUztBQUNULFFBQVEsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUNyRCxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUNoQyxnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsWUFBWSxPQUFPLEtBQUssQ0FBQztBQUN6QixTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDN0IsWUFBWSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsU0FBUztBQUNULFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSztBQUNMLElBQUksaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUN2QyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxFQUFFO0FBQ25ELFlBQVksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQ2hDLGdCQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsMENBQTBDLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkcsYUFBYSxDQUFDLENBQUM7QUFDZixZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFNBQVM7QUFDVCxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUNqSCxZQUFZLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUNoQyxnQkFBZ0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLDRDQUE0QyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JHLGFBQWEsQ0FBQyxDQUFDO0FBQ2YsWUFBWSxPQUFPLEtBQUssQ0FBQztBQUN6QixTQUFTO0FBQ1QsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxvQkFBb0I7Ozs7QUMvQ3RDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3VCO0FBQ3JGLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLDBDQUEwQztBQUNyRSxJQUFJLE1BQU07QUFDVixJQUFJLDJCQUEyQjtBQUMvQixJQUFJLEtBQUs7QUFDVCxJQUFJLGlDQUFpQztBQUNyQyxJQUFJLElBQUk7QUFDUixJQUFJLEtBQUs7QUFDVCxJQUFJLDJCQUEyQjtBQUMvQixJQUFJLElBQUk7QUFDUixJQUFJLElBQUk7QUFDUixJQUFJLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QixNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUM1QixNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUM3QixNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUM1QixNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUM1QixNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUM5QixNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUM5QixNQUFNLHdCQUF3QixHQUFHLENBQUMsQ0FBQztBQUNuQyxNQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQztBQUNoQyxNQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztBQUNsQyxNQUFNLGVBQWUsU0FBU0osOEJBQWdDLENBQUMsc0NBQXNDLENBQUM7QUFDdEcsSUFBSSxZQUFZLEdBQUc7QUFDbkIsUUFBUSxPQUFPLE9BQU8sQ0FBQztBQUN2QixLQUFLO0FBQ0wsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNqQyxRQUFRLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUM5QixRQUFRLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUNoRSxRQUFRLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztBQUNsRSxRQUFRLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUMvRCxRQUFRLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksSUFBSSxFQUFFO0FBQzlDLFlBQVksVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFlBQVksVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLFlBQVksSUFBSSxLQUFLLENBQUMsbUJBQW1CLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDcEQsZ0JBQWdCLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUM1RSxhQUFhO0FBQ2IsWUFBWSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN6RCxnQkFBZ0IsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLGFBQWE7QUFDYixZQUFZLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksSUFBSSxFQUFFO0FBQ3RELGdCQUFnQixVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakQsYUFBYTtBQUNiLGlCQUFpQjtBQUNqQixnQkFBZ0IsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7QUFDMUUsZ0JBQWdCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDNUQsb0JBQW9CLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUM1RSxpQkFBaUI7QUFDakIsZ0JBQWdCLElBQUksTUFBTSxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDN0MsZ0JBQWdCLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxvQkFBb0IsTUFBTSxJQUFJLFlBQVksQ0FBQztBQUMzQyxpQkFBaUI7QUFDakIscUJBQXFCO0FBQ3JCLG9CQUFvQixNQUFNLElBQUksWUFBWSxDQUFDO0FBQzNDLGlCQUFpQjtBQUNqQixnQkFBZ0IsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ3RELGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxPQUFPLFVBQVUsQ0FBQztBQUMxQixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxlQUFlOzs7O0FDOURqQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNKO0FBQzFELE1BQU0sNEJBQTRCLFNBQVNJLGdCQUFrQixDQUFDLGNBQWMsQ0FBQztBQUM3RSxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRTtBQUN6RCxRQUFRLE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QyxRQUFRLFNBQVMsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztBQUM5QyxRQUFRLFNBQVMsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztBQUMzRSxRQUFRLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzlFLFFBQVEsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQzNCLFlBQVksU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsU0FBUztBQUNULFFBQVEsT0FBTyxTQUFTLENBQUM7QUFDekIsS0FBSztBQUNMLElBQUksa0JBQWtCLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUU7QUFDL0QsUUFBUSxNQUFNLHFCQUFxQixHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUU7QUFDbEYsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNsRCxZQUFZLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLFFBQVEsT0FBTyxxQkFBcUIsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUM3RSxLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyw0QkFBNEI7Ozs7QUNwQjlDLElBQUksZUFBZSxHQUFHLENBQUNYLGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsS0FBSyxVQUFVLEdBQUcsRUFBRTtBQUN2RSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUQsa0NBQWtDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDNUMsTUFBTWMsOEJBQTRCLEdBQUcsZUFBZSxDQUFDYiw0QkFBdUQsQ0FBQyxDQUFDO0FBQzlHLE1BQU1jLGdDQUE4QixHQUFHLGVBQWUsQ0FBQ1gsOEJBQXlELENBQUMsQ0FBQztBQUNsSCxNQUFNWSx5QkFBdUIsR0FBRyxlQUFlLENBQUNDLHVCQUFrRCxDQUFDLENBQUM7QUFDcEcsTUFBTUMsc0JBQW9CLEdBQUcsZUFBZSxDQUFDQyxvQkFBK0MsQ0FBQyxDQUFDO0FBQzlGLE1BQU1DLHdCQUFzQixHQUFHLGVBQWUsQ0FBQ0Msc0JBQWlELENBQUMsQ0FBQztBQUNsRyxNQUFNQyxtQkFBaUIsR0FBRyxlQUFlLENBQUNDLGlCQUEyQyxDQUFDLENBQUM7QUFDdkYsTUFBTUMsZ0NBQThCLEdBQUcsZUFBZSxDQUFDQyw4QkFBeUQsQ0FBQyxDQUFDO0FBQ2xILFNBQVMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLFVBQVUsR0FBRyxLQUFLLEVBQUU7QUFDdkUsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJSCxtQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSUUsZ0NBQThCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNqRixJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUlWLDhCQUE0QixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0UsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJQyxnQ0FBOEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2pGLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSUMseUJBQXVCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxRSxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUlBLHlCQUF1QixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdkUsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJRSxzQkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3BFLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSUUsd0JBQXNCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDaEYsSUFBSSxPQUFPLGFBQWEsQ0FBQztBQUN6QixDQUFDO0FBQ0Qsa0NBQWtDLEdBQUcsMEJBQTBCOzs7O0FDdkIvRCxJQUFJLGVBQWUsR0FBRyxDQUFDcEIsY0FBSSxJQUFJQSxjQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsR0FBRyxFQUFFO0FBQ3ZFLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxlQUFlLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLEdBQUcsYUFBYSxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUN0RDtBQUN4QyxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUNDLFNBQWdCLENBQUMsQ0FBQztBQUNSO0FBQ047QUFDcEMsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFO0FBQ3RCLElBQUksTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUlPLE9BQVMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsSUFBSUgsS0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRCxJQUFJQSxLQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELElBQUksT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQztBQUNELFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDbEIsU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3hCLElBQUksTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUlHLE9BQVMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsSUFBSUgsS0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRCxJQUFJQSxLQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELElBQUksT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQztBQUNELGFBQWEsR0FBRyxLQUFLLENBQUM7QUFDdEIsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO0FBQzVCLElBQUksSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QyxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUlHLE9BQVMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzQyxJQUFJSCxLQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELElBQUlBLEtBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDcEQsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBQ0QsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0FBQzlCLFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUMzQixJQUFJLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEQsSUFBSSxNQUFNLFNBQVMsR0FBRyxJQUFJRyxPQUFTLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLElBQUlILEtBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDcEQsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBQ0QsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO0FBQzVCLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLEdBQUcsRUFBRSxFQUFFO0FBQzFDLElBQUksTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxJQUFJLE1BQU0sU0FBUyxHQUFHLElBQUlHLE9BQVMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbkUsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN2QyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFQyxJQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELElBQUlKLEtBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckQsSUFBSSxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBQ0QsZUFBZSxHQUFHLE9BQU87Ozs7QUNqRHpCLElBQUksZUFBZSxHQUFHLENBQUNMLGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsTUFBTSxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0FBQ2hHLElBQUksSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDLEtBQUssU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7QUFDNUIsSUFBSSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNKLElBQUksa0JBQWtCLEdBQUcsQ0FBQ0EsY0FBSSxJQUFJQSxjQUFJLENBQUMsa0JBQWtCLE1BQU0sTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDL0YsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDcEIsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsSUFBSSxZQUFZLEdBQUcsQ0FBQ0EsY0FBSSxJQUFJQSxjQUFJLENBQUMsWUFBWSxLQUFLLFVBQVUsR0FBRyxFQUFFO0FBQ2pFLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxPQUFPLEdBQUcsQ0FBQztBQUMxQyxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3SSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwQyxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUNGLElBQUksZUFBZSxHQUFHLENBQUNBLGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsS0FBSyxVQUFVLEdBQUcsRUFBRTtBQUN2RSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUQsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDQyxTQUFnQixDQUFDLENBQUM7QUFDeUQ7QUFDM0Q7QUFDaEQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDRyxnQkFBMkMsQ0FBQyxDQUFDO0FBQzdFLE1BQU0sT0FBTyxHQUFHLGtFQUFrRSxDQUFDO0FBQ25GLE1BQU0sa0JBQWtCLFNBQVNHLDhCQUFnQyxDQUFDLHNDQUFzQyxDQUFDO0FBQ3pHLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRTtBQUMxQixRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLFFBQVEsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUQsUUFBUSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDakQsUUFBUSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUM1RCxRQUFRLFFBQVEsU0FBUztBQUN6QixZQUFZLEtBQUssS0FBSztBQUN0QixnQkFBZ0IsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxZQUFZLEtBQUssT0FBTztBQUN4QixnQkFBZ0IsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6RCxZQUFZLEtBQUssV0FBVztBQUM1QixnQkFBZ0IsT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3RCxZQUFZLEtBQUssVUFBVSxDQUFDO0FBQzVCLFlBQVksS0FBSyxLQUFLO0FBQ3RCLGdCQUFnQixPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVELFlBQVksS0FBSyxTQUFTO0FBQzFCLGdCQUFnQixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELFlBQVk7QUFDWixnQkFBZ0IsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQ3JELG9CQUFvQixJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDL0Msd0JBQXdCLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9ELHFCQUFxQjtBQUNyQixvQkFBb0JGLEtBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckUsb0JBQW9CLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGlCQUFpQjtBQUNqQixnQkFBZ0IsTUFBTTtBQUN0QixTQUFTO0FBQ1QsUUFBUSxPQUFPLFNBQVMsQ0FBQztBQUN6QixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxrQkFBa0I7Ozs7QUM3RHBDLElBQUksZUFBZSxHQUFHLENBQUNMLGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsS0FBSyxVQUFVLEdBQUcsRUFBRTtBQUN2RSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDcEI7QUFDaUU7QUFDM0csTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDQyxTQUFnQixDQUFDLENBQUM7QUFDRjtBQUNoRCxNQUFNLE9BQU8sR0FBRyxzRUFBc0UsQ0FBQztBQUN2RixNQUFNLGtCQUFrQixTQUFTTSw4QkFBZ0MsQ0FBQyxzQ0FBc0MsQ0FBQztBQUN6RyxJQUFJLFlBQVksR0FBRztBQUNuQixRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLFFBQVEsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUQsUUFBUSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUM1RCxRQUFRLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUN0QyxZQUFZLEtBQUssV0FBVztBQUM1QixnQkFBZ0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUVFLElBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakUsZ0JBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLGdCQUFnQixNQUFNO0FBQ3RCLFlBQVksS0FBSyxTQUFTLENBQUM7QUFDM0IsWUFBWSxLQUFLLE9BQU87QUFDeEIsZ0JBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFQSxJQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLGdCQUFnQixTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1QyxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssVUFBVTtBQUMzQixnQkFBZ0JKLEtBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEUsZ0JBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLGdCQUFnQixTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QyxnQkFBZ0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsZ0JBQWdCLE1BQU07QUFDdEIsWUFBWSxLQUFLLFNBQVM7QUFDMUIsZ0JBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFSSxJQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLGdCQUFnQixTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzQyxnQkFBZ0IsTUFBTTtBQUN0QixZQUFZLEtBQUssTUFBTTtBQUN2QixnQkFBZ0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUVBLElBQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakUsZ0JBQWdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzVDLGdCQUFnQixNQUFNO0FBQ3RCLFNBQVM7QUFDVCxRQUFRLE9BQU8sU0FBUyxDQUFDO0FBQ3pCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsZUFBZSxHQUFHLGtCQUFrQjs7OztBQzVDcEMsSUFBSSxlQUFlLEdBQUcsQ0FBQ1QsY0FBSSxJQUFJQSxjQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsR0FBRyxFQUFFO0FBQ3ZFLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCw2QkFBNkIsR0FBRyxzQkFBc0IsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNoRSxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUNDLFNBQWdCLENBQUMsQ0FBQztBQUNsRCxTQUFTLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNuRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbkIsUUFBUSxPQUFPLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RCxLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLElBQUksUUFBUSxRQUFRO0FBQ3BCLFFBQVEsS0FBSyxNQUFNO0FBQ25CLFlBQVksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsWUFBWSxNQUFNO0FBQ2xCLFFBQVEsS0FBSyxNQUFNO0FBQ25CLFlBQVksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLFlBQVksTUFBTTtBQUNsQixRQUFRLEtBQUssTUFBTTtBQUNuQixZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4QyxZQUFZLE1BQU07QUFDbEIsS0FBSztBQUNMLElBQUksT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNELHNCQUFzQixHQUFHLGNBQWMsQ0FBQztBQUN4QyxTQUFTLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDaEQsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLElBQUksTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLEVBQUU7QUFDekUsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsS0FBSztBQUNMLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLEVBQUU7QUFDOUUsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLEtBQUs7QUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFDRCw2QkFBNkIsR0FBRyxxQkFBcUI7Ozs7QUN2Q3JELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCO0FBQ1E7QUFDdUQ7QUFDckQ7QUFDdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsMEJBQTBCO0FBQ3JELElBQUksY0FBYztBQUNsQixJQUFJLGdDQUFnQztBQUNwQyxJQUFJLENBQUMsQ0FBQyxFQUFFQyxPQUFTLENBQUMsZUFBZSxDQUFDSSxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsSUFBSSwwQkFBMEI7QUFDOUIsSUFBSSx3Q0FBd0M7QUFDNUMsSUFBSSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDeEIsTUFBTSxlQUFlLFNBQVNDLDhCQUFnQyxDQUFDLHNDQUFzQyxDQUFDO0FBQ3RHLElBQUksWUFBWSxHQUFHO0FBQ25CLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLElBQUksWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7QUFDakMsUUFBUSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDN0QsUUFBUSxNQUFNLE1BQU0sR0FBR0QsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pFLFFBQVEsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNDLFFBQVEsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzdDLFFBQVEsSUFBSSxZQUFZLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQztBQUM3QyxRQUFRLFlBQVksR0FBRyxZQUFZLElBQUksRUFBRSxDQUFDO0FBQzFDLFFBQVEsWUFBWSxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsRCxRQUFRLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUM1QixRQUFRLElBQUksWUFBWSxJQUFJLE1BQU0sSUFBSSxZQUFZLElBQUksTUFBTSxFQUFFO0FBQzlELFlBQVksUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUM5QixTQUFTO0FBQ1QsYUFBYSxJQUFJLFlBQVksSUFBSSxNQUFNLEVBQUU7QUFDekMsWUFBWSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQzlCLFNBQVM7QUFDVCxhQUFhLElBQUksWUFBWSxJQUFJLE1BQU0sRUFBRTtBQUN6QyxZQUFZLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDOUIsU0FBUztBQUNULFFBQVEsTUFBTSxJQUFJLEdBQUdvQixLQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQy9FLFFBQVEsT0FBTyxPQUFPO0FBQ3RCLGFBQWEsdUJBQXVCLEVBQUU7QUFDdEMsYUFBYSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztBQUN0QyxhQUFhLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3RDLGFBQWEsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdDLGFBQWEsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4QyxLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxlQUFlOzs7O0FDOUNqQyxJQUFJLGVBQWUsR0FBRyxDQUFDMUIsY0FBSSxJQUFJQSxjQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsR0FBRyxFQUFFO0FBQ3ZFLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsQjtBQUNFO0FBQzlDLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQ0MsU0FBZ0IsQ0FBQyxDQUFDO0FBQ3lEO0FBQ3ZEO0FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsMEJBQTBCLEVBQUVDLE9BQVMsQ0FBQyxlQUFlLENBQUNJLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuSixNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUM5QixNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQztBQUM5QixNQUFNLDBCQUEwQixTQUFTQyw4QkFBZ0MsQ0FBQyxzQ0FBc0MsQ0FBQztBQUNqSCxJQUFJLFlBQVksR0FBRztBQUNuQixRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLFFBQVEsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbEUsUUFBUSxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsRSxRQUFRLE1BQU0sUUFBUSxHQUFHRCxXQUFXLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEUsUUFBUSxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDaEMsWUFBWSxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDakMsWUFBWSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLFlBQVksT0FBT0UsT0FBUyxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckcsU0FBUztBQUNULFFBQVEsSUFBSSxRQUFRLElBQUksTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDdEQsWUFBWSxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDakMsWUFBWSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckMsWUFBWSxPQUFPQSxPQUFTLENBQUMsaUJBQWlCLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRyxTQUFTO0FBQ1QsUUFBUSxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztBQUM3RCxRQUFRLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3JDLFlBQVksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pELFlBQVksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakQsWUFBWSxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBWSxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRCxTQUFTO0FBQ1QsYUFBYSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0MsWUFBWSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkQsWUFBWSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNqRCxZQUFZLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELFlBQVksVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFNBQVM7QUFDVCxhQUFhLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMxQyxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRCxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELFlBQVksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakQsWUFBWSxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBWSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNuRCxTQUFTO0FBQ1QsUUFBUSxPQUFPLFVBQVUsQ0FBQztBQUMxQixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRywwQkFBMEI7Ozs7QUN0RDVDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELHNCQUFzQixHQUFHLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUNWO0FBQ0Y7QUFDckMsTUFBTSxNQUFNLENBQUM7QUFDYixJQUFJLFdBQVcsQ0FBQyxhQUFhLEVBQUU7QUFDL0IsUUFBUSxhQUFhLEdBQUcsYUFBYSxJQUFJbUIsRUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDMUUsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEQsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEQsS0FBSztBQUNMLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksTUFBTSxDQUFDO0FBQzFCLFlBQVksT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3RDLFlBQVksUUFBUSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3hDLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsS0FBSztBQUNMLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQzNDLFFBQVEsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2hFLFFBQVEsT0FBTyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNuRSxLQUFLO0FBQ0wsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUU7QUFDdkMsUUFBUSxNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxJQUFJLElBQUksSUFBSSxFQUFFLEVBQUUsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzVGLFFBQVEsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUs7QUFDekMsWUFBWSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RSxZQUFZLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BELFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSztBQUMvQixZQUFZLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3JDLFNBQVMsQ0FBQyxDQUFDO0FBQ1gsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtBQUNqRCxZQUFZLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2RCxTQUFTLENBQUMsQ0FBQztBQUNYLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLElBQUksT0FBTyxhQUFhLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMxQyxRQUFRLE1BQU1DLFNBQU8sR0FBRyxFQUFFLENBQUM7QUFDM0IsUUFBUSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFFBQVEsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztBQUMxQyxRQUFRLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekMsUUFBUSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hELFFBQVEsT0FBTyxLQUFLLEVBQUU7QUFDdEIsWUFBWSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNuRixZQUFZLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2hDLFlBQVksTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsWUFBWSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLGdCQUFnQixhQUFhLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNwRCxnQkFBZ0IsU0FBUztBQUN6QixhQUFhO0FBQ2IsWUFBWSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDcEMsWUFBWSxJQUFJLE1BQU0sWUFBWXBCLE9BQVMsQ0FBQyxhQUFhLEVBQUU7QUFDM0QsZ0JBQWdCLFlBQVksR0FBRyxNQUFNLENBQUM7QUFDdEMsYUFBYTtBQUNiLGlCQUFpQixJQUFJLE1BQU0sWUFBWUEsT0FBUyxDQUFDLGlCQUFpQixFQUFFO0FBQ3BFLGdCQUFnQixZQUFZLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEYsZ0JBQWdCLFlBQVksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQzVDLGFBQWE7QUFDYixpQkFBaUI7QUFDakIsZ0JBQWdCLFlBQVksR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUYsYUFBYTtBQUNiLFlBQVksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVHLFlBQVlvQixTQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3ZDLFlBQVksYUFBYSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDckYsWUFBWSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoRCxTQUFTO0FBQ1QsUUFBUSxPQUFPQSxTQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLENBQUM7QUFDRCxjQUFjLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sY0FBYyxDQUFDO0FBQ3JCLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUMvQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQzdCLEtBQUs7QUFDTCxJQUFJLHVCQUF1QixDQUFDLFVBQVUsRUFBRTtBQUN4QyxRQUFRLElBQUksVUFBVSxZQUFZcEIsT0FBUyxDQUFDLGlCQUFpQixFQUFFO0FBQy9ELFlBQVksT0FBTyxVQUFVLENBQUM7QUFDOUIsU0FBUztBQUNULFFBQVEsT0FBTyxJQUFJQSxPQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN6RSxLQUFLO0FBQ0wsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUU7QUFDL0UsUUFBUSxNQUFNLElBQUksR0FBRyxPQUFPLGNBQWMsS0FBSyxRQUFRLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN0SCxRQUFRLE1BQU0sS0FBSyxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzdGLFFBQVEsTUFBTSxHQUFHLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDdkYsUUFBUSxPQUFPLElBQUlBLE9BQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsRixLQUFLO0FBQ0wsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO0FBQ2pCLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUMvQixZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksUUFBUSxFQUFFO0FBQ3ZELGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGdCQUFnQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsRCxnQkFBZ0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0Qsc0JBQXNCLEdBQUcsY0FBYzs7OztBQ3BHdkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDWDtBQUNuRCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZO0FBQ3ZDLElBQUkscURBQXFEO0FBQ3pELElBQUkscUNBQXFDO0FBQ3pDLElBQUksU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN4QixNQUFNLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDdkIsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQUM7QUFDOUIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFDL0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLE1BQU0scUJBQXFCLENBQUM7QUFDNUIsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFO0FBQzlCLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFlBQVksR0FBRyxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQztBQUMxRixRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxHQUFHLG1CQUFtQixHQUFHLG9CQUFvQixDQUFDO0FBQ3hGLEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRztBQUNkLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUU7QUFDNUIsUUFBUSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUN2RSxZQUFZLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUMzQyxZQUFZLE9BQU87QUFDbkIsU0FBUztBQUNULFFBQVEsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2hFLFFBQVEsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUksUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO0FBQy9FLFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1QsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzdELFlBQVksT0FBTztBQUNuQixTQUFTO0FBQ1QsUUFBUSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hFLFFBQVEsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQzNELFFBQVEsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN2RCxRQUFRLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQ3JDLFlBQVksSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQzVCLGdCQUFnQixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFO0FBQzFELG9CQUFvQixDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNoRCxpQkFBaUI7QUFDakIscUJBQXFCO0FBQ3JCLG9CQUFvQixPQUFPLElBQUksQ0FBQztBQUNoQyxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxFQUFFO0FBQ2pDLFlBQVksT0FBTyxJQUFJLENBQUM7QUFDeEIsU0FBUztBQUNULFFBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFFBQVEsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDL0IsWUFBWSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDOUQsWUFBWSxNQUFNLElBQUksR0FBR0wsS0FBTyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JFLFlBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlDLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxNQUFNLElBQUksR0FBR0EsS0FBTyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ25GLFlBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLFNBQVM7QUFDVCxRQUFRLE9BQU8sTUFBTSxDQUFDO0FBQ3RCLEtBQUs7QUFDTCxDQUFDO0FBQ0QsZUFBZSxHQUFHLHFCQUFxQjs7OztBQzlEdkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEI7QUFDRTtBQUM2RDtBQUNuRDtBQUN4RCxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLGdDQUFnQyxFQUFFRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDL0csTUFBTSxvQ0FBb0MsU0FBU0MsOEJBQWdDLENBQUMsc0NBQXNDLENBQUM7QUFDM0gsSUFBSSxZQUFZLEdBQUc7QUFDbkIsUUFBUSxPQUFPLE9BQU8sQ0FBQztBQUN2QixLQUFLO0FBQ0wsSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNqQyxRQUFRLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QyxRQUFRLElBQUksU0FBUyxHQUFHRCxXQUFXLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELFFBQVEsUUFBUSxNQUFNO0FBQ3RCLFlBQVksS0FBSyxNQUFNLENBQUM7QUFDeEIsWUFBWSxLQUFLLE1BQU0sQ0FBQztBQUN4QixZQUFZLEtBQUssR0FBRztBQUNwQixnQkFBZ0IsU0FBUyxHQUFHSSxTQUFXLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEUsZ0JBQWdCLE1BQU07QUFDdEIsU0FBUztBQUNULFFBQVEsT0FBT0YsT0FBUyxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakcsS0FBSztBQUNMLENBQUM7QUFDRCxlQUFlLEdBQUcsb0NBQW9DOzs7O0FDdkJ0RCxJQUFJLGVBQWUsR0FBRyxDQUFDUixjQUFJLElBQUlBLGNBQUksQ0FBQyxlQUFlLEtBQUssVUFBVSxHQUFHLEVBQUU7QUFDdkUsSUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQzlELENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELDJCQUEyQixHQUFHLGlDQUFpQyxHQUFHLGlCQUFpQixHQUFHLGFBQWEsR0FBRyxVQUFVLEdBQUcsY0FBYyxHQUFHLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQztBQUM1SixNQUFNNkIsZ0NBQThCLEdBQUcsZUFBZSxDQUFDNUIsOEJBQWlELENBQUMsQ0FBQztBQUMxRyxNQUFNNkIsaUNBQStCLEdBQUcsZUFBZSxDQUFDMUIsK0JBQWtELENBQUMsQ0FBQztBQUM1RyxNQUFNMkIsaUNBQStCLEdBQUcsZUFBZSxDQUFDZCwrQkFBa0QsQ0FBQyxDQUFDO0FBQzVHLE1BQU1lLHFCQUFtQixHQUFHLGVBQWUsQ0FBQ2IsbUJBQXNDLENBQUMsQ0FBQztBQUNwRixNQUFNYyw4QkFBNEIsR0FBRyxlQUFlLENBQUNaLDRCQUErQyxDQUFDLENBQUM7QUFDdEcsTUFBTWEsNEJBQTBCLEdBQUcsZUFBZSxDQUFDWCwwQkFBNkMsQ0FBQyxDQUFDO0FBQ2xHLE1BQU1ZLDBCQUF3QixHQUFHLGVBQWUsQ0FBQ1Ysd0JBQTJDLENBQUMsQ0FBQztBQUM5RixNQUFNVyw2QkFBMkIsR0FBRyxlQUFlLENBQUNDLDJCQUE4QyxDQUFDLENBQUM7QUFDcEcsTUFBTUMsK0JBQTZCLEdBQUcsZUFBZSxDQUFDQyw2QkFBZ0QsQ0FBQyxDQUFDO0FBQ3hHLE1BQU1DLDJCQUF5QixHQUFHLGVBQWUsQ0FBQ0MseUJBQTZDLENBQUMsQ0FBQztBQUNqRyxNQUFNQywwQkFBd0IsR0FBRyxlQUFlLENBQUNDLHdCQUE0QyxDQUFDLENBQUM7QUFDdEM7QUFDekQsTUFBTUMsc0JBQW9CLEdBQUcsZUFBZSxDQUFDQyxvQkFBdUMsQ0FBQyxDQUFDO0FBQ3RGLE1BQU1DLHNCQUFvQixHQUFHLGVBQWUsQ0FBQ0Msb0JBQXVDLENBQUMsQ0FBQztBQUN0RixNQUFNQyxtQkFBaUIsR0FBRyxlQUFlLENBQUNDLGlCQUFvQyxDQUFDLENBQUM7QUFDaEYsTUFBTUMsOEJBQTRCLEdBQUcsZUFBZSxDQUFDQyw0QkFBK0MsQ0FBQyxDQUFDO0FBQzdEO0FBQ3pDLE1BQU1DLHlCQUF1QixHQUFHLGVBQWUsQ0FBQ0MsdUJBQXFELENBQUMsQ0FBQztBQUN2RyxNQUFNQyx3Q0FBc0MsR0FBRyxlQUFlLENBQUNDLHNDQUF5RCxDQUFDLENBQUM7QUFDMUgsY0FBYyxHQUFHLElBQUlDLFFBQVEsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RSxjQUFjLEdBQUcsSUFBSUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2RSxVQUFVLEdBQUcsSUFBSUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUNsQyxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBQ0QsYUFBYSxHQUFHLEtBQUssQ0FBQztBQUN0QixTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUN0QyxJQUFJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBQ0QsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0FBQzlCLFNBQVMseUJBQXlCLENBQUMsWUFBWSxHQUFHLEtBQUssRUFBRTtBQUN6RCxJQUFJLE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM1RCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUlaLHNCQUFvQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDL0QsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJRSxzQkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSWQscUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUM5RCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUlrQiw4QkFBNEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSUksd0NBQXNDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNqRixJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDRCxpQ0FBaUMsR0FBRyx5QkFBeUIsQ0FBQztBQUM5RCxTQUFTLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxJQUFJLEVBQUUsWUFBWSxHQUFHLEtBQUssRUFBRTtBQUN0RSxJQUFJLE9BQU9HLGNBQWdCLENBQUMsMEJBQTBCLENBQUM7QUFDdkQsUUFBUSxPQUFPLEVBQUU7QUFDakIsWUFBWSxJQUFJTCx5QkFBdUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQzdELFlBQVksSUFBSXZCLGdDQUE4QixDQUFDLE9BQU8sRUFBRTtBQUN4RCxZQUFZLElBQUlDLGlDQUErQixDQUFDLE9BQU8sRUFBRTtBQUN6RCxZQUFZLElBQUlDLGlDQUErQixDQUFDLE9BQU8sRUFBRTtBQUN6RCxZQUFZLElBQUlpQixtQkFBaUIsQ0FBQyxPQUFPLEVBQUU7QUFDM0MsWUFBWSxJQUFJZiw4QkFBNEIsQ0FBQyxPQUFPLEVBQUU7QUFDdEQsWUFBWSxJQUFJQyw0QkFBMEIsQ0FBQyxPQUFPLEVBQUU7QUFDcEQsWUFBWSxJQUFJQywwQkFBd0IsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzVELFlBQVksSUFBSUMsNkJBQTJCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUMvRCxZQUFZLElBQUlFLCtCQUE2QixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDakUsU0FBUztBQUNULFFBQVEsUUFBUSxFQUFFLENBQUMsSUFBSUksMEJBQXdCLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSUYsMkJBQXlCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkcsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFDRCwyQkFBMkIsR0FBRyxtQkFBbUI7Ozs7QUM5RGpELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3lDO0FBQzdEO0FBQzFDLE1BQU0sc0JBQXNCLFNBQVMsOEJBQThCLENBQUMsNEJBQTRCLENBQUM7QUFDakcsSUFBSSxhQUFhLEdBQUc7QUFDcEIsUUFBUSxPQUFPLHFCQUFxQixDQUFDO0FBQ3JDLEtBQUs7QUFDTCxJQUFJLGNBQWMsR0FBRztBQUNyQixRQUFRLE9BQU8saUNBQWlDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksYUFBYSxHQUFHO0FBQ3BCLFFBQVEsT0FBTyxnRkFBZ0YsQ0FBQztBQUNoRyxLQUFLO0FBQ0wsSUFBSSw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ2pELFFBQVEsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLDRCQUE0QixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5RSxRQUFRLElBQUksVUFBVSxFQUFFO0FBQ3hCLFlBQVksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDakYsZ0JBQWdCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFL0IsSUFBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRSxnQkFBZ0IsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxnQkFBZ0IsSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQy9CLG9CQUFvQixVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEUsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDaEgsZ0JBQWdCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFQSxJQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLGdCQUFnQixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELGdCQUFnQixJQUFJLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDL0Isb0JBQW9CLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0UsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1QsUUFBUSxPQUFPLFVBQVUsQ0FBQztBQUMxQixLQUFLO0FBQ0wsQ0FBQztBQUNELGVBQWUsR0FBRyxzQkFBc0I7Ozs7QUNsQ3hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlELHNCQUFzQixHQUFHLDBCQUEwQixHQUFHLGlCQUFpQixHQUFHLG9CQUFvQixHQUFHLDBCQUEwQixHQUFHLHNCQUFzQixHQUFHLDRCQUE0QixHQUFHLCtCQUErQixHQUFHLHdCQUF3QixHQUFHLDBCQUEwQixHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ3RPO0FBQ0U7QUFDbkQsMEJBQTBCLEdBQUc7QUFDN0IsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUNoQixJQUFJLElBQUksRUFBRSxDQUFDO0FBQ1gsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUNmLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ2pCLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ2pCLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQ25CLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxFQUFFLENBQUM7QUFDWCxDQUFDLENBQUM7QUFDRix3QkFBd0IsR0FBRztBQUMzQixJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2YsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksUUFBUSxFQUFFLENBQUM7QUFDZixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksV0FBVyxFQUFFLENBQUM7QUFDbEIsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLElBQUksU0FBUyxFQUFFLEVBQUU7QUFDakIsSUFBSSxLQUFLLEVBQUUsRUFBRTtBQUNiLElBQUksTUFBTSxFQUFFLEVBQUU7QUFDZCxJQUFJLFVBQVUsRUFBRSxFQUFFO0FBQ2xCLElBQUksS0FBSyxFQUFFLEVBQUU7QUFDYixJQUFJLE1BQU0sRUFBRSxFQUFFO0FBQ2QsSUFBSSxVQUFVLEVBQUUsRUFBRTtBQUNsQixJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ2IsSUFBSSxNQUFNLEVBQUUsRUFBRTtBQUNkLENBQUMsQ0FBQztBQUNGLCtCQUErQixHQUFHO0FBQ2xDLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ2IsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNkLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2YsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUNiLElBQUksTUFBTSxFQUFFLENBQUM7QUFDYixJQUFJLE1BQU0sRUFBRSxFQUFFO0FBQ2Qs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

import { Marked } from "marked";
import DOMPurify from 'dompurify';
import * as emoji from 'node-emoji'
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
	emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);

function parse_text(text){
    return  DOMPurify.sanitize(emoji.emojify((marked.parse(text))));
}

export function yaml2html(slide ){
    console.log(slide);
    if (slide.constructor === Array){
        var result = "";
        for (const e of slide){
            let leftPartExists = false;
            if ("spanCenterText" in e){
                var fontSize = 1;
                if ("fontSize" in e){
                    fontSize = e["fontSize"];
                }
                result += `<div class='spancenter' style='font-size:${fontSize}fem'>${parse_text(e["spanCenterText"])}</div>`;
            }
            if ("title" in e){
                result += _title(parse_text(e["title"]), e["fontSize"]);
            }
            if ("leftText" in e){
                result += _left(parse_text(e["leftText"]), e["fontSize"]);
                leftPartExists = true;
            }
            if ("rightText" in e){
                result += _right(parse_text(e["rightText"]), e["fontSize"]);
            }
            if ("spanText" in e){
                result += _span(parse_text(e["spanText"]), e["fontSize"]);
            }
            if ("leftImage" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                result += _left(`${textAbove}<img src='${e["leftImage"]}' alt='image ${e["leftImage"]}' class='simage' ${height}>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("rightImage" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                result += _left(`${textAbove}<img src='${e["rightImage"]}' alt='image ${e["rightImage"]}' class='simage' ${height}>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("spanImage" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                result += _span(`${textAbove}<img src='${e["spanImage"]}' alt='image ${e["spanImage"]}' class='simage' ${height}>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("spanImage" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                result += _spanCenter(`${textAbove}<img src='${e["spanImage"]}' alt='image ${e["spanImage"]}' class='simage' ${height}>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("leftIFrame" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                const [url, h] = _youtubeURLfix(e["leftIFrame"], e["height"]);
                result += _left(`${textAbove}<iframe src='${url}' title='iframe ${url}' class='sframe' ${h}></iframe>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("rightIFrame" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                const [url, h] = _youtubeURLfix(e["rightIFrame"], e["height"]);
                result += _right(`${textAbove}<iframe src='${url}' title='iframe ${url}' class='sframe' ${h}></iframe>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("spanIFrame" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                const [url, h] = _youtubeURLfix(e["spanIFrame"], e["height"]);
                result += _span(`${textAbove}<iframe src='${url}' title='iframe ${url}' class='sframe' ${h}></iframe>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("spanCenterIFrame" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    e["textBelow"], e["textAbove"], e["height"], e["width"]
                );
                const [url, h] = _youtubeURLfix(e["spanCenterIFrame"], e["height"]);
                result += _spanCenter(`${textAbove}<iframe src='${url}' title='iframe ${url}' class='sframe' ${h}></iframe>${textBelow}`,
                    e["fontSize"]
                )
            }
            if ("leftMyCamera" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    null, null, e["height"], null
                );
                result += _left(`<div class='demoCameraStream' ${height}></div>`)
            }
            if ("rightMyCamera" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    null, null, e["height"], null
                );
                result += _right(`<div class='demoCameraStream' ${height}></div>`)
            }
            if ("spanMyCamera" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    null, null, e["height"], null
                );
                result += _span(`<div class='demoCameraStream' ${height}></div>`)
            }
            if ("spanCenterMyCamera" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    null, null, e["height"], null
                );
                result += _spanCenter(`<div class='demoCameraStream' ${height}></div>`)
            }
            if ("leftMP4" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    undefined, undefined, e["height"], undefined
                );
                result += _left(`<div data-src='${e["leftMP4"]}' class='demoCameraStream' ${height}'></div>`,
                    e["fontSize"]
                )
            }
            if ("rightMP4" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    undefined, undefined, e["height"], undefined
                );
                result += _right(`<div data-src='${e["rightMP4"]}' class='demoCameraStream' ${height}'></div>`,
                    e["fontSize"]
                )
            }
            if ("spanMP4" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    undefined, undefined, e["height"], undefined
                );
                result += _span(`<div data-src='${e["spanMP4"]}' class='demoCameraStream' ${height}'></div>`,
                    e["fontSize"]
                )
            }
            if ("spanCenterMP4" in e){
                const [textBelow, textAbove, height] = _textBelowAboveHeight(
                    undefined, undefined, e["height"], undefined
                );
                result += _spanCenter(`<div data-src='${e["spanCenterMP4"]}' class='demoCameraStream' ${height}'></div>`,
                    e["fontSize"]
                )
            }
        }
        return result;
    }
    else{
        return slide["html"];
    }
}

function _left(text, fontSize=undefined){
    if (fontSize == undefined){ fontSize = 1}
    return `<div class='left' style='font-size:${fontSize*1.25}fem'>${text}</div>`;
}

function _right(text, fontSize=undefined){
    if (fontSize == undefined){ fontSize = 1}
    return `<div class='right' style='font-size:${fontSize*1.25}fem'>${text}</div>`;
}

function _span(text, fontSize=undefined){
    if (fontSize == undefined){ fontSize = 1}
    return `<div class='span' style='font-size:${fontSize*1.25}fem'>${text}</div>`;
}

function _spanCenter(text, fontSize=undefined){
    if (fontSize == undefined){ fontSize = 1}
    return `<div class='spancenter' style='font-size:${fontSize*1.25}fem'>${text}</div>`;
}

function _title(text, fontSize=undefined){
    if (fontSize == undefined){ fontSize = 1}
    return `<div class='title' style='font-size:${fontSize*1.25}fem'>${text}</div>`;
}
function _textBelowAboveHeight(textBelow, textAbove, height, width=undefined){
    var textBelow = "";
    if (textBelow != undefined){
        textBelow = parse_text(textBelow)
    }  
    var textAbove = "";
    if (textAbove != undefined){
        textAbove = parse_text(textAbove)
    }
    var style = ""
    if (height != undefined){
        style += "height:%spx;max-height:%spx;" % (height, height)
    }
    if (width != undefined){
        style += "width:%spx;max-width:%spx;" % (width, width)
    }
    if (style != ""){
        style = "style='" + style + "'"
    }
    return [textBelow, textAbove, style];
}

function _youtubeURLfix(url, height) {
    if (url.includes("www.youtube.") || url.includes("https://youtu.be/")) {
        height += ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen';
        url = url.replace("?t=", "?start=");
        url = url.replace("www.youtube.com/watch?v=", "www.youtube.com/embed/");
        url = url.replace("https://youtu.be/", "https://www.youtube.com/embed/");
    }
    return [url, height];
}

import { marked } from "marked";
import DOMPurify from 'dompurify';
import * as emoji from 'node-emoji'


function parse_content(text){
    return  DOMPurify.sanitize(emoji.emojify((marked.parse(text))));
}

export function yaml2html(slide ){
    console.log(slide);
    if ("html" in slide){
        return slide["html"];
    }
    else if ("spanCenterText" in slide){
        var fontSize = 1;
        if ("fontSize" in slide){
            fontSize = slide["fontSize"];
        }
        return  `<div class='spancenter' style='font-size:${fontSize}fem'>${parse_content(slide["spanCenterText"])}</div>`;
    }
}


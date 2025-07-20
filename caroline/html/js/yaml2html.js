import { marked } from "marked";

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
        return  `<div class='spancenter' style='font-size:${fontSize}fem'>${marked.parse(slide["spanCenterText"])}</div>`;
    }
}


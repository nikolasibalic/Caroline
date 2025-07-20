

export function yaml2html(slide ){
    console.log(slide);
    if ("html" in slide){
        return slide["html"];
    }
    else if ("spanCenterText" in slide){
        return slide["spanCenterText"];
    }
}


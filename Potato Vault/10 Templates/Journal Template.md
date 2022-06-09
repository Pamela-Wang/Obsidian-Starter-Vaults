<%-*
var cleanTitle = tp.user.getTitleSnippet(tp.file.title) 
var title = `${cleanTitle}`;
title = "Journal - " + `${title}` + " " + tp.date.now("YYYY-MM-DD");
await tp.file.rename(`${title}`);
-%>
mode:: #mode/life🏠 
kind:: #Journal/Plan🍹
topics::
date:: [[<% tp.date.now("YYYY-MM-DD") %>]]
status:: #Status/Blank⚪ 
summary:: 
<%-*
var cleanTitle = tp.user.getTitleSnippet(tp.file.title) 
var title = `${cleanTitle}`;
title = "Book Source - " + `${title}`;
await tp.file.rename(`${title}`);
-%>
mode:: #mode
kind:: #Source/Book📖 
project:: 
topics:: 
status:: #Status/Blank⚪ 
date:: [[<% tp.date.now("YYYY-MM-DD") %>]]
summary:: 

# Source Info

# Notes

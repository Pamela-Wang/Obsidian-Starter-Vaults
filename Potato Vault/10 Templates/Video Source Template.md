<%-*
var cleanTitle = tp.user.getTitleSnippet(tp.file.title) 
var title = `${cleanTitle}`;
title = "Video Source - " + `${title}`;
await tp.file.rename(`${title}`);
-%>
mode:: #mode
kind:: #Source/Video🖥️ 
project:: 
topics:: 
status:: #Status/Blank⚪ 
date:: [[<% tp.date.now("YYYY-MM-DD") %>]]
summary:: 

# Video
source:: 

# Notes

<%-* 
var cleanTitle = tp.user.getTitleSnippet(tp.file.title)
var title = "Z - " + `${cleanTitle}`;
await tp.file.rename(`${title}`)
_%>
---
aliases:
- <%-* tR += tp.user.getTitleSnippet(tp.file.title) -%>

---
mode:: #mode/zettelkasten🗳️ 
kind:: #Z/Inspired💡 
topics:: 
date:: [[<% tp.date.now("YYYY-MM-DD") %>]]
status:: #Zettel/Fleeting⚪ 
project::
summary:: 

# Thoughts

# Source


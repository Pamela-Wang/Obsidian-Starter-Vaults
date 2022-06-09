<%-*
var cleanTitle = tp.user.getTitleSnippet(tp.file.title) 
var title = `${cleanTitle}`;
let myFilePath = "/10 Templates/" + `${title}`;
await tp.file.move(`${myFilePath}`);
-%>
kind:: 
type::
topic::
summary::
doc::
status::
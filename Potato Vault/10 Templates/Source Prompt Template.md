<%-*  let filetype = await tp.system.suggester(["Book Source", "Video Source"], ["Book Source", "Video Source"], false, "Which template do you want to use?") -%>
<%-* if (filetype === "Book Source") {  -%>
<%-tp.file.include("[[Book Source Template]]")-%>
<%-* } else if (filetype === "Video Source") {  -%>
<%-tp.file.include("[[Video Source Template]]")-%>
<%-* } else { -%>
<%-tp.file.include("[[Default Note Template]]")-%>
<%-* } -%>

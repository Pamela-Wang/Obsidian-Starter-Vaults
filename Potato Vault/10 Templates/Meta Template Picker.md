<%-* /* Extracting the Trigger if there is one */ -%>
<%-* 
if (tp.file.title.includes("-")){
	var trigger = (tp.file.title.split("-")[0]).toLowerCase().trim()
} else {
	var trigger = ""
} -%>
<%-* /* In case it is not a meta-template picker note */ -%>
<%-* if (tp.file.title.startsWith("weekly review")) { -%>
<%-tp.file.include("[[Weekly Review Template]]")-%>
<%-* } else if (tp.file.title.startsWith("monthly review")) { -%>
<%-tp.file.include("[[Monthly Review Template]]")-%>
<%-* } else if (tp.file.title.includes("template")) { -%>
<%-tp.file.include("[[Template for Template]]")-%>
<%-* /* If it is a trigger note then check which note */ -%>
<%-* } else if (trigger === "z") { -%>
<%-tp.file.include("[[Simple Zettel Template]]")-%>
<%-* } else if (trigger === "s") {  -%>
<%-tp.file.include("[[Source Prompt Template]]")-%>
<%-* } else if (trigger === "source") {  -%>
<%-tp.file.include("[[Source Prompt Template]]")-%>
<%-* } else if (trigger === "sbook") {  -%>
<%-tp.file.include("[[Book Source Template]]")-%>
<%-* } else if (trigger === "svid") {  -%>
<%-tp.file.include("[[Video Source Template]]")-%>
<%-* } else if (trigger === "j") {  -%>
<%-tp.file.include("[[Journal Template]]")-%>
<%-* } else if (trigger === "journal") {  -%>
<%-tp.file.include("[[Journal Template]]")-%>
<%-* } else { -%>
<%-* /* Default Note if not trigger note */ -%>
<%-tp.file.include("[[Default Note Template]]")-%>
<%-* } -%>




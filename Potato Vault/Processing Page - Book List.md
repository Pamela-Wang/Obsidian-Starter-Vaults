mode:: #mode/other☄️
kind:: #SystemMeta/Utility⚙️ 
doc:: Shows a list of books that I have read (by #Source/Book📖 )

# Book List
```dataview
table summary, topics, status
FROM #Source/Book📖  and !"80 Archive" and !#SystemMeta
sort file.mtime desc
```
mode:: #mode/life🏠 
kind:: #SystemMeta/Utility⚙️ 
type:: 
topics::
status:: #Status/Completed🟢 

# Quick View - Daily
doc:: This is a rollup that shows the tasks from the dailies of the last 7 days
```dataview
TASK 
FROM #Periodic/Daily📅  and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta and !"logseq"
WHERE (file.mtime >= (date(now)-dur(1 week))) and (file.mtime <= date(now)+dur(1 day)) and !completed
WHERE !contains(meta(section).subpath, "Checklist")
```

# Quick View - Other Files
doc:: This is a rollup that shows the tasks from the last 7 days - excluding dailies. Note current problem that default template todos are not excluded... 




<%-*
myFilePath = "/20 Periodic/23 Monthly Review/" + tp.file.title
await tp.file.move(`${myFilePath}`);
-%>
mode:: #mode/life🏠 
kind:: #Periodic/Monthly🌔 
status:: #Status/Blank⚪ 
summary:: Monthly Review for last month <% tp.date.now("YYYY-MM", "P-1M") %> and what to keep in mind for this month <% tp.date.now("YYYY-MM") %>

# This Month <% tp.date.now("YYYY-MM") %>
## Keep In Mind
> What to keep in mind for this month - events, tasks and birthdays

## Goals

# Task List
- ## Home
	- [ ] [[Monthly Academic Report - <% tp.date.now("MMM YYYY") %>]]
- ## Home
	- [ ] What have I done this month
	- [ ] Draw a Monthly Spread
	- [ ] Goals for next month

# Summary of Last Month <% tp.date.now("MMMM YYYY") %>

## Weeks of The Month
```dataview
list
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]]
```
## Memories
```dataview
table weekly_memories_summary AS "Entry"
FROM [[<%tp.file.title%>]]
WHERE weekly_memories_summary 
SORT file.day DESC
```
monthly_memories_summary::


## Work
```dataview
table weekly_work_summary AS "Entry"
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]] and weekly_work_summary 
SORT file.day DESC
```
monthly_work_summary:: 

## Youtube
```dataview
table weekly_youtube_summary AS "Entry"
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]] and weekly_youtube_summary 
SORT file.day DESC
```
monthly_youtube_summary:: 

## Goals
### Feelings
```dataview 
TABLE WITHOUT ID link(file.name) as "Day", feeling AS "😊", energy AS "⚡"
FROM #Periodic/Daily📅  and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE file.ctime >= date(<% tp.date.now("YYYY-MM-DD") %>)-dur(1 month) and file.ctime <= date(<% tp.date.now("YYYY-MM-DD") %>)
SORT file.name ASC
```


### In-Depth habit Tracker
```tracker
searchType: task.done  
searchTarget: straight out of bed to desk
datasetName: OutOfBed
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD", "P+1M") %>
fixedScale: 1
bullet:
    title: "Start Day"
    dataset: 0
    orientation: horizontal
    range: 10, 20, 30
    rangeColor: darkgray, silver, lightgray
    value: "{{sum()}}"
    valueUnit: times
    valueColor: '#69b3a2'
    showMarker: true
    markerValue: 24
    markerColor: black
```
```tracker
searchType: task.done  
searchTarget: tea
datasetName: Tea
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD", "P+1M") %>
fixedScale: 1
bullet:
    title: "Get Tea"
    dataset: 0
    orientation: horizontal
    range: 10, 20, 30
    rangeColor: darkgray, silver, lightgray
    value: "{{sum()}}"
    valueUnit: times
    valueColor: '#69b3a2'
    showMarker: true
    markerValue: 24
    markerColor: black
```
```tracker
searchType: task.done  
searchTarget: Exercise - yoga or walk or swim or strength training
datasetName: Exercise
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD") %>
fixedScale: 1
bullet:
    title: "Exercise"
    dataset: 0
    orientation: horizontal
    range: 10, 20, 30
    rangeColor: darkgray, silver, lightgray
    value: "{{sum()}}"
    valueUnit: times
    valueColor: '#69b3a2'
    showMarker: true
    markerValue: 24
    markerColor: black
```
```tracker
searchType: task.done  
searchTarget: forest
datasetName: Forest
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD") %>
fixedScale: 1
bullet:
    title: "Forest"
    dataset: 0
    orientation: horizontal
    range: 10, 20, 30
    rangeColor: darkgray, silver, lightgray
    value: "{{sum()}}"
    valueUnit: times
    valueColor: '#69b3a2'
    showMarker: true
    markerValue: 24
    markerColor: black
```
```tracker
searchType: task.done  
searchTarget: Work 4 hours at least
datasetName: Work
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD") %>
fixedScale: 1
bullet:
    title: "Work"
    dataset: 0
    orientation: horizontal
    range: 10, 20, 30
    rangeColor: darkgray, silver, lightgray
    value: "{{sum()}}"
    valueUnit: times
    valueColor: '#69b3a2'
    showMarker: true
    markerValue: 24
    markerColor: black
```
```tracker
searchType: task.done, task.done
searchTarget: Work 4 hours at least, Exercise - yoga or walk or swim or strength training
datasetName: Productivity, Exercise
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", "P-1M") %>
endDate: <% tp.date.now("YYYY-MM-DD") %>
month:
	mode: "annotation"
	showStreak: true
    startWeekOn: "Mon"
    color: green
    headerMonthColor: orange
    dimNotInMonth: false
	annotation: 🎩,🏃‍♀️
	todayRingColor: orange
	showAnnotationOfAllTargets: true
	selectedRingColor: steelblue
    circleColorByValue: true
```
### Habits Overview
```dataview
table weekly_progression_summary AS "Entry"
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]] and weekly_progression_summary 
SORT file.day DESC
```
monthly_progression_summary:: 

## Life
```dataview
table weekly_life_summary AS "Entry"
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]] and weekly_progression_summary 
SORT file.day DESC
```
monthly_life_summary:: 

## Reflection
```dataview
table weekly_reflection_summary AS "Entry"
FROM #Periodic/Weekly📆  and [[<%tp.file.title%>]]
WHERE parent=[[<%tp.file.title%>]] and weekly_reflection_summary 
SORT file.day DESC
```
monthly_reflection_summary::
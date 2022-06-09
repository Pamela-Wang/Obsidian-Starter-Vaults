<%-*
myFilePath = "/20 Periodic/22 Weekly Review/" + tp.file.title
await tp.file.move(`${myFilePath}`);
-%>
<< [[<% tp.date.weekday("[Weekly Review] YYYY-[W]ww (MMM-DD)",  -7) %>]] | [[Monthly Review <% tp.date.now("YYYY-MM (MMMM)") %>]]  | [[<% tp.date.weekday("[Weekly Review] YYYY-[W]ww (MMM-DD)",  7) %>]] >>
mode:: #mode/life🏠 
kind:: #Periodic/Weekly📆 
status:: #Status/Blank⚪ 
summary:: Weekly Review for <% tp.date.weekday("YYYY-MM-DD" , 0) %> to <% tp.date.weekday("YYYY-MM-DD", 6) %>


# This Week
![[<% tp.date.weekday("[Weekly Review] YYYY-[W]ww (MMM-DD)",  -7) %>#Notes for Next Week]]



# Review This Week

## Notes for Next Week

### Events

### Must Do

### Changes to System

### Bonus

### Misc


## Checklist
- ### Task Generation 
	- [ ] Check Calendar
	- [ ] Check Email
	- [ ] Check Slack
	- [ ] Ideate using Trigger List 2022
	- [ ] Check Long Term Task
	- [ ] Check [[Next Weekly Review]] and remove anything from last week

- ### This Past Week
	- #### Clear inbox
		- [ ] Tasks this week
		- [ ] Captures →  Zettels

	- #### Summary
		- [ ] Work Log
		- [ ] Daily Log
		- Side Hustle Log
		- Cute things that happened this week
		- Memories
		- Accomplishments
		- Disappointments

- ### Tracking - Goal Progress
	- [ ] Mini-habits progress →  Reward?
	- What goals or projects have I been working on and how has it gone

- ### Plan - Focus and Prep
	- [ ] What do I need to get done next week? FOCUS ON THIS 
		- [ ] What are the next actions
		- [ ] goal & deadline for chosen project or task
	- Are task lists updated?
	- Goals to focus on?
	- [ ] Mini habits to work on?

- ### Plan - Timeblock
	- [ ] What needs to be done this week (Urgent and Important)
	- [ ] Regular schedule (monthly review goal tasks and events I want to do this week)
	- [ ] Batch Errands (Misc tasks on which day?)
	- [ ] Any tasks to be discarded?
	- [ ] Anything I can delegate?
	- [ ] Assign do dates to the tasks

- ### Plan - Prep
	- [ ] Sleeping times for the week (morning events?)
	- [ ] Emails to send
	- [ ] Arrange for travel
	- [ ] Check the reflection below (and implement)


# Summary of this Week - <% tp.date.weekday("YYYY-MM-DD", 0) %> to <% tp.date.weekday("YYYY-MM-DD", 6) %>

## Week Notes
- [[<% tp.date.weekday("YYYY-MM-DD", 0) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 1) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 2) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 3) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 4) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 5) %>]]
- [[<% tp.date.weekday("YYYY-MM-DD", 6) %>]]

## Memories
```dataview
table
memories AS "Entry"
FROM #Periodic/Daily📅 and [[<% tp.file.title %>]]
WHERE memories and (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```

```dataview
table summary
FROM [[<% tp.date.weekday("YYYY-MM-DD", 0) %>]] and [[<% tp.date.weekday("YYYY-MM-DD", 1) %>]] and [[<% tp.date.weekday("YYYY-MM-DD", 2) %>]]  and [[<% tp.date.weekday("YYYY-MM-DD", 3) %>]]  and [[<% tp.date.weekday("YYYY-MM-DD", 4) %>]]  and [[<% tp.date.weekday("YYYY-MM-DD", 5) %>]]  and [[<% tp.date.weekday("YYYY-MM-DD", 6) %>]] and #Journal/Memories🏝️ 
WHERE (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```
weekly_memories_summary:: 

## Goals
### Feelings
```dataview 
TABLE WITHOUT ID link(file.name) as "Day", feeling AS "😊", energy AS "⚡"
FROM #Periodic/Daily📅 and [[<% tp.file.title %>]]
WHERE (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.name ASC
```

### Habits
```tracker
searchType: task.done  
searchTarget: light exposure
datasetName: LightExposure
folder: "20 Periodic/21 Daily Notes"
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
fixedScale: 1
bullet:
    title: "Light Exposure"
    dataset: 0
    orientation: horizontal
    range: 3, 5, 7
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
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
fixedScale: 1
bullet:
    title: "Get Tea"
    dataset: 0
    orientation: horizontal
    range: 3, 5, 7
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
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
fixedScale: 1
bullet:
    title: "Exercise"
    dataset: 0
    orientation: horizontal
    range: 3, 5, 7
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
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
fixedScale: 1
bullet:
    title: "Forest"
    dataset: 0
    orientation: horizontal
    range: 3, 5, 7
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
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
fixedScale: 1
bullet:
    title: "Work"
    dataset: 0
    orientation: horizontal
    range: 3, 5, 7
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
startDate: <% tp.date.weekday("YYYY-MM-DD", 0) %>
endDate: <% tp.date.weekday("YYYY-MM-DD", 6) %>
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

weekly_progression_summary:: 


## Work
```dataview
table
work_log AS "Entry"
FROM ( #Periodic/Daily📅 or "Daily" ) and [[<% tp.file.title %>]] and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE work_log and (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```
weekly_work_summary:: 

## Youtube
```dataview
table
youtuber_log AS "Entry"
FROM ( #Periodic/Daily📅 or "Daily" ) and [[<% tp.file.title %>]] and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE youtuber_log and (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```
weekly_youtube_summary:: 

## Life
```dataview
table
life_log AS "life", daily_log AS "Summary"
FROM ( #Periodic/Daily📅 or "Daily" ) and [[<% tp.file.title %>]] and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE (daily_log or life_log) and (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```
weekly_life_summary::

## Reflection
```dataview
table
insights AS "reflection", doc AS "system change"
FROM ( #Periodic/Daily📅 or "Daily" ) and [[<% tp.file.title %>]] and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE (insights or doc) and (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) 
SORT file.day 
```
weekly_reflection_summary::


## Tasks this Week
```dataview
TASK FROM #Periodic/Daily📅 and [[<% tp.file.title %>]] and !"80 Archive" and !"90 Meta" and !"10 Templates" and !"00 System" and !#SystemMeta 
WHERE (file.mtime >= (date("<% tp.date.weekday('YYYY-MM-DD', 0) %>"))) and (file.ctime <= date("<% tp.date.weekday('YYYY-MM-DD', 6) %>")+dur(1 day)) and !completed
WHERE !contains(meta(section).subpath, "Checklist")
```
# Intro 
This is a starter kit for beginners to obsidian. It is a simplified version of my vault with my daily and weekly note templates, the folder structure for my periodic notes (daily, weekly, monthly etc) and the plugin settings I use.

# Installation
1. Download this folder 
2. Open the Potato Vault using Obsidian 

# Using This Vault
How to install and use this vault in 1 minute :) I assume you already downloaded this folder
[![Basic Installation and Usage](https://img.youtube.com/vi/M3fgx_DYJYM/0.jpg)](https://www.youtube.com/watch?v=M3fgx_DYJYM)

This is a more detailed guide on how the automation of the weekly review works. So it goes into the details of using obsidian dataview rollups, the structure of my weekly review (based off GTD) and also some things to note.
[![Detailed Automated Weekly Review Guide](https://img.youtube.com/vi/tUWjyzvljfs/0.jpg)](https://www.youtube.com/watch?v=tUWjyzvljfs)


## Productiviy Tips
My most commonly used shortcuts (that are already in this vault) 

[![Potato Vault Shortcuts](https://img.youtube.com/vi/DZPi7K53wOE/0.jpg)](https://www.youtube.com/watch?v=DZPi7K53wOE)
Note that I use the Colemak-dh keyboard layout (helps with typing pain, if you wanna learn it try the Tarmak method by Dreymar) so you may want to remap the shortcuts (to be mostly on the left side of the keyboard since right hand is usually on mouse)

# Bug fixes
I try to cover all possible bugs in the  [Detailed Automated Weekly Review Guide Video](https://www.youtube.com/watch?v=tUWjyzvljfs) but here are some things that will break the system.
- If you change the folder structure, you have to update the Periodic Note Plugin Settings
- If you change the naming format of the daily or weekly review, you need to update the templates and the Periodic Note Plugin Settings
- If you click on the link to the weekly page (on the daily page) without first creating the note using "Periodic Notes: Open weekly note", you will get a blank page. Fix this by 
	1) Delete the blank page 
	2) Open Command Palette (CMD + P)
	3) Type in "weekly"
	4) Click on "Periodic Notes: Open weekly note"
- Depending on how your locale is set (does week start on monday or friday), you may need to change 
	- the links to the weekly review note in the daily note template (this will affect task filtering and also your ability to click from daily note to weekly note)
	- links to other weekly notes in the top of weekly review note

- If you see that your embed in the weekly review is cut off, try using the minimal theme as some themes will limit the length of the embed

# Note
I left all my css snippets in there, but they actually come from like various places? I tried my best to credit. If anyone wants me to remove it, email me at mwahacookie@gmail.com :) I check my email on all working days, so should be fixed within 48-72 hours.

# Upcoming
- [x] Basic vault for automated weekly review
- [x] Video on how to install and use for daily note and weekly review
- [x] Video on how to use shortcuts for this vault
- [ ] Cheatsheet on various shortcuts
- [ ] Add a meta templater for default notes

# Warlords-Stats
Retrieve stats from warlords matchmaking with a javascript console script.

## Features
- Retrieve all player stats from warlords website.
- Data can be displayed, sorted and downloaded in a JSON format.
- Request specific players data to be displayed only.

## Commands
- firstTimeRun(amount)
Make an initial request where amount equals requested amount of matches (5-75).
- fix()
Combines match sides and displays combined match statistics, by default matches are divided into sides.
- stats(amount)
Reset stats and retrieve new stats from latest match where amount equals requested amount of matches (5-75).
- more(amount)
Retrieve stats without resetting stats where amount equals requested amount of matches (5-75).
- getThesePlayers(names)
Filter statistics by requesting a list of names in an array. Premade list of names exists as getThesePlayers(request).

## How to use
- Browse to https://mbwarlords.com/warlords/mercenaries.php?q=clan_wars
- Log in to the website with your account.
- Press CTRL + Shift + I
- Press Console
- Paste all the code in the .js file provided.

# System Requirements
Google Chrome

## Author
Copyright (C) 2023-2024 Sebastian Ritschewald

## Screenshots
<img src="https://i.imgur.com/KuIhnga.png" width="50%" height="50%" />

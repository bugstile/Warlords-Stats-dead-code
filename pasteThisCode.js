let matches = [];
let combinedMatches = [];
let currentClanWarID;
let players = [];
let temp = [];
function Player(name, characters, damage, kills, rounds_won, rounds_played, clanWarID){
	this.name = name;
	this.characters = characters;
	this.damage = damage;
	this.kills = kills;
	this.rounds_won = rounds_won;
	this.rounds_played = rounds_played;
	this.clanWarID = clanWarID;
}

function checkNumber(input){
	if(input >= 5 && input <= 75){
		return true;
	} else {
		console.log('...5-50... 75 is ok if you are sure...')
		return false;
	}
}

function Match(clanWarID, sideNumber, participants, allStats) {
  this.clanWarID = clanWarID;
  this.sideNumber = sideNumber;
  this.participants = participants;
  this.allStats = allStats;
}

function combinedMatch(clanWarID, firstParticipants, secondParticipants, allStats){
	this.clanWarID = clanWarID;
	this.firstParticipants = firstParticipants;
    this.secondParticipants = secondParticipants;
	this.allStats = Boolean(allStats);
}

function addPlayers(matches){
	players = [];
	for (let i = 0; i < matches.length; i++){
		for (let y = 0; y < matches[i].participants.length; y++){
			if(matches[i].allStats){
				const myPlayer = new Player(matches[i].participants[y].name.toLowerCase(), matches[i].participants[y].characters.toLowerCase(), Number(matches[i].participants[y].damage), Number(matches[i].participants[y].kills), Number(matches[i].participants[y].rounds_won), Number(matches[i].participants[y].rounds_played), Number(matches[i].clanWarID));
				players.push(myPlayer)
			} else {
				const myPlayer = new Player(matches[i].participants[y].name.toLowerCase(), 'NaN', 'NaN', Number(matches[i].participants[y].kills), Number(matches[i].participants[y].rounds_won), Number(matches[i].participants[y].rounds_played), Number(matches[i].clanWarID));
				players.push(myPlayer)
			}
		}
	}
	return players;
}

function display(matches){
	players = [];
	console.table(addPlayers(matches));
}

function sort(){
	players = addPlayers(matches);
	temp = [];
	for (let i = 0; i < players.length; i++){
		if (players[i].rounds_played > 11 && players[i].rounds_played <= 25){
			temp.push(players[i]);
		}
	}
	console.table(temp);
}

function sortMatches(){
	matches.sort(function(a, b) { 
		return b.clanWarID - a.clanWarID || a.sideNumber - b.sideNumber;
	});
}

function combineStats(matches){
	combinedMatches = [];
	sortMatches();
	for (let i =0; i < matches.length; i++){
		let temp = i++;
		const obj = new combinedMatch(matches[i].clanWarID, matches[i].participants, matches[temp].participants, matches[i].allStats);
		combinedMatches.push(obj);
	}
}

function getLatestMatchID(){
	/* get the latest match ID, not always accurate so check last 7 scrims for last ID.*/
	let getMatches = document.getElementsByClassName('clan_war_participants_indicator') 
	let lastClanWarID = $(getMatches[0]).data('clanWarId');
	for (let i = 0; i < getMatches.length; i++) {
		if ($(getMatches[i]).data('clanWarId') > lastClanWarID){
			lastClanWarID = $(getMatches[i]).data('clanWarId')
		}
	}
	return lastClanWarID;
}


/*	Runs the program to retrieve new stats from the server.
Sends AJAX requests every two and half second to avoid flooding.
One match is split into two requests.	*/
function resetStats(amountOfMatches, reset){
	if(reset){
		let lastClanWarID = getLatestMatchID();
		currentClanWarID = lastClanWarID;
	}

	/* Timer */
	(function fiveSeconds  (n) {
	if (n < amountOfMatches) setTimeout(function () {  
	fiveSeconds ( n );
	}, 3000);
	
		if(currentClanWarID < 1515 && currentClanWarID > 1485){
			console.log('currentClanWarID < 1515 && currentClanWarID > 1485')
			console.log('skipping bugged database matches');
			currentClanWarID = 1485;
			getResultsOfMatch(currentClanWarID, 1, false);
			getResultsOfMatch(currentClanWarID, 2, false);
		} else if (currentClanWarID < 1485){
			getResultsOfMatch(currentClanWarID, 1, false);
			getResultsOfMatch(currentClanWarID, 2, false);
		} else {
			getResultsOfMatch(currentClanWarID, 1, true);
			getResultsOfMatch(currentClanWarID, 2, true);
		}
		

		currentClanWarID--;
		n++;
	} (0)); // Initialize. n is 0n
}

function getResultsOfMatch(clanWarId, sideNumber, allStats){
    // Define the query parameters
    let sideQuery = $.ajax({
        type: 'POST',
        url: '?q=clan_war_side',
        data: { 'clan_war_id': clanWarId, 'side' : sideNumber },
        dataType: 'json',
        timeout: 15000
    });
	
    // Perform the query
    sideQuery.done(function(sideData){
        if(sideData != null){
			let tempArray = []
			tempArray.push(sideData.members)
			const obj = new Match(clanWarId, sideNumber, sideData.members, allStats);
			if(sideData.members.length > 1){
				matches.push(obj)
				console.log('SUCCESS:', clanWarId, sideNumber, allStats, sideData.members)
			} else if (sideData.members.length < 7){
				console.log("less than 7 players? Skipping this sorry below 7v7 enjoyers but I don't care about your stats", sideData.members);
			} else {
				console.log('empty match, bugged?? Skipping this', sideData);
			}
			if(currentClanWarID+1 == clanWarId && sideNumber == 2){
				display(matches);
				showIntroText();
			}
        }
		
		
    });
	
	sideQuery.error(function(){
		console.log('ERROR: ' + clanWarId + ' ' +sideNumber +'. Timeout reached, trying again');
		setTimeout(	function(){getResultsOfMatch(clanWarId, sideNumber, allStats)}, 6000);
	});
	
    sideQuery.fail(function(){
        console.log('FAIL: ' + clanWarId + ' sidenumber: ' + sideNumber);
    });
}

function getThesePlayers(names){
	let yo = [];
	
	for(let i=0; i<names.length; i++){
		if(players.map(e => e.name).indexOf(names[i]) == -1){
			console.log("Can't find", names[i], players.map(e => e.name).indexOf(names[i]));
		}
	}
	
	for (let i = 0; i < players.length; i++){
		for (let y = 0; y < names.length; y++){
			if (players[i].name == names[y]){
				yo.push(players[i]);	
			}
			
		}
	}
	console.table(yo);
}


function more(amount){
	if(checkNumber(amount)){
		console.log('...Retrieving more stats...');
		resetStats(amount, false);
	}
}

function stats(amount){
	if(checkNumber(amount)){
		console.log('...Retrieving stats...');
		resetStats(amount, true);
	}
}

function fix(){
	console.log('...Combining matches...');
	combineStats(matches);
	console.log(combinedMatches);
}

function showIntroText(){
	console.log('hey ;3');
	console.log("Type stats(5) to retrieve 5 latest matches available. (5-50 available)");
	console.log("Type fix() to combine teams into one and reveal detailed stats.");
	console.log("Type more(20) to retrieve even more matches without resetting current history.(5-50 available)");
	console.log("Type display(matches) to display stats (1-999 rows available in chrome)");
	console.log("Type sort() to see filtered stats");
}

function firstTimeRun(amount){
	showIntroText();
	if(checkNumber(amount)){
		stats(amount);
	}
}

let request = ['tomayus', 'gibby','dope_smoker', 'hung', 'mace', 'blackmortis', 'fiend', 'lapache', 'steelyr', 'zobros', 'kurm', 'waveuser', 'bigo', 'stockfisch', 'renn', 'bigbob', 'popowicz', 'sis', 'tomke_rosenberg', 'kaltahar', 'eryk_kanciano', 'ronnyjonny', 'maximou', 'pandoo', 'azorekt', 'loose_cannon', 'troister', 'loregor', 'nazgulus', 'dekkers', 'kamatahan', 'ftf_gb', 'vanir', 'matteezy', 'xerxes', 'puffthedragon', 'mezzanine'];

firstTimeRun(20);

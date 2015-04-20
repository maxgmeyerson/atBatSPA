/**
 *   AUTHOR: Max Meyerson
 *   VERSION: 1.0
 *   CREATED: 3.23.2015
 *   PROJECT: At Bat Single Page Application
 */

"use strict";

/** @type {Array}.<string> */
var players = [],
	presentPlayers = [],
	fielders = [],
	batters = [];

/** @type {boolean} */
var areHomeTeam, topOfInning, atBat;

/** @type {number} */
var strikes, outs, fouls, balls, runs, bases, ourScore, theirScore, inningNum, playerNum;

function prepScreen() {
	$("#gameOver").hide();
	$("#fieldPositions").hide();
	$("#inning").hide();
	$("#counters").hide();
	$("#battingOrder").hide();
	$("#scoreboard").show();
	$('preGame').show();
	determineHome();

	ourScore=0;
	theirScore=0;

	for (var i = 0; i < players.length; i++) {
		var playerDiv = '<div class="small-9 column" id="player.' + i + '">' +
			'<h2>' + players[i][1] + " " + players[i][0] + '</h2>' +
			'</div>' +
			'<div class="switch round large small-3 columns">' +
			'<input id="present.' + i + '" type="checkbox" />' +
			'<label for="present.' + i + '"></label>' +
			'</div>';
		$('#playerAbsent').append(playerDiv);
	}
}

function setSecondaryArray() {
	fielders = presentPlayers;
	batters = presentPlayers;
}

function determineHome() {
	$("#homeTeam").click(function() {
		weField();
		areHomeTeam = true;
	});
	$("#visitorTeam").click( function() {
		weBat();
		areHomeTeam = false;
	});
}

function weBat() {
	$("#inning").show();
	$("#counters").show();
	$("#battingOrder").show();
	$("#scoreboard").show();
	$("#preGame").hide();
	$("#fieldPositions").hide();
	$("#undo").hide();
	setBattingOrder();
	atBat = true;
}

function setBattingOrder() {
	/** type {string} */
	var shiftedValue = batters.shift();
	batters.push(shiftedValue);
	displayBattingOrder();
}

function displayBattingOrder() {
	/** @type {string} */
	var currentBatter = '<h3>' + batters[0] + '</h3>',
		onDeck = '<h3>' + batters[1] + '</h3>' +
			'<h3>' + batters[2] + '</h3>' +
			'<h3>' + batters[3] + '</h3>';
	$('#currentBatter').html(currentBatter);
	$('#onDeck').html(onDeck);
}

function weField() {
	$("#fieldPositions").show();
	$("#inning").show();
	$("#counters").show();
	$("#battingOrder").hide();
	$("#scoreboard").show();
	$("#preGame").hide();
	$("#undo").hide();
	setFieldOrder();
	atBat = false;
}

function setFieldOrder() {
	/** @type {string} */
	var temp = fielders.shift();
	fielders.push(temp);
	displayFieldOrder();
}

function displayFieldOrder() {
	var positions = '<h2> C = ' + fielders[0] + '</h2>' +
		'<h2> P = ' + fielders[1] + '</h2>' +
		'<h2> 1B = ' + fielders[2] + '</h2>' +
		'<h2> 2B = ' + fielders[3] + '</h2>' +
		'<h2> 3B = ' + fielders[4] + '</h2>' +
		'<h2> SS = ' + fielders[5] + '</h2>' +
		'<h2> LF = ' + fielders[6] + '</h2>' +
		'<h2> CF = ' + fielders[7] + '</h2>' +
		'<h2> RF = ' + fielders[8] + '</h2>';
	if (fielders >= 9) {
		positions = positions + '<h2> ' + fielders[9] + '</h2>';
	}
	$('#positions').html(positions);
}

function resetInning() {
	outs=0;
	balls=0;
	fouls=0;
	strikes=0;
	runs=0;
	bases=0;

	$("#strikeCounter").text(strikes);
	$("#ballCounter").text(balls);
	$("#foulCounter").text(fouls);
	$("#outCounter").text(outs);
	$("#runCounter").text(runs);


	if (!inningNum) {
		inningNum = 1;
	}
	if (topOfInning === undefined) {
		topOfInning = true;
		$("#arrow").html('<h2 class="fa fa-arrow-up"></h2>');
		$("#inningNum").html('<h2>' + inningNum + '</h2>');
	} else if (topOfInning === true) {
		topOfInning = false;
		$("#arrow").html('<h2 class="fa fa-arrow-down"></h2>');
	} else if (topOfInning === false) {
		topOfInning = true;
		inningNum++;
		$("#inningNum").html('<h2>' + inningNum + '</h2>');
		$("#arrow").html('<h2 class="fa fa-arrow-up"></h2>');
	}

	var MAX_INNINGS = 9;

	if (inningNum > MAX_INNINGS) {
		$("#gameOver").show();
		$("#counters").hide();
		$("#inning").hide();
		$("#battingOrder").hide();
		$("#fieldPositions").hide();
	}
}

function strikeBtnClick() {
	$("#strikeBtn").click(function() {
		strike();
	});
}

function strike() {
	strikes++;

	var MAX_STRIKES = 3;

	if (strikes >= MAX_STRIKES) {
		out();
	}
	$("#strikeCounter").text(strikes);
}

function ballBtnClick() {
	$("#ballBtn").click(function() {
		ball();
	});
}

function ball() {
	balls++;

	var MAX_BALLS = 4;

	if (balls >= MAX_BALLS) {
		base();
	}

	$("#ballCounter").text(balls);

}

function foulBtnClick() {
	$("#foulBtn").click(function() {
		foul();
	});
}

function foul() {
	fouls++;

	var MAX_FOUL_STRIKES = 2;

	if (fouls <= MAX_FOUL_STRIKES) {
		strike();
	}

	$("#foulCounter").text(fouls);

}

function outBtnClick() {
	$("#outBtn").click(function() {
		out();
	});
}

function out() {
	outs++;

	strikes=0;
	fouls=0;
	balls=0;

	$("#strikeCounter").text(strikes);
	$("#ballCounter").text(balls);
	$("#foulCounter").text(fouls);
	$("#outCounter").text(outs);

	var MAX_OUTS = 3;

	if (outs >= MAX_OUTS) {
		if ((areHomeTeam === true) && (topOfInning === true)) {
			weBat();
			resetInning();
		} else if ((areHomeTeam === true) && (topOfInning === false)) {
			weField();
			resetInning();
		} else if ((areHomeTeam === false) && (topOfInning === true)) {
			weField();
			resetInning();
		} else if ((areHomeTeam === false) && (topOfInning === false)) {
			weBat();
			resetInning();
		}
	} else {
		setBattingOrder();
	}


}

function runBtnClick() {
	$("#runBtn").click(function() {
		run();
	});
}

function run() {
	runs++;
	$("#runCounter").text(runs);
	if (atBat === true) {
		ourScore++;
		$("#ourScore").text(ourScore);
	} else if (atBat === false) {
		theirScore++;
		$("#theirScore").text(theirScore);
	}

}

function baseBtnClick() {
	$("#baseBtn").click(function() {
		base();
	});
}

function base() {
	strikes=0;
	fouls=0;
	balls=0;

	$("#strikeCounter").text(strikes);
	$("#ballCounter").text(balls);
	$("#foulCounter").text(fouls);

	setBattingOrder();

	bases++;

	var FULL_BASES = 4;

	if (bases >= FULL_BASES) {
		run();
	}
}

function setPlayersArray() {
	/** @type {Array.<string>} */
	var lines = [];
	$.ajax({
		url: 'data/players.csv',
		contentType: "text/csv",
		async: false,
		success: function(text) {
			lines = text.split(/\n/);
			return;
		}
	});
	for (var i = 0; i < lines.length; i++) {
		players[i] = lines[i].split(",");
	}
	setAvailablePlayers();
}

function setAvailablePlayers() {
	for (var i = 0; i < players.length; i++) {
		var playerDiv = '<div class="small-9 column" id="player.' + i + '">' +
			'<h2>' + players[i][1] + " " + players[i][0] + '</h2>' +
			'</div>' +
			'<div id="checkbox.' + i + '" class="switch round large small-3 columns">' +
			'<input id="present.' + i + '" type="checkbox" />' +
			'<label for="present.' + i + '"></label>' +
			'</div>';
		$("#attendance").append(playerDiv);
	}
	setPresentPlayers();
}

function setPresentPlayers() {
	playerNum = 0;
	$("#attendance").change(function (event) {
		/** @type {Array}.<string> */
		var playerID = event.target.id.split(".");
		if ($(event.target).is(':checked')) {
			presentPlayers[playerNum] = players[playerID[1]][1] + ' ' + players[playerID[1]][0];
			playerNum++;
		} else {
			delete presentPlayers[playerID[1]];
		}
	});
}


window.onload = function() {
	setPlayersArray();
	prepScreen();
	setSecondaryArray();
	determineHome();
	resetInning();
	strikeBtnClick();
	ballBtnClick();
	foulBtnClick();
	outBtnClick();
	runBtnClick();
	baseBtnClick();
};
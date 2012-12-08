/*!
 * Urban Dead Plus v0.2.0
 * Copyright 2011, Calvin Davis
 */
// Clean up player info
var rawPlayerInfo = $('.cp .gt b');
var player = {};
player.name = rawPlayerInfo.slice(0, 1).text();
player.profile = $('.cp .gt a').slice(0, 1).attr('href');
player.dead = rawPlayerInfo.slice(1, 2).text() == 'dead';
player.infected = rawPlayerInfo.slice(1, 2).text() == 'infected';
player.hp = player.dead || player.infected ? rawPlayerInfo.slice(2, 3).text() : rawPlayerInfo.slice(1, 2).text();
player.hpPercent = Math.round(player.hp / 60 * 100);
player.hpStatus = player.hp > 25 ? 'good' : (player.hp > 5 ? 'ok' : 'bad');
if (player.dead) {
	player.status = player.hp > 0 ? 'Zombie' : 'Dead';
} else {
	player.status = 'Alive';
	if (player.infected) {
		player.status += ' (Infected)';
	}
}
player.xp = player.dead || player.infected ? rawPlayerInfo.slice(3, 4).text() : rawPlayerInfo.slice(2, 3).text();
player.ap = player.dead || player.infected ? rawPlayerInfo.slice(4, 5).text() : rawPlayerInfo.slice(3, 4).text();
player.apPercent = Math.round(player.ap / 50 * 100);
player.apStatus = player.ap > 25 ? 'good' : (player.ap > 5 ? 'ok' : 'bad');
var playerInfo = '<div id="player-info">' +
	'<ul>' +
		'<li><strong>Name:</strong> ' + player.name + ' <small>(<a href="' + player.profile + '">View profile</a>)</small></li>' +
		'<li><strong>Status:</strong> ' + player.status + '</li>' +
		'<li><strong><abbr title="Health Points">HP</abbr>:</strong> ' + 
		'<div id="hp-bar-outer" class="bar-outer" title="' + player.hp + ' / 60">' +
		'<div id="hp-bar" class="bar ' + player.hpStatus + '" style="width:' + player.hpPercent + '%;"></div>' +
		'</div>' +
		'<b>' + player.hp + '</b>' +
		'</li>' +	
		'<li><strong><abbr title="Action Points">AP</abbr>:</strong> ' + 
		'<div id="ap-bar-outer" class="bar-outer" title="' + player.ap + ' / 50">' +
		'<div id="ap-bar" class="bar ' + player.apStatus + '" style="width:' + player.apPercent + '%;"></div>' +
		'</div>' +
		(player.ap < 10 ? '<span class="apw">' : '') +
		'<b>' + player.ap + '</b>' +
		(player.ap < 10 ? '</span>' : '') +
		'</li>' +
		'<li><strong><abbr title="EXperience Points">XP</abbr>:</strong> ' + player.xp + '</li>' +	
		'</div>' +
		'</li>' +
	'</ul>' +
'</div><!-- #player-info -->';
$('.cp .gt').empty().html(playerInfo);

// Clean up inventory duplicates
var inventory = {};
$('[action*="map.cgi?use"]').each(function() {
	var name = $(this).find('.m').attr('value') + ' ' + $(this).text();
	if (inventory[name] == undefined) {
		var item = {};
		item.name = name;
		item.count = 1;
		item.countSpan = $('<span class="item-count"></span>');
		$(this).prepend(item.countSpan);
		inventory[name] = item;
	} else {
		inventory[name].count++;
		$(this).remove();
	}
	inventory[name].countSpan.text(inventory[name].count > 1 ? inventory[name].count + ' x ' : '');
});

// Add link to DSS Map
player.x = $('input[name="homex"]').attr("value");
player.y = $('input[name="homey"]').attr("value");

var rawLocation = $('.gp .gt b');
var locationName = rawLocation.slice(0, 1).text();
var locationInfo = '<a href="http://map.dssrzs.org/location/' + player.x + '-' + player.y + '" target="_blank">' +
	locationName + ' (' + player.x + ', ' + player.y + ')' + '</a>';
rawLocation.empty().html(locationInfo);

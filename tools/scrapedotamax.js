'use strict';

const EventEmitter = require('events');
var fs = require('fs');
var Xray = require('x-ray');
var _ = require('lodash');
var async = require('async');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
var x = Xray();

var outputfile = 'app/json/dotamaxdata.json';

var dotamaxurl = {
	gpm: 'http://dotamax.com/hero/gpm/',
	items: 'http://dotamax.com/hero/detail/hero_items/'
};
var skills = [
	{
		name: 'all',
		urlParams: '?ladder=y'
	},
	{
		name: 'high',
		urlParams: '?skill=vh&ladder=y'
	},
	{
		name: 'pro',
		urlParams: '?skill=pro&time=v686'
	}
];
var heroes = [];
var taskCount = 0;

// get hero gpm all
var url = dotamaxurl.gpm + skills[0].urlParams;
console.log('Collecting hero gpm for all skills...');
x(url, 'tbody tr', [{
	name: '@onclick',
	zh: 'td:nth-child(1) .hero-name-list',
	gpm_all: 'td:nth-child(2) div:nth-child(1)',
	xpm_all: 'td:nth-child(3) div:nth-child(1)'
}])(function(err, obj) {
	for (var i = 0; i < obj.length; i++) {
		obj[i].name = obj[i].name.substring(20, obj[i].name.length - 2);
		obj[i].gpm_all = parseFloat(obj[i].gpm_all);
		obj[i].xpm_all = parseFloat(obj[i].xpm_all);
		heroes.push(obj[i]);
	}
	heroes.sort(function(a, b) {
		if (a.name < b.name) {
			return -1;
		}
		else if (a.name > b.name) {
			return 1;
		}
	});
	getHeroGpmHigh();
	getHeroGpmPro();
	for (var i = 0; i < heroes.length; i++) {
		getHeroItemsAll(heroes[i].name);
		getHeroItemsHigh(heroes[i].name);
		getHeroItemsPro(heroes[i].name);
	}	
});
var getHeroGpmHigh = function() {
	var url = dotamaxurl.gpm + skills[1].urlParams;
	console.log('Collecting hero gpm for high skills...');
	x(url, 'tbody tr', [{
		zh: 'td:nth-child(1) .hero-name-list',
		gpm: 'td:nth-child(2) div:nth-child(1)',
		xpm: 'td:nth-child(3) div:nth-child(1)'
	}])(function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			var hero = _.find(heroes, {'zh': obj[i].zh});
			hero.gpm_high = parseFloat(obj[i].gpm);
			hero.xpm_high = parseFloat(obj[i].xpm);
		}
		myEmitter.emit('done');
	});
};
var getHeroGpmPro = function() {
	var url = dotamaxurl.gpm + skills[2].urlParams;
	console.log('Collecting hero gpm for pro skills...');
	x(url, 'tbody tr', [{
		zh: 'td:nth-child(1) .hero-name-list',
		gpm: 'td:nth-child(2) div:nth-child(1)',
		xpm: 'td:nth-child(3) div:nth-child(1)'
	}])(function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			var hero = _.find(heroes, {'zh': obj[i].zh});
			hero.gpm_pro = parseFloat(obj[i].gpm);
			hero.xpm_pro = parseFloat(obj[i].xpm);
		}
		myEmitter.emit('done');
	});
};
var getHeroItemsAll = function(heroname) {
	var url = dotamaxurl.items + heroname + '/' + skills[0].urlParams;
	console.log('Collecting ' + heroname + ' items for all skills...');
	x(url, {
		zh: '.maxtopmainbar div:nth-child(2) td .hero-title',
		matches: '.maxtopmainbar div:nth-child(2) td span:nth-child(5)',
		winrate: '.maxtopmainbar div:nth-child(2) td span:nth-child(6)',
		items: x('table.sortable tbody tr', [{
			name: 'td a img@src',
			zh: 'td a',
			matches: 'td:nth-child(2) div:nth-child(1)',
			winrate: 'td:nth-child(3) div:nth-child(1)'
		}])
	})(function(err, obj) {
		obj.zh = obj.zh.substring(17, obj.zh.length - 1);
		obj.matches = parseInt(obj.matches.substring(7, obj.matches.length - 2));
		obj.winrate = parseFloat(obj.winrate.substring(4));
		for (var i = 0; i < obj.items.length; i++) {
			obj.items[i].name = obj.items[i].name.substring(48, obj.items[i].name.length - 7);
			obj.items[i].zh = obj.items[i].zh.substring(26, obj.items[i].zh.length - 1);
			obj.items[i].matches = parseInt(obj.items[i].matches.replace(/,/g, ''));
			obj.items[i].winrate = parseFloat(obj.items[i].winrate);
		}
		var hero = _.find(heroes, {'zh': obj.zh});
		hero.matches_all = obj.matches;
		hero.winrate_all = obj.winrate;
		hero.items_all = obj.items;
		myEmitter.emit('done');
	});
};
var getHeroItemsHigh = function(heroname) {
	var url = dotamaxurl.items + heroname + '/' + skills[1].urlParams;
	console.log('Collecting ' + heroname + ' items for high skills...');
	x(url, {
		zh: '.maxtopmainbar div:nth-child(2) td .hero-title',
		matches: '.maxtopmainbar div:nth-child(2) td span:nth-child(5)',
		winrate: '.maxtopmainbar div:nth-child(2) td span:nth-child(6)',
		items: x('table.sortable tbody tr', [{
			name: 'td a img@src',
			zh: 'td a',
			matches: 'td:nth-child(2) div:nth-child(1)',
			winrate: 'td:nth-child(3) div:nth-child(1)'
		}])
	})(function(err, obj) {
		obj.zh = obj.zh.substring(17, obj.zh.length - 1);
		obj.matches = parseInt(obj.matches.substring(7, obj.matches.length - 2));
		obj.winrate = parseFloat(obj.winrate.substring(4));
		for (var i = 0; i < obj.items.length; i++) {
			obj.items[i].name = obj.items[i].name.substring(48, obj.items[i].name.length - 7);
			obj.items[i].zh = obj.items[i].zh.substring(26, obj.items[i].zh.length - 1);
			obj.items[i].matches = parseInt(obj.items[i].matches.replace(/,/g, ''));
			obj.items[i].winrate = parseFloat(obj.items[i].winrate);
		}
		var hero = _.find(heroes, {'zh': obj.zh});
		hero.matches_high = obj.matches;
		hero.winrate_high = obj.winrate;
		hero.items_high = obj.items;
		myEmitter.emit('done');
	});
};
var getHeroItemsPro = function(heroname) {
	var url = dotamaxurl.items + heroname + '/' + skills[2].urlParams;
	console.log('Collecting ' + heroname + ' items for pro skills...');
	x(url, {
		zh: '.maxtopmainbar div:nth-child(2) td .hero-title',
		matches: '.maxtopmainbar div:nth-child(2) td span:nth-child(5)',
		winrate: '.maxtopmainbar div:nth-child(2) td span:nth-child(6)',
		items: x('table.sortable tbody tr', [{
			name: 'td a img@src',
			zh: 'td a',
			matches: 'td:nth-child(2) div:nth-child(1)',
			winrate: 'td:nth-child(3) div:nth-child(1)'
		}])
	})(function(err, obj) {
		obj.zh = obj.zh.substring(17, obj.zh.length - 1);
		obj.matches = parseInt(obj.matches.substring(7, obj.matches.length - 2));
		obj.winrate = parseFloat(obj.winrate.substring(4));
		for (var i = 0; i < obj.items.length; i++) {
			obj.items[i].name = obj.items[i].name.substring(48, obj.items[i].name.length - 7);
			obj.items[i].zh = obj.items[i].zh.substring(26, obj.items[i].zh.length - 1);
			obj.items[i].matches = parseInt(obj.items[i].matches.replace(/,/g, ''));
			obj.items[i].winrate = parseFloat(obj.items[i].winrate);
		}
		var hero = _.find(heroes, {'zh': obj.zh});
		hero.matches_pro = obj.matches;
		hero.winrate_pro = obj.winrate;
		hero.items_pro = obj.items;
		myEmitter.emit('done');
	})
};

myEmitter.on('done', () => {
	taskCount++;
	if (taskCount === 335) { // 111 * 3 + 2
		fs.writeFile(outputfile, JSON.stringify(heroes), function(err) {
			if (err) {
				return console.log(err);
			} else {
				console.log('Data exported to ' + outputfile);
			}
		});
	}
});

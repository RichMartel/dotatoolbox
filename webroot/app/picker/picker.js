(function(app) {

	app.FilterPipe = ng.core.Pipe({
		name: 'filterHeroes'
	})
	.Class({
		constructor: [function () {
		}],
		transform: function (array, filterString) {
			var substring = filterString.toString().toLowerCase();
			return array.filter(function (hero) {
				var found = (hero.name.toLowerCase().startsWith(substring));
				if (found === true) {
					return found;
				}
				var found = (hero.localized_name.toLowerCase().startsWith(substring));
				if (found === true) {
					return found;
				}
				for (var i = 0; i < hero.alt_names.length; i++) {
					if (hero.alt_names[i].toLowerCase().startsWith(substring)) {
						found = true;
						break;
					}
				}
				return found;
			})
		}
	});

	app.PickerComponent = ng.core.Component({
		pipes: [app.FilterPipe],
		directives: [app.MatchupComponent],
		templateUrl: 'app/picker/picker.html'
	})
	.Class({
		constructor: [app.HeroService, function(heroService) {
			ga('set', 'page', '/picker');
			ga('send', 'pageview');
			this.heroes = heroService.heroes;
			heroService.heroes$.subscribe(d => {
				this.heroes = heroService.heroes;
			});
			this.filterString = '';
			this.enemiesSelected = [];
			this.friendsSelected = [];
			this.matchups = [];
			this.coreMatchups = [];
			this.supportMatchups = [];
			this.midMatchups = [];
			this.imageWidth = (window.innerWidth/18 < 100) ? window.innerWidth/18 : 100;
			if (window.innerWidth < 544) {
				this.imageWidth = 40
			}
			this.imageHeight = this.imageWidth * .56
			this.touchBrowser = false;
			if ('ontouchstart' in document.documentElement) {
				this.touchBrowser = true;
			}
		}],
		addEnemiesSelected: function(hero) {
			if (this.enemiesSelected.length < 5) {
				var found = false;
				for (i = 0; i < this.enemiesSelected.length; i++) {
					if (hero === this.enemiesSelected[i]) {
						found = true;
					}
				}
				for (i = 0; i < this.friendsSelected.length; i++) {
					if (hero === this.friendsSelected[i]) {
						found = true;
					}
				}
				if (!found) {
					this.enemiesSelected.push(hero);
					this.calcMatchups();
				}
				window.scrollTo(0, 0);
				if (!this.touchBrowser) {
					this.filterString = '';
					document.getElementById("filterInput").focus();
				}
			}
		},
		addFriendsSelected: function(hero) {
			if (this.friendsSelected.length < 4) {
				var found = false;
				for (i = 0; i < this.enemiesSelected.length; i++) {
					if (hero === this.enemiesSelected[i]) {
						found = true;
					}
				}
				for (i = 0; i < this.friendsSelected.length; i++) {
					if (hero === this.friendsSelected[i]) {
						found = true;
					}
				}
				if (!found) {
					this.friendsSelected.push(hero);
					this.calcMatchups();
				}
				window.scrollTo(0, 0);
				if (!this.touchBrowser) {
					this.filterString = '';
					document.getElementById("filterInput").focus();
				}
			}
		},
		removeEnemiesSelected: function(hero) {
			for (var i = 0; i < this.enemiesSelected.length; i++) {
				if (hero === this.enemiesSelected[i]) {
					this.enemiesSelected.splice(i, 1);
					this.calcMatchups();
				}
			}
		},
		removeFriendsSelected: function(hero) {
			for (var i = 0; i < this.friendsSelected.length; i++) {
				if (hero === this.friendsSelected[i]) {
					this.friendsSelected.splice(i, 1);
					this.calcMatchups();
				}
			}
		},
		removeAllSelected: function() {
			this.enemiesSelected.splice(0, this.enemiesSelected.length);
			this.friendsSelected.splice(0, this.friendsSelected.length);
		},
		calcMatchups: function() {
			this.matchups = [];
			this.coreMatchups = [];
			this.supportMatchups = [];
			this.midMatchups = [];
			for (var i = 0; i < this.heroes.length; i++) {
				this.matchups[i] = {heroIndex: i, name: this.heroes[i].name, advantage: 0, winrate: 0, class: '', heroType: ''};
			}
			// Add advantages and winrates
			for (var i = 0; i < this.enemiesSelected.length; i++) {
				var multiplier = 1;
				if (this.enemiesSelected[i].carry) {
					multiplier = 1.5;
				}
				for (var j = 0; j < this.enemiesSelected[i].enemies_all.length; j++) {
					if (this.enemiesSelected[i].enemies_all[j]) {
						var matchup = _.find(this.matchups, {name: this.enemiesSelected[i].enemies_all[j].name})
						matchup.advantage += -(parseFloat(this.enemiesSelected[i].enemies_all[j].advantage)) * multiplier;
						matchup.winrate += 100 - (((parseFloat(this.enemiesSelected[i].enemies_all[j].winrate) - 50) * multiplier) + 50);
					}
				}
				for (var j = 0; j < this.enemiesSelected[i].enemies_high.length; j++) {
					if (this.enemiesSelected[i].enemies_high[j]) {
						var matchup = _.find(this.matchups, {name: this.enemiesSelected[i].enemies_high[j].name})
						matchup.advantage += -(parseFloat(this.enemiesSelected[i].enemies_high[j].advantage)) * multiplier;
						matchup.winrate += 100 - (((parseFloat(this.enemiesSelected[i].enemies_high[j].winrate) - 50) * multiplier) + 50);
					}
				}
				// for (var j = 0; j < this.enemiesSelected[i].enemies_pro.length; j++) {
				// 	if (this.enemiesSelected[i].enemies_pro[j]) {
				// 		var matchup = _.find(this.matchups, {name: this.enemiesSelected[i].enemies_pro[j].name})
				// 		matchup.advantage += -(parseFloat(this.enemiesSelected[i].enemies_pro[j].advantage)) * multiplier;
				// 		matchup.winrate += 100 - (((parseFloat(this.enemiesSelected[i].enemies_pro[j].winrate) - 50) * multiplier) + 50);
				// 	}
				// }
			}
			for (var i = 0; i < this.friendsSelected.length; i++) {
				for (var j = 0; j < this.friendsSelected[i].teammates_all.length; j++) {
					if (this.friendsSelected[i].teammates_all[j]) {
						var matchup = _.find(this.matchups, {name: this.friendsSelected[i].teammates_all[j].name})
						matchup.advantage += (parseFloat(this.friendsSelected[i].teammates_all[j].advantage)) / 2;
						matchup.winrate += ((parseFloat(this.friendsSelected[i].teammates_all[j].winrate) - 50) / 2) + 50;
					}
				}
				for (var j = 0; j < this.friendsSelected[i].teammates_high.length; j++) {
					if (this.friendsSelected[i].teammates_high[j]) {
						var matchup = _.find(this.matchups, {name: this.friendsSelected[i].teammates_high[j].name})
						matchup.advantage += (parseFloat(this.friendsSelected[i].teammates_high[j].advantage)) / 2;
						matchup.winrate += ((parseFloat(this.friendsSelected[i].teammates_high[j].winrate) - 50) / 2) + 50;
					}
				}
				// for (var j = 0; j < this.friendsSelected[i].teammates_pro.length; j++) {
				// 	if (this.friendsSelected[i].teammates_pro[j]) {
				// 		var matchup = _.find(this.matchups, {name: this.friendsSelected[i].teammates_pro[j].name})
				// 		matchup.advantage += (parseFloat(this.friendsSelected[i].teammates_pro[j].advantage)) / 2;
				// 		matchup.winrate += ((parseFloat(this.friendsSelected[i].teammates_pro[j].winrate) - 50) / 2) + 50;
				// 	}
				// }
			}
			// Remove hero matchups that are in my team or enemy team
			for (var i = 0; i < this.matchups.length; i++) {
				for (var j = 0; j < this.enemiesSelected.length; j++) {
					if (this.matchups[i].name === this.enemiesSelected[j].name) {
						this.matchups.splice(i, 1);
						if (i > 0) {
							i--;
						}
					}
				}
				for (var j = 0; j < this.friendsSelected.length; j++) {
					if (this.matchups[i].name === this.friendsSelected[j].name) {
						this.matchups.splice(i, 1);
						if (i > 0) {
							i--;
						}
					}
				}
			}
			// Average advantages and winrates
			for (var i = 0; i < this.matchups.length; i++) {
				this.matchups[i].advantage = (this.matchups[i].advantage + (this.matchups[i].advantage / (this.enemiesSelected.length * 2 + (this.friendsSelected.length * 2 * .85)))) / 2;
				this.matchups[i].winrate = this.matchups[i].winrate / (this.enemiesSelected.length * 2 + (this.friendsSelected.length * 2 * .85));
				// Add bootstrap list-item styling (blue = great, green = good, yellow = possible bad, red = bad)
				if (this.matchups[i].winrate > 55) {
					this.matchups[i].class = 'list-group-item-success';
				}
				if ((this.matchups[i].advantage > 2 && this.matchups[i].winrate > 55) ||
					(this.matchups[i].advantage > 1 && this.matchups[i].winrate > 60) ||
					(this.matchups[i].advantage > 0 && this.matchups[i].winrate > 65)) {
					this.matchups[i].class = 'list-group-item-info';
				}
				if (this.matchups[i].advantage < 0 || this.matchups[i].winrate < 50) {
					this.matchups[i].class = 'list-group-item-warning';
				}
				if (this.matchups[i].advantage < 0 && this.matchups[i].winrate < 50) {
					this.matchups[i].class = 'list-group-item-danger';
				}
				var heroData = this.heroes[this.matchups[i].heroIndex];
				if (heroData.carry) {
					this.matchups[i].heroType += 'C';
				}
				if (heroData.jungle) {
					this.matchups[i].heroType += 'J';
				}
				if (heroData.tank) {
					this.matchups[i].heroType += 'T';
				}
			}
			// Sort using both advantage and winrate
			this.matchups.sort(function(a, b) {
				if (b.winrate > 50 && a.winrate < 50) {
					return 1;
				}
				else if (b.winrate < 50 && a.winrate > 50) {
					return -1;
				}
				else {
					return (b.advantage + (b.winrate - 50)) - (a.advantage + (a.winrate - 50));
				}
			});
			// Create core, mid, & support matchup lists
			for (var i = 0; i < this.matchups.length; i++) {
				if (this.heroes[this.matchups[i].heroIndex].mid) {
					this.midMatchups.push(this.matchups[i]);
				} else if (this.heroes[this.matchups[i].heroIndex].support) {
					this.supportMatchups.push(this.matchups[i]);
				} else {
					this.coreMatchups.push(this.matchups[i]);
				}
			}
		}
	})

})(window.app || (window.app = {}));

(function(app) {

	app.BuildComponent = ng.core.Component({
		templateUrl: 'app/build/build.html'
	})
	.Class({
		constructor: [app.HeroService, function(heroService) {
			ga('set', 'page', '/build');
			ga('send', 'pageview');
			this.heroes = heroService.heroes;
			this.heroes_str = [];
			this.heroes_agi = [];
			this.heroes_int = [];
			this.expLevels = [0, 200, 500, 900, 1400, 2000, 2600, 3200, 4400, 5400, 6000, 8200, 9000, 10400, 11900, 13500, 15200, 17000, 18900, 20900, 23000, 25200, 27500, 29900, 32400];
			this.selectedHero = null;
			this.selectedImage = null;
			this.endGame = 35; //minutes
			this.imageWidth = (window.innerWidth/20 < 59) ? window.innerWidth/20 : 59;
			if (this.innerWidth < 40) {
				this.imageWidth = 40;
			}
			this.items_all = [];
			this.items_all_early = [];
			this.items_all_late = [];
			this.items_high = [];
			this.items_high_early = [];
			this.items_high_late = [];
			this.items_pro = [];
			this.items_pro_early = [];
			this.items_pro_late = [];
			this.wardsCost = 0;
			heroService.heroes$.subscribe(d => {
				this.heroes = heroService.heroes;
				for (var i = 0; i < this.heroes.length; i++) {
					switch (this.heroes[i].primary_attr) {
						case 1:
							this.heroes_str.push(this.heroes[i]);
							break;
						case 2:
							this.heroes_agi.push(this.heroes[i]);
							break;
						case 3:
							this.heroes_int.push(this.heroes[i]);
							break;
						default:
							console.log(this.heroes[i].localized_name);
					}
				}
			});
		}],
		tooltip: function(item) {
			var tooltip = '';
			if (item.side_shop === 1 && item.secret_shop === 1) {
				tooltip += 'Secret shop item also available at side shop';
			}
			else if (item.side_shop === 1) {
				tooltip += 'Available at side shop';
			}
			else if (item.secret_shop === 1) {
				tooltip += 'Secret shop item';
			}
			return tooltip;
		},
		select: function(hero) {
			this.selectedHero = hero;
			this.selectedImage = this.selectedHero.image.replace(/_sb/, '_lg');
			this.items_all = [];
			this.items_all_early = [];
			this.items_all_late = [];
			this.items_high = [];
			this.items_high_early = [];
			this.items_high_late = [];
			this.items_pro = [];
			this.items_pro_early = [];
			this.items_pro_late = [];
			this.wardsCost = 0;
			if (this.selectedHero.support) {
				this.wardsCost = 1000;
			}
			var budget = this.selectedHero.gpm_all * this.endGame - this.wardsCost;
			var numberSlots = 6;
			for (var i = 0; i < this.selectedHero.items_all.length; i++) {
				var item = this.selectedHero.items_all[i];
				if (budget < item.cost && item.cost > 2000) {
					if (this.items_all_late.length < 12) {
						this.items_all_late.push(item);
					}
					continue;
				}
				if (item.winrate < this.selectedHero.winrate_all && item.cost < 2000) {
					if (this.items_all_early.length < 12) {
						this.items_all_early.push(item);
					}
					continue;
				}
				if (item.winrate > this.selectedHero.winrate_all) {
					var found = false;
					for (var j = 0; j < this.items_all.length; j++) {
						if (this.items_all[j].upgrades_to.indexOf(item.id) > -1 || item.upgrades_to.indexOf(this.items_all[j].id) > -1) {
							if (this.items_all[j].cost > item.cost) {
								this.items_all_early.push(item);
							}
							else if (budget + this.items_all[j].cost > item.cost) {
								budget += this.items_all[j].cost;
								budget -= item.cost;
								this.items_all_early.push(this.items_all[j]);
								this.items_all[j] = item;
							}
							else {
								this.items_all_late.push(item);
							}
							found = true;
						}
						else if (this.items_all[j].no_stack.indexOf(item.id) > -1 || item.no_stack.indexOf(this.items_all[j].id) > -1) {
							if (item.cost < 2000) {
								this.items_all_early.push(item);
							}
							else {
								this.items_all_late.push(item);
							}
							found = true;
						}
					}
					if (budget > item.cost && numberSlots && !found) {
						this.items_all.push(item);
						budget -= item.cost;
						numberSlots--;
					}
				}
			}
			var budget = this.selectedHero.gpm_high * this.endGame - this.wardsCost;
			var numberSlots = 6;
			for (var i = 0; i < this.selectedHero.items_high.length; i++) {
				var item = this.selectedHero.items_high[i];
				if (budget < item.cost && item.cost > 2000) {
					if (this.items_high_late.length < 12) {
						this.items_high_late.push(item);
					}
					continue;
				}
				if (item.winrate < this.selectedHero.winrate_high && item.cost < 2000) {
					if (this.items_high_early.length < 12) {
						this.items_high_early.push(item);
					}
					continue;
				}
				if (item.winrate > this.selectedHero.winrate_high) {
					var found = false;
					for (var j = 0; j < this.items_high.length; j++) {
						if (this.items_high[j].upgrades_to.indexOf(item.id) > -1 || item.upgrades_to.indexOf(this.items_high[j].id) > -1) {
							if (this.items_high[j].cost > item.cost) {
								this.items_high_early.push(item);
							}
							else if (budget + this.items_high[j].cost > item.cost) {
								budget += this.items_high[j].cost;
								budget -= item.cost;
								this.items_high_early.push(this.items_high[j]);
								this.items_high[j] = item;
							}
							else {
								this.items_high_late.push(item);
							}
							found = true;
						}
						else if (this.items_high[j].no_stack.indexOf(item.id) > -1 || item.no_stack.indexOf(this.items_high[j].id) > -1) {
							if (item.cost < 2000) {
								this.items_high_early.push(item);
							}
							else {
								this.items_high_late.push(item);
							}
							found = true;
						}
					}
					if (budget > item.cost && numberSlots && !found) {
						this.items_high.push(item);
						budget -= item.cost;
						numberSlots--;
					}
				}
			}
			var budget = this.selectedHero.gpm_pro * this.endGame - this.wardsCost;
			var numberSlots = 6;
			for (var i = 0; i < this.selectedHero.items_pro.length; i++) {
				var item = this.selectedHero.items_pro[i];
				if (budget < item.cost && item.cost > 2000) {
					if (this.items_pro_late.length < 12) {
						this.items_pro_late.push(item);
					}
					continue;
				}
				if (item.winrate < this.selectedHero.winrate_pro && item.cost < 2000) {
					if (this.items_pro_early.length < 12) {
						this.items_pro_early.push(item);
					}
					continue;
				}
				if (item.winrate > this.selectedHero.winrate_pro) {
					var found = false;
					for (var j = 0; j < this.items_pro.length; j++) {
						if (this.items_pro[j].upgrades_to.indexOf(item.id) > -1 || item.upgrades_to.indexOf(this.items_pro[j].id) > -1) {
							if (this.items_pro[j].cost > item.cost) {
								this.items_pro_early.push(item);
							}
							else if (budget + this.items_pro[j].cost > item.cost) {
								budget += this.items_pro[j].cost;
								budget -= item.cost;
								this.items_pro_early.push(this.items_pro[j]);
								this.items_pro[j] = item;
							}
							else {
								this.items_pro_late.push(item);
							}
							found = true;
						}
						else if (this.items_pro[j].no_stack.indexOf(item.id) > -1 || item.no_stack.indexOf(this.items_pro[j].id) > -1) {
							if (item.cost < 2000) {
								this.items_pro_early.push(item);
							}
							else {
								this.items_pro_late.push(item);
							}
							found = true;
						}
					}
					if (budget > item.cost && numberSlots && !found) {
						this.items_pro.push(item);
						budget -= item.cost;
						numberSlots--;
					}
				}
			}
		},
		getLevel_all: function() {
			var exp = this.selectedHero.xpm_all * this.endGame;
			var level = 0;
			for (var i = 0; i < this.expLevels.length; i++) {
				if (this.expLevels[i] > exp) {
					level = i;
					break;
				}
			}
			return level;
		},
		getLevel_high: function() {
			var exp = this.selectedHero.xpm_high * this.endGame;
			var level = 0;
			for (var i = 0; i < this.expLevels.length; i++) {
				if (this.expLevels[i] > exp) {
					level = i;
					break;
				}
			}
			return level;
		},
		getLevel_pro: function() {
			var exp = this.selectedHero.xpm_pro * this.endGame;
			var level = 0;
			for (var i = 0; i < this.expLevels.length; i++) {
				if (this.expLevels[i] > exp) {
					level = i;
					break;
				}
			}
			return level;
		}

	});

})(window.app || (window.app = {}));

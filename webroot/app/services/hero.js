(function(app) {

	app.HeroService = ng.core.Class({
		constructor: [ng.http.Http, app.ItemService, function(http, itemService) {
			this.heroes = [];
			this.heroes$ = Rx.Observable.forkJoin(
				http.get('app/json/heroes.json').map(res => res.json()),
				http.get('app/json/heroes_add.json').map(res => res.json()),
				http.get('app/json/heroes_dotamax.json').map(res => res.json())
			).map(data => {
				this.heroes = data[0];
				var heroesAdd = data[1];
				var heroesDotamax = data[2];
				this.heroes.sort(function(a, b) {
					if (a.localized_name < b.localized_name) {
						return -1;
					}
					else if (a.localized_name > b.localized_name) {
						return 1;
					}
				});
				for (var i = 0; i < heroesAdd.length; i++) {
					var lookupName = 'npc_dota_hero_' + heroesAdd[i].name;
					var heroToModify = _.find(this.heroes, {name: lookupName});
					heroToModify.name = heroesAdd[i].name;
					heroToModify.alt_names = heroesAdd[i].alt_names;
					heroToModify.primary_attr = heroesAdd[i].primary_attr;
					if (heroesAdd[i].support) {
						heroToModify.support = heroesAdd[i].support;
					} else {
						heroToModify.support = false;
					}
					if (heroesAdd[i].mid) {
						heroToModify.mid = heroesAdd[i].mid;
					} else {
						heroToModify.mid = false;
					}
					if (heroesAdd[i].carry) {
						heroToModify.carry = heroesAdd[i].carry;
					} else {
						heroToModify.carry = false;
					}
					if (heroesAdd[i].jungle) {
						heroToModify.jungle = heroesAdd[i].jungle;
					} else {
						heroToModify.jungle = false;
					}
					if (heroesAdd[i].tank) {
						heroToModify.tank = heroesAdd[i].tank;
					} else {
						heroToModify.tank = false;
					}
				}
				for (var i = 0; i < this.heroes.length; i++) {
					this.heroes[i].image = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + this.heroes[i].name + '_sb.png';
					this.heroes[i].imageLarge = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + this.heroes[i].name + '_lg.png';
					this.heroes[i].imageVert = 'http://cdn.dota2.com/apps/dota2/images/heroes/' + this.heroes[i].name + '_vert.jpg';
					this.heroes[i].link = 'http://dota2.gamepedia.com/' + this.heroes[i].localized_name;
					var heroDotamax = _.find(heroesDotamax, {'name': this.heroes[i].name});
					heroDotamax.items_all.sort(function(a, b) {
						return b.matches - a.matches;
					});
					heroDotamax.items_high.sort(function(a, b) {
						return b.matches - a.matches;
					});
					heroDotamax.items_pro.sort(function(a, b) {
						return b.matches - a.matches;
					});
					this.heroes[i].zh = heroDotamax.zh;
					this.heroes[i].winrate_all = heroDotamax.winrate_all;
					this.heroes[i].winrate_high = heroDotamax.winrate_high;
					this.heroes[i].winrate_pro = heroDotamax.winrate_pro;
					this.heroes[i].matches_all = heroDotamax.matches_all;
					this.heroes[i].matches_high = heroDotamax.matches_high;
					this.heroes[i].matches_pro = heroDotamax.matches_pro;
					this.heroes[i].gpm_all = heroDotamax.gpm_all;
					this.heroes[i].gpm_high = heroDotamax.gpm_high;
					this.heroes[i].gpm_pro = heroDotamax.gpm_pro;
					this.heroes[i].xpm_all = heroDotamax.xpm_all;
					this.heroes[i].xpm_high = heroDotamax.xpm_high;
					this.heroes[i].xpm_pro = heroDotamax.xpm_pro;
					this.heroes[i].enemies_all = heroDotamax.enemies_all;
					this.heroes[i].enemies_high = heroDotamax.enemies_high;
					this.heroes[i].enemies_pro = heroDotamax.enemies_pro;
					this.heroes[i].teammates_all = heroDotamax.teammates_all;
					this.heroes[i].teammates_high = heroDotamax.teammates_high;
					this.heroes[i].teammates_pro = heroDotamax.teammates_pro;
					this.heroes[i].items_all = heroDotamax.items_all;
					this.heroes[i].items_high = heroDotamax.items_high;
					this.heroes[i].items_pro = heroDotamax.items_pro;
				}
				var items = itemService.items;
				itemService.items$.subscribe(d => {
					items = itemService.items;
					for (var i = 0; i < this.heroes.length; i++) {
						for (var j = this.heroes[i].items_all.length; j--;) {
							var heroItem = this.heroes[i].items_all[j];
							var item = _.find(items, {'name': heroItem.name});
							if (item) {
								heroItem.id = item.id;
								heroItem.localized_name = item.localized_name;
								heroItem.image = item.image;
								heroItem.link = item.link;
								heroItem.cost = item.cost;
								heroItem.secret_shop = item.secret_shop;
								heroItem.side_shop = item.side_shop;
								heroItem.upgrade = item.upgrade;
								heroItem.component = item.component;
								heroItem.upgrades_to = item.upgrades_to;
								heroItem.no_stack = item.no_stack;
							}
							else {
								this.heroes[i].items_all.splice(j, 1);
								continue;
							}
							if (heroItem.matches / this.heroes[i].matches_all < .01) {
								this.heroes[i].items_all.splice(j, 1);
								continue;
							}
							if ((heroItem.winrate < this.heroes[i].winrate_all) && (heroItem.winrate < 50) && (heroItem.winrate < this.heroes[i].winrate_all - 5)) {
								this.heroes[i].items_all.splice(j, 1);
								continue;
							}
						}
						for (var j = this.heroes[i].items_high.length; j-- ;) {
							var heroItem = this.heroes[i].items_high[j];
							var item = _.find(items, {'name': heroItem.name});
							if (item) {
								heroItem.id = item.id;
								heroItem.localized_name = item.localized_name;
								heroItem.image = item.image;
								heroItem.link = item.link;
								heroItem.cost = item.cost;
								heroItem.secret_shop = item.secret_shop;
								heroItem.side_shop = item.side_shop;
								heroItem.upgrade = item.upgrade;
								heroItem.component = item.component;
								heroItem.upgrades_to = item.upgrades_to;
								heroItem.no_stack = item.no_stack;
							}
							else {
								this.heroes[i].items_high.splice(j, 1);
								continue;
							}
							if (heroItem.matches / this.heroes[i].matches_high < .01) {
								this.heroes[i].items_high.splice(j, 1);
								continue;
							}
							if ((heroItem.winrate < this.heroes[i].winrate_high) && (heroItem.winrate < 50) && (heroItem.winrate < this.heroes[i].winrate_high - 5)) {
								this.heroes[i].items_high.splice(j, 1);
								continue;
							}
						}
						for (var j = this.heroes[i].items_pro.length; j--;) {
							var heroItem = this.heroes[i].items_pro[j];
							var item = _.find(items, {'name': heroItem.name});
							if (item) {
								heroItem.id = item.id;
								heroItem.localized_name = item.localized_name;
								heroItem.image = item.image;
								heroItem.link = item.link;
								heroItem.cost = item.cost;
								heroItem.secret_shop = item.secret_shop;
								heroItem.side_shop = item.side_shop;
								heroItem.upgrade = item.upgrade;
								heroItem.component = item.component;
								heroItem.upgrades_to = item.upgrades_to;
								heroItem.no_stack = item.no_stack;
							}
							else {
								this.heroes[i].items_pro.splice(j, 1);
								continue;
							}
							if (heroItem.matches / this.heroes[i].matches_pro < .01) {
								this.heroes[i].items_pro.splice(j, 1);
								continue;
							}
							if ((heroItem.winrate < this.heroes[i].winrate_pro) && (heroItem.winrate < 50) && (heroItem.winrate < this.heroes[i].winrate_pro - 5)) {
								this.heroes[i].items_pro.splice(j, 1);
								continue;
							}
						}
					}
				});
			});
		}],
	});

})(window.app || (window.app = {}));

// http://cors.io/?u=http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=6A2645535F4019083D3EB51D0002B7A3&language=en-US
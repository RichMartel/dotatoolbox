(function(app) {

	app.ItemService = ng.core.Class({
		constructor: [ng.http.Http, function(http) {
			this.http = http;
			this.items = [];
			this.items$ = Rx.Observable.forkJoin(
				this.http.get('app/json/items.json').map(res => res.json()),
				this.http.get('app/json/items_add.json').map(res => res.json())
			).map(data => {
				this.items = data[0];
				var itemsAdd = data[1];
				for (var i = 0; i < itemsAdd.length; i++) {
					var lookupName = 'item_' + itemsAdd[i].name;
					var itemToModify = _.find(this.items, {name: lookupName});
					itemToModify.name = itemsAdd[i].name;
					if (itemsAdd[i].component === false) {
						itemToModify.component = itemsAdd[i].component;
					} else {
						itemToModify.component = true;
					}
					if (itemsAdd[i].upgrade === true) {
						itemToModify.upgrade = itemsAdd[i].upgrade;
					} else {
						itemToModify.upgrade = false;
					}
					if (itemsAdd[i].upgrades_to) {
						itemToModify.upgrades_to = itemsAdd[i].upgrades_to;
					} else {
						itemToModify.upgrades_to = [];
					}
					if (itemsAdd[i].no_stack) {
						itemToModify.no_stack = itemsAdd[i].no_stack;
					} else {
						itemToModify.no_stack = [];
					}
				}
				for (var i = 0; i < this.items.length; i++) {
					this.items[i].image = 'http://cdn.dota2.com/apps/dota2/images/items/' + this.items[i].name + '_lg.png';
					this.items[i].link = 'http://www.dotabuff.com/items/' + this.items[i].localized_name.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
				}
			});
		}],
	});

})(window.app || (window.app = {}));

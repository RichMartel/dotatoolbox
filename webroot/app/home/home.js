(function(app) {

	app.HomeComponent = ng.core.Component({
		directives: [ng.router.ROUTER_DIRECTIVES],
		templateUrl: 'app/home/home.html'
	})
	.Class({
		constructor: [ng.http.Http, function(http) {
			ga('set', 'page', '/');
			ga('send', 'pageview');
			this.newsitems = [];
			http.get('https://crossorigin.me/http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=570&format=json').map(res => res.json())
				.subscribe(data => {
					this.newsitems = data.appnews.newsitems;
					for (var i = 0; i < this.newsitems.length; i++) {
						// fix dates
						var d = new Date(0);
						d.setUTCSeconds(this.newsitems[i].date);
						this.newsitems[i].date = d;
						// fix BBCode
						if (this.newsitems[i].feedname === 'steam_community_announcements') {
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[b\]/g, '<b>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/b\]/g, '</b>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[i\]/g, '<i>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/i\]/g, '</i>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[u\]/g, '<u>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/u\]/g, '</u>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[s\]/g, '<s>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/s\]/g, '</s>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[img\](.*)\[\/img\]/g, '<img src="$1">');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[url=(.*)\](.*)\[\/url\]/g, '<a href="$1">$2</a>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[url\](.*)\[\/url\]/g, '<a href="$1">$1</a>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\*\](.*)\n/g, '<li>$1</li>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\*\]/g, '<li>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[list\]\n/g, '<ul>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[list\]/g, '<ul>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/list\]\n/g, '</ul>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\[\/list\]/g, '</ul>');
							this.newsitems[i].contents = this.newsitems[i].contents.replace(/\n/g, '<br>');
						}
					}
				});
		}]
	});

})(window.app || (window.app = {}));

(function(app) {

	app.FriendComponent = ng.core.Component({
		templateUrl: 'app/friend/friend.html'
	})
	.Class({
		constructor: [ng.http.Http, function(http) {
			ga('set', 'page', '/friend');
			ga('send', 'pageview');
			Sortable.init();
			this.player = {
				steamid: '76561198031077846'// rich: '76561197968069993'
			};
			this.friends = [];
			var corsproxies = [
				{
					home: 'http://cors.io',
					url: 'http://cors.io/?u='
				},
				{
					home: 'http://crossorigin.me',
					url: 'http://crossorigin.me/'
				},
				{
					home: 'http://www.whateverorigin.org',
					url: 'http://www.whateverorigin.org/get?url='
				},
				{
					home: 'http://anyorigin.com',
					url: 'http://anyorigin.com/get?url='
				},
				{
					home: 'http://cors-anywhere.herokuapp.com',
					url: 'http://cors-anywhere.herokuapp.com/'
				}
			];
			var corsproxy = corsproxies[4].url;
			// for (var i = 0; i < corsproxies.length; i++) {
			// 	http.get(corsproxies[i].home).map(res => {
			// 		if (res.ok) {
			// 			console.log('url:', res.url);
			// 			corsproxy = _.find(corsproxies, {home: res.url}).url;
			// 			return {
			// 				ok: res.ok,
			// 				corsproxy: corsproxy
			// 			}
			// 		}
			// 	})
			// 	.subscribe(data => {
			// 		console.log('data:', data);
			// 	});
			// }
			var apiurl = {
				friends: 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=6A2645535F4019083D3EB51D0002B7A3&steamid=',
				player: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=6A2645535F4019083D3EB51D0002B7A3&steamids=',
				dota2: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=6A2645535F4019083D3EB51D0002B7A3&include_appinfo=1&include_played_free_games=1&appids_filter[0]=570&steamid='
			};
			http.get(corsproxy + apiurl.friends + this.player.steamid).map(res => res.json())
				.subscribe(data => {
					this.friends = data.friendslist.friends;
					http.get(corsproxy + apiurl.player + this.player.steamid).map(res => res.json())
						.subscribe(data => {
							var player = data.response.players[0];
							this.player.avatar = player.avatar;
							this.player.avatarfull = player.avatarfull;
							this.player.personaname = player.personaname;
							this.player.profileurl = player.profileurl;
							var d = new Date(0);
							d.setUTCSeconds(player.lastlogoff);
							this.player.lastlogoff = d;
							this.player.realname = player.realname;
							var d = new Date(0);
							d.setUTCSeconds(player.timecreated);
							this.player.timecreated = d;
							this.player.loccountrycode = player.loccountrycode;
							this.player.locstatecode = player.locstatecode;
							this.player.loccityid = player.loccityid;
						});
					http.get(corsproxy + apiurl.dota2 + this.player.steamid).map(res => res.json())
						.subscribe(data => {
							this.player.playtime_forever = data.response.games[0].playtime_forever;
							this.player.playtime_2weeks = data.response.games[0].playtime_2weeks;
						});
					for (var i = 0; i < this.friends.length; i++) {
						var d = new Date(0);
						d.setUTCSeconds(this.friends[i].friend_since);
						this.friends[i].friend_since = d;
						http.get(corsproxy + apiurl.player + this.friends[i].steamid).map(res => res.json())
						.subscribe(data => {
							var player = data.response.players[0];
							var friend = _.find(this.friends, {steamid: player.steamid});
							friend.avatar = player.avatar;
							friend.avatarfull = player.avatarfull;
							friend.personaname = player.personaname;
							friend.profileurl = player.profileurl;
							var d = new Date(0);
							d.setUTCSeconds(player.lastlogoff);
							friend.lastlogoff = d;
							friend.realname = player.realname;
							var d = new Date(0);
							d.setUTCSeconds(player.timecreated);
							friend.timecreated = d;
							friend.loccountrycode = player.loccountrycode;
							friend.locstatecode = player.locstatecode;
							friend.loccityid = player.loccityid;
							Sortable.init();
						});
						http.get(corsproxy + apiurl.dota2 + this.friends[i].steamid).map(res => {
							var steamid = res.url.replace(/.*steamid=(.*)/, '$1');
							var res = res.json();
							res.steamid = steamid;
							return res;
						})
						.subscribe(data => {
							var friend = _.find(this.friends, {steamid: data.steamid});
							friend.playtime_forever = data.response.games[0].playtime_forever;
							friend.playtime_2weeks = data.response.games[0].playtime_2weeks;
						});
					}
				});
		}]
	});

})(window.app || (window.app = {}));

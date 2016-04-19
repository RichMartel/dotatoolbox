(function(app) {

	app.MatchupComponent = ng.core.Component({
		selector: 'dt-matchup',
		inputs: ['heroMatchup'],
		templateUrl: 'app/picker/matchup.html'
	})
	.Class({
		constructor: [app.HeroService, function(heroService) {
			this.heroes = heroService.heroes;
		}],
		formatAdvantage: function(advantage) {
			return (advantage > 0) ? '+' + advantage.toFixed(2) : advantage.toFixed(2)
		}
	});

})(window.app || (window.app = {}));

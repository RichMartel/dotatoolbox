(function(app) {

	app.HomeComponent = ng.core.Component({
		directives: [ng.router.ROUTER_DIRECTIVES],
		templateUrl: 'app/home/home.html'
	})
	.Class({
		constructor: [function() {
			ga('set', 'page', '/');
			ga('send', 'pageview');
		}]
	});

})(window.app || (window.app = {}));

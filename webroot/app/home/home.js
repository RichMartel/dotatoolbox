(function(app) {

	app.HomeComponent = ng.core.Component({
		directives: [ng.router.ROUTER_DIRECTIVES],
		templateUrl: 'app/home/home.html'
	})
	.Class({
		constructor: [function() {
		}]
	});

})(window.app || (window.app = {}));

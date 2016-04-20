(function(app) {

	app.AboutComponent = ng.core.Component({
		templateUrl: 'app/about/about.html'
	})
	.Class({
		constructor: [function() {
			ga('set', 'page', '/about');
			ga('send', 'pageview');
		}]
	});

})(window.app || (window.app = {}));

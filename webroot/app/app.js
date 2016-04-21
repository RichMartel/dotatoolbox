(function(app) {

	app.TestService = ng.core.Class({
		constructor: function() {
		}
	});

	app.AppComponent = ng.core.Component({
		selector: 'app',
		directives: [ng.router.ROUTER_DIRECTIVES],
		templateUrl: 'app/app.html'
	})
	.Class({
		constructor: [function() {
		}]
	});

	app.AppComponent = ng.router.RouteConfig([
		{
			path: '/',
			name: 'Home',
			component: app.HomeComponent,
			useAsDefault: true
		},
		{
			path: '/about',
			name: 'About',
			component: app.AboutComponent
		},
		{
			path: '/picker',
			name: 'Picker',
			component: app.PickerComponent
		},
		{
			path: '/build',
			name: 'Build',
			component: app.BuildComponent
		},
		{
			path: '/friend',
			name: 'Friend',
			component: app.FriendComponent
		}
	])(app.AppComponent);

	document.addEventListener('DOMContentLoaded', function() {
		ng.core.enableProdMode();
		ng.platform.browser.bootstrap(app.AppComponent, [ng.router.ROUTER_PROVIDERS, ng.http.HTTP_PROVIDERS, app.ItemService, app.HeroService]);
	});

})(window.app || (window.app = {}));

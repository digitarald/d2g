/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('director/build/director').Router;

var router = new Router();
var routes = {
	'/': {
		name: 'home',
		component: require('./components/home.jsx')
	},
	'/project': {
		name: 'project-new',
		component: require('./components/project-new.jsx')
	}
};

require('../css/styles.less');

var Nav = require('./components/nav.jsx');

var Main = React.createClass({
	getInitialState: function() {
		return {
			route: null
		};
	},

	componentWillMount: function() {
		var routes = this.props.routes;
		for (var route in routes) {
			var setter = this.setState.bind(this, {route: route});
			this.props.router.on(route, setter);
		}
		this.props.router.configure({
			notfound: function() {
				this.setHash('/');
			}
		}).init('/');
	},

	render: function() {
		var route = this.props.routes[this.state.route];
		if (!route) {
			route = {
				name: null,
				component: React.DOM.div
			};
		}
		var component = route.component;
		return (
			<div>
				<Nav />
				<div className='container'>
					<component />
				</div>
			</div>
		);
	}
});

document.addEventListener('DOMContentLoaded', function(){
	var btn = document.getElementById('browserid');
	if (btn) {
		btn.onclick = function() {
			navigator.id.get(function(assertion) {
	      if (assertion) {
	        document.querySelector('input[name="assertion"]').value = assertion;
	        document.querySelector('form').submit();
	      } else {
	        location.reload();
	      }
	    });
		}
	} else {
		React.renderComponent(
			Main({
				router: router,
				routes: routes
			}),
			document.querySelector('#wrap')
		);
	}
});

// document.addEventListener('DOMContentLoaded', function(){
// 	React.renderComponent(
// 		Main({
// 			router: router,
// 			routes: routes
// 		}),
// 		document.querySelector('#wrap')
// 	);

// });


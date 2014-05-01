/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('director/build/director').Router;

var router = new Router();
var routes = {
	'/': {
		name: 'project-new',
		component: require('./components/project-new.jsx'),
		on: function() {
			this.setState({routeParams: {}});
		}
	},
	'/project/:id': {
		name: 'project',
		component: require('./components/project.jsx'),
		on: function(id) {
			this.setState({routeParams: {id: id}});
		}
	}
};

var Nav = require('./components/nav.jsx');

var Main = React.createClass({
	getInitialState: function() {
		return {
			route: null,
			routeParams: {},
			projects: []
		};
	},

	handleRoute: function(route) {
		this.setState({
			route: route
		});
	},

	handleUpdateProject: function(project, add) {
		var projects = this.state.projects.slice();
		if (add) {
			console.log(project);
			projects.push(project);
			this.setState({projects: projects});
		}
	},

	componentWillMount: function() {
		var routes = this.props.routes;
		for (var route in routes) {
			if (routes[route].on) {
				this.props.router.on(route, routes[route].on.bind(this));
			}
			var setter = this.handleRoute.bind(this, route);
			this.props.router.on(route, setter);
		}
		this.props.router.configure({
			notfound: function() {
				this.setHash('/');
			}.bind(this.props.router)
		}).init('/');

		var xhr = this.xhr = new XMLHttpRequest();
    xhr.open('GET', '/manage/project', true);
    xhr.responseType = 'json';
    xhr.addEventListener('load', this.handleLoad);
    xhr.send();
	},

	handleLoad: function(event) {
		this.setState({
			projects: event.target.response
		});
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
				<Nav projects={this.state.projects} route={this.state.route} params={this.state.routeParams} />
				<div className='container'>
					<component projects={this.state.projects} params={this.state.routeParams} onUpdateProject={this.handleUpdateProject} />
				</div>
			</div>
		);
	}
});

React.renderComponent(
	Main({
		router: router,
		routes: routes
	}),
	document.querySelector('#wrap')
);
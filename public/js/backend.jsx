/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('director/build/director').Router;

var router = new Router();
var routes = {
	'/': {
		name: 'project-new',
		component: require('./components/project-new.jsx')
	},
	'/project/:id': {
		name: 'project',
		component: require('./components/project.jsx')
	}
};

var Nav = require('./components/nav.jsx');

var Main = React.createClass({
	getInitialState: function() {
		return {
			route: null,
			routeParams: [],
			projects: [],
			project: -1
		};
	},

	handleRoute: function(route) {
		var routeParams = [].slice.call(arguments, 1);
		this.setState({
			routeParams: routeParams,
			route: route
		});
	},

	componentWillMount: function() {
		var routes = this.props.routes;
		for (var route in routes) {
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
			projects: event.target.response.map(function(project) {
				project.key = project._id;
				return project;
			})
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
		console.log(this.state.projects);
		return (
			<div>
				<Nav projects={this.state.projects} />
				<div className='container'>
					<component projects={this.state.projects} params={this.state.routeParams} />
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
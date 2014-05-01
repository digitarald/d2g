/** @jsx React.DOM */

var React = require('react');
var cx = require('react/lib/cx.js');

// var DropdownButton = require('react-bootstrap/dist/react-bootstrap').DropdownButton;


var Nav = React.createClass({
	getInitialState: function() {
		return {
			projectsOpen: false,
			userOpen: false,
			burgerOpen: false
		}
	},

	getDefaultProps: function() {
		return {
			projects: [],
			route: null,
			routeParams: {}
		};
	},

	handleDropdown: function(key, event) {
		var href = event.currentTarget.href;
		if (href && href.substr(-1) == '#') {
			event.preventDefault();
		}
		var set = {};
		set[key] = !this.state[key];
		this.setState(set);
	},

	render: function() {
		var cls = {
			user: {
				dropdown: true,
				open: this.state.userOpen
			},
			projects: {
				dropdown: true,
				active: (this.props.route == '/project/:id'),
				open: this.state.projectsOpen
			},
			burger: {
				'navbar-collapse': true,
				collapse: !this.state.burgerOpen
			},
			new_project: {
				active: (this.props.route == '/')
			},
			item: {
				active: false
			}
		};

		var currentProject;
		var id = (this.props.route == '/project/:id') && this.props.params.id;
		var projects = this.props.projects.map(function(project) {
			var itemCls = {active: false}
			if (project.key == id) {
				currentProject = project.name;
				itemCls.active = true;
			}
			var url = '#/project/' + project.key;
			return (
				<li key={project.key} className={cx(itemCls)}>
					<a href={url}
						onClick={this.handleDropdown.bind(this, 'projectsOpen')}>
							{project.name}
					</a>
				</li>
			);
		}, this);
		if (!currentProject) {
			currentProject = 'Select a Project';
		}

		for (var key in cls) {
			cls[key] = cx(cls[key]);
		}

		return (
			<div className='navbar navbar-default navbar-fixed-top'>
				<div className='container'>
					<div className='navbar-header'>
						<button type='button' className='navbar-toggle'
							onClick={this.handleDropdown.bind(this, 'burgerOpen')}>
							<span className='sr-only'>Toggle navigation</span>
							<span className='icon-bar'></span>
							<span className='icon-bar'></span>
							<span className='icon-bar'></span>
						</button>
						<a href='/' className='navbar-brand'>D2G</a>
					</div>
					<div className={cls.burger}>
						<ul className='nav navbar-nav'>
							<li className={cls.new_project}><a href='#/'>New Project</a></li>
							<li className={cls.projects}>
								<a className='dropdown-toggle' href='#'
									onClick={this.handleDropdown.bind(this, 'projectsOpen')}>
										{currentProject} <span className='caret'></span>
								</a>
								<ul className='dropdown-menu open' ref='projects'>
									{projects}
								</ul>
							</li>
						</ul>
						<ul className='nav navbar-nav navbar-right'>
							<li className={cls.user}>
								<a href='#' className='dropdown-toggle' onClick={this.handleDropdown.bind(this, 'userOpen')}>You <i className='caret'></i></a>
								<ul className='dropdown-menu'>
									<li><a href='/account'>My Account</a></li>
									<li className='divider'></li>
									<li><a href='/logout'>Logout</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Nav;
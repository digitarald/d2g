/** @jsx React.DOM */

var React = require('react');

// var DropdownButton = require('react-bootstrap/dist/react-bootstrap').DropdownButton;


var Component = React.createClass({

	getInitialState: function() {
		return {
			projectsOpen: false
		}
	},

	getDefaultProps: function() {
		return {
			projects: [],
			project: -1
		};
	},

	handleDropdownClick: function(key) {
		var set = {};
		set[key] = !this.state[key];
		this.setState(set);
	},

	render: function() {
		var currentProject;
		var projects = this.props.projects.map(function(project) {
			if (this.props.project == project.key) {
				currentProject = project.name;
			}
			var url = '#/project/' + project.key;
			return (
				<li><a href={url} onClick={this.handleDropdownClick.bind(this, 'projectsOpen')}>{project.name}</a></li>
			);
		}, this);
		if (!currentProject) {
			currentProject = 'Select a Project';
		}

		var dropdownClsProject = 'dropdown' + (this.state.projectsOpen ? ' open' : '');
		var dropdownClsUser = 'dropdown' + (this.state.userOpen ? ' open' : '');

		return (
			<div className='navbar navbar-default navbar-fixed-top'>
				<div className='container'>
					<div className='navbar-header'>
						<button type='button' data-toggle='collapse' data-target='.navbar-collapse' className='navbar-toggle'><span className='sr-only'>Toggle navigation</span><span className='icon-bar'></span><span className='icon-bar'></span><span className='icon-bar'></span></button><a href='/' className='navbar-brand'>D2G</a>
					</div>
					<div className='collapse navbar-collapse'>
						<ul className='nav navbar-nav'>
							<li><a href='#/'>New Project</a></li>
							<li className={dropdownClsProject}>
								<a className='dropdown-toggle' onClick={this.handleDropdownClick.bind(this, 'projectsOpen')}>{currentProject} <span className='caret'></span></a>
								<ul className='dropdown-menu open' ref='projects'>{projects}</ul>
							</li>
						</ul>
						<ul className='nav navbar-nav navbar-right'>
							<li className={dropdownClsUser}>
								<a href='#' data-toggle='dropdown' className='dropdown-toggle' onClick={this.handleDropdownClick.bind(this, 'userOpen')}>You <i className='caret'></i></a>
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

module.exports = Component;
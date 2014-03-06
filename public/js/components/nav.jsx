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

	handleDropdownClick: function() {
		console.log('handleDropdownClick', this.state.projectsOpen);
		this.setState({projectsOpen: !this.state.projectsOpen});
	},

	render: function() {
		var currentProject;
		var projects = this.props.projects.map(function(project) {
			if (this.props.project == project.key) {
				currentProject = project.name;
			}
			var url = '#/project/' + project.key;
			return (
				<li><a href={url} onClick={this.handleDropdownClick}>{project.name}</a></li>
			);
		}, this);
		if (projects.length) {
			projects.push(<li className='divider'></li>);
			projects.push(<li><a href='#/' onClick={this.handleDropdownClick}>New Project</a></li>);
		}
		if (!currentProject) {
			currentProject = 'Select a Project';
		}

		var dropdownCls = 'dropdown' + (this.state.projectsOpen ? ' open' : '');

		return (
			<div className='navbar navbar-default navbar-fixed-top'>
				<div className='container'>
					<div className='navbar-header'>
						<button type='button' data-toggle='collapse' data-target='.navbar-collapse' className='navbar-toggle'><span className='sr-only'>Toggle navigation</span><span className='icon-bar'></span><span className='icon-bar'></span><span className='icon-bar'></span></button><a href='/' className='navbar-brand'>D2G</a>
					</div>
					<div className='collapse navbar-collapse'>
						<ul className='nav navbar-nav'>
							<li className={dropdownCls}>
								<a className='	dropdown-toggle' onClick={this.handleDropdownClick}>{currentProject} <span className='caret'></span></a>
								<ul className='dropdown-menu open' ref='projects'>{projects}</ul>
							</li>
						</ul>
						<ul className='nav navbar-nav navbar-right'>
							<li className='dropdown'>
								<a href='#' data-toggle='dropdown' className='dropdown-toggle'>You <i className='caret'></i></a>
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
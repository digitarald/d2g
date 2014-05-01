/** @jsx React.DOM */

var React = require('react');

var Project = React.createClass({
	getDefaultProps: function() {
		return {
			projects: null,
			params: {}
		}
	},

	render: function() {
		var id = this.props.params.id;
		var project = this.props.projects.filter(function(project) {
			return project.key = id;
		}, this)[0];
		if (!project) {
			return <div>{id} not found</div>
		}
		var url = location.origin + '/install/' + project.key;

		return (
			<div className='project'>
				<div className='row'>
					<div className='col-xs-12 page-header'>
						<img src={project.iconUrl} />
						<h1>{project.name}</h1>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-2 text-right'>
						Share this URL with testers.
					</div>
					<div className='col-md-10'>
						<i className='fa fa-link'></i> <a target='_blank' href={url}>
							{url}
						</a>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = Project;
/** @jsx React.DOM */

var React = require('react');
var cx = require('react/lib/cx.js');

var ProjectNew = React.createClass({

	getInitialState: function() {
		return {
			uploading: false,
			project: null,
			progress: 0,
			dragOver: false
		}
	},

	handleUpload: function(event) {
		console.log(event);
		var file = (event.dataTransfer ? event.dataTransfer.files : event.target.files)[0];

		var data = new FormData();
		data.append('zip', file);
		var req = new XMLHttpRequest();
		req.open('POST', '/manage/project', true);
		req.upload.addEventListener('progress', this.handleProgress);
		req.addEventListener('load', this.handleComplete);
		req.addEventListener('error', this.handleError);
		req.send(data);

		this.setState({
			uploading: true,
			progress: 0,
			dragOver: false,
			file: file.name,
			error: null
		});
	},

	handleProgress: function(event) {
		if (!event.lengthComputable) {
			return;
		}
		var progress = event.loaded / event.total;
		this.setState({progress: 0});
	},

	handleDragEnter: function() {
		if (!this.state.dragOver) {
			this.setState({dragOver: true});
		}
	},

	handleDragLeave: function() {
		if (this.state.dragOver) {
			this.setState({dragOver: false});
		}
	},

	handleError: function() {
		this.setState({
			uploading: false,
			error: req.responseText
		});
	},

	handleComplete: function(event) {
		var req = event.currentTarget;
		var project = JSON.parse(req.responseText);
		this.setState({uploading: false});
		this.props.onUpdateProject(project, true);
		// location.hash = '/project/' + project.project;
	},

	render: function() {
		if (this.state.uploading) {
			var upload = (
				<div>
					<h4>{this.state.progress}%</h4>
					<h5>Uploading <em>{this.state.file}</em></h5>
				</div>
			);
		} else {
			var upload = (
				<input type='file' ref='upload' onChange={this.handleUpload} />
			);
		}

		var cls = cx({
			row: true,
			'is-dragging': this.state.dragging
		});

		return (
			<div className={cls}>
				<div className='col-md-6 col-md-offset-3'>
					<div className='page-header'>
						<h1><i className='fa fa-rocket'></i> Upload your Project</h1>
					</div>
					<div onDragEnter={this.handleDragEnter} onDragLeave={this.handleDragLeave} onDrop={this.handleUpload}>
						<p className='lead'>
							Quick-start a new project with an app package.
							You need to have a zip file containing your app.
						</p>
						<p className='text-center'>{upload}</p>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = ProjectNew;
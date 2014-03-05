/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({

  getInitialState: function() {
    return {
      uploading: 0,
      project: null,
      progress: 0
    }
  },

  handleUpload: function(event) {
    console.log(event);
    var file = (event.dataTransfer ? event.dataTransfer : event.target.files)[0];

    var data = new FormData();
    data.append('zip', file);
    var xhr = this.xhr = new XMLHttpRequest();
    xhr.open('POST', '/manage/project', true);
    xhr.upload.addEventListener('progress', this.handleProgress);
    xhr.addEventListener('load', this.handleComplete);
    xhr.send(data);

    this.setState({uploading: 1, progress: 0});
  },

  handleProgress: function(event) {
    if (!event.lengthComputable) {
      return;
    }
    var progress = event.loaded / event.total;
    this.setState({progress: 0});
  },

  handleComplete: function(event) {
    this.setState({uploading: 2, project: this.xhr.responseText});
    this.xhr = null;
  },

	render: function() {
    switch (this.state.uploading) {
      case 0:
        var upload = <input type='file' ref='package' onChange={this.handleUpload} />;
        break;
      case 1:
        var upload = <span>Uploading {this.state.progress}%</span>;
        break;
      case 2:
        var upload = <span>Uploaded <em>{this.state.project}</em></span>;
        break;
    }

		return (
      <div onDrop={this.handleUpload}>
  			<div className='page-header'>
          <h2><i className='fa fa-rocket'></i> Add a new Project</h2>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <h3><i className='fa fa-upload'></i> Upload Package</h3>
            <p className='lead'>Quick-start a new project with an app package. You need to have a zip file containing your app.</p>
            <h4>Upload File</h4>
            <p className='text-center'>{upload}</p>
          </div>
          <div className='col-md-6'>
            <h3><i className='fa fa-dropbox'></i> Link Github Repo</h3>
            <p className='lead'>Automate build updates with commit hooks.</p>
            <p>You need to link your Github account before continuing.</p><a href='/auth/github' className='btn btn-default'>Link your GitHub account</a>
          </div>
        </div>
      </div>
		);
	}

});

module.exports = Component;
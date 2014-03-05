/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({

  getInitialState: function() {
    return {
      uploading: false,
      progress: 0
    }
  },

  handleUpload: function() {
    var file = (event.target.files || event.dataTransfer.files)[0];

    var data = new FormData();
    data.append('zip', file);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/manage/project', true);
    xhr.addEventListener('progress', this.handleProgress.bind(this));
    xhr.addEventListener('load', this.handleComplete.bind(this));
    xhr.send(data);

    this.setState({uploading: true, progress: 0});
  },

  handleProgress: function(event) {
    if (!event.lengthComputable) {
      return;
    }
    var progress = event.loaded / event.total;
    console.log('%d%% complete', progress * 100);
    this.setState({progress: progress});
  },

  handleComplete: function(event) {
  },

	render: function() {
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
            <p className='text-center'>
              <input type='file' ref='package' onChange={this.handleUpload} />
            </p>
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
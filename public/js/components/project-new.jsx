/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({
	render: function() {
		return (
      <div>
  			<div className='page-header'>
          <h2><i className='fa fa-rocket'></i> Add a new Project</h2>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <p className='lead'>Quick-start a new project with an app package. You need to have a zip file containing your app.</p>
            <div className='row'>
              <div className='col-md-6 text-center'>
                <h4>Upload File</h4>
                <input type='file' name='new-package' />
              </div>
              <div className='col-md-6 text-center'>
                <h4>Get from Dropbox
                  <button className='btn btn-default'>Pick from Dropbox</button>
                </h4>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <h3><i className='fa fa-dropbox'></i>Link Github Repo</h3>
            <p className='lead'>Automate build updates with commit hooks.</p>
            <p>You need to link your Github account before continuing.</p><a href='/auth/github' className='btn btn-default'>Link your GitHub account</a>
          </div>
        </div>
      </div>
		);
	}
});

module.exports = Component;
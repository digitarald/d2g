/** @jsx React.DOM */

var React = require('react');

var Component = React.createClass({

  getDefaultProps: function() {
    return {
      projects: null,
      params: []
    }
  },

  handleUrlSelect: function() {
    this.refs.shareUrl.getDOMNode().select();
  },

	render: function() {
    var id = this.props.params[0];
    var project = this.props.projects.filter(function(project) {
      return project.key = id;
    }, this)[0];

    if (!project) {
      return <div>{id} not found</div>
    }

    var url = location.origin + '/install/' + project.key;

		return (
      <div>
  			<div className='page-header'>
          <h2><i className='fa fa-rocket'></i> {project.name}</h2>
        </div>
        <div className='row'>
          <h4 className='col-md-2 text-right'>Share this URL:</h4>
          <div className='col-md-10'>
            <input ref='shareUrl' type='url' className='form-control input-lg col-md-12' value={url} readOnly onClick={this.handleUrlSelect} />
          </div>
        </div>
      </div>
		);
	}

});

module.exports = Component;
/** @jsx React.DOM */

var React = require('react');

var Nav = require('react-bootstrap/dist/react-bootstrap').Nav;
var NavItem = require('react-bootstrap/dist/react-bootstrap').NavItem;

var Component = React.createClass({
	render: function() {
		return (
			<div className='navbar navbar-default navbar-fixed-top'>
			  <div className='container'>
			    <div className='navbar-header'>
			      <button type='button' data-toggle='collapse' data-target='.navbar-collapse' className='navbar-toggle'><span className='sr-only'>Toggle navigation</span><span className='icon-bar'></span><span className='icon-bar'></span><span className='icon-bar'></span></button><a href='/' className='navbar-brand'>D2G</a>
			    </div>
			    <div className='collapse navbar-collapse'>
			      <ul className='nav navbar-nav'>
			        <li><a href='/'>Home</a></li>
			      </ul>
			      <ul className='nav navbar-nav navbar-right'>
			        <li className='dropdown'><a href='#' data-toggle='dropdown' className='dropdown-toggle'><img src='https://gravatar.com/avatar/0953c06dbc5a536a833cb0b7f6376764?s=60&amp;d=retro' className='profile-image' />k@harald.me&nbsp;<i className='caret'></i></a>
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
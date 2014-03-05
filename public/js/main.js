
require('../css/styles.less');

document.addEventListener('DOMContentLoaded', function(){
	if (document.documentElement.classList.contains('is-standalone')) {
		require.ensure([], function() {
			require('./backend.jsx');
		}, 'backend');
		return;
	}
	var btn = document.getElementById('browserid');
	if (btn) {
		btn.onclick = function() {
			navigator.id.get(function(assertion) {
	      if (assertion) {
	        document.querySelector('input[name="assertion"]').value = assertion;
	        document.querySelector('form').submit();
	      } else {
	        location.reload();
	      }
	    });
		}
	}
});
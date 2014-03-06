
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

	var install = document.querySelector('button[data-package-manifest-url]');
	if (install) {
		if (!navigator.mozApps) {
			return alert('navigator.mozApps is required');
		}
		if (!navigator.mozApps.installPackage) {
			return alert('mozApps.installPackage is required');
		}
		install.addEventListener('click', function f(e) {
			var url = install.getAttribute('data-package-manifest-url');
			url = location.origin + url;
			var request = navigator.mozApps.installPackage(url);
			request.onsuccess = function() {
				if (!this.result) {
					return alert('Install failed without error');
				}
				alert(this.result.manifest.name + ' installed');
			};
			request.onerror = function() {
				alert(this.error.name);
			}
		});
	}

});

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

	// TODO check if navigator.mozApps exists.


	// app.js

	function showLogMessage(inMessage) {
		console.log(inMessage);
	}

	function installSuccess(e) {
		showLogMessage("app install succeeded " + this.result);
	}

	function installFail(e) {
		showLogMessage("app install failed " + this.error.name);
	}

	var buttons = document.getElementsByTagName("button");

	for (var index = 0; index < buttons.length; index++) {
		var button = buttons[index];

		button.addEventListener('click', function f(e) {
			showLogMessage("clicked " + e.target.innerHTML.trim());
			//document.getElementById('installSpinner').style.display = 'block';

			if (e.target.getAttribute("data-manifest-url")) {
				// This is issue #17.
				showLogMessage("install hosted " + e.target.innerHTML.trim());

				var url = e.target.getAttribute("data-manifest-url");
				showLogMessage("hosted manifest url " + url);

				var request = navigator.mozApps.install(url);
				request.onsuccess = installSuccess;
				request.onerror = installFail;

			} else if (e.target.getAttribute("data-package-manifest-url")) {
				showLogMessage("install packaged " + e.target.innerHTML.trim());

				var url = e.target.getAttribute("data-package-manifest-url");
				showLogMessage("packaged manifest url " + url);

				var request = navigator.mozApps.installPackage(url);
				request.onsuccess = installSuccess;
				request.onerror = installFail;

			} else {
				showLogMessage("ERROR: found neither data-packaged-manifest-url nor data-manifest-url");
			}
		});
	}



});
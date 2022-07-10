/**
 * The goal of this script is to create an iframe and resize it automatically to
 * fit the content inside using iframe postMessage communication between the
 * parent script and the iframe.
 */

(function () {
	const iframeElement = document.createElement('iframe');
	iframeElement.src =
		'https://mesaidesvelo.fr/?iframe=1&utm_medium=iframe&utm_source=' +
		encodeURIComponent(window.location.host) +
		'&utm_content=' +
		encodeURIComponent(window.location.href);
	iframeElement.style.width = '100%';
	iframeElement.style.height = '500px';
	iframeElement.style.border = '0';
	iframeElement.scrolling = 'no';

	document.currentScript.after(iframeElement);

	window.addEventListener('message', function (evt) {
		if (evt.data.kind === 'resize-height') {
			iframeElement.style.height = evt.data.value + 'px';
		}
	});
})();

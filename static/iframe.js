/**
 * The goal of this script is to create an iframe and resize it automatically to
 * fit the content inside using iframe postMessage communication between the
 * parent script and the iframe.
 */

(function () {
	const iframeElement = document.createElement('iframe');
	const utmSource = encodeURIComponent(window.location.href);
	iframeElement.src = 'https://mesaidesvelo.fr/?iframe=1&utm_medium=iframe&utm_source=' + utmSource;
	iframeElement.style.width = '100%';
	iframeElement.style.border = '0';
	iframeElement.scrolling = 'no';

	const scriptTag = document.getElementById('mesaidesvelo-iframe');
	scriptTag.after(iframeElement);

	window.addEventListener('message', function (evt) {
		if (evt.data.kind === 'resize-height') {
			iframeElement.height = evt.data.value + 'px';
		}
	});
})();

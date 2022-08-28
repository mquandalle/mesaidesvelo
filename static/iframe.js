// This script creates an iframe and resizes it automatically to fit its inner content
{
	let i = document.createElement('iframe'), e = (l) => encodeURIComponent(location[l]);
	i.src = `https://mesaidesvelo.fr/?iframe=1&utm_medium=iframe&utm_source=${e('host')}&utm_content=${e('href')}`;
	i.style.width = '100%';
	i.style.height = '500px';
	i.style.border = '0';
	i.scrolling = 'no';
	document.currentScript.after(i);

	addEventListener('message', (e) =>
		e.data.kind === 'resize-height' ? (i.style.height = e.data.value + 'px') : null
	);
}

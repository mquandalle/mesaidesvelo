<script>
	export let emoji;
	export let className = '';
	// From twitter/twemoji source code
	function toCodePoint(unicodeSurrogates, sep) {
		let r = [],
			c = 0,
			p = 0,
			i = 0;

		while (i < unicodeSurrogates.length) {
			c = unicodeSurrogates.charCodeAt(i++);
			if (p) {
				r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
				p = 0;
			} else if (0xd800 <= c && c <= 0xdbff) {
				p = c;
			} else {
				r.push(c.toString(16));
			}
		}
		return r.join(sep || '-');
	}
</script>

{#if emoji}
	<img
		src="/emojies/{toCodePoint(emoji)}.svg"
		class="inline align-middle relative ml-1 leading-none {className}"
		style="height: 1em"
		draggable="false"
		alt={emoji}
	/>
{/if}

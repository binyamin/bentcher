export const imagick = [48, 72, 96, 144, 168, 192].map((n) => ({
	resize: [n, n],
	suffix: '-' + n,
	format: 'png',
})).concat({ resize: [512, 512], format: 'webp' });

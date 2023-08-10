import lume from 'lume/mod.ts';

import imagick from 'lume/plugins/imagick.ts';
import lightning_css from 'lume/plugins/lightningcss.ts';
import source_maps from 'lume/plugins/source_maps.ts';

import { getLumeVersion } from 'lume/core/utils.ts';
import { computeTargets } from './helpers/util.ts';

const site = lume({
	src: 'src',
	dest: 'out',
});

site.data('lume_version', getLumeVersion());
site.filter('log', console.log);

site.addEventListener('afterBuild', async (_event) => {
	const fontFiles = [
		'files/noto-serif-hebrew-hebrew-wght-normal.woff2',
		'files/noto-serif-hebrew-latin-wght-normal.woff2',
		'files/noto-serif-hebrew-latin-ext-wght-normal.woff2',
		'wght.css',
	];
	await Deno.mkdir(site.dest('fonts/noto-serif-hebrew/files'), {
		recursive: true,
	});
	for await (const file of fontFiles) {
		await Deno.copyFile(
			`${Deno.cwd()}/node_modules/@fontsource-variable/noto-serif-hebrew/${file}`,
			site.dest('fonts/noto-serif-hebrew/' + file),
		);
	}
});

site.copy('static', '.');

site.loadAssets(['.js']);

site.use(lightning_css({
	includes: 'css/includes',
	options: {
		targets: computeTargets([
			'> 0.5%',
			'last 2 versions',
			'FF ESR',
			'not dead',
		]),
	},
}));
site.use(source_maps({
	sourceContent: true,
}));
site.use(imagick());

export default site;

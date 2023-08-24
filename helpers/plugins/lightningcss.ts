import { bundle } from 'lume/deps/lightningcss.ts';
import { merge } from 'lume/core/utils.ts';
import * as path from 'lume/deps/path.ts';
import { prepareAsset, saveAsset } from 'lume/plugins/source_maps.ts';

import type { BundleOptions, CustomAtRules , Warning } from 'lume/deps/lightningcss.ts';
import type { Site } from 'lume/core.ts';

export interface Options<C extends CustomAtRules = CustomAtRules> {
	/** The list of extensions this plugin applies to */
	extensions: string[];

	/** Custom includes path */
	includes: string | false;

	/** Options passed to parcel_css */
	options: Omit<BundleOptions<C>, 'filename' | 'inputSourceMap'>;
}

const defaultOptions: Options = {
	extensions: ['.css'],
	includes: false,
	options: {
		minify: true,
		drafts: {
			customMedia: true,
			nesting: true,
		}
	},
};

/**
 * @note Waiting on https://github.com/parcel-bundler/lightningcss/issues/546
 * for custom error classes and types
 */
interface LightningCssError extends SyntaxError {
	fileName: string;
	loc: { line: number, column: number };
	data: unknown;
}

export default function (userOptions?: Partial<Options>) {
	const options = merge(defaultOptions, userOptions);

	return (site: Site) => {
		site.loadAssets(options.extensions);
		if (options.includes) {
			site.includes(options.extensions, options.includes);
		}

		const decoder = new TextDecoder();

		function formatMessage(msg: LightningCssError | Warning) {
			const filename = msg instanceof Error ? msg.fileName : msg.loc.filename;

			const msgFile = path.relative(site.root(), filename);
			const fileRef = `${msgFile}:${msg.loc.line}:${msg.loc.column}`;

			site.logger.warn(
				`${msg.message}\n${''.padStart(4)}${fileRef}\n`,
				{
					name: 'LightningCSS',
				},
			);
		}

		site.process(options.extensions, (file) => {
			const { filename, enableSourceMap } = prepareAsset(site, file);

			try {
				// Process the code with LightningCSS
				const result = bundle({
					sourceMap: enableSourceMap,
					...options.options,
					filename,
				});

				if (file.data.url) {
					const ext = path.extname(file.data.url);
					if (ext !== '.css') {
						file.data.url = file.data.url.slice(0, 0 - ext.length) + '.css';
					}
				}

				// If `errorRecovery` is `true`, we get warnings
				for (const msg of result.warnings) {
					formatMessage(msg);
				}

				saveAsset(
					site,
					file,
					decoder.decode(result.code),
					enableSourceMap ? decoder.decode(result.map!) : undefined,
				);
			} catch (err) {
				if ('fileName' in err) {
					// Assume the error is from LightningCSS
					formatMessage(err);
					return false;
				} else {
					throw err;
				}
			}
		});
	};
}

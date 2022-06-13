import * as path from 'https://deno.land/std@0.143.0/path/mod.ts';

import { type Site } from 'lume/core.ts';
import CleanCSS from 'https://esm.sh/clean-css@5.3.0';

interface Options {
    /**
     * @default ['.css']
     */
    extensions?: string[];
    /**
     * @default
     * {
     *  level: 2,
     *  sourceMap: true,
     *  sourceMapInlineSources: true,
     * }
     */
    options?: Omit<CleanCSS.OptionsPromise, 'returnPromise'>;
}

const minifyPlugin = (options: Options = {}) => {
    const extensions = options.extensions ?? ['.css'];
    
    const cleaner = new CleanCSS({
        level: 2,
        sourceMap: true,
        sourceMapInlineSources: true,
        ...options.options,
        returnPromise: true,
    });

    return (site: Site) => {
        site.loadAssets(extensions);
        site.process(extensions, async (file) => {
            // const from = site.src(file.src.path + file.src.ext);
            const map = site.pages.find(page => {
                const isMapFile = page.dest.ext === '.map';
                const isMapOurs = page.dest.path === (
                    file.dest.path + file.dest.ext
                );
                return isMapFile && isMapOurs;
            });
            // Temporarily remove the sourceMap comment. We already have the
            // sourceMap, and CleanCSS can't read the file anyways, so it's
            // just annoying.
            const css = (file.content as string).replace(
                /\/\*#\s*sourceMappingURL=.+$/,
                '',
            );
            
            const output = await cleaner.minify(
                css,
                map ? map.content as string : undefined,
            );
            
            for (const error of output.errors) {
                site.logger.warn(error, {
                    name: 'CleanCSS (error)'
                });
            }

            for (const warn of output.warnings) {
                site.logger.warn(warn, {
                    name: 'CleanCSS (warning)'
                });
            }

            if (map) {
                file.content = output.styles + `\n/*# sourceMappingURL=${
                    path.basename(map.dest.path + map.dest.ext)
                } */`;

                map.content = output.sourceMap.toString();
            } else {
                file.content = output.styles;
            }
        })
    };
}

export default minifyPlugin;

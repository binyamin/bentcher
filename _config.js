import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import jsx from "lume/plugins/jsx.ts";
import esbuild from "lume/plugins/esbuild.ts";
import imagick from "lume/plugins/imagick.ts";

import clean_css from 'https://deno.land/x/lume_cleancss@v0.2.0/mod.ts';

const site = lume({
    src: 'src',
    dest: 'out',
    cwd: Deno.cwd(),
    components: {
        cssFile: '/css/components.css',
        jsFile: '/js/components.js',
    }
});

site.filter('log', console.log);

site.addEventListener('afterBuild', async (_event) => {
    const fontFiles = [
        'files/noto-serif-hebrew-hebrew-variable-wghtOnly-normal.woff2',
        'variable.css',
    ];
    await Deno.mkdir(site.dest('fonts/noto-serif-hebrew/files'), {
        recursive: true,
    });
    for await (const file of fontFiles) {
        await Deno.copyFile(
            `${Deno.cwd()}/node_modules/@fontsource/noto-serif-hebrew/${file}`,
            site.dest('fonts/noto-serif-hebrew/' + file),
        );
    }
})

site.copy('static', '.');

site.use(jsx());
site.use(esbuild())
site.use(postcss({
    plugins: [],
    sourceMap: {
        sourcesContent: true,
        inline: false,
    }
}));
site.use(clean_css());
site.use(imagick());

export default site;

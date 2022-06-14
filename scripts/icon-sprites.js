import { promises as fs } from 'node:fs';
import Spriter from 'svg-sprite';

const spriter = new Spriter({
    dest: "out/assets",
    mode: {
        symbol: {
            dest: ".",
            sprite: "icons.sprite.svg"
        }
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
});

/**
 * @type {Array<keyof import('lucide-static/icon-nodes.json')>}
 */
const icons = ['plus'];

for (const name of icons) {
    const iconPath = `./node_modules/lucide-static/icons/${name}.svg`;
    const contents = await fs.readFile(iconPath, 'utf8');
    spriter.add(iconPath, null, contents);
}

const {result} = await new Promise((resolve, reject) => {
    spriter.compile((error, result, data) => {
        if (error) reject(error);
        resolve({result, data});
    });
});

await fs.mkdir('src/static/assets', { recursive: true });
await fs.writeFile('src/static/assets/icons.sprite.svg', result.symbol.sprite.contents, 'utf8');

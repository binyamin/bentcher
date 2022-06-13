import slugify from 'https://esm.sh/@sindresorhus/slugify@2.1.0';
import text from './_text.json' assert { type: 'json' };

export const title = text.heTitle;

export const body = text.schema.nodes[0].nodes.map(v => {
    return ({
        title: v.heTitle,
        slug: slugify(v.enTitle, {
            lowercase: true
        }),
        body: text.text['Birkat Hamazon'][v.enTitle],
    })
});

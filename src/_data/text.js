import slugify from 'npm:@sindresorhus/slugify@^2.2.1';
import text from './_text.json' assert { type: 'json' };

export const title = text.heTitle;

export const body = text.schema.nodes[0].nodes.map((v) => {
	return ({
		title: v.heTitle,
		slug: slugify(v.enTitle, {
			lowercase: true,
		}),
		body: text.text['Birkat Hamazon'][v.enTitle],
	});
});

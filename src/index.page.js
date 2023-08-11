import text from './_data/_text.json' assert { type: 'json' };

export const layout = 'page.njk';
export const url = '/';
export const title = text.heTitle;

export const body = text.schema.nodes[0].nodes.map((v) => {
	return ({
		title: v.heTitle,
		body: text.text['Birkat Hamazon'][v.enTitle],
	});
});

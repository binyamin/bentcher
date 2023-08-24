import browserslist from 'npm:browserslist@^4.21.9';
import { browserslistToTargets } from 'lume/deps/lightningcss.ts';

export function computeTargets(list: string | string[]) {
	// browserslist(list); console.log("[usage]", browserslist.usage);
	return browserslistToTargets(browserslist(list));
}

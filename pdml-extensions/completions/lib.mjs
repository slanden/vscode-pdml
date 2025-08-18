// TODO: Copied from pdml extension; publish a
// 			 package extension devs can use instead
/**@typedef {Symbol} CompletionType */
export const CompletionType = Object.freeze({
	Empty: 1,
	BeginNode: 2,
	EndNamespace: 3,
});

export function mDoc(markdownString) {
	return {
		kind: "markdown",
		value: markdownString,
	};
}

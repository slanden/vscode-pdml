/** Returns a function that debounces an async function */
export function debounceAsync(fn, wait) {
	let timeout;
	let pendingPromise;
	let pendingResolve;

	return function (...args) {
		if (!pendingPromise) {
			pendingPromise = new Promise((resolve) => {
				pendingResolve = resolve;
			});
		}

		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			timeout = null;
			try {
				pendingResolve(await fn.apply(this, args));
			} finally {
				pendingPromise = null;
				pendingResolve = null;
			}
		}, wait);
		return pendingPromise;
	};
}

/** Like `Promise.allSettled` for a growable list of `pending`
 * promises */
export async function waitForAllToFinish(pending) {
	let settledCount = 0;

	while (true) {
		const length = pending.length;

		// Wait for all current promises to settle
		await Promise.allSettled(pending.slice(settledCount));
		settledCount = pending.length;

		// If no new promises were added during wait
		if (settledCount === length) break;
	}
}

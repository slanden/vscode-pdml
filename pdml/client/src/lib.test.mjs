import assert from "node:assert";
import test from "node:test";
import { debounceAsync as debounce } from "./lib.mjs";

test("Should debounce an async function", async () => {
	const debouncedStartFn = debounce(async () => {
		await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log("client started");
		return "client";
	}, 3000);
	const final = debouncedStartFn();
	await new Promise((resolve) => setTimeout(resolve, 1000));
	debouncedStartFn();
	await final;
});

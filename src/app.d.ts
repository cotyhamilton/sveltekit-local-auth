/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: User | null;
	}
	// interface Platform {}
	interface Session {
		user: User | null;
	}
	// interface Stuff {}
}

interface User {
	name: string;
	email: string;
}

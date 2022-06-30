<script lang="ts">
	import { session } from "$app/stores";
	import { goto } from "$app/navigation";

	import { assertIsError } from "$lib/utils/assertions";

	let name: string;
	let email: string;
	let password: string;
	let error: string | null = null;

	async function signup() {
		error = null;

		const body = JSON.stringify({
			name,
			email,
			password
		});

		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body
			});

			const data = await res.json();

			if (res.ok) {
				if (data.user) {
					$session.user = data.user;
					goto("/profile");
				}
			} else {
				if (data.error) {
					throw new Error(data.message ? data.message : data.error);
				} else {
					throw new Error("Something went wrong");
				}
			}
		} catch (err) {
			assertIsError(err);
			error = err.message;
		}
	}
</script>

<form on:submit|preventDefault={signup}>
	<h2>Sign Up</h2>
	<label>
		name
		<input type="text" bind:value={name} />
	</label>
	<label>
		email
		<input type="email" bind:value={email} />
	</label>
	<label>
		password
		<input type="password" bind:value={password} />
	</label>
	<input type="submit" />
	{#if error}
		<small style="color: red;">{error}</small>
	{/if}
</form>

<style>
	input {
		display: block;
	}
</style>

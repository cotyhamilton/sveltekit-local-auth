<script lang="ts">
	import { goto } from "$app/navigation";
	import { session } from "$app/stores";

	import { assertIsError } from "$lib/utils/assertions";

	let name: string;
	let email: string;
	let password: string;
	let remember = false;
	let error: string | null = null;

	async function signup() {
		error = null;

		const body = JSON.stringify({
			name,
			email,
			password,
			remember
		});

		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				body
			});

			const json = await res.json();

			if (json.error) {
				throw new Error(json.message ? json.message : json.error);
			} else if (res.ok && json?.data?.user) {
				const { data } = json;
				$session.user = data.user;
				goto("/profile");
			} else {
				throw new Error("Something went wrong");
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
	<label>
		remember me
		<input type="checkbox" bind:checked={remember} />
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

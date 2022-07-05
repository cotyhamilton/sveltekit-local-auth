<script lang="ts" context="module">
	import type { Load } from "./__types/profile";

	export const load: Load = async ({ session }) => {
		if (!session?.user) {
			return {
				status: 302,
				redirect: "/"
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { session } from "$app/stores";

	import { assertIsError } from "$lib/common/assertions";

	let currentPassword: string;
	let newPassword: string;
	let error: string | null = null;
	let info: string | null = null;

	async function changePassword() {
		error = null;
		info = null;

		const body = JSON.stringify({
			currentPassword,
			newPassword
		});

		try {
			const res = await fetch("/api/auth/changePassword", {
				method: "POST",
				body
			});

			const json = await res.json();

			if (json.error) {
				throw new Error(json.error?.message ? json.error.message : "Something went wrong");
			} else if (res.ok && json?.data?.message) {
				const { data } = json;
				info = data.message;
			} else {
				throw new Error("Something went wrong");
			}
		} catch (err) {
			assertIsError(err);
			error = err.message;
		}
	}
</script>

<p>hello {$session?.user?.name}</p>

<h2>Sign Out</h2>
<button on:click={() => goto("/api/auth/logout")}>Sign Out</button>

<br />
<br />

<form on:submit|preventDefault={changePassword}>
	<h2>Change password</h2>
	<label>
		current password
		<input type="password" bind:value={currentPassword} />
	</label>
	<label>
		new password
		<input type="password" bind:value={newPassword} />
	</label>
	<input type="submit" />
	{#if error}
		<small style="color: red;">{error}</small>
	{/if}
	{#if info}
		<small style="color: green;">{info}</small>
	{/if}
</form>

<style>
	label {
		display: block;
	}
	input {
		display: block;
	}
</style>

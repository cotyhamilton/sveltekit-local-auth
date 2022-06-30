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
	import { session } from "$app/stores";
	import { goto } from "$app/navigation";
</script>

<p>hello {$session?.user?.name}</p>
<button on:click={() => goto("/api/auth/logout")}>Sign Out</button>

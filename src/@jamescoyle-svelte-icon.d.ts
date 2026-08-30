// Unmaintained piece of shit.
declare module '@jamescoyle/svelte-icon' {
	import { SvelteComponent } from 'svelte';
	export default class SvgIcon extends SvelteComponent<{
		type?: string;
		path: string;
		size?: string | number;
		viewbox?: string;
		flip?: string;
		rotate?: number;
	}> {}
}

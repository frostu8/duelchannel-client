import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		proxy: {
			'/api/v1': {
				target: 'https://duelchannel.ringrace.rs',
				changeOrigin: true
				//rewrite: (path) => path.replace(/^\/api\/v1/, ''),
			}
		}
	},
	plugins: [sveltekit()]
});

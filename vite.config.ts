import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { enhancedImages } from '@sveltejs/enhanced-img';
import fs from 'fs';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		poolOptions: {
			threads: {
				singleThread: true
			}
		}
	},
	// Vite uses Chokidar under the hood to watch files,
	// and its default method of doing so doesn't work in Docker containers.
	// set server.watch.usePolling to true to enable HMR
	server: {
		watch: {
			usePolling: true
		},
		https: {
			key: fs.readFileSync(`${__dirname}/cert/key.pem`),
			cert: fs.readFileSync(`${__dirname}/cert/cert.pem`)
		},
		proxy: {}
	}
});

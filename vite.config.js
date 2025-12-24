import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    preview: {
        allowedHosts: ['agricola.uber.space'],
    },
    css: {
        preprocessorOptions: {
            // if using SCSS
            scss: {
                additionalData: `
                @use '$lib/scss/colors' as *;
                @use '$lib/scss/typography' as *;

            `,
            },
        },
    },
});

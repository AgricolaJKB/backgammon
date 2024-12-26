import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      // if using SCSS
      scss: {
        additionalData: `
                @use '$lib/client/scss/colors' as *;    
            `
      }
    }
  }
});

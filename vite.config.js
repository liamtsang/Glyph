// vite.config.js
import { resolve } from "path"
import { defineConfig } from "vite"
import topLevelAwait from "vite-plugin-top-level-await"

const root = resolve(__dirname, "src")
const outDir = resolve(__dirname, "dist")

export default defineConfig({
    root,
	plugins: [
		topLevelAwait({
			// The export name of top-level await promise for each chunk module
			promiseExportName: "__tla",
			// The function to generate import names of top-level await promise in each chunk module
			promiseImportName: (i) => `__tla_${i}`,
		}),
	],
	build: {
        outDir,
        emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(root, "index.html"),
				marcuscoin: resolve(root, "marcus_coin", "index.html"),
				marcusinfo: resolve(root, "marcus_info", "index.html"),
				abdurinfo: resolve(root, "abdur_info", "index.html"),
				abdurcoin: resolve(root, "abdur_coin", "index.html"),
				chopmarksinfo: resolve(root, "chopmarks_info", "index.html"),
				chopmarkscoin: resolve(root, "chopmarks_coin", "index.html"),
			},
		},
	},
})

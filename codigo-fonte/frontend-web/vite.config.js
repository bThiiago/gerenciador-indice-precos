import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    server: {
      https: false,
      cors: true,
    },
    publicDir: "./public",
    build: {
      outDir: "./build",
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: {
          main: "./index.html",
        },
        external: ["src/index.jsx"],
      },
      
    },
  };
});

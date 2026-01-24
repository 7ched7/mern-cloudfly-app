import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv} from "vite"

export default ({ mode }: { mode: string }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.BACKEND_URL ? process.env.BACKEND_URL : process.env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  })
}
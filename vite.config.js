import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://pnrc.onrender.com/",
        changeOrigin: true, // <-- important to avoid CORS issues
        secure: true,
      },
    },
  },
  plugins: [react()],
});

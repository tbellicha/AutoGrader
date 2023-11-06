import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { pluginoptions } from '@mightymeld/runtime';

const conditionalPlugins = [];

if (process.env.MIGHTYMELD) {
  conditionalPlugins.push(['@mightymeld/runtime/swc-plugin-mightymeld', pluginoptions()]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [...conditionalPlugins]
    })
  ]
});

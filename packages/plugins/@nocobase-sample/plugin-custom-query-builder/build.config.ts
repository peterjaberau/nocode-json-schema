import { defineConfig } from '@nocobase/build';

export default defineConfig({
  modifyViteConfig: (config) => {
    // Vite is used for packaging the `src/client` side code

    // Modify the Vite configuration. For details, refer to: https://vitejs.dev/guide/
    return config;
  },
  modifyTsupConfig: (config) => {
    // Tsup is used for packaging the `src/server` side code

    // Modify the Tsup configuration. For details, refer to: https://tsup.egoist.dev/#using-custom-configuration
    return config;
  },
  beforeBuild: (log) => {
    // Callback function before the build starts. You can perform some actions before the build.
  },
  afterBuild: (log) => {
    // Callback function after the build is completed. You can perform some actions after the build.
  }
});

import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  input: {
    // Jalur file OpenAPI YAML/JSON backend kita
    path: "./openapi/openapi.yaml",
  },
  output: {
    path: "./src/gen",
    clean: true,
  },
  plugins: [
    pluginOas({}),
    pluginTs({
      output: {
        path: "./types",
      },
    }),
    pluginClient({
      output: {
        path: "./clients",
      },
      // Mengarahkan seluruh HTTP call ke instance client kustom (reverse proxy safe)
      importPath: "@/lib/api-client",
      dataReturnType: "data",
      paramsType: "object",
      pathParamsType: "object",
    }),
    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      client: {
        importPath: "@/lib/api-client",
        dataReturnType: "data",
      },
      paramsType: "object",
      pathParamsType: "object",
      suspense: {},
    }),
  ],
});

import type { Config } from "tailwindcss";
import sharedConfig from "@monorepo/tailwind-config";

const config: Pick<Config, "content" | "presets" | "theme"> = {
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx", "../../packages/ui/**/*.tsx"],
  presets: [sharedConfig]
};

export default config;

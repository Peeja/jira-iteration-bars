declare module "rollup-plugin-userscript" {
  import type { Plugin } from "rollup";
  export default function userscript(
    metafile: string,
    transform?: (meta: string) => string,
  ): Plugin;
}

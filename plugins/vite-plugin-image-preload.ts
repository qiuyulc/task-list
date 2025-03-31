import { ResolvedConfig, IndexHtmlTransformContext } from "vite";
export default function vitePluginImagePreload(options: { data: string[] }) {
  const { data } = options;
  let base = "";
  return {
    name: "vite-plugin-image-preload",
    configResolved(config: ResolvedConfig) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post" as const,
      async handler(html: string, ctx: IndexHtmlTransformContext) {
        const tags = [];
        if (ctx.bundle) {
          const bundles = Object.keys(ctx.bundle);
          for (const bundle of bundles) {
            if (bundle.includes("assets/images")) {
              const { name } = ctx.bundle[bundle];
              if (data.includes(name as string)) {
                tags.push({
                  tag: "link",
                  attrs: {
                    rel: "preload",
                    href: base + bundle,
                    as: "image",
                  },
                  injectTo: "head" as const,
                });
              }
            }
          }
        }
        return {
          html: html,
          tags: tags,
        };
      },
    },
  };
}

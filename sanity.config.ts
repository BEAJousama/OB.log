import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { codeInput } from "@sanity/code-input"
import { schemaTypes } from "./sanity/schemas"
import { ImportMarkdownAction } from "./sanity/actions/import-markdown"
import { deployTool } from "./sanity/tools/deploy"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET

if (!projectId) {
  throw new Error(
    "Missing Sanity projectId. Set NEXT_PUBLIC_SANITY_PROJECT_ID (recommended) or SANITY_PROJECT_ID in your environment."
  )
}

if (!dataset) {
  throw new Error(
    "Missing Sanity dataset. Set NEXT_PUBLIC_SANITY_DATASET (recommended) or SANITY_DATASET in your environment."
  )
}

export default defineConfig({
  name: "obeaj-blog",
  title: "OB.log Studio",

  projectId,
  dataset,

  tools: (prev) => [...prev, deployTool()],

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Blog content")
          .items([
            S.documentTypeListItem("post").title("Blog Posts"),
            S.documentTypeListItem("tutorial").title("Tutorials"),
            S.divider(),
            S.documentTypeListItem("category").title("Categories"),
            S.documentTypeListItem("technology").title("Technologies"),
            S.divider(),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, ctx) =>
      ctx.schemaType === "post" ? [ImportMarkdownAction, ...prev] : prev,
  },
})

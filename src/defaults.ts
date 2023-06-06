import { allChildren } from "./index.js";

import type { HandlerMap } from "./types.js";

export const defaultHandlers: HandlerMap = {
  root: (node) => {
    return allChildren(node, {
      separator: "\n\n",
    });
  },
  paragraph: (node) => {
    return allChildren(node);
  },
  text: (node) => {
    return node.value;
  },
  emphasis: (node) => {
    return allChildren(node, {
      before: "[i]",
      after: "[/i]",
    });
  },
  strong: (node) => {
    return allChildren(node, {
      before: "[b]",
      after: "[/b]",
    });
  },
  link: (node) => {
    return allChildren(node, {
      before: `[url=${node.url}]`,
      after: "[/url]",
    });
  },
  image: (node) => {
    return `[img]${node.url}[/img]`;
  },
  blockquote: (node) => {
    return allChildren(node, {
      before: "[quote]",
      after: "[/quote]",
    });
  },
  list: (node) => {
    return allChildren(node, {
      before: `[${node.ordered ? "list=1" : "list"}]\n`,
      after: `\n[/list]`,
      separator: "\n",
    });
  },
  listItem: (node) => {
    return allChildren(node, {
      before: "[*]",
    });
  },
  thematicBreak: () => {
    return "[hr]";
  },
  code: (node) => {
    return `[pre]\n${node.value}\n[/pre]`;
  },
};

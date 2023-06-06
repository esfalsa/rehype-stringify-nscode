import type { Plugin } from "unified";
import type { Content, Root } from "mdast";

const plugin: Plugin = function remarkStringifyNSCode() {
  Object.assign(this, { Compiler: one });
};

export default plugin;

/**
 * Serialize a node into a NSCode string.
 *
 * @param node The node to serialize.
 * @returns Serialized node.
 */
const one = (node: Content | Root): string => {
  switch (node.type) {
    case "root":
      return allChildren(node, {
        separator: "\n\n",
      });
    case "paragraph":
      return allChildren(node);
    case "text":
      return node.value;
    case "emphasis":
      return allChildren(node, {
        before: "[i]",
        after: "[/i]",
      });
    case "strong":
      return allChildren(node, {
        before: "[b]",
        after: "[/b]",
      });
    case "link":
      return allChildren(node, {
        before: `[url=${node.url}]`,
        after: `[/url]`,
      });
    case "image":
      return `[img]${node.url}[/img]`;
    case "blockquote":
      return allChildren(node, {
        before: "[quote]",
        after: "[/quote]",
      });
    case "list":
      return allChildren(node, {
        before: `[${node.ordered ? "list=1" : "list"}]\n`,
        after: `\n[/list]`,
        separator: "\n",
      });
    case "listItem":
      return allChildren(node, {
        before: "[*]",
      });
    case "thematicBreak":
      return "[hr]";
    case "code":
      return `[pre]\n${node.value}\n[/pre]`;
    default:
      console.warn(`Unhandled node type: ${node.type}`);
      if ("value" in node) {
        return node.value;
      } else if ("children" in node) {
        return allChildren(node);
      } else {
        return "";
      }
  }
};

/**
 * Serialize a list of nodes into a NSCode string.
 *
 * @param nodes The list of nodes to serialize.
 * @param options The options to serialize the nodes with.
 * @returns Serialized nodes.
 */
function all(nodes: Array<Content | Root>, options: SerializationOptions = {}) {
  const before = options.before || "";
  const after = options.after || "";
  const separator = options.separator || "";

  return before + nodes.map(one).join(separator) + after;
}

/**
 * Serialize all children of a node into a NSCode string.
 *
 * @param node The node whose children should be serialized.
 * @param options The options to serialize the children with.
 * @returns Serialized nodes.
 */
function allChildren(node: Content | Root, options: SerializationOptions = {}) {
  if (!("children" in node)) {
    return (options.before || "") + (options.after || "");
  }

  return all(node.children, options);
}

/**
 * Options for serializing a list of nodes.
 */
type SerializationOptions = {
  /**
   * The string to insert before the first node.
   *
   * @defaultValue `""`
   */
  before?: string;

  /**
   * The string to insert after the last node.
   *
   * @defaultValue `""`
   */
  after?: string;

  /**
   * The string to insert between nodes.
   *
   * @defaultValue `""`
   */
  separator?: string;
};

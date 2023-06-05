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
      return all(node.children, "\n\n");
    case "paragraph":
      return all(node.children);
    case "text":
      return node.value;
    case "emphasis":
      return `[i]${all(node.children)}[/i]`;
    case "strong":
      return `[b]${all(node.children)}[/b]`;
    // case "heading":
    //   return `[h${node.depth}]${all(node.children)}[/h${node.depth}]`;
    case "link":
      return `[url=${node.url}]${all(node.children)}[/url]`;
    case "image":
      return `[img]${node.url}[/img]`;
    case "blockquote":
      return `[quote]${all(node.children)}[/quote]`;
    case "list":
      return `[${node.ordered ? "list=1" : "list"}]\n${all(
        node.children,
        "\n"
      )}\n[/list]`;
    case "listItem":
      return `[*]${all(node.children)}`;
    case "thematicBreak":
      return `[hr]`;
    case "code":
      return `[pre]\n${node.value}\n[/pre]`;
    default:
      console.warn(`Unhandled node type: ${node.type}`);
      if ("value" in node) {
        return node.value;
      } else if ("children" in node) {
        return all(node.children);
      }
      return "";
  }
};

/**
 * Serialize a list of nodes into a NSCode string.
 *
 * @param nodes The list of nodes to serialize.
 * @param separator The separator between nodes.
 * @returns Serialized nodes.
 */
function all(nodes: Array<Content | Root>, separator = "") {
  return nodes.map((node) => one(node)).join(separator);
}

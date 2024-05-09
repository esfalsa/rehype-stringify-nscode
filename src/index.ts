import { defaultHandlers } from "./defaults.js";

import type { Plugin } from "unified";
import type { Root, RootContent } from "mdast";
import type { SerializationOptions, Options, HandlerMap } from "./types.js";

let handlers: HandlerMap = defaultHandlers;

const plugin: Plugin<[Options] | []> = function remarkStringifyNSCode(
  options: Options = {}
) {
  if ("handlers" in options) {
    handlers = { ...handlers, ...options.handlers };
  }

  Object.assign(this, { Compiler: one });
};

export default plugin;

/**
 * Serialize a node into a NSCode string.
 *
 * @param node The node to serialize.
 * @returns Serialized node.
 */
const one = (node: RootContent | Root): string => {
  const handler = handlers[node.type];

  if (!handler) {
    console.warn(`Unhandled node type: ${node.type}`);
    if ("value" in node) {
      return node.value;
    } else if ("children" in node) {
      return allChildren(node);
    }
    return "";
  }

  // @ts-expect-error The node won't match all possible nodes, just the one for the value of node.type.
  return handler(node);
};

/**
 * Serialize a list of nodes into a NSCode string.
 *
 * @param nodes The list of nodes to serialize.
 * @param options The options to serialize the nodes with.
 * @returns Serialized nodes.
 */
export function all(
  nodes: Array<RootContent | Root>,
  options: SerializationOptions = {}
) {
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
export function allChildren(
  node: RootContent | Root,
  options: SerializationOptions = {}
) {
  if (!("children" in node)) {
    return (options.before || "") + (options.after || "");
  }

  return all(node.children, options);
}

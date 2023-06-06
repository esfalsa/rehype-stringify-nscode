import type { Content, Root } from "mdast";

export type Options = {
  handlers?: HandlerMap;
};

export type HandlerMap = {
  [key in (Content | Root)["type"]]?: (
    node: Extract<Content | Root, { type: key }>
  ) => string;
};

/**
 * Options for serializing a list of nodes.
 */
export type SerializationOptions = {
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

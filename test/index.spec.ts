import { unified } from "unified";
import remarkParse from "remark-parse";
import { test, expect } from "vitest";
import remarkStringifyNSCode, { allChildren } from "../src/index.js";

test("commonmark", () => {
  const file = unified().use(remarkParse).use(remarkStringifyNSCode)
    .processSync(`
*Italic*

**Bold**

# Heading 1

## Heading 2

[Link](http://a.com)

![Image](http://url/a.png)

> Blockquote

* List
* List
* List

1. One
2. Two
3. Three

Horizontal rule:

---

\`Inline code\` with backticks	

\`\`\`
# code block
print '3 backticks or'
print 'indent 4 spaces'
\`\`\`
`);

  expect(file.value).toEqual(`[i]Italic[/i]

[b]Bold[/b]

Heading 1

Heading 2

[url=http://a.com]Link[/url]

[img]http://url/a.png[/img]

[quote]Blockquote[/quote]

[list]
[*]List
[*]List
[*]List
[/list]

[list=1]
[*]One
[*]Two
[*]Three
[/list]

Horizontal rule:

[hr]

Inline code with backticks

[pre]
# code block
print '3 backticks or'
print 'indent 4 spaces'
[/pre]`);
});

test("custom handlers", () => {
  const file = unified()
    .use(remarkParse)
    .use(remarkStringifyNSCode, {
      handlers: {
        emphasis: (node) =>
          allChildren(node, { before: "[b][i]", after: "[/i][/b]" }),
        heading: (node) =>
          allChildren(node, { before: "[b][size=200]", after: "[/size][/b]" }),
      },
    })
    .processSync("*emphasis*\n\n# Heading");

  expect(String(file)).toEqual(
    "[b][i]emphasis[/i][/b]\n\n[b][size=200]Heading[/size][/b]"
  );
});

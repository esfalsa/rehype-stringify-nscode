import { unified } from "unified";
import remarkParse from "remark-parse";
import { test, expect } from "vitest";
import remarkStringifyNSCode from "../dist/index.js";

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

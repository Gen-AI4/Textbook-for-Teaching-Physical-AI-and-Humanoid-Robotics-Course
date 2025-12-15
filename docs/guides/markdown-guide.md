---
sidebar_position: 7
title: 'Appendix A: Markdown Guide for Textbook Writing'
description: 'A comprehensive guide to using Markdown in the textbook'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Appendix A: Markdown Guide for Textbook Writing

## Overview

This appendix serves as a guide for authors creating content for this textbook using standard Markdown syntax. It demonstrates the various formatting options available and how they render in the Docusaurus-based textbook system.

The goal is to enable writers to focus on content creation without learning complex markup languages, as specified in the requirements for User Story 2.

## Learning Objectives

After reading this appendix, you will be able to:

- Use standard Markdown syntax for textbook content
- Apply formatting options appropriate for educational content
- Include code examples and mathematical concepts
- Structure content with proper headings and organization

## Basic Markdown Elements

### Headings

You can create headings using hash symbols:

```markdown
# Main Title (H1)
## Section (H2) 
### Subsection (H3)
#### Sub-subsection (H4)
```

### Text Formatting

- **Bold text** - Use double asterisks: `**bold text**`
- *Italic text* - Use single asterisks: `*italic text*`
- ***Bold and italic*** - Use triple asterisks: `***bold and italic***`
- `Inline code` - Use backticks: `` `inline code` ``

### Lists

Unordered lists use asterisks, plus signs, or hyphens:

```markdown
* Item 1
* Item 2
  * Sub-item 2.1
  * Sub-item 2.2
```

* Item 1
* Item 2
  * Sub-item 2.1
  * Sub-item 2.2

Ordered lists use numbers followed by periods:

```markdown
1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
```

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2

### Links and Images

Create links using brackets and parentheses:

```markdown
[Visit Docusaurus website](https://docusaurus.io/)
```

[Visit Docusaurus website](https://docusaurus.io/)

Insert images using similar syntax with an exclamation mark:

```markdown
![Docusaurus Logo](/img/logo.svg)
```

### Blockquotes

Use > to create blockquotes:

```markdown
> This is a blockquote.
> It can span multiple lines.
```

> This is a blockquote.
> It can span multiple lines.

### Code Blocks

Use triple backticks for code blocks:

````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

Here's a Python example:

```python
def calculate_force(mass, acceleration):
    """
    Calculate force using Newton's second law: F = ma
    """
    return mass * acceleration

# Example usage
robot_mass = 50  # kg
gravity = 9.81   # m/s²
weight = calculate_force(robot_mass, gravity)
print(f"Robot weight: {weight} N")
```

## Mathematical Expressions

For mathematical expressions, use LaTeX syntax within dollar signs:

Inline math: $F = ma$ renders as $F = ma$

Block math uses the following syntax:
```latex
$$
\int_{-1}^{1} e^{-x^2} dx = \sqrt{\pi}
$$
```

## Advanced Docusaurus Features

### Admonitions

Docusaurus supports special blocks for notes, warnings, and tips:

```markdown
:::note
This is a note.
:::

:::tip
This is a useful tip.
:::

:::caution
This is a warning with `code` inside.
:::

:::danger
This is a danger warning.
:::
```

:::note
This is a note.
:::

:::tip
This is a useful tip.
:::

:::caution
This is a warning with `code` inside.
:::

:::danger
This is a danger warning.
:::

### Collapsible Sections

Use details/summary for collapsible content:

<details>
<summary>Click to expand solution</summary>

The solution to the problem is...

</details>

### Tabs

Docusaurus supports tabs for showing different approaches. Use the following syntax to create tabs:

````
```md
<MyTabs>
  <MyTabItem value="python" label="Python">
    ```python
    print("Hello, World!")
    ```
  </MyTabItem>
  <MyTabItem value="cpp" label="C++">
    ```cpp
    #include <iostream>
    int main() {
        std::cout << "Hello, World!";
        return 0;
    }
    ```
  </MyTabItem>
</MyTabs>
```
````

Here's how the actual syntax renders:

<Tabs>
  <TabItem value="python" label="Python">
    <p>Python code example</p>
  </TabItem>
  <TabItem value="cpp" label="C++">
    <p>C++ code example</p>
  </TabItem>
</Tabs>

## Summary

This appendix has demonstrated the standard Markdown elements that can be used when creating textbook content. By using these elements appropriately, writers can create rich, educational content that renders properly in the Docusaurus system.

The system supports all standard Markdown syntax along with additional features specific to Docusaurus that enhance the educational experience. Writers should focus on content while leveraging these formatting options to create effective learning materials.

## Exercises

1. Create a sample chapter about "Introduction to Control Theory" using various Markdown elements
2. Include at least one code block, one mathematical expression, and one admonition in your sample
3. Use both ordered and unordered lists in your sample content
4. Add a tabbed section showing the same concept in different programming languages

## Further Reading

- [Docusaurus Markdown Features](https://docusaurus.io/docs/markdown-features)
- [CommonMark Spec](https://spec.commonmark.org/)
- [LaTeX Mathematics](https://en.wikibooks.org/wiki/LaTeX/Mathematics)
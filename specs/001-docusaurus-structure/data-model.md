# Data Model: Docusaurus Structure

## Entities

### Textbook Module
- **Fields**:
  - id: string (unique identifier for the module)
  - title: string (display title of the module)
  - description: string (brief description of the module content)
  - order: number (sequence in which the module appears)
  - chapters: Chapter[] (list of chapters in the module)
  - metadata: object (additional information like author, last modified)

- **Relationships**:
  - Contains many Chapter entities
  - Linked from Navigation entities (sidebar)

### Chapter/Section
- **Fields**:
  - id: string (unique identifier for the chapter)
  - title: string (display title of the chapter)
  - content: string (Markdown content of the chapter)
  - module_id: string (reference to parent module)
  - order: number (sequence in which the chapter appears within the module)
  - previous_chapter_id: string (ID of previous chapter for navigation)
  - next_chapter_id: string (ID of next chapter for navigation)
  - metadata: object (additional information like author, last modified)

- **Relationships**:
  - Belongs to one Module entity
  - Linked to previous and next Chapter entities for sequential navigation

### Navigation Element
- **Fields**:
  - id: string (unique identifier for navigation element)
  - type: string (e.g., "link", "category", "dropdown")
  - label: string (display text for the navigation element)
  - href: string (URL for links, or reference to content for categories)
  - parent_id: string (reference to parent navigation element if nested)
  - order: number (position in navigation)
  - children: NavigationElement[] (sub-elements if it's a category/dropdown)

- **Relationships**:
  - Can contain many child NavigationElement entities
  - References Chapter/Module entities for content linking

### Configuration
- **Fields**:
  - site_title: string (title of the textbook site)
  - site_tagline: string (subtitle/tagline of the textbook)
  - theme: object (color scheme and styling options)
  - plugins: string[] (list of enabled Docusaurus plugins)
  - locales: string[] (supported languages for i18n)
  - auth_config: object (OAuth settings for institutional access)
  - accessibility_options: object (WCAG compliance settings)

- **Relationships**:
  - Applied globally to affect the entire textbook site
  - References other entities for site-wide behavior

## State Transitions

### Content Publication
- Draft → Review → Approved → Published → Archived
- Each state affects visibility and access to the textbook content

## Validation Rules

### Textbook Module
- Title must be unique within the textbook
- Order must be a positive integer
- Must contain at least one chapter

### Chapter/Section
- Title must be unique within the module
- Order must be a positive integer within the module
- previous_chapter_id and next_chapter_id must reference valid chapters
- Content must be valid Markdown

### Navigation Element
- Label must not be empty
- href must be a valid URL or internal reference
- Cannot have circular nesting relationships

### Configuration
- site_title must not be empty
- locales must be a valid list of language codes
- auth_config must be valid if OAuth is required
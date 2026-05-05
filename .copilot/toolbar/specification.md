# Toolbar — Keyboard Navigation (KBN) Enhancements: Functional Requirements

> **Spec status:** Draft  
> **Reference:** [W3C APG Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

---

## Priority Tiers

| Label | Meaning |
|-------|---------|
| ✅ Must Have | Required for the initial release |
| 💡 Nice to Have | Desirable but can be deferred |
| 🚫 Out of Scope | Explicitly excluded from this iteration |

---

## ✅ Must Have

### 1. Keyboard Interaction Logic

> Keyboard interactions must follow the **W3C APG Toolbar pattern**.  
> Navigation within the toolbar must **not** use the `Tab` key.

---

#### 1.1 Core Navigation Keys

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus **into** the toolbar (restoring the previously focused item, or the first item). Pressing `Tab` again **exits** the toolbar entirely. |
| `→` Right Arrow | Moves focus to the **next** enabled item. |
| `←` Left Arrow | Moves focus to the **previous** enabled item. |
| `Home` | Moves focus to the **first** enabled item. |
| `End` | Moves focus to the **last** enabled item. |

**Boundary behavior:** Focus stops at the edges — pressing `←` on the first item or `→` on the last item does **not** wrap around.

---

#### 1.2 Nested Widget Keyboard Behavior

Behavior when the focused toolbar item is itself an interactive widget:

| Widget Category | Examples | Enter Trigger | Navigation Inside | Exit |
|-----------------|----------|---------------|-------------------|------|
| **Simple** | Button, CheckBox | Not required | None | Not required |
| **Group** | ButtonGroup, RadioGroup | Automatic — `↑`/`↓` work immediately | `↑` / `↓` | `←` / `→` move to the next toolbar item |
| **Popup Widget** | MenuButton, DropDown, SelectBox | `Enter` / `Space` / `↓` | Follows the popup-specific pattern | `Esc` |
| **Text Input** | TextBox, Autocomplete | `Enter` or auto-focus | Standard input behavior | `Esc` — return to toolbar; `Tab` — exit toolbar |

---

#### 1.3 Mouse vs. Keyboard Synchronization

The **Roving Tabindex** anchor must follow the user's last interaction, regardless of input method:

- `tabindex="0"` always sits on the item that last received focus.
- When a user **clicks** a toolbar item with a mouse, that item becomes the new roving tabindex anchor.

---

#### 1.4 Interaction Within Templates

For toolbar items that use a **custom template** (e.g., a Search box):

| Key | Behavior |
|-----|----------|
| `←` / `→` Arrow | Moves focus to the **template container** (the toolbar item). |
| `Enter` / `Space` | **Enters** the template — focus moves to the first focusable element inside. |
| `Esc` | **Exits** the template — focus returns to the toolbar item container; arrow-key navigation resumes. |
| `Tab` (inside template) | Follows normal DOM tab order within the template. When the **last** focusable element inside is reached, `Tab` exits the toolbar entirely (next global tab stop). |

**Focus delegation rule when entering via arrow keys:**

- If the template root is **itself focusable** (e.g., a custom `<button>`), focus that root element.
- If the template root is a **container** (e.g., a `<div>`), the Toolbar must automatically delegate focus to the first focusable descendant (`<input>`, `<select>`, etc.).

---

#### 1.5 Edge Cases

##### 1.5.1 Disabled Items

Keyboard navigation must skip any item where `disabled: true`.  
A disabled item must never receive focus via `←` / `→` / `Home` / `End`.

##### 1.5.2 Dynamic Item Removal

If the item currently holding `tabindex="0"` is **removed** from the toolbar, the widget must automatically assign `tabindex="0"` to the next available (non-disabled) item.  
If no item remains, no item holds `tabindex="0"`.

---

#### 1.6 Overflow Menu

- The "More" button (overflow trigger) is treated as the **last item** in the toolbar's roving tabindex sequence.
- When the overflow menu is **open**, focus must move into the menu list.
- `Esc` closes the menu and returns focus to the "More" button, which becomes the roving anchor.

---

## 🚫 Out of Scope

- Full compliance with the ARIA Toolbar design pattern as defined in the W3C APG is **not** targeted for this iteration.

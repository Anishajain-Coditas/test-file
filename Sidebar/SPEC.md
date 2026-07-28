# Sidebar — Spec

> The contract between design and code for the Sidebar component.

## Purpose

The one vertical navigation panel every internal product consumes. It replaces the six bespoke sidebar implementations audited across CodiSoc, bento, Coditas LMS, Beacon, ORIO, and Lighthouse. **Products adapt to this component — this component does not fork per product.** Use Sidebar for a persistent left-rail navigation; not for mobile drawers (use SideNav) or page-level tabs (use Tab).

## Design principle

There is exactly **one structural variant axis: Expanded / Collapsed.** Every other difference between products — logo, subtitle, version, user profile, logout, switch account, badges, sections, nested items, dividers — is a **named boolean property or a data flag on `items`.** There is exactly one open slot (`logo`); every other customization must go through a named property. If a real product need doesn't fit an existing property, that is a signal to add a property to this component, never to fork it or add a second layout for one piece (e.g. a second footer shape, a per-product header).

## Composition (reuses existing DS components only)

| Piece | DS component |
|---|---|
| Numeric count / text pill / notification dot on a nav item | `Badge` (all three are `Badge` with different content — its `dot` mode covers the notification dot) |
| Version tag | `Badge` (neutral) — a static label, not `Chip` (which is an interactive filter/toggle elsewhere in the DS) |
| User avatar | `Avatar` |
| Logout / Switch account / Collapse trigger | `Button` (`iconOnly`, `variant="ghost"`, `size="sm"`) |
| Accessible label on icon-only actions | `Tooltip` (+ an explicit `aria-label`, since `Tooltip` doesn't wire `aria-describedby` to its trigger — a pre-existing gap in `Tooltip` itself) |
| Divider (nav item type, and above the footer) | spacing/border tokens — no dedicated `Divider` component exists in the DS yet; flagged as a gap, not faked |

No hand-rolled buttons or bespoke controls. `NavGroup` no longer exists — nesting is a property of `NavItem` (see below).

## Exports

| Export | Type | Description |
|---|---|---|
| `default` (`Sidebar`) | component | Full sidebar shell |
| `NavItem` | component | Single navigation entry — recursive; renders its own nested children when `expandable` |

## Sidebar Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `Item[]` | built-in default | See Item shape below |
| `width` | number | `240` | Expanded width in px |
| `collapsedWidth` | number | `72` | Width in px when `collapsed` |
| `height` | number | `640` | Sidebar height in px |
| `logo` | node | gradient Coditas mark | The only open slot — override the header logo |
| `showLogo` | boolean | `true` | Lets a text-only header exist without forking the component |
| `appName` | string | `'App'` | Always shown — no audited product omits it |
| `showSubtitle` / `subtitle` | boolean / string | `false` / `null` | Lighthouse-style caption line under the app name |
| `showVersion` / `version` | boolean / string | `false` / `null` | Beacon-style version tag |
| `showUserProfile` / `user` | boolean / `User \| null` | `false` / `null` | Identity block — optional (Beacon has none) |
| `showLogout` / `onLogout` | boolean / function | `false` / — | First-class action — replaces every ad hoc logout presentation |
| `showSwitchAccount` / `onSwitchAccount` | boolean / function | `false` / — | First-class action — replaces every ad hoc account-switch presentation |
| `showDivider` | boolean | `true` | Token-based rule between nav and footer, when a footer renders |
| `collapsible` | boolean | `false` | Whether the in-component collapse/expand trigger renders |
| `collapsed` / `defaultCollapsed` / `onCollapsedChange` | boolean / boolean / function | uncontrolled, `false` | Drives the Expanded/Collapsed variant; controlled or uncontrolled |
| `activeIndex` / `onSelect` | number / function | — | Controlled active index over **top-level** items |
| `className` | string | `''` | Extra class on the `<aside>` element |

`showLogout` and `showSwitchAccount` are independent — a product needing both isn't forced to choose one.

### Item shape

```js
{
  icon:        PhosphorIconComponent, // optional — omit for text-only nav (bento)
  label:       string,                // required
  type:        'section' | 'divider', // 'section': uppercase header row. 'divider': token-based rule.
                                       // Both are data-driven, not global booleans — a sidebar can mix
                                       // sectioned and non-sectioned items, so a single on/off doesn't fit.
  badgeCount:  number | null,
  pill:        string | null,
  dot:         boolean,
  disabled:    boolean,
  expandable:  boolean,               // renders nested children inline
  items:       Item[],                // nested items — full Item objects, not bare strings.
                                       // A nested item may itself be expandable (recursive).
  defaultOpen: boolean,                // initial open state when expandable
}
```

### User shape

```js
{
  name:      string,
  role:      string,   // plain-text role — always text, never a chip/tag
  initials:  string,   // e.g. 'AG'
  avatarSrc: string,   // optional image; falls back to initials
  online:    boolean,  // shows green status dot on the avatar
}
```

## NavItem Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | PhosphorIconComponent | — | Icon at 18px; fill weight when active |
| `label` | string | — | Nav label |
| `badgeCount` | number \| null | `null` | Numeric count |
| `pill` | string \| null | `null` | Text label badge (e.g. "New") |
| `dot` | boolean | `false` | Notification dot, no number |
| `active` | boolean | `false` | Current item — highlighted + left indicator bar. (Treated as the same concept as "Selected" — no audited product distinguishes the two; revisit if a real case needs both.) |
| `hovered` / `focused` | boolean | `false` | Force visual state (docs/handoff only) |
| `disabled` | boolean | `false` | Mutes item and blocks interaction |
| `expandable` / `items` / `defaultOpen` | boolean / `Item[]` / boolean | `false` / `[]` / `false` | Nested children — **replaces the separate `NavGroup` component entirely** |
| `collapsed` | boolean | `false` | Propagated from `Sidebar`; icon-only, label moves into a `Tooltip` |
| `nested` | boolean | `false` | Set automatically when rendered as another item's child — reduced visual weight, extra indent |
| `onClick` | function | — | Called on click, Enter, or Space (toggles open/closed instead, when `expandable`) |

## Variants

| Variant | Config | Rationale |
|---|---|---|
| Expanded | `collapsed={false}` (default) | Full width, labels visible |
| Collapsed | `collapsed={true}` | Icon-only rail, labels replaced by `Tooltip`, footer shows avatar + icon actions only |

Nested navigation (`expandable`/`items`) is **not** a variant — it doesn't change the Sidebar's own structure, only an individual item's. Everything else in this spec is a property or a data flag, not a variant.

## States (NavItem)

| State | Visual |
|---|---|
| Default | transparent bg, secondary icon, body text |
| Hovered | 6% purple-700 bg, purple icon + text |
| Active / open (expandable) | 12% purple-700 bg, purple icon + text, 3px left bar (leaf items only), fill icon weight |
| Focused | 2px purple-700 outline, offset 2px |
| Disabled | 50% opacity, not-allowed cursor |

## Status

`Draft` — API may change. Do not consume from product code; use within the docs site only.

---

## Figma source

- **Library file:** `PLwUAPGv4DXuIjzcqrJDvp` (Coditas Component Library — constant)
- **Component node:** `TODO` — no Figma component authored yet; paste the node ID once one exists.

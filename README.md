# Sidebar

Cloned from the Coditas Design System (`packages/ui/src/components/Sidebar/`) as of 2026-07-28.

## Peer dependencies

These files are copied as-is and are **not standalone** — `Sidebar.jsx` imports:

- `react` (`useState`)
- `@phosphor-icons/react` (`CaretDown`, `SidebarSimple`, `SignOut`, `UserSwitch`)
- Sibling DS components: `../Avatar`, `../Badge`, `../Button`, `../Tooltip` (not included in this repo)

`Sidebar.module.css` references Coditas DS design tokens (e.g. `--semantic-color-*`, `--color-purple-700`, `--dimension-space-*`) which must be defined by whatever token stylesheet this is dropped into.

To actually run this component, you'll need the `Avatar`, `Badge`, `Button`, and `Tooltip` components plus the DS token CSS alongside it.

See `Sidebar/SPEC.md` for the full component API.

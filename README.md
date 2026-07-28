# Sidebar

Cloned from the Coditas Design System (`packages/ui/src/components/Sidebar/`) as of 2026-07-28.

## Peer dependencies

These files are copied as-is and are **not standalone** — `Sidebar.jsx` imports:

- `react` (`useState`)
- `@phosphor-icons/react` (`CaretDown`, `SidebarSimple`, `SignOut`, `UserSwitch`)
- Sibling DS components (not included in this repo) — download each from the source repo:
  - `../Avatar` → https://github.com/coditas-llp/coditas-ds/tree/main/packages/ui/src/components/Avatar
  - `../Badge` → https://github.com/coditas-llp/coditas-ds/tree/main/packages/ui/src/components/Badge
  - `../Button` → https://github.com/coditas-llp/coditas-ds/tree/main/packages/ui/src/components/Button
  - `../Tooltip` → https://github.com/coditas-llp/coditas-ds/tree/main/packages/ui/src/components/Tooltip

`Sidebar.module.css` references Coditas DS design tokens (e.g. `--semantic-color-*`, `--color-purple-700`, `--dimension-space-*`) which must be defined by whatever token stylesheet this is dropped into — see https://github.com/coditas-llp/coditas-ds/tree/main/packages/ui/src/tokens (`tokens.css`).

To actually run this component, place the four sibling folders above alongside `Sidebar/` (so `../Avatar`, `../Badge`, `../Button`, `../Tooltip` resolve) and include the DS token CSS.

See `Sidebar/SPEC.md` for the full component API.

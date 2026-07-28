import { useState } from 'react'
import { CaretDown, SidebarSimple, SignOut, UserSwitch } from '@phosphor-icons/react'
import Avatar from '../Avatar'
import Badge from '../Badge'
import Button from '../Button'
import Tooltip from '../Tooltip'
import styles from './Sidebar.module.css'

function DefaultLogo({ size = 32 }) {
  const id = `sidebar-logo-g-${size}`
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9900E6" />
          <stop offset="100%" stopColor="#11CAE6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`} />
      <path
        d="M22 16c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      <circle cx="22" cy="10" r="2.5" fill="white" />
    </svg>
  )
}

/**
 * NavItem — a single navigation entry. Recursive: an item with `expandable`
 * and `items` renders its own children inline, so nesting is a property of
 * the item, not a second component (there is no separate "NavGroup").
 */
export function NavItem({
  icon: Icon,
  label,
  badgeCount = null,
  pill = null,
  dot = false,
  active = false,
  hovered = false,
  focused = false,
  disabled = false,
  expandable = false,
  items = [],
  defaultOpen = false,
  collapsed = false,
  nested = false,
  onClick,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const effectiveHover = (hovered || isHovered) && !disabled

  const handleActivate = () => {
    if (disabled) return
    if (expandable) {
      if (!collapsed) setOpen((o) => !o)
      return
    }
    onClick?.()
  }

  const cls = [
    styles.navItem,
    active         ? styles.active   : '',
    effectiveHover ? styles.hovered  : '',
    focused        ? styles.focused  : '',
    disabled       ? styles.disabled : '',
    collapsed      ? styles.collapsed : '',
    nested         ? styles.nested   : '',
    expandable && open && !collapsed ? styles.groupOpen : '',
  ].filter(Boolean).join(' ')

  const row = (
    <div
      role={expandable ? 'button' : 'menuitem'}
      aria-expanded={expandable ? open : undefined}
      aria-current={!expandable && active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={handleActivate}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) handleActivate() }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cls}
    >
      {active && !collapsed && !expandable && <div className={styles.activeBar} />}

      {Icon && (
        <Icon
          size={18}
          weight={active ? 'fill' : 'regular'}
          className={styles.navIcon}
        />
      )}

      {!collapsed && <span className={styles.navLabel}>{label}</span>}

      {!collapsed && dot && <Badge dot variant={active ? 'default' : 'neutral'} />}
      {!collapsed && badgeCount != null && <Badge variant="default">{badgeCount}</Badge>}
      {!collapsed && pill && <Badge variant="default">{pill}</Badge>}

      {!collapsed && expandable && (
        <CaretDown
          size={14}
          className={[styles.caret, open ? styles.caretOpen : ''].filter(Boolean).join(' ')}
        />
      )}
    </div>
  )

  return (
    <div className={styles.navItemWrap}>
      {collapsed ? <Tooltip content={label} placement="right">{row}</Tooltip> : row}

      {expandable && open && !collapsed && (
        <div className={styles.subItems} role="group">
          {items.map((child, i) => (
            <NavItem key={child.label ?? i} {...child} nested collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  )
}

const DEFAULT_ITEMS = [
  { icon: null, label: 'Home' },
  { icon: null, label: 'Documents' },
  { icon: null, label: 'Analytics' },
  { icon: null, label: 'Users' },
  { icon: null, label: 'Settings' },
]

/**
 * Sidebar — the one vertical navigation panel every internal product consumes.
 *
 * There is exactly one structural axis: Expanded / Collapsed (`collapsed`).
 * Everything else — logo, subtitle, version, user profile, logout, switch
 * account, dividers, badges, sections, nested items — is a named boolean
 * property or a data flag, never a second layout. Products adapt to this
 * component; this component does not fork per product.
 */
export default function Sidebar({
  items = DEFAULT_ITEMS,
  width = 240,
  collapsedWidth = 72,
  height = 640,

  logo,
  showLogo = true,
  appName = 'App',

  showSubtitle = false,
  subtitle = null,

  showVersion = false,
  version = null,

  showUserProfile = false,
  user = null,

  showLogout = false,
  onLogout,

  showSwitchAccount = false,
  onSwitchAccount,

  showDivider = true,

  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,

  activeIndex,
  onSelect,
  className = '',
}) {
  const [internalIdx, setInternalIdx] = useState(0)
  const activeIdx = activeIndex !== undefined ? activeIndex : internalIdx
  const handleSelect = (idx) => {
    if (activeIndex === undefined) setInternalIdx(idx)
    onSelect?.(idx)
  }

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed
  const toggleCollapsed = () => {
    const next = !collapsed
    if (collapsedProp === undefined) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  const hasFooter = showUserProfile || showLogout || showSwitchAccount
  const effectiveWidth = collapsed ? collapsedWidth : width

  return (
    <aside
      aria-label="Main navigation"
      className={[styles.sidebar, collapsed ? styles.collapsedRoot : '', className].filter(Boolean).join(' ')}
      style={{ width: effectiveWidth, height }}
    >
      <div className={styles.header}>
        {showLogo && (logo ?? <DefaultLogo size={32} />)}

        {!collapsed && (
          <div className={styles.brandText}>
            <div className={styles.brandRow}>
              <span className={styles.appName}>{appName}</span>
              {showVersion && version && <Badge variant="neutral">{version}</Badge>}
            </div>
            {showSubtitle && subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
        )}

        {collapsible && (
          <Tooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement={collapsed ? 'right' : 'bottom'}>
            <Button
              iconOnly
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className={styles.collapseTrigger}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <SidebarSimple size={16} weight={collapsed ? 'fill' : 'regular'} />
            </Button>
          </Tooltip>
        )}
      </div>

      <nav className={styles.nav} role="menu" aria-label={appName}>
        {items.map((item, idx) => {
          if (item.type === 'section') {
            return collapsed ? null : (
              <div key={`section-${item.label}`} className={styles.sectionLabel}>
                {item.label}
              </div>
            )
          }
          if (item.type === 'divider') {
            return <div key={`divider-${idx}`} className={styles.navDivider} role="separator" />
          }
          return (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              badgeCount={item.badgeCount ?? null}
              pill={item.pill ?? null}
              dot={item.dot ?? false}
              disabled={item.disabled}
              expandable={item.expandable ?? false}
              items={item.items ?? []}
              defaultOpen={item.defaultOpen}
              active={activeIdx === idx}
              collapsed={collapsed}
              onClick={() => !item.disabled && handleSelect(idx)}
            />
          )
        })}
      </nav>

      {showDivider && hasFooter && <div className={styles.divider} />}

      {hasFooter && (
        <div className={[styles.footer, collapsed ? styles.footerCollapsed : ''].filter(Boolean).join(' ')}>
          {showUserProfile && user && (
            collapsed ? (
              <Tooltip content={user.role ? `${user.name} · ${user.role}` : user.name} placement="right">
                <div className={styles.avatarWrap}>
                  <Avatar size="sm" initials={user.initials} src={user.avatarSrc} alt={user.name} />
                  {user.online && <span className={styles.onlineDot} />}
                </div>
              </Tooltip>
            ) : (
              <div className={styles.userRow}>
                <div className={styles.avatarWrap}>
                  <Avatar size="sm" initials={user.initials} src={user.avatarSrc} alt={user.name} />
                  {user.online && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  {user.role && <span className={styles.userRole}>{user.role}</span>}
                </div>
              </div>
            )
          )}

          {(showSwitchAccount || showLogout) && (
            <div className={styles.footerActions}>
              {showSwitchAccount && (
                <Tooltip content="Switch account" placement={collapsed ? 'right' : 'top'}>
                  <Button
                    iconOnly variant="ghost" size="sm" onClick={onSwitchAccount}
                    aria-label="Switch account"
                  >
                    <UserSwitch size={16} />
                  </Button>
                </Tooltip>
              )}
              {showLogout && (
                <Tooltip content="Logout" placement={collapsed ? 'right' : 'top'}>
                  <Button
                    iconOnly variant="ghost" size="sm" onClick={onLogout}
                    aria-label="Logout"
                  >
                    <SignOut size={16} />
                  </Button>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

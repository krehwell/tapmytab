/**
 * JS mirror of the color tokens defined in `index.css` (`:root`).
 * CSS is the single source of truth — only add a key here when a color is
 * needed in JS/`sx`. CSS-only tokens (link, highlight, scrollbar, selection…)
 * stay in index.css.
 */
export const tc = {
    // surfaces
    surfaceOverlay: 'var(--surface-overlay)',
    surfaceMuted: 'var(--surface-muted)',
    surfaceRaised: 'var(--surface-raised)',
    surfaceInput: 'var(--surface-input)',
    surfaceBase: 'var(--surface-base)',
    surfaceStrong: 'var(--surface-strong)',
    // borders
    borderMuted: 'var(--border-muted)',
    // text
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textMuted: 'var(--text-muted)',
    textDisabledPrimary: 'var(--text-disabled-primary)',
    textDisabledSecondary: 'var(--text-disabled-secondary)',
    // interactive / state
    accent: 'var(--accent)',
    danger: 'var(--danger)',
    // card labels
    labelRed: 'var(--label-red)',
    labelGreen: 'var(--label-green)',
    labelBlue: 'var(--label-blue)',
    labelOrange: 'var(--label-orange)',
    // effects
    overlayHover: 'var(--overlay-hover)',
    overlayActive: 'var(--overlay-active)',
    shadowPopover: 'var(--shadow-popover)',
}

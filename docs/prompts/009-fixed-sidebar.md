# Prompt 009 - Fixed Sidebar

**Date**: 2026-04-09

---

The sidebar is scrolling along with the page content. Fix it to stay fixed on the left side, occupying the full viewport height.

The sidebar should use position fixed (or sticky), height 100vh (or h-screen in Tailwind), top 0, left 0, with overflow-y auto only on the sidebar itself in case the menu becomes taller than the screen.

The main content beside it should have margin-left or padding-left equal to the sidebar width so it doesn't render underneath it.

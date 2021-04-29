import { LocalStorage, SessionStorage } from 'quasar'

export function SET_DARK (state, { dark }) {
  // localStorage['tabler-dark-mode'] = dark
  LocalStorage.set('tabler-dark-mode', dark)
  state.dark = dark
}

export function SET_MODE (state, { mode }) {
  // localStorage['tabler-mode'] = mode
  LocalStorage.set('tabler-mode', mode)
  state.mode = mode
}

export function SET_FLUID (state, { fluid }) {
  // localStorage['tabler-fluid'] = fluid
  LocalStorage.set('tabler-fluid', fluid)
  state.fluid = fluid
}

export function SET_STICKY (state, { sticky }) {
  // localStorage['tabler-fluid'] = fluid
  LocalStorage.set('tabler-sticky', sticky)
  state.sticky = sticky
}

export function SET_VERTICAL_LAYOUT (state, { VerticalLayout }) {
  // localStorage['tabler-vertical'] = VerticalLayout
  LocalStorage.set('tabler-vertical', VerticalLayout)
  state.VerticalLayout = VerticalLayout
}

export function SET_HORIZONTAL_LAYOUT (state, { HorizontalLayout }) {
  // localStorage['tabler-horizontal'] = HorizontalLayout
  LocalStorage.set('tabler-horizontal', HorizontalLayout)
  state.HorizontalLayout = HorizontalLayout
}
// export function SET_MENU_AUTO_EXPAND (state, { menuAutoExpand }) {
//   localStorage['tabler-menu-auto-expand'] = menuAutoExpand
//   state.menuAutoExpand = menuAutoExpand
// }
// export function SET_MENU_MINI (state, { menuMini }) {
//   localStorage['tabler-menu-mini'] = menuMini
//   state.menuMini = menuMini
// }
export function SET_DASHBOARD_COLOR_SCHEME (state, { dashboardColorScheme }) {
  // localStorage['tabler-dashboard-color-scheme'] = dashboardColorScheme
  LocalStorage.set('tabler-dashboard-color-scheme', dashboardColorScheme)
  state.dashboardColorScheme = dashboardColorScheme
}

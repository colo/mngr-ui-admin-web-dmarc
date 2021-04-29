
export function setDark ({ commit }, { dark }) {
  commit('SET_DARK', { dark: dark })
}
export function setMode ({ commit }, { mode }) {
  commit('SET_MODE', { mode: mode })
}
export function setFluid ({ commit }, { fluid }) {
  commit('SET_FLUID', { fluid: fluid })
}

export function setSticky ({ commit }, { sticky }) {
  commit('SET_STICKY', { sticky: sticky })
}

export function setVerticalLayout ({ commit }, { VerticalLayout }) {
  commit('SET_VERTICAL_LAYOUT', { VerticalLayout: VerticalLayout })
}

export function setHorizontalLayout ({ commit }, { HorizontalLayout }) {
  commit('SET_HORIZONTAL_LAYOUT', { HorizontalLayout: HorizontalLayout })
}
// export function setMenuAutoExpand ({ commit }, { menuAutoExpand }) {
//   commit('SET_MENU_AUTO_EXPAND', { menuAutoExpand: menuAutoExpand })
// }
// export function setMenuMini ({ commit }, { menuMini }) {
//   commit('SET_MENU_MINI', { menuMini: menuMini })
// }
export function setDashboardColorScheme ({ commit }, { dashboardColorScheme }) {
  commit('SET_DASHBOARD_COLOR_SCHEME', { dashboardColorScheme: dashboardColorScheme })
}

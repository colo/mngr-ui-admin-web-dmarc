import { LocalStorage, SessionStorage } from 'quasar'

const navBarList = [
  {
    label: 'Home',
    to: {name: 'index'},
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"/><polyline points="5 12 3 12 12 3 21 12 19 12" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>',
  },
  {
    label: 'Hosts',
    to: {name: 'hosts'},
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><rect x="3" y="4" width="18" height="8" rx="3"></rect><rect x="3" y="12" width="18" height="8" rx="3"></rect><line x1="7" y1="8" x2="7" y2="8.01"></line><line x1="7" y1="16" x2="7" y2="16.01"></line></svg>',
  },
  {
    label: 'System',
    to: {name: 'system'},
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h4l3 8l4 -16l3 8h4" /></svg>',
  },
  {
    label: 'Logs',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"></path><line x1="8" y1="8" x2="12" y2="8"></line><line x1="8" y1="12" x2="12" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>',
    // columns: 2,
    list: [
      {
        label: 'Summary',
        to: {name: 'logs'},
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"></path><line x1="8" y1="8" x2="12" y2="8"></line><line x1="8" y1="12" x2="12" y2="12"></line><line x1="8" y1="16" x2="12" y2="16"></line></svg>'
      },
      {
        label: 'Web',
        to: {name: 'logs_web'},
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path></svg>'
      },
    ]
  },

]
const vertical = {
  topbar: {
    available: true,
    combined: true,
    dark: false,
    background: '', // #7952b3
    grow: false,
  },
  navbar: {
    available: true,
    right: false,
    dark: true,
    background: '', // #8055b3
    list: navBarList
  },
  smallLogo: false,
  logo: true,
  search: true,
  alerts: true,
  user: false,
  settings: true
}

const horizontal = {
  topbar: {
    available: true,
    combined: false,
    dark: false,
    background: '', // #7952b3
    grow: false,
  },
  navbar: {
    available: true,
    // right: false,
    dark: false,
    background: '', // #8055b3
    list: navBarList
  },
  condensed: false,
  smallLogo: false,
  logo: true,
  search: true,
  alerts: true,
  user: false,
  settings: true
}

export default function () {
  return {
    dark: (LocalStorage.getItem('tabler-dark-mode') || false) === true,
    mode: LocalStorage.getItem('tabler-mode'), // || 'MainLayout'
    fluid: (LocalStorage.getItem('tabler-fluid') || false) === true,
    sticky: (LocalStorage.getItem('tabler-sticky') || false) === true,
    VerticalLayout: LocalStorage.getItem('tabler-vertical') || vertical,
    HorizontalLayout: LocalStorage.getItem('tabler-horizontal') || horizontal,
    // menuAutoExpand: (localStorage['tabler-menu-auto-expand'] || 'false') === 'true',
    // menuMini: (localStorage['tabler-menu-mini'] || 'false') === 'true',
    dashboardColorScheme: LocalStorage.getItem('tabler-dashboard-color-scheme') || 'Standard'
  }
}

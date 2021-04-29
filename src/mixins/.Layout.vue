<script>
import Vue from 'vue'

import { mapActions, mapState } from 'vuex'

import TopBar from 'components/tabler/layout/TopBar'

let mootools = require('mootools')
import DefaultConn from '@etc/default.http'
let http = Object.merge(Object.clone(DefaultConn), { path: DefaultConn.path + 'user' })

export default Vue.extend({
  name: 'MainLayout',
  components: {
    TopBar
  },
  data () {
    return {
      // httpServer: http
    }
  },
  props: {
    // topbar: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       available: true,
    //       combined: true,
    //       dark: false
    //     }
    //   }
    // },
    // navbar: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       available: true,
    //       right: false,
    //       dark: true
    //     }
    //   }
    // },
    // fluid: {
    //   type: Boolean,
    //   default: false
    // }
    // user: {
    //   type: [Boolean, Object],
    //   default: false
    // }
  },
  computed: {
    darkTopBar: function () {
      return this.dark || this.topbar.dark
    },
    darkNavBar: function () {
      return this.dark || this.navbar.dark
    },
    ...mapState({
      // menuAutoExpand: state => state.layout.menuAutoExpand
      dark: state => state.layout.dark,
      fluid: state => state.layout.fluid,
      sticky: state => state.layout.sticky,
      mode: state => state.layout.mode,
    }),
    topbarContainerStyle: function () {
      let appendStyle = {}

      if (this.topbar.background !== '') appendStyle.background = this.topbar.background

      return appendStyle
    },
    navbarContainerStyle: function () {
      let appendStyle = {}

      if (this.navbar.background !== '') appendStyle.background = this.navbar.background

      return appendStyle
    },
    user: function () {
      if (this.$store.state.user.data && this.$store.state.user.data.role) {
        return {
          name: this.$store.state.user.data.name + ' ' + this.$store.state.user.data.surname,
          title: this.$store.state.user.data.role,
          avatar: this.$store.state.user.data.avatar,
          // actions: this.$store.state.user.data.actions,
          actions: [{
            label: 'Sign out',
            to: { path: 'signout'}
          }]
        }
      }

      return this.$store.state.layout[this.mode].user
    },
    // dark: {
    //   get () {
    //     return this.$store.state.layout.dark
    //   },
    //   set (value) {
    //     this.setDark({ dark: value })
    //   }
    // }
  },
  methods: {
    ...mapActions({
      setMode: 'layout/setMode',
      loadUser: 'user/load'
    }),
    // https://forum.vuejs.org/t/how-do-i-add-remove-classes-to-body/1219/12
    toggleBodyClass: function (addRemoveClass, className) {
      const el = document.body

      if (addRemoveClass === 'addClass') {
        el.classList.add(className)
      } else {
        el.classList.remove(className)
      }
    },
    toggleBodyStyle: function (prop, value) {
      const el = document.body

      el.style[prop] = value
    }
  },
  watch: {
    dark: {
      handler: function (val) {
        // this.$q.dark.set(val)
        if (val === true) {
          this.toggleBodyClass('addClass', 'theme-dark')
        } else {
          this.toggleBodyClass('removeClass', 'theme-dark')
        }
      }
    }
  },
  mounted: function () {
    if (this.dark === true) {
      this.toggleBodyClass('addClass', 'theme-dark')
    } else {
      this.toggleBodyClass('removeClass', 'theme-dark')
    }
    this.toggleBodyClass('addClass', 'antialiased')
    this.toggleBodyStyle('display', 'block')
    // this.$q.dark.set(this.dark)

    this.loadUser(http.scheme + '://' + http.host + ':' + http.port + http.path)
  },
  beforeDestroy: function () {
    this.toggleBodyClass('removeClass', 'theme-dark')
    this.toggleBodyClass('removeClass', 'antialiased')
    // this.toggleBodyStyle('display', 'block')
    // this.$q.dark.set(this.dark)
  }
})
</script>

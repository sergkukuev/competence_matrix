<template>
  <v-navigation-drawer v-model="drawer"
    app
    fixed
    :clipped="nav_clipped"
    disable-resize-watcher
    disable-route-watcher
    class="background"
  >
    <v-list dense class="background">
      <template v-for="(item, i) in menu">
        <v-layout v-if="item.heading" :key="i" row align-center>
          <v-flex xs12>
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-flex>
        </v-layout>
        <v-list-tile v-else-if="item.user" :key="i" avatar>
          <v-list-tile-avatar>
            <v-icon large>{{ item.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              color="red"
              dark
              small
              @click="logout"
            >
              Выйти
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-else-if="item.divider" :key="i" dark class="my-3">
        </v-divider>
        <v-list-tile v-else :key="i" @click="redirect(item.link)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  props: ['checker'],
  data: () => ({
    drawer: false,
    menu: [
      { heading: 'Пользователь' },
      { text: 'Default User', icon: 'account_circle', user: true, link: '/account' },
      { heading: 'Основное' },
      { text: 'Матрица', icon: 'dashboard', link: '/matrix' },
      { divider: true },
      { heading: 'Списки' },
      { text: 'Направления', icon: 'list', link: '/works' },
      { text: 'Знания', icon: 'list', link: '/knowledges' }
    ]
  }),
  watch: {
    checker (value) {
      this.drawer = !this.drawer
      if (this.drawer) this.set_login()
    }
  },
  computed: {
    nav_clipped () {
      return this.$vuetify.breakpoint.lgAndUp
    }
  },
  methods: {
    redirect (link) {
      window.location = 'http://localhost:8080/#' + link
    },
    set_login () {
      let login = this.$cookie.get('login')
      if (!login) login = 'Default User'
      this.menu[1].text = login
    },
    logout () {
      // Очистка куки от параметров
      this.$cookie.delete('login')
      this.$cookie.delete('access_token')
      this.$emit('A-logout')
      window.location.reload() // Подумать над другим вариантом
    }
  },
  mounted: function () {
    this.set_login()
  }
}
</script>

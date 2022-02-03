<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      style="z-index: 10000"
    >
      <div class="d-flex align-center">
        <h1>Signalanzeige</h1>
        <p class="font-weight-thin">ALPHA</p>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center ">
        <h1 class="title font-weight-thin hidden-md-and-down"><v-icon>mdi-wrench</v-icon> Aktuell unfertig und in Bearbeitung</h1>
      </div>
      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
      <h3 class="font-weight-thin">von DO7LK</h3>
      <v-btn icon @click="drawer=true"><v-icon>mdi-cog</v-icon></v-btn>

    </v-app-bar>

    <v-navigation-drawer
            v-model="drawer"
            right
            style="z-index: 50000"
            absolute
            temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Einstellungen
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <div class="mx-4">
        <v-switch color="white" label="Turmbilder anzeigen" class="mt-5" v-model="showIcon"></v-switch>
        <v-switch color="white" label="Frequenzen anzeigen" class="ma-0" v-model="showFrequencies"></v-switch>
      </div>
    </v-navigation-drawer>

    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },
  computed: {
    showIcon: {
      get () {
        return this.$store.state.options.showIcon;
      },
      set (val) {
        this.$store.commit('setShowIcon', val);
      }
    },
    showFrequencies: {
      get () {
        return this.$store.state.options.showFrequencies;
      },
      set (val) {
        this.$store.commit('setShowFrequencies', val);
      }
    }
  },
  data: () => ({
    drawer: false
    //
  }),
};
</script>

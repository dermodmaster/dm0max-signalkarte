<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>DM0MAX - Signal</h1>
        <p class="font-weight-thin">ALPHA</p>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <h1 class="title font-weight-thin"><v-icon>mdi-wrench</v-icon> Aktuell unfertig und in Bearbeitung</h1>
      </div>

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

    </v-app-bar>

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

  data: () => ({
    //
  }),
};
</script>

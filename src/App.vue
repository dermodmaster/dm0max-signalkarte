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
      <h3 class="font-weight-thin">von DO7LK</h3>

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

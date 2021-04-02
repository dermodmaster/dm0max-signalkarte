import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css';
import {LMap, LTileLayer, LMarker, LCircleMarker, LTooltip} from 'vue2-leaflet';
import LControlFullscreen from 'vue2-leaflet-fullscreen';
import { Icon } from 'leaflet';
import VueSSE from 'vue-sse';
import VueNativeSock from 'vue-native-websocket'
import store from './store'
Vue.use(VueNativeSock, 'ws://44.149.84.7:8080', {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})

Vue.config.productionTip = false
Vue.use(VueSSE);

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-circle-marker', LCircleMarker);
Vue.component('l-control-fullscreen', LControlFullscreen);
Vue.component('l-tooltip', LTooltip);

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

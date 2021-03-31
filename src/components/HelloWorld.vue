<template>
    <v-content class="pt-0">
        <v-tabs
                background-color="deep-purple accent-4"
                center-active
                dark
                v-model="activeTab"
                v-if="!$vuetify.breakpoint.mdAndUp"
        >
            <v-tab>Karte</v-tab>
            <v-tab>Details</v-tab>
        </v-tabs>
        <v-row>
            <v-col v-if="showMap && ($vuetify.breakpoint.mdAndUp || activeTab === 0)" :cols="$vuetify.breakpoint.mdAndUp ? 7 : 12">
                <l-map
                        :zoom="zoom"
                        :center="center"
                        :style="'height: '+this.$vuetify.breakpoint.height+'px; width: 100%'"
                >
                    <l-tile-layer
                            :url="url"
                            :attribution="attribution"
                    />
                    <l-control-fullscreen position="topleft"
                                          :options="{ title: { 'false': 'Fullscreen', 'true': 'Exit' } }"
                    />
                    <div v-for="(repeater, repeaterIndex) in repeaters" v-bind:key="repeaterIndex">
                        <div v-for="(rx,rx_key) in repeater.rx" v-bind:key="rx_key">
                            <l-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, rx_key).location.lat, getAntennaForReceiver(repeater, rx_key).location.lon]"
                                    :icon="rx.name.substr(0,6) === 'Holsen' ? rxidledm0maxicon : rxidleicon">
                                <l-tooltip>{{repeater.callsign+" - "+rx.name}}</l-tooltip>
                            </l-marker>
                            <l-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, rx_key).location.lat, getAntennaForReceiver(repeater, rx_key).location.lon]"
                                    v-if="rx.info.sql === 'active'" :icon="rx.name.substr(0,6) === 'Holsen' ? rxlisteningdm0maxicon : rxlisteningicon">
                                <l-tooltip>{{repeater.callsign+" - "+rx.name}}</l-tooltip>
                            </l-marker>
                            <l-circle-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, rx_key).location.lat, getAntennaForReceiver(repeater, rx_key).location.lon]"
                                    :radius="rx.info.lvl*1.5"
                                    v-if="rx.info.sql === 'active'"
                                    fill-color="green"
                                    :weight="1"
                                    color="green"
                            />
                            <l-circle-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, rx_key).location.lat, getAntennaForReceiver(repeater, rx_key).location.lon]"
                                    :radius="150"
                                    v-if="rx.info.sql === 'active'"
                                    :fill-opacity="0"
                                    :weight="3"
                                    color="grey"
                            />
                        </div>
                        <div v-for="(tx,tx_key) in repeater.txlist" v-bind:key="tx_key">
                            <l-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, tx).location.lat, getAntennaForReceiver(repeater, tx).location.lon]"
                                    :icon="repeater.callsign.substr(0,6) === 'DM0MAX' ? txidledm0maxicon : txidleicon">
                                <l-tooltip>{{repeater.callsign+" - "+tx_key}}</l-tooltip>
                            </l-marker>
                            <l-marker
                                    :lat-lng="[getAntennaForReceiver(repeater, tx).location.lat, getAntennaForReceiver(repeater, tx).location.lon]"
                                    v-if="repeater.tx === '1'" :icon="repeater.callsign.substr(0,6) === 'DM0MAX' ? txactivedm0maxicon : txactiveicon">
                                <l-tooltip>{{repeater.callsign+" - "+tx_key}}</l-tooltip>
                            </l-marker>
                        </div>
                    </div>
                </l-map>
            </v-col>
            <v-col v-if="renderComponent && ($vuetify.breakpoint.mdAndUp || activeTab === 1)">
                <v-container>
                    <v-row>
                        <v-col v-for="(repeater, repeaterIndex) in repeaters" v-bind:key="repeaterIndex" :cols="$vuetify.breakpoint.mdAndUp ? 4 : 12">
                            <v-card :color="repeater.state === 'DISCONNECTED' ? 'red darken-4' : repeater.tx === '1' ? 'green darken-4' : ''">
                                <v-card-title>
                                    <div v-if="repeater.callsign.substr(0,6) === 'DM0MAX'">
                                        <img v-if="repeater.tx === '1'" src="@/assets/icons/sending-dm0max-green120.gif"
                                             style="max-height: 120px">
                                        <img v-else src="@/assets/icons/white-dm0max-000.png"
                                             style="max-height: 120px">
                                    </div>
                                    <div v-else>
                                        <img v-if="repeater.tx === '1'" src="@/assets/icons/sending-green120.gif"
                                             style="max-height: 120px">
                                        <img v-else src="@/assets/icons/station-off.png"
                                             style="max-height: 120px; filter: invert()">
                                    </div>
                                    <h3>{{repeater.callsign}}</h3>
                                    <h6 v-if="repeater.state !== 'CONNECTED'">{{repeater.state}}</h6>
                                </v-card-title>
                                    <div style="background-color: rgba(0,0,0,0.2);" class="pa-2">
                                    <h3 class="text-center mb-2">Empfänger</h3>
                                    <div v-for="(rx, rx_key) in repeater.rx" v-bind:key="rx_key">
                                        <center>{{rx.name}}</center>
                                        <v-progress-linear :value="rx.info.lvl"
                                                           :color="rx.info.sql === 'closed' ? 'red' : 'green'"
                                                           height="20">{{rx.info.lvl}}
                                        </v-progress-linear>

                                    </div>
                                    </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-content>
</template>

<script>
    import {latLng, icon} from "leaflet";

    export default {
        name: 'Map',
        created() {
            window.addEventListener("fullscreenchange", () => {
                this.fullscreen = !this.fullscreen;
            });
            window.addEventListener("resize", () => {
                setTimeout(() => {
                    if(!this.fullscreen) this.showMap = false;
                },200)
                setTimeout(() => {
                    this.showMap = true;
                },300)

            })
        },
        mounted() {
            this.$options.sockets.onmessage = (message) => {
                const data = JSON.parse(message.data);
                switch (data.type) {
                    case 'updateRepeaters':
                        this.repeaters = data.repeaters
                        this.repeaters.forEach(repeater => {
                            repeater.state = "CONNECTED";
                            for (let rx in repeater.rx) {
                                repeater.rx[rx].info = {lvl: -1, sql: "closed"};
                            }
                        })
                        break;
                    case 'repeaterMessage':
                        // eslint-disable-next-line no-case-declarations
                        const message = JSON.parse(data.message);
                        // eslint-disable-next-line no-case-declarations
                        const index = this.repeaters.findIndex(repeater => repeater.callsign === data.callsign);
                        if(message.event === "Logic:transmit"){
                            this.repeaters[index].tx = message.tx;
                        }else if (message.event === "Voter:sql_state") {
                            for (let att in message.rx) {
                                console.log("okay boomer",att, index, this.repeaters[index], message.rx[att])
                                console.log(this.repeaters[index].rx[att].info)
                                this.repeaters[index].rx[att].info = message.rx[att];

                            }
                        }
                        this.forceRerender()
                        break;
                    default:
                        console.error("Unknown message type " + data.type)
                        break;
                }
            }
            /*
            axios.get("https://signal.3ef.de/api/repeaters.json").then(r => {
                const data = r.data["info"];

                for (let repeaterAttribute in r.data["info"]) {
                    const jsonUrl = data[repeaterAttribute].uri.replace("http://do7sk1.ddns.net/", "https://signal.3ef.de/api/");
                    axios.get(jsonUrl).then(r => {
                        let repeater = r.data;
                        repeater.uri.signalEventStream = this.getProxyURL(repeater.uri.signalEventStream);
                        repeater.state = "CONNECTING";
                        this.$sse(repeater.uri.signalEventStream, {format: 'json'})
                            .then(sse => {
                                repeater.state = "CONNECTED";
                                repeater.sse = sse;
                                repeater.messages = [];
                                repeater.tx = "0";
                                for (let rx in repeater.rx) {
                                    repeater.rx[rx].info = {"lvl": -1, "sql": "closed"};
                                }

                                sse.onError(e => {
                                    console.error('lost connection; giving up!', e);
                                    repeater.state = "DISCONNECTED";

                                    // This is purely for example; EventSource will automatically
                                    // attempt to reconnect indefinitely, with no action needed
                                    // on your part to resubscribe to events once (if) reconnected
                                    sse.close();
                                });

                                // Listen for messages without a specified event
                                sse.subscribe('', (message) => {
                                    if (message.event === "Logic:transmit") {
                                        repeater.tx = message.tx;
                                    } else if (message.event === "Voter:sql_state") {
                                        for (let att in message.rx) {
                                            repeater.rx[att].info = message.rx[att];
                                        }
                                    }
                                });

                                this.repeaters.push(repeater);
                                console.log("Loaded ", repeater);
                            })
                            .catch(err => {
                                // When this error is caught, it means the initial connection to the
                                // events server failed.  No automatic attempts to reconnect will be made.
                                console.error('Failed to connect to server', err);
                            });


                    })
                }
            })
            */
        },

        data: () => ({
            repeaters: [],
            renderComponent: true,
            fullscreen: false,
            showMap: true,
            activeTab: 0,
            zoom: 8,
            center: latLng(52.817765, 9.42807),
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
            icon: icon({
                iconUrl: require("@/assets/icons/station-off-white.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            rxidleicon: icon({
                iconUrl: require("@/assets/icons/rx-station-white.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            rxlisteningicon: icon({
                iconUrl: require("@/assets/icons/rx-station-green.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            txactiveicon: icon({
                iconUrl: require("@/assets/icons/tx-green120.gif"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            txidleicon: icon({
                iconUrl: require("@/assets/icons/tx-station-white.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),

            rxidledm0maxicon: icon({
                iconUrl: require("@/assets/icons/rx-dm0max-white.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            rxlisteningdm0maxicon: icon({
                iconUrl: require("@/assets/icons/rx-dm0max-green.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            txactivedm0maxicon: icon({
                iconUrl: require("@/assets/icons/tx-dm0max-green120.gif"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),
            txidledm0maxicon: icon({
                iconUrl: require("@/assets/icons/tx-dm0max-white.png"),
                iconSize: [41, 48],
                iconAnchor: [20, 39]
            }),


            staticAnchor: [0, 0],
            customText: "Foobar",
            iconSize: 64
        }),
        methods: {
            getAntennaForReceiver(repeater, receiverKey) {
                if (repeater.antenna === undefined) {
                    return {"location": {"lat": 0, "lon": 0}}
                }
                // eslint-disable-next-line no-prototype-builtins
                if (repeater.antenna.hasOwnProperty(receiverKey)) {
                    return repeater.antenna[receiverKey];
                }
                return repeater.antenna["HilversumH"];
            },
            forceRerender() {
                // Remove my-component from the DOM
                this.renderComponent = false;

                this.$nextTick(() => {
                    // Add the component back in
                    this.renderComponent = true;
                });
            },
            getProxyURL(uri) {
                uri = uri.replace("http://85.222.223.251:5310/", "https://signal.3ef.de/dm0max-5310/");
                uri = uri.replace("http://2bs7fpf8ahdewu8a.myfritz.net:1541/", "https://signal.3ef.de/dm0max-1541/");
                uri = uri.replace("http://2bs7fpf8ahdewu8a.myfritz.net:1538/", "https://signal.3ef.de/dm0max-1538/");
                uri = uri.replace("http://2bs7fpf8ahdewu8a.myfritz.net:1535/", "https://signal.3ef.de/dm0max-1535/");
                uri = uri.replace("http://2bs7fpf8ahdewu8a.myfritz.net:1542/", "https://signal.3ef.de/dm0max-1542/");
                uri = uri.replace("http://db0hhh.de:1535/", "https://signal.3ef.de/db0hhh-1535/");
                return uri;
            },
            setHighZIndex(event) {
                console.log("HIGH INDEX", event)
                event.target.setZIndexOffset(1000000);
            }
        },
        computed: {
            dynamicSize() {
                return [this.iconSize, this.iconSize * 1.15];
            },
            dynamicAnchor() {
                return [this.iconSize / 2, this.iconSize * 1.15];
            }
        },
        beforeDestroy() {
            this.repeaters.forEach(repeater => {
                if (repeater.sse) {
                    repeater.sse.close();
                }
            })
        }
    }
</script>

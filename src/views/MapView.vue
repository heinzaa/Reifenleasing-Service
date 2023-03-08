<template>
    <div>
      <p v-for="marker in markers" :key="marker.name">
        First marker is placed at {{ marker.position.lat }}, {{ marker.position.lng }}</p>
      <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
      <button @click="showLongText">
        Toggle long popup
      </button>
      <button @click="showMap = !showMap">
        Toggle map
      </button>
    </div>
  <div style="height: 600px; width: 800px">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      @click="addMarker"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
       <l-marker
        v-for="marker in markers"
        :key="marker.name"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position"
        :icon="marker.icon"
        @click="alert(marker)"
      >
        <l-popup :content="marker.tooltip" />
        <l-tooltip :content="marker.tooltip" />
      </l-marker>
      
    </l-map>

  <div>
    <button @click="getDirections">Get Directions</button>
     <ul v-if="directions">
      <li v-for="direction in directions" :key="direction">{{ direction }}</li>
    </ul>
  </div> 
  

  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import axios from 'axios';
export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },
  data() {
    return {
      zoom: 10,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      withTooltip: latLng(47.41422, -1.250482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      markers: [],
      mapOptions: {
        zoomSnap: 0.5
      },
      positionStartPoint: '',
      positionEndPoint: '',
      showMap: true,
      directions: [],
      distance: '',
    };
  },
  methods: {

    async getDirections() {

        const point1 = this.markers[0].position.lat
        const point2 = this.markers[0].position.lng
        const point3 = this.markers[1].position.lat
        const point4 = this.markers[1].position.lat
        console.log("string1: " + '47.52091047852616, -1.1988830566406252,47.46059403884127, -1.4501953125000002')
        console.log("string2: " + `${this.markers[0].position.lat}, ${this.markers[0].position.lng},${this.markers[1].position.lat}, ${this.markers[1].position.lng}`,
  )
  const query1 = new URLSearchParams({
  profile: 'car',
  point: '47.52091047852616, -1.1988830566406252,47.46059403884127, -1.4501953125000002',
  point_hint: 'string',
  snap_prevention: 'string',
  curbside: 'any',
  locale: 'en',
  elevation: 'false',
  details: 'string',
  optimize: 'false',
  instructions: 'true',
  calc_points: 'true',
  debug: 'false',
  points_encoded: 'true',
  'ch.disable': 'false',
  heading: '0',
  heading_penalty: '120',
  pass_through: 'false',
  algorithm: 'round_trip',
  'round_trip.distance': '10000',
  'round_trip.seed': '0',
  'alternative_route.max_paths': '2',
  'alternative_route.max_weight_factor': '1.4',
  'alternative_route.max_share_factor': '0.6',
  key: '20f33145-9ef5-462a-a04b-c5d446ca48c8'
}).toString();

        const query = new URLSearchParams({
  profile: 'car',
  point: `${this.markers[0].position.lat},${this.markers[0].position.lng}, ${this.markers[1].position.lat},${this.markers[1].position.lng}`,
  point_hint: 'string',
  snap_prevention: 'string',
  curbside: 'any',
  locale: 'en',
  elevation: 'false',
  details: 'string',
  optimize: 'false',
  instructions: 'true',
  calc_points: 'true',
  debug: 'false',
  points_encoded: 'true',
  'ch.disable': 'false',
  heading: '0',
  heading_penalty: '120',
  pass_through: 'false',
  algorithm: 'round_trip',
  'round_trip.distance': '10000',
  'round_trip.seed': '0',
  'alternative_route.max_paths': '2',
  'alternative_route.max_weight_factor': '1.4',
  'alternative_route.max_share_factor': '0.6',
  key: '20f33145-9ef5-462a-a04b-c5d446ca48c8'
}).toString();

const response = await fetch(
  `https://graphhopper.com/api/1/route?${query}`,
  {method: 'GET'}
);

//const data = await resp.text();

this.distance = response.data.path[0].distance
this.directions = response.data.paths[0].instructions;

this.travelInformationToDB();



    },

    async travelInformationToDB(){
        const { data, error } = await supabase
                .from('Reiseinformationen')
                .insert({ fahrstrecke: this.distance, 
                           startpunkt: `${this.markers[0].position.lat},${this.markers[0].position.lng}`,
                           endpunkt: `${this.markers[1].position.lat},${this.markers[1].position.lng}`,
                           straßeinfos: this.directions                         
                }).select()
            if (data){
                kundenID.value = data[0].id
            }
            if (error){
                throw error
            }

        
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    addMarker: function(e) {
        
    // sicherstellen das nicht mehr als 2 Marker gesetzt werden können
    /*  if(this.markers.length = 2){
          return;
      } */

      const newMarker = {
        position: { lat: e.latlng.lat, lng: e.latlng.lng },
        draggable: true,
        visible: true,
      };
    // wenn markers array leear wird der Startpunkt ermittelt
     /* if(this.markers.length = 0){
          this.positionStartPoint = newMarker.position;
      }*/
      // wird der zweite Marker gesetzt - wird der Endpunkt ermittelt
      /* if(this.markers.length = 1){
          this.positionEndPoint = newMarker.position;
      } */
      this.markers.push(newMarker);
    },
  }
};
</script>
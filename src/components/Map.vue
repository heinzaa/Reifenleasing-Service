<template>

  <div style="height: 500px; width: 100%">
    <div style="height: 200px; overflow: auto;">
      <p>First marker is placed at {{ withPopup.lat }}, {{ withPopup.lng }}</p>
      <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
      <button @click="showLongText">
        Toggle long popup
      </button>
      <button @click="showMap = !showMap">
        Toggle map
      </button>
    </div>
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
      zoom: 13,
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
      directions: []
    };
  },
  methods: {

    getDirections: async () => {
      const response = await axios.get('https://graphhopper.com/api/1/route?point=51.131%2C12.414&point=48.224%2C3.867&vehicle=car&key=20f33145-9ef5-462a-a04b-c5d446ca48c8');
      this.directions = response.data.paths[0].instructions;
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
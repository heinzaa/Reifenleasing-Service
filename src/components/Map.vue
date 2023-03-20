<template>
  <div>
    <p v-for="marker in markers" :key="marker.name">
      First marker is placed at {{ marker.position.lat }}, {{ marker.position.lng }}</p>
    <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
  </div>
<div style="height: 520px; width: 800px">
  <l-map
    :zoom="zoom"
    :center="center"
    :options="mapOptions"
    style="height: 480px"
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
      :lat-lng="marker.position"
      :icon="marker.icon"
    >
      <l-popup :content="marker.tooltip" />
      <l-tooltip :content="marker.tooltip" />
    </l-marker>
  </l-map>
  <button type="button" class="btn btn-info mt-1 mb-1"  @click="getDirections" :disabled="loading"> <span>{{loading ? "Laden..." : "Strecke laden"}}</span>
  </button>

</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import axios from 'axios';
import { supabase } from '../supabase'

export default {
name: "Example",
components: {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip
},

setup(context){
  const loading = ref(false)
  let zoom = ref(10)
  let center = latLng(47.41322, -1.219482)
  let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  let attribution =  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'  
  let  withPopup =  latLng(47.41322, -1.219482)
  let  withTooltip = latLng(47.41422, -1.250482)
  let  currentZoom = ref(11.5)
  let  currentCenter = ref(latLng(47.41322, -1.219482))
  let  showParagraph = false
  let  markers = ref([])
  let  mapOptions = {
      zoomSnap: 0.5
    }
  let positionStartPoint = ''
  let  positionEndPoint = ''
  let  directions = ref([])
  let  distance = ref('')
  let  reiseID = ref(null)

   
   

   const getDirections = async () => {

      if(markers.value.length < 2){
        alert("Es müssen 2 Marker gesetzt werden.")
        return;
    } 

      const point1_lat = markers.value[0].position.lat
      const point2_lng = markers.value[0].position.lng
      const point3_lat = markers.value[1].position.lat
      const point4_lng = markers.value[1].position.lng

      
      
      loading.value = true
   let response = await axios.get(
  `https://graphhopper.com/api/1/route?profile=car&point=${point1_lat}%2C%20${point2_lng}&point=${point3_lat}%2C%20${point4_lng}&locale=en&optimize=false&instructions=true&calc_points=true&points_encoded=true&heading_penalty=120&key=20f33145-9ef5-462a-a04b-c5d446ca48c8`
  );
      
      distance.value = response.data.paths[0].distance
      directions.value = response.data.paths[0].instructions;
  
  await travelInformationToDB();

  }
  

  const travelInformationToDB = async () => {
      const { data, error } = await supabase
              .from('Reiseinformationen')
              .insert({ fahrstrecke: Math.round(distance.value), 
                         startpunkt: `${markers.value[0].position.lat},${markers.value[0].position.lng}`,
                         endpunkt: `${markers.value[1].position.lat},${markers.value[1].position.lng}`,
                         straßeninfos: directions.value                         
              }).select()
          if (data){
              reiseID.value = data[0].id
              loading.value = false 
          }
          if (error){
              throw error
          } 
                
  }

  const zoomUpdate = (zoom) => {
    currentZoom.value = zoom;
  }
  const centerUpdate = (center) => {
    currentCenter.value = center;
  }
  const addMarker = (e) => {
      
  //sicherstellen das nicht mehr als 2 Marker gesetzt werden können
    if(markers.value.length == 3){
        alert("Es können nur 2 Marker gesetzt werden.")
        return;
    } 

    const newMarker = {
      position: { lat: e.latlng.lat, lng: e.latlng.lng },
      draggable: true,
      visible: true,
    };
    markers.value.push(newMarker);
  };



return{
    zoom, center, url, attribution, withPopup, withTooltip, currentZoom, currentCenter, showParagraph, markers, mapOptions,
    positionStartPoint, positionEndPoint, directions, distance, travelInformationToDB, zoomUpdate, centerUpdate,
    addMarker, getDirections, loading, reiseID

  };
},
};
</script>
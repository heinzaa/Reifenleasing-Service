<template>
  <!-- <div>
    <p v-for="marker in markers" :key="marker.name">
      First marker is placed at {{ marker.position.lat }}, {{ marker.position.lng }}</p>
    <p>Center is at {{ currentCenter }} and the zoom is: {{ currentZoom }}</p>
  </div> -->
<div class="map-parent">

  <l-map
    :zoom="zoom"
    :center="center"
    :options="mapOptions"
    style="height: 800px; width: 1200px"
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
    <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color"></l-polyline>
  </l-map>
  <button type="button" class="btn btn-info mt-2 mb-1 buttonLoadMap"  @click="getInstructions" :disabled="loading"> <span>{{loading ? "Laden..." : "Strecke laden"}}</span>
  </button>
</div>


</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LPolyline } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { supabase } from '../supabase'

export default {
name: "Example",
components: {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LPolyline
},

setup(context){
  const loading = ref(false)
  let zoom = ref(10)
  let center = ref(latLng(-27.96199, 153.39527))
  let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  let attribution =  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'  
  let  withPopup =  latLng(-27.96199, 153.39527)
  let  withTooltip = latLng(-27.96199, 153.39527)
  let  currentZoom = ref(11.5)
  let  currentCenter = ref(latLng(-27.96199, 153.39527))
  let  showParagraph = false
  let  markers = ref([])
  let  mapOptions = {
       zoomSnap: 0.5
    }
  let polyline = ref({
        latlngs: [],
        color: 'red'
      })
  let positionStartPoint = ''
  let  positionEndPoint = ''
  let  aInstructions = ref([])
  let  distance = ref('')
  let  reiseID = ref(null)
  
  let aPoints = ref()
  const oStartPointAdressInformation = ref()
  const oEndPointAdressInformation = ref()
   
   

   const getInstructions = async () => {

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
  `https://graphhopper.com/api/1/route?profile=car&point=${point1_lat}%2C%20${point2_lng}&point=${point3_lat}%2C%20${point4_lng}&locale=en&optimize=false&instructions=true&calc_points=true&points_encoded=false&heading_penalty=120&key=20f33145-9ef5-462a-a04b-c5d446ca48c8`
  );
      
      distance.value = response.data.paths[0].distance
      aInstructions.value = response.data.paths[0].instructions;
      aPoints.value = response.data.paths[0].points.coordinates;


      let aPolyline = []
    /*  for (let i = 0; i < aPoints.value.length; i++){
       
       let oPoints = aPoints.value[i]
       console.log(oPoints)
       let helperarray = []
       helperarray.push(oPoints['0'])
       helperarray.push(oPoints['1'])
        aPolyline.push(helperarray)

      } */
      // [[-27.96199, 153.3952],[-27.98199, 153.5952]]
      const o = [{ 0: -27.96199, 
                  1:153.3952
                },
                { 0: -27.98199, 
                  1: 153.5952 }
                 ]

      console.log('o: ' + o)
      console.log('points: ' + aPoints.value)

      const arrayObject = []
       arrayObject.push(aPoints.value)
      

      for(let i = 0; i < arrayObject.length; i++){
        var array = arrayObject[i]
        var helper = []
        helper.push(array[0])
        helper.push(array[1])

        aPolyline.push(helper)

      }
      
      polyline.value.latlngs = aPolyline
      

      

    // hier werden die Startpunkt mit Namen geholt
      const startpointData= await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${point1_lat}&lon=${point2_lng}&format=json`)
      oStartPointAdressInformation.value = startpointData.data.address

      // hier wird der Endpunkt geholt
      const endpointData = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${point3_lat}&lon=${point4_lng}&format=json`)
      oEndPointAdressInformation.value = endpointData.data.address


      // hier werden 
      
      // anhand der Intervalle die angegeben sind in dem InstrucitonsObjekt werden die daszugehörigen Punktarrays in das Instructionsobjekt geschrieben 
      mapPointsToInstructions(response)

  
       await travelInformationToDB();

       loading.value = false 
  }
  

  const travelInformationToDB = async () => {
      const { data, error } = await supabase
              .from('Reiseinformationen')
              .insert({ fahrstrecke: Math.round(distance.value), 
                         startpunkt: `${markers.value[0].position.lat},${markers.value[0].position.lng}`,
                         endpunkt: `${markers.value[1].position.lat},${markers.value[1].position.lng}`,
                         straßeninfos: aInstructions.value,   
                         startpunkt_adress_infos: oStartPointAdressInformation.value,
                         endpunkt_adress_infos: oEndPointAdressInformation.value                       
              }).select()
          if (data){
              reiseID.value = data[0].id              
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


  // Get OSM_ID for every route Path
  
  const mapPointsToInstructions = async () => {



    let aPointsForIntervall = [];

    for ( let i = 0; i < aInstructions.value.length; i++ ){

        // in das Instructions Array die Routenpunkte für daie angegeben Intervalle dazulesen 
        // diese Forschleife läuft das Intervall durch für diese Instruction & liest die Punkte dazu aus dem Points-Array
      for ( let y = aInstructions.value[i].interval[0] ; y <= aInstructions.value[i].interval[1]; y++  )  {    
      
      aPointsForIntervall.push(aPoints.value[y])

      }

      // adde die Points aus dem gegebenen Intervall in das enstprechende Instructions Objekt
      aInstructions.value[i]['points'] = aPointsForIntervall
      
      // array für den nächsten durchgang leeren
      aPointsForIntervall = []

    }
      
    await fetchOsmIdForEveryStreetPoint()

    

  }

  const fetchOsmIdForEveryStreetPoint = async () => {


    let response = {}

    // Nur der erste Punkt ist wichtig aus dem Points Array in dem Instructionsobjekt
    // Alle Punkte die innerhalb eines Intervalls liegen haben die gleiche OSM_ID
    for ( let i = 0; i < aInstructions.value.length; i++ ){

     response  = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${aInstructions.value[0].points[0]['0']}&lon=${aInstructions.value[0].points[0]['0']}&format=json`
   );

    aInstructions.value[i]['NominatimInformations'] = response.data

    }

  };




return{
    zoom, center, url, attribution, withPopup, withTooltip, currentZoom, currentCenter, showParagraph, markers, mapOptions,
    positionStartPoint, positionEndPoint, aInstructions, distance, travelInformationToDB, zoomUpdate, centerUpdate,
    addMarker, getInstructions, loading, reiseID, mapPointsToInstructions, aPoints, fetchOsmIdForEveryStreetPoint, 
    oStartPointAdressInformation, oEndPointAdressInformation, polyline

  };
},
};
</script>
<style scoped>

.map-parent{  
  text-align: center;
  padding: 2rem;
  display: flex;
  display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
  
}

.buttonLoadMap{
  
}

</style>
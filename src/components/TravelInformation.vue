<template>

<div class="heading mt-5">
<p class="heading-text">Reiseinformationen</p>
</div>

<div>
<h4>1. Bitte öffnen Sie die Karte und wählen Sie die Fahrstrecke aus</h4>
<button type="button" class="btn btn-outline-info btn-rounded" @click="showMap">
        Karte anzeigen
</button> 
</div>

<div>
    <form>    
      <div class="mb-3">
            <label for="anzahlKilometerInputId" class="form-label">Anzahl Kilometer</label>
            <input type="number" id="anzahlKilometerInputId" class="form-control" name="anzahlKilometer" required disabled v-model="kilometers" />
        </div>   
    </form>
</div>
<button type="button" class="btn btn-outline-info btn-rounded" @click="enableTireSelection">Weiter</button>


<div v-if="routeSelected">
<h4>2. Bitte wählen Sie die Reifeklasse aus!</h4>
<form>
         <div class="mb-3">          
             <label for="selectTireClassId">Reifenklasse</label>
             <div class="city-item">
           <select id="selectTireClassId" @change="onTireSelected" class="form-select" v-model="tiresClass" required>
            <option selected value="" disabled>Reifenklasse</option>
              <option value="Premiumklasse">Premiumklasse</option>
              <option value="Oberklasse">Oberklasse</option>
              <option value="Mittelklasse">Mittelklasse</option>
            </select>
             </div>
          </div>    
</form>
</div>
    
          <MapModal ref="mapComponent" :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal"/>
  
          <div v-if="tireSelected" class="btn-block">
            <button class="btn btn-outline-info btn-rounded" type="button" @click="addInvoice" :disabled="loading"> <span>{{loading ? "Laden..." : "Infos hochladen"}}</span>
            </button>
          </div>
        
       
        
      
</template>

<script>

import MapModal from './Modals/MapModal.vue'
import { ref } from 'vue'
import { supabase } from '../supabase'


export default {
    components: {
        MapModal      

    },

    setup(){
        
        const modalActive = ref(false)
        const kilometers = ref(null)
        const mapComponent = ref(null)
        const reiseID = ref(null)
        const reifenID = ref(null)
        const price = ref(null)
        const tiresClass = ref(null)
        const loading = ref(false)

        const routeSelected = ref(false)
        const tireSelected = ref(false)

        const enableTireSelection = () =>{
            if(kilometers.value != null){
                routeSelected.value = true;
            }            
        }

        const showMap = () => {
            modalActive.value = true
        }

        const onTireSelected = (event) => {
            if(event.target.value != null){
                tireSelected.value = true
            }

        }

        const addInvoice = () => {
            loading.value = true
            getTireInformation()
            loading.value = false
        }

        const closeModal = () =>{
            modalActive.value = false
            kilometers.value = Math.round(mapComponent.value.mapComponent.distance / 1000)
            reiseID.value = mapComponent.value.mapComponent.reiseID
        }

        const getTireInformation = async () => {
            try{
            console.log("reifenklasse" + tiresClass.value)
            const { data, error } = await supabase
                .from('Reifen')
                .select()
                .eq('reifenklasse', tiresClass.value)
            if (error){
                throw error;
            }
            if (data){
                reifenID.value = data[0].id
                return data
            }           
            } catch (error){
                alert(error.message)
            }
        }

        return {
            modalActive,
            showMap,
            closeModal,
            kilometers,
            mapComponent,
            reiseID,
            getTireInformation,
            reifenID,
            price,
            addInvoice,
            tiresClass,
            enableTireSelection,
            routeSelected,
            onTireSelected,
            tireSelected
        }
    }

}
</script>

<style scoped>
.heading{
  text-align: center;
  top: 20px;
}
.heading-text{
    font-size: 3rem;
    font: bold;
}

</style>
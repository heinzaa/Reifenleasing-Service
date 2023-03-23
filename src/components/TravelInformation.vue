<template>

<div class="heading mt-5">
<p class="heading-text">Reiseinformationen</p>
</div>
<h3>Bitte wählen Sie die Reisreoute</h3>
<div>
<Map ref="mapComponent" />
</div>


<div>
    <h4>Anzahl Kilometer (in Kilometer)</h4>
    <form class="row" >    
      <div class="col">
            <input type="number" id="anzahlKilometerInputId" class="form-control" name="anzahlKilometer" required disabled v-model="kilometers" />            
      </div>
      <div class="col">
        <button class="btn btn-outline-info btn-rounded" type="button" @click="showKilometers" :disabled="bKilometers"> <span>{{loading ? "Laden..." : "Distanz berechnen"}}</span>
        </button>
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
    
  
          <div v-if="tireSelected" class="btn-block">
            <button class="btn btn-outline-info btn-rounded" type="button" @click="addInvoice" :disabled="loading"> <span>{{loading ? "Laden..." : "Infos hochladen"}}</span>
            </button>
          </div>
        
       
        
      
</template>

<script>


import { ref } from 'vue'
import { supabase } from '../supabase'
import Map from './Map.vue'

export default {
    components: {
     Map      

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
        const bKilometers = ref(false)
        const routeSelected = ref(false)
        const tireSelected = ref(false)

        const enableTireSelection = () =>{
            if(kilometers.value != null){
                routeSelected.value = true;
            }            
        }

        const showKilometers = () => {
            kilometers.value = Math.round(mapComponent.value.distance / 1000)
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
            kilometers.value = Math.round(mapComponent.value.distance / 1000)
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
            tireSelected,
            showKilometers,
            bKilometers
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
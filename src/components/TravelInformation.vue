<template>

    <form>    
      <div class="item">
            <label for="anzahlKilometerInputId">Anzahl Kilometer</label>
            <input type="number" id="anzahlKilometerInputId" name="anzahlKilometer" v-model="kilometers" />
        </div>  
  
         <div class="item">          
             <label for="selectTireClassId">Reifeklasse</label>
             <div class="city-item">
           <select id="selectTireClassId" class="select-country" v-model="tiresClass" required>
            <option selected value="" disabled>Reifenklasse</option>
              <option value="Premiumklasse">Premiumklasse</option>
              <option value="Oberklasse">Oberklasse</option>
              <option value="Mittelklasse">Mittelklasse</option>
            </select>
             </div>
          </div>    
    
          <MapModal :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal"/>
      
      <button @click="showMap">
        Show Map
      </button> 
  
      <div class="item">
            <label for="gesamtpreisInputId">Gesamtpreis</label>
            <input id="gesamtpreisInputId" type="number" name="anzahlKilometer" v-model="price" />
      </div>    
  
          <div class="btn-block">
            <button class="btn-add-invoice" type="submit" @click="addInvoice" :disabled="loading"> <span>{{loading ? "Laden..." : "Einreichen"}}</span>
            </button>
          </div>
        </form>
       
        
      
</template>

<script>

import MapModal from './Modals/MapModal.vue'
import { ref } from 'vue'

import Map from './Map.vue'

export default {
    components: {
        MapModal, Map       
    },

    setup(){
        
        const modalActive = ref(false)

        const showMap = () => {
            modalActive.value = true
        }

        return {
            modalActive,
            showMap
        }
    }

}
</script>

<style>

</style>
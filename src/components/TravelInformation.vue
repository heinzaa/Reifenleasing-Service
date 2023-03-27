<template>

<div class="heading mt-5">
<p class="heading-text">Reiseinformationen</p>
</div>
<h3>Bitte wählen Sie die Reisreoute</h3>

<Map ref="mapComponent" />



<div class="mb-2">
    <h4>Anzahl Kilometer (in Kilometer)</h4>
    <form class="row" >    
      <div class="col">
            <input type="number" id="anzahlKilometerInputId" class="form-control" name="anzahlKilometer" required disabled v-model="kilometers" /> 
            <div class="error mb-2">{{error}}</div>           
      </div>
      <div class="col">
        <button class="btn btn-outline-info btn-rounded" type="button" @click="showKilometers" :disabled="bKilometers"> <span>{{loading ? "Laden..." : "Distanz berechnen"}}</span>
        </button>
      </div>
    </form>
</div>
<button type="button" class="btn btn-outline-info btn-rounded mb-2" :disabled="bWeiter" @click="enableTireSelection">Weiter</button>


<div v-if="routeSelected">
<h4>2. Bitte wählen Sie die Reifeklasse aus!</h4>
<form>
         <div class="mb-3">          
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
<button type="button" class="btn btn-outline-info btn-rounded mb-2"  @click="uplaodData">Weiter</button>
</div>




<!-- <div class="mb-2">
    <h4>Preis berechnen</h4>
    <form class="row" >    
      <div class="col">
            <input type="number" id="preisInputId" class="form-control" name="gesamtPreis" required disabled v-model="gesamtPreis" />            
      </div>
      <div class="col">
        <button class="btn btn-outline-info btn-rounded" type="button" @click="calculatePrice" :disabled="bKilometers"> <span>{{loading ? "Laden..." : "Preis berechnen"}}</span>
        </button>
      </div>
    </form>
</div> -->

    
  

        
       
        
      
</template>

<script>


import { onMounted, ref } from 'vue'
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
        const gesamtPreis = ref()
        const bWeiter = ref(true)
        const error = ref()

        const enableTireSelection = () =>{
            if(kilometers.value != null){
                routeSelected.value = true;
            }            
        }

        const showKilometers = () => {
            kilometers.value = Math.round(mapComponent.value.distance / 1000)
            if(kilometers.value == 0){
                error.value = 'Bitte wählen Sie zuerst eine Route aus!'
            }
            else{
            bWeiter.value = false
            error.value = ''
        }
        }

      

        const onTireSelected = (event) => {
            if(event.target.value != null){
                tireSelected.value = true
            }

        }

        const uplaodData = () => {
            loading.value = true
            getTireInformation()
            
            loading.value = false
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

        onMounted( () => {
            reiseID.value = mapComponent.value.reiseID
        })
        

        return {
            modalActive,
            kilometers,
            mapComponent,
            reiseID,
            getTireInformation,
            reifenID,
            price,
            uplaodData,
            tiresClass,
            enableTireSelection,
            routeSelected,
            onTireSelected,
            tireSelected,
            showKilometers,
            bKilometers,
            gesamtPreis,
            bWeiter,
            error
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
.error{
    color: red;
}

</style>
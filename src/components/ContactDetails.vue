<template>
 
    <div id="InvoiceForm">   
    <div class="testbox">
      <form @submit.prevent="handleSubmit">
        <div class="banner">
          <h1>Rechnung Reifenleasing</h1>
        </div>
        <div class="item">
          <p>Kundendaten</p>
          <div class="name-item">
            <input type="text" name="name" placeholder="Vorname" v-model="firstName" />
            <input type="text" name="name" placeholder="Nachname" v-model="lastName" />
          </div>
        </div>
        <div class="item">
          <p>Email</p>
          <input type="email" name="email" placeholder="E-Mail" v-model="eMail"/>
        </div>
        <div class="item">
          <p>Telefonnummer</p>
          <input type="text" name="phone" placeholder="### ### ####" v-model="phoneNumber"/>
        </div>
        <div class="item">
          <p>Addresse</p>
          <input class="input-street" type="text" name="name" placeholder="Straße" v-model="street" required/>
          <div class="city-item">
            <input type="text" name="name" placeholder="Stadt" required v-model="city"/>
            <input type="text" name="name" placeholder="Region" v-model="region" required/>
            <input type="text" name="name" placeholder="Postleitzahl" v-model="zipCode" required/>
            <select class="select-country" v-model="country" required>
              <option selected value="" disabled>Country</option>
              <option value="1">Italien</option>
              <option value="2">Deutschland</option>
              <option value="3">Frankreich</option>
              <option value="4">USA</option>
              <option value="5">England</option>
              <option value="5">Schweiz</option>
            </select>
          </div>
        </div>       
      </form>

    </div>
   </div> 
  </template>
  <script>
import Map from '../components/Map.vue'
import { useRouter } from "vue-router";
import { supabase } from '../supabase'
import { reactive, defineComponent, ref } from "vue";
import MapModal from './Modals/MapModal.vue'


export default {
    components: {
        MapModal, Map     
    },

    setup(){
    

        const router = useRouter()
        const loading = ref(false)
        // Deklaration der Kundendaten
        const firstName = ref('Marc')
        const lastName = ref('Heintz')
        const eMail = ref('heintz.marc@web.de')
        const phoneNumber = ref('12345678')
        const street = ref('Jägerp')
        const city = ref('Neupotz')
        const region = ref('Pfalz')
        const zipCode = ref('76777')
        const country = ref('Deutschland')
       

        // Travelinformation
        const kilometers = ref('100');
        const coordinate_x = ref(300.20);
        const coordinate_y = ref(400.20);
        const streetinformation = ref({});


        // Rechnungsinformationen
        const price = ref('100');
        const kundenID = ref('');
        const reifenID = ref('');
        const reiseID = ref('');

        // Reifeninformationen
        const tiresClass = ref('')
        const tiresBasicPrice = ref('')
        const manufacturer = ref('')
        const tireName = ref('')

        const modalActive = ref(false)


        const  addInvoice = async () => {
            // Eingegebene Daten in die Datenbank speichern

            if (!firstName.value || !lastName.value || !eMail.value || 
                 !phoneNumber.value || !street.value|| !city.value || 
                 !region.value || !country.value )
            {
                alert("Bitte alle Felder ausfüllen!")
                return
            }
              
               await createCustomer(),
               await getTireInformation(),
               await createTravelInformation()
               await createInvoice()
            
            const oViewInformation =  getOverviewView()
            console.log(oViewInformation)

        }

        async function createCustomer () {
            try{
            loading.value = true
            // add Customerinformation
            const { data, error } = await supabase
                .from('Kunden')
                .insert({ firstName: firstName.value, 
                           lastName: lastName.value,
                           eMail: eMail.value,
                           phoneNumber: phoneNumber.value,
                           street: street.value,
                           city: city.value,
                           region: region.value,
                           country: country.value,
                           zipCode: zipCode.value                             
                }).select()
            if (data){
                kundenID.value = data[0].id
            }
            if (error){
                throw error
            }
            } catch (error){
                alert(error.message)
            }

        }

        async function getTireInformation () {
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

        async function createTravelInformation () {
            try{

            const { data, error } = await supabase
                .from('Reiseinformationen')
                .insert({ fahrstrecke: kilometers.value,
                          coordinate_x: coordinate_x.value,
                          coordinate_y: coordinate_y.value,
                          straßeninfos: streetinformation.value
             }).select()
            if (error){
                throw error;
            }
            if (data){
                reiseID.value = data[0].id
                return data
            }           
            } catch (error){
                alert(error.message)
            }
        }

        async function getOverviewView (){
            try{
            const { data, error } = await supabase
                .from('rechnungsinformationen')
                .select()

            if (error){
                throw error
            }
            if (data){
                return data
            } 
            } catch (error){
                alert(error.message)
            } finally {
                loading.value = false
            } 
        }

        async function createInvoice() {
            
         try{
            const { data, error } = await supabase
                .from('Rechnung')
                .insert({ kundenID: kundenID.value,
                          reifenID: reifenID.value,
                          reiseID: reiseID.value,
                          preis: price.value                         
                }).select()
            if (error){
                throw error
            } 
            if (data){
                return data
            }
            } catch(error){
                alert(error.message)
            }
        }

        const closeModal = () => {
            modalActive.value = false
        }



            // Zuerst in der Reifen DB manuell in der GUI die Reifenklassen anlegen mit Preis / km und Faktor

            // Einbindung der Map um die Koordinaten zu bekommen

            // Dann die Straßen dazulesen aus der CSV 

            // Preis kalkulieren 

            // dann in die DB shcreiben

            // microsoft flow hört darauf 

            // schickt dann eine E-mail an den Kunden oder eine MS Teams Nachricht


        return{
            firstName, 
            lastName, 
            eMail, 
            phoneNumber, 
            street, 
            city, 
            region, 
            zipCode, 
            country, 
            kilometers, 
            price,
            loading, 
            tiresClass, 
            tiresBasicPrice,    
            manufacturer,
            tireName,    
            addInvoice,
            createCustomer,
            getTireInformation,
            getOverviewView,
            createTravelInformation,
            createInvoice,
            closeModal,
            modalActive,

        }


    }

}
</script>
<style scoped>
      html, body {
      min-height: 100%;
      }
      p{
          color: white;
      }
      body, div, form, input, select, textarea{ 
      padding: 0;
      margin: 0;
      outline: none;
      font-family: Roboto, Arial, sans-serif;
      font-size: 14px;
      color: black;
      line-height: 22px;
      margin-bottom: 0.5rem;
      }
      h1 {
      position: absolute;
      margin: 0;
      line-height: 55px;
      font-size: 55px;
      color: #fff;
      z-index: 2;
      }
      .testbox {
      display: flex;
      justify-content: center;
      align-items: center;
      height: inherit;
      padding: 20px;
      }
      form {
      width: 100%;
      padding: 20px;
      border-radius: 6px;
      background: #27333A; 
      }
      .banner {
      position: relative;
      height: 230px;
      background-image: url("../assets/reisen-bild-reifenleasing.jpg");  
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      }
      .banner::after {
      content: "";
      background-color: rgba(0, 0, 0, 0.4); 
      position: absolute;
      width: 100%;
      height: 100%;
      }
      input, select, textarea {
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
      }
      input {
      width: calc(100% - 10px);
      padding: 5px;
      }
      select {
      width: 100%;
      padding: 7px 0;
      background: transparent;
      }
      textarea {
      width: calc(100% - 12px);
      padding: 5px;
      }
      .item input:hover, .item select:hover, .item textarea:hover {
      border: 1px solid transparent;
      box-shadow: 0 0 6px 0 white;
      color: black;
      }
      .item {
      position: relative;
      margin: 5px 0;
      }
      .btn-block {
      margin-top: 10px;
      text-align: center;
      border-radius: 20px; 
      }
      button {
      width: 150px;
      padding: 10px;
      border: none;
      border-radius: 20px; 
      background: #51AE8B;
      cursor: pointer;
      }
      button:hover {
      box-shadow: 0 0 18px 0 #3d2914;
      border-radius: 20px; 
      }
      @media (min-width: 568px) {
      .name-item, .city-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      }
      .name-item input, .city-item input {
      width: calc(50% - 20px);
      margin-bottom: 0.2rem;
      }
      .city-item select {
      width: calc(50% - 20px);
      background: white;
      color: #858585;
      }

      .city-item{
          margin-right: 0.6rem;
      }

      .input-street{
          margin-bottom: 0.2rem;
      }
      .btn-add-invoice{
          border-radius: 20px;
      }

      input{
          color: black;
      }

      }
</style>
<template>
 
    <div id="InvoiceForm">   
    <div class="testbox">
      <form @submit.prevent="handleSubmit">
        <div class="banner">
          <h1>Kundeninformationen</h1>
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
              <option selected value="Italien" disabled>Country</option>
              <option value="Italien">Italien</option>
              <option value="Deutschland">Deutschland</option>
              <option value="Frankreich">Frankreich</option>
              <option value="USA">USA</option>
              <option value="England">England</option>
              <option value="Schweiz">Schweiz</option>
            </select>
          </div>
        </div>       
        <div class="u-center-text u-margin-top-huge mt-2">
            <button class="btn btn--green" type="button" @click="addInvoice" :disabled="loading || allreadySubmitted"> <span>{{loading ? "Laden..." : "Einreichen"}}</span>
            </button>
          </div>
      </form>

      <SubmitModal :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal">
            <div>
                <b-icon-send-check style="font-size:3em; margin:15px; color:green;"></b-icon-send-check> 
                <h2>Kundeninformationen erfolgreich hochgeladen.</h2>
                <p>Bitte fahren Sie mit den Reiseninformationen fort!</p>
            </div>
        </SubmitModal>


    </div>
   </div> 
  </template>
  <script>
import { useRouter } from "vue-router";
import { supabase } from '../supabase'
import { ref } from "vue";
import SubmitModal from './Modals/SubmitModal.vue'



export default {
    components: {   
        SubmitModal
    },

    setup(){
    
        const router = useRouter()
        const loading = ref(false)
        // Deklaration der Kundendaten
        const firstName = ref('')
        const lastName = ref('')
        const eMail = ref('heintz.marc@web.de')
        const phoneNumber = ref('+4912345678')
        const street = ref('Hauptstraße')
        const city = ref('Ludwigshafen')
        const region = ref('Rheinland-Pfalz')
        const zipCode = ref('67059')
        const country = ref('Deutschland')
        const kundenID = ref(null)
       

        const modalActive = ref(false)

        const allreadySubmitted = ref(false)


        const  addInvoice = async () => {
            // Eingegebene Daten in die Datenbank speichern

            if (!firstName.value || !lastName.value || !eMail.value || 
                 !phoneNumber.value || !street.value|| !city.value || 
                 !region.value || !country.value )
            {
                alert("Bitte alle Felder ausfüllen!")
                return
            }
              
               await createCustomer()

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
            } finally{
                loading.value = false
            }
            modalActive.value = !modalActive.value
            allreadySubmitted.value = true
        }


      

        const closeModal = () => {
            modalActive.value = false
        }

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
            loading, 
            createCustomer,
            closeModal,
            modalActive,
            kundenID,
            addInvoice,
            allreadySubmitted
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
      .u-center-text{
        display: flex !important;
        justify-content: center;
      }
      .banner {
      position: relative;
      height: 300px;
      background-image: url("../assets/roadtrip.jpeg");  
      background-size: cover;
      background-attachment: scroll;
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
      .btn, .btn:link, .btn:visited {
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.5rem;
  display: inline-block;
  border-radius: 0.5rem;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  position: relative;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.btn:hover {
  -webkit-transform: translateY(-3px);
          transform: translateY(-3px);
  -webkit-box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.btn:hover::after {
  -webkit-transform: scaleX(1) scaleY(1.2);
          transform: scaleX(1) scaleY(1.2);
  opacity: 0;
}

.btn:active, .btn:focus {
  outline: none;
  -webkit-transform: translateY(-1px);
          transform: translateY(-1px);
  -webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
}


.btn--green {
  background: -webkit-gradient(linear, left top, right top, from(#EA6F25), to(#1F69CA));
  background: linear-gradient(to right, #EA6F25, #1F69CA);
  color: #fff;
}

.btn--green::after {
  background-color: #55c57a;
}

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: inherit;
          box-sizing: inherit;
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
      color: black;
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
<template>
 
  <Wizard squared-tabs card-background
  :custom-tabs="[
          {
            title: 'Kontakdaten pflegen',
          },
          {
            title: 'Reiseinformationen',
          }]"
        :beforeChange="onTabBeforeChange"
        @change="onChangeCurrentTab"
        @complete:wizard="wizardCompleted"
    >   
        <div v-if="currentTabIndex === 0">
        <ContactDetails ref="ContactDetails"/>
        </div>
        <div v-if="currentTabIndex === 1">
        <TravelInformation  ref="TravelInformationRef"  />
        </div>
        <NoCustomerExist :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal">
            <div>
                <b-icon-exclamation-triangle-fill style="font-size:3rem; margin:15px; color:red;"></b-icon-exclamation-triangle-fill> 
                <h2>Bitte reichen Sie zuerst die Reiseinformationen ein!</h2>
            </div>
        </NoCustomerExist>

        

        <InvoiceCreatedModal :modal-active="modalActiveSubmit" @close="navToInvoice" @cancel="closeModalSubmit">
            <div>
                <b-icon-send-check style="font-size:3em; margin:15px; color:green;"></b-icon-send-check> 
                <h2>Rechnung erfolgreich erstellt!</h2>          
            </div>
        </InvoiceCreatedModal>

    </Wizard>

    <LoadingModal :modal-active="modalLoadingActive" @cancel="closeModalLoading">
            <div>
                <b-icon-cloud-upload style="font-size:3em; margin:15px; color:green;"></b-icon-cloud-upload> 
                <h2>Die Daten werden verarbeitet und eine Rechnung wird erstellt!</h2>          
            </div>
    </LoadingModal>


</template>

<script>
import 'form-wizard-vue3/dist/form-wizard-vue3.css'
import Wizard from 'form-wizard-vue3'
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

import ContactDetails from './ContactDetails.vue'
import TravelInformation from './TravelInformation.vue'
import NoCustomerExist from './Modals/NoCustomerExist.vue'
import calculateLeasingPrice from '../composables/calculateLeasingPrice'
import InvoiceCreatedModal from './Modals/InvoiceCreatedModal.vue'
import LoadingModal from './Modals/LoadingModal.vue'

export default {
    components:{
    Wizard,
    ContactDetails,
    TravelInformation,
    NoCustomerExist,
    InvoiceCreatedModal,
    LoadingModal,
},

    setup(){

      const currentTabIndex = ref(null)
      const router = useRouter()
    

      const TravelInformationRef = ref(null)
      const ContactDetails = ref(null)
      const kundenID = ref(null)
      const reifenID = ref(null)
      const reiseID = ref(null)
      const accountedleasingprice = ref()
      const roughnessForRoad = ref()
      const rechnungID = ref()

      const modalActive = ref(false)
      const modalActiveSubmit = ref(false)
      const modalLoadingActive = ref(false)
      


      onMounted(() => {
        currentTabIndex.value = 0
        console.log(TravelInformationRef.value)
      })

      const createInvoice = async () => {


            try{
               const { data, error } = await supabase
                   .from('Rechnung')
                   .insert({ kundenID: kundenID.value,
                             reifenID: TravelInformationRef.value.reifenID,
                             reiseID: TravelInformationRef.value.mapComponent.reiseID, 
                             preis: accountedleasingprice.value       ,
                             iri: roughnessForRoad.value            
                   }).select()
               if (error){
                   throw error
               } 
               if (data){
                rechnungID.value = data[0].id
                   return data
               }
               } catch(error){
                   alert(error.message)
               }
           }

      const onChangeCurrentTab = (index, oldIndex) => {
      console.log(index, oldIndex);
    

      if(ContactDetails.value != null ){
        kundenID.value = ContactDetails.value.kundenID
      }
      currentTabIndex.value = index;
    }
    const onTabBeforeChange = () => {
      if (currentTabIndex.value === 0) {
        console.log('First Tab');
      }
      console.log('All Tabs');
    }


    const wizardCompleted = async () => {
      if(TravelInformationRef.value.reifenID == null){
        modalActive.value = true
        return
      }
      modalLoadingActive.value = true;

      const { leasingPrice, averageRoughnessForRoad }  = await calculateLeasingPrice(TravelInformationRef.value.mapComponent.reiseID)
      accountedleasingprice.value = leasingPrice
      roughnessForRoad.value = averageRoughnessForRoad
      console.log('Wizard Completed');
      await createInvoice( )
      modalLoadingActive.value = false
      modalActiveSubmit.value = true

    }

    const getTireInformation = async () => {
            try{
            console.log("reifenklasse" + TravelInformationRef.value.tiresClass)
            const { data, error } = await supabase
                .from('Reifen')
                .select()
                .eq('reifenklasse', TravelInformationRef.value.tiresClass)
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
    
        const navToInvoice = () => {

          router.push({ name: "contract", params: { id:  rechnungID.value } });

        }

    
    const closeModalSubmit = () =>{
      modalActiveSubmit.value = false
    }

    const closeModal = () =>{
      modalActive.value = false
    }
        return {
          currentTabIndex,
          onChangeCurrentTab,
          onTabBeforeChange,
          wizardCompleted,
          createInvoice,
          TravelInformationRef,
          ContactDetails,
          kundenID,
          reifenID,
          reiseID,
          modalActive,
          closeModal,
          accountedleasingprice,
          getTireInformation,
          roughnessForRoad,
          modalActiveSubmit,
          navToInvoice,
          closeModalSubmit,
          rechnungID,
          modalLoadingActive
        }

    }

}
</script>

<style>

</style>
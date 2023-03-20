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


    </Wizard>



</template>

<script>
import 'form-wizard-vue3/dist/form-wizard-vue3.css'
import Wizard from 'form-wizard-vue3'
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

import ContactDetails from './ContactDetails.vue'
import TravelInformation from './TravelInformation.vue'
import NoCustomerExist from './Modals/NoCustomerExist.vue'

export default {
    components:{
        Wizard, ContactDetails, TravelInformation, NoCustomerExist
    },

    setup(){

      const currentTabIndex = ref(null)

    

      const TravelInformationRef = ref(null)
      const ContactDetails = ref(null)
      const kundenID = ref(null)
      const reifenID = ref(null)
      const reiseID = ref(null)

      const modalActive = ref(false)
      


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
                             reiseID: TravelInformationRef.value.reiseID,                    
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

      const onChangeCurrentTab = (index, oldIndex) => {
      console.log(index, oldIndex);
      currentTabIndex.value = index;
      if(ContactDetails.value != null){
        kundenID.value = ContactDetails.value.kundenID
      }
    }
    const onTabBeforeChange = () => {
      if (currentTabIndex.value === 0) {
        console.log('First Tab');
      }
      console.log('All Tabs');
    }
    const wizardCompleted = () => {
      if(TravelInformationRef.value.reifenID == null){
        modalActive.value = true
        return
      }
      console.log('Wizard Completed');
      createInvoice()

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
          closeModal
          
        }

    }

}
</script>

<style>

</style>
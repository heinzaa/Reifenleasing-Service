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
        <h5 >Kontakdaten pflegen</h5>
        <ContactDetails />
        </div>
        <div v-if="currentTabIndex === 1">
        <h5 >Reiseinformationen</h5>
        <TravelInformation />
        </div>
    </Wizard>
</template>

<script>
import 'form-wizard-vue3/dist/form-wizard-vue3.css'
import Wizard from 'form-wizard-vue3'
import { ref } from 'vue'

import ContactDetails from './ContactDetails.vue'
import TravelInformation from './TravelInformation.vue'

export default {
    components:{
        Wizard, ContactDetails, TravelInformation
    },

    setup(){

        const currentTabIndex = ref(0)

       const onChangeCurrentTab = (index, oldIndex) => {
      console.log(index, oldIndex);
      currentTabIndex.value = index;
    }
    const onTabBeforeChange = () => {
      if (currentTabIndex.value === 0) {
        console.log('First Tab');
      }
      console.log('All Tabs');
    }
    const wizardCompleted = () => {
      console.log('Wizard Completed');
    }
      


        return {
          currentTabIndex,
          onChangeCurrentTab,
          onTabBeforeChange,
          wizardCompleted
        }

    }

}
</script>

<style>

</style>
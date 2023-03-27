<template>

    <TemplateHeader />

<div class="heading mt-5">
<p class="heading-text">Kundenübersicht</p>
</div>
        <CustomerOverview />
    
</template>

<script>
import CustomerOverview from '../components/CustomerOverview.vue'
import TemplateHeader from '../components/TemplateHeader.vue'

import { ref } from 'vue'

export default {
    components:{
        CustomerOverview, TemplateHeader
    },

    setup(){

   
    

    return {

    
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
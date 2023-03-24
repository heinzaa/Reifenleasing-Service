<template>
<div class="heading mt-5">
<p class="heading-text">Kundenübersicht</p>
</div>
        <CustomerOverview />
        <button @click="calculate">Calculate</button>
</template>

<script>
import CustomerOverview from '../components/CustomerOverview.vue'
import calculateLeasingPrice from '../composables/calculateLeasingPrice';
import { ref } from 'vue'

export default {
    components:{
        CustomerOverview
    },

    setup(){

    const calculate = ref()
    
    const { price } = calculateLeasingPrice() 

    return {

        calculate

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
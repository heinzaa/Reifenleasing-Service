<template>
<div class="heading mt-5">
<p class="heading-text">Kundenübersicht</p>
</div>
        <CustomerOverview />
</template>

<script>
import CustomerOverview from '../components/CustomerOverview.vue'

export default {
    components:{
        CustomerOverview
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
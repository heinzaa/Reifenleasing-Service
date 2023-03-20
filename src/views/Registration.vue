

<template>
  <div class="heading mt-5">
<p class="heading-text">Reifenleasing-Service</p>
</div>

  <div>
      <RegistrationForm />
  </div>
  

</template>

<script>
import RegistrationForm from '../components/RegistrationForm.vue'


export default {
components: {
  RegistrationForm
}
}
</script>

<style>
.heading{
  text-align: center;
  top: 20px;
}
.heading-text{
    font-size: 3rem;
    font: bold;
}


</style>
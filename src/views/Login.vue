<template>
<div class="heading mt-5">
<p class="heading-text">Reifenleasing-Service</p>
</div>

<div class="content">
  
      <LoginForm />
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'


export default {
components: {
    LoginForm
}
}
</script>

<style scoped>
.content {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.heading{
  text-align: center;
  top: 20px;
}
.heading-text{
    font-size: 3rem;
    font: bold;
}


</style>
<template>
  <nav class="navbar navbar-expand-lg navbar-dark navbar-dark bg-dark">
    <div class="container-fluid">
  <a class="navbar-brand" @click="navToHome">Dashboard</a>
  

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" @click="navToAddCustomer">Kunden anlegen</a>
      </li>
     
    </ul>
    </div>
    <div id="mainmenu" class="collapse navbar-collapse navbar-right justify-content-end">
    <form class="d-flex">
      <button class="btn btn-outline-info my-2 my-sm-0" @click="logout" type="submit">Ausloggen</button>
    </form>
  </div>
  </div>

</nav>       
</template>


<script>

import { useRouter } from 'vue-router';
import { supabase } from '../supabase';

export default {

    setup(){

        const router = useRouter()

        const navToAddCustomer = ( ) => {

            router.push('/addCustomer')

        }

        const navToHome = () => {
            router.push('/Dashboard')
        }

        const logout = () => {


           // const { error } = await supabase.auth.signOut()
            router.push('/Login')
        }

        return {

            navToAddCustomer,
            navToHome,
            logout

        }
    }

   

}
</script>

<style scoped>

a:hover{
    cursor: pointer;
}

</style>
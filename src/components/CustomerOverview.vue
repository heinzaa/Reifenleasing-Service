<template>

<div class="card-side">  
<h1 class="title-kunde mt-3">Angebotsübersicht <span class="badge bg-secondary">Anzahl</span></h1>
<div class="site-container">
<div class="card-container">
  <div class="mb-3" v-for="profile in profiles" :key="profile.id">
    <div class="card">
      <div class="card-body border-3">
        <h5 class="card-title">Kunde{{profile.username}} {{profile.lastName}}</h5>
        <p class="card-text m-0 ">Angelegt am: </p>
        <p class="card-text m-0 ">Entfernung: </p>
        <p class="card-text m-0 ">Preis: </p>
        <p class="card-text mt-0 ">Reifenart: </p>
      <div class="button-details">
       <button type="button" class="btn btn-info">Kunde anzeigen</button>      
      </div>
      </div>
    </div>
  </div>
</div>

<div>
  <button type="button" @click="addCustomer" class="btn btn-info button-add">
    <span class="button-add-text">Kunde anlegen</span>
  </button>
</div>

</div>
</div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { supabase } from '../supabase'
import { useRouter } from 'vue-router';


export default {
  setup() {
    
    const profiles = ref()
    const router = useRouter();

    const newItem = ref({ name: '', age: '', email: '' });
      const addItem = () => {
      items.value.push(newItem.value);
      newItem.value = { name: '', age: '', email: '' };
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles').select('*')
      if (error) {
        return error;
      } else {
        profiles.value = data
      }
    } 

    const addCustomer = () =>{
       router.push('/addCustomer')
    }


    onMounted(fetchUsers);

    return {
      profiles,
      addItem,
      newItem,
      addCustomer
    };
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
.title-kunde{
  text-align: center;
}

.card-side{
  line-height: 1.5;
  background: #f0f4fb;
}

.site-container{
  margin: 3rem auto;
  max-width: calc(100% - 80px);
  background-image: linear-gradient(to right top, #d0e9f4, #b1eaf9, #8bebf8, #5debf0, #12ebe0);}

.card-container{
  display: flex;
  justify-content:space-evenly;
  flex-wrap: wrap;
  align-items: center;
}

.card {
  background: white;
  border-radius: 20px 20px 20px 20px;
  transition: 0.3s;
  width: 250px;
 }

 p{
   font-family: sans-serif;
   font-size: 100%;
   font-size: 16px;
   line-height: 1.5;   
 }

.card:hover{
  box-shadow: 0 4px 20px 0 rgba(34,68,123,0.2);
  cursor: pointer;
}

.card-title{
  margin: 1rem 0;
  color: #22447b;
}

.card-body{
  display: block;
}

.button-details{
  text-align: center;
}

.icon-add{
  width: 2rem;
  height: 1.5em;
}

.button-add{
  display: inline-flex;
  height: 50px;
  padding: 0;
  border: none;
  outline: none;
  overflow: hidden;
  cursor: pointer;
}

.button-add-text, .button-add-icon{
  display: inline-flex;
  align-items: center;
  padding: 0 24px;
  height: 100%;
  color: aliceblue;
}


button{
  color: aliceblue;
}

button:hover{
  filter: brightness(95%);
  color: aliceblue;
}

</style>

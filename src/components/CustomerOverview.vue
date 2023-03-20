<template>


<NoCustomerExist :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal">
            <div>
                 <b-icon-send-check style="font-size:3em; margin:15px; color:green;"></b-icon-send-check> 
                <h2>Es sind noch keine Kunden vorhanden.</h2>
                <p>Bitte legen Sie Ihren ersten Kuden an!</p>
            </div>
        </NoCustomerExist>

<div class="row row-cols-1 row-cols-md-4 g-4 m-auto justify-content-center">
  <div class="col" v-for="existingContract in existingContracts" :key="existingContract.id" >
    <div class="card h-100">
      <img src="https://mdbcdn.b-cdn.net/img/new/standard/city/041.webp" class="card-img-top"
        alt="Hollywood Sign on The Hill" />
      <div class="card-body">
        <h5 class="card-title">{{existingContract.firstName}} {{existingContract.lastName}}</h5>
        <p class="card-text m-0 ">Email: {{ existingContract.eMail }} </p>
        <p class="card-text m-0 ">Entfernung: {{ existingContract.fahrstrecke }} </p>
        <p class="card-text m-0 ">Preis: {{ existingContract.basispreis }} €</p>
        <p class="card-text mt-0 ">Reifenart: {{ existingContract.reifenname }}</p>            
      </div>
      <div class="card-footer">
        <small class="text-muted">Angelegt am: {{ existingContract.timestap }}</small>
      </div>
      <div class="button-details m-3">
       <button type="button" @click="showCustomer(existingContract.id)" class="btn btn-outline-info btn-rounded">Kunde anzeigen</button>      
      </div>
    </div>
  </div>
</div>

<div v-if="!modalActive" class="u-center-text u-margin-top-huge mt-2">
  <button type="button" @click="addCustomer" class="btn btn--green">Kunden anlegen</button>
</div>


</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { supabase } from '../supabase'
import { useRouter } from 'vue-router';
import NoCustomerExist from './Modals/NoCustomerExist.vue'


export default {

  components:{
    NoCustomerExist
  },

  setup() {

   
    
    const router = useRouter();
    const existingContracts = ref()
    const loading = ref(false)
    const modalActive = ref(false)
    

    onMounted( async ()  => {
      existingContracts.value =  await fetchUsers()
      if(existingContracts.value.length == 0){
        modalActive.value = true;
      }
    })

    const fetchUsers = async () => {
            try{
            const { data, error } = await supabase
                .from('rechnungsinformationen')
                .select()

            if (error){
                throw error
            }
            if (data){
                return data
            } 
            } catch (error){
                alert(error.message)
            } finally {
                loading.value = false
            } 
        }
    
    const showCustomer = (contractID) => {
      const id = contractID
      router.push({ name: "contract", params: { id: id } });
    }

    const addCustomer = () =>{
       router.push('/addCustomer')
    }

    const closeModal = () =>{
      modalActive.value = false
    }


    return {
      addCustomer,
      fetchUsers, 
      existingContracts,
      loading, 
      showCustomer,
      modalActive,
      closeModal

    };
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');

.headline{
  text-align: center;
}
.button-details{
  display: flex;
  justify-content: center;
}
.u-center-text {
  text-align: center !important;
}
.btn, .btn:link, .btn:visited {
  text-transform: uppercase;
  text-decoration: none;
  padding: 1.5rem 4rem;
  display: inline-block;
  border-radius: 0.5rem;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  position: relative;
  font-size: 1rem;
  cursor: pointer;
}

.btn:hover {
  -webkit-transform: translateY(-3px);
          transform: translateY(-3px);
  -webkit-box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.btn:hover::after {
  -webkit-transform: scaleX(1) scaleY(1.2);
          transform: scaleX(1) scaleY(1.2);
  opacity: 0;
}

.btn:active, .btn:focus {
  outline: none;
  -webkit-transform: translateY(-1px);
          transform: translateY(-1px);
  -webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
}


.btn--green {
  background: -webkit-gradient(linear, left top, right top, from(#EA6F25), to(#1F69CA));
  background: linear-gradient(to right, #EA6F25, #1F69CA);
  color: #fff;
}

.btn--green::after {
  background-color: #55c57a;
}

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: inherit;
          box-sizing: inherit;
}

</style>

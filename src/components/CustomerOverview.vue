<template>


<NoCustomerExist :modal-active="modalActive" @close="navToDashboard" @cancel="closeModal">
            <div>
                 <b-icon-send-check style="font-size:3em; margin:15px; color:green;"></b-icon-send-check> 
                <h2>Es sind noch keine Kunden vorhanden.</h2>
                <p>Bitte legen Sie Ihren ersten Kuden an!</p>
            </div>
</NoCustomerExist>

<div class="row row-cols-1 row-cols-md-5 g-5 m-auto justify-content-center">
  <div class="col" v-for="existingContract in existingContracts" :key="existingContract.id" >
    <div class="card h-80">
      <img :src="randomImage(images)" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title">{{existingContract.firstName}} {{existingContract.lastName}}</h5>
        <p class="card-text m-0 "><strong>ID:</strong> {{ existingContract.id }} </p>
        <p class="card-text m-0 "><strong>Distanz:</strong> {{ existingContract.fahrstrecke  }} km </p>
        <p class="card-text m-0 "><strong>Preis:</strong> {{ existingContract.preis }} €</p>
        <p class="card-text m-0 "><strong>Von:</strong> {{ existingContract.startpunkt_adress_infos.city }} - {{  existingContract.startpunkt_adress_infos.road }} </p>
        <p class="card-text m-0 "><strong>Nach:</strong> {{existingContract.endpunkt_adress_infos.city}} - {{existingContract.startpunkt_adress_infos.road}} </p>
        <p class="card-text mt-0"><strong>Reifenklasse</strong> {{ existingContract.reifenklasse }}</p>            
      </div>
      <div class="card-footer">
        <small class="text-muted"><strong>Angelegt am: </strong> {{ existingContract.created_at }}</small>
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

    const images = ref(['https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704__340.jpg','https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072__340.jpg', 
                    'https://cdn.pixabay.com/photo/2016/03/04/19/36/beach-1236581__340.jpg', 'https://cdn.pixabay.com/photo/2020/04/17/20/25/road-5056788__340.jpg',
                   'https://cdn.pixabay.com/photo/2015/03/02/23/40/father-656734__340.jpg', 'https://cdn.pixabay.com/photo/2017/01/08/19/30/rio-de-janeiro-1963744__340.jpg' ])

    
    function randomImage(images) {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }
    
    const router = useRouter();
    const existingContracts = ref()
    const loading = ref(false)
    const modalActive = ref(false)


    

    onMounted( async ()  => {
      existingContracts.value =  await fetchUsers()
      if(existingContracts.value.length == 0){
        modalActive.value = true;
      }

    
    convertTimestamp()
    convertDistance()
      


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

    const convertTimestamp = () => {
      

      for(let i = 0; i < existingContracts.value.length; i++){
        let date = new Date(existingContracts.value[i].created_at)
        existingContracts.value[i].created_at = date.toLocaleDateString()

      }


    }

    const convertDistance = () => {
      for(let i = 0; i < existingContracts.value.length; i++){
        existingContracts.value[i].fahrstrecke = (existingContracts.value[i].fahrstrecke / 1000).toFixed(2)
      }
    }


    return {
      addCustomer,
      fetchUsers, 
      existingContracts,
      loading, 
      showCustomer,
      modalActive,
      closeModal,
      convertTimestamp,
      convertDistance,
      images,
      randomImage

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

.card-img-top{
  width: auto;
  height: 200px;

}

</style>

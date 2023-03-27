<template>
    <TemplateHeader />
 
    
<div class="mt-5 d-flex flex-lg-row justify-content-center">
   
    <h1>Kundenübersicht</h1>

</div>


<div class="container">
    <div class="row">
        <div class="col-md-6 col-md-offset-3 body-main">
            <div class="col-md-12">
               <div class="row">
                    <div class="col-md-4">
                        <img class="img" alt="Invoce Template" src="http://pngimg.com/uploads/shopping_cart/shopping_cart_PNG59.png" />
                    </div>
                    <div class="col-md-8 text-right">
                        <h4 style="color: #F81D2D;"><strong>{{ oInvoiceInformation[0].firstName }} {{ oInvoiceInformation[0].lastName }}</strong></h4>
                        <p>{{ oInvoiceInformation[0].street }}</p>
                        <p>{{ oInvoiceInformation[0].zipCode }} {{ oInvoiceInformation[0].city }}</p>
                        <p>{{ oInvoiceInformation[0].eMail }}</p>
                    </div>
                </div>
                <br />
                <div class="row mb-2">
                    <div class="col-md-12 text-center">
                        <h2><u>Rechnung</u></h2>
                        <h6>{{ oInvoiceInformation[0].id }}</h6>
                    </div>
                </div>
                <div>
                    <h2 class="mb-3"><u>Reiseinformationen</u></h2>
                    <p><strong>Zurückgelegte Streck: </strong>{{ (oInvoiceInformation[0].fahrstrecke / 1000).toFixed(2) }} Km</p>
                    <p><strong>Roughness Indicator:</strong>  {{ oInvoiceInformation[0].iri }}</p>
                    <p><strong>Reifenklasse: </strong>{{ oInvoiceInformation[0].reifenklasse }}</p>
                    <p><strong>Reifenname: </strong> {{ oInvoiceInformation[0].reifenname }}</p>
                    <p><strong>Hersteller: </strong>{{ oInvoiceInformation[0].hersteller }}</p>
                    <p><strong>Basispreis</strong> {{ oInvoiceInformation[0].basispreis }}</p>
                    <p><strong>Von</strong> {{oInvoiceInformation[0].startpunkt_adress_infos.city || oInvoiceInformation[0].startpunkt_adress_infos.city_district}} - {{oInvoiceInformation[0].startpunkt_adress_infos.road}}</p>
                    <p><strong>Nach</strong> {{oInvoiceInformation[0].endpunkt_adress_infos.city}} - {{oInvoiceInformation[0].endpunkt_adress_infos.road}}</p>
                </div>
                <br />
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><h5>Beschreibung</h5></th>
                                <th><h5>Preis</h5></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="col-md-9">Servicegebühren</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> {{servicePrice}} €</td>
                            </tr>
                            <tr>
                                <td class="col-md-9">Leasingpreis</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> {{ oInvoiceInformation[0].preis }} € </td>
                            </tr>
                            <tr>
                                <td class="col-md-9">Rabatt</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> {{ discountPrice }} € </td>
                            </tr>
                            <tr>                              
                            </tr>
                            <tr style="color: #F81D2D;">
                                <td class="text-right"><h4><strong>Gesamtpreis:</strong></h4></td>
                                <td class="text-left"><h4><strong><i class="fas fa-rupee-sign" area-hidden="true"></i> {{ payableAmount }} € </strong></h4></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <div class="col-md-12">
                        <p><b>Datum:</b> {{convertDate}}</p>
                        <br />
                        <p><b>Unterschrift</b></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


</template>

<script>
import { ref, onMounted, onBeforeMount } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router';
import TemplateHeader from '../components/TemplateHeader.vue';
import exp from 'constants';

export default {
    props: ["id"],
    components:{
         TemplateHeader
    },

    setup(props){

    

        const router = useRouter()

        const oInvoiceInformation = ref('')
        const loading = ref(false)
        // Konstanter Servicezuschlag
        const servicePrice = ref(10.00)
        // 5% ist der Standard Rabatt
        const discount = ref(0.05)
        const discountPrice = ref()
        const payableAmount = ref()
        
        const convertDate = ref()

        const toDashboard = () => {
            router.push('/Dashboard')
        }

        const fetchInvoiceInformation = async () => {
            loading.value = true
            try{
            const { data, error } = await supabase
                .from('rechnungsinformationen')
                .select()
                .eq('id', `${props.id}` )

            if (error){
                throw error
            }
            if (data){
                oInvoiceInformation.value = data
                console.log("Daten:" + oInvoiceInformation.value )
            } 
            } catch (error){
                alert(error.message)
            } finally {
                loading.value = false
            } 
        }

        onBeforeMount( async () => {

          await fetchInvoiceInformation();

          discountPrice.value = (oInvoiceInformation.value[0].preis *  discount.value).toFixed(2) 
          payableAmount.value = oInvoiceInformation.value[0].preis - discountPrice.value + servicePrice.value
          
          let date = new Date(oInvoiceInformation.value[0].created_at)
          convertDate.value = date.toLocaleDateString()
          
        })




        return {
            fetchInvoiceInformation,
            loading,
            oInvoiceInformation,
            servicePrice,
            discount,
            discountPrice,
            payableAmount,
            convertDate,
            toDashboard

        }

    }

}
</script>

<style scoped>
.body-main {
        background: #ffffff;
        border-bottom: 10px solid #1E1F23;
        border-top: 10px solid #1E1F23;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px 10px !important;
        position: relative ;
        box-shadow: 0 1px 21px #808080;
        font-size:10px;
    }

    .main thead {
		background: #1E1F23;
        color: #fff;
		}
    .img{
        height: 100px;}
    h1{
       text-align: center;
    }

    .row{
        justify-content: center;
    }

    p{
        line-height: 50%;
    }
    a {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
}

a:hover {
  background-color: #ddd;
  color: black;
}

.previous {
  background-color: #f1f1f1;
  color: black;
}

p {
    font-size: 1rem;
}
td{
    font-size:  0.9rem;
}


</style>
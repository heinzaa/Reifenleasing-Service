<template>
 <div class="container">

<div class="page-header">
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
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h2>Rechnung</h2>
                        <h5>{{ oInvoiceInformation[0].id }}</h5>
                    </div>
                </div>
                <div class="column">
                    <h5>Reiseinformationen</h5>
                    <p>{{ oInvoiceInformation[0].fahrstrecke }} Km</p>
                    <p>{{ oInvoiceInformation[0].reifenklasse }} - {{ oInvoiceInformation[0].reifenname }} - {{ oInvoiceInformation[0].hersteller }}</p>
                </div>
                <br />
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><h5>Description</h5></th>
                                <th><h5>Amount</h5></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="col-md-9">Samsung Galaxy 8 64 GB</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> 50,000 </td>
                            </tr>
                            <tr>
                                <td class="col-md-9">JBL Bluetooth Speaker</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> 5,200 </td>
                            </tr>
                            <tr>
                                <td class="col-md-9">Apple Iphone 6s 16GB</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> 25,000 </td>
                            </tr>
                            <tr>
                                <td class="col-md-9">MI Smartwatch 2</td>
                                <td class="col-md-3"><i class="fas fa-rupee-sign" area-hidden="true"></i> 2,200 </td>
                            </tr>
                            <tr>
                                <td class="text-right">
                                <p>
                                    <strong>Shipment and Taxes:</strong>
                                </p>
                                <p>
                                    <strong>Total Amount: </strong>
                                </p>
							    <p>
                                    <strong>Discount: </strong>
                                </p>
							    <p>
                                    <strong>Payable Amount: </strong>
                                </p>
							    </td>
                                <td>
                                <p>
                                    <strong><i class="fas fa-rupee-sign" area-hidden="true"></i> 500 </strong>
                                </p>
                                <p>
                                    <strong><i class="fas fa-rupee-sign" area-hidden="true"></i> 82,900</strong>
                                </p>
							    <p>
                                    <strong><i class="fas fa-rupee-sign" area-hidden="true"></i> 3,000 </strong>
                                </p>
							    <p>
                                    <strong><i class="fas fa-rupee-sign" area-hidden="true"></i> 79,900</strong>
                                </p>
							    </td>
                            </tr>
                            <tr style="color: #F81D2D;">
                                <td class="text-right"><h4><strong>Total:</strong></h4></td>
                                <td class="text-left"><h4><strong><i class="fas fa-rupee-sign" area-hidden="true"></i> 79,900 </strong></h4></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <div class="col-md-12">
                        <p><b>Date :</b> 6 June 2019</p>
                        <br />
                        <p><b>Signature</b></p>
                    </div>
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

export default {
    props: ["id"],

    setup(props){

        const oInvoiceInformation = ref(null)
        const loading = ref(false)

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

        })




        return {
            fetchInvoiceInformation,
            loading,
            oInvoiceInformation
        }

    }

}
</script>

<style scoped>
.body-main {
        background: #ffffff;
        border-bottom: 15px solid #1E1F23;
        border-top: 15px solid #1E1F23;
        margin-top: 30px;
        margin-bottom: 30px;
        padding: 40px 30px !important;
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




</style>
import { ref, watchEffect } from 'vue'
import { supabase } from '../supabase'
import axios from 'axios';

const calculateLeasingPrice = async () => {

    const aInstrcutions = ref()

    const { data, error } = await supabase
              .from('Reiseinformationen')
              .select()
              
          if (data){

            aInstrcutions.value = data[0].straßeninfos
            
          }
          if (error){
              throw error
          } 

    
          // jetzt habe ich alle Straßeninfos

          // Straßenroughness Daten laden

          let roughnessData = {
            url: 'https://www.data.qld.gov.au/api/3/action/datastore_search', // api url
            resource_id: 'd618ce2e-7d29-4569-97bd-d97bd5831924', // the resource id
            limit: 100000, // get 5 results
            q: 'jones' // query for 'jones'
          };

        // Example with limit
        //const response =  await axios.get(`${roughnessData.url}?resource_id=${roughnessData.resource_id}&limit=${roughnessData.limit}`)

        // Example without limit
         const response =  await axios.get(`${roughnessData.url}?resource_id=${roughnessData.resource_id}&limit=${roughnessData.limit}`)


        let aRoughness = response.data.result.records

        let oRoughnessMatchedCoordinates = {}


        for ( let i = 0; i < aInstrcutions.value.length; i++){

            // In der Roughness Tabelle 
            
            // alle Poinst durchgehen & zu jedem Point den Roughnesfaktor + beschreibung dazulesen
            // alle Koordinaten müssen auf 4 nachkommastellen gefixed werden, da sonst keine Übereinstimmungen gefunden werden
            for( let y = 0; y < aInstrcutions.value[i].points.length; y++ ){

                // Objekt aus aRoughness holen mit den Koordinaten
                oRoughnessMatchedCoordinates = aRoughness.find(item => item.Latitude.toFixed(3) ===  aInstrcutions.value[i].points[y]['1'].toFixed(3)
                                                                    && item.Longitude.toFixed(3) === aInstrcutions.value[i].points[y]['0'].toFixed(3));

                // Objekt in das Instructions Array schreiben
                if (oRoughnessMatchedCoordinates === undefined){
                    // wenn keine matchenden Daten gefunden werden, wird ein leeres Objekt reingeschrieben / damit ist es nicht mehr undefined
                    aInstrcutions.value[i].points[y]['RoughnessInformation'] = {}
                }else{
                aInstrcutions.value[i].points[y]['RoughnessInformation'] = oRoughnessMatchedCoordinates
                }

                // Objekt leeren
                oRoughnessMatchedCoordinates = {}

            }
        
        }

        console.log(aInstrcutions.value.points)



        
        

        for( let i = 0; i < aInstrcutions.value.length; i++){

            
            // berechne durchschnittliche RoughnessPoints für intervall und setze es in Beziehung mit der Länge

            // schaue wie viele RoughnessObjekte gibt es in einem Intervall ? -> Anzahl der points im intervall

            let maxRoughnessPoints = aInstrcutions.value[i].points.length

            let sumRoughnessPoints = 0;
            let averageRouhnessPoints = 0;
            let count = 0;

            // schaue wie viele RoughnessPoints-Objekte sind nicht leer
            for(let y = 0; y < aInstrcutions.value[i].points.length; y++){
                

                // hat das RoughnessInformation-Objekt Keys, ist es gefüllt & es gab Übereinstimmungen zwischen der Route & dem Datenset Australia
                // Anzahl der bestimmen und die Rougnesspunkte zusammenzählen um einen durchschnitt zu bilden
                if(Object.keys(aInstrcutions.value[i].points[y]['RoughnessInformation']).length > 0 ){
                    count++

                    sumRoughnessPoints += aInstrcutions.value[i].points[y]['RoughnessInformation'].IRIRoughness

                }


            }

            // es wird gerundet -> dann kann es später in die RoughnessKlassen zugeordnet werden
            // 1 = Very poor
            // 2 = Poor
            // 3 = Fair
            // 4 = Good
            // 5 = Very Good
            if(sumRoughnessPoints == 0 || count == 0 ){
                aInstrcutions.value[i]['AverageRoughnessPoints'] = 0
            continue
            }else{
            averageRouhnessPoints = Math.round(sumRoughnessPoints / count)      
            // AveragRoughnessPoints werden in dem entsprechenden Intervall gespeichert
            aInstrcutions.value[i]['AverageRoughnessPoints'] = averageRouhnessPoints
            }

            // Roughnessdurchscnnitt berechnen für das PointsIntervall

        }



        // Jetzt steht in jedem Intervall auf Kopfebene der Durchschnittliche RoughnessFaktor
        // Da die intervalle unterschiedliche Distanzen abbilden, müssen die roughnessfaktoren in das Verhältnis zu den Distanzen gesetzt werden

        // Erklärung
        // Die Distanz des Intervalls wird mit dem durchschnittlichen Roughnessfaktor des Intervalls multipliziert

        let accountedIntervallDistanceAndRoughnessFaktor = 0;
        let accountedDistance = 0;

        for( let i = 0; i < aInstrcutions.value.length; i++){

            
            let roughnessFaktor = aInstrcutions.value[i].AverageRoughnessPoints

            if(roughnessFaktor == 0){
                continue
            }
            else{
                let distanceForIntervall = aInstrcutions.value[i].distance
                accountedIntervallDistanceAndRoughnessFaktor += roughnessFaktor * distanceForIntervall
                accountedDistance += distanceForIntervall
            }

            


        }


        // Jetzt kann der Durchschnittliche Roughnessfaktor berechnet werden für die Gesamtstrecke
        // dafür wird accountedIntervallDistanceAndRoughnessFaktor durch die Gesamtdistanz geteilt

        const averageRoughnessForRoad = Math.round(accountedIntervallDistanceAndRoughnessFaktor / accountedDistance)

        // jedes 


        console.log('Rougness: ' + averageRoughnessForRoad)




    return { leasingPrice }
}

export default calculateLeasingPrice
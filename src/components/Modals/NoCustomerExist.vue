<template>
    
    <transition name="model-animation">
      <div v-show="modalActive" class="modal content">
        <transition name="model-animation-inner">
          <div v-show="modalActive" class="modal-inner">
            <slot />
            <button type="button" class="btn btn-outline-secondary mt-2" @click="cancel">Schließen</button>
          </div>
        </transition>
      </div>
    </transition>
    
  </template>
  
  <script>

  import { ref, onMounted } from 'vue';
  export default {
    components:{
       
    },
    props: ["modalActive"],
    setup(props, {emit}){
  
    
      
      const close = () => {
        emit('close');
      }
      const cancel = () =>{
        emit('cancel');
      }
  
  
      return {close, cancel}
    }
  }
  </script>
  
  <style  scoped>
  
  .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30%;
      width: 30%;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgb(0, 0, 0, 0);
      border: 3px solid grey;
      border-radius: 20px;
  }
  
  .modal-inner {
      position: relative;
      max-width: 1000px;
      background-color: #fff;
      padding: 20px;
      margin: 0.75rem;
      text-align:center;
      border-radius: 10px;
  }
  
  .model-animation-enter-active,
  .model-animation-leave-active {
      transition: opacity 1s cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }
  
  .model-animation-enter-from,
  .model-animation-leave-to {
      opacity: 0;
  }
  
  .modal-animation-inner-enter-active {
      transition: all 1s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15;
  }
  .modal-animation-inner-leave-active {
      transition: all 1s cubic-bezier(0.52, 0.02, 0.19, 1.02);
  }
  .modal-animation-inner-enter-from {
      opacity: 0;
      transform: scale(0.8);
  }
  .modal-animation-inner-leave-to {
      transform: scale(0.8);
  }
  .content{
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  
  </style>
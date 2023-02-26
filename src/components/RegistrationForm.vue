<template>
  <div class="registration-form">
    <h1>Registrierung</h1>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">E-Mail-Adresse:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <button type="submit">Registrieren</button>
      </div>
        <p>Bereits registriert? ➜ <span id="Login-Id" @click="enterLoginView">Login</span></p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router';


export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter();

    const registerUser = async () => {
      try {
        const { user, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value
        })

        if (error) {
          throw new Error(error.message)
        }

        console.log('Registered user:', user)

        // Weiterleitung zur Anmeldeseite
        router.push('/Login')

      } catch (error) {
        console.error('Error registering user:', error)
      }
    }
    const enterLoginView = () => {
           console.log("router" + router)
            router.push('/Login')
        };
    return { email, password, registerUser, enterLoginView }
  }
}
</script>
<style scoped>

#Login-Id:hover{
    cursor: pointer;
    color:  green;
}

.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25rem;
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

label {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  border: none;
}
</style>
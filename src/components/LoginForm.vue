<template>
  <form @submit.prevent="loginUser">
    <div>
      <label for="email">E-Mail</label>
      <input type="email" id="email" v-model="email" required>
    </div>
    <div>
      <label for="password">Passwort</label>
      <input type="password" id="password" v-model="password" required>
    </div>
    <button type="submit">Anmelden</button>
  </form>
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
    
    const loginUser = async () => {
      try {
        const { user, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

        if (error) {
          throw new Error(error.message)
        }

        console.log('Logged in user:', user)

        // Weiterleitung zur Startseite nach dem erfolgreichen Login
        router.push('/Dashboard')
      } catch (error) {
        console.error('Error logging in user:', error)
      }
    }

    return { email, password, loginUser }
  }
}
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 400px;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f5f5f5;
  box-shadow: 0 4px 8px rgba(30, 30, 30, 0.1);
}

div {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
}

label {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

input {
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;
}

input:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

button {
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background-color: #00a8cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  cursor: pointer;
  background-color: #008da6;
}
</style>
<script setup>
    import { ref } from 'vue'
    import router from '@/router';

    import submitName from '@/api/login';

    const nameValid = ref(true);
    const loginError = ref(false)

    const form = ref({ name: '' })

    const submit = async () => {
        const name = form.value.name;

        if (name.length < 3 || name.length > 10) {
            nameValid.value = false;
            return;
        }

        try {
            await submitName(form.value.name)
            router.push('/chat')
        } catch(error) {
            console.error(error)
            loginError.value = true;
        }
    }
</script>

<template>
    <div class="flex min-h-screen justify-center">
        <div class="content-center">
            <div class="card bg-white">
                <div class="card-body">
                    <form @submit.prevent="submit">
                        <div class="grid grid-cols-1">
                            <p class="text-black">Welcome to</p>
                            <figure class="w-xs">
                                <img src="@/assets/img/logo.png" alt="Shoes" />
                            </figure>
                            <p class="text-black text-center mt-2">The over-bubble voice messaging app</p>
                        </div>
                        <div class="grid grid-cols-1">
                            <label for="" class="font-bold text-black">Name</label>
                            <input type="text" :class="nameValid?'input input-neutral':'input input-error'" v-model="form.name" placeholder="Enter your name" minlength="3" maxlength="10">
                            <p :class="nameValid?'hidden':'text-error'">Please enter a valid name</p>
                            <p v-if="loginError" class="text-error">An error ocurred while connecting to the server</p>
                        </div>
                        <div class="card-actions justify-center mt-4">
                            <button class="btn btn-success" @click="submit">Start chatting</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
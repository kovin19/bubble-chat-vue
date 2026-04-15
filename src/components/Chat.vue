<script setup>
    import { onMounted, ref, nextTick } from 'vue'
    import { onBeforeRouteLeave } from 'vue-router';
    import router from '@/router';

    import { blowBubble, stopBlowingBubble } from '@/composables/chat/bubble';
    import { connectToWebSocket, closeWebSocket } from '@/composables/chat/websocket';

    import cursorImg from '@/assets/img/wand.png'
    
    const bubbleArea = ref(null);

    const showConnectingToast = ref(false);
    const showConnectedToast = ref(false);
    const showErrorConnectingToast = ref(false);
    const connectedToServer = ref(false)
    const name = ref(null)

    onMounted(async () => {
        showConnectingToast.value = true;

        connectToWebSocket({
            onOpen: async () => {
                showConnectingToast.value = false

                showConnectedToast.value = true;
                setTimeout(() => { showConnectedToast.value = false; }, 3000);

                connectedToServer.value = true;

                await nextTick();
        
                const canvas = bubbleArea.value;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            },
            onError: () => {
                showErrorConnectingToast.value = true
                setTimeout(() => { router.push('/') }, 3000);
            },
            onClose: () => {
                
            },
            onMessage: (event) => {
                const dataJson = JSON.parse(event.data);
                name.value = dataJson.name;
            }
        })
    })

    onBeforeRouteLeave(() => {
        closeWebSocket();
    })
</script>

<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="shrink-0 border-b-2 py-2 bg-cyan-600">
            <div class="flex flex-row">
                <RouterLink to="/">
                    <button class="btn btn-flat mt-4 ms-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        Go back
                    </button>
                </RouterLink>
            </div>
            <div class="text-center">
                <h1 class="text-4xl">{{ name }}</h1>
                <h2 class="text-lg">Talking to: Someone</h2>
                <div class="badge badge-success">Connected</div>
            </div>
        </div>
        <div class="flex-1 min-h-0" v-if="connectedToServer">
            <canvas class="w-full h-full block" ref="bubbleArea" @mousedown="blowBubble" @mouseup="stopBlowingBubble" :style="{ cursor: `url(${cursorImg}), auto` }"></canvas>
        </div>
    </div>

    <div v-if="showConnectingToast" ref="connectingToast" class="toast toast-top toast-end">
        <div class="alert alert-info">
            <span class="text-xl">Connecting to server...</span>
        </div>
    </div>

    <div v-if="showConnectedToast" ref="connectedToast" class="toast toast-top toast-end">
        <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <span class="text-xl">You are now connected!</span>
        </div>
    </div>

    <div v-if="showErrorConnectingToast" ref="connectedToast" class="toast toast-top toast-end">
        <div class="alert alert-error">
            <span class="text-xl">An error ocurred while trying to connect to server</span>
        </div>
    </div>
</template>
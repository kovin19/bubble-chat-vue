<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import router from '@/router'

import { blowBubble, stopBlowingBubble } from '@/composables/chat/bubble'
import { connectToWebSocket, closeWebSocket } from '@/websockets/chat'

import cursorImg from '@/assets/img/wand.png'

const bubbleArea = ref(null)

const showConnectingToast = ref(false)
const showConnectedToast = ref(false)
const showErrorConnectingToast = ref(false)
const connectedToServer = ref(false)
const matchedUserDisconnected = ref(false)
const name = ref(null)
const someone = ref(null)

onMounted(async () => {
  showConnectingToast.value = true

  connectToWebSocket({
    onOpen: async (event) => {
      showConnectingToast.value = false

      showConnectedToast.value = true
      setTimeout(() => {
        showConnectedToast.value = false
      }, 3000)

    },
    onError: () => {
      showErrorConnectingToast.value = true
      setTimeout(() => {
        router.push('/')
      }, 3000)
    },
    onClose: () => {},
    onMessage: async (event) => {
      const dataJson = JSON.parse(event.data)

      switch(dataJson.type) {
        case 'connected':
          name.value = dataJson.name
          break;
        case 'matched_user':
          connectedToServer.value = true;
          someone.value = dataJson.connected_user_name;
          await nextTick()

          const canvas = bubbleArea.value
          const rect = canvas.getBoundingClientRect()
          canvas.width = rect.width
          canvas.height = rect.height

          matchedUserDisconnected.value = false;

          break;
        case 'matched_user_disconnected':
          connectedToServer.value = false;
          someone.value = null;
          matchedUserDisconnected.value = true 
          setTimeout(() => {
            matchedUserDisconnected.value = false
          }, 3000)
          break;
      }
    },
  })
})

onBeforeRouteLeave(() => {
  closeWebSocket()
})
</script>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <div class="row-span-full bg-amber-300">
        <div class="grid grid-cols-8">
            <div class="col-span-1 content-center">
                <RouterLink to="/">
                    <button class="btn btn-success ms-4 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                        </svg>
                        Go back
                    </button>
                </RouterLink>
            </div>
            <div class="col-span-2 col-start-4 content-center text-center mb-4 mt-4">
                <p class="text-sm font-bold mb-1">Talking to</p>
                <div class="badge badge-success text-3xl py-5">
                  <div class="flex flex-row text-lg font-bold" v-if="!connectedToServer">
                    <span class="loading loading-spinner loading-md me-2"></span>
                    <p>Finding someone…</p>
                  </div>
                  <div v-else>
                    <div class="font-bold">{{ someone }}</div>
                  </div>
                </div>
            </div>
            <div class="col-span-2 col-start-7 content-center">
                <div class="flex flex-row justify-end me-3">
                    <div class="dropdown">
                        <div tabindex="0" role="button" class="btn btn-ghost py-8 hover:btn-success">
                            <div class="flex flex-col items-end leading-tight">
                                <p class="text-3xl font-bold"> {{ name }}</p>
                            </div>
                            <div class="avatar">
                                <div class="w-12 rounded-full">
                                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                                </div>
                            </div>
                        </div>
                        <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li>
                                <a href="">Hello</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-1 min-h-0" v-if="connectedToServer">
      <canvas class="w-full h-full block" ref="bubbleArea" @mousedown="blowBubble" @mouseup="stopBlowingBubble" :style="{ cursor: `url(${cursorImg}), auto` }"></canvas>
    </div>
  </div>

  <div v-if="showConnectingToast" ref="connectingToast" class="toast toast-top toast-end mt-22">
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span class="text-xl">Connecting to server...</span>
    </div>
  </div>

  <div v-if="matchedUserDisconnected" ref="connectingToast" class="toast toast-top toast-end mt-22">
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
      <span class="text-xl">Matched user disconnected</span>
    </div>
  </div>

  <div v-if="showConnectedToast" ref="connectedToast" class="toast toast-top toast-end mt-22">
    <div class="alert alert-success">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
      </svg>
      <span class="text-xl">You are now connected!</span>
    </div>
  </div>

  <div v-if="showErrorConnectingToast" ref="connectedToast" class="toast toast-top toast-end mt-22">
    <div class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span class="text-xl">An error ocurred while trying to connect to server</span>
    </div>
  </div>
</template>

<template>
  <div class="h-screen overflow-hidden flex flex-col">
    <div class="row-span-full bg-amber-300">
        <div class="grid grid-cols-8">
            <div class="col-span-1 content-center">
                <RouterLink to="/">
                    <button class="btn ms-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/>
                        </svg>
                        Go back
                    </button>
                </RouterLink>
            </div>
            <div class="col-span-2 col-start-4 content-center text-center mb-4 mt-4">
                <p class="text-sm">Talking to</p>
                <div class="badge badge-primary text-3xl py-5">
                    <div class="font-bold">
                        Someone
                    </div>
                </div>
            </div>
            <div class="col-span-2 col-start-7 content-center">
                <div class="flex flex-row justify-end me-3">
                    <div class="dropdown">
                        <div tabindex="0" role="button" class="btn btn-ghost py-8">
                            <div class="flex flex-col items-end leading-tight">
                                <p class="text-3xl">Kovin</p>
                                <div class="badge badge-xs badge-success">Online</div>
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
    <div class="flex-1 min-h-0">
      <canvas class="w-full h-full block" ref="bubbleArea"></canvas>
    </div>
  </div>
</template>
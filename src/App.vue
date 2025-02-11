<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-white to-nirvana-silver relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full opacity-5 dollhouse-pattern"></div>
      <template v-for="n in 5" :key="n">
        <div 
          class="absolute animate-float"
          :style="{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${n * 0.5}s`
          }"
        >
          <div class="w-4 h-12 bg-nirvana-blue/20 rounded-full transform rotate-45"></div>
        </div>
      </template>
    </div>

    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-sm shadow-md border-b border-nirvana-blue/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <img 
                class="h-8 w-8 sm:h-10 sm:w-10" 
                src="/nirvana-logo.png" 
                alt="Nirvana"
                loading="eager"
              >
              <span class="text-lg sm:text-xl font-semibold text-nirvana-blue">
                Nirvana's Birthday Wishes
              </span>
            </router-link>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link
              v-for="link in navigation"
              :key="link.to"
              :to="link.to"
              :class="[ 
                'transition-colors duration-200',
                link.primary 
                  ? 'px-4 py-2 bg-nirvana-blue text-white rounded-lg hover:bg-blue-700 font-medium'
                  : 'px-4 py-2 bg-white text-nirvana-blue rounded-lg hover:bg-gray-100 font-medium shadow-sm border border-gray-200'
              ]"
            >
              {{ link.text }}
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden flex flex-col justify-center items-center h-16 w-16 bg-nirvana-blue text-white gap-1.5"
            aria-label="Toggle menu"
          >
            <span v-if="!isMenuOpen" class="w-7 h-0.5 bg-current transition-all"></span>
            <span v-if="!isMenuOpen" class="w-7 h-0.5 bg-current transition-all"></span>
            <span v-if="!isMenuOpen" class="w-7 h-0.5 bg-current transition-all"></span>
            <component 
              v-else 
              :is="XIcon" 
              class="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div 
        v-show="isMenuOpen" 
        class="md:hidden bg-white border-t border-gray-200"
      >
        <div class="px-4 py-2 space-y-2">
          <router-link
            v-for="link in navigation"
            :key="link.to"
            :to="link.to"
            :class="[ 
              'block w-full transition-colors duration-200',
              link.primary
                ? 'px-4 py-2 bg-nirvana-blue text-white rounded-lg hover:bg-blue-700 font-medium'
                : 'px-4 py-2 bg-white text-nirvana-blue rounded-lg hover:bg-gray-100 font-medium shadow-sm border border-gray-200'
            ]"
            @click="isMenuOpen = false"
          >
            {{ link.text }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main content with loading state -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      <router-view v-slot="{ Component, route }">
        <transition 
          name="page-transition" 
          mode="out-in"
          @before-leave="handleTransition"
          @after-enter="handleTransition"
        >
          <Suspense>
            <template #default>
              <component :is="Component" :key="route.path" />
            </template>
            <template #fallback>
              <div class="flex justify-center items-center min-h-[200px]">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-nirvana-blue/20 border-t-nirvana-blue"></div>
              </div>
            </template>
          </Suspense>
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 backdrop-blur-sm border-t border-nirvana-blue/10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center">
          <div class="flex justify-center space-x-4 mb-4">
            <a
              v-for="social in socials"
              :key="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-nirvana-blue hover:text-blue-700 transition-colors duration-200"
            >
              <component :is="social.icon" class="h-6 w-6" />
            </a>
          </div>
          <p class="text-sm sm:text-base text-gray-600">© {{ currentYear }} Handlers Group</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  TwitterIcon, 
  InstagramIcon, 
  YoutubeIcon,
  XIcon 
} from 'lucide-vue-next'

// State
const isMenuOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())

// Navigation data
const navigation = [
  { to: '/', text: 'หน้าหลัก' },
  { to: '/submit-wish', text: 'ส่งคำอวยพร', primary: true },
  { to: '/developers', text: 'ผู้พัฒนา' }
]

const socials = [
  { icon: TwitterIcon, url: 'https://twitter.com/Nirvana_ARP' },
  { icon: InstagramIcon, url: 'https://instagram.com/nirvana_arp' },
  { icon: YoutubeIcon, url: 'https://youtube.com/@Nirvana_ARP' }
]

// Methods
const handleTransition = () => {
  isMenuOpen.value = false
}
</script>

<style>
.dollhouse-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231E40AF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.router-link-active {
  @apply bg-opacity-100;
}
</style>

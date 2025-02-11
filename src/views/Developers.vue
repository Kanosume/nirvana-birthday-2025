<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-nirvana-blue text-center mb-8">
      ทีมแฮนด์เลอร์ผู้พัฒนา
    </h1>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="member in team" 
        :key="member.name"
        class="dollhouse-card"
        v-motion-slide-visible-bottom
      >
        <div class="text-center space-y-4">
          <div class="w-24 h-24 mx-auto rounded-full bg-nirvana-blue/10 flex items-center justify-center">
            <component :is="member.icon" class="w-12 h-12 text-nirvana-blue" />
          </div>
          <div>
            <h3 class="text-xl font-semibold text-nirvana-blue">{{ member.name }}</h3>
            <p class="text-gray-600">{{ member.role }}</p>
          </div>
          <div class="flex justify-center space-x-4">
            <a 
              v-for="social in member.socials"
              :key="social.url"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-nirvana-blue hover:text-nirvana-light-blue transition-colors"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <h2 class="text-2xl font-semibold text-nirvana-blue mb-4">Special Thanks</h2>
      <p class="text-gray-600">
        น้องเนอร์สุดน่ารักและแฮนด์เลอร์ทุกท่าน!
      </p>
    </div>
  </div>
</template>

<script setup>
import { Code2, Palette, Layout, Twitter, Github } from 'lucide-vue-next'

const team = [
  {
    name: 'Kanosume',
    role: 'ผู้พัฒนาหลัก',
    icon: Code2,
    socials: [
      { icon: Twitter, url: 'https://twitter.com/prachameow' },
      { icon: Github, url: 'https://github.com/kanosume' }
    ]
  },
  {
    name: 'Kanosume',
    role: 'UI/UX Designer',
    icon: Palette,
    socials: [
      { icon: Twitter, url: 'https://twitter.com/prachameow' }
    ]
  },
  {
    name: 'Kanosume',
    role: 'หัวหน้าโปรเจค',
    icon: Layout,
    socials: [
      { icon: Twitter, url: 'https://twitter.com/prachameow' }
    ]
  }
]
</script>

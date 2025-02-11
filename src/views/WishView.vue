<script setup>
import { ref, onMounted } from 'vue';
import { wishesAPI } from '@/services/api';
import { useRoute } from 'vue-router';
import { SoloWishCard, LoadingSpinner } from '@/components';

const route = useRoute();
const wish = ref(null);
const error = ref(null);
const loading = ref(true);

async function fetchWish() {
    try {
        loading.value = true;
        const id = route.params.id;
        console.log(`Fetching wish with ID: ${id}`);

        wish.value = await wishesAPI.getById(id);
        console.log("Fetched wish:", wish.value);
        error.value = null;
    } catch (err) {
        console.error("Error fetching wish:", err);
        error.value = "Failed to load wish. Please try again later.";
    } finally {
        loading.value = false;
    }
}

onMounted(fetchWish);
</script>

<template>
    <div class="p-4">
        <LoadingSpinner v-if="loading" />
        <p v-else-if="error" class="text-center text-red-500">{{ error }}</p>
        <SoloWishCard v-else :wish="wish" />
    </div>
</template>

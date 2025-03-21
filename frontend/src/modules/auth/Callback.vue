<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "@/store/auth";

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

onMounted(async () => {
    const code = route.query.code as string
    if (code) {
        try {
            await authStore.getTokens(code)
            await authStore.getUserInfo()
        } catch (error) {
            console.error('Something went wrong', error)
        }
    }
    router.replace('/')    
})

</script>

<template>
    <h4>You'll be redirected in a second...or maybe not</h4>
</template>
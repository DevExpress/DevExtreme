<template>
    <p><b>Image licensed under: </b> <span>{{ vehicle.LicenseName }}</span></p>
    <p><b>Author: </b> <span>{{ vehicle.Author }}</span></p>
    <p><b>Source link: </b> <a :href="`https://${vehicle.Source}`">
            https://{{ vehicle.Source }}
        </a>
    </p>
    <p><b>Edits: </b> <span>{{ vehicle.Edits }}</span></p>
</template>

<script setup lang="ts">
import type { Vehicle } from './data';

    const props = withDefaults(defineProps<{
        vehicle?: Vehicle,
    }>(), {
        vehicle: () => ({} as Vehicle),
    });
</script>

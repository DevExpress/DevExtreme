<template>
    <p><b>Image licensed under: </b> <span>{{ LicenseName }}</span></p>
    <p><b>Author: </b> <span>{{ Author }}</span></p>
    <p>
        <b>Source link: </b>
        <a
            :href="vehicleLink"
            target="_blank"
        >
            {{ vehicleLink }}
        </a>
    </p>
    <p><b>Edits: </b> <span>{{ Edits }}</span></p>
</template>

<script setup lang="ts">
import type { Vehicle } from './data.ts';

const props = withDefaults(defineProps<{
    vehicle?: Vehicle,
}>(), {
    vehicle: () => ({} as Vehicle),
});

const {
    LicenseName,
    Author,
    Source,
    Edits,
} = props.vehicle;
const vehicleLink = `https://${Source}`;
</script>

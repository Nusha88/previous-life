<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <v-table>
        <thead>
        <tr>
          <th class="text-left">
            Year
          </th>
          <th class="text-left">
            Letter
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="item in items"
          :key="item.year"
        >
          <td>{{ item.year }}</td>
          <td>{{ item.letter }}</td>
        </tr>
        </tbody>
      </v-table>
    </v-responsive>
  </v-container>
</template>

<script setup>
import userData from '/src/assets/jsons/letterByBirthYear.json'
import {ref} from 'vue'

const items = ref(userData)
</script>

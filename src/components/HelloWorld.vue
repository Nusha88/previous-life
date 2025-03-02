<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <!--      <Professions/>-->
      <v-text-field
        v-model="state.yearOfBirth"
        clearable
        label="Year of birth"
        @click:clear="state.yearOfBirth === ''"
      />
      <v-alert
        v-if="state.error.length"
        type="warning"
        variant="outlined"
        class="mb-5"
        prominent
      >
        {{ state.error}}
      </v-alert>
      <v-btn
        variant="outlined"
        @click="onFindLetter"
      >
        Find letter
      </v-btn>
      <h1
        v-if="showYear && state.yearOfBirth.length"
        class="text-center"
      >
        Your year letter is <span class="text-amber-accent-1">{{ state.yearLetter.letter }}</span>
      </h1>
      <!--      <LettersByYear />-->
      <div class="mt-10">
        <v-text-field
          v-model="state.monthOfBirth"
          clearable
          label="Month of birth"
          @click:clear="state.monthOfBirth === ''"
        />
      </div>
      <v-btn
        variant="outlined"
        @click="onFindProfession"
      >
        Find profession
      </v-btn>
      <h1 v-if="state.monthOfBirth.length">{{ state.lifeCharacter}}</h1>
    </v-responsive>
  </v-container>
</template>

<script setup>
// import LettersByYear from "@/components/LettersByYear.vue";
import letterByYear from '/src/assets/jsons/letterByBirthYear.json'
import lifeCharacter from '/src/assets/jsons/previousLifeCharacter.json'
import {computed, reactive} from "vue";

const yearRegex = /(18[9][0-9]|19\d\d|200\d|201[0-9]|2020)/;

const state = reactive({
  yearOfBirth: '',
  monthOfBirth: '',
  yearLetter: '',
  error: '',
  lettersByYear: [],
  lifeCharacters: [],
  lifeCharacter: {},
})

const showYear = computed(() => state.yearLetter && !state.error.length)

const onFindLetter = () => {
  console.log(state.yearOfBirth);

  if (state.yearOfBirth.length !== 4) {
    state.error = 'Enter correct number of years of birth';
    return;
  }

  const firstDigit = state.yearOfBirth.charAt(0);
  if (firstDigit !== '1' && firstDigit !== '2') {
    state.error = 'Enter correct number of years of birth';
    return;
  }

  state.error = '';
  const matches = state.yearOfBirth.match(yearRegex);
  if (matches && matches.length > 0) {
    state.yearLetter = state.lettersByYear.find(obj => obj.year == matches[0]);
    console.log(matches); // Output: [ '1891', '1900', '2001', '2020' ]
    console.log(state.yearLetter); // Output: corresponding letter object
  } else {
    state.error = 'No matching year found';
  }
}

const onFindProfession = () => {
  const character = state.lifeCharacters.find((obj) => obj.letter === state.yearLetter.letter)
  console.warn(character, state.yearLetter)
  state.lifeCharacter = character.months.find((obj2) => obj2.month === state.monthOfBirth)
}

onMounted(() => {
  state.lettersByYear = letterByYear
  state.lifeCharacters = lifeCharacter
})

watch (() => state.yearOfBirth,
  (newVal) => {
  if (!newVal) {
    state.yearOfBirth = '',
      state.error = ''
  }
  })

</script>

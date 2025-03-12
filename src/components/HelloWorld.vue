<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <!--      <Professions/>-->
      <h1 class="text-center text-amber text-uppercase mb-5">Кем ты был в прошлой жизни?</h1>
      <v-text-field
        v-model="state.yearOfBirth"
        clearable
        label="Год рождения"
        @click:clear="state.yearOfBirth === ''"
      />
      <!--      <LettersByYear />-->
      <div class="mt-1">
        <v-text-field
          v-model="state.monthOfBirth"
          clearable
          label="Месяц рождения"
          @click:clear="state.monthOfBirth === ''"
        />
        <v-alert
          v-if="state.error.length"
          type="warning"
          variant="outlined"
          class="mb-5"
          prominent
        >
          {{ state.error }}
        </v-alert>
      </div>
      <v-btn
        class="mb-5"
        :disabled="isButtonDisabled"
        variant="outlined"
        @click="onFindProfession"
      >
        Узнать профессию
      </v-btn>
      <div
        v-if="!isEmpty(state.profession)"
        class="mt-5 text-center"
      >
        <h2>В прошлой жизни вы были <span class="text-amber">{{ gender }}</span></h2>
        <h2>Предположительная профессия: <span class="text-amber">{{ state.profession.name }}</span></h2>
      </div>
      <div v-if="!isEmpty(state.profession)">
        <hr class="mb-5">
        <v-text-field
          v-model="state.dateOfBirth"
          clearable
          label="Число рождения"
          @click:clear="state.dateOfBirth === ''"
        />
        <v-btn
          variant="outlined"
          @click="onFindCharacter"
        >
          Узнать характер
        </v-btn>
        <div v-if="state.character" class="text-center">
          <h2 class="mt-5 mb-3">Отличительные черты характера в прошлой жизни: <span class="text-amber"
          >{{ state.character }}</span></h2>
        </div>
      </div>
    </v-responsive>
  </v-container>
</template>

<script setup>
import letterByYear from '/src/assets/jsons/letterByBirthYear.json'
import lifeCharacter from '/src/assets/jsons/previousLifeCharacter.json'
import professionList from '/src/assets/jsons/professions.json'
import characters from '/src/assets/jsons/characters.json'
import {computed, reactive, onMounted, watch} from "vue";
import {isEmpty} from "lodash";

const yearRegex = /(18[9][0-9]|19\d\d|200\d|201[0-9]|2020)/;

const state = reactive({
  yearOfBirth: '',
  monthOfBirth: '',
  dateOfBirth: '',
  yearLetter: '',
  error: '',
  character: '',
  lettersByYear: [],
  lifeCharacters: [],
  professionList: [],
  lifeCharacter: {},
  profession: {},
  characters: [],
})

const isButtonDisabled = computed(() => Boolean(!state.yearOfBirth.length && !state.monthOfBirth.length))

const gender = computed(() => state.lifeCharacter.isMan ? 'мужчиной' : 'женщиной')

const onFindLetter = () => {

  if (state.yearOfBirth.length !== 4) {
    state.error = 'Введите правильный год рождения';
    return;
  }

  const firstDigit = state.yearOfBirth.charAt(0);
  if (firstDigit !== '1' && firstDigit !== '2') {
    state.error = 'Введите правильный год рождения';
    return;
  }

  state.error = '';
  const matches = state.yearOfBirth.match(yearRegex);
  if (matches && matches.length > 0) {
    state.yearLetter = state.lettersByYear.find(obj => Number(obj.year) === Number(matches[0]));
  } else {
    state.error = 'Указанный год не найден';
  }
}

const isOddOrEven = (number) => number % 2 === 0

const onFindProfession = () => {
  onFindLetter()
  const character = state.lifeCharacters.find((obj) => obj.letter === state.yearLetter.letter)
  state.lifeCharacter = character.months.find((obj2) => obj2.month.toLowerCase() === state.monthOfBirth.toLowerCase())
  if (!state.lifeCharacter) {
    state.error = 'Проверьте правильность заполнения данных';
    return
  }
  state.profession = state.professionList.find((obj) => obj.code === state.lifeCharacter.profession)
}

const onFindCharacter = () => {
  const character = state.characters.find((obj) => obj.type === state.lifeCharacter.characterType)
  state.character = isOddOrEven(state.dateOfBirth) ? character.even : character.odd
}

onMounted(() => {
  state.lettersByYear = letterByYear
  state.lifeCharacters = lifeCharacter
  state.professionList = professionList
  state.characters = characters
})

watch(() => state.yearOfBirth,
  (newVal) => {
    if (!newVal) {
      state.yearOfBirth = '',
        state.monthOfBirth = '',
        state.dateOfBirth = '',
        state.profession = {},
        state.character = '',
        state.error = ''
    }
  })

</script>

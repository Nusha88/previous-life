<template>
  <v-container class="fill-height pa-5">
    <v-row class="d-flex flex-column align-center">
      <!-- Content to generate PDF -->
      <div
        ref="pdfContent"
        class="text-center"
      >
        <h1 class="text-center text-amber text-uppercase mb-5">
          Кем вы были в прошлой жизни?
        </h1>

        <!-- Year of Birth Input -->
        <v-autocomplete
          v-model="state.yearOfBirth"
          :items="state.years"
          label="Выберите год рождения"
          class="mb-3"
        />

        <!-- Month of Birth Input -->
        <v-autocomplete
          v-model="state.monthOfBirth"
          :items="state.months"
          label="Выберите месяц"
          class="mb-3"
        />

        <!-- Alert for Errors -->
        <v-alert
          v-if="state.error.length"
          type="warning"
          variant="outlined"
          class="mb-5"
          prominent
        >
          {{ state.error }}
        </v-alert>

        <!-- Button to Find Profession -->
        <v-btn
          class="mb-5"
          :disabled="isButtonDisabled"
          variant="outlined"
          @click="onFindProfession"
        >
          Узнать профессию
        </v-btn>

        <!-- Profession Details -->
        <div
          v-if="!isEmpty(state.profession)"
          class="mt-5"
        >
          <h3 class="mb-3">
            <span class="text-amber">В прошлой жизни вы были:</span> {{ gender }}
          </h3>
          <h3 class="mb-3">
            <span class="text-amber">Предположительная профессия:</span>
            {{ state.profession.name }}
          </h3>
        </div>

        <!-- Additional Details -->
        <div
          v-if="!isEmpty(state.profession)"
          class="mt-5"
        >
          <v-select
            v-model="state.dateOfBirth"
            :items="state.dates"
            label="Выберите число рождения"
            class="mb-3"
          />

          <v-btn
            variant="outlined"
            class="mb-3"
            @click="onFindCharacter"
          >
            Узнать характер
          </v-btn>

          <!-- Character Details -->
          <div v-if="state.character">
            <h3 class="mt-5 mb-3">
              <span class="text-amber">
                Отличительные черты характера в прошлой жизни:
              </span>
              {{ state.character }}
            </h3>
            <h3 class="mb-3">
              <span class="text-amber">Предполагаемое место и год рождения:</span>
              {{ state.placeOfBirth.place }}, {{ state.lifeCharacter.year }}
            </h3>
            <h3 class="mb-3">
              <span class="text-amber">Задача текущей жизни:</span>
              {{ state.task.description }}
            </h3>
          </div>

          <!--           Button to Save Results -->
          <div v-if="state.task.description" class="text-center mt-7">
            <v-btn
              color="amber"
              class="ma-auto"
              max-width="300"
              @click="resetFields"
            >
              Новый поиск
            </v-btn>
          </div>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script setup>
// import html2pdf from 'html2pdf.js';
import letterByYear from '/src/assets/jsons/letterByBirthYear.json'
import lifeCharacter from '/src/assets/jsons/previousLifeCharacter.json'
import professionList from '/src/assets/jsons/professions.json'
import characters from '/src/assets/jsons/characters.json'
import places from '/src/assets/jsons/placeOfBirth.json'
import tasks from '/src/assets/jsons/tasks.json'
import {computed, reactive, onMounted, watch, ref} from "vue";
import {isEmpty} from "lodash";

const pdfContent = ref(null);

const state = reactive({
  yearOfBirth: '',
  monthOfBirth: '',
  dateOfBirth: '',
  yearLetter: '',
  error: '',
  placeOfBirth: '',
  task: '',
  character: '',
  lettersByYear: [],
  lifeCharacters: [],
  professionList: [],
  lifeCharacter: {},
  profession: {},
  characters: [],
  places: [],
  tasks: [],
  years: [],
  dates: [],
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
})

const isButtonDisabled = computed(() => Boolean(!state.yearOfBirth.length && !state.monthOfBirth.length))

const gender = computed(() => state.lifeCharacter.isMan ? 'мужчиной' : 'женщиной')

const onFindLetter = () => {
  state.yearLetter = state.lettersByYear.find(obj => Number(obj.year) === state.yearOfBirth);
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
  const dateObj = character.dates.find((obj) => obj.date === Number(state.dateOfBirth))
  const task = state.tasks.find((task) => task.id === dateObj.task)
  state.task = task.date.find((obj) => Number(state.dateOfBirth) > obj.min && Number(state.dateOfBirth) < obj.max)
  const placeId = state.lifeCharacter.isMan ? dateObj.isMan : dateObj.isWoman
  state.placeOfBirth = state.places.find((place) => place.id === placeId)
}

// const generatePDF = () => {
//   const options = {
//     margin: 1,
//     filename: 'previous-life.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };
//
//   html2pdf().set(options).from(pdfContent.value).save();
// }
const resetFields = () => {
  state.yearOfBirth = ''
  state.monthOfBirth = ''
  state.dateOfBirth = ''
  state.profession = {}
  state.character = ''
  state.error = ''
  state.placeOfBirth = ''
}

onMounted(() => {
  state.years = Array.from({length: 2020 - 1890 + 1}, (_, i) => 1890 + i)
  state.dates = Array.from({length: 31}, (_, i) => i + 1)
  state.lettersByYear = letterByYear
  state.lifeCharacters = lifeCharacter
  state.professionList = professionList
  state.characters = characters
  state.places = places
  state.tasks = tasks
})

watch(() => state.yearOfBirth,
  (newVal) => {
    if (!newVal) {
      resetFields()
    }
  })

watch(() => state.monthOfBirth,
  (newVal) => {
    if (!newVal) {
      state.monthOfBirth = ''
      state.dateOfBirth = ''
      state.profession = {}
      state.character = ''
      state.error = ''
      state.placeOfBirth = ''
    }
  })

watch(() => state.dateOfBirth,
  (newVal) => {
    if (!newVal) {
      state.character = ''
      state.error = ''
      state.task = ''
      state.placeOfBirth = ''
    }
  })

</script>

<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 lg6>
        <v-menu
          ref="start"
          :close-on-content-click="false"
          v-model="start"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            :label="$vuetify.t('$vuetify.startDate')"
            v-model="startDate"
            prepend-icon="event"
          >{{ startDate }}</v-text-field>
          <v-date-picker
            v-model="startDate"
            name="startDate"
            :error-messages="startDateErrors"
            no-title
            @input="updateStartDate"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs12 lg6>
        <v-menu
          :close-on-content-click="false"
          v-model="end"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            :label="$vuetify.t('$vuetify.endDate')"
            v-model="endDate"
            prepend-icon="event"
          >{{ endDate }}</v-text-field>
          <v-date-picker
            name="endDate"
            :error-messages="endDateErrors"
            v-model="endDate"
            no-title
            @input="updateEndDate"
          ></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { SELECT_DATES } from '../store/actions/dates'

export default {
    data: () => ({
        start: false,
        end: false
    }),
    mixins: [validationMixin],
    validations: {
        startDate: { required },
        endDate: { required }
    },
    computed: {
        startDateErrors() {
            const errors = []
            if (!this.$v.startDate.$dirty) return errors
            if (!this.$v.startDate.required || !this.startDate) {
                errors.push('Start date is required')
            }
            if (new Date(this.endDate) < new Date(this.startDate)) {
                errors.push('Start date cannot be larger than end date')
            }
            return errors
        },
        endDateErrors() {
            const errors = []
            if (!this.$v.endDate.$dirty) return errors
            if (!this.$v.endDate.required || !this.endDate) {
                errors.push('End date is required')
            }
            if (new Date(this.endDate) < new Date(this.startDate)) {
                errors.push('Start date cannot be larger than end date')
            }
            return errors
        },
        startDate: {
            get() {
                const startDate = this.$store.getters.dates.startDate
                return startDate ? new Date(startDate).toISOString().substring(0, 10) : null
            },
            set(val) {
                this.$store.dispatch(SELECT_DATES, { startDate: val })
            }
        },
        endDate: {
            get() {
                const endDate = this.$store.getters.dates.endDate
                return endDate ? new Date(endDate).toISOString().substring(0, 10) : null
            },
            set(val) {
                this.$store.dispatch(SELECT_DATES, { endDate: val })
            }
        }
    },
    methods: {
        updateStartDate() {
            this.$store.dispatch(SELECT_DATES, { startDate: this.startDate })
            this.start = false
        },
        updateEndDate() {
            this.$store.dispatch(SELECT_DATES, { endDate: this.endDate })
            this.end = false
        }
    }
}
</script>

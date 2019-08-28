<template>
  <v-container>
    <v-combobox
      v-model="selectedRegions"
      :label="$vuetify.t('$vuetify.selectRegion')"
      name="selectedRegions"
      :error-messages="regionsErrors"
      chips
      clearable
      solo
      multiple
    >
      <template slot="selection" slot-scope="data">
        <v-chip :selected="data.selected" close @input="removeRegion(data.item)">
          <strong>{{ data.item }}</strong>
        </v-chip>
      </template>
    </v-combobox>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import { SELECT_REGIONS, REMOVE_REGION } from './../store/actions/xcom'

export default {
    computed: {
        regionsErrors() {
            const errors = []
            if (!this.selectedRegions || this.selectedRegions.length === 0) {
                errors.push('Regions are required')
            }
            return errors
        },
        selectedRegions: {
            get() {
                const selected = this.$store.getters.selectedRegions
                return selected && selected[0] === -1 ? ['All'] : this.$store.getters.selectedRegions
            },
            async set(val) {
                console.log(val)
                if (val.length === 0) {
                    await this.$store.dispatch(SELECT_REGIONS, [])
                } else if (val[val.length - 1].toString().toLowerCase() === 'all') {
                    val = [val[val.length - 1]]
                    await this.$store.dispatch(SELECT_REGIONS, val)
                } else {
                    await this.$store.dispatch(
                        SELECT_REGIONS,
                        Array.from(
                            new Set(
                                val.slice(0, val.length - 1).concat(
                                    val[val.length - 1]
                                        .toString()
                                        .split(' ')
                                        .map(v => parseInt(v, 10))
                                        .filter(v => !isNaN(v))
                                )
                            )
                        )
                    )
                }
            }
        }
    },
    methods: {
        async removeRegion(item) {
            this.$store.dispatch(REMOVE_REGION, item)
        }
    }
}
</script>

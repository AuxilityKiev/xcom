<template>
  <v-container>
    <v-combobox
      v-model="selectedProducts"
      :label="$vuetify.t('$vuetify.selectProducts')"
      name="selectedProducts"
      :error-messages="productsErrors"
      chips
      clearable
      solo
      multiple
    >
      <template slot="selection" slot-scope="data">
        <v-chip :selected="data.selected" close @input="removeProduct(data.item)">
          <strong>{{ data.item }}</strong>
        </v-chip>
      </template>
    </v-combobox>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { SELECT_PRODUCTS, REMOVE_PRODUCT } from '../store/actions/xcom'

export default {
    computed: {
        productsErrors() {
            const errors = []
            if (!this.selectedProducts || this.selectedProducts.length === 0) {
                errors.push('Products are required')
            }
            return errors
        },
        selectedProducts: {
            get() {
                return this.$store.getters.selectedProducts
            },
            async set(val) {
                if (val.length === 0) {
                    this.$store.dispatch(SELECT_PRODUCTS, [])
                } else {
                    this.$store.dispatch(
                        SELECT_PRODUCTS,
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
        async removeProduct(item) {
            this.$store.dispatch(REMOVE_PRODUCT, item)
        }
    }
}
</script>

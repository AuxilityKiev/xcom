<template>
  <v-btn flat @click="open">
    {{ buttonTitle }}
    <v-dialog v-model="visible" max-width="500px">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >{{ $vuetify.t('$vuetify.updateBlockTitle') }}</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              name="title"
              :label="$vuetify.t('$vuetify.title')"
              type="text"
              v-model="title"
              :error-messages="titleErrors"
              :counter="128"
              required
              @input="$v.title.$touch()"
              @blur="$v.title.$touch()"
            ></v-text-field>
            <region/>
            <products/>
            <v-checkbox :label="$vuetify.t('$vuetify.active')" v-model="active"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-btn color="primary" flat @click="update">{{ $vuetify.t('$vuetify.update') }}</v-btn>
          <v-btn color="primary" flat @click="close">{{ $vuetify.t('$vuetify.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

import { SELECT_REGIONS, SELECT_PRODUCTS } from './../store/actions/xcom'
import { BLOCKS_REQUEST, UPDATE_BLOCK_REQUEST } from './../store/actions/block'
import Region from './Region'
import Store from './Store'
import Products from './Products'

export default {
    components: {
        Region,
        Store,
        Products
    },
    mixins: [validationMixin],
    validations: {
        title: { required, minLength: minLength(1), maxLength: maxLength(128) }
    },
    props: {
        blockId: String,
        buttonTitle: String
    },
    data: () => ({
        title: null,
        active: true,
        visible: false
    }),
    computed: {
        titleErrors() {
            const errors = []
            if (!this.$v.title.$dirty) return errors
            !this.$v.title.required && errors.push('Title is required')
            !this.$v.title.minLength && errors.push('Title must be at least 1 characters long')
            !this.$v.title.maxLength && errors.push('Title must be at most 128 characters long')
            return errors
        },
        regionIds() {
            return this.$store.getters.selectedRegions
        },
        productIds() {
            return this.$store.getters.selectedProducts
        },
        block() {
            return this.$store.getters.blocks.find(bl => bl._id === this.blockId)
        }
    },
    methods: {
        open() {
            const { title, regionIds, productIds, active } = this.block
            this.title = title
            this.active = active
            this.$store.dispatch(SELECT_REGIONS, regionIds)
            this.$store.dispatch(SELECT_PRODUCTS, productIds)
            this.visible = true
        },
        async update() {
            const { title, regionIds, storeId, productIds, active } = this
            if (!this.$v.$invalid) {
                await this.$store.dispatch(UPDATE_BLOCK_REQUEST, {
                    blockId: this.blockId,
                    block: {
                        title,
                        regionIds,
                        productIds,
                        active
                    }
                })
                this.close()
            }
        },
        close() {
            this.$store.dispatch(SELECT_REGIONS, [])
            this.$store.dispatch(SELECT_PRODUCTS, [])
            this.visible = false
        }
    }
}
</script>

<template>
  <v-btn flat @click="visible = true">
    {{ buttonTitle }}
    <v-dialog v-model="visible" max-width="500px">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >{{ $vuetify.t('$vuetify.createBannerTitle') }}</v-card-title>
        <image-selector :url="imageUrl"/>
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
            <v-textarea
              name="body"
              :label="$vuetify.t('$vuetify.body')"
              type="text"
              v-model="body"
              :error-messages="bodyErrors"
              :counter="4096"
              required
              @input="$v.body.$touch()"
              @blur="$v.body.$touch()"
            ></v-textarea>
            <region/>
            <products/>
            <dates-range/>
            <v-checkbox :label="$vuetify.t('$vuetify.public')" v-model="show"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-btn color="primary" flat @click="create">{{ $vuetify.t('$vuetify.create') }}</v-btn>
          <v-btn color="primary" flat @click="close">{{ $vuetify.t('$vuetify.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

import { CREATE_BANNER_REQUEST, BANNERS_REQUEST } from './../store/actions/banner'
import { SELECT_PRODUCTS, SELECT_REGIONS } from '../store/actions/xcom'
import { SELECT_DATES } from '../store/actions/dates'
import { IMAGE_UPLOAD_REQUEST, SELECT_IMAGE } from '../store/actions/image'
import DatesRange from './DatesRange'
import ImageSelector from './ImageSelector'
import Region from './Region'
import Products from './Products'

export default {
    components: {
        DatesRange,
        ImageSelector,
        Region,
        Products
    },
    mixins: [validationMixin],
    validations: {
        title: { required, minLength: minLength(1), maxLength: maxLength(128) },
        body: { required, minLength: minLength(1), maxLength: maxLength(4096) }
    },
    props: {
        buttonTitle: String
    },
    data: () => ({
        title: null,
        body: null,
        show: true,
        visible: false
    }),
    computed: {
        titleErrors() {
            const errors = []
            if (!this.$v.title.$dirty) return errors
            if (!this.$v.title.required || !this.title) errors.push('Title is required')
            if (!this.$v.title.minLength) errors.push('Title must be at least 1 characters long')
            if (!this.$v.title.maxLength) errors.push('Title must be at most 128 characters long')
            return errors
        },
        bodyErrors() {
            const errors = []
            if (!this.$v.body.$dirty) return errors
            if (!this.$v.body.required || !this.body) errors.push('Body is required')
            if (!this.$v.body.minLength) errors.push('Body must be at least 1 characters long')
            if (!this.$v.body.maxLength) errors.push('Body must be at most 4096 characters long')
            return errors
        },
        imageUrl() {
            return this.$store.getters.imageUrl
        },
        imageData() {
            return this.$store.getters.imageData
        },
        startDate() {
            return this.$store.getters.dates.startDate
        },
        endDate() {
            return this.$store.getters.dates.endDate
        },
        regionIds() {
            return this.$store.getters.selectedRegions
        },
        productIds() {
            return this.$store.getters.selectedProducts
        },
        banner() {
            return this.$store.getters.selectedBanner
        }
    },
    methods: {
        async create() {
            this.$v.$touch()
            const { title, imageUrl, imageData, body, regionIds, productIds, startDate, endDate, show } = this
            if (!this.$v.$invalid) {
                await this.$store.dispatch(CREATE_BANNER_REQUEST, {
                    title,
                    body,
                    regionIds,
                    productIds,
                    startDate,
                    endDate,
                    show
                })
                await this.$store.dispatch(IMAGE_UPLOAD_REQUEST, {
                    bannerId: this.banner._id,
                    image: imageData
                })
                // await this.$store.dispatch(BANNERS_REQUEST)
                this.close()
            }
        },
        close() {
            resetCreateBannerDialog(this)
            this.visible = false
        }
    }
}

const resetCreateBannerDialog = dialog => {
    dialog.title = ''
    dialog.body = ''
    dialog.$store.dispatch(SELECT_IMAGE, { url: null, data: null })
    dialog.$store.dispatch(SELECT_DATES, { startDate: null, endDate: null })
    dialog.$store.dispatch(SELECT_PRODUCTS, [])
    dialog.$store.dispatch(SELECT_REGIONS, [])
}
</script>

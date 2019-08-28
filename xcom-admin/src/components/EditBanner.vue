<template>
  <v-btn flat @click="open">
    {{ buttonTitle }}
    <v-dialog v-model="visible" max-width="550px">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >{{ $vuetify.t('$vuetify.updateBannerTitle') }}</v-card-title>
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
            >{{ title }}</v-text-field>
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
            >{{ body }}</v-textarea>
            <region/>
            <products/>
            <dates-range/>
            <v-checkbox :value="show" :label="$vuetify.t('$vuetify.public')" v-model="show"></v-checkbox>
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

import { AUTH_REQUEST } from '../store/actions/auth'
import { BANNERS_REQUEST, UPDATE_BANNER_REQUEST, SELECT_BANNER } from './../store/actions/banner'
import { IMAGE_UPLOAD_REQUEST, SELECT_IMAGE } from '../store/actions/image'
import { SELECT_PRODUCTS, SELECT_REGIONS } from '../store/actions/xcom'
import { SELECT_DATES } from '../store/actions/dates'
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
        body: { required, minLength: minLength(1), maxLength: maxLength(4096) },
        startDate: { required },
        endDate: { required },
        regionIds: { required },
        productIds: { required }
    },
    props: {
        bannerId: String,
        buttonTitle: String
    },
    data: () => ({
        title: null,
        body: null,
        show: false,
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
        bodyErrors() {
            const errors = []
            if (!this.$v.body.$dirty) return errors
            !this.$v.body.required && errors.push('Body is required')
            !this.$v.body.minLength && errors.push('Body must be at least 1 characters long')
            !this.$v.body.maxLength && errors.push('Body must be at most 4096 characters long')
            return errors
        },
        banner() {
            return this.$store.getters.banners.find(ban => ban._id === this.bannerId)
        },
        imageUrl() {
            return this.$store.getters.imageUrl
        },
        imageData() {
            return this.$store.getters.imageData
        },
        startDate() {
            return this.$store.getters.startDate
        },
        endDate() {
            return this.$store.getters.endDate
        },
        regionIds() {
            return this.$store.getters.selectedRegions
        },
        productIds() {
            return this.$store.getters.selectedProducts
        }
    },
    methods: {
        open() {
            const { title, body, image, startDate, endDate, regionIds, productIds, show } = this.banner
            this.title = title
            this.body = body
            this.show = show
            this.$store.dispatch(SELECT_DATES, { startDate, endDate })
            this.$store.dispatch(SELECT_REGIONS, regionIds)
            this.$store.dispatch(SELECT_PRODUCTS, productIds)
            this.$store.dispatch(SELECT_IMAGE, { url: image })
            this.visible = true
        },
        async update() {
            const { title, body, startDate, endDate, regionIds, productIds, show } = this
            if (!this.$v.$invalid) {
                await this.$store.dispatch(UPDATE_BANNER_REQUEST, {
                    bannerId: this.bannerId,
                    banner: {
                        title,
                        body,
                        regionIds,
                        productIds,
                        startDate,
                        endDate,
                        show
                    }
                })
                if (this.imageData) {
                    await this.$store.dispatch(IMAGE_UPLOAD_REQUEST, {
                        bannerId: this.bannerId,
                        image: this.imageData
                    })
                }
                await this.$store.dispatch(BANNERS_REQUEST)
                this.close()
            }
        },
        close() {
            resetEditBannerDialog(this)
            this.visible = false
        }
    }
}

const resetEditBannerDialog = dialog => {
    dialog.title = null
    dialog.body = null
    dialog.$store.dispatch(SELECT_IMAGE, { url: null, data: null })
    dialog.$store.dispatch(SELECT_DATES, { startDate: null, endDate: null })
    dialog.$store.dispatch(SELECT_REGIONS, [])
    dialog.$store.dispatch(SELECT_PRODUCTS, [])
}
</script>

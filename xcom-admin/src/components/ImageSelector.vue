<template>
  <v-container>
    <v-img v-if="url" :src="url"/>
    <input type="file" ref="file" accept="image/*" @change="selectImage">
  </v-container>
</template>

<script>
import { SELECT_IMAGE } from './../store/actions/image'

export default {
    computed: {
        url: {
            get() {
                return this.$store.getters.imageUrl
            },
            set(val) {
                this.$store.dispatch(SELECT_IMAGE, { url: val })
            }
        },
        data: {
            get() {
                return this.$store.getters.imageData
            },
            set(val) {
                this.$store.dispatch(SELECT_IMAGE, { data: val })
            }
        }
    },
    methods: {
        selectImage() {
            const image = this.$refs.file.files[0]
            if (image) {
                const formData = new FormData()
                formData.append('file', image, image.name)
                this.url = URL.createObjectURL(image)
                this.data = formData
            }
        }
    }
}
</script>

<template lang="pug">
  form.task-form(@submit.prevent="handleSubmit")
    .form-group
      label(for="title") Başlık*
      InputText#title(
        v-model="formData.title"
        :class="{ 'p-invalid': v$.title.$invalid && v$.title.$dirty }"
        class="w-full"
      )
      small.p-error(v-if="v$.title.$error")
        | {{ v$.title.$errors[0].$message }}

    .form-group
      label(for="description") Açıklama*
      Textarea#description(
        v-model="formData.description"
        :class="{ 'p-invalid': v$.description.$invalid && v$.description.$dirty }"
        class="w-full"
        rows="3"
      )
      small.p-error(v-if="v$.description.$error")
        | {{ v$.description.$errors[0].$message }}

    .form-group
      label(for="priority") Öncelik*
      Dropdown#priority(
        v-model="formData.priority"
        :options="priorityOptions"
        optionLabel="name"
        optionValue="code"
        :class="{ 'p-invalid': v$.priority.$invalid && v$.priority.$dirty }"
        class="w-full"
        placeholder="Öncelik Seçin"
      )
      small.p-error(v-if="v$.priority.$error")
        | {{ v$.priority.$errors[0].$message }}

    .form-group
      label(for="dueDate") Bitiş Tarihi*
      Calendar#dueDate(
        v-model="formData.dueDate"
        :class="{ 'p-invalid': v$.dueDate.$invalid && v$.dueDate.$dirty }"
        :showTime="true"
        class="w-full"
        :minDate="new Date()"
      )
      small.p-error(v-if="v$.dueDate.$error")
        | {{ v$.dueDate.$errors[0].$message }}

    .form-group
      label Dosya Yükleme
      FileUpload(
        mode="basic"
        :multiple="false"
        accept="image/*,video/*,.pdf,.doc,.docx"
        :maxFileSize="5000000"
        @select="onFileSelect"
        :auto="false"
        chooseLabel="Dosya Seç"
        :url="null"
      )

      .media-preview(v-if="mediaPreview")
        .media-item
          img.media-preview-image(
            v-if="formData.mediaType === 'image'"
            :src="mediaPreview"
            :alt="formData.title"
          )

          video.media-preview-video(
            v-if="formData.mediaType === 'video'"
            controls
          )
            source(:src="mediaPreview" :type="selectedFile?.type")
            | Tarayıcınız video oynatmayı desteklemiyor.

          .document-preview(v-if="formData.mediaType === 'document'")
            i.pi.pi-file.document-icon
            span {{ selectedFile?.name || getFileName(formData.mediaUrl) }}

          Button(
            icon="pi pi-times"
            class="p-button-danger p-button-text"
            @click="removeMedia"
          )

    .form-group
      label Durum
      .status-toggle
        SelectButton(
          v-model="formData.status"
          :options="statusOptions"
          optionLabel="name"
          optionValue="code"
        )

    .form-actions
      Button(
        type="button"
        label="İptal"
        class="p-button-secondary"
        @click="$emit('cancel')"
        :disabled="loading"
      )
      Button(
        type="submit"
        label="Kaydet"
        :loading="loading"
      )
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

const props = defineProps({
  task: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const selectedFile = ref(null)
const mediaPreview = ref(null)

const API_URL = 'http://localhost:3000'

const formData = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  priority: props.task?.priority || '',
  dueDate: props.task?.dueDate ? new Date(props.task.dueDate) : null,
  status: props.task?.status || 'pending',
  mediaType: props.task?.mediaType || null,
  mediaUrl: props.task?.mediaUrl || null,
})

const priorityOptions = [
  { name: 'Yüksek', code: 'high' },
  { name: 'Orta', code: 'medium' },
  { name: 'Düşük', code: 'low' }
]

const statusOptions = [
  { name: 'Beklemede', code: 'pending' },
  { name: 'Tamamlandı', code: 'completed' }
]

// Validasyon mesajlarını Türkçeleştirme
const messages = {
  required: 'Bu alan zorunludur',
  minLength: (field, length) => `En az ${length} karakter girilmelidir`
}

const rules = computed(() => ({
  title: {
    required: { ...required, message: messages.required },
    minLength: { ...minLength(3), message: messages.minLength('', 3) }
  },
  description: {
    required: { ...required, message: messages.required },
    minLength: { ...minLength(10), message: messages.minLength('', 10) }
  },
  priority: { required: { ...required, message: messages.required } },
  dueDate: { required: { ...required, message: messages.required } }
}))

const v$ = useVuelidate(rules, formData)

onMounted(() => {
  if (formData.value.mediaUrl) {
    mediaPreview.value = formData.value.mediaUrl.startsWith('http')
      ? formData.value.mediaUrl
      : `${API_URL}${formData.value.mediaUrl}`
  }
})

const getMediaType = (fileType) => {
  if (fileType.startsWith('image/')) return 'image'
  if (fileType.startsWith('video/')) return 'video'
  return 'document'
}

const getFileName = (url) => {
  if (!url) return 'Dosya'
  return url.split('/').pop()
}

const onFileSelect = (event) => {
  if (!event?.files?.[0]) return

  const file = event.files[0]
  selectedFile.value = file
  formData.value.mediaType = getMediaType(file.type)

  if (mediaPreview.value) {
    URL.revokeObjectURL(mediaPreview.value)
  }
  mediaPreview.value = URL.createObjectURL(file)
}

const removeMedia = () => {
  formData.value.mediaType = null
  formData.value.mediaUrl = null
  if (mediaPreview.value) {
    URL.revokeObjectURL(mediaPreview.value)
  }
  mediaPreview.value = null
  selectedFile.value = null
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const formDataToSubmit = new FormData()

  formDataToSubmit.append('title', formData.value.title)
  formDataToSubmit.append('description', formData.value.description)
  formDataToSubmit.append('priority', formData.value.priority)
  formDataToSubmit.append('status', formData.value.status)
  formDataToSubmit.append('dueDate', formData.value.dueDate.toISOString())

  if (selectedFile.value) {
    formDataToSubmit.append('file', selectedFile.value)
  }

  emit('submit', formDataToSubmit)
}
</script>

<style lang="scss" scoped>
.task-form {
  padding: 1.5rem;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--surface-700);
    }

    .p-error {
      margin-top: 0.25rem;
      display: block;
    }
  }

  .media-preview {
    margin-top: 1rem;

    .media-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      border: 1px solid var(--surface-200);
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;

      .media-preview-image {
        max-width: 200px;
        max-height: 150px;
        object-fit: contain;
      }

      .media-preview-video {
        max-width: 200px;
        max-height: 150px;
      }

      .document-preview {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .pi-file {
          font-size: 1.5rem;
          color: var(--surface-600);
        }
      }
    }
  }

  .status-toggle {
    margin-top: 0.5rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
}
</style>
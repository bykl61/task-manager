<template lang="pug">
  .task-details
    .task-header
      span.priority-badge(
        v-if="task?.priority"
        :class="[getPriorityClass(task.priority)]"
      ) {{ turkishPriority(task.priority) }} Öncelik
      span.status-badge(
        :class="[task?.status === 'completed' ? 'completed' : 'pending']"
      ) {{ task?.status === 'completed' ? 'Tamamlandı' : 'Beklemede' }}

    .task-info
      h2 {{ task?.title || 'İsimsiz Görev' }}
      p.description {{ task?.description || 'Açıklama bulunmuyor' }}

      .due-date(v-if="formattedDueDate")
        i.pi.pi-calendar
        span Bitiş Tarihi: {{ formattedDueDate }}

    //- Media section
    .media-section(v-if="task?.mediaUrl")
      h3 Ek Dosya
      .media-content
        //- Resim gösterimi
        img.preview-image(
          v-if="task.mediaType === 'image'"
          :src="getFullMediaUrl"
          :alt="task.title"
        )

        //- Video gösterimi
        video.preview-video(
          v-if="task.mediaType === 'video'"
          controls
        )
          source(:src="getFullMediaUrl" :type="task.mediaType")
          | Tarayıcınız video oynatmayı desteklemiyor.

        //- Belge gösterimi ve indirme
        .document-download(v-if="task.mediaType === 'document'")
          i.pi.pi-file.document-icon
          span {{ getFileName(task.mediaUrl) }}
          Button(
            icon="pi pi-download"
            label="İndir"
            @click="downloadMedia(getFullMediaUrl)"
          )

    .action-buttons
      Button(
        label="Kapat"
        @click="$emit('close')"
        class="p-button-secondary"
      )
</template>
<script setup>
import { computed } from 'vue'
import { parseISO, isValid, format } from 'date-fns'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const getPriorityClass = (priority) => {
  if (!priority) return ''
  return {
    'high': 'high-priority',
    'medium': 'normal-priority',
    'low': 'low-priority'
  }[priority.toLowerCase()] || ''
}

const turkishPriority = (priority) => {
  const translations = {
    'high': 'Yüksek',
    'medium': 'Orta',
    'low': 'Düşük'
  }
  return translations[priority.toLowerCase()] || priority
}

const API_URL = 'http://localhost:3000'

const getFullMediaUrl = computed(() => {
  if (!props.task?.mediaUrl) return null
  return props.task.mediaUrl.startsWith('http')
    ? props.task.mediaUrl
    : `${API_URL}${props.task.mediaUrl}`
})

const formattedDueDate = computed(() => {
  if (!props.task?.dueDate) return null

  try {
    const date = typeof props.task.dueDate === 'string'
      ? parseISO(props.task.dueDate)
      : new Date(props.task.dueDate)

    return isValid(date) ? format(date, 'dd.MM.yyyy') : null
  } catch (error) {
    console.error('Tarih biçimlendirme hatası:', error)
    return null
  }
})

const getFileName = (url) => {
  if (!url) return 'Dosya'
  return url.split('/').pop()
}

const downloadMedia = (url) => {
  if (!url) return
  window.open(url, '_blank')
}
</script>


<style lang="scss" scoped>
.task-details {
  padding: 1.5rem;
}

.task-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.priority-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.priority-badge {
  &.high-priority {
    background-color: #ffecec;
    color: #ff4d4d;
  }

  &.normal-priority {
    background-color: #e3f2fd;
    color: #2196f3;
  }

  &.low-priority {
    background-color: #e8f5e9;
    color: #4caf50;
  }
}

.status-badge {
  &.completed {
    background-color: #e8f5e9;
    color: #4caf50;
  }

  &.pending {
    background-color: #fff3e0;
    color: #ff9800;
  }
}

.task-info {
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: var(--surface-900);
  }

  .description {
    color: var(--surface-600);
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .due-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--surface-600);

    i {
      color: var(--primary-color);
    }
  }
}

.media-section {
  margin: 2rem 0;

  h3 {
    margin-bottom: 1rem;
    color: var(--surface-900);
  }

  .media-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .preview-image,
  .preview-video {
    width: 100%;
    max-height: 300px;
    border-radius: 0.5rem;
    background: #f5f5f5;
  }

  .preview-image {
    object-fit: contain;
  }

  .document-download {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--surface-200);
    border-radius: 0.5rem;
    background: #f5f5f5;

    .document-icon {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-right: 1rem;
      flex-shrink: 0;
    }

    span {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 1rem;
      color: var(--surface-600);
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
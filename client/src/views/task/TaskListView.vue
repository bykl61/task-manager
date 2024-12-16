<template lang="pug">
  .task-manager
    // Header
    header.header
      .header-content
        h1 Görev Yöneticisi
        Button.new-task-button(
          severity="success"
          @click="openNewTask"
          :loading="loading"
        )
          i.pi.pi-plus
          span Yeni Görev

    // Main Content
    main.main-content
      // Filters
      Card.filters-card
        template(#content)
          .filter-section
            .filter-group
              Dropdown(
                v-model="filters.status"
                :options="statusOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Durum Filtrele"
              )
            .filter-group
              Dropdown(
                v-model="filters.priority"
                :options="priorityOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Öncelik Filtrele"
              )
            .filter-group
              Calendar(
                v-model="filters.endDate"
                placeholder="Bitiş Tarihi"
                :showTime="false"
              )
            .filter-group
              Checkbox(
                v-model="filters.hasAttachment"
                binary
              )
              span Dosya Ekli

      // Task List
      .task-list
        Card.task-card(
          v-for="task in tasks"
          :key="task.id"
          :class="{ 'border-red-200': getIsOverdue(task) }"
        )
          template(#content)
            .task-content
              .task-main
                .task-badges
                  span.priority-badge(
                    :class="getPriorityClass(task.priority)"
                  ) {{ turkishPriority(task.priority) }} Öncelik

                h3.task-title {{ task.title }}
                p.task-description {{ task.description }}

                .task-footer
                  .info-group
                    span.date-badge(v-if="task.dueDate")
                      i.pi.pi-calendar
                      span {{ formatDate(task.dueDate) }}
                  .info-group
                    span.attachment-info(v-if="task.mediaUrl")
                      i.pi.pi-paperclip
                      span Dosya Ekli

                  .task-actions
                    Button(
                      icon="pi pi-pencil"
                      text
                      severity="primary"
                      @click="openEditTask(task)"
                      tooltip="Düzenle"
                    )
                    Button(
                      icon="pi pi-trash"
                      text
                      severity="danger"
                      @click="confirmDeleteTask(task)"
                      tooltip="Sil"
                    )
                    Button(
                      label="Detayları Gör"
                      text
                      class="p-button-primary view-details-btn"
                      @click="openTaskDetails(task)"
                    )
              .task-checkbox
                Checkbox(
                  :modelValue="task.status === 'completed'"
                  :binary="true"
                  @update:modelValue="(value) => handleTaskStatusChange(task, value)"
                  :disabled="loading"
                  )


        // Empty State
        Card.empty-state(v-if="tasks?.length === 0")
          template(#content)
            .empty-content
              i.pi.pi-inbox.empty-icon
              h3 Görev bulunamadı
              p Filtreleri değiştirin veya yeni bir görev oluşturun

      // Pagination
      Paginator(
        v-if="totalRecords"
        :rows="pageSize"
        :totalRecords="totalRecords"
        @page="onPageChange($event)"
        :rowsPerPageOptions="[10, 20, 50]"
      )

    // Dialogs
    Dialog(
      v-model:visible="showNewTaskDialog"
      :modal="true"
      :closeOnEscape="false"
      :header="selectedTask ? 'Görevi Düzenle' : 'Yeni Görev'"
    )
      CreateTaskModal(
        @submit="handleTaskSubmit"
        @cancel="closeTaskDialog"
        :loading="loading"
        :task="selectedTask"
      )

    ConfirmDialog

    Dialog(
      v-model:visible="showTaskDetails"
      :modal="true"
      header="Görev Detayları"
    )
      TaskDetailModal(
        :task="selectedTask"
        @close="showTaskDetails = false"
      )
</template>
<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import ConfirmDialog from 'primevue/confirmdialog';
import { taskService } from '@/services/api/task';
import TaskDetailModal from '@/views/task/TaskDetailModal.vue';
import CreateTaskModal from '@/views/task/CreateTaskModal.vue';

const confirm = useConfirm();
const toast = inject('toast');

// States
const tasks = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const currentPage = ref(0);
const pageSize = ref(10);
const showNewTaskDialog = ref(false);
const showTaskDetails = ref(false);
const selectedTask = ref(null);

const filters = ref({
  status: 'all',
  priority: 'all',
  endDate: null,
  hasAttachment: false
});

const statusOptions = [
  { name: 'Tümü', value: 'all' },
  { name: 'Tamamlandı', value: 'completed' },
  { name: 'Beklemede', value: 'pending' }
];

const priorityOptions = [
  { name: 'Tümü', value: 'all' },
  { name: 'Yüksek', value: 'high' },
  { name: 'Orta', value: 'medium' },
  { name: 'Düşük', value: 'low' }
];

const turkishPriority = (priority) => {
  const translations = {
    'high': 'Yüksek',
    'medium': 'Orta',
    'low': 'Düşük'
  };
  return translations[priority] || priority;
};

// Methods

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Sıralama için state
const sortField = ref(null);
const sortOrder = ref(null); // 'asc' veya 'desc'

// Priority için özel sıralama değerleri
const priorityValues = {
  'high': 3,
  'normal': 2,
  'low': 1
};


const openNewTask = () => {
  selectedTask.value = null;
  showNewTaskDialog.value = true;
};

const handleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }

  tasks.value = [...tasks.value].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const valueA = priorityValues[a.priority.toLowerCase()] || 0;
        const valueB = priorityValues[b.priority.toLowerCase()] || 0;
        comparison = valueA - valueB;
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        break;
    }

    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
};

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'pi pi-sort';
  return sortOrder.value === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down';
};


const getIsOverdue = (task) => {
  if (!task.dueDate) return false;
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  return dueDate < now;
};

// Simplified buildFilterParams function
const buildFilterParams = () => {
  const params = {};

  if (filters.value.status !== 'all') {
    params.status = filters.value.status;
  }

  if (filters.value.priority !== 'all') {
    params.priority = filters.value.priority;
  }

  if (filters.value.endDate) {
    const date = new Date(filters.value.endDate);
    date.setHours(23, 59, 59, 999);
    date.setHours(date.getHours() + 3);
    params.endDate = date.toISOString();
  }

  if (filters.value.hasAttachment) {
    params.hasAttachment = 'true';
  }

  return params;
};

const fetchTasks = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      ...buildFilterParams()
    };

    const response = await taskService.getTasks(params);
    tasks.value = response || [];
    totalRecords.value = response.total;
  } catch (error) {
    toast.error('Tasks could not be loaded');
  } finally {
    loading.value = false;
  }
};


const handleTaskSubmit = async (formData) => {
  try {
    loading.value = true;

    if (selectedTask.value) {
      await taskService.updateTask(selectedTask.value.id, formData);
      toast.success('Task updated successfully')
    } else {
      await taskService.createTask(formData);
      toast.success('Task created successfully')
    }

    closeTaskDialog();
    fetchTasks();
  } catch (error) {
    toast.error( error.message);
  } finally {
    loading.value = false;
  }
};

const handleTaskStatusChange = async (task, checked) => {
  try {
    loading.value = true;
    const newStatus = checked ? 'completed' : 'pending';

    await taskService.updateTask(task.id, {
      status: newStatus
    });

    toast.success( `Task ${newStatus === 'completed' ? 'completed' : 'pending'}`);

    await fetchTasks();
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

const confirmDeleteTask = (task) => {
  confirm.require({
    message: 'Are you sure you want to delete this task?',
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteTask(task.id)
  });
};

const deleteTask = async (taskId) => {
  try {
    loading.value = true;
    await taskService.deleteTask(taskId);
    toast.success('Task deleted successfully');
    fetchTasks();
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};

const openTaskDetails = (task) => {
  selectedTask.value = task;
  showTaskDetails.value = true;
};

const openEditTask = (task) => {
  selectedTask.value = { ...task };
  showNewTaskDialog.value = true;
};

const closeTaskDialog = () => {
  showNewTaskDialog.value = false;
  selectedTask.value = null;
};

const onPageChange = (event) => {
  currentPage.value = event.page;
  pageSize.value = event.rows;
  fetchTasks();
};

const getPriorityClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'high';
    case 'normal':
      return 'normal';
    case 'low':
      return 'low';
    default:
      return '';
  }
};

// Initialize
onMounted(() => {
  fetchTasks();
});

// Watch filters
watch(
  () => ({ ...filters.value }),
  () => {
    currentPage.value = 0;
    fetchTasks();
  },
  { deep: true }
);
</script>

<style scoped>
/* Layout */
.task-manager {
  min-height: 100vh;
  background-color: var(--surface-50);
}

/* Header Styles */
.header {
  background-color: white;
  border-bottom: 1px solid var(--surface-200);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--surface-900);
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}

/* Filter Styles */
.filters-card {
  margin-bottom: 2rem;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Sort Styles */
.task-list-header {
  margin-bottom: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.sort-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.sort-button i {
  font-size: 0.875rem;
}

.sort-button.active {
  color: var(--primary-color);
}

/* Task List Styles */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-card {
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
}

.task-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.task-main {
  flex: 1;
}

/* Task Badges */
.task-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.priority-badge.high {
  background-color: #fef2f2;
  color: #dc2626;
}

.priority-badge.normal {
  background-color: #eff6ff;
  color: #2563eb;
}

.priority-badge.low {
  background-color: #f0fdf4;
  color: #16a34a;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  background-color: #fefce8;
  color: #ca8a04;
}

/* Task Content */
.task-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--surface-900);
  margin-bottom: 0.5rem;
}

.task-description {
  color: var(--surface-600);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.task-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--surface-600);
  font-size: 0.875rem;
}

/* Task Checkbox */
.task-checkbox {
  padding-top: 0.25rem;
}

:deep(.p-checkbox) {
  width: 1.5rem !important;
  height: 1.5rem !important;
}

:deep(.p-checkbox .p-checkbox-box) {
  width: 1.5rem !important;
  height: 1.5rem !important;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--surface-400);
}

/* Button Styles */
.new-task-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
}
</style>
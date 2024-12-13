import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Textarea from 'primevue/textarea'
import ConfirmationService from 'primevue/confirmationservice'
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import ConfirmDialog from 'primevue/confirmdialog'
import Calendar from 'primevue/calendar';
import FileUpload from 'primevue/fileupload';
import SelectButton from 'primevue/selectbutton';

// PrimeVue Styles
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css' // PrimeFlex


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

// Register PrimeVue Components
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Toast', Toast)
app.component('Card', Card)
app.component('Textarea', Textarea)
app.component('Dialog', Dialog);
app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('Paginator', Paginator);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Calendar', Calendar)
app.component('FileUpload', FileUpload)
app.component('SelectButton', SelectButton)

app.mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import store from './store'
import router from './router'

Amplify.configure(awsconfig);
createApp(App).use(router).use(store).mount('#app')

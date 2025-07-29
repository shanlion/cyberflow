import { createApp } from "vue";
import App from "./PopupApp.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

let app = createApp(App);

app.use(ElementPlus);
app.mount("#popupapp");

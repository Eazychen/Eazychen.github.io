import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.1/vue.esm-browser.min.js";
const app = createApp({
	data() {
		return {
			user: {
				username: "",
				password: "",
			},
		};
	},
	methods: {
		login() {
			axios
				.post("https://ec-course-api.hexschool.io/v2/admin/signin", this.user)
				.then((res) => {
					const { token, expired } = res.data;
					document.cookie = `userToken=${token}; expires=${new Date(expired)}`;
					window.location = "product.html";
				})
				.catch((err) => {
					console.log(err);
					alert(err);
				});
		},
	},
});
app.mount("#app");

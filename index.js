const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "eazy";

Object.keys(VeeValidateRules).forEach((rule) => {
	if (rule !== "default") {
		VeeValidate.defineRule(rule, VeeValidateRules[rule]);
	}
});

VeeValidateI18n.loadLocaleFromURL(
	"https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json"
);
VeeValidate.configure({
	generateMessage: VeeValidateI18n.localize("zh_TW"),
	validateOnInput: true,
});

const userModal = {
	props: ["tempProduct", "addToCart"],
	data() {
		return {
			productModal: null,
			qty: 1,
		};
	},
	watch: {
		tempProduct() {
			this.qty = 1;
		},
	},
	methods: {
		showModal() {
			this.productModal.show();
		},
		hideModal() {
			this.productModal.hide();
		},
	},
	template: "#userProductModal",
	mounted() {
		// 從modal取用ref
		this.productModal = new bootstrap.Modal(this.$refs.modal);
	},
};

const app = Vue.createApp({
	data() {
		return {
			products: [],
			tempProduct: {},
			status: {
				addCartLoading: "",
				cartQtyLoading: "",
			},
			form: {
				user: {
					email: "",
					name: "",
					tel: "",
					address: "",
				},
				message: "",
			},
			carts: {},
		};
	},
	methods: {
		getProducts() {
			const url = `${apiUrl}/api/${apiPath}/products`;
			axios.get(url).then((res) => {
				this.products = res.data.products;
			});
		},
		openModal(item) {
			this.tempProduct = item;
			this.$refs.userModal.showModal();
		},
		addToCart(product_id, qty = 1) {
			const order = {
				product_id,
				qty,
			};
			this.status.addCartLoading = product_id;
			const url = `${apiUrl}/api/${apiPath}/cart`;
			axios
				.post(url, { data: order })
				.then((res) => {
					alert(res.data.message);
					this.status.addCartLoading = "";
					this.$refs.userModal.hideModal();
					this.getCart();
				})
				.catch((err) => {
					alert(err.response.data.message);
				});
		},
		getCart() {
			const url = `${apiUrl}/api/${apiPath}/cart`;
			axios.get(url).then((res) => {
				this.carts = res.data.data;
			});
		},
		changeQty(item, qty = 1) {
			const order = {
				product_id: item.product_id,
				qty,
			};
			this.status.cartQtyLoading = item.id;
			const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
			axios
				.put(url, { data: order })
				.then((res) => {
					this.getCart();
					this.status.cartQtyLoading = "";
				})
				.catch((err) => {});
		},
		removeItem(id) {
			const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
			this.status.cartQtyLoading = id;
			axios
				.delete(url)
				.then((res) => {
					alert(res.data.message);
					this.status.cartQtyLoading = "";
					this.getCart();
				})
				.catch((err) => {
					3;
					alert(err.response.data.message);
				});
		},
		createOrder() {
			const url = `${apiUrl}/api/${apiPath}/cart/order`;
			const order = this.form;
			axios
				.post(url, { data: order })
				.then((res) => {
					alert(res.data.message);
					this.refs.from.resetForm();
					this.getCart();
				})
				.catch((err) => {
					alert(err.response.data.message);
				});
		},
		deleteAllCart() {
			const url = `${apiUrl}/api/${apiPath}/carts`;
			axios
				.delete(url)
				.then((res) => {
					alert(res.data.message);
					this.getCart();
				})
				.catch((err) => {
					alert(err.response.data.message);
				});
		},
	},
	components: {
		userModal,
	},
	mounted() {
		this.getProducts();
		this.getCart();
	},
});

app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");

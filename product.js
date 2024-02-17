import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.1/vue.esm-browser.min.js";
let productModal = null;
let delProductModal = null;
const app = createApp({
  data() {
    return {
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      apiUrl: "https://ec-course-api.hexschool.io/v2",
      apiPath: "eazy",
      pagination: {},
    };
  },
  methods: {
    checkLogin() {
      axios
        .post("https://ec-course-api.hexschool.io/v2/api/user/check")
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert("驗證失敗");
          window.location = "index.html";
        });
    },
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },
    openModal(status, item) {
      if (status === "new") {
        this.tempProduct = {};
        this.isNew = true;
        productModal.show();
      } else if (status === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (status === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    updateProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = "post";

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
      }
      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    delProduct() {
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      { keyboard: false, backdrop: "static" }
    );
    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      { keyboard: false, backdrop: "static" }
    );
  },
});
app.component("pagination", {
  props: ["pages"],
  methods: {
    changePage(num) {
      this.$emit("change-page", num);
    },
  },
  template: `	<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === 1}"
      >
        <a
          href="#"
          class="page-link"
          aria-label="Previous"
          @click.prevent="changePage(pages.current_page - 1 )"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        v-for="(item, index) in pages.total_pages"
        :key="index"
        class="page-item"
        :class="{'active': item === pages.current_page}"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="changePage(item)"
          >{{ item }}
        </a>
      </li>
      <li
        class="page-item"
        :class="{'disabled': pages.current_page === 1}"
      >
        <a
          href="#"
          class="page-link"
          aria-label="Previous"
          @click.prevent="changePage(pages.current_page + 1 )"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,
});
app.mount("#app");

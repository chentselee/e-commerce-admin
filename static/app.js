const Product = (
  name = "",
  id = "",
  price = "",
  created = "",
  updated = ""
) => {
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "mx-auto");
  card.innerHTML = `
    <div class="row no-gutters">
      <div class="col-3">
        <img class="card-img">
      </div>
      <div class="col-8">
        <div class="card-body container">
          <dl class="row mb-0">
            <dt class="col-4">名稱</dt>
            <dd class="col-8">
              <p class="card-title">${name}</p>
            </dd>
            <dt class="col-4">id</dt>
            <dd class="col-8">
              <p class="card-text">${id}</p>
            </dd>
            <dt class="col-4">價格(元)</dt>
            <dd class="col-8">
              <p class="card-text">${price}</p>
            </dd>
            <dt class="col-4">新增時間</dt>
            <dd class="col-8">
              <p class="card-text">${created}</p>
            </dd>
            <dt class="col-4">最後更新</dt>
            <dd class="col-8">
              <p class="card-text">${updated ? updated : "-"}</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
  `;
  return card;
};

const api = "http://localhost:8000";

async function listProducts() {
  const res = await fetch(`${api}/products`);
  const products = await res.json();
  await products.forEach((product) => {
    const col = document.createElement("div");
    col.classList.add("col-md-6");
    col.appendChild(
      Product(
        product.name,
        product._id,
        product.price,
        new Date(product.created).toLocaleString("zh-TW")
      )
    );
    document.querySelector(".__products").appendChild(col);
  });
}

function clearProducts() {
  document.querySelector(".__products").innerHTML = "";
}

async function reloadProducts() {
  clearProducts();
  await listProducts();
}

(async function () {
  const res = await fetch(`${api}/categories`);
  const categories = await res.json();
  await categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.innerText = category.display_name;
    document.querySelector(".custom-select").appendChild(option);
  });
})();

listProducts();

const maxImageSizeMB = 1;
const maxImageSize = 1024 * 1024 * maxImageSizeMB;
const productImageInputLabel = document.querySelector(".custom-file-label");
const productImageInput = document.querySelector("#image");

productImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file.size > maxImageSize) {
    alert(`圖片必須小於${maxImageSizeMB}MB!`);
    event.target.value = "";
  } else {
    productImageInputLabel.textContent = file.name;
  }
});

const newProductForm = document.querySelector("#new-product");

newProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const file = productImageInput.files[0];
  if (file) {
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (event) => {
        resolve(event.target.result);
      });
      reader.readAsDataURL(file);
    });
    formData.append("image", fileData);
  }

  const serializedFormData = {};
  for (const [key, value] of formData.entries()) {
    serializedFormData[key] = value;
  }

  const res = await fetch(`${api}/products`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(serializedFormData),
  });
  if (res.ok) {
    alert("新增成功");
    await reloadProducts();
    event.target.reset();
  } else {
    alert(`新增失敗, ${res.body.msg}`);
  }
});

newProductForm.addEventListener("reset", () => {
  productImageInputLabel.textContent = "選擇⋯";
});

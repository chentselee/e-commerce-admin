const api = "http://localhost:8000";

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
      <div class="col-11">
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
              <p class="card-text">${updated}</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="col-1 pt-3 container">
        <div class="row pb-1">
          <button class="btn btn-success btn-sm update">更新</button>
        </div>
        <div class="row">
          <button class="btn btn-danger btn-sm delete">刪除</button>
        </div>
      </div>
    </div>
  `;
  card.querySelector(".delete").addEventListener("click", async () => {
    if (confirm(`確定要刪除物品: [${name}]嘛?`)) {
      const res = await fetch(`${api}/products`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("刪除成功");
        await reloadProducts();
      } else {
        alert("刪除失敗");
      }
    } else {
      return;
    }
  });
  return card;
};

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
        new Date(product.created).toLocaleString("zh-TW"),
        new Date(product.updated).toLocaleString("zh-TW")
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

const newProductForm = document.querySelector("#new-product");

newProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

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

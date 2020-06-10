const api = document.URL || "http://localhost:8000";

function Product(
  name = "",
  category = "",
  id = "",
  price = "",
  created = "",
  updated = ""
) {
  const card = document.createElement("div");
  card.classList.add("card", "mb-3", "mx-auto");
  card.innerHTML = `
    <div class="row no-gutters">
      <div class="col-11">
        <div class="card-body container">
          <dl class="row mb-0">
            <dt class="col-4">名稱</dt>
            <dd class="col-8">
              <p class="card-title">
                ${name}
                <span class="edit-name" style="cursor: pointer">️✏️</span>
              </p>
            </dd>
            <dt class="col-4">種類</dt>
            <dd class="col-8">
              <p class="card-text">${category}</p>
            </dd>
            <dt class="col-4">id</dt>
            <dd class="col-8">
              <p class="card-text">${id}</p>
            </dd>
            <dt class="col-4">價格(元)</dt>
            <dd class="col-8">
              <p class="card-text">
                ${price}
                <span class="edit-price" style="cursor: pointer">️✏️</span>
              </p>
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
        <div class="row">
          <button class="btn btn-danger btn-sm btn-delete" data-toggle="modal" data-target="#delete-${id}">刪除</button>
        </div>
      </div>
    </div>
  `;
  card.querySelector(".btn-delete").addEventListener("click", async () => {
    if (confirm(`確定要刪除物品"${name}"嘛?`)) {
      const res = await fetch(`${api}/products`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        alert("刪除成功");
        await updateProducts();
      } else {
        alert("刪除失敗");
      }
    } else {
      return;
    }
  });
  card.querySelector(".edit-name").addEventListener("click", async () => {
    const newName = prompt("輸入新名稱", name);
    if (newName && newName.trim() && newName !== name) {
      const res = await fetch(`${api}/products`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id, name: newName }),
      });
      if (res.ok) {
        alert("更新成功");
        updateProducts();
      } else {
        alert("更新失敗");
      }
    } else {
      return;
    }
  });
  card.querySelector(".edit-price").addEventListener("click", async () => {
    const newPrice = prompt("輸入新價格", price);
    if (newPrice && newPrice.trim() && newPrice !== price.toString()) {
      const res = await fetch(`${api}/products`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id, price: parseInt(newPrice) }),
      });
      if (res.ok) {
        alert("更新成功");
        updateProducts();
      } else {
        alert("更新失敗");
      }
    } else {
      return;
    }
  });
  return card;
}

async function fetchProducts() {
  const res = await fetch(`${api}/products`);
  const products = await res.json();
  return products;
}

function clearProducts() {
  document.querySelector(".products").innerHTML = "";
}

async function updateProducts() {
  clearProducts();
  await listProducts();
}

(async function listProducts() {
  const products = await fetchProducts();
  products.forEach((product) => {
    const col = document.createElement("div");
    col.classList.add("col-md-6");
    col.appendChild(
      Product(
        product.name,
        product.category.display_name,
        product._id,
        product.price,
        new Date(product.created).toLocaleString("zh-TW"),
        new Date(product.updated).toLocaleString("zh-TW")
      )
    );
    document.querySelector(".products").appendChild(col);
  });
})();

async function fetchCategories() {
  const res = await fetch(`${api}/categories`);
  const categories = await res.json();
  return categories;
}

(async function listCategories() {
  const categories = await fetchCategories();

  const categoriesOptions = categories.map((category) => {
    const option = document.createElement("option");
    option.value = category._id;
    option.innerText = category.display_name;
    return option;
  });

  categoriesOptions.forEach((option) => {
    document.querySelector("#category").appendChild(option);
  });
})();

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
    await updateProducts();
    event.target.reset();
  } else {
    alert(`新增失敗, ${res.body.msg}`);
  }
});

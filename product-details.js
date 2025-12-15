// Helper: get product id from query string
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Render the product specs into a table
function renderSpecs(specs) {
  let html = "";
  for (const [key, value] of Object.entries(specs)) {
    html += `<tr><th>${key}</th><td>${value}</td></tr>`;
  }
  return html;
}

// Render features as list
function renderFeatures(features) {
  return features.map(f => `<li>${f}</li>`).join('');
}

// Product lookup & rendering
window.onload = function() {
  const productId = getProductId();
  const product = PRODUCTS.find(p => p.id === productId);

  // If product not found, show error
  if (!product) {
    document.body.innerHTML = "<div style='text-align:center; margin-top:80px'><h2>Product Not Found</h2><a href='index.html'>Back to Home</a></div>";
    return;
  }

  document.title = product.name + " | Ajor Doors";

  // Fill hero/breadcrumb
  document.getElementById("breadcrumb-area").innerHTML =
    `<a href='index.html' style="color:#f3961c">Home</a> / <a href='index.html#products' style="color:#f3961c">Products</a> / ${product.name}`;
  document.getElementById("product-title").textContent = product.name;

  // Main Image & Thumbnails
  const mainImg = document.getElementById("main-door-image");
  mainImg.src = product.mainImage;
  mainImg.alt = product.name;

  // Similar Images
  const simDiv = document.getElementById("similar-images");
  simDiv.innerHTML = product.similarImages
    .map(img => `<img src="${img}" style="width:100px;height:100px;border:2px solid #887373ff;border-radius:4px;cursor:pointer" 
      onclick="document.getElementById('main-door-image').src='${img}'">`)
    .join('');

  // Short desc
  document.getElementById("short-description").textContent = product.shortDescription;

  // Specifications
  document.getElementById("spec-table").innerHTML = renderSpecs(product.specifications);

  // Features
  document.getElementById("product-features").innerHTML = renderFeatures(product.features);
};
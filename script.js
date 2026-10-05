let products = [];
const cart = [];

async function getProduct() {
    const container = document.querySelector("#container");

    try {
        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        products = data.products;

        products.forEach((product) => {
            const card = document.createElement("div");

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>${product.description}</p>
                <h6>$${product.price}</h6>
                <button type="button" data-product-id="${product.id}">Add To Cart</button>
            `;

            const button = card.querySelector("button");
            button.addEventListener("click", () => {
                purchaseProduct(product.id)
                    .catch((error) => {
                        updateStatus(`Error: ${error.message}`);
                        console.error(error);
                    });
            });

            container.appendChild(card);
        });
    } catch (error) {
        container.textContent = "Unable to load products. Please try again later.";
        console.error(error);
    }
}

function selectproduct(id) {
    const item = products.find((item) => id === item.id);

    if (!item) {
        return;
    }

    cart.push(item);
    console.log(`${item.title} added to cart`, cart);
    return item;
}

function purchaseProduct(id) {
    updateStatus("Starting purchase...");

    return Promise.resolve(id)
        .then((productId) => {
            updateStatus("Finding product...");
            return selectproduct(productId);
        })
        .then((product) => {
            if (!product) {
                throw new Error("Product was not found");
            }

            return addcart(product);
        })
        .then((addedProduct) => {
            updateStatus(`${addedProduct.title} added to cart.`);
            return addedProduct;
        })
        .then((product) => pay(product).then((message) => {
            updateStatus(message);
            return product;
        }))
        .then((product) => {
            updateStatus("Purchase complete.");
            showThankYou(product);
            return product;
        });
}

function updateStatus(message) {
    const status = document.querySelector("#status");
    const messageElement = document.createElement("p");

    messageElement.textContent = message;
    status.appendChild(messageElement);
}

function addcart(product) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(product);
        }, 800);
    });
}
function pay(product) {
    const paid = true;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (paid) {
                resolve(`Amount paid for ${product.title}`);
            } else {
                reject(new Error("Payment failed"));
            }
        }, 800);
    });
}

function showThankYou(product) {
    const container = document.querySelector("#container");

    container.innerHTML = `
        <section id="thank-you">
            <h1>Thank You!</h1>
            <p>Your order for <strong>${product.title}</strong> has been confirmed.</p>
            <p>We appreciate your purchase.</p>
        </section>
    `;
}

getProduct();
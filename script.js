const cartButton = document.getElementById("cart-button");
const cartMenu = document.getElementById("cart-menu");
const cartItemsContainer = document.getElementById("cart-items");
const totalAmountElement = document.getElementById("total-amount");
const checkoutButton = document.getElementById("checkout-btn");
const preorderButtons = document.querySelectorAll(".preorder-btn");
const cartItems = [];
let totalAmount = 0; // Переменная для хранения общей суммы заказа

cartButton.addEventListener("click", toggleCartMenu);
checkoutButton.addEventListener("click", handleCheckout);

preorderButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
});

function toggleCartMenu() {
    cartMenu.classList.toggle("hidden");
    updateCartItems();
}

function addToCart(event) {
    const product = event.target.dataset.product;
    const price = parseFloat(event.target.dataset.price);
    const imageSrc = event.target.parentElement.querySelector("img").src;
    const item = { product, price, imageSrc };
    cartItems.push(item);
    totalAmount += price; // Обновляем общую сумму при добавлении товара в корзину
    updateCartItems();
}

function removeFromCart(index) {
    if (index >= 0 && index < cartItems.length) {
        totalAmount -= cartItems[index].price; // Уменьшаем общую сумму при удалении товара из корзины
        cartItems.splice(index, 1); // Удаляем товар из массива корзины по индексу
        updateCartItems(); // Обновляем отображение корзины
    }
}

function updateCartItems() {
    cartItemsContainer.innerHTML = "";

    cartItems.forEach((item, index) => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";

        const cartItemImage = document.createElement("img");
        cartItemImage.src = item.imageSrc;
        cartItemImage.alt = item.product;

        const cartItemName = document.createElement("p");
        cartItemName.textContent = item.product;

        const cartItemPrice = document.createElement("p");
        cartItemPrice.textContent = `Цена: ${item.price} рублей`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "-";
        deleteButton.className = "delete-button"; // Добавление класса для применения стилей
        deleteButton.addEventListener("click", () => removeFromCart(index));

        cartItemDiv.appendChild(cartItemImage);
        cartItemDiv.appendChild(cartItemName);
        cartItemDiv.appendChild(cartItemPrice);
        cartItemDiv.appendChild(deleteButton);

        cartItemsContainer.appendChild(cartItemDiv);

    });

    totalAmountElement.textContent = `Итого: ${totalAmount} рублей`;
}


function handleCheckout() {
    const name = document.getElementById("customer-name").value;
    const deliveryTime = document.getElementById("delivery-time").value;

    // Проверяем, есть ли товары в корзине перед оформлением заказа
    if (cartItems.length === 0) {
        alert("Ваша корзина пуста. Пожалуйста, добавьте товары перед оформлением заказа.");
        return; // Останавливаем процесс оформления заказа, если корзина пуста
    }
    if (name && deliveryTime) {
        let message = `
Заказ от: ${name}
Время доставки: ${deliveryTime}
Заказанные позиции:
`;

        cartItems.forEach((item) => {
            message += `
- ${item.product} (${item.price} рублей)
`;
        });

        message += `Итого: ${totalAmount} рублей`;

// Здесь вы можете использовать ваш токен бота и ID чата в Telegram
// Например, для теста можно использовать бота @BotFather в Telegram и получить его токен
// Далее создайте группу в Telegram и добавьте в нее бота, затем получите ID чата с помощью специальных ботов, например @userinfobot

        const telegramBotToken = "6228120174:AAF3Sbqsw68BC8y1CxZe6LPcjhNCzwAXg2I";
        const chatId = "-1001564077531"; // Замените на ID вашей группы в Telegram

        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("text", message);

// Отправка сообщения в Telegram
        fetch(telegramApiUrl, { method: "POST", body: formData })
            .then(() => {
                alert("Заказ оформлен! Ожидайте доставки.");
                cartItems.length = 0;
                cartMenu.classList.add("hidden");
                updateCartItems();
                totalAmount = 0;
            })
            .catch((error) => {
                alert("Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.");
                console.error(error);
            });
    } else {
        alert("Пожалуйста, введите имя и время доставки.");
    }
}

// JavaScript для динамической адаптации количества контейнеров в ряду

function updateContainerLayout() {
    const container = document.querySelector(".product-container");
    const products = document.querySelectorAll(".product");
    const containerHeight = container.clientHeight;
    let productHeight = 300; // Задайте желаемую минимальную высоту контейнера товара

    let numInRow = Math.floor(containerHeight / productHeight);
    if (numInRow < 1) numInRow = 1;

    for (let i = 0; i < products.length; i += numInRow) {
        let row = products.slice(i, i + numInRow);
        let totalHeight = row.reduce((sum, product) => sum + product.offsetHeight, 0);

        if (totalHeight < containerHeight) {
            let additionalHeight = Math.floor((containerHeight - totalHeight) / row.length);
            row.forEach(product => {
                product.style.flexBasis = `${productHeight + additionalHeight}px`;
            });
        }
    }
}

window.addEventListener("resize", updateContainerLayout);
updateContainerLayout();

// Вызов функции обновления элементов корзины при инициализации страницы
updateCartItems();
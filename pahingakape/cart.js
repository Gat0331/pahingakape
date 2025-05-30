// Simple cart logic for your Add to Cart page

const menu = {
    espresso: { name: "Espresso", price: 80 },
    americano: { name: "Americano", price: 100 },
    cappuccino: { name: "Cappuccino", price: 120 },
    macchiato: { name: "Caramel Macchiato", price: 140 },
    croissant: { name: "Chocolate Croissant", price: 90 },
    muffin: { name: "Blueberry Muffin", price: 100 },
    cheesecake: { name: "Cheesecake Slice", price: 150 }
};

let cart = [];

function addItem(itemKey) {
    const qtyInput = document.querySelector(`input[name="${itemKey}"]`);
    const quantity = parseInt(qtyInput.value, 10);
    if (quantity > 0) {
        const existing = cart.find(i => i.key === itemKey);
        if (existing) {
            existing.quantity += quantity;
            existing.subtotal = existing.quantity * menu[itemKey].price;
        } else {
            cart.push({
                key: itemKey,
                name: menu[itemKey].name,
                quantity: quantity,
                subtotal: quantity * menu[itemKey].price
            });
        }
        qtyInput.value = 0;
        renderCart();
    }
}

function removeItem(itemKey) {
    cart = cart.filter(i => i.key !== itemKey);
    renderCart();
}

function renderCart() {
    const cartTable = document.getElementById('cartTable');
    // Remove all rows except the header
    cartTable.innerHTML = `
        <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
        </tr>
    `;
    let total = 0;
    cart.forEach(item => {
        total += item.subtotal;
        const row = cartTable.insertRow();
        row.insertCell(0).innerText = item.name;
        row.insertCell(1).innerText = item.quantity;
        row.insertCell(2).innerText = `₱${item.subtotal}`;
        const removeBtn = document.createElement('button');
        removeBtn.innerText = 'Remove';
        removeBtn.onclick = () => removeItem(item.key);
        row.insertCell(3).appendChild(removeBtn);
    });
    document.getElementById('cartTotal').innerText = `Total: ₱${total}`;
}

function saveOrderToDatabase() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    fetch('save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Order saved!");
            cart = [];
            renderCart();
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(err => {
        alert("Failed to save order.");
    });
}

// Initial render
renderCart();
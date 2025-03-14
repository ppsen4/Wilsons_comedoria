// Função para calcular o total dos itens selecionados
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para coletar os itens selecionados
function getSelectedItems() {
    const items = [];
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]:checked');
        if (checkbox) {
            const itemId = checkbox.id.replace('item', '');
            const quantityInput = container.querySelector(`#quantity${itemId}`);
            const quantity = parseInt(quantityInput?.value || 0);
            items.push({
                name: checkbox.nextElementSibling.textContent.trim(),
                price: parseFloat(checkbox.getAttribute('data-price')),
                quantity: quantity
            });
        }
    });
    return items;
}

// Função para atualizar o preço total global e exibir na div
function updateTotalPrice() {
    const total = calculateTotal(getSelectedItems());
    const totalDisplayInDiv = document.getElementById('totalPedidoFinal');
    if (totalDisplayInDiv) {
        totalDisplayInDiv.textContent = `Valor Total do Pedido: R$${total.toFixed(2)}`;
    }
}

// Função para enviar o pedido via WhatsApp
function sendOrder() {
    const selectedItems = getSelectedItems();
    const nome = document.getElementById('nome').value;
    const local = document.getElementById('local').value;
    const payment = document.getElementById('payment').value;
    const total = calculateTotal(selectedItems);

    if (selectedItems.length === 0 || !nome || !local || !payment) {
        alert("Por favor, preencha todas as informações.");
        return;
    }

    const message = encodeURIComponent(`
        Nome: ${nome}
        Pedido: ${selectedItems.map(item => `${item.name} (x${item.quantity})`).join(', ')}
        Local: ${local}
        Forma de pagamento: ${payment}
        Total: R$${total.toFixed(2)}
    `);

    const whatsappUrl = `https://wa.me/553115998246120?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Função para permitir refazer o pedido
function redoOrder() {
    document.getElementById('nome').value = '';
    document.getElementById('local').value = '';
    document.getElementById('payment').value = 'dinheiro';
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = 1;
        input.disabled = true;
    });
    updateTotalPrice();
}

// Função para verificar o status do restaurante
function checkOpeningStatus() {
    const now = new Date();
    const hour = now.getHours();
    const statusElement = document.getElementById('status');

    if (hour >= 9 && hour < 19) { // Supondo que o restaurante funciona das 9h às 19h
        statusElement.textContent = "Aberto";
        statusElement.classList.add('aberto');
        statusElement.classList.remove('fechado');
    } else {
        statusElement.textContent = "Fechado";
        statusElement.classList.add('fechado');
        statusElement.classList.remove('aberto');
    }
}

// Configurar eventos e inicializações
document.getElementById('submitBtn').addEventListener('click', sendOrder);
document.getElementById('redoBtn').addEventListener('click', redoOrder);
document.querySelectorAll('.container input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const container = checkbox.closest('.container');
        const itemId = this.id.replace('item', '');
        const quantityInput = container.querySelector(`#quantity${itemId}`);
        if (this.checked) {
            quantityInput.disabled = false;
        } else {
            quantityInput.disabled = true;
            quantityInput.value = 1;
        }
        updateTotalPrice();
    });
});
document.querySelectorAll('.container input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
        updateTotalPrice();
    });
});

// Atualizar o status e o preço ao carregar a página
updateTotalPrice();
checkOpeningStatus();

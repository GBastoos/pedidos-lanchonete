const menu = document.getElementById("menu"); //Onde ficam todos os items
const cartBtn = document.getElementById("cart-btn"); //Botão veja seu carrinho
const cartModal = document.getElementById("cart-modal"); //Modal do carrinho
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total"); //Valor total dos items
const checkoutBtn = document.getElementById("checkout-btn"); //Botão de finalizar carrinho
const closeModalBtn = document.getElementById("close-modal-btn"); //Botão fechar
const cartCounter = document.getElementById("cart-count"); //Contador de items no carrinho
const addressInput = document.getElementById("address"); // INput do endereço
const addressWarn = document.getElementById("address-warn"); //Aviso caso não coloque endereço

let cart = [];

//Abrir Modal do carrinho
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

//Fechar Modal quando clicar fora
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//Usar botão fechar do Modal
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionar no carrinho
    addToCart(name, price);
  }
});

//Função para adicionar ao carrinho
function addToCart(name, price) {
  //Variavel para items que ja foram adicionados
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //Se o item ja existir, aumenta apenas a quantidade ao invés de adicionar novo
    existingItem.quantity += 1;
  } else {
    //Caso contrário apenas adicionar o novo item no carrinho
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualizar o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  //Loop de criação da DIV no modal
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    //Estrutura dos dados do item no Modal
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>


        <button class="cursor-pointer remove-from-cart-btn" data-name="${
          item.name
        }">
            Remover
        </button>
  
    </div>
    `;

    //Soma do total dos items
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  //Transformando o total em moeda local BRL
  cartTotal.textContent = total.toLocaleString("pt-Br", {
    style: "currency",
    currency: "BRL",
  });

  //Mudando o numero de items no carrinho pela quantidade de items diferentes
  cartCounter.innerHTML = cart.length;
}

//Função para remover items no carrinho
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

//Validação dado do input de endereço
addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  //Verificar se ele esta vazio ou não
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

//Finalizar carrinho
checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    ("");

    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //Enviar pra API do Whatsapp
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "47996008744";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];
  addressInput.value = "";
  updateCartModal();
});

//Verificação do horario de abertura
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;
  //true = restaurante aberto
}

//Mudança da cor do horario caso esteja fechado ou aberto
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}

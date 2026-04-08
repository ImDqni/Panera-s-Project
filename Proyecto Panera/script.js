/* 
================================================================================
  PANERA'S - LÓGICA DE FUNCIONALIDAD (JAVASCRIPT)
  
  Este archivo contiene toda la interactividad del sitio:
  1. Gestión del Menú Hamburguesa (Móvil)
  2. Sistema de Carrito de Compras
  3. Integración con WhatsApp para pedidos

================================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // === 1. GESTIÓN DEL MENÚ HAMBURGUESA ===
    // Seleccionamos los elementos necesarios del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav__list');

    // Función para abrir/cerrar el menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Toggle de clases para activar animaciones y visibilidad
            navList.classList.toggle('nav__list--active');
            menuToggle.classList.toggle('header__toggle--active');
            // Bloqueamos el scroll del cuerpo cuando el menú está abierto
            document.body.classList.toggle('no-scroll');
        });
    }

    // Cerrar el menú automáticamente al hacer clic en cualquier enlace
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('nav__list--active');
            menuToggle.classList.remove('header__toggle--active');
            document.body.classList.remove('no-scroll');
        });
    });


    // === 2. SISTEMA DE CARRITO DE COMPRAS ===
    
    // Estado del carrito: Intentamos cargar desde localStorage o empezamos vacío
    let cart = JSON.parse(localStorage.getItem('paneras_cart')) || [];

    // Elementos del DOM del carrito
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- Funciones de Apertura/Cierre ---
    const toggleCart = () => {
        cartSidebar.classList.toggle('cart-sidebar--active');
        document.body.classList.toggle('no-scroll');
    };

    if (cartToggle) cartToggle.addEventListener('click', toggleCart);
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // --- Lógica del Carrito ---

    // Función para guardar el estado actual en el navegador
    const saveCart = () => {
        localStorage.setItem('paneras_cart', JSON.stringify(cart));
        renderCart();
    };

    // Función para añadir un producto al carrito
    const addToCart = (id, name, price, image) => {
        // Verificamos si el producto ya existe en el carrito
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            // Si ya está, aumentamos la cantidad
            existingItem.quantity += 1;
        } else {
            // Si es nuevo, lo agregamos al array
            cart.push({
                id,
                name,
                price: parseFloat(price),
                image,
                quantity: 1
            });
        }
        
        saveCart();
        // Abrimos el carrito para que el usuario vea que se agregó
        if (!cartSidebar.classList.contains('cart-sidebar--active')) {
            toggleCart();
        }
    };

    // Función para cambiar la cantidad de un item
    window.updateQuantity = (id, delta) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            // Si la cantidad llega a 0, eliminamos el producto
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            saveCart();
        }
    };

    // Función para eliminar un item completamente
    window.removeItem = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveCart();
    };

    // Función para renderizar (dibujar) el carrito en el HTML
    const renderCart = () => {
        // Limpiamos el contenedor
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío, ¡añade productos para realizar el pedido!</p>';
            cartCountElement.textContent = '0';
            cartTotalElement.textContent = '$0.00';
            
            // VALIDACIÓN: Desactivar botón si está vacío
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = "0.5";
                checkoutBtn.style.cursor = "not-allowed";
                checkoutBtn.title = "Añade productos para realizar el pedido";
            }
            return;
        }

        // Si hay items, activamos el botón de nuevo
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = "1";
            checkoutBtn.style.cursor = "pointer";
            checkoutBtn.title = "";
        }

        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item__img" onerror="this.src='https://via.placeholder.com/50?text=Pan'">
                <div class="cart-item__info">
                    <span class="cart-item__name">${item.name}</span>
                    <span class="cart-item__price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item__controls">
                    <button class="btn-qty" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-qty" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="cart-item__remove" onclick="removeItem('${item.id}')">🗑️</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartCountElement.textContent = count;
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    };

    // Asignar eventos a los botones de "Añadir al Carrito" de la web
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-nombre');
            const price = button.getAttribute('data-precio');
            const image = button.getAttribute('data-imagen');
            
            addToCart(id, name, price, image);
        });
    });


    // === 3. INTEGRACIÓN CON WHATSAPP ===
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // SEGURIDAD: Si por algún motivo el carrito está vacío, no hace nada
            if (cart.length === 0) {
                alert("Tu carrito está vacío. ¡Añade deliciosos panes antes de pedir!");
                return;
            }

            // Construimos el mensaje de texto para WhatsApp
            let message = "¡Hola Panera's! Quisiera realizar el siguiente pedido porfavor.:\n\n";
            let total = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                message += `• ${item.quantity}x ${item.name} - $${subtotal.toFixed(2)}\n`;
                total += subtotal;
            });

            message += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*`;
            message += "\n\n¿Podrían confirmarme la disponibilidad?";

            // Codificamos el mensaje para la URL
            const encodedMessage = encodeURIComponent(message);
            // Número de WhatsApp configurado por el usuario
            const whatsappNumber = "+584162355075"; 
            
            // Redirigimos a WhatsApp
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        });
    }

    // Inicializamos el carrito al cargar la página
    renderCart();
});
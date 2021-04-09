//VARIABLES
    //menu slider
    const burger = document.getElementById('burger');
    const burgerLine3 = document.querySelector('#burger div:nth-child(3)');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelector('.nav-links li');
    const body = document.querySelector('body');
    const bodyOverlay = document.querySelector('body.cartShowed');
    console.log(bodyOverlay)

    //shopping cart
    const closeBtn = document.getElementById('btn-close');
    const cart = document.getElementById('cart');
    const shopingBagBtn = document.getElementById('btn-shopping');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('total-value');
    const cartCount = document.getElementById('quantity');
    const orderPlaceBtn = document.getElementById('order-place-btn');
    let cartItemID = cartList.children.length + 1;
    const cartButtons = document.querySelectorAll('.btn-cart');
    const successMsg = document.getElementById('success-msg')

    //back-to-top button
    const arrowUp = $('#back-to-top');
    const footer = $('#footer');

    //ui loading
    const handJewelEl = document.querySelector('#hand-jewellery-list');
    const bagsLuggageEl = document.querySelector('#bags-luggage-list');
    const othersEl = document.querySelector('#others');


//FUNCTIONS
    // load product items content form JSON file
    function loadJSON() {
        fetch('products.json')
        .then(res => res.json())
        .then(data => {
            let handJewelsUI = ''; 
            let bagsUI = ''; 
            let othersUI = ''; 

            let handJewels = [];
            let bags = [];
            let others = [];
            data.forEach(product =>{
                if(product.category === 'watch' || product.category === 'bracelet') {
                handJewels.push(product);
                } else if (product.category === 'bag' || product.category === 'luggage') {
                    bags.push(product)
                } else {
                    others.push(product);
                }

            })
            handJewels.forEach(item => {    
                handJewelsUI += `
                    <div class="card">
                        <div class="img-container">
                        <img src="${item.img}" alt="" />
                        </div>
                        <div class="product-info">
                            <p class="name">${item.name}</p>
                            <p class="price-text">$<span class="price">${item.price}</span></p>
                                <button class="btn-cart">
                                    <span class="add-to-cart">add to cart</span>
                                    <span class="added">item added to cart</span>
                                    <i class="fas fa-shopping-cart"></i>
                                    <i class="fas fa-box"></i>
                                </button>
                        </div>
                    </div>
                `;
            })
            bags.forEach(item => {    
                bagsUI += `
                    <div class="card">
                        <div class="img-container">
                        <img src="${item.img}" alt="" />
                        </div>
                        <div class="product-info">
                            <p class="name">${item.name}</p>
                            <p class="price-text">$<span class="price">${item.price}</span></p>
                            <button class="btn-cart">
                                <span class="add-to-cart">add to cart</span>
                                <span class="added">item added to cart</span>
                                <i class="fas fa-shopping-cart"></i>
                                <i class="fas fa-box"></i>
                            </button>
                        </div>
                    </div>
                `;
            })
            others.forEach(item => {    
                othersUI += `
                    <div class="card">
                        <div class="img-container">
                        <img src="${item.img}" alt="" />
                        </div>
                        <div class="product-info">
                            <p class="name">${item.name}</p>
                            <p class="price-text">$<span class="price">${item.price}</span></p>
                            <button class="btn-cart">
                                <span class="add-to-cart">add to cart</span>
                                <span class="added">item added to cart</span>
                                <i class="fas fa-shopping-cart"></i>
                                <i class="fas fa-box"></i>
                            </button>
                        </div>
                    </div>
                `;
            })
            handJewelEl.innerHTML = handJewelsUI;
            bagsLuggageEl.innerHTML = bagsUI;
            othersEl.innerHTML = othersUI;
        })
    }

    //keep track of the back-to-top button position
    function scrollSpy() {
        if($(document).height() - arrowUp.offset().top > footer.height()) {
            arrowUp.css('border-color', '#000');
            arrowUp.css('color', '#000');
            
        } else {
            arrowUp.css('border-color', '#fff');
            arrowUp.css('color', '#fff');
        }
    }

    // purchase product
    function purchaseProduct(e) {
        if(e.target.classList.contains('btn-cart')){
            const btn = e.target;
            let product = e.target.parentElement.parentElement;
            getProductInfo(product); 

            //add and remove clicked class
            e.target.classList.add('clicked');
            setTimeout(function(){
                btn.classList.remove('clicked')
            }, 2500);
        } else if (e.target.classList.contains('add-to-cart') || e.target.classList.contains('added')) {
            const btn = e.target;
            let product = e.target.parentElement.parentElement.parentElement;
            getProductInfo(product);

            //add and remove clicked class
            e.target.parentElement.classList.add('clicked');
            setTimeout(function(){
                btn.parentElement.classList.remove('clicked')
            }, 2500);
        }
    }

    // get product info after add to cart button click
    function getProductInfo(product){
        let productInfo = {
            id: cartItemID,
            img: product.querySelector('.img-container img').src,
            name: product.querySelector('.product-info .name').textContent,
            price: product.querySelector('.product-info .price-text .price').textContent
        }
        cartItemID++;
        // cartItemID = cartList.children.length + 1;
        addToCartList(productInfo);
        saveProductInStorage(productInfo);

    }

    // add the selected product to the cart list
    function addToCartList(product){
        const cartItem = document.createElement('div'); 
        cartItem.classList.add('item');
        cartItem.setAttribute('data-id', `${product.id}`);
        cartItem.innerHTML = `
        <div class="item-img">
            <img  src="${product.img}" alt="item">
        </div>
        <div class="item-info">
            <small class="name">${product.name}</small>
            <small class="remove">remove</small>
            <small>
            <i class="fas fa-plus light add-more"></i>
            <span class="add-more">Add 1 more to shopping bag</span>
            </small>
        </div>
        <div class="item-price">$${product.price}</div>
        `;
        cartList.appendChild(cartItem)
    }

    // save the product in the local storage
    function saveProductInStorage(item) {
        let products = getProductFromStorage();
        products.push(item);
        localStorage.setItem('products', JSON.stringify(products));
        updateCartInfo()
    }

    // get all the products info if there is any in the local storage
    function getProductFromStorage(){
        return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    }

    //load cart products
    function loadCart(){
        let products =  getProductFromStorage(); 
        if(cartList.children.length < 1) {
            cartItemID = 1; //if there is no any product in the local storage
        } else {
            cartItemID = cartList.children.length;  
            cartItemID++;
            //else get the id of the last product and increase it by 1
        }
        products.forEach(product => addToCartList(product));

        //calculate and update UI of cart info
        updateCartInfo();
    }

    //update cart
    function updateCartInfo(){
        let cartInfo = findCartInfo();
        cartCount.textContent = cartInfo.productCount;
        cartTotal.textContent = cartInfo.total;
    }

    //calculate total price
    function findCartInfo() {
        let products = getProductFromStorage(); 
        let total = products.reduce((acc, product) =>{
            let price = parseFloat(product.price);
            return acc += price; //add prices
        }, 0);
        return {
            total: "$" + total.toFixed(2), 
            productCount: products.length
        }
    }

    //delete product 
    function deleteProduct(e){
        let cartItem; 
        if(e.target.classList.contains('remove')) {
            cartItem = e.target.parentElement.parentElement;     
        }
        // cartItem.remove();
        cartList.removeChild(cartItem);
        let products = getProductFromStorage(); 
        
        let updatedProducts = products.filter(product => {
            return product.id !== parseInt(cartItem.dataset.id);
        });
        
        localStorage.setItem('products', JSON.stringify(updatedProducts)); //update the product list after remove button is clicked
        updateCartInfo();
    }

    // add one more item
    function addOneMoreItem(e){
        const cartItems = document.getElementsByClassName('item');
        if(e.target.classList.contains('add-more')){
            cartItem = e.target.parentElement.parentElement.parentElement;
            duplicateItem(cartItem);  
        }
    }

    //duplicate item
    function duplicateItem(cartItem) {
        let duplicatedItemInfo = {
            id: cartList.children.length + 1,
            img: cartItem.querySelector('.item-img img').src,
            name: cartItem.querySelector('.item-info .name').textContent,
            price: cartItem.querySelector('.item-price').textContent.substr(1)
        }
        addToCartList(duplicatedItemInfo);
        saveProductInStorage(duplicatedItemInfo);
    }

    //place order
    function placeOrder(e){
        const cartItemList = cartList.children;
        const cartItems = [...cartItemList];
        cartItems.forEach(item => {
            if(cartList.firstChild){
                cartList.removeChild(item)
            }
        })
        localStorage.clear();
        updateCartInfo();
        // close cart
        cart.classList.remove('showCart');
        body.classList.remove('cartShowed');
        // show msg
        showSuccessMsg();
    }

    //show success msg
    function showSuccessMsg(){
        successMsg.classList.add('show');
        setTimeout(function(){
            successMsg.classList.remove('show')
        }, 2000)
    }

    //smooth scrolling on IOS
    (function() {
        scrollTo();
    })();
    
    function scrollTo() {
        const links = document.querySelectorAll('.scroll');
        links.forEach(each => (each.onclick = scrollAnchors));
    }
    
    function scrollAnchors(e, respond = null) {
        const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
        e.preventDefault();
        var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
        const targetAnchor = document.querySelector(targetID);
        if (!targetAnchor) return;
        const originalTop = distanceToTop(targetAnchor);
        window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
        const checkIfDone = setInterval(function() {
            const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
            if (distanceToTop(targetAnchor) === 0 || atBottom) {
                targetAnchor.tabIndex = '-1';
                targetAnchor.focus();
                window.history.pushState('', '', targetID);
                clearInterval(checkIfDone);
            }
        }, 100);
    }

//INITIALIZE
scrollSpy();
updateCartInfo();

//EVENT LISTENERS
    burger.addEventListener('click', ()=>{
        // Burger anmimation
        burger.classList.toggle('toggle');
        burgerLine3.classList.toggle('short');
         
        //Nav links animation
        navLinks.classList.toggle('nav-active');

        //prevent vertical scrolling
        body.classList.toggle('fixed')
    })

    //direct to sections
    navLinks.addEventListener('click', (e)=>{
        if(e.target.tagName.toLowerCase() == "a" ) {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
            burgerLine3.classList.add('short');
            body.classList.remove('fixed'); 
            // arrowUp.toggle(function(){
            //     $(this).removeClass('none')
            // })  
        }     
    })

    //back-to-top button style based on scrolling
    window.addEventListener('scroll', scrollSpy)

    //
    window.addEventListener('DOMContentLoaded', () =>{
        loadJSON();
        loadCart();
    })

    //open and closing cart
    shopingBagBtn.addEventListener('click', ()=>{
        cart.classList.add('showCart');
        body.classList.add('cartShowed');
      
    })
    
    closeBtn.addEventListener('click', ()=>{
        cart.classList.remove('showCart');
        body.classList.remove('cartShowed');
    })

    window.addEventListener('click', (e)=>{
        if(e.target.classList.contains('cartShowed')){
            cart.classList.remove('showCart');
            body.classList.remove('cartShowed');
        }
    })

    //add items to cart
    handJewelEl.addEventListener('click', purchaseProduct);
    bagsLuggageEl.addEventListener('click', purchaseProduct);
    othersEl.addEventListener('click', purchaseProduct);

    //delete items
    cartList.addEventListener('click', deleteProduct);

    //add one more of the same item
    cartList.addEventListener('click', addOneMoreItem);

    //place your order
    orderPlaceBtn.addEventListener('click', placeOrder)

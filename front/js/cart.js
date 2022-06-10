//---------------------------     Définition des variables et constantes   ----------------------

const basketProductSection = document.querySelector('#cart__items');
const numberProductsContainer = document.querySelector('#totalQuantity');



// --------------- Fonction pour afficher les produits du LocalStorage dans le panier  ---------------

displayBasketProducts();


function displayBasketProducts (){

    getBasket();
    for (let i = 0; i < getBasket().length; i++) {
       
        // console.log(getBasket());     
        let productId = getBasket()[i].id;
        // console.log(productId);     
        fetch(`http://localhost:3000/api/products/${productId}`)
            .then((response) => response.json())
            .catch((err) => console.log("Il y a une erreur : " + err))
            .then((dataProduct) => {
                // console.log(dataProduct);                            
                const basketArticleInsert = 

                `<article class="cart__item" data-id="${productId}" data-color="${getBasket()[i].color}">
                    <div class="cart__item__img">
                        <img src="${dataProduct.imageUrl}" alt="${dataProduct.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${dataProduct.name}</h2>
                            <p>${getBasket()[i].color}</p>
                            <p class="cart__item__content__description__price">${dataProduct.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${getBasket()[i].quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>`;

                basketProductSection.insertAdjacentHTML("beforeend", basketArticleInsert);

            });  
    }
}






// -------------- Fonction pour supprimer les produits du LocalStorage et du panier  --------------


removeBasketProducts();


function removeBasketProducts (){

    setTimeout(() => {
        const removeBtn = document.getElementsByClassName('deleteItem');  
        // console.log(removeBtn);
        for ( let i = 0; i < removeBtn.length; i++){
            const basketArticle = document.querySelectorAll('.cart__item');
            const basketArticle__dataId = basketArticle[i].getAttribute('data-id');    
            const basketArticle__dataColor = basketArticle[i].getAttribute('data-color');
            let product__toRemove = removeBtn[i].closest('.cart__item');
    
            function removeFromBasket (product){          
                    let basket = getBasket();
                    basket = basket.filter(p => p.id != basketArticle__dataId || p.color != basketArticle__dataColor);   
                    saveBasket(basket);                                
            }  

            removeBtn[i].addEventListener("click", function (){
                                               
                removeFromBasket(product__toRemove);   
                product__toRemove.remove();
                quantityBasketProducts();
                numberProductsContainer.innerHTML = getNumberProduct(); 
                displayTotalBasketPrice();
            })

            
        }
    }, 1000);
}




// ------- Fonction pour modifier la quantité des produits dans le LocalStorage et le panier ------------


quantityBasketProducts ();

function quantityBasketProducts (){

    setTimeout(() => {

        const quantityBtn = document.getElementsByClassName('itemQuantity');

        for (let i = 0; i < quantityBtn.length; i++) {

            const basketArticle = document.querySelectorAll('.cart__item');
            const basketArticle__dataId = basketArticle[i].getAttribute('data-id');
            const basketArticle__dataColor = basketArticle[i].getAttribute('data-color');
            let product__toChangeQuantity = quantityBtn[i].closest('.cart__item');

            function changeQuantity(product){  
                let basket = getBasket();   
                let foundProduct = basket.find(p => p.id == basketArticle__dataId && p.color == basketArticle__dataColor);   
                if(foundProduct != undefined){
                    foundProduct.quantity = quantityBtn[i].value; 
                    // console.log(quantityBtn[i].value);
                                                   
                }  
                saveBasket(basket);                
            }

            quantityBtn[i].addEventListener("change", function(){
                
                changeQuantity(product__toChangeQuantity);               
                numberProductsContainer.innerHTML = getNumberProduct(); 
                displayTotalBasketPrice();              
            })
            

            
        }
    }, 300);
}

// ------------------------ Affichage du nombre total de produits-----------------------


numberProductsContainer.insertAdjacentHTML('beforeend', parseInt(getNumberProduct()));



// --------------------------    Affichage du prix total      ----------------------

displayTotalBasketPrice();

function displayTotalBasketPrice () {

    setTimeout(() => {
    
        const basketProductPrice = document.querySelectorAll('.cart__item__content__description__price');
        const quantityBtn = document.getElementsByClassName('itemQuantity');
        let basketTotalPrice = document.querySelector('#totalPrice');
    
        let productPriceTab = [];
        let productQuantityTab = [];
        let productResultTab = [];
       
        for (let i = 0; i < basketProductPrice.length; i++){
            productPriceTab.push(basketProductPrice[i].innerHTML);  
            productQuantityTab.push(quantityBtn[i].value);
        }
    
        for (let j = 0; j < productPriceTab.length; j++){
            productResultTab.push(parseInt(productPriceTab[j]) * parseInt(productQuantityTab[j]));
        }
        // console.log(productResultTab);
    
        let sum = 0;
        for (let k = 0; k < productResultTab.length; k++) {
        sum += productResultTab[k];
        }
        // console.log(sum);
    
        
        basketTotalPrice.innerHTML = sum;
        
    
    }, 300);

}



// -------------------------- Fonctions panier ---------------------------------------------

function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket (){
    let basket = localStorage.getItem("basket");
    if(basket == null){
        return [];                            
    } else {                                  
        return JSON.parse(basket);
    }
}

function getNumberProduct(){
    let basket = getBasket();
    let number = 0;                          
    for (let product of basket){            
        number += parseInt(product.quantity);         
    }
    return number; 
}









// --------------------------  Validation formulaire du panier --------------------------
// ---------------------------------------------------------------------------------------

// Initialisation des variables et constantes

const inputFirstName = document.querySelector('#firstName');
const inputLastName = document.querySelector('#lastName');
const inputAddress = document.querySelector('#address');
const inputCity = document.querySelector('#city');
const inputEmail = document.querySelector('#email');
const orderBtn = document.querySelector('#order');

const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
const addressErrorMsg = document.querySelector('#addressErrorMsg');
const cityErrorMsg = document.querySelector('#cityErrorMsg');
const emailErrorMsg = document.querySelector('#emailErrorMsg');


// Initialisation des Regex

const regexName = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;    
const regexAdress = /^\s*\S+(?:\s+\S+){2}/;
const regexCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/; 
const regexEmail = /\S+@\S+\.\S+/;



// Validation des champs prénom et nom 

inputFirstName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        firstNameErrorMsg.style.display = "none";
    } 
    if(e.target.value.search(regexName) === -1) {
        firstNameErrorMsg.style.display = "inline";
        firstNameErrorMsg.innerText = "Le prénom n'est pas valide";
    }

})


inputLastName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        lastNameErrorMsg.style.display = "none";
    } 
    if(e.target.value.search(regexName) === -1) {
        lastNameErrorMsg.style.display = "inline";
        lastNameErrorMsg.innerText = "Le nom n'est pas valide";
    }

})


// Validation des champs adresse et ville

inputAddress.addEventListener('input', (e) => {
    if(e.target.value.search(regexAdress) === 0){
       addressErrorMsg.style.display = "none";
    } 
    if(e.target.value.search(regexAdress) === -1) {
        addressErrorMsg.style.display = "inline";
        addressErrorMsg.innerText = "L'adresse n'est pas valide";
    }
})


inputCity.addEventListener('input', (e) => {
    if(e.target.value.search(regexCity) === 0){
       cityErrorMsg.style.display = "none";
    } 
    if(e.target.value.search(regexCity) === -1) {
        cityErrorMsg.style.display = "inline";
        cityErrorMsg.innerText = "La ville n'est pas valide";
    }
})


// Validation du champ email

inputEmail.addEventListener('input', (e) => {
    if(e.target.value.search(regexEmail) === 0){
       emailErrorMsg.style.display = "none";
    } 
    if(e.target.value.search(regexEmail) === -1) {
        emailErrorMsg.style.display = "inline";
        emailErrorMsg.innerText = "L'e-mail n'est pas valide";
    }
})





// ---------------- Confirmation de la commande ------------------------
// -------------------------------------------------------------------


let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
};

let products = [];


orderBtn.addEventListener('click', (e) => {

    // Je récupère les informations du formulaire dans un objet "contact"

    e.preventDefault();
    contact.firstName = inputFirstName.value;
    contact.lastName = inputLastName.value;
    contact.address = inputAddress.value;
    contact.city = inputCity.value;
    contact.email = inputEmail.value;
    console.log(contact);

    // Je récupère l'id de chaque produit dans le localStorage dans l'array "products"
    
    getBasket();
    // console.log(getBasket());
    for (let itemId of getBasket()) {
            products.push(itemId.id);
    }
    console.log(products);


    
})


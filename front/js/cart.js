//---------------------------     Définition des variables et constantes   ----------------------

const basketProductSection = document.querySelector('#cart__items');
const numberProductsContainer = document.querySelector('#totalQuantity');
const basketForm = document.querySelector('.cart__order');

// --------------  Si le panier est vide, je fait disparaitre le formulaire ---------------------

basketFormDisplay ();

function basketFormDisplay () {
    if (getNumberProduct() == 0){
        basketForm.style.display = "none";
    }
}

// -------------------------------   Fonctions panier    ----------------------------------

// Sauvegarder panier
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}
// Recevoir panier
function getBasket (){
    let basket = localStorage.getItem("basket");
    if(basket == null){
        return [];                            
    } else {                                  
        return JSON.parse(basket);
    }
}
// Recevoir nombre de produits dans le panier
function getNumberProduct(){
    let basket = getBasket();
    let number = 0;                          
    for (let product of basket){            
        number += parseInt(product.quantity);         
    }
    return number; 
}


// --------------- Fonction pour afficher les produits du LocalStorage dans le panier  ---------------

displayBasketProducts();

function displayBasketProducts (){
    getBasket();

    for (let i = 0; i < getBasket().length; i++) { 

        let productId = getBasket()[i].id;

        fetch(`http://localhost:3000/api/products/${productId}`)
            .then((response) => response.json())
            .catch((err) => console.log("Il y a une erreur : " + err))
            .then((dataProduct) => {  
                // Création carte produit   
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
                // Affichage carte produit
                basketProductSection.insertAdjacentHTML("beforeend", basketArticleInsert);
            });  
    }
}


// -------------- Fonction pour supprimer les produits du LocalStorage et du panier  --------------

removeBasketProducts();

function removeBasketProducts (){
    setTimeout(() => {
        const removeBtn = document.getElementsByClassName('deleteItem');  

        for ( let i = 0; i < removeBtn.length; i++){
            const basketArticle = document.querySelectorAll('.cart__item');
            const basketArticle__dataId = basketArticle[i].getAttribute('data-id');    
            const basketArticle__dataColor = basketArticle[i].getAttribute('data-color');
            let product__toRemove = removeBtn[i].closest('.cart__item');
    
            function removeFromBasket (){          
                    let basket = getBasket();
                    basket = basket.filter(p => p.id != basketArticle__dataId || p.color != basketArticle__dataColor);   
                    saveBasket(basket);                                
            }  

            removeBtn[i].addEventListener("click", function (){
                                               
                removeFromBasket(product__toRemove);   
                product__toRemove.remove();
                modifyQuantityBasketProducts();
                numberProductsContainer.innerHTML = getNumberProduct(); 
                displayTotalBasketPrice();
            }) 
        }
    }, 1000);
}



// ------- Fonction pour modifier la quantité des produits dans le LocalStorage et le panier ------------


modifyQuantityBasketProducts ();

function modifyQuantityBasketProducts (){

    setTimeout(() => {

        quantityBtn = document.querySelectorAll('.itemQuantity');

        quantityBtn.forEach( e => {
            let basketArticle = e.closest('.cart__item');
            let basketArticle__dataId = basketArticle.getAttribute('data-id');
            let basketArticle__dataColor = basketArticle.getAttribute('data-color');
            
            function changeQuantity(){  
                let basket = getBasket();   
                let foundProduct = basket.find(p => p.id == basketArticle__dataId && p.color == basketArticle__dataColor);   
                if(foundProduct != undefined){
                    foundProduct.quantity = e.value;                                             
                }
                saveBasket(basket);                
            }

            e.addEventListener("change", function(){            
                changeQuantity();               
                numberProductsContainer.innerHTML = getNumberProduct(); 
                displayTotalBasketPrice();              
            })  
        });
    }, 800);
}

// ------------------------ Affichage du nombre total de produits-----------------------

displayTotalNumberProducts ();

function displayTotalNumberProducts () {
    numberProductsContainer.insertAdjacentHTML('beforeend', parseInt(getNumberProduct()));
}


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
    
        let sum = 0;
        for (let k = 0; k < productResultTab.length; k++) {
        sum += productResultTab[k];
        }

        basketTotalPrice.innerHTML = sum;
    }, 300);
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

const allInputs = document.querySelectorAll('.cart__order__form__question input');
const allErrorMsg = document.querySelectorAll('.cart__order__form__question p');


// Initialisation des Regex
const regexName = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;    
const regexAdress = /^\s*\S+(?:\s+\S+){2}/;
const regexCity = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/; 
const regexEmail = /\S+@\S+\.\S+/;


// Je stock le résultat de mes inputs du formulaire
let inputCheck = {
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    email: false
}


// Validation des champs prénom et nom 
inputFirstName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        firstNameErrorMsg.style.display = "none";
        inputCheck.firstName = true;
    }
    else if(e.target.value.search(regexName) === -1) {
        firstNameErrorMsg.style.display = "inline";
        firstNameErrorMsg.innerText = "Le prénom n'est pas valide";
        inputCheck.firstName = false;
    }
})

inputLastName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        lastNameErrorMsg.style.display = "none";
        inputCheck.lastName = true;  
    } 
    else if(e.target.value.search(regexName) === -1) {
        lastNameErrorMsg.style.display = "inline";
        lastNameErrorMsg.innerText = "Le nom n'est pas valide";
        inputCheck.lastName = false;      
    }
})

// Validation des champs adresse et ville
inputAddress.addEventListener('input', (e) => {
    if(e.target.value.search(regexAdress) === 0){
       addressErrorMsg.style.display = "none"; 
       inputCheck.address = true;
    } 
    else if(e.target.value.search(regexAdress) === -1) {
        addressErrorMsg.style.display = "inline";
        addressErrorMsg.innerText = "L'adresse n'est pas valide";       
    }
})

inputCity.addEventListener('input', (e) => {
    if(e.target.value.search(regexCity) === 0){
       cityErrorMsg.style.display = "none";  
       inputCheck.city = true;
    } 
    else if(e.target.value.search(regexCity) === -1) {
        cityErrorMsg.style.display = "inline";
        cityErrorMsg.innerText = "La ville n'est pas valide";    
        inputCheck.city = false; 
    }
})

// Validation du champ email
inputEmail.addEventListener('input', (e) => {
    if(e.target.value.search(regexEmail) === 0){
       emailErrorMsg.style.display = "none";  
       inputCheck.email = true;
    } 
    else if(e.target.value.search(regexEmail) === -1) {
        emailErrorMsg.style.display = "inline";
        emailErrorMsg.innerText = "L'e-mail n'est pas valide"; 
        inputCheck.email = false;     
    }
})



// ------------------------------- Confirmation de la commande ---------------------------------------
// --------------------------------------------------------------------------------------------------


// Je stock les informations à envoyer à l'API
let contact = {
    firstName : "",
    lastName : "",
    address : "",
    city : "",
    email : "",
};

let products = [];

// Je réunis les informations à envoyer à l'API
let dataToSend = {
    contact: contact,
    products: products
}

// Je récupère les infos à envoyer
function storeOrderInformations () {
    contact.firstName = inputFirstName.value;
    contact.lastName = inputLastName.value;
    contact.address = inputAddress.value;
    contact.city = inputCity.value;
    contact.email = inputEmail.value;

    getBasket();
    for (let itemId of getBasket()) {
            products.push(itemId.id);
    }
}

// J'envoie les infos à l'API 
function pushOrderInformations () {
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
        .then(res => res.json())
        .then(data => {
            // je redirige l'utilisateur sur la page confirmation avec le numéro de commande dans l'URL
            window.location.href = `./confirmation.html?orderId=${data.orderId}`;
            // console.log(data);
        })
        .catch(err => console.log(err));
}


// Sous certaines conditions, j'appelle mes précédentes fonctions lors du click

mainOrderFunction ();

function mainOrderFunction () {
    orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (Object.values(inputCheck).every(value => value == true) && getBasket().length != 0) {
            // Si tout les inputs du formulaire sont ok et que le panier n'est pas nu alors
            storeOrderInformations();         
            pushOrderInformations();
            localStorage.clear();
        } else { 
            alert("Le formulaire n'est pas correctement rempli et/ou votre panier est vide");
            return;
        }
    })
}

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
// Recevoir nombre de produits présents dans le panier
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
                // Création article
                const basketArticleInsert = document.createElement('article');
                basketArticleInsert.classList.add("cart__item");
                basketArticleInsert.setAttribute("data-id", `${productId}`);
                basketArticleInsert.setAttribute("data-color", `${getBasket()[i].color}`);
                basketProductSection.appendChild(basketArticleInsert);
                // Création 'div' pour img
                const basketDivImgInsert = document.createElement('div');
                basketDivImgInsert.classList.add("cart__item__img");
                basketArticleInsert.appendChild(basketDivImgInsert);
                // Création img 
                const basketImgInsert = document.createElement('img');
                basketDivImgInsert.appendChild(basketImgInsert);
                basketImgInsert.src = dataProduct.imageUrl;
                basketImgInsert.alt = dataProduct.altTxt;
                // Création div 'cart item content'
                const basketCartItemContentInsert = document.createElement('div');
                basketCartItemContentInsert.classList.add('cart__item__content');
                basketArticleInsert.appendChild(basketCartItemContentInsert);
                // Création div 'cart item content description'
                const basketCartItemContentDescriptionInsert = document.createElement('div');
                basketCartItemContentDescriptionInsert.classList.add('cart__item__content__description');
                basketCartItemContentInsert.appendChild(basketCartItemContentDescriptionInsert);


                // ---- Création du contenu de la div 'cart item content description' ----
                // Création nom produit
                const basketProductName = document.createElement('h2');
                basketProductName.innerText = `${dataProduct.name}`;
                basketCartItemContentDescriptionInsert.appendChild(basketProductName);
                // Création couleur produit
                const basketProductColor = document.createElement('p');
                basketProductColor.innerText = `${getBasket()[i].color}`;
                basketCartItemContentDescriptionInsert.appendChild(basketProductColor);
                // Création prix du produit
                const basketProductPrice = document.createElement('p');
                basketProductPrice.classList.add('cart__item__content__description__price');
                basketProductPrice.innerText = `${dataProduct.price} €`;
                basketCartItemContentDescriptionInsert.appendChild(basketProductPrice);
                // Création div 'cart__item__content__settings'
                const basketCartItemContentSettingsInsert = document.createElement('div');
                basketCartItemContentSettingsInsert.classList.add('cart__item__content__settings');
                basketCartItemContentInsert.appendChild(basketCartItemContentSettingsInsert);


                // ----- Création contenu de la div 'cart__item__content__settings' -------
                // Création div 'cart__item__content__settings__quantity'
                const basketCartItemContentSettingsQuantityInsert = document.createElement('div');
                basketCartItemContentSettingsQuantityInsert.classList.add('cart__item__content__settings__quantity');
                basketCartItemContentSettingsInsert.appendChild(basketCartItemContentSettingsQuantityInsert);


                // Création texte quantité
                const basketProductQuantityText = document.createElement('p');
                basketProductQuantityText.innerText = "Qté : ";
                basketCartItemContentSettingsQuantityInsert.appendChild(basketProductQuantityText);
                //  Création input quantité
                const basketProductQuantityInput = document.createElement('input');
                basketProductQuantityInput.classList.add('itemQuantity');
                basketProductQuantityInput.type = "number";
                basketProductQuantityInput.name = "itemQuantity";
                basketProductQuantityInput.min = "1";
                basketProductQuantityInput.max = "100";
                basketProductQuantityInput.value = getBasket()[i].quantity;
                basketCartItemContentSettingsQuantityInsert.appendChild(basketProductQuantityInput);


                // Création div 'cart__item__content__settings__delete'
                const basketCartItemContentSettingsDeleteinsert = document.createElement('div');
                basketCartItemContentSettingsDeleteinsert.classList.add('cart__item__content__settings__delete');
                basketCartItemContentSettingsInsert.appendChild(basketCartItemContentSettingsDeleteinsert);

                // Création texte "Supprimer"
                const basketProductDeleteButton = document.createElement('p');
                basketProductDeleteButton.classList.add('deleteItem');
                basketProductDeleteButton.innerText = "Supprimer";
                basketCartItemContentSettingsDeleteinsert.appendChild(basketProductDeleteButton);

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
                if (e.value <= 0){
                    alert("Le nombre d'articles ne peut être inférieur à 0, veuillez choisir un nombre entre 1 et 100");
                    e.value = 1;
                }           
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
const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Je stock le résultat de mes inputs du formulaire
let inputCheck = {
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    email: false
}

// Validation du champ prénom
inputFirstName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        firstNameErrorMsg.style.display = "none";
        inputCheck.firstName = true;
    }
    else if(e.target.value.search(regexName) === -1) {
        firstNameErrorMsg.style.display = "inline";
        firstNameErrorMsg.innerText = "Le prénom ne peut pas contenir de chiffres et/ou de caractères spéciaux";
        inputCheck.firstName = false;
    }
})

// Validation du champ Nom

inputLastName.addEventListener('input', (e) => {
    if(e.target.value.search(regexName) === 0){
        lastNameErrorMsg.style.display = "none";
        inputCheck.lastName = true;  
    } 
    else if(e.target.value.search(regexName) === -1) {
        lastNameErrorMsg.style.display = "inline";
        lastNameErrorMsg.innerText = "Le nom ne peut pas contenir de chiffres et/ou de caractères spéciaux";
        inputCheck.lastName = false;      
    }
})

// Validation du champ Adresse
inputAddress.addEventListener('input', (e) => {
    if(e.target.value.search(regexAdress) === 0){
       addressErrorMsg.style.display = "none"; 
       inputCheck.address = true;
    } 
    else if(e.target.value.search(regexAdress) === -1) {
        addressErrorMsg.style.display = "inline";
        addressErrorMsg.innerText = "L'adresse doit comporter au moins un chiffre et au moins deux chaines de caractères";       
    }
})

// Validation du champ Ville

inputCity.addEventListener('input', (e) => {
    if(e.target.value.search(regexCity) === 0){
       cityErrorMsg.style.display = "none";  
       inputCheck.city = true;
    } 
    else if(e.target.value.search(regexCity) === -1) {
        cityErrorMsg.style.display = "inline";
        cityErrorMsg.innerText = "La ville ne peut pas contenir de chiffres et/ou de caractères spéciaux";    
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
        emailErrorMsg.innerText = "L'e-mail doit respecter le format suivant: ------@-----.--"; 
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


// Sous certaines conditions, j'appelle mes précédentes fonctions lors du clic

mainOrderFunction ();

function mainOrderFunction () {
    orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (Object.values(inputCheck).every(value => value == true) && getBasket().length != 0) {
            // Si tout les inputs du formulaire sont true et que le panier n'est pas nul alors
            storeOrderInformations();         
            pushOrderInformations();
            localStorage.clear();
        } else { 
            alert("Le formulaire n'est pas correctement rempli et/ou votre panier est vide");
            return;
        }
    })
}

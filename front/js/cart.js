//---------------------------     Définition des variables et constantes   ----------------------

const basketProductSection = document.querySelector('#cart__items');
const numberProductsContainer = document.querySelector('#totalQuantity');



// --------------------------    Fonction pour afficher les produits du LocalStorage dans le panier  ---------------

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
                            <p id="cart__item__content__description__price">${dataProduct.price} €</p>
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






// ------------------- Fonction pour supprimer les produits du LocalStorage et du panier visuel -------------------------



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
            })

            
        }
    }, 1000);
}




// ------------------------ Fonction pour modifier la quantité des produits dans le LocalStorage et le panier ---------------------


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
            })
            

            
        }
    }, 1000);
}

// ------------------------ Affichage du nombre total de produits-----------------------


numberProductsContainer.insertAdjacentHTML('beforeend', parseInt(getNumberProduct()));



// --------------------------    Affichage du prix total      ----------------------










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

// --------------------------------


function getTotalPrice (){
    let basket = getBasket();
    let total = 0;                                    
    for (let product of basket){                      
        total += product.quantity * product.price;    
    }
    return total;                                     
}
// Définition des variables et constantes 

const basketProductSection = document.querySelector('#cart__items');






// Fonction pour afficher les produits du LocalStorage 

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
                            <p>${dataProduct.price} €</p>
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





















// Fonctions panier

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



function removeFromBasket (product){          
    let basket = getBasket();
    basket = basket.filter(p => p.id != product.id);    
    saveBasket(basket);                                
}



function changeQuantity(product, quantity){  
    let basket = getBasket();   
    let foundProduct = basket.find(p => p.id == product.id);    
    if(foundProduct != undefined){
        foundProduct.quantity += quantity;        
        if(foundProduct.quantity <= 0){
            removeFromBasket(foundProduct);
        } else {          
            saveBasket(basket);                
        }
    }   
}



function getNumberProduct(){
    let basket = getBasket();
    let number = 0;                          
    for (let product of basket){            
        number += product.quantity;         
    }
    return number;                         
}



function getTotalPrice (){
    let basket = getBasket();
    let total = 0;                                    
    for (let product of basket){                      
        total += product.quantity * product.price;    
    }
    return total;                                     
}
// -------------------- Initialisation des variables DOM ------------------------

const product__Img = document.querySelector('.item__img');
const product__Name = document.querySelector('#title');
const product__Price = document.querySelector('#price');
const product__Description = document.querySelector('#description');
const product__valueOption = document.querySelector('#colors');
const product__quantity = document.querySelector('#quantity') ;
const addToCart__Btn = document.querySelector('#addToCart');


// -------------------- Récupération de l'id URL du produit --------------------

let locationUrl = new URL(document.location).searchParams;
let productId = locationUrl.get("id");

// --------------------- Appel API du produit -------------------------------

fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .catch((err) => console.log("Il y a une erreur : " + err))
    .then((dataProduct) => getProduct(dataProduct));


// ------------------ Fonction affichage des produits ---------------------

function getProduct (dataProduct) {

    // Image du produit
    const product__Img__Insert = 
    `<img src="${dataProduct.imageUrl}" alt="${dataProduct.altTxt}">`;
    product__Img.insertAdjacentHTML("beforeend", product__Img__Insert);

    // Nom du produit
    product__Name.insertAdjacentHTML("beforeend", dataProduct.name);

    // Prix du produit
    product__Price.insertAdjacentHTML("beforeend", dataProduct.price);

    // Description du produit
    product__Description.insertAdjacentHTML("beforeend", dataProduct.description);

    // Value options couleurs du produit
    for ( let colors of dataProduct.colors) {
        const product__valueOption__Insert = `<option value="${colors}">${colors}</option>`;
        // console.log(product__valueOption__Insert);
        product__valueOption.insertAdjacentHTML("beforeend", product__valueOption__Insert);
    };
};



// ----------------------------       GESTION LOCAL STORAGE    ------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------


//  -------------- Fonctions du panier -----------------

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
// Ajouter au panier
function addBasket(product){            
    let basket = getBasket();   
    let foundProduct = basket.find(p => p.id == product.id && p.color == product.color);   
    if(foundProduct != undefined){ 
        foundProduct.quantity = parseInt(foundProduct.quantity) + parseInt(product__quantity.value);    
    } else {                       
        basket.push(product);
    }
    saveBasket(basket);           
}



// ----------------  Appel API + Ajout produits au panier(quantité et couleur)  ----------------


fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .catch((err) => console.log("Il y a une erreur : " + err))
    .then((dataProduct) => {
        addToCart__Btn.addEventListener('click', function() {
            if (product__valueOption.value == ""){
                alert('Veuillez choisir une couleur');
            } 
            else if(product__quantity.value < 0){
                alert("Veuillez choisir un nombre d'articles entre 1 et 100")
            }
            else {

                let productBasketInfos = {
                    id : dataProduct._id,
                    color :"",
                    quantity : "",
                };
                productBasketInfos.quantity = product__quantity.value;
                productBasketInfos.color = product__valueOption.value;
                addBasket(productBasketInfos);  
                alert("Votre produit a bien été ajouté au panier");       
            }
        })
    });


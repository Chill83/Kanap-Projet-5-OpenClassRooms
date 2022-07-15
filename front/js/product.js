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


// ------------------- Affichage des informations produits ------------------

productInformationsDisplay();


// --------------------- Appel API du produit -------------------------------

function productInformationsDisplay() {
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .catch((err) => console.log("Il y a une erreur : " + err))
    .then((dataProduct) => getProduct(dataProduct));
}


// ------------------ Affichage des produits ---------------------

function getProduct (dataProduct) {

    // Insertion image du produit
    const product__Img__Insert = document.createElement('img');
    product__Img.appendChild(product__Img__Insert);
    product__Img__Insert.src = dataProduct.imageUrl;
    product__Img__Insert.alt = dataProduct.altTxt;

    // Insertion nom du produit
    product__Name.innerText = dataProduct.name;

    // Insertion prix du produit
    product__Price.innerText = dataProduct.price;

    // Insertion description du produit
    product__Description.innerText = dataProduct.description;

    // Boucle pour insertion options couleurs du produit
    for ( let colors of dataProduct.colors) {
        // Création options couleurs 
        const product__valueOption__Insert = document.createElement('option');
        product__valueOption__Insert.setAttribute("value", colors);
        product__valueOption__Insert.innerText = colors;
        // Insertion option couleurs
        product__valueOption.appendChild(product__valueOption__Insert);
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


// ----------------  Appel API + Ajout produits au panier(id, quantité et couleur)  ----------------


addProductToBasket();

function addProductToBasket() {
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .catch((err) => console.log("Il y a une erreur : " + err))
    .then((dataProduct) => {
        addToCart__Btn.addEventListener('click', function() {
            if (product__valueOption.value == ""){
                alert('Veuillez choisir une couleur');
            } 
            else if(product__quantity.value <= 0){
                alert("Veuillez choisir un nombre d'articles entre 1 et 100");
                product__quantity.value = 1;
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
}



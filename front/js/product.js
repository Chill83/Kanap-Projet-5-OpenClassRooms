// Initialisation des variables DOM

const product__Img = document.querySelector('.item__img');
const product__Name = document.querySelector('#title');
const product__Price = document.querySelector('#price');
const product__Description = document.querySelector('#description');
const product__valueOption = document.querySelector('#colors');



//  Récupération de l'id produit

let locationUrl = new URL(document.location).searchParams;
let productId = locationUrl.get("id");

// console.log(productId);


// Appel API du produit

fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => response.json())
    .catch((err) => console.log("Il y a une erreur : " + err))
    .then((dataProduct) => getProduct(dataProduct));





function getProduct (dataProduct) {
    // console.log(dataProduct);


    // Image
    const product__Img__Insert = 
    `<img src="${dataProduct.imageUrl}" alt="Photographie d'un canapé">`;
    product__Img.insertAdjacentHTML("beforeend", product__Img__Insert);


    // Nom
    product__Name.insertAdjacentHTML("beforeend", dataProduct.name);


    // Prix
    product__Price.insertAdjacentHTML("beforeend", dataProduct.price);


    // Description
    product__Description.insertAdjacentHTML("beforeend", dataProduct.description);



    // Value options

    for ( let colors of dataProduct.colors) {
       
        const product__valueOption__Insert = `<option value="${colors}">${colors}</option>`;

        // console.log(product__valueOption__Insert);

        product__valueOption.insertAdjacentHTML("beforeend", product__valueOption__Insert);

    };
    
    

};

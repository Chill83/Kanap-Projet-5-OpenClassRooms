// Appel fonction affichage de tous les produits

productsDisplayOnIndex();

// Appel API

function productsDisplayOnIndex() {
    fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((dataProducts) => productsDisplay(dataProducts))
    .catch((err) => console.log("Il y a une erreur : " + err));
}

// Fonction création cartes produits 

function productsDisplay (dataProducts) {
    for ( let i = 0; i < dataProducts.length; i++) {
        // Initialisation constante DOM
        const productsContainer = document.querySelector('#items');


        // Création de la carte produit
        const productInsert = document.createElement('a');
        productInsert.setAttribute("href", `product.html?id=${dataProducts[i]._id}`);

        const productArticle = document.createElement('article');
        productInsert.appendChild(productArticle);

        const productImg = document.createElement('img');
        productArticle.appendChild(productImg);
        productImg.src = `${dataProducts[i].imageUrl}`;
        productImg.alt = `${dataProducts[i].altTxt}`;

        const productTitle = document.createElement('h3');
        productArticle.appendChild(productTitle);
        productTitle.innerText = `${dataProducts[i].name}`;

        const productDescription = document.createElement('p');
        productArticle.appendChild(productDescription);
        productDescription.innerText = `${dataProducts[i].description}`;

        productsContainer.appendChild(productInsert);
    }
};


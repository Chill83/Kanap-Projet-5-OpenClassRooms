// ---------------  Appel fonction affichage de tout les produits  ---------------

productsDisplayOnIndex();

// ------------------------   Appel API   -----------------------------------

function productsDisplayOnIndex() {
    fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((dataProducts) => productsDisplay(dataProducts))
    .catch((err) => console.log("Il y a une erreur : " + err));
}



// ------------------------ Fonction affichage des produits -----------------

function productsDisplay (dataProducts) {
    for ( let i = 0; i < dataProducts.length; i++) {

        const productInsert = 
            `<a href="product.html?id=${dataProducts[i]._id}"> 
                <article>
                    <img src="${dataProducts[i].imageUrl}" alt="${dataProducts[i].altTxt}">
                    <h3 class="productName">${dataProducts[i].name}</h3>
                    <p>${dataProducts[i].description}</p>
                </article>
            </a>`;
        const productsContainer = document.querySelector('#items');
        productsContainer.insertAdjacentHTML("beforeend", productInsert);

    }
};
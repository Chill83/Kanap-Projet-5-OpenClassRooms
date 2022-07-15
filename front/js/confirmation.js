// Je récupère et j'affiche le numéro de commande placé dans l'url

// Appel fonction pour afficher le nnuméro de commande
orderIdDisplay ();

// Fonction pour afficher le nnuméro de commande
function orderIdDisplay () {
    let orderIdUrl = new URL(window.location).searchParams;
    let orderId = orderIdUrl.get("orderId");
    let orderIdContainer = document.querySelector('#orderId');
    orderIdContainer.innerText = orderId;
}

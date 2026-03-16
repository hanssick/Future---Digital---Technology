// Funcție pentru adăugare în coș
let total = 0;
function addToCart(item, price) {
    const list = document.getElementById('cart-items');
    if(total === 0) list.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = `${item} - ${price} RON`;
    list.appendChild(li);
    total += price;
    document.getElementById('total-price').textContent = total;
}

// Logica pentru tooltip-uri sau alte interacțiuni viitoare poate fi adăugată aici.
console.log("Digital Future Technology - Script încărcat cu succes.");
//ADICIONANDO AS PIZZAS

const seletor = (elemento) => document.querySelector(elemento);
const seletores = (elemento) => document.querySelectorAll(elemento)
let modalQtd = 1;
let carrinho = [];
let modalKey = 0;

//LISTAGEM DAS PIZZAS
pizzaJson.map((item, index) => {
    let pizzaItem = seletor('.models .pizza-item').cloneNode(true); 

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault();
        let key = evento.target.closest('.pizza-item').getAttribute('data-key')
        modalQtd = 1; 
        modalKey = key;
        seletor('.pizzaBig img').src = pizzaJson[key].img;
        seletor('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        seletor('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        seletor('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        seletor('.pizzaInfo--size.selected').classList.remove('selected');
        seletores('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        seletor('.pizzaInfo--qtd').innerHTML = modalQtd;

        seletor('.pizzaWindowArea').style.opacity = 0;
        seletor('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            seletor('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    })

    seletor('.pizza-area').append(pizzaItem);
});

//EVENTOS DO MODAL
function closeModal() {
    seletor('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        seletor('.pizzaWindowArea').style.display = 'none';
    }, 500);

}
seletores('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});
//AÇÃO DE BOTÃO + OU - DO MODAL
seletor('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQtd > 1) {
        modalQtd--;
        seletor('.pizzaInfo--qtd').innerHTML = modalQtd;
    }
});

seletor('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQtd++;
    seletor('.pizzaInfo--qtd').innerHTML = modalQtd;
});
//AÇÃO BOTÃO TAMANHO
seletores('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (evento) => {
        seletor('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
//ADICIONAR AO CARRINHO
seletor('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(seletor('.pizzaInfo--size.selected').getAttribute('data-key'));
    console.log(`Tamanho da pizza ${size}`)

    
    let identificador = pizzaJson[modalKey].id + '<ID-TAMANHO>' + size

    let chave = carrinho.findIndex((item) => {
        return item.identificador == identificador
    });
    if (chave > -1) {
        carrinho[chave].qt += modalQtd;
    } else {
        carrinho.push({
            identificador,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQtd
        });
    }
    updateCart();
    closeModal();
});

//ABRIR CARRINHO MOBILE
seletor('.menu-openner').addEventListener('click', () => {
    if (carrinho.length > 0) {
        seletor('aside').style.left = '0';
    }
});
//CLICANDO NO x DO MOBILE PARA FECHAR
seletor('.menu-closer').addEventListener('click', () =>{
    seletor('aside').style.left = '100vw';
});

//UPDATE CARRINHO
function updateCart() {
    //MOBILE CARREGAR
    seletor('.menu-openner span').innerHTML = carrinho.length;

    if (carrinho.length > 0) {
        seletor('aside').classList.add('show');
        seletor('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in carrinho) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == carrinho[i].id;
            });
            subtotal += pizzaItem.price * carrinho[i].qt;

            let cartItem = seletor('.models .cart--item').cloneNode(true);
            //PREENCHENDO OS DADOS
            let pizzaTamanho;
            switch (carrinho[i].size) {
                case 0:
                    pizzaTamanho = 'P'
                    break;
                case 1:
                    pizzaTamanho = 'M'
                    break;
                case 2:
                    pizzaTamanho = 'G'
                    break;
            }
            let pizzaNameTamanho = `${pizzaItem.name} (${pizzaTamanho})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaNameTamanho;
            cartItem.querySelector('.cart--item--qt').innerHTML = carrinho[i].qt;
            //AÇÃO DO BOTÃO + OU - 
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (carrinho[i].qt > 1) {
                    carrinho[i].qt--;
                } else {
                    carrinho.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                carrinho[i].qt++;
                updateCart();
            });
            seletor('.cart').append(cartItem); 
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        //EXIBINDO OS VALORES
        seletor('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        seletor('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        seletor('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        seletor('aside').classList.remove('show');
        seletor('aside').style.left = '100vw';
    }
}

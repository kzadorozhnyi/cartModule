// Code goes here
var cartData = {
   products: [
       {
           id: 1,
           title: 'Some product 1',
           href: 'https://google.com',
           img: 'https://picsum.photos/96/96/?random',
           count: 1,
           price: 500,
       },
       {
           id: 2,
           title: 'Some product 2',
           href: 'https://google.com',
           img: 'https://picsum.photos/96/96/?random',
           count: 2,
           price: 400,
       },
       {
           id: 3,
           title: 'Some product 3',
           href: 'https://google.com',
           img: 'https://picsum.photos/96/96/?random',
           count: 3,
           price: 300,
       },
       {
           id: 4,
           title: 'Some product 4',
           href: 'https://google.com',
           img: 'https://picsum.photos/96/96/?random',
           count: 4,
           price: 200,
       }, {
           id: 5,
           title: 'Some product 5',
           href: 'https://google.com',
           img: 'https://picsum.photos/96/96/?random',
           count: 5,
           price: 100,
       },

   ],
    texts: {
        checkoutTitle: 'Ваша корзина',
        totalSum: 'Сумма заказа',
        quantity: 'Количество',
        cartEmpty: 'Ваша корзина пуста',
        currency: 'грн',
   },
};

$(document).ready(function(){
    cart.initCart({
        "cartData": cartData,
        "incrementButtonClass": "count-inc-btn",
        "decrementButtonClass": "count-dec-btn",
        "cartContainerClassName": "cart-container",
        "cartBodyClassName": "cart-body",
        "cartHeaderClassName": "cart-header",
        "allowClickWhileCountAnimationOn": true
    });

});
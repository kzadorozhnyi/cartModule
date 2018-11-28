;var cart = (function(){
var cartData,
    isCartEmpty = true,
    currencyText = "",
    quantityText = "",
    totalSumText = "",
    emptyCartText = "",
    incClassName,
    decClassName,
    cartContainerClassName,
    cartBodyClassName,
    cartHeaderClassName,
    allowClickWhileCountAnimationOn;

var initCart = function( options ){
    cartData = options.cartData;
    incClassName = options.incrementButtonClass;
    decClassName = options.decrementButtonClass;
    cartContainerClassName = options.cartContainerClassName;
    cartBodyClassName = options.cartBodyClassName;
    cartHeaderClassName = options.cartHeaderClassName;
    allowClickWhileCountAnimationOn = options.allowClickWhileCountAnimationOn;

    currencyText = cartData.texts.currency;
    quantityText = cartData.texts.quantity;
    totalSumText = cartData.texts.totalSum;
    cartHeaderTitleText = cartData.texts.checkoutTitle;
    emptyCartText = cartData.texts.cartEmpty;;

    if ( isCartEmpty() ) {
        insertCartHeader();
        renderEmptyCartContent(emptyCartText);
    }
    else {
        insertCartHeader();
        insertItemsToCart();
        insertFooterToCart();
        addEventsHandlers();
    }
}

var isCartEmpty = function() {
    if ( cartData.products.length ) {
        return false
    }
    else {
        return true;
    }
}

var insertCartHeader = function(){
    var cartHeaderElem = $('<h3 class="cart-header-title">' + cartHeaderTitleText + '</h3>');
    $('.' + cartHeaderClassName).append(cartHeaderElem);
}

var renderEmptyCartContent = function(text){
    var emptyCartTextBlock = $('<div>' + text + '</div>')
    $('.' + cartBodyClassName).append(emptyCartTextBlock);
} 

var createCartItem = function(id, title, href, img, count, price){
    var cartItem = $('<li id="cart-item-' + id + '" class="cart-item" data-product-id="' + id +'" ></li>');
    var cartItemBody = $('<div class="cart-item-body"></div>');
    var cartItemImage = $('<div class="cart-item-image"><img src="' + img + '"/></div>');
    var cartItemTitle = $('<div class="cart-item-title">' + title + '</div>');
    var cartItemCount = $('<div class="cart-item-count"></div>');
    var countInc = $('<div class="' + incClassName + ' btn">+</div>');
    var countDec = $('<div class="' + decClassName + ' btn">-</div>');
    var countInput = $('<div class="count-input">'+
                            '<div class="count-slide">'+
                                '<div class="top-value">' + (count - 1) +'</div>'+
                                '<div class="value">' + count + '</div>'+
                                '<div class="bottom-value">' + (count + 1) + '</div>'+
                            '</div>'+
                        '</div>');

    var cartItemPrice = $('<div class="cart-item-price">x ' + price +
                            '<span class="currency"> ' + currencyText + '</span>'+
                        '</div>');

    var cartItemPriceTotal = $('<div class="cart-item-price-total">'+
                                    '<span class="value">' + ( parseInt(price) * parseInt(count) ) + '</span>'+
                                    '<span class="currency"> ' + currencyText + '</span>'+
                                '</div>');

    var cartRemoveButton = $('<button class="remove">+</button>');

    $(cartItemCount)
        .append(countInc)
        .append(countInput)
        .append(countDec);
    $(cartItemBody)
        .append(cartItemTitle)
        .append(cartItemCount)
        .append(cartItemPrice)
        .append(cartItemPriceTotal)
        .append(cartRemoveButton);
    $(cartItem)
        .append(cartItemBody)
        .append(cartItemImage);
    
    return cartItem;
}

var createCartFooter = function(summaryCount, summaryPrice){
    var cartFooter = $('<div class="cart-footer"></div>');
    var cartFooterCount = $('<div class="cart-footer-count"><span class="text"> ' + quantityText + ': </span><span class="value"> ' + summaryCount + '</div>');
    var cartFooterPrice = $('<div class="cart-footer-price"><span class="text"> ' + totalSumText + ': </span><span class="value"> ' + summaryPrice + '<span class="currency"> ' + currencyText + '</span></div>');
    
    cartFooter.append(cartFooterCount);
    cartFooter.append(cartFooterPrice);

    return cartFooter;
}

var insertFooterToCart = function(){
    var summaryCount = calcCartTotalCount();
    var summaryPrice = calcCartTotalPrice();
    var cartFooter = createCartFooter( summaryCount, summaryPrice );

    $('.' + cartBodyClassName).append(cartFooter);
}

var insertItemsToCart = function(){
    var cartItems = cartData.products.map( function( item ){
        return createCartItem(item.id, item.title, item.href, item.img, item.count, item.price )
    });

    var cartList = $('<ul class="cart-list-items"></ul>');

    cartList.append(cartItems);
    $('.' + cartBodyClassName).append(cartList);
}

var slideCounterInc = function(id){
    $("#cart-item-" + id).find('.count-input').addClass('animated slide-inc');
    disableCountClickWhileAnimated(id);   
}

var slideCounterDec = function(id){
    $("#cart-item-" + id).find('.count-input').addClass('animated slide-dec');
    disableCountClickWhileAnimated(id); 
}

var removeSlideCountAnimation = function(id){
    $("#cart-item-" + id).find('.count-input').removeClass('animated slide-inc slide-dec');
    enableCountClickOnAnimationEnd(id);
}

var disableCountClickWhileAnimated = function(id){
    if ( !allowClickWhileCountAnimationOn ) {
        $("#cart-item-" + id).find('.cart-item-count').addClass('click-disabled');
    }
}

var enableCountClickOnAnimationEnd = function(id){
    if ( !allowClickWhileCountAnimationOn ) {
        $("#cart-item-" + id).find('.cart-item-count').removeClass('click-disabled');
    }
}

var increaseItemQty = function(id){
    return cartData.products.forEach( function(product){
        if ( parseInt(product.id) === parseInt(id) ) {
            product.count++;
            slideCounterInc(id);

            updateCartItem(id);
        }
    });
}

var updateItemFakeValues = function(id, value){
    $("#cart-item-" + id).find('.count-input .top-value').text( parseInt(value) - 1 );
    $("#cart-item-" + id).find('.count-input .bottom-value').text( parseInt(value) + 1 );
}

var decreaseItemQty = function(id, btn){
    return cartData.products.forEach( function(product){
        if ( parseInt(product.id) === parseInt(id) ) {
            if ( product.count > 1 ) {
                product.count--;
                slideCounterDec(id);

                updateCartItem(id);
            }
        }
    });
}

var updateCartItem = function(id){
    var cartItem = $('#cart-item-' + id);
    var newCountValue, itemPrice;

    cartData.products.forEach( function( product ){
        if ( parseInt(product.id) === parseInt(id) ) {
            newCountValue = product.count;
            itemPrice = product.price;
        }
    });

    setTimeout( function(){
        removeSlideCountAnimation(id);
        updateItemFakeValues(id, newCountValue);
    }, 500);

    setTimeout( function(){
        cartItem.find('.count-input .value').text(newCountValue);
        cartItem.find('.cart-item-price-total .value').text( parseInt(itemPrice) * parseInt(newCountValue) );

        updateCartTotalCount();
        updateCartTotalPrice();
    }, 250);
}

var addEventsHandlers = function(){
    $(document).on('click', '.' + incClassName, function(){
        var itemId = $(this).closest('.cart-item').data('product-id');
        increaseItemQty(itemId);
    });

    $(document).on('click', '.' + decClassName, function(e){
        var btn = e.target;
        var itemId = $(this).closest('.cart-item').data('product-id');
        decreaseItemQty(itemId, btn);
    });

    $(document).on('click', '.remove', function(e){
        var itemId = $(this).closest('.cart-item').data('product-id');
        animateBeforeRemoveItem(itemId);
    });
}

var animateBeforeRemoveItem = function(id){
    $('#cart-item-' + id).addClass('removed');
    setTimeout( function(){
        removeItemFromCart(id);
        }, 500
    );
}

var calcCartTotalCount = function(){
    return cartData.products.reduce( function( acc, product ){
        return product.count + acc;
    }, 0);
}

var calcCartTotalPrice = function(){
    return cartData.products.reduce( function( acc, product ){
        return acc + ( product.price * product.count );
    }, 0);
}

var updateCartTotalCount = function(){
    var updatedTotalCount = calcCartTotalCount();
    $('.' + cartBodyClassName).find('.cart-footer-count .value').text(updatedTotalCount);
}

var updateCartTotalPrice = function(){
    var updatedTotalPrice = calcCartTotalPrice();
    $('.' + cartBodyClassName).find('.cart-footer-price .value').text(updatedTotalPrice);
}

var removeItemFromCart = function(id){
    return cartData.products.forEach( function(product, index){
        if ( parseInt(product.id) === parseInt(id) ) {
            cartData.products.splice(index, 1);
            if ( isCartEmpty() ) {
                clearCart();
                renderEmptyCartContent(emptyCartText);
            }
            else {
                clearCart();
                insertItemsToCart();
                insertFooterToCart();
            }
        }
    });
}

var clearCart = function(){
    $('.' + cartBodyClassName).empty();
}

return {
    initCart: initCart,
    increaseItemQty: increaseItemQty,
    decreaseItemQty: decreaseItemQty,
    removeItemFromCart: animateBeforeRemoveItem
}

})();
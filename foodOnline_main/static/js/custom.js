let autocomplete;

function initAutoComplete(){
autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('id_address'),
    {
        types: ['geocode', 'establishment'],
        //default in this app is "IN" - add your country code
        componentRestrictions: {'country': ['in']},
    })
// function to specify what should happen when the prediction is clicked
autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged (){
    var place = autocomplete.getPlace();

    // User did not select the prediction. Reset the input field or alert()
    if (!place.geometry){
        document.getElementById('id_address').placeholder = "Start typing...";
    }
    else{
        // console.log('place name=>', place.name)
    }
    // get the address components and assign them to the fields
    // console.log(place)
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('id_address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        // console.log('results=>', results)
        // console.log('status=>', status)
        if(status == google.maps.GeocoderStatus.OK){
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
        }
        // console.log('latitude=>', latitude)
        // console.log('longitude=>', longitude)
        $('#id_latitude').val(latitude);
        $('#id_longitude').val(longitude);
        $('#id_address').val(address);
    })

    // Loop through the address components and assign them to the fields
    for (var i = 0; i < place.address_components.length; i++) {
        for (var j = 0; j < place.address_components[i].types.length; j++) {
            // get country
            if(place.address_components[i].types[j] == 'country') {
                $('#id_country').val(place.address_components[i].long_name);
            }

            // get state
            if(place.address_components[i].types[j] == 'administrative_area_level_1') {
                $('#id_state').val(place.address_components[i].long_name);
            }

            // get city
            if(place.address_components[i].types[j] == 'locality') {
                $('#id_city').val(place.address_components[i].long_name);
            }

            // get pin_code
            if(place.address_components[i].types[j] == 'postal_code') {
                $('#id_pin_code').val(place.address_components[i].long_name);
            }else{
                $('#id_pin_code').val("");
            }
        }
    }

}


$(document).ready(function(){
    // add to cart
    $('.add_to_cart').on('click', function(e){
        e.preventDefault();
        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        data = {'food_id':food_id,};
        
        $.ajax({
            type: 'GET',
            url: url,
            data: data,
            success: function (response){
                if(response.status == 'login_required'){
                    swal.fire(response.message, "", "info").then(() => {
                        window.location = '/login/';
                    });
                }else if(response.status == 'Failed') {
                    swal.fire(response.message, "", "error");
                } else {
                    $('#cart-counter-navbar').html(response.cart_counter.cart_count);                  
                    $('#qty-'+food_id).html(response.qty);

                    // Subtotal, tax and grand total
                    applyCartAmounts(
                        response.cart_amount.subtotal, 
                        response.cart_amount.tax, 
                        response.cart_amount.grand_total
                    );
                }                  
            }
        })
    })

    // place the cart item quantity on load
    $('.item-qty').each(function(){
        var the_id = $(this).attr('id');
        var qty = $(this).attr('data-qty');
        $('#'+the_id).html(qty);
    });

    // decrease cart
    $('.decrease-cart').on('click', function(e){
        e.preventDefault();
        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        cart_id = $(this).attr('id');
        
        $.ajax({
            type: 'GET',
            url: url,
            success: function (response){
                if(response.status == 'login_required'){
                    swal.fire(response.message, "", "info").then(() => {
                        window.location = '/login/';
                    });
                }else if(response.status == 'Failed') {
                    swal.fire(response.message, "", "error");
                } else {
                    $('#cart-counter-navbar').html(response.cart_counter.cart_count);                  
                    $('#qty-'+food_id).html(response.qty);

                    // Subtotal, tax and grand total
                    applyCartAmounts(
                        response.cart_amount.subtotal, 
                        response.cart_amount.tax, 
                        response.cart_amount.grand_total
                    );

                    if(window.location.pathname == '/cart/'){
                        removeCartItem(response.qty, cart_id);
                        checkEmptyCart();
                    }
                }  
            }
        })
    })

    // Delete cart item
    $('.delete_cart').on('click', function(e){
        e.preventDefault();
        cart_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        
        $.ajax({
            type: 'GET',
            url: url,
            success: function (response){
                if(response.status == 'Failed') {
                    swal.fire(response.message, "", "error");
                } else {
                    $('#cart-counter-navbar').html(response.cart_counter.cart_count);                  
                    swal.fire(response.status, response.message, "success");

                    // Subtotal, tax and grand total
                    applyCartAmounts(
                        response.cart_amount.subtotal, 
                        response.cart_amount.tax, 
                        response.cart_amount.grand_total
                    );
                    
                    removeCartItem(0, cart_id);
                    checkEmptyCart();
                }  
            }
        })
    })

    // delete the cart element if qty is 0
    function removeCartItem(cartItemQty, cart_id){
        if (cartItemQty <= 0){
            // remove the cart item element
            document.getElementById('cart-item-'+cart_id).remove();
        }
    }

    function checkEmptyCart(){
        var cart_counter_navbar = document.getElementById('cart-counter-navbar').innerHTML;
        if(cart_counter_navbar == 0){
            document.getElementById('empty-cart').style.display = 'block';
        }
    }


    // Apply cart amounts
    function applyCartAmounts(subtotal, tax, grand_total){
        if(window.location.pathname == '/cart/'){
            $('#subtotal').html(subtotal);
            $('#tax').html(tax);
            $('#total').html(grand_total);
        }
    }

});
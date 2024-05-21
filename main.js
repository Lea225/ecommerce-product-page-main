document.addEventListener('DOMContentLoaded', function() {
    const cart = document.querySelector('.cart');
    const overlay = document.querySelector('.overlay');
    const lightbox = document.querySelector('.lightbox');
    const nextButton = document.querySelector('.icon-next');
    const prevButton = document.querySelector('.icon-previous');
    const closeButton = document.querySelector('.close-button');
    const addToCartButton = document.querySelector('.addToCart');
    const counterZero = document.querySelector('.counter-zero');
    const cartContainer = document.querySelector('.cart-container');
    const cartButton = document.querySelector('.header-image-cart');
    const mainProductImage = document.querySelector('.main-img img');
    const thumbnailImages = document.querySelectorAll('.thumbnails img');
    const cartNotification = document.querySelector('.cart-notification');
    const lightboxMainImage = document.querySelector('.lightbox-main-img'); 
    const lightboxNextButton = document.querySelector('.lightbox-icon-next');
    const lightboxPrevButton = document.querySelector('.lightbox-icon-previous'); 
    const lightboxThumbnailImages = document.querySelectorAll('.lightbox-thumbnails img');
    
    let choiceCount = 0;
    let productChoiceDiv;

    function checkEmptyCart() {
        const emptyMessage = cartContainer.querySelector('.empty-message');
        if (choiceCount === 0) {
            cart.style.display = 'none';
            emptyMessage.style.display = 'block';
        } else {
            cart.style.display = 'block';
            emptyMessage.style.display = 'none';
        }
    }

    function toggleCart() {
        cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
    }

    cartButton.addEventListener('click', toggleCart);

    mainProductImage.addEventListener('click', function() {
        if (!isMobileDevice()) {
            overlay.style.display = 'block';
            lightbox.style.display = 'block';
        }
    });

    closeButton.addEventListener('click', function() {
        overlay.style.display = 'none';
        lightbox.style.display = 'none';
    });

    function isMobileDevice() {
        return window.innerWidth <= 850;
    }

    thumbnailImages.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            const thumbnailSrc = thumbnail.src;
            const mainImageSrc = thumbnailSrc.replace('-thumbnail', '');
            mainProductImage.src = mainImageSrc;
        });
    });

    function isChoiceAlreadyInCart(thumbnailSrc) {
        const productChoices = cartContainer.querySelectorAll('.product-choice-img');
        for (let productChoice of productChoices) {
            if (productChoice.src === thumbnailSrc) {
                return true;
            }
        }
        return false;
    }

    function attachDeleteEvent(deleteIcon) {
        deleteIcon.addEventListener('click', function() {
            const productChoiceDiv = deleteIcon.closest('.product-choice');
            productChoiceDiv.remove();
            choiceCount--;
            counterZero.textContent = choiceCount;
            checkEmptyCart();
            updateCartNotification(choiceCount);
        });
    }

    function addToCart(thumbnailSrc, thumbnailAlt) {
        choiceCount++;
        counterZero.textContent = choiceCount;

        productChoiceDiv = document.createElement('div');
        productChoiceDiv.classList.add('product-choice');
        productChoiceDiv.innerHTML = `
            <img class="product-choice-img" src="${thumbnailSrc.replace('-thumbnail', '')}" alt="${thumbnailAlt}">
            <div>
                <p>Fall limited Edition Sneakers</p>
                <p>$125.00 x 3 <span>$375.00</span></p>
            </div>
            <svg class="delete-icon" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1-1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill-rule="nonzero" xlink:href="#a"/></svg>
        `;

        const deleteIcon = productChoiceDiv.querySelector('.delete-icon');
        attachDeleteEvent(deleteIcon);

        let checkoutButton = cartContainer.querySelector('button');
        if (!checkoutButton) {
            checkoutButton = document.createElement('button');
            checkoutButton.textContent = 'Checkout';
            cartContainer.appendChild(checkoutButton);
        }

        cartContainer.insertBefore(productChoiceDiv, checkoutButton);
        checkEmptyCart();
        updateCartNotification(choiceCount);
    }

    addToCartButton.addEventListener('click', function() {
        const thumbnailSrc = mainProductImage.src;
        const thumbnailAlt = mainProductImage.alt;
        
        if (!isChoiceAlreadyInCart(thumbnailSrc)) {
            addToCart(thumbnailSrc, thumbnailAlt);
        }
    });

    checkEmptyCart();
    updateCartNotification(choiceCount);

    const plusIcon = document.querySelector('.plus-icon');
    const minusIcon = document.querySelector('.minus-icon');

    plusIcon.addEventListener('click', function() {
        const thumbnailImages = document.querySelectorAll('.thumbnails img');
        const mainImageSources = Array.from(thumbnailImages).map(thumbnail => thumbnail.src.replace('-thumbnail', ''));
        const currentImageIndex = mainImageSources.indexOf(mainProductImage.src);
        const nextImageIndex = (currentImageIndex + 1) % mainImageSources.length;
        mainProductImage.src = mainImageSources[nextImageIndex];
        
        const thumbnailSrc = mainProductImage.src;
        const thumbnailAlt = mainProductImage.alt;
        
        if (!isChoiceAlreadyInCart(thumbnailSrc)) {
            addToCart(thumbnailSrc, thumbnailAlt);
        }
    });

    minusIcon.addEventListener('click', function() {
        const productChoices = cartContainer.querySelectorAll('.product-choice');
        if (productChoices.length > 0) {
            // Retirer le dernier élément ajouté au panier
            const lastProductChoice = productChoices[productChoices.length - 1];
            lastProductChoice.remove();
            choiceCount--;
            counterZero.textContent = choiceCount;
            checkEmptyCart();
            updateCartNotification(choiceCount);
        }
    });


    function updateCartNotification(count) {
        cartNotification.textContent = count;
    }

    const mainImageSources = Array.from(thumbnailImages).map(thumbnail => thumbnail.src.replace('-thumbnail', ''));

    function showNextImage() {
        const currentImageIndex = mainImageSources.indexOf(mainProductImage.src);
        const nextImageIndex = (currentImageIndex + 1) % mainImageSources.length;
        mainProductImage.src = mainImageSources[nextImageIndex];
    }

    function showPreviousImage() {
        const currentImageIndex = mainImageSources.indexOf(mainProductImage.src);
        const previousImageIndex = (currentImageIndex - 1 + mainImageSources.length) % mainImageSources.length;
        mainProductImage.src = mainImageSources[previousImageIndex];
    }

    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPreviousImage);

    function showNextLightboxImage() {
        const currentImageIndex = mainImageSources.indexOf(lightboxMainImage.src);
        const nextImageIndex = (currentImageIndex + 1) % mainImageSources.length;
        lightboxMainImage.src = mainImageSources[nextImageIndex];
    }

    function showPreviousLightboxImage() {
        const currentImageIndex = mainImageSources.indexOf(lightboxMainImage.src);
        const previousImageIndex = (currentImageIndex - 1 + mainImageSources.length) % mainImageSources.length;
        lightboxMainImage.src = mainImageSources[previousImageIndex];
    }

    lightboxNextButton.addEventListener('click', showNextLightboxImage);
    lightboxPrevButton.addEventListener('click', showPreviousLightboxImage);

    const iconMenu = document.getElementById('icon-menu');
    const navigation = document.querySelector('.navigation');
    const iconCloseMenu = document.getElementById('icon-close');

    iconMenu.addEventListener('click', function() {
        navigation.style.display = 'block';
        overlay.style.display = 'block';
    });

    iconCloseMenu.addEventListener('click', function() {
        navigation.style.display = 'none';
        overlay.style.display = 'none';
    });
});

"use strict";


const getElement = (selector) => document.querySelector(selector);
let total = 0.0;
const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

let menuData = [];

const createElement = (tagName, text) => {

    const element = document.createElement(tagName);
    
    if (text) {
        const textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }
    return element;
};

const loadMenuData = () =>{
    const domain = "data";
    const url = `${domain}/menu.json`;

    fetch(url)
        .then(response => response.json())
        .then(json => {
            menuData = json; 
        })
        .catch(error => {
            console.log('errors: ' + error.message);
        });
};

const getImages = ()=>{
    const images = document.querySelectorAll("ul img");
    

    images.forEach(image =>{
        let newURL = image.getAttribute("id");
        let oldURL = image.getAttribute("src");
        //preload rollover image
        let rolloverImage = new Image();
        rolloverImage.src = newURL;
   
        image.addEventListener("mouseenter",()=>{
            //need to hold onto the original image, aka, oldURL
            image.src = newURL;
        }); 

        image.addEventListener("mouseout", ()=>{
           //oldURL is set in mouseenter
            image.src = oldURL;
        });

        image.addEventListener("click", (event) =>{
            //this makes it so you do not need to click twice to see the first item in the select.
            event.preventDefault();
            placeOrder(image.id);
        });
    })

};


const placeOrder = (imageId) =>{
 //called in getImages, on the click event for each image   
    
    const order = getElement("#order");    
    
            for(let menuItem of menuData){

                if(menuItem.image === imageId){
                    const description = `${menuItem.item} - ${menuItem.price}`
                    const option = createElement("option", description);
                    option.value= menuItem.image;
                    order.appendChild(option);
                    total = parseFloat(total) + parseFloat(menuItem.price);
                    console.log(`total: ${total}`);
                    getElement("#total").textContent = "";
                    getElement("#total").textContent = USD.format(total);
                }
            }
};

const showOrder = (event)=>{
    const orderText = getElement("#order").textContent;
    if (orderText == "") {
        event.preventDefault();
        getElement("#message").textContent = "Please choose at least one user";
    }
    else{
        sessionStorage.total = total;
        getElement("#order_form").submit();
    }
}
const clearOrder = (event)=>{
    event.preventDefault();
    total = 0;
    getElement("#message").textContent = "";
    getElement("#order").textContent = "";
    getElement("#total").textContent = "";
}; 


document.addEventListener("DOMContentLoaded", async () => {
    
    getImages();
    loadMenuData();

    // getElement("#place_order").addEventListener("click", async (event)=>{
        
    //     await placeOrder(event.currentTarget.value);
    // });
    
    getElement("#place_order").addEventListener("click", showOrder);    
    getElement("#clear_order").addEventListener("click", clearOrder);
   
});
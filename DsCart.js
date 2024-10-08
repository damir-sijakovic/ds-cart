/*
Damir Šijaković (c) 2024, BSD Licence
*/

function initDsCart() {

	const _style = `
			.ds-cart {
				font-family: "Open Sans";
				position: fixed;
				right: 0;
				top: 0;
				bottom:0;
				background:white;
				width:300px;
				overflow:auto;
				box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
			}

			.ds-cart-header{
				background:#778899;
				color:white;
				height:60px;
				position: fixed;
				right: 0;
				width: 300px;
			}

			.ds-cart-header-relative{
				height:60px;
				width: 300px;
				position: relative;
				display: flex;
				align-items: center;
			}

			.ds-cart-footer{
				background:#778899;
				color:white;
				height:60px;
				position: fixed;
				right: 0;
				bottom:0;
				width: 300px;
			}

			.ds-cart-footer-button{
				border: 1px solid white;
				font-size: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 5px;
				padding: 4px 0;
			}

			.ds-cart-items{
				background:black;
				overflow:auto;
				margin: 60px 0;
			}

			.ds-cart-item{
			  background: #f0f0f0;
			  height: 100px;
			  border-bottom: 1px solid #cacaca;
			  display: flex;
			  align-items: center;
			  justify-content: flex-start;
			  padding: 0 10px;
			  border-top: 1px solid #fffbfb;
			}


			.ds-cart-item-left{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.ds-cart-item-left img{
				width: 70px;
			}

			.ds-cart-item-center{
				margin-left: 10px;
				width:177px;
			}

			.ds-cart-item-center-price{
				margin-bottom:10px;
				font-size: 12px;
				font-weight: bold;
			}

			.ds-cart-item-right{	
			  cursor:pointer;
			}

			.ds-cart-item-right span{
			  height: 20px;
			  background: lightgray;
			  width: 20px;
			  display: flex;
			  justify-content: center;
			  align-items: center;
			  border-radius:20px;
			}

			.ds-cart-header-title{
				padding-left: 10px;
			}

			.ds-cart-header-close{
				position: absolute;
				right: 0px;
				top: 0px;
				background: red;
				width: 30px;
				height: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor:pointer;
			}

			.ds-quantity{
				 width: 70px;
				 display: flex;  
				 height: 22px;
			}
			  

			.ds-quantity div[ds-data="-"] {
			  /* background: red; */
			}

			.ds-quantity input[type=number] {
			  -moz-appearance: textfield;
			  width: 20px;
			  height: 18px;
			  text-align: center;
			  border: 1px solid lightgray;
			  margin: 0px 2px;
			}

			.ds-quantity input::-webkit-outer-spin-button,
			.ds-quantity input::-webkit-inner-spin-button {
			 -webkit-appearance: none;
			 -moz-appearance: none;
			 margin: 0; 
			 }

			.ds-quantity-buttons{
				display: flex;
				align-items:center;
				justify-content:center;
				width: 25px;
				background: lightgray;
				cursor:pointer;
				user-select: none;	
			}
			  
			.ds-cart-animate-opacity{animation:opac 0.8s}@keyframes opac{from{opacity:0} to{opacity:1}}
		
		`;

	//localStorage.removeItem("dsCartData");

	//private

	function _storeObjectInLocalStorage(key, object) {
		const json = JSON.stringify(object);
		localStorage.setItem(key, json);
	}

	function _getObjectFromLocalStorage(key) {
		const json = localStorage.getItem(key);
		const object = JSON.parse(json);
		return object;
	}

	function _mergeCartItemObjects(itemOne, itemTwo) {
		itemOne.quantity = parseFloat(itemOne.quantity) + parseFloat(itemTwo.quantity);
		return itemOne;
	}

	function _checkForLocalStorage() {
		let sessionData = localStorage.getItem("dsCartData");
		if (sessionData) {
			_rebuildCartItems();
			_createCartItemEvents();
			_calcAllAmount();
		} else {
			localStorage.setItem('cartVisible', "0");
		}
	}

	function _deleteCartItem(sku) {
		let id = '@@' + sku;
		let data = _getObjectFromLocalStorage("dsCartData");
		delete data[id];
		_storeObjectInLocalStorage("dsCartData", data);
		_rebuildCartItems();
		_createCartItemEvents();
		_calcAllAmount();
	}

	function _deleteAllCartItems() {
		let t = {};
		_storeObjectInLocalStorage("dsCartData", t);
		_rebuildCartItems();
		_createCartItemEvents();
		_calcAllAmount();
	}

	function _hideMainElement() {
		let mainElement = document.querySelector('.ds-cart');
		mainElement.style.display = 'none';
		localStorage.setItem('cartVisible', "0");
	}

	function _showMainElement() {
		let mainElement = document.querySelector('.ds-cart');
		mainElement.style.display = 'block';
		localStorage.setItem('cartVisible', "1");
	}


	function _calcAllAmount() {
		let allAmount = 0;
		let t = _getObjectFromLocalStorage("dsCartData");
		for (let key in t) {
			let value = t[key];
			let price = value.price;
			let quantity = value.quantity;
			allAmount += price * quantity;
		}

		let allAmountElement = document.querySelector('.ds-cart-header-title span');
		allAmountElement.innerHTML = allAmount.toFixed(2);
		allAmountElement.innerHTML += ' €';


	}

	function _changeQuantity(sku, step) {
		let id = '@@' + sku;
		let data = _getObjectFromLocalStorage("dsCartData");
		let quantity = parseInt(data[id].quantity);

		if (step === '+') {
			data[id].quantity = quantity + 1;
		} else {
			if (quantity === 1) return false;
			data[id].quantity = quantity - 1;
		}

		_storeObjectInLocalStorage("dsCartData", data);
		_rebuildCartItems();
		_createCartItemEvents();
		_calcAllAmount();
	}

	function _createSingleCartItem(argObj) {
		let newPrice = parseFloat(argObj.price) * parseFloat(argObj.quantity);
		newPrice = newPrice.toFixed(2);
		return `<div class="ds-cart-item animate-opacity" sku="${argObj.sku}" >
	<div class="ds-cart-item-left"> 
		<img src="${argObj.image}"> 
	</div>
	<div class="ds-cart-item-center">
		<div class="ds-cart-item-center-title">${argObj.title}</div>
		<div sku="${argObj.sku}" singlePrice="${argObj.price}" price="${newPrice}"class="ds-cart-item-center-price">${newPrice} €</div>
		
		<div class="ds-quantity">
			<div sku="${argObj.sku}" class="ds-quantity-buttons" step="-">-</div>
			<input  class="ds-quantity-input-value" sku="${argObj.sku}" type="number" step="1" min="1" max="1000" value="${argObj.quantity}" size="4" pattern="" inputmode="">
			<div sku="${argObj.sku}" class="ds-quantity-buttons" step="+">+</div>
		</div>
		
	</div>
	<div class="ds-cart-item-right">
		<span class="ds-cart-item-close-button">×</span>
	</div>
	</div>`;
	}

	function _createCartItemEvents() {
		//close buttons events
		const closeButtons = document.querySelectorAll('.ds-cart-item-close-button');
		closeButtons.forEach((button) => {
			button.onclick = () => {
				let sku = button.parentElement.parentElement.getAttribute('sku');
				_deleteCartItem(sku);
			};
		});

		//plus minus		
		const plusMinusButtons = document.querySelectorAll('.ds-quantity-buttons');
		plusMinusButtons.forEach((button) => {
			button.onclick = () => {
				let sku = button.getAttribute('sku');
				let step = button.getAttribute('step');
				_changeQuantity(sku, step);
			};
		});
	}

	function _createMainEvents() {
		const closeButton = document.querySelector('.ds-cart-header-close');
		closeButton.onclick = () => {
			_hideMainElement();
		};
	}

	function _rebuildCartItems() {
		if (localStorage.getItem('cartVisible') === "0") {
			_hideMainElement();
		}

		const t = _getObjectFromLocalStorage("dsCartData");
		const sessionKeys = Object.keys(t);

		const targetElement = document.querySelector('.ds-cart-items');
		targetElement.innerHTML = "";
		for (let i = 0; i < sessionKeys.length; i++) {
			const currentKeyObj = t[sessionKeys[i]];
			targetElement.innerHTML += _createSingleCartItem(currentKeyObj);
		}

	}

	function _buildUi() {
		//inject css style		
		const style = document.createElement('style');
		style.innerHTML = _style;
		document.head.appendChild(style);
		
		//ui
		const cartDiv = document.createElement("div");
		cartDiv.classList.add("ds-cart");
		cartDiv.classList.add("ds-cart-animate-opacity");

		const headerDiv = document.createElement("div");
		headerDiv.classList.add("ds-cart-header");

		const headerRelativeDiv = document.createElement("div");
		headerRelativeDiv.classList.add("ds-cart-header-relative");

		const headerTitleDiv = document.createElement("div");
		headerTitleDiv.classList.add("ds-cart-header-title");
		headerTitleDiv.innerHTML = '<b>Price:</b> <span></span>';

		const headerCloseDiv = document.createElement("div");
		headerCloseDiv.classList.add("ds-cart-header-close");
		headerCloseDiv.onclick = () => {
			_hideMainElement();
		};
		headerCloseDiv.textContent = "×";

		headerRelativeDiv.appendChild(headerTitleDiv);
		headerRelativeDiv.appendChild(headerCloseDiv);
		headerDiv.appendChild(headerRelativeDiv);
		cartDiv.appendChild(headerDiv);

		const footerDiv = document.createElement("div");
		footerDiv.classList.add("ds-cart-footer");

		const footerButtonCartDiv = document.createElement("div");
		footerButtonCartDiv.classList.add("ds-cart-footer-button");
		footerButtonCartDiv.textContent = "Cart Page";

		const footerButtonCheckoutDiv = document.createElement("div");
		footerButtonCheckoutDiv.classList.add("ds-cart-footer-button");
		footerButtonCheckoutDiv.textContent = "Checkout Page";

		footerDiv.appendChild(footerButtonCartDiv);
		footerDiv.appendChild(footerButtonCheckoutDiv);
		cartDiv.appendChild(footerDiv);

		const itemsDiv = document.createElement("div");
		itemsDiv.classList.add("ds-cart-items");
		cartDiv.appendChild(itemsDiv);

		//return cartDiv.outerHTML;	 
		document.body.insertAdjacentHTML('afterbegin', cartDiv.outerHTML);
	}

	//build UI

	_buildUi();
	_createMainEvents();
	_checkForLocalStorage();
	window.dsCart = {};

	window.dsCart.addItem = function(argObj) {

		if (!argObj || typeof argObj !== 'object') {
			console.log('argObj is not set or is not an object');
			return false;
		}

		const requiredProps = ['image', 'title', 'price', 'quantity', 'sku'];
		let found = false;

		for (const prop of requiredProps) {
			if (argObj.hasOwnProperty(prop)) {
				found = true;
			} else {
				console.log(`Missing property: ${prop}`);
			}
		}

		if (!found) {
			console.log('No properties found');
			return false;
		}

		if (localStorage.getItem("dsCartData") === null) {
			//localStorage data not found
			let t = {};
			t['@@' + argObj.sku] = argObj;
			_storeObjectInLocalStorage("dsCartData", t);
		} else {
			//localStorage data exist 
			let t = _getObjectFromLocalStorage("dsCartData");
			let keyName = '@@' + argObj.sku;

			if (t.hasOwnProperty(keyName)) {
				let existingObj = t[keyName];
				let mergedObj = _mergeCartItemObjects(argObj, existingObj);
				t[keyName] = mergedObj;
				_storeObjectInLocalStorage("dsCartData", t);
			} else {
				t[keyName] = argObj;
				_storeObjectInLocalStorage("dsCartData", t);
			}


		}

		_rebuildCartItems();
		_createCartItemEvents();
		_calcAllAmount();
	};

	window.dsCart.removeItem = function(sku) {
		_deleteCartItem(sku);
	}

	window.dsCart.deleteAllItems = function() {
		_deleteAllCartItems();
	}


	window.dsCart.show = function() {
		_showMainElement();
	}

	window.dsCart.hide = function() {
		_hideMainElement();
	}

	window.dsCart.test = function() {
		let t = _getObjectFromLocalStorage("dsCartData");
		console.log('test method', t);
	}

	window.dsCart.getData = function(){
		let allAmountElement = document.querySelector('.ds-cart-header-title span');
		
		let t = {};
		t.data = _getObjectFromLocalStorage("dsCartData");
		t.total = allAmountElement.innerHTML;
		return t;
	}


};

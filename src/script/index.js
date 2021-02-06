class Network {
    static async get(url) {
        const json = await fetch(url).then(res => res.json());
        return json;
    }
}

class ProductModel {

    async init() {
        this.products = await this.getProducts();
        this.optionProducts = [].concat(...await Promise.all(this.products.map(it => this.getProduct(it.id))));
    }

    async getProducts() {
        return await Network.get('');
    }

    async getProduct(id) {
        return await Network.get(``);
    }

    async getPrices(ids) {
        return await Network.get(``);
    }
}

class Renderer {
    constructor(model) {
        this.model = model;
        this.items = document.getElementById('items');
        this.optionItems = document.getElementById('option-items');
        this.selectedItems = {};
    }

    handleItemOptionChange = (e) => {
        const optionValue = JSON.parse(e.target.value);
        const optionName = this.model.optionProducts.find(it => it.id === optionValue.id).optionName;
        if (this.selectedItems[optionValue.id]) {
            const selectedStock = this.selectedItems[optionValue.id];
            if (selectedStock.currentStock === selectedStock.maxStock) {
                return;
            } else {
                selectedStock.currentStock = selectedStock.currentStock + 1;
            }
        } else {
            this.selectedItems[optionValue.id] = {
                parentName: optionValue.parentName,
                optionName: optionName,
                optionPrice: optionValue.price.optionPrice,
                maxStock: optionValue.price.stock,
                currentStock: 1
            };
        }

        this.renderSelectedItems();
    }

    handleItemChange = async (e) => {
        const id = e.target.value;
        const text = this.model.products.find(it => it.id === id).optionName;
        const options = this.model.optionProducts.filter(o => o.parentOptionId === id)
        const optionsIds = options.map(o => o.id).join(',');
        const prices = await this.model.getPrices(optionsIds);

        if (options.length > 0) {
            options.forEach(o => {
                const option = document.createElement('option');
                option.text = `${o.optionName} (+${prices[o.id].optionPrice})`;
                option.value = JSON.stringify({
                    id: o.id,
                    parentName: text,
                    price: prices[o.id]
                });
                this.optionItems.appendChild(option);
            });
            this.optionItems.style.visibility = "visible";
        } else {
            this.optionItems.style.visibility = "hidden";
        }

        this.optionItems.addEventListener('change', this.handleItemOptionChange);
    }

    renderSelectedItems() {
        const selectedArea = document.getElementById('selected-options');
        let total = 0;
        let alertText = "";
        selectedArea.innerHTML = "";
        Object.keys(this.selectedItems).forEach(it => {
            const item = document.createElement('div');
            const value = this.selectedItems[it];
            const price = value.optionPrice * value.currentStock;
            item.innerHTML = `${value.parentName} ${value.optionName} ${value.optionPrice}, ${price}원`;
            alertText += `${value.parentName} ${value.optionName} ${value.optionPrice}, ${price}원\n`
            total += price;
            selectedArea.appendChild(item);
        })
        const item = document.createElement('div');
        item.innerHTML = `총 ${total}원`;
        alertText+=`총 ${total}원`;
        selectedArea.appendChild(item);

        document.getElementByid('order-button').onClick(() => alert(alertText));
    }

    async renderProducts() {
        const selector = this.items;

        this.model.products.forEach(it => {
            const item = document.createElement('option');
            item.text = it.optionName;
            item.value = it.id;
            selector.appendChild(item);
        })

        selector.addEventListener('change', this.handleItemChange);
    }
}

window.onload = async _ => {
    document.getElementById('progressText').style.visibility = 'visible';
    document.getElementById('items').style.visibility = 'hidden';
    const model = new ProductModel();
    await model.init();
    document.getElementById('progressText').style.visibility = 'hidden';
    document.getElementById('items').style.visibility = 'visible';
    const renderer = new Renderer(model);
    renderer.renderProducts();
}

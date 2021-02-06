const Item = (function () {

    let items = [];

    const fn = {
        init() {
            items = [];
        },
        addItem(index) {
            items.push(
                <div>
                    item add ${index}
                </div>
            );
            this.renderDom();
        },
        removeItem(index) {
            if (items[index]) {
                items.splice(index, 1);
            }
            this.renderDom();
        },
        renderDom() {
            const root = document.getElementById('todo-container');
            root.childNodes.forEach(it => root.removeChild(it));
            items.forEach(it => {
                root.appendChild(it);
            })
        }
    }

    return {
        init: fn.init,
        addItem: fn.addItem,
        removeItem: fn.removeItem
    }
})();

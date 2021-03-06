class View {
    constructor(template) {
        this.template = template;
    }


    setItem() {
        const item = this.template.item();
        item.addEventListener('click', () => console.log('click'));
    }

}

export {View}

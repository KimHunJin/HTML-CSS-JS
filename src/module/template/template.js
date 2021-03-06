class Template {

    item() {
        const div = document.createElement('div');
        const img = document.createElement('img');

        div.appendChild(img);
        return div;
    }

}

export {Template};

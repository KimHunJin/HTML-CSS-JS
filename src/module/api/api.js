class Api {

    async read() {
        return await fetch('').json();
    }
}

export {Api};

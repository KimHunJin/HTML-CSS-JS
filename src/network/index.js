export async function getToDo() {
    const data = await fetch(`http://116.121.80.22:3000/api`)
    const {contents} = await data.json();
    document.querySelector(".todo-container").innerHTML = contents
        .map(todo => `
                <section class="todo">
                    ${todo.title}
                </section>`
        ).join("")
}

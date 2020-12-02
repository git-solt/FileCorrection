const items = []


export default Object.freeze({
    getItems() {
        return items
    },
    add(item) {
        items.push(item)
    },

    getTotalAmount() {

        return items.filter((cur) => cur[0] == 40).map((cur) => parseFloat(cur[3])).reduce((v, a) => v + a)
    },
    get(index) {
        return items[index]
    },

    removeIndex(index) {
        items.splice(index,1)
    }


})
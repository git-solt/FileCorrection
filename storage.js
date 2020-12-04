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
    },

    getRecordType60Total() {
        return items.filter((cur)=> cur[0] == 60).length
    },

    getRecordType40Total() {
        return items.filter((cur)=> cur[0] == 40).length
    },
    
    notifyDataChange() {
        const total = this.getTotalAmount()
        const nO60 = this.getRecordType60Total()
        const nO40 = this.getRecordType40Total()
        const lastRow = items.length - 1

        items[lastRow][2] = total.toString()
        items[lastRow][3] = nO40 < 10 ? "0".concat(nO40.toString()) : nO40.toString()
        items[lastRow][5] = nO60 < 10 ? "0".concat(nO60.toString()) : nO60.toString()
    }




})
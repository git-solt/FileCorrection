const items = []
let filteredItems = []
let filtering = false
const errorInstances = []
let fileName;

export default Object.freeze({
    getItems() {
        if(filtering && filteredItems.length > 0) {
            return filteredItems
        }
        return [...items]
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

    removeItemByIndex(index) {
        const deletedItems = items.splice(index, 1)
        const errorItem = deletedItems[0]
        this.removeErrorInstanceById(errorItem[1])
    },

    getRecordType60Total() {
        return items.filter((cur) => cur[0] == 60).length
    },

    getRecordType40Total() {
        return items.filter((cur) => cur[0] == 40).length
    },

    notifyDataChange() {
        const total = this.getTotalAmount()
        const nO60 = this.getRecordType60Total()
        const nO40 = this.getRecordType40Total()
        const lastRow = items.length - 1
        function appendRightAmountOfZerosToTotalTypeColumns(totalOfGivenType) {
           const numberOfZerosToAppend = 6 - totalOfGivenType.length
           for(let i = 0; i < numberOfZerosToAppend; i++) {
            totalOfGivenType = "0".concat(totalOfGivenType)
           }
           return totalOfGivenType
        }
        items[lastRow][2] = total.toFixed(2)
        items[lastRow][3] = appendRightAmountOfZerosToTotalTypeColumns(nO40.toString())
        items[lastRow][5] = appendRightAmountOfZerosToTotalTypeColumns(nO60.toString())
    },

    addErrorInstance(error) {
        console.log(error)
        if (error.hasOwnProperty("id") && error.hasOwnProperty("errMsg") && error.hasOwnProperty("lineNumber")) {
            errorInstances.push(error)
            return
        }
        throw new Error("Error needs an id and a message")
    },
    removeErrorInstanceById(id) {
        const index = errorInstances.findIndex(cur => cur.id === id)
        if (index > -1) {
            errorInstances.splice(index, 1)
        }
    },
    isErrorItem(item) {
        return errorInstances.some((errorInstance) => {
            return errorInstance.id === item[1]
        })
    },

    getErrorInstances() {
        return errorInstances
    },

    notifyLineNumberRemoved(lineNumber) {
        errorInstances = errorInstances.map((curErr) => {
            if (curErr.lineNumber > lineNumber) {
                curErr.lineNumber -= 1
                return curErr
            }
            return curErr
        })
    },

    notifyFilteringAndSetFilterData(data) {
        if (!filtering) {
            filtering = true
            filteredItems = data
        }
    },

    renderDone() {
        filtering = false
        filteredItems = []
    },


    getFileName() {
        return fileName
    },

    setFileName(name) {
        fileName = name;
    }

})
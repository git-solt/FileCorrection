let showAllLineNumbers = false

const filter = {
    type: undefined,
    orderBy: undefined,
}

function toggleShowAllLinenumbers() {
    showAllLineNumbers = !showAllLineNumbers
    return showAllLineNumbers
}


function sendDataAndDecideLineNumberDisplay(htmlElement) {
    return showAllLineNumbers ? { withAll: htmlElement } : htmlElement
}

function manipulateData(storage) {
    const shouldOrderBySum = filter.orderBy === 'sum'
    const showRecordType60 = filter.type === 60
    const showRecordType40 = filter.type === 40

    let data = storage.getItems()

    if(showRecordType40) {
        data = data.filter(row => row[0] !== "60")
        storage.notifyFilteringAndSetFilterData(data)
    }

    if(showRecordType60) {
        data = data.filter(row => row[0] !== "40")
        storage.notifyFilteringAndSetFilterData(data)

    }

    if (shouldOrderBySum) {
        data.sort((a, b) => {
            const hasSumColumn = a[0] === "40"
            const aType = parseInt(a[0])
            const bType = parseInt(b[0])
            const aSum = parseInt(a[3])
            const bSum = parseInt(b[3])

            if (aType < bType) {
                return - 1
            } else if (aType > bType) {
                return 1
            } else {
                if (hasSumColumn && aSum > bSum) {
                    return -1
                } else if (hasSumColumn && aSum < bSum) {
                    return 1
                }
                else return 0
            }

        })
        storage.notifyFilteringAndSetFilterData(data)

    }

    return storage
}

function setFilterRecordType_60() {
    filter.type = 60
}

function setFilterRecordType_40() {
    filter.type = 40
}

function clearFilterRecordType() {
    filter.type = undefined
}

function setFilterSortBySum() {
    filter.orderBy = "sum"
}

function clearAllFilters() {
    for (let key in filter) {
        filter[key] = undefined
    }
}

function getFilter() {
    return {...filter}
}

function clearSorting() {
    filter.orderBy = undefined
}

export { clearSorting, getFilter, toggleShowAllLinenumbers, sendDataAndDecideLineNumberDisplay, setFilterRecordType_40, setFilterRecordType_60, clearFilterRecordType, manipulateData, setFilterSortBySum, clearAllFilters }
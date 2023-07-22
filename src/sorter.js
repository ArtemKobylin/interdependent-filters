export class Sorter {
    /**
     * @param sortingOptions
     * [{key, field, direction, description}, ...]
     */
    constructor(sortingOptions = []) {
        this.sortingOptions = sortingOptions;
    }

    setSortingOption(key, field, direction, description) {
        this.sortingOptions.push({key, field, direction, description})
    }

    sortTargets(targets, key) {
        const sortingOption = this.sortingOptions.find((option) => option.key === key)
        console.log('Sorting option', sortingOption)
        if (sortingOption) {
            console.log('targets to sort', targets.slice(0, 5))
            targets.sort((a, b) => {
                if (a[sortingOption.field] > b[sortingOption.field]) {
                    return sortingOption.direction
                } else if (a[sortingOption.field] < b[sortingOption.field]) {
                    return -sortingOption.direction
                } else {
                    return 0
                }
            });
            console.log('sorted targets', targets.slice(0, 5))
        }
        // return targets ???
        // Sorting is done by reference
    }

    getContentsForSortingSelector() {
        return this.sortingOptions.map((option) => {
            return {
                key: option.key,
                description: option.description
            }
        })
    }
}
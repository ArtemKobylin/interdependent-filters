export class Filter {
    constructor(queryFilter, selectingFilter) {
        this.queryFilter = queryFilter
        this.selectingFilter = selectingFilter
        this.keys = []
        this.filterState = null

        if (!this.queryFilter && !this.selectingFilter) {
            window.console.log('Neither query nor selecting filter is set! Define at least one filter!')
            return
        }

        this.initKeys()
        this.initFilterState()
    }

    initFilterState() {
        this.filterState = this.keys.map(key => {
            return {
                name: key,
                value: key === 'query' ? '' : 0
            }
        });
    }

    updateFilterState(newFilter) {
        this.filterState = this.filterState.map(filter => {
            if (filter.name === newFilter.name) {
                if (!isNaN(newFilter.value) && newFilter.value !== '') {
                    filter.value = parseInt(newFilter.value)
                } else {
                    filter.value = newFilter.value
                }
            }
            return filter
        })
    }

    resetFilterState() {
        this.initFilterState()
    }

    initKeys() {
        this.keys = []
        if (this.queryFilter) {
            this.keys.push(this.queryFilter.filterKey)
        }
        if (this.selectingFilter && this.selectingFilter.keys.length) {
            this.selectingFilter.keys.forEach(key => {
                this.keys.push(key)
            })
        }
    }

    filterTargets(targets) {
        return targets.filter((target) => {
            let match = true
            this.filterState.forEach(filter => {
                if (filter.name === 'query') {
                    if (filter.value === '') return
                    match &= target[this.queryFilter.targetKey].includes(filter.value)
                } else {
                    if (filter.value === 0) return
                    match &= target[filter.name] === filter.value
                }
            })
            return match
        })
    }
}

export class QueryFilter {
    constructor(targetKey) {
        this.filterKey = 'query'
        this.query = ''
        this.targetKey = targetKey
    }

    filterTargets(targets) {
        return targets.filter((target) => target[this.targetKey].includes(this.query))
    }
}

export class SelectingFilter {
    constructor(keys) {
        this.keys = []
        this.initKey(keys)
        // this.filterState = null
        // this.initFilterState()
    }

    initKey(key) {
        if (Array.isArray(key)) {
            const keys = [...key]
            keys.forEach((key) => {
                this.keys.push(key)
            })
        } else if (key) {
            this.keys.push(key)
        } else {
            window.console.log('Invalid filter key provided!', key)
        }
    }

    initFilterState() {
        this.filterState = this.keys.map(key => {
            return {
                name: key,
                value: 0
            }
        });
    }

    updateFilterState(newFilter) {
        this.filterState = this.filterState.map(filter => {
            if (filter.name === newFilter.name) {
                if (!isNaN(newFilter.value)) {
                    filter.value = parseInt(newFilter.value)
                } else {
                    filter.value = newFilter.value
                }
            }
            return filter
        })
    }

    resetFilterState() {
        this.initFilterState()
    }

    getFilterOptionsFromTargetsByKey(key, targets) {
        let filterOptions = [];
        const optionsCount = {}
        targets.forEach((target) => {
            if (target[key] === undefined || target[key] === null) return
            if (optionsCount[target[key]]) {
                optionsCount[target[key]]++
            } else {
                optionsCount[target[key]] = 1
            }
        })
        for (const option in optionsCount) {
            filterOptions.push({
                name: option,
                count: optionsCount[option]
            })
        }

        return filterOptions.sort((a,b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else {
                return 0
            }
        })
    }

    getEmptyFilters(keys) {
        const filters = [];
        keys.forEach((key) => {
            filters.push({
                name: key,
                options: []
            })
        })
        return filters
    }

    getFiltersFromTargets(targets) {
        const filters = this.getEmptyFilters(this.keys)

        filters.forEach((filter) => {
            filter.options = this.getFilterOptionsFromTargetsByKey(filter.name, targets)
        })
        return filters
    }

    filterTargets(targets) {
        return targets.filter((target) => {
            let match = true;
            this.filterState.forEach(filter => {
                if (filter.value === 0) return
                match &= target[filter.name] === filter.value
            })
            return match
        })
    }
}
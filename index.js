class UserGenerator {
    cities = [
        {
            country: 'Afghanistan',
            names: ['Kabul']
        },
        {
            country: 'Brazil',
            names: ['Rio de Janeiro', 'Sao Paulo']
        },
        {
            country: 'France',
            names: ['Paris', 'Marseille']
        },
        {
            country: 'Germany',
            names: ['Berlin', 'Munich', 'Coburg']
        },
        {
            country: 'India',
            names: ['Mumbai', 'Delhi']
        },
        {
            country: 'Japan',
            names: ['Tokyo', 'Kawasaki']
        },
        {
            country: 'Mexico',
            names: ['Mexico City']
        },
        {
            country: 'Russia',
            names: ['Moscow', 'Kazan']
        },
        {
            country: 'Spain',
            names: ['Barcelona', 'Madrid']
        },
        {
            country: 'Turkey',
            names: ['Ankara', 'Istanbul']
        }
    ]
    regions = ['north', 'west', 'south', 'east']
    usersKeys = ['name', 'age', 'country', 'city', 'region']
    generateUsers(amount) {
        const users = [];

        while (users.length < amount) {
            const country = this.generateRandomCountry()
            users.push({
                name: this.generateRandomName(),
                age: this.generateRandomAge(100),
                country: country,
                city: this.generateRandomCity(country),
                region: this.generateRandomRegion(),
            });
        }

        return users
    }
    generateRandomName() {
        const adjectives = ['happy', 'sad', 'funny', 'serious', 'clever', 'wise', 'kind', 'brave', 'honest', 'loyal'];
        const nouns = ['cat', 'dog', 'bird', 'tree', 'book', 'flower', 'mountain', 'river', 'ocean', 'planet'];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective}-${randomNoun}`;
    }
    generateRandomAge(maxAge) {
        return Math.floor(Math.random() * maxAge);
    }
    generateRandomCountry() {
        const countries = [];
        this.cities.forEach((city) => {
            countries.push(city.country)
        })
        return countries[Math.floor(Math.random() * countries.length)];
    }
    generateRandomCity(country) {
        let citiesByCountry = this.cities.find((city) => city.country === country).names;
        return citiesByCountry[Math.floor(Math.random() * citiesByCountry.length)]
    }
    generateRandomRegion() {
        return this.regions[Math.floor(Math.random() * this.regions.length)]
    }
}
const userGenerator = new UserGenerator();
const initUsers = userGenerator.generateUsers(500);

class Filter {
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
class QueryFilter {
    constructor(targetKey) {
        this.filterKey = 'query'
        this.query = ''
        this.targetKey = targetKey
    }

    filterTargets(targets) {
        return targets.filter((target) => target[this.targetKey].includes(this.query))
    }
}
const queryFilter = new QueryFilter('name')
class SelectingFilter {
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
const selectingFilter = new SelectingFilter(['country', 'city', 'region'])
const filterManager = new Filter(queryFilter, selectingFilter)
const initFilters = filterManager.selectingFilter.getFiltersFromTargets(initUsers)

class HTMLBuilder {
    body = document.body
    createElem(tagName) {
        return document.createElement(tagName)
    }
    getElem(query) {
        return document.querySelector(query)
    }
    css(key, value) {

    }
}
const html = new HTMLBuilder()
const heading = html.createElem('h1')
heading.textContent = 'Interdependent filters'
html.body.appendChild(heading)

const container = html.createElem('div')
container.classList.add('container')
html.body.appendChild(container)

const buildQueryFilter = () => {
    const input = html.createElem('input')
    container.appendChild(input)
    return input
}
const resetSearchBar = () => {
    searchBar.value = ''
}
const searchBar = buildQueryFilter()
const buildResetButtonForQueryFilter = () => {}
buildResetButtonForQueryFilter()

const buildSelectingFilters = (showCount = false) => {
    const selectors = []
    initFilters.forEach((filter) => {
        const selector = html.createElem('select')
        const defaultOption = html.createElem('option')
        defaultOption.textContent = filter.name
        defaultOption.value = 0
        selector.appendChild(defaultOption)
        filter.options.forEach((option) => {
            const optionElem = html.createElem('option');
            optionElem.textContent = option.name
            if (showCount) {
                optionElem.textContent += ' (' + option.count +')'
            }
            optionElem.value = option.name
            selector.appendChild(optionElem)
        })
        container.appendChild(selector)
        selectors.push(selector)
    })
    return selectors
}
const updateSelectingFilters = (activeFilters, triggeredFilter) => {
    selectors.forEach((selector) => {
        const options = [...selector.children];
        if (!triggeredFilter) {
            selector.value = 0
        }
        if (triggeredFilter?.name === options[0].textContent && triggeredFilter?.value !== 0) {
            return;
        }
        const activeFilter = activeFilters.find((filter) => filter.name === options[0].textContent);
        options.forEach((option, index) => {
            if (option.selected) return
            if (parseInt(option.value) === 0) return

            const match = activeFilter.options.find(filterOption => filterOption.name === option.value)
            option.disabled = match === undefined;
        })
    })
}
const selectors = buildSelectingFilters()

const buildResetButton = () => {
    const button = html.createElem('button')
    button.textContent = 'reset filters'
    button.addEventListener('click', () => {
        filterManager.resetFilterState()
        const users = filterManager.filterTargets(initUsers)
        const filters = filterManager.selectingFilter.getFiltersFromTargets(users);

        updateSelectingFilters(filters, null)
        resetSearchBar()
        removeTable()
        buildTable(users)
    })
    container.appendChild(button)
}
buildResetButton()

const removeTable = () => {
    html.getElem('.container table').remove()
}
const buildTable = (data) => {
    const table = html.createElem('table')
    const tableHead = html.createElem('thead')
    let tableRow = html.createElem('tr')
    const tableColumns = ['name', 'age'];
    tableColumns.forEach((column) => {
        const cell = html.createElem('th')
        cell.textContent = column
        tableRow.appendChild(cell)
    })
    tableHead.appendChild(tableRow)
    table.appendChild(tableHead)

    const tableBody = html.createElem('tbody')
    data.forEach((user) => {
        tableRow = html.createElem('tr')
        tableColumns.forEach((columnName) => {
            const cell = html.createElem('td')
            cell.textContent = user[columnName]
            tableRow.appendChild(cell)
        })
        tableBody.appendChild(tableRow)
    })

    table.appendChild(tableBody)
    container.appendChild(table)
}
buildTable(initUsers)


const addEventListenerToSearchBar = (searchBar) => {
    searchBar.addEventListener('input', (event) => {
        const filter = {
            name: 'query',
            value: event.target.value
        };
        filterManager.updateFilterState(filter)
        const users = filterManager.filterTargets(initUsers)
        const filters = filterManager.selectingFilter.getFiltersFromTargets(users)

        updateSelectingFilters(filters, filter)
        removeTable()
        buildTable(users)
    })
}
addEventListenerToSearchBar(searchBar)

const addEventListenerToSelector = (selector) => {
    selector.addEventListener('change', (event) => {
        const filter = {
            name: event.target.children[0].textContent,
            value: !isNaN(event.target.value) ? parseInt(event.target.value) : event.target.value
        };
        filterManager.updateFilterState(filter)
        const users = filterManager.filterTargets(initUsers)
        const filters = filterManager.selectingFilter.getFiltersFromTargets(users)

        updateSelectingFilters(filters, filter)
        removeTable()
        buildTable(users)
    })
}
selectors.forEach((selector) => {
    addEventListenerToSelector(selector)
})

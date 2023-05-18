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
const initUsers = userGenerator.generateUsers(50);

class FilterManager {
    constructor(keys) {
        this.keys = keys
        this.filterState = this.initFilterState()
        this.filters = this.getEmptyFilters(keys)
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

    getFiltersFromTargets(targets) {
        this.filters.forEach((filter) => {
            filter.options = this.getFilterOptionsFromTargetsByKey(filter.name, targets)
        })

        const filtersJSON = JSON.stringify(this.filters);
        return JSON.parse(filtersJSON);
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

    initFilterState() {
        return this.keys.map(key => {
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
        this.keys.forEach((key) => {
            const filter = {
                name: key,
                value: 0
            }
            this.updateFilterState(filter)
        })
    }
}
const filterManager = new FilterManager(['country', 'city', 'region'])
const initFilters = filterManager.getFiltersFromTargets(initUsers);

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

const buildFilterSelectors = (showCount = false) => {
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
const updateSelectors = (activeFilters, triggeredFilter) => {
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
const selectors = buildFilterSelectors()

const buildResetButton = () => {
    const button = html.createElem('button')
    button.textContent = 'reset filters'
    button.addEventListener('click', () => {
        filterManager.resetFilterState()
        const users = filterManager.filterTargets(initUsers)
        const filters = filterManager.getFiltersFromTargets(users);

        updateSelectors(filters, null)
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

const addEventListenerToSelector = (selector) => {
    selector.addEventListener('change', (event) => {
        const filter = {
            name: event.target.children[0].textContent,
            value: !isNaN(event.target.value) ? parseInt(event.target.value) : event.target.value
        };
        filterManager.updateFilterState(filter)
        const users = filterManager.filterTargets(initUsers)
        const filters = filterManager.getFiltersFromTargets(users);

        updateSelectors(filters, filter)
        removeTable()
        buildTable(users)
    })
}
selectors.forEach((selector) => {
    addEventListenerToSelector(selector)
})

import {UserGenerator} from "./user-generator"
import {Filter, QueryFilter, SelectingFilter} from "./filters"
import {Sorter} from "./sorter"
import {HTMLBuilder} from "./html-builder";

const userGenerator = new UserGenerator()
const initUsers = userGenerator.generateUsers(100)

const queryFilter = new QueryFilter('name')
const selectingFilter = new SelectingFilter(['country', 'city', 'region'])
const filterManager = new Filter(queryFilter, selectingFilter)
const initFilters = filterManager.selectingFilter.getFiltersFromTargets(initUsers)

const sorter = new Sorter([
    {
        key: "alphabetASC",
        field: "name",
        direction: 1,
        description: "Alphabetically ascending"
    },
    {
        key: "alphabetDESC",
        field: "name",
        direction: -1,
        description: "Alphabetically descending"
    },
    {
        key: "countryASC",
        field: "country",
        direction: 1,
        description: "Country ascending"
    },
    {
        key: "countryDESC",
        field: "country",
        direction: -1,
        description: "Country descending"
    },
    {
        key: "cityASC",
        field: "city",
        direction: 1,
        description: "City ascending"
    },
    {
        key: "cityDESC",
        field: "city",
        direction: -1,
        description: "City descending"
    }
]);

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

const buildSortingSelector = () => {
    const selector = html.createElem('select')
    const defaultOption = html.createElem('option')
    defaultOption.textContent = 'Sort'
    defaultOption.value = 0
    selector.appendChild(defaultOption)
    const sortingOptions = sorter.getContentsForSortingSelector()
    sortingOptions.forEach((option) => {
        const optionElem = html.createElem('option')
        optionElem.textContent = option.description
        optionElem.value = option.key
        selector.appendChild(optionElem)
        container.appendChild(selector)
    })
    return selector
}
const sortingSelector = buildSortingSelector();

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

const addEventListenerToFilterSelector = (selector) => {
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
    addEventListenerToFilterSelector(selector)
})

const addEventListenerToSortingSelector = (selector) => {
    selector.addEventListener('change', (event) => {
        console.log('sorting option changed')
        const users = filterManager.filterTargets(initUsers)
        console.log('key selected', event.target.value)
        sorter.sortTargets(users, event.target.value)

        removeTable()
        buildTable(users)
    })
}
addEventListenerToSortingSelector(sortingSelector)
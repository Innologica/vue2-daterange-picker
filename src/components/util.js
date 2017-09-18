const nextMonth = (date) => {
    let passYear = date.getMonth() === 11
    let newMonth = passYear ? 0 : date.getMonth() + 1
    let year = passYear ? date.getFullYear() + 1 : date.getFullYear()
    return new Date(year, newMonth, date.getDate())
}

const prevMonth = (date) => {
    let passYear = date.getMonth() === 0
    let newMonth = passYear ? 11 : date.getMonth() - 1
    let year = passYear ? date.getFullYear() - 1 : date.getFullYear()
    return new Date(year, newMonth, date.getDate())
}

export { nextMonth, prevMonth }

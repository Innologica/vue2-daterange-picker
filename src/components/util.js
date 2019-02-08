const nextMonth = (date) => {

    let passYear = date.getMonth() === 11,
      year = passYear ? date.getFullYear() + 1 : date.getFullYear(),
      newMonth = passYear ? 0 : date.getMonth() + 1;

    return new Date(year, newMonth, 1);
}

const prevMonth = (date) => {

    let passYear = date.getMonth() === 0,
      newMonth = passYear ? 11 : date.getMonth() - 1,
      year = passYear ? date.getFullYear() - 1 : date.getFullYear();

    return new Date(year, newMonth, 1);
}

export { nextMonth, prevMonth }

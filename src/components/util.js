const getDateUtil = (dateUtil = 'native') => {
  if(dateUtil instanceof Object)
    return dateUtil;
  else if (typeof dateUtil === 'string' || dateUtil instanceof String) {
    return require('./date_util/' + dateUtil).default
  }
}

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
}

export { getDateUtil, isValidDate }

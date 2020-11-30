const getDateUtil = (dateUtil: string|Record<string, any>|any = 'native') => {
  if(dateUtil instanceof Object)
    return dateUtil;
  else if (typeof dateUtil === 'string' || dateUtil instanceof String) {
    return require('./date_util/' + dateUtil).default
  }
}

export { getDateUtil }

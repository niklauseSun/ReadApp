
const getBookList = ({callback = null}) => {
  global.storage.load({
    key: "bookDetailList"
  }).then(ret => {
    console.log('ret', ret)
    callback({
      error: null,
      data: ret
    })
  }).catch(err => {
    console.log('err', err)
    callback({
      error: err
    })
  })
}

const getBookIdList = ({callback = null}) => {
  global.storage.load({
    key: "bookIdList"
  }).then(ret => {
    console.log('ret', ret)
    callback({
      error: null,
      data: ret
    });
  }).catch(err => {
    console.log('err', err)
    callback({
      error: err
    });
  })
}

const getCharterListById = ({ articleId, callback }) => {
  global.storage.load({
    key: 'articleId' + articleId,
  }).then(ret => {
    console.log('ret', ret)
  }).catch(err => {
    console.log('err', err)
  })
}

const getBookContentByChartId = ({ charterId, callback }) => {
  global.storage.load({
    key: 'charterId' + charterId,
  }).then(ret => {
    console.log('ret', ret)
  }).catch(err => {
    console.log('err', err)
  })
}

const saveBookDetailList = ({ data, callback }) => {
  global.storage.save({
    key: 'bookDetailList',
    data: data
  })
}

const saveBookIdList = ({ data, callback }) => {
  global.storage.save({
    key: 'bookIdList',
    data: data
  })
}

const saveCharterListById = ({ data,  articleId }) => {
  global.storage.save({
    key: 'articleId' + articleId,
    data: data
  })
}

const saveBookContentById = ({ data, charterId }) => {
  global.storage.save({
    key: 'charterId' + charterId,
    data: data
  })
}

// 搜索历史

const saveSearchList = ({ data }) => {
  global.storage.save({
    key: 'searchList',
    data: data
  })
}
const getSearchList = ({ callback}) => {
  global.storage.load({
    key: 'searchList'
  }).then(ret => {
    callback({
      data: ret,
      error: null
    })
  }).catch( err => {
    callback({
      error: err,
      data: null
    })
  })
}

const clearSearchList = () => {
  global.storage.clearMapForKey("searchList");
}

export {
  getBookList,
  getBookIdList,
  getCharterListById,
  getBookContentByChartId,
  saveBookDetailList,
  saveBookIdList,
  saveCharterListById,
  saveBookContentById,
  saveSearchList,
  getSearchList,
  clearSearchList,
};


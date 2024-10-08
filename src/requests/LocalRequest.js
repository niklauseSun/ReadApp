
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
    console.log('getSearchList', ret)
    callback({
      data: ret,
      error: null
    })
  }).catch( err => {
    console.log('eeee')
    callback({
      error: err,
      data: null
    })
  })
}

const clearSearchList = () => {
  global.storage.clearMapForKey("searchList");
}

// 保存设置
const saveSetConfig = ({ data }) => {
  global.storage.save({
    key: 'setConfig',
    data: data
  })
}

const getSetConfig = ({ callback }) => {
  global.storage.load({
    key: 'setConfig'
  }).then(ret => {
    callback({
      data: ret,
      error: null
    })
  }).catch(err => {
    callback({
      error: err,
      data: null
    })
  })
}

const getHomeAd = ({ callback }) => {
  global.storage.load({
    key: 'homeAd'
  }).then(ret => {
    callback({
      data: ret,
      error: null
    })
  }).catch(err => {
    callback({
      error: err,
      data: null
    })
  })
}

const saveHomeAd = ({ data }) => {
  global.storage.save({
    key: 'homeAd',
    data: data
  })
}

const getContentHeadAd = ({ callback }) => {
  global.storage.load({
    key: 'contentHeadAd'
  }).then(ret => {
    callback({
      data: ret,
      error: null
    })
  }).catch(err => {
    callback({
      error: err,
      data: null
    })
  })
}

const saveContentHeadAd = ({ data }) => {
  global.storage.save({
    key: 'contentHeadAd',
    data: data
  })
}

const getLocalMenuList = ({ articleid = null, callback }) => {

  if (articleid == null) {
    callback({
      error: '无效的articleid',
      data: null
    })
    return;
  }
  global.storage.load({
    key: 'menuList' + articleid
  }).then(ret => {
    callback({
      data: ret,
      error: null
    })
  }).catch(err => {
    callback({
      error: err,
      data: null
    })
  })
}

const saveLocalMenuList = ({ articleid, menuList }) => {
  if (articleid == null) {
    return;
  }

  global.storage.save({
    key: 'menuList' + articleid,
    data: menuList
  })
}

const clearAllCache = () => {
  global.storage.clearAll()
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
  getSetConfig,
  saveSetConfig,
  clearAllCache,
  getHomeAd,
  saveHomeAd,
  saveLocalMenuList,
  getLocalMenuList
};


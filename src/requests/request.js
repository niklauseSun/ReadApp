import { Hud } from "../components"


// http://wangu.91xiaoapp.com:8081/Api/Article/MainRanks

const serverHome = 'http://wangu.91xiaoapp.com:8081/'

// 书库主排行
const getMainRanks = ({callback = null}) => {
  console.log('getMainRanks')
  getRequest('Api/Article/MainRanks', callback)
}

// 书库分类排行榜
const getSubRanks = ({type, pageSize = 3, callback = null}) => {
  getRequest(`Api/Article/TypeRanks/${type}?pageSize=${pageSize}`, callback);
}

// 搜索接口
const getSearchResult = ({keyword, callback = null}) => {
  getRequest(`Api/Article/Search/${keyword}`, callback);
}

const getBookDetail = ({articleid, callback = null}) => {
  getRequest(`Api/Article/Detail/${articleid}`, callback);
}

const getMenuList = ({articleid, pageIndex = 1, pageSize = 10, callback = null}) => {
  getRequest(`Api/Article/Chapters/${articleid}?pageIndex=${pageIndex}&pageSize=${pageSize}`, callback);
}

const getBookContent = ({articleid, chapterid, callback = null }) => {
  getRequest(`Api/Article/${articleid}/${chapterid}`, callback);
}
// 1.	Api/Article/Detail/{articleid} 文章详情
// 1.	Api/ Article /Chapters/{articleid}?pageIndex=1&pageSize=10 章节目录
// 1.	Api/Article/ {articleid}/{chapterid} 章节内容


getRequest = (url, callback = null) => {

  // Hud.show()
  let opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 60 * 1000
  };
  
  fetch(serverHome + url, opts).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).then((responseJson) => {


    if (callback) {
      callback(responseJson);
    }
    // Hud.hidden()
    console.log('responseJson', responseJson)
  }).catch((error) => {
    console.log('error', error)
    if (callback) {
      callback(error);
    }
    // Hud.hidden();
  }).finally(()=> {
    // Hud.hidden();
  })
}

export {
  getMainRanks,
  getSubRanks,
  getSearchResult,
  getBookDetail,
  getMenuList,
  getBookContent
};
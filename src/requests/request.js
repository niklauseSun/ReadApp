


// http://wangu.91xiaoapp.com:8081/Api/Article/MainRanks

const serverHome = 'http://wangu.91xiaoapp.com:8081/'

// 书库主排行
getMainRanks = () => {
  

  getRequest('Api/Article/MainRanks')
}

// 

getRequest = (url) => {
  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 60 * 1000,
  }
  
  fetch(serverHome + url, opts).then((response) => {
    if (response.ok) {
      return response.json();
    }
  }).then((responseJson) => {
    console.log('responseJson', responseJson)
  }).catch((error) => {
    console.log('error', error)
  })
}
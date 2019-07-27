获取分类排行

type

- 玄幻 = 1,
- 修真 = 2,
- 都市 = 3,
- 穿越 = 4,
- 网游 = 5,
- 科幻 = 6,


#### 关于存储相关

文章的 acrticleid

章节 charterid

文章内容 content

首页存储的是 articelid

通过articleid获取文章列表

判断数据是否已经在本地列表中，就不需要加入了

需要保存articleid的list - 无需排序

articleIdList

articleDetailList 书本的详细信息，按照点击时间进行排序，

搜索历史 只保存六个
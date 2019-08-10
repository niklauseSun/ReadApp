import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Modal, Image, FlatList, ScrollView, DeviceEventEmitter, NativeModules, Platform } from "react-native";
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';
import { Slider, Toast } from '@ant-design/react-native'
import {
  getBookContent,
  getMenuList,
  getAd,
  getSetConfig,
  saveBookDetailList,
  saveSetConfig } from '../requests'
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import { Header, Hud } from '../components'

const colorsBg = ['#fff','#EBD3D3', '#E4EFE1', '#CBECE9', '#D4DDEB', '#CFB9C2']

export default class BookContent extends Component {

  constructor(props) {
    super(props);

    const { articleid, chapterid } = props.navigation.state.params || {}

    this.state = {
      articleid: articleid,
      chapterid: chapterid,
      menuIndex: 1,
      charterList: null,
      bottomModal: false,
      menuListModal: false,
      setModal:false,
      colorArray: [0,1,2,3,4],
      colorIndex: 0,
      contentFontSize: 16,
      contentBackgroundColor: '#fff',
      contentDirection: true, // true 上下 false 左右
      contentLineHeight: 16,
      bookContent: null,
      headUrl:'',
      bottomUrl: null,
      brightValue: 0.5,
    }
  }

  componentDidMount() {
    Hud.show()
    this.getBrightAction()
    // this.requestBookContent()
    this.requestMenuList()
    this.requestHeadAd()
    this.requestBottomAd()
    this.getLocalConfig()
  }

  render() {
    const androidContent = `<html>
      <script type="text/javascript" charset="utf-8"">
        if(!document.__defineGetter__) {
          Object.defineProperty(document, 'cookie', {
              get: function(){return ''},
              set: function(){return true},
          });
        } else {
          document.__defineGetter__("cookie", function() { return '';} );
          document.__defineSetter__("cookie", function() {} );
        }
      </script></html>`
    const htmlContent = `<html><script type="text/javascript" charset="utf-8" src="${this.state.headUrl}"></script></html>`
    const htmlBottomContent = `<script type="text/javascript" charset="utf-8" src="${this.state.bottomUrl}"></script>`

    console.log('htmlContent', htmlContent)
    return (
      <View style={[styles.container]}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeView}>
            <View style={styles.headAd}>
              {/* <WebView
                style={{ width: '100%', height: '100%' }} source={{ html: htmlContent}}>
              </WebView> */}
            {
              Platform.OS == "ios" ? <WebView
                source={{ html: htmlContent }}
                style={{ width: '100%', height: '100%' }}
              /> : <WebView
                  thirdPartyCookiesEnabled={true}
                  sharedCookiesEnabled={true}
                  source={{ html: androidContent }}
                  javaScriptEnabled={true}
                  injectedJavaScript={`document.write('<script src="${this.state.headUrl}"></script>')`}
                />
            }
            </View>
          <View style={[styles.readContent, { backgroundColor: this.colorChange(this.state.colorIndex) }]}>
              <ScrollView
                ref = {(view) => { this.myScrollView = view; }}
                onMomentumScrollEnd={(e) => {
                  console.log('onScrollEnd')
                  var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
                  var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
                  var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
                  if (Math.floor(offsetY + oriageScrollHeight) >= Math.floor(contentSizeHeight)) {
                    this.setState({
                      chapterid: this.state.chapterid + 1
                    }, () => {
                      this.updateBookDetailList()
                      this.requestBookContent(true)
                      this.scrollToTopView()
                    })
                  }
                }}
                style={{ paddingVertical: px(20), paddingHorizontal:(20), backgroundColor: this.colorChange(this.state.colorIndex) }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    backgroundColor: this.colorChange(this.state.colorIndex)
                  }}
                  onPress={() => {
                  this.setState({
                    bottomModal: !this.state.bottomModal
                  })
                }} style={styles.content}>
                <Text style={{
                  fontSize: this.state.contentFontSize,
                  lineHeight: this.state.contentLineHeight,
                  backgroundColor: this.colorChange(this.state.colorIndex),
                }}>{this.state.bookContent}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            <View style={ styles.bottomAd}>
            {
              Platform.OS == "ios" ? <WebView
                source={{ html: htmlBottomContent }}
                style={{ width: '100%', height: '100%' }}
              /> : <WebView
                  thirdPartyCookiesEnabled={true}
                  sharedCookiesEnabled={true}
                  source={{ html: androidContent }}
                  javaScriptEnabled={true}
                  injectedJavaScript={`document.write('<script src="${this.state.bottomUrl}"></script>')`}
                />
            }
            {/* <WebView style={{ width: '100%', height: '100%' }} source={{ html: htmlBottomContent }}>

              </WebView> */}
            </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.bottomModal}
            >
            <SafeAreaView style={styles.modalContent}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    bottomModal: !this.state.bottomModal
                  })
                }}
                style={styles.headModalView}
              >
                <TouchableOpacity onPress={() => {
                  this.setState({
                    bottomModal: false
                  },() => {
                    this.props.navigation.goBack()
                  })
                }}>
                  <Header
                    title={this.state.charterList == null || this.state.charterList.length == 0 ? "" : this.state.charterList[this.state.chapterid].chaptername}
                    showBackButton={true}
                    navigation={this.props.navigation} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.bottomModalView}>
                <View style={styles.bottomContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        bottomModal: !this.state.bottomModal,
                        menuListModal: !this.state.menuListModal
                      })
                      // this.flatList.scrollToIndex({ index: this.state.chapterid})
                    }}
                    activeOpacity={0.7}
                    style={styles.menuButton}>
                    <Image source={ASSET_IMAGES.ICON_MENU_BUTTON} />
                    <Text style={styles.menuText}>目录</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        bottomModal: !this.state.bottomModal,
                        setModal: !this.state.setModal
                      })
                    }}
                    activeOpacity={0.7}
                    style={styles.setButton}>
                    <Image source={ASSET_IMAGES.ICON_CONTENT_SET_BUTTON} />
                    <Text style={styles.setText}>设置</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.menuListModal}
            >
            <View style={{ flexDirection: 'row'}}>
              <SafeAreaView style={{ backgroundColor: '#fff', width: '80%' }}>
                <FlatList
                  ref={(view) => { this.flatList = view; }}
                  onLayout={(e) => {
                    this.flatList.scrollToIndex({ index: this.state.chapterid })
                  }}
                  data={this.state.charterList}
                  renderItem = {({ item, index }) => {
                    return (
                      <TouchableOpacity onPress={() => {
                        this.setState({
                          chapterid: index,
                          menuListModal: false,
                        }, () => {
                          this.requestBookContent(true)
                          this.updateBookDetailList()
                        })
                      }} style={styles.itemContent}>
                        <Text style={[styles.chapterName, { 'color': index == this.state.chapterid ? '#000':"#656E79"
                        }]}>{item.chaptername}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </SafeAreaView>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress = {() => {
                  this.setState({
                    bottomModal: false,
                    menuListModal: false
                  })
                }}
                style = {{
                  justifyContent: 'center',
                  height: '100%',
                  width: '20%'
                }}>
                <View>
                  <Image source={ASSET_IMAGES.ICON_ARROW_LEFT} />
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.setModal}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView style={styles.modalContent}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    setModal: !this.state.setModal,
                    bottomModal: false
                  })
                }}
                style={styles.headModalView}>
              </TouchableOpacity>
              <View style={styles.setModalContent}>
                <View style={styles.lightSet}>
                  <Text style={styles.lightSetText}>亮度</Text>
                  <View style={{ flex: 1 }}>
                    <Slider 
                      onChange={ this.onSliderChange.bind(this) } 
                      value={this.state.brightValue}
                    />
                  </View>
                  <Image style={styles.lightSetImage} source={ASSET_IMAGES.ICON_BRIGHT} />
                </View>
                <View style={styles.wordSizeSet}>
                  <Text style={styles.wordInfoText}>字号</Text>
                  <View style={styles.wordSetButtons}>
                    <TouchableOpacity onPress={this.wordMinusAction.bind(this)} activeOpacity={0.7} style={styles.wordMinus}>
                      <Text style={styles.wordMinusText}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.wordAddAction.bind(this)}  activeOpacity={0.7} style={styles.wordAdd}>
                      <Text style={styles.wordAddText}>A+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.backgroundSetView}>
                  <Text style={styles.backgroundText}>背景</Text>
                  <FlatList
                    data={['#FFFFFF','#EBD3D3', '#E4EFE1', '#CBECE9', '#D4DDEB', '#CFB9C2']}
                    horizontal={true}
                    renderItem={({item, index}) => {
                      return <TouchableOpacity onPress={() => {
                        this.setState({
                          colorIndex: index
                        }, () => {
                            this.updateConfig()
                        })
                      }} style={[{ backgroundColor: item }, styles.colorButtons]} ></TouchableOpacity>
                    }}
                  />
                </View>
                <View style={styles.directionView}>
                  <Text style={styles.directionText}>方向</Text>
                  <View style={styles.directionButtonViews}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.oneDirectionButton}>
                      <Text style={styles.oneDirectionText}>左右</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.twoDirectionButton}>
                      <Text style={styles.twoDirectionText}>上下</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.lineButtonViews}>
                  <Text style={styles.lineText}>间距</Text>
                  <View style={styles.lineButtons}>
                    <TouchableOpacity onPress={this.lineHeightChangeAction.bind(this, 0)} activeOpacity={0.7} style={styles.largeButton}>
                      <Text>变大</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.lineHeightChangeAction.bind(this, 1)} activeOpacity={0.7} style={styles.normalButton}>
                      <Text>正常</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.lineHeightChangeAction.bind(this, 2)} activeOpacity={0.7} style={styles.smallButton}>
                      <Text>变小</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              </SafeAreaView>
            </Modal>
        </SafeAreaView>
      </View>
    )
  }

  // request
  requestBookContent(showLoading = false) {

    if (showLoading) {
      Hud.show()
    }

    
    if (this.state.charterList == null) {
      return;
    }
    const { chapterid = null } = this.state.charterList[this.state.chapterid] || {}

    const data = {
      callback: this.requestBookContentCallback.bind(this),
      chapterid: chapterid,
      articleid: this.state.articleid
    }
    getBookContent(data)
  }

  requestBookContentCallback(res) {
    Hud.hidden();
    const { data, state } = res;
    if (state == 1) {
      this.setState({
        bookContent: data.Content
      })
    }
  }

  requestMenuList() {
    const data = {
      pageIndex: 1,
      pageSize: 10,
      articleid: this.state.articleid,
      callback: this.requestMenuListCallback.bind(this)
    }
    getMenuList(data)
  }

  requestMenuListCallback(res) {
    const { data, state, page } = res;
    if (state == 1) {
      const { records } = page
      const requestData = {
        pageIndex: 1,
        pageSize: records,
        articleid: this.state.articleid,
        callback: this.requestFullMenuListCallback.bind(this)
      }
      getMenuList(requestData);
    }
  }

  requestFullMenuListCallback(res) {
    const { data, state } = res;
    if (state == 1) {
      this.setState({
        charterList: data,
      }, () => {
          this.requestBookContent()
      })
    }
  }

  requestHeadAd() {
    const data = {
      callback: this.requestHeadAdCallback.bind(this),
      adType: 5
    }
    getAd(data)
  }

  requestHeadAdCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        headUrl: data.Url,
      })
    }
  }

  requestBottomAd() {
    const data = {
      callback: this.requestBottomAdCallback.bind(this),
      adType: 5
    }
    getAd(data)
  }

  requestBottomAdCallback(res) {
    const { state, data } = res;
    if (state == 1) {
      this.setState({
        bottomUrl: data.Url,
      })
    }
  }

  colorChange(index) {
    switch(index) {
      case 0:
        return '#FFFFFF';
      case 1:
        return '#EBD3D3'
      case 2:
        return '#E4EFE1'
      case 3:
        return '#CBECE9'
      case 4:
        return '#D4DDEB'
      case 5:
        return '#CFB9C2'
    }
  }

  wordMinusAction() {
    this.setState({
      contentFontSize: this.state.contentFontSize - 1,
      contentLineHeight: this.state.contentFontSize + 2
    }, () => {
        this.updateConfig()
    })
    
  }

  wordAddAction() {
    this.setState({
      contentFontSize: this.state.contentFontSize + 1,
      contentLineHeight: this.state.contentFontSize + 2
    }, ()=> {
        this.updateConfig()
    })
  }

  lineHeightChangeAction(type) {
    if (type == 2 && this.state.contentLineHeight < this.state.contentFontSize) {
      Toast.info("不能再小了！");
      return;
    }
    switch(type) {
      case 0:
        this.setState({
          contentLineHeight: this.state.contentLineHeight + 2
        }, () => {
            this.updateConfig()
        })
        break;
      case 1:
        this.setState({
          contentLineHeight: this.state.contentFontSize + 2
        }, () => {
          this.updateConfig()
        })
        break;
      case 2:
        this.setState({
          contentLineHeight: this.state.contentLineHeight - 2
        }, () => {
            this.updateConfig()
        })
        break;
    }
  }

  // 获取配置
  getLocalConfig() {
    const data = {
      callback: this.getLocalConfigCallback.bind(this)
    }
    getSetConfig(data)
  }

  getLocalConfigCallback(res) {
    const { error, data } = res;
    if (error == null) {
      const {
        colorIndex = 0,
        contentFontSize = 16,
        contentLineHeight = 16,
      } = data;
      this.setState({
        colorIndex: colorIndex,
        contentFontSize: contentFontSize,
        contentLineHeight: contentLineHeight
      })
    }
  }

  updateConfig() {
    const data = {
      colorIndex: this.state.colorIndex,
      contentFontSize: this.state.contentFontSize,
      contentLineHeight: this.state.contentLineHeight
    }
    saveSetConfig({ data });
  }

  updateBookDetailList() {
    const detail = global.bookDetailList[0];
    detail.nowDate = new Date();
    detail.charterIndex = this.state.chapterid
    global.bookDetailList[0] = detail

    saveBookDetailList({ data: global.bookDetailList })
    DeviceEventEmitter.emit("updateBookListEmit");
  }

  scrollToTopView() {
    this.myScrollView.scrollTo({
      x: 0,
      y: 0,
      animated: true
    })
  }

  getBrightAction() {
    NativeModules.BrightModule.getBright((res) => {
      this.setState({
        brightValue: res
      })
    })
  }

  onSliderChange(e) {
      NativeModules.BrightModule.setBright(e + '')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB"
  },
  safeView: {
    flex: 1,
  },
  content: {
    flex: 1,
    // height: '100%',
  },
  bottomView: {
    height: px(100),
    flexDirection: 'row',
    // flex: 1
    // width: '100%'
  },
  menuButton: {
    flex: 1,
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuText: {
    fontSize: px(28),
    color: '#656E79',
    marginTop: px(10)
  },
  setButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  setText: {
    fontSize: px(28),
    color: '#656E79',
    marginTop: px(10)
  },
  modalContent: {
    height: '100%'
  },
  headModalView: {
    flex: 1
  },
  bottomModalView: {
    flexDirection: 'row',
    // backgroundColor: '#fff'
  },
  bottomContainer: {
    height: px(138),
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: "row"
  },
  setModalContent: {
    height: px(680),
    backgroundColor: '#fff'
  },
  lightSet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(60),
  },
  lightSetText: {
    marginLeft: px(30),
    marginRight: px(52),
    color: '#333333',
    fontSize: px(30)
  },
  lightSetImage: {
    marginRight: px(30),
    marginLeft: px(40)
  },
  wordSizeSet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(60)
  },
  wordSetButtons: {
    flexDirection: 'row',
    flex: 1
  },
  wordInfoText: {
    marginLeft: px(30),
    marginRight: px(52),
    color: '#333333',
    fontSize: px(30)
  },
  wordSetButtons: {
    flexDirection: 'row',
  },
  wordMinus: {
    width: px(264),
    height: px(70),
    backgroundColor: '#fff',
    borderRadius: px(35),
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: px(32),
    color: '#333333',
    borderColor: '#D8D8D8',
    borderWidth: px(1)
  },
  wordAdd: {
    width: px(264),
    height: px(70),
    backgroundColor: '#fff',
    marginLeft: px(40),
    borderRadius: px(35),
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: px(32),
    color: '#333333',
    borderColor: '#D8D8D8',
    borderWidth: px(1)
  },
  backgroundSetView: {
    marginTop: px(60),
    flexDirection:'row',
    alignItems: 'center'
  },
  backgroundText: {
    marginLeft: px(30),
    marginRight: px(52),
    color: '#333333',
    fontSize: px(30)
  },
  directionView: {
    marginTop: px(60),
    flexDirection: 'row',
    alignItems: 'center'
  },
  directionText: {
    marginLeft: px(30),
    marginRight: px(52),
    color: '#333333',
    fontSize: px(30)
  },
  directionButtonViews: {
    height: px(70),
    width: px(580),
    flexDirection: 'row',
  },
  oneDirectionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(0.5),
    borderColor: '#D8D8D8',
    borderBottomLeftRadius: px(35),
    borderTopLeftRadius: px(35),
    backgroundColor: '#FAFAFA'
  },
  twoDirectionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(0.5),
    borderColor: '#D8D8D8',
    borderBottomRightRadius: px(35),
    borderTopRightRadius: px(35),
    backgroundColor: '#FAFAFA'
  },
  lineButtonViews: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(60)
  },
  lineText: {
    marginLeft: px(30),
    marginRight: px(52),
    color: '#333333',
    fontSize: px(30)
  },
  lineButtons: {
    width: px(580),
    height: px(70),
    flexDirection: 'row',
    alignItems: 'center'
  },
  largeButton: {
    flex: 1,
    height: px(70),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(0.5),
    borderColor: '#D8D8D8',
    borderBottomLeftRadius: px(35),
    borderTopLeftRadius: px(35)
  },
  normalButton: {
    flex: 1,
    height: px(70),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(0.5),
    borderColor: '#D8D8D8',
  },
  smallButton: {
    flex: 1,
    height: px(70),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(0.5),
    borderColor: '#D8D8D8',
    borderBottomRightRadius: px(35),
    borderTopRightRadius: px(35)
  },
  colorButtons: { 
    width: px(76),
    height: px(76),
    borderRadius: px(38),
    marginRight: px(60),
    borderColor: '#D8D8D8',
    borderWidth: px(0.5)
  },
  headAd: {
    height: px(120),
    backgroundColor: 'blue'
  },
  bottomAd: {
    height: px(120),
  },
  readContent: {
    flex: 1,
    paddingVertical: px(20)
  },
  itemContent: {
    height: px(100),
    //   alignItems: "center"
    justifyContent: "center",
    paddingLeft: px(20)
  },
  chapterName: {
    color: "#656E79",
    fontSize: px(30)
  }
});

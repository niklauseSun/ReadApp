import React, { Component } from 'react'
import { Text, View, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Modal, Image, FlatList, ScrollView, DeviceEventEmitter, NativeModules, Platform, Dimensions, TextInput } from "react-native";
import { px } from '../utils'
import { ASSET_IMAGES } from '../config';
import { Slider, Toast } from '@ant-design/react-native'
import {
  getBookContent,
  getMenuList,
  getAd,
  getSetConfig,
  saveBookDetailList,
  saveSetConfig, 
  saveLocalMenuList,
  getLocalMenuList} from '../requests'
import { WebView } from 'react-native-webview';
import { Header, Hud, FooterView } from '../components'

import sc from './sc'
import tc from './tc'

const colorsBg = ['#fff','#EBD3D3', '#E4EFE1', '#CBECE9', '#D4DDEB', '#CFB9C2']

export default class BookContent extends Component {

  constructor(props) {
    super(props);

    const { articleid, chapterIndex = 0, chapterName="" } = props.navigation.state.params || {}

    this.state = {
      articleid: articleid,
      chapterid: null,
      chapterIndex: chapterIndex,
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
      bookContent: "",
      headUrl:null,
      bottomUrl: null,
      brightValue: 0.5,
      chapterName: chapterName,
      isLoading: false,
      menuList: [],
      start: -1,
      end: -1,
      records: -1,
      willReload: false,
      refresh: false,
      loadNext: false,
      showBottomAd: true,
      showHeadAd: true,
      readMode: true, // true 日间 false 夜间
      isSimple: true,
      pageIndex: 0,
      totalPage: 0,
      showInput: true,
      chapterInputValue: null,
    }

    this.loadNext = false;
    this.loadFirst = false;

    this.dayMode = '#D0B48C';
    this.nightMode = '#15100D';
    this.dayTextColor = '#2F1D06';
    this.nightTextColor = '#575446';
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    }, () => {
      Hud.show()
    })
    this.getBrightAction()
    // this.requestBookContent()
    // this.requestLocalMenuList()
    // this.requestMenuList()
    this.requestChapterId();
    this.requestHeadAd()
    this.requestBottomAd()
    this.getLocalConfig()
  }

  componentWillUnmount() {
    this.setState({
      isLoading: false
    })
    Hud.hidden();
  }

  render() {
    console.log('isSimple', this.state.isSimple)
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
    const htmlBottomContent = `<html><script type="text/javascript" charset="utf-8" src="${this.state.bottomUrl}"></script></html>`

    console.log('htmlContent', htmlContent)
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.state.readMode ? this.dayMode : this.nightMode
          }
        ]}
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={[
            styles.safeView,
            {
              backgroundColor: this.state.readMode
                ? this.dayMode
                : this.nightMode
            }
          ]}
        >
          {this.state.showHeadAd ? (
            <View style={styles.headAd}>
              {Platform.OS == "ios" ? (
                <WebView
                  source={{ html: htmlContent }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : this.state.headUrl == null ? null : (
                <WebView
                  // style={{
                  //   backgroundColor: this.state.readMode ? this.dayMode : this.nightMode
                  // }}
                  thirdPartyCookiesEnabled={true}
                  sharedCookiesEnabled={true}
                  source={{ html: androidContent }}
                  javaScriptEnabled={true}
                  injectedJavaScript={`document.write('<script src="${this.state.headUrl}"></script>')`}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showHeadAd: !this.state.showHeadAd
                  });
                }}
                style={{ position: "absolute", right: 10 }}
              >
                <Text>X</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={[
              styles.readContent,
              { backgroundColor: this.colorChange(this.state.colorIndex) }
            ]}
          >
            <ScrollView
              ref={view => {
                this.myScrollView = view;
              }}
              // contentContainerStyle={{ paddingBottom: 20}}
              onScroll={e => {
                return;
                console.log("onScroll", e.nativeEvent);

                const {
                  contentSize,
                  layoutMeasurement,
                  contentOffset
                } = e.nativeEvent;

                const _num =
                  contentSize.height -
                  layoutMeasurement.height -
                  contentOffset.y;

                console.log("_num", _num);
                if (
                  contentSize.height > layoutMeasurement.height &&
                  _num < -0.003
                ) {
                  console.log("loadNext");
                  this.loadNext = true;
                  return;
                }

                if (contentOffset.y < -0.003) {
                  console.log("load first");
                  this.loadFirst = true;
                  return;
                }
              }}
              onMomentumScrollEnd={e => {
                console.log("onScrollEnd", e.nativeEvent);
                var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
                var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
                var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
                console.log("onScrollEnd", offsetY);
                console.log(
                  "offset",
                  offsetY,
                  oriageScrollHeight,
                  contentSizeHeight
                );
                if (offsetY == 0) {
                  // 向上移动

                  // if (!this.loadFirst) {
                  //   return;
                  // }
                  if (this.state.chapterIndex == 0) {
                    // this.loadFirst = false;
                    return;
                  }
                  if (this.state.chapterIndex <= this.state.start - 1) {
                    this.setState(
                      {
                        chapterIndex: this.state.chapterIndex - 1,
                        willReload: true
                      },
                      () => {
                        this.requestHeadMenuList();
                      }
                    );
                  } else {
                    const { chapterid, chaptername } = this.state.menuList[
                      this.state.chapterIndex - this.state.start
                    ];
                    this.setState(
                      {
                        chapterid: chapterid,
                        chapterName: chaptername,
                        chapterIndex: this.state.chapterIndex - 1,
                        showBottomAd: true,
                        showHeadAd: true
                      },
                      () => {
                        this.updateBookDetailList();
                        this.requestBookContent(true);
                        this.scrollToTopView();
                      }
                    );
                  }
                  // this.loadFirst = false;
                }
                if (
                  Math.floor(offsetY + oriageScrollHeight) >=
                  Math.floor(contentSizeHeight)
                ) {
                  console.log(
                    "offset",
                    offsetY,
                    oriageScrollHeight,
                    contentSizeHeight
                  );

                  if (this.state.chapterIndex >= this.state.records - 1) {
                    Toast.info("已经阅读完毕！");
                    return;
                  }

                  if (this.state.chapterIndex + 1 >= this.state.end - 1) {
                    this.setState(
                      {
                        chapterIndex: this.state.chapterIndex + 1,
                        willReload: true
                      },
                      () => {
                        this.requestBottomMenuList();
                      }
                    );
                  } else {
                    console.log("dddddfff");
                    const { chapterid, chaptername } = this.state.menuList[
                      this.state.chapterIndex + 2 - this.state.start
                    ];
                    this.setState(
                      {
                        chapterid: chapterid,
                        chapterName: chaptername,
                        chapterIndex: this.state.chapterIndex + 1,
                        showBottomAd: true,
                        showHeadAd: true
                      },
                      () => {
                        this.updateBookDetailList();
                        this.requestBookContent(true);
                        this.scrollToTopView();
                        // this.loadNext = false;
                      }
                    );
                  }
                  // this.loadNext = false;
                }
              }}
              style={{
                flex: 1,
                paddingHorizontal: 20,
                backgroundColor: this.colorChange(this.state.colorIndex)
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  backgroundColor: this.colorChange(this.state.colorIndex)
                }}
                onPress={() => {
                  this.setState({
                    bottomModal: !this.state.bottomModal
                  });
                }}
                style={styles.content}
              >
                <Text
                  style={{
                    fontSize: this.state.contentFontSize,
                    lineHeight: this.state.contentLineHeight,
                    backgroundColor: this.colorChange(this.state.colorIndex),
                    color: this.state.readMode
                      ? this.dayTextColor
                      : this.nightTextColor
                  }}
                >
                  {"\n\n" +
                    this.convertStr(
                      this.state.bookContent,
                      this.state.isSimple
                    ) +
                    "\n\n\n\n"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          {this.state.showBottomAd ? (
            <View style={styles.bottomAd}>
              {Platform.OS == "ios" ? (
                <WebView
                  source={{ html: htmlBottomContent }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : this.state.bottomUrl == null ? null : (
                <WebView
                  // style={{
                  //     backgroundColor: this.state.readMode ? this.dayMode : this.nightMode
                  // }}
                  thirdPartyCookiesEnabled={true}
                  sharedCookiesEnabled={true}
                  source={{ html: androidContent }}
                  javaScriptEnabled={true}
                  injectedJavaScript={`document.write('<script src="${this.state.bottomUrl}"></script>')`}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showBottomAd: !this.state.showBottomAd
                  });
                }}
                style={{ position: "absolute", right: 10 }}
              >
                <Text>X</Text>
              </TouchableOpacity>
            </View>
          ) : null}
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
                  });
                }}
                style={styles.headModalView}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        bottomModal: false
                      },
                      () => {
                        this.props.navigation.goBack();
                      }
                    );
                  }}
                >
                  <Header
                    backColor={
                      this.state.readMode ? this.dayMode : this.nightMode
                    }
                    title={this.state.chapterName}
                    textColor={
                      this.state.readMode
                        ? this.dayTextColor
                        : this.nightTextColor
                    }
                    showBackButton={true}
                    navigation={this.props.navigation}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              <View
                style={[
                  styles.bottomModalView,
                  {
                    backgroundColor: this.state.readMode
                      ? this.dayMode
                      : this.nightMode
                  }
                ]}
              >
                <View
                  style={[
                    styles.bottomContainer,
                    {
                      backgroundColor: this.state.readMode
                        ? this.dayMode
                        : this.nightMode
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        bottomModal: !this.state.bottomModal,
                        menuListModal: !this.state.menuListModal
                      });
                      // this.flatList.scrollToIndex({ index: this.state.chapterid})
                    }}
                    activeOpacity={0.7}
                    style={styles.menuButton}
                  >
                    <Image source={ASSET_IMAGES.ICON_MENU_BUTTON} />
                    <Text
                      style={[
                        styles.menuText,
                        {
                          color: this.state.readMode
                            ? this.dayTextColor
                            : this.nightTextColor
                        }
                      ]}
                    >
                      目录
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        bottomModal: !this.state.bottomModal,
                        setModal: !this.state.setModal
                      });
                    }}
                    activeOpacity={0.7}
                    style={styles.setButton}
                  >
                    <Image source={ASSET_IMAGES.ICON_CONTENT_SET_BUTTON} />
                    <Text
                      style={[
                        styles.setText,
                        {
                          color: this.state.readMode
                            ? this.dayTextColor
                            : this.nightTextColor
                        }
                      ]}
                    >
                      设置
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showInput}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.setState({
                  showInput: false
                });
              }}
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={e => {
                  // console.log("test", e);
                }}
                style={{
                  width: px(400),
                  height: px(280),
                  backgroundColor: "#fff",
                  alignItems: "center",
                  borderRadius: px(20)
                }}
              >
                <Text style={{ marginTop: px(40), color: "gray" }}>
                  请输入需要跳转的章节
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: px(40)
                  }}
                >
                  <TextInput
                    value={this.state.chapterInputValue}
                    onChangeText={(text) => {
                      this.setState({
                        chapterInputValue: text
                      })
                    }}
                    style={{
                      width: px(120),
                      height: px(50),
                      borderColor: "gray",
                      borderWidth: px(1),
                      borderRadius: px(10)
                    }}
                  />
                  <Text> / {this.state.records}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: px(50)
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showInput: false
                      });
                       if (this.state.chapterInputValue != null && !isNaN(this.state.chapterInputValue)) {
                        //  alert("test");
                        this.setState({
                          chapterIndex: this.state.chapterInputValue
                        }, () => {
                          this.requestChapterId()
                        })
                       }
                    }}
                    style={{
                      flex: 1,
                      alignItems: "center"
                    }}
                  >
                    <Text>确认</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showInput: false
                      });
                    }}
                    style={{
                      flex: 1,
                      alignItems: "center"
                    }}
                  >
                    <Text>取消</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {/* 目录 */}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.menuListModal}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <SafeAreaView
                style={{
                  backgroundColor: this.state.readMode
                    ? this.dayMode
                    : this.nightMode,
                  width: "80%",
                  height: "100%"
                }}
              >
                <View
                  style={{
                    height: px(80),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%"
                  }}
                >
                  <TouchableOpacity onPress={() => {
                    this.setState({
                      showInput: true,
                      menuListModal: false
                    })
                  }}>
                    <Text>跳转章节</Text>
                  </TouchableOpacity>
                </View>
                {
                  <FlatList
                    contentContainerStyle={{
                      backgroundColor: this.state.readMode
                        ? this.dayMode
                        : this.nightMode
                    }}
                    ref={view => {
                      this.flatList = view;
                    }}
                    initialScrollIndex={
                      this.state.chapterIndex - this.state.start + 1
                    }
                    getItemLayout={(data, index) => ({
                      length: px(100),
                      offset: px(75) * index,
                      index
                    })}
                    ListFooterComponent={<FooterView />}
                    data={this.state.menuList}
                    onEndReached={this.requestBottomMenuList.bind(this)}
                    onEndReachedThreshold={0.1}
                    refreshing={this.state.refresh}
                    onRefresh={this.requestHeadMenuList.bind(this)}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            const {
                              chapterid,
                              chaptername,
                              chapterorder
                            } = item;
                            console.log("item", item, chapterid);
                            this.setState(
                              {
                                chapterIndex: chapterorder - 1,
                                chapterid: chapterid,
                                menuListModal: false,
                                chapterName: chaptername,
                                showBottomAd: true,
                                showHeadAd: true
                              },
                              () => {
                                console.log("updateBookDetailList");
                                this.scrollToTopView();
                                this.requestBookContent(true);
                                this.updateBookDetailList();
                              }
                            );
                          }}
                          style={styles.itemContent}
                        >
                          <Text
                            style={[
                              styles.chapterName,
                              {
                                color:
                                  index ==
                                  this.state.chapterIndex - this.state.start + 1
                                    ? "red"
                                    : "#656E79",
                                fontWeight:
                                  index ===
                                  this.state.chapterIndex - this.state.start + 1
                                    ? "bold"
                                    : "normal"
                              }
                            ]}
                          >
                            {item.chaptername}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                }
                <View
                  style={{
                    height: px(80),
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: px(20)
                    }}
                  >
                    章节 {this.state.chapterIndex + 1}/{this.state.records}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginRight: px(20)
                    }}
                    onPress={() => {
                      this.flatList.scrollToOffset({
                        animated: true,
                        y: 0
                      });
                    }}
                  >
                    <Text>返回顶部</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.setState({
                    bottomModal: false,
                    menuListModal: false
                  });
                }}
                style={{
                  justifyContent: "center",
                  height: "100%",
                  width: "20%"
                }}
              >
                <View>
                  <Image source={ASSET_IMAGES.ICON_ARROW_LEFT} />
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* 设置 */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.setModal}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
            }}
          >
            <SafeAreaView style={styles.modalContent}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.setState({
                    setModal: !this.state.setModal,
                    bottomModal: false
                  });
                }}
                style={styles.headModalView}
              ></TouchableOpacity>
              <View
                style={[
                  styles.setModalContent,
                  {
                    backgroundColor: this.state.readMode
                      ? this.dayMode
                      : this.nightMode
                  }
                ]}
              >
                <View style={styles.lightSet}>
                  <Text
                    style={[
                      styles.lightSetText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    亮度
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      onChange={this.onSliderChange.bind(this)}
                      value={this.state.brightValue}
                    />
                  </View>
                  <Image
                    style={styles.lightSetImage}
                    source={ASSET_IMAGES.ICON_BRIGHT}
                  />
                </View>
                <View style={styles.wordSizeSet}>
                  <Text
                    style={[
                      styles.wordInfoText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    字号
                  </Text>
                  <View style={styles.wordSetButtons}>
                    <TouchableOpacity
                      onPress={this.wordMinusAction.bind(this)}
                      activeOpacity={0.7}
                      style={styles.wordMinus}
                    >
                      <Text style={styles.wordMinusText}>A-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.wordAddAction.bind(this)}
                      activeOpacity={0.7}
                      style={styles.wordAdd}
                    >
                      <Text style={styles.wordAddText}>A+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.directionView}>
                  <Text
                    style={[
                      styles.directionText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    简繁体{" "}
                  </Text>
                  <View style={styles.directionButtonViews}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.oneDirectionButton,
                        {
                          backgroundColor: this.state.isSimple
                            ? "#999"
                            : "#FAFAFA"
                        }
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            isSimple: true
                          },
                          () => {
                            this.updateConfig();
                          }
                        );
                      }}
                    >
                      <Text style={styles.oneDirectionText}>简体</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.twoDirectionButton,
                        {
                          backgroundColor: !this.state.isSimple
                            ? "#999"
                            : "#FAFAFA"
                        }
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            isSimple: false
                          },
                          () => {
                            this.updateConfig();
                          }
                        );
                      }}
                    >
                      <Text style={styles.twoDirectionText}>繁体</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.backgroundSetView}>
                  <Text
                    style={[
                      styles.backgroundText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    背景
                  </Text>
                  <FlatList
                    data={[
                      this.state.readMode ? this.dayMode : this.nightMode,
                      "#FFFFFF",
                      "#EBD3D3",
                      "#E4EFE1",
                      "#CBECE9",
                      "#D4DDEB",
                      "#CFB9C2"
                    ]}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState(
                              {
                                colorIndex: index
                              },
                              () => {
                                this.updateConfig();
                              }
                            );
                          }}
                          style={[
                            { backgroundColor: item },
                            styles.colorButtons
                          ]}
                        ></TouchableOpacity>
                      );
                    }}
                  />
                </View>
                <View style={styles.directionView}>
                  <Text
                    style={[
                      styles.directionText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    阅读模式
                  </Text>
                  <View style={styles.directionButtonViews}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.oneDirectionButton,
                        {
                          backgroundColor: this.state.readMode
                            ? "#999"
                            : "#FAFAFA"
                        }
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            readMode: true
                          },
                          () => {
                            this.updateConfig();
                          }
                        );
                      }}
                    >
                      <Text style={styles.oneDirectionText}>日间</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.twoDirectionButton,
                        {
                          backgroundColor: !this.state.readMode
                            ? "#999"
                            : "#FAFAFA"
                        }
                      ]}
                      onPress={() => {
                        this.setState(
                          {
                            readMode: false
                          },
                          () => {
                            this.updateConfig();
                          }
                        );
                      }}
                    >
                      <Text style={styles.twoDirectionText}>夜间</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.lineButtonViews}>
                  <Text
                    style={[
                      styles.lineText,
                      {
                        color: this.state.readMode
                          ? this.dayTextColor
                          : this.nightTextColor
                      }
                    ]}
                  >
                    间距
                  </Text>
                  <View style={styles.lineButtons}>
                    <TouchableOpacity
                      onPress={this.lineHeightChangeAction.bind(this, 0)}
                      activeOpacity={0.7}
                      style={styles.largeButton}
                    >
                      <Text
                        style={{
                          color: this.state.readMode
                            ? this.dayTextColor
                            : this.nightTextColor
                        }}
                      >
                        变大
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.lineHeightChangeAction.bind(this, 1)}
                      activeOpacity={0.7}
                      style={styles.normalButton}
                    >
                      <Text
                        style={{
                          color: this.state.readMode
                            ? this.dayTextColor
                            : this.nightTextColor
                        }}
                      >
                        正常
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.lineHeightChangeAction.bind(this, 2)}
                      activeOpacity={0.7}
                      style={styles.smallButton}
                    >
                      <Text
                        style={{
                          color: this.state.readMode
                            ? this.dayTextColor
                            : this.nightTextColor
                        }}
                      >
                        变小
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }

  // request
  requestBookContent(showLoading = false) {

    if (showLoading) {
      if (!this.state.isLoading) {
        this.requestBottomAd()
        this.requestHeadAd()
        this.setState({
          isLoading: true,
        }, ()=> {
          Hud.show()
        })
      }
    }

    const data = {
      callback: this.requestBookContentCallback.bind(this),
      chapterid: this.state.chapterid,
      articleid: this.state.articleid
    }
    getBookContent(data)
  }

  requestBookContentCallback(res) {
    Hud.hidden();
    const { data, state } = res;
    if (state == 1) {
      this.setState({
        bookContent: data.Content,
        isLoading: false,
      })
    }
  }

  requestMenuList() {
    const pageIndex = Math.floor(this.state.chapterIndex / 10) + 1;
    const data = {
      pageIndex: pageIndex,
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

  requestHeadMenuList() {

    const { start } = this.state;

    if (start > 10) {
      const pageIndex = Math.floor((start - 10) / 10) + 1

      const requestData = {
        pageIndex: pageIndex,
        pageSize: 10,
        articleid: this.state.articleid,
        callback: this.requestHeadMenuListCallback.bind(this)
      }
      getMenuList(requestData)
    }

  }

  requestHeadMenuListCallback( res) {
    const { data, state } = res;
    if (state == 1) {
      this.setState({
          menuList: [...data, ...this.state.menuList],
          start: data[0].chapterorder,
      }, () => {
          if (this.state.willReload) {
            const item = this.state.menuList[this.state.chapterIndex - this.state.start + 1];
            const { chaptername, chapterid } = item;
            this.setState(
              {
                chapterName: chaptername,
                chapterid: chapterid,
                willReload: false,
              },
              () => {
                this.updateBookDetailList();
                this.requestBookContent(true);
                this.scrollToTopView();
              }
            );
          }
      })
    }
  }

  requestBottomMenuList() {
    console.log('requestBottomMenuList', this.state)

    const { end, records } = this.state;

    if (end < records) {
        const pageIndex = Math.floor(end / 10) + 1;

        const requestData = {
          pageIndex: pageIndex,
          pageSize: 10,
          articleid: this.state.articleid,
          callback: this.requestBottomMenuListCallback.bind(this)
        }
        getMenuList(requestData);
    } else {
      return;
    }
  }

  requestBottomMenuListCallback(res) {
    
    const { data, state } = res;
    if (state == 1) {
      this.setState({
          menuList: [...this.state.menuList, ...data],
          end: data[data.length -1].chapterorder,
      }, () => {

        if (this.state.willReload) {
          const item = this.state.menuList[this.state.chapterIndex - this.state.start + 1];
          const { chaptername, chapterid } = item;

          this.setState({
            chapterName: chaptername,
            chapterid: chapterid,
            willReload: false,
          }, () => {
            this.updateBookDetailList()
            this.requestBookContent(true)
            this.scrollToTopView()
          })
        }
      })
    }
  }

  requestChapterId() {
    console.log('requestChapterId')
    const pageIndex = Math.floor(this.state.chapterIndex / 10) + 1;
    const data = {
      pageIndex: pageIndex,
      pageSize: 10,
      articleid: this.state.articleid,
      callback: this.requestChapterIdCallback.bind(this)
    }
    getMenuList(data)
  }

  requestChapterIdCallback(res) {
    console.log('res', res)
    const { data, state, page } = res;
    if (state == 1) {
      console.log('data', this.state.chapterIndex % 10, data[this.state.chapterIndex % 10])
      const { chapterid = null, chaptername = "" } = data[this.state.chapterIndex % 10];

      const { start, end } = this.state;
      if (start == -1 && end == -1) {
        const { records } = page
        this.setState({
            start: data[0].chapterorder,
            end:data[data.length -1].chapterorder,
            menuList:data,
            records: records,
        })
      }
      if (chapterid != null) {
        this.setState({
          chapterid: chapterid,
          chapterName: chaptername
        }, () => {
          this.requestBookContent()
        })
      }
    }
  }

  requestFullMenuListCallback(res) {
    const { data, state } = res;
    if (state == 1) {
      this.setState({
        charterList: data,
      })

      saveLocalMenuList({
        articleid: this.state.articleid,
        menuList: data
      })
    }
  }

  requestLocalMenuList() {
    const data = {
      articleid: this.state.articleid,
      callback: this.requestLocalMenuListCallback.bind(this)
    }

    getLocalMenuList(data)
  }

  requestLocalMenuListCallback(res) {
    const { error, data } = res;
    if (error == null) {
      this.setState({
        charterList: data,
      })
    }
  }

  requestHeadAd() {
    const data = {
      callback: this.requestHeadAdCallback.bind(this),
      adType: 2
    }
    getAd(data)
  }

  requestHeadAdCallback(res) {
    const { state, data } = res;
    console.log('requestHeadAd', data)
    if (state == 1) {
      this.setState({
        headUrl: data.Url,
      })
    }
  }

  requestBottomAd() {
    const data = {
      callback: this.requestBottomAdCallback.bind(this),
      adType: 2
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
        if (this.state.readMode) {
          return this.dayMode
        } else {
          return this.nightMode
        }
      case 1:
        return '#FFFFFF';
      case 2:
        return '#EBD3D3'
      case 3:
        return '#E4EFE1'
      case 4:
        return '#CBECE9'
      case 5:
        return '#D4DDEB'
      case 6:
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
        isSimple = true,
        readMode = true
      } = data;
      this.setState({
        colorIndex: colorIndex,
        contentFontSize: contentFontSize,
        contentLineHeight: contentLineHeight,
        isSimple: isSimple,
        readMode: readMode
      })
    }
  }

  updateConfig() {
    const data = {
      colorIndex: this.state.colorIndex,
      contentFontSize: this.state.contentFontSize,
      contentLineHeight: this.state.contentLineHeight,
      isSimple: this.state.isSimple,
      readMode: this.state.readMode
    }
    saveSetConfig({ data });
  }

  updateBookDetailList() {

    if (global.bookDetailList.length == 0) {
      return;
    }

    const detail = global.bookDetailList[0];
    detail.nowDate = new Date();
    detail.chapterIndex = this.state.chapterIndex
    global.bookDetailList[0] = detail

    console.log('global', global.bookDetailList)

    saveBookDetailList({ data: global.bookDetailList })
    DeviceEventEmitter.emit("updateBookListEmit");
  }

  scrollToTopView() {
    this.myScrollView.scrollTo({
      x: 0,
      y: 0,
      animated: false
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

  convertStr(str, simple) {
    if (simple) {
      return str;
    }
    var ret = "", i, len, idx;
    str = str || this;
    for (i = 0, len = str.length; i < len; i++) {
      idx = sc.indexOf(str.charAt(i));
      ret += (idx === -1) ? str.charAt(i) : tc.charAt(idx);
    }
    return ret;
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
    height: px(820),
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
    width: px(380),
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
  },
  bottomAd: {
    height: px(120),
  },
  readContent: {
    flex: 1,
  },
  itemContent: {
    height: px(75),
    //   alignItems: "center"
    justifyContent: "center",
    paddingLeft: px(20)
  },
  chapterName: {
    color: "#656E79",
    fontSize: px(30)
  }
});

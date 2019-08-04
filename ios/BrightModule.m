//
//  BrightModule.m
//  ReadApp
//
//  Created by 孙玉建 on 2019/8/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BrightModule.h"
#import <UIKit/UIKit.h>
#import <UIKit/UIScreen.h>
#import <React/RCTLog.h>

@implementation BrightModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getBright:(RCTResponseSenderBlock)callback)
{
  CGFloat currentLight = [[UIScreen mainScreen] brightness];
  
  callback(@[@(currentLight)]);
}

RCT_EXPORT_METHOD(setBright:(NSString * )brightValue {
  RCTLog(@"brightValue %@", brightValue);
  
  CGFloat number = [brightValue floatValue];
  
  [[UIScreen mainScreen] setBrightness: number];
})

@end

package com.readapp.NativeModules;
import android.content.ContentResolver;
import android.provider.Settings;
import android.view.WindowManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.logging.Handler;

public class BrightModule extends ReactContextBaseJavaModule {

    public BrightModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BrightModule";
    }

    @ReactMethod
    public void getBright(final Callback callback) {
        float value = 0;
        ContentResolver cr = this.getCurrentActivity().getContentResolver();

        try {
            value = Settings.System.getFloat(cr, Settings.System.SCREEN_BRIGHTNESS);
        } catch (Exception e) {

        }

        callback.invoke(value / 227);
    }

    @ReactMethod
    public void setBright(String bright) {

        WindowManager.LayoutParams params = getReactApplicationContext().getCurrentActivity().getWindow().getAttributes();
        params.screenBrightness = 0.1f;
        getCurrentActivity().getWindow().setAttributes(params);
        this.getReactApplicationContext().getCurrentActivity().getWindow().setAttributes(params);
//        float number = Float.parseFloat(bright);
//
//        WindowManager.LayoutParams lp = this.getReactApplicationContext().getCurrentActivity().getWindow().getAttributes();
//
//        lp.screenBrightness = Float.valueOf(number) * (1f / 255f);
//        Log.d("lxy", "set  lp.screenBrightness == " + lp.screenBrightness);
//        this.getReactApplicationContext().getCurrentActivity().getWindow().setAttributes(lp);
    }
}

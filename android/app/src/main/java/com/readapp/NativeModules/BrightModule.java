package com.readapp.NativeModules;
import android.app.Activity;
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
        float number = Float.parseFloat(bright);

        final Activity activity = getCurrentActivity();
        if (activity == null) {
            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
                lp.screenBrightness = number *255f;
                activity.getWindow().setAttributes(lp);
            }
        });

//        float number = Float.parseFloat(bright);
//
//        WindowManager.LayoutParams lp = this.getReactApplicationContext().getCurrentActivity().getWindow().getAttributes();
//
//        lp.screenBrightness = Float.valueOf(number) * (1f / 255f);
//        Log.d("lxy", "set  lp.screenBrightness == " + lp.screenBrightness);
//        this.getReactApplicationContext().getCurrentActivity().getWindow().setAttributes(lp);
    }
}

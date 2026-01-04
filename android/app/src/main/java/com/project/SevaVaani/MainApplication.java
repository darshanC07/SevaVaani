package com.project.SevaVaani;

import android.app.Application;
import android.content.res.Configuration;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactHost;
import com.facebook.react.common.ReleaseLevel;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.ReactNativeApplicationEntryPoint;

import java.util.List;

import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost reactNativeHost = new ReactNativeHostWrapper(
      this,
      new DefaultReactNativeHost(this) {
        @Override
        public List<ReactPackage> getPackages() {
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        public String getJSMainModuleName() {
          return ".expo/.virtual-metro-entry";
        }

        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        public boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }
      }
  );

  @Override
  public ReactNativeHost getReactNativeHost() {
    return reactNativeHost;
  }

  @Override
  public ReactHost getReactHost() {
    return ReactNativeHostWrapper.createReactHost(getApplicationContext(), reactNativeHost);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    try {
      DefaultNewArchitectureEntryPoint.setReleaseLevel(
          ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.toUpperCase())
      );
    } catch (IllegalArgumentException e) {
      DefaultNewArchitectureEntryPoint.setReleaseLevel(ReleaseLevel.STABLE);
    }
    ReactNativeApplicationEntryPoint.loadReactNative(this);
    ApplicationLifecycleDispatcher.onApplicationCreate(this);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
  }
}

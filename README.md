# TheApp

This is a cross-platform test application used primarily to expose views useful for showcasing
Appium automation features.

Release versions are available at the Releases section of this repo.

## Building locally

First, make sure you have the various React Native prerequisites ready to go (like Ruby, Gem,
Bundler, Pod, etc... for iOS, Android Studio and tools for Android, etc...).

Then install deps:

```bash
npm install
pod install --project-directory=ios
```

Now you can `npm start` which will start the JS bundler.

### Build/launch the iOS app

```
npx react-native run-ios
```

### Build/launch the Android app

```
npx react-native run-android --appId=com.appiumpro.the_app --main-activity=com.appiumpro.the_app.MainActivity
```

### Build the iOS app in release mode

Note this is not how to build an `.ipa` file (that requires signing and provisioning profiles).
This just builds the `.app` which can be run on the simulator but with the JS bundle in it.

```
npx react-native run-ios --configuration Release
```

The `.app` will be put in the Derived Data path (right-click on the output in the Xcode file viewer
and you will be able to view it in the Finder).

### Build the Android apk for release

```
cd android
./gradlew assembleRelease
# install and test the app
adb install -r ./app/build/outputs/apk/release/app-release.apk
```

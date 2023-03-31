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

### Build the Android apk for release

```
cd android
./gradlew assembleRelease
# install and test the app
adb install -r ./app/build/outputs/apk/release/app-release.apk
```

# TheApp

This is a cross-platform test application used primarily to expose views useful for showcasing
Appium automation features. There is also a test suite for the application the demonstrates good
Appium testing practices. See the [CI](CI.md) doc for a writeup on the most salient features of the
test suite and how CI is achieved for this app.

Release versions of TheApp (typicall as `.apk` and `.app.zip` are available at the
[Releases](https://github.com/appium-pro/TheApp/releases) section of this repo.

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
npx react-native run-ios --mode Release
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

## Testing

You can run Appium tests locally on a running Android emulator or iOS simulator, after having first
built the apps. Make sure you have an Appium 2.x server running with the XCUITest and UiAutomator2
drivers installed, then you can kick off a suite for either platform:

```bash
IOS=1 npm test     # run iOS suite
ANDROID=1 npm test # run Android suite
```

See the [CI](CI.md) documentation for a fuller description of how the test suite is designed and
implemented according to good Appium testing practices.

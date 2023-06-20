# Testing and CI

This repo comes with an example of a test framework, a set of tests, and a set of scripts that
enable the app to be built and tested on a pull request or a push to the repo. I've designed this
(admittedly small, toy-size) framework to embody what I believe are current best practices for
Appium automation.

The main difference here between this project and what I would expect to see in the testing orbit
of an actual app is that in this project we have 100% Appium tests. In general having 100% end to
end tests is not recommended. This app exists purely for the purpose of having Appium examples,
however, so I did not spend any time writing lower level tests or checks for the app itself, e.g.,
attempt to do whatever is the current recommendation for unit testing of React Native apps.

## The test framework

The framework here is "home grown", i.e., written mostly from scratch so as to be very transparent.
In almost all cases, your app's custom behaviour will mean that maintaining a test framework of
your own will be important, to facilitate common tasks as well as make it easy to read test code.

"Framework" is a sometimes vague term. What I mean is the collection of 3rd party and in-house
tools and utilities that meet needs or purposes like these:

- Test running
- Test reporting
- Assertions on app state
- Test code architecture and code relationships
- Appium session configuration and starting
- Appium client/server communication
- Encapsulation of useful reusable automation primitives
- Encapsulation of view information

For this test framework, I am using [Mocha](https://mochajs.org) for test running and reporting,
and [WebdriverIO](https://webdriver.io) as the Appium client. To get nice assertion formatting I'm
using [Expect](https://jestjs.io/docs/expect). Everything else is written here in TypeScript.

Note that everything here could be (more or less) easily reimplemented in another language than
JS/TypeScript. The overall structure is language agnostic.


### Organization and architecture

There are a few main components of this test framework, which I'll go into in more detail below:

1. Environment/session setup (managed by [`caps.ts`](test/caps.ts)
1. Test helpers and utilities, sometimes called 'fixtures' in some libraries (in
   [`util.ts`](test/util.ts)
1. View models ("page object models") (in [`test/views`](test/views)), which depend on...
1. A base view model that defines commonly used behaviours and view helpers
1. The test cases themselves ([`*.test.ts`](test/))

The overall goal is for the test cases to be simple, readable at a high level, scalable,
maintainable, and cross-platform. Here is an example of a positive and negative test case for the
login feature of TheApp to illustrate what I mean:

```typescript
describe('UI-based login', () => {
  const harness = testHarness();
  it('should log in with correct username and password', async () => {
    const {home} = harness;
    const loginScreen = await home.navToLogin();
    const secret = await loginScreen.login(USER, PW);
    expect(await secret.getLoggedInUser()).toEqual(USER);
  });
  it('should fail to log in with bad username or password', async () => {
    const {home} = harness;
    const loginScreen = await home.navToLogin();
    await loginScreen.login(BAD_USER, BAD_PW);
    await loginScreen.handleInvalidLoginAlert();
  });
});
```

With the exception of the lines involving the test "harness" (explained below), what we have is
a completely semantically transparent representation of what the user is doing. In the positive
case, the user navigates to the login screen, and attempts to login using their username and
password. We verify that this happened as expected. We're dealing with high-level view/page objects
that map to user intentions rather than to low level behaviours (looking for elements, tapping,
etc...).

The advantages of an approach like this, which separate the concerns of navigating the app from the
perspective of user intention, and implementing those inteionts, are many, and have been well
documented in many places! I can't imagine trying to maintain a large test suite that doesn't use
these or similar practices.

### Test environments and session configuration

Because TheApp is a cross-platform app, the test suite needs to be run for both Android and iOS,
ideally without any change to the test code itself. It is the same app, after all. (Some apps with
vastly different designs across both platforms might be better off with separate test suites).
I also want to be able to run the tests both locally and on a cloud provider (in my case,
[HeadSpin](https://headspin.io)). I also want the ability to run on both virtual and real devices.
All of these configuration options create a set of 2^3 (=8) possibilities for test environments.
(Well, actually 6, since when running on HeadSpin we are using real devices only, not virtual
devices).

I decided to capture these possibilities by using environment variables as parameters to the test
run. Environment variables are nice because they can be set easily in a CI environment as well as
a local environment.

All session configuration parameters and defaults are read in [`caps.ts`](test/caps.ts). It reads
the environment variables and stores them in project-wide constants that can be used anywhere in
the testsuite. If I want to run the Android suite locally, I would simply run something like this:

```bash
ANDROID=1 npm test
```

(I could have used an environment variable `PLATFORM` instead, and done `PLATFORM=android` or
`PLATFORM=ios`, but for convenience I chose `ANDROID=1` or `IOS=1`. It really doesn't matter much.)

For certain environments, extra parameters are required:

- HeadSpin tests require a HeadSpin API key which should not be stored in the codebase
- HeadSpin tests require an application ID representing a previously uploaded app build
- I want the ability to provide a dynamically generated build ID to HeadSpin, based on a git hash
or something else
- I want the ability to turn on a 'debug' mode which will spit out all kinds of helpful logging

All of these test suite options are also specified by environment variables.

Once the environment variables are ingested and assertions are made on their sensibility, the main
job of `caps.ts` is to construct the appropriate set of capabilities to start an Appium session of
the desired kind! And that's about it for session configuration.

### Test helpers / fixtures

In [`util.ts`](test/util.ts), the main item to have a look at is the
`testHarness` method. The job of this method is to encapsulate the responsibilities of starting
a session, ending a session, and reporting the pass/fail status of the session to HeadSpin if we're
running tests remotely. Because of the way JavaScript and Mocha work, we can't easily return
a value from this method to represent the newly started session. Instead we have to return an
object which will be populated with a member field representing the session by the time our test
code is executed. So a typical test structure would look something like this:

```typescript
describe('a thing', () => {
  const harness = testHarness();
  it('should work', async () => {
    const {home} = harness;
  });
});
```

We kick off the new session via the call to `testHarness`, but don't actually access the `home`
view object until we're inside our test where we know that the new session request has been
successful in the `beforeEach` we invoked via `testHarness`.

The other important thing to note about `testHarness` is that it "returns" both the Appium driver
object (in case we need it) and (more importantly) the view object representing where the user
begins at the session start (the home view). This means we can start using the home view object and
its methods in our tests, right away.

### The base view object model

The [`BaseView`](test/views/BaseView.ts) class is in many ways the core of the whole test
framework. It sets the patterns for view objects (usually called "page objects") to describe views
and implement low level interactions while providing a user-level interface for use in test code.
A base model like this can be developed in many ways, and a huge variety of opinions can validly be
used to drive that development. Here are some of the features/opinions I chose to implement in my
base model (the file itself is worth a read through to understand more fully).

#### Convenience methods for common WebdriverIO tasks

An extremely common pattern in Appium tests is to wait for an element and then do something with it
(tap, send keys, etc...). In WebdriverIO (our Appium client), waiting for and tapping an element
would normally be 3 lines of code:

```typescript
const element = await driver.$(selector);
await element.waitForExist({timeout});
await element.click();
```

It's just 3 lines, but repeated throughout all of our view objects it starts to add up. Instead,
I implemented helper methods like `find`, `click`, `sendKeys`, `text`, and so on, to give us quick
access to these common methods. Our view objects could write a single line instead of the three
above:

```typescript
await this.click(selector);
```

Creating framework-specific helpers like these also give us the ability to fine-tune our test suite
in terms of, for example, wait timeouts and strategies. I decided that for my app, I might need
a short, medium, and long wait, defined by certain millisecond values. So I encoded these as an
enum:

```typescript
export enum Wait {
  SHORT = 3000,
  DEFAULT = 5000,
  LONG = 20000,
}
```

Now all my helpers can optionally take `Wait` values as parameters, so specific elements that
I know might take shorter or longer than the default time can be adjusted accordingly:

```typescript
// click something after a network download that might take a while
await this.click(selector, Wait.LONG);
```

Other non-element related convenience methods can also be helpful. I included a `scroll` method so
that I could easily scroll until an element is found. (Currently, the logic for scrolling until an
element is found is only in one view, but if I needed it in multiple places, I would bring it into
the base view).

#### Helpers for cross-platform selectors

One of the main jobs of a view object is to hide element selector information from tests. So part
of what a view object needs to do is organize and store this selector information. It's a bit
tricky with a cross-platform app like mine, since it's often the case that a selector that works to
find an element on Android will not work on iOS, and vice versa. So one thing we need is some kind
of feature for view objects that will return the correct selector based on the platform the view
object was instantiated for. As far as possible, we don't want to have `if iOS then ... else ...`
logic in our view objects.

Another thing we need is to account for the fact that some selectors are static and some are
dynamic. What I mean by this is that some selectors never change (like a login button with the
accessibility id `loginBtn`), and some are parametric (like a selector that is generated based on
some dynamic information we know, for example a username).

The way I modeled this in my framework is to say that a selector can be either a string (static) or
a function which returns a string (dynamic).

Here's how it all works: view objects can define one or more of three static variables: `S`,
`S_IOS`, and `S_ANDROID`. These are maps of selector names to selectors. Anything in `S` will be
used if the same name doesn't exist in `S_IOS` or `S_ANDROID`. So it is the default place for
selectors that are not platform-specific. Any time we want to override what's in `S`, or otherwise
indicate that a selector is just for a given platform, we put it on `S_IOS` or `S_ANDROID` instead.
Let's look at an example from [`EchoBoxView`](test/view/EchoBoxView.ts):

```typescript
S = {
  input: '~messageInput',
  save: '~messageSaveBtn',
};

S_ANDROID = {savedMsg: '//*[@resource-id="savedMessage"]'};

S_IOS = {savedMsg: '~savedMessage'};
```

What this says is that both platforms share the `input` and `save` selectors, but differ on the
`savedMsg` selector. Now I can *use* these selectors within the `EchoBoxView` methods using the
`this.$` property, as follows:

```typescript
this.click(this.$.save);
```

The base view logic will take care of turning `this.$.save` into the appropriate `save` selector
based on the current platform.

(Note: `S` and `$` are extremely shorthand notations which may not be suitable for codebases with
lots of people working on them, where clarity of expression and ease of understanding by lots of
developers may outweigh my main concern, which was space).

#### A view stack

Given that my app supports the 'back' behaviour, I went ahead and implemented a 'view stack' so
that test logic can call `<view>.back()` and get as the return value the view object that would
theoretically be navigated to when the user presses the back key.

#### View existence verification

It's sometimes useful to actually verify that you're on the view you think you're on. Sometimes you
might want to check that you're on the right view before looking for elements, for example. The way
I implemented this is to allow views to define a member variable called
`viewVerificationSelectors`, which is an array of selector names. If defined, tests can call
`<view>.verify()`, and all of the selectors will be checked for existence. If any elements can't be
found with within a specified timeout, the `verify` method will throw an error.

An example of how this is used in a test can be found in the logout test, wherein we log out from
the secret page and then want to make an assertion that we got back to the login page. Without this
verification the test would not do what it is supposed to do!

```typescript
const login = await secret.logout();
await login.verify();
```

#### Cross-platform smoothing

Sometimes the differences between iOS and Android go deeper than variation in selector strings. For
example, launching TheApp into a specific view via a 'deep link' has different methods depending on
the platform (and for iOS, depending on whether we have a real device or a simulator). Therefore
I implemented a `deepLink` method which simply takes a URL and does the right thing based on the
currently active platform and device type. My test code doesn't have to worry about any of these
things!

The great thing about a base model like this is it can grow with your test suite. If I were to
implement another dozen tests, I would no doubt find many more convenience methods to factor out
into the base model. A good rule of thumb (as with software development in general) is that, if you
find yourself doing the same thing in multiple places, it's time to factor that thing out so that
it can be cleanly reused. The base view model is often the perfect place for that refactoring.

### View objects

With the base view model implemented, it is easy to create minimal view objects for specific views
in the application. The important thing about these test-facing view objects is that they only
expose user-level actions, and encapsulate all the implementation details within the view object
class. (In my opinion, a user's desire is never to "tap a button", so your test code should never have
"tap" in it anywhere. Instead, a user's desire is to "log in" or "get more information about this
item", or "add this item to my cart".)

Here's an example of the EchoBox view in TheApp (without selectors, which were listed already
above):

```typescript
export class EchoBoxView extends BaseView {

  async setEchoText(text: string) {
    await this.sendKeys(this.$.input, text);
    await this.click(this.$.save);
  }

  async getEchoText() {
    try {
      return await this.getText(this.$.savedMsg);
    } catch (ign) {
      // if we get an error it means the element doesn't exist
      return '';
    }
  }

  async back() {
    return (await super.back()) as HomeView;
  }
}
```

It exposes the only three things that a user would likely do on this view: set the echo text, read
the echo text, or go back to the home view.

One pattern that I like to use in my view objects is to return new view objects from methods that
result in a transition to another view. That is why the implementation of `login` in the
`LoginView` ends with the line:

```typescript
  return SecretView.from(this);
```

A login directs the user to the 'secret' view, so in our test code we can simply write something
like:

```typescript
const secretView = await loginView.login(username, password);
// now we can begin using secretView immediately without needing to instantiate it
```

In this framework, instantiating view objects in test code is generally a sign that something went
wrong, since it could mean that we're trying to do something on a view that we have not actually
transitioned to.

### Test cases

Once session config, test harness logic, and view objects have all been created, implementing tests
themselves is very straightforward. Writing tests themselves is much easier than developing the
view objects, since at this point all the selectors have been figured out and embedded in the view
objects. All that's left is to use the view object APIs and write out the scenario that you're
trying to test (making sure to have an assertion at the end, of course!)

To finish up with this tour, I'll just paste again the example above of a login test, to show how
everything fits together into a nice readable test:

```typescript
it('should log in with correct username and password', async () => {
  const {home} = harness;
  const loginScreen = await home.navToLogin();
  const secret = await loginScreen.login(USER, PW);
  expect(await secret.getLoggedInUser()).toEqual(USER);
});
```

## CI

Running tests locally is one thing. Running them on a CI server is another. Most CI servers do not
have the horsepower to easily run virtual devices, and public CI servers will not have real devices
attached either. So here is the design I chose for automated building and testing of TheApp:

- Check which repo files were modified, and don't bother building if it's not a relevant change
- Install dependencies for the React Native app (Node & NPM)
- Install system dependencies required for building apps on the given platform (Android SDK and
  Gradle for Android, Apple signing utilities etc for iOS)
- Install native app dependencies (e.g. CocoaPods)
- Build and archive the app
- Upload the app to HeadSpin and get an app ID
- Use the app ID to kick off the testsuite (in parallel on multiple devices) on HeadSpin

Once these steps all pass, the build is complete and the linked pull request (or commit) gets
annotated with a nice green checkmark!

Check out [build-ios.yml](.github/workflows/build-ios.yml) and
[build-android.yml](.github/workflows/build-android.yml) to see all the ugly details. Building and
signing an iOS app in particular requires lots of extra environment variables and messing about on
the system. It's not fun, but it works!

If this were a real app that would actually be distributed to users, we might consider an automatic
release mechanism to a beta channel as well (i.e., continuous deployment).

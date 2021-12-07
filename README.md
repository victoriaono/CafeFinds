# CafeFinds

## Using the app
The app works on a mobile device with location enabled. It was built using React Native, so to run the project, you will first need to install all packages by running `npm install --save` from the root of the project folder.
For iOS (which is the basis of what I was working with), you will need to install CocoaPods as well; to do this, `cd` into the `ios` directory from the root of the project folder and run `pod install`. All the necessary dependencies will be downloaded. 

You will also need to have Xcode and Simulator on your computer to be able to run the app. These can be installed from the Mac App Store. Finally, go back to the root directory and run `npx react-native run-ios`. For Android, run `npx react-native run-android`.

Once the simulator is up and running, the app should ask for permission to use your location. Click allow while using app (or equivalent in Android).
The app will display a map with your current location shown and the list of coffee shops available in the Boston area.
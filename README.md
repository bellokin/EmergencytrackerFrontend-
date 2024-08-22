 --

# Emergency GPS Location Tracker

## Project Overview

**Emergency GPS Location Tracker** is a mobile application designed to enhance user safety by allowing them to share their precise location with a list of pre-saved contacts via text message and email. The app includes an emergency feature that triggers location sharing when the device is shaken, utilizing the phone's accelerometer. This ensures that users can send their location quickly in critical situations, even without navigating through the app.

## Features

- **User Authentication**: Securely authenticate users to ensure only authorized access to the app.
- **Location Tracking**: Retrieve and display the user's current location using the device's GPS.
- **Emergency Contacts List**: Users can save a list of contacts who will receive location updates during emergencies.
- **Location Sharing**: Send the current location to selected contacts via SMS and email.
- **Shake-to-Send**: Trigger location sharing by physically shaking the phone, using the built-in accelerometer sensor.
- **Test SMS Limitations**: Emergency text messages are functional but currently limited to a single test number due to API restrictions.

## Installation

To install and run this project locally:

1. Clone the repository:

    ```bash
    git clone  https://github.com/bellokin/EmergencytrackerFrontend-.git
    cd emergency-gps-location-tracker
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Configure the environment variables:

    - Create a `.env` file in the root directory.
    - Add the necessary API keys and configuration settings.

4. Run the app:

    ```bash
    npx expo start
    ```

5. Build the APK for Android:

    ```bash
    expo build:android
    ```
NOTE-"Google maps APi in the app.json was replaced ,Swap with dummy value with different API"
## Usage

- **Sign Up / Login**: Start by creating an account or logging in.
- **Add Emergency Contacts**: Navigate to the contacts list and add the phone numbers and email addresses of your emergency contacts.
- **Send Location Manually**: Open the app and tap the 'Send Location' button to send your current location to your contacts.
- **Shake-to-Send**: In an emergency, simply shake your phone to automatically send your location to your contacts.
  
> **Note:** Due to API limits, the emergency text messages feature is currently restricted to sending messages to a single test number.

## Technologies Used

- **React Native**: For building the cross-platform mobile app.
- **Expo**: For development, testing, and building the application.
- **Django**: For backend services, managing user data, authentication, and handling API requests.
- **GPS and Accelerometer Library**: For location tracking and motion detection.
- **Text Messaging and Email APIs**: For sending emergency alerts to contacts.

## Contributing

If you wish to contribute to the project, feel free to fork the repository and submit a pull request. Please ensure all code changes are well-documented and tested.

 
## Contact

For any inquiries or support, please contact Ibukun at [bellokingdavidibukun03@gmail.com].

---
 

// // "use strict";
// import * as functions from "firebase-functions";
//
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//
// exports.newUserSignUp = functions.auth.user().onCreate((user) => {
//   console.log("user created", user.email, user.uid);
// });
//
// exports.userDeleted = functions.auth.user().onDelete((user) => {
//   console.log("user deleted", user.email, user.uid);
// });
//
// /**
//  * Copyright 2015 Google Inc. All Rights Reserved.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// "use strict";
//
// import * as nodemailer from "nodemailer";
// import * as admin from "firebase-admin";
// admin.initializeApp(functions.config().firebase);
// admin.firestore().settings({timestampsInSnapshots: true});
// // Configure the email transport using the default SMTP transport and a GMail account.
// // For Gmail, enable these:
// // 1. https://www.google.com/settings/security/lesssecureapps
// // 2. https://accounts.google.com/DisplayUnlockCaptcha
// // For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// // TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });
//
// // Your company name to include in the emails
// // TODO: Change this to your app or company name to customize the email sent.
// const APP_NAME = "Angular ToDo App";
//
// // [START sendWelcomeEmail]
// /**
//  * Sends a welcome email to new user.
//  */
// // [START onCreateTrigger]
// exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
// // [END onCreateTrigger]
//   // [START eventAttributes]
//   if (user && user.email && user.displayName) {
//     const email = user.email; // The email of the user.
//     const displayName = user.displayName; // The display name of the user.
//     // [END eventAttributes]
//     return sendWelcomeEmail(email, displayName);
//   } else {
//     return false;
//   }
// });
// // [END sendWelcomeEmail]
//
// // [START sendByeEmail]
// /**
//  * Send an account deleted email confirmation to users who delete their accounts.
//  */
// // [START onDeleteTrigger]
// exports.sendByeEmail = functions.auth.user().onDelete((user) => {
// // [END onDeleteTrigger]
//   if (user && user.email && user.displayName) {
//     const email = user.email;
//     const displayName = user.displayName;
//     return sendGoodbyeEmail(email, displayName);
//   } else {
//     return false;
//   }
// });
// // [END sendByeEmail]
//
// // Sends a welcome email to the given user.
// async function sendWelcomeEmail(email:string, displayName:string) {
//   const mailOptions = {
//     from: `${APP_NAME} <noreply@firebase.com>`,
//     to: email,
//     subject: "",
//     text: "",
//   };
//
//   // The user subscribed to the newsletter.
//   mailOptions.subject = `Welcome to ${APP_NAME}!`;
//   mailOptions.text = `Hello, ${displayName || ""}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
//   await mailTransport.sendMail(mailOptions);
//   functions.logger.log("New welcome email sent to:", email);
//   return null;
// }
//
// // Sends a goodbye email to the given user.
// async function sendGoodbyeEmail(email:string, displayName:string) {
//   const mailOptions = {
//     from: `${APP_NAME} <noreply@firebase.com>`,
//     to: email,
//     subject: "",
//     text: "",
//   };
//
//   // The user unsubscribed to the newsletter.
//   mailOptions.subject = "Bye!";
//   mailOptions.text = `Hello, ${displayName || ""}!, We confirm that we have deleted your ${APP_NAME} account.`;
//   await mailTransport.sendMail(mailOptions);
//   functions.logger.log("Account deletion confirmation email sent to:", email);
//   return null;
// }

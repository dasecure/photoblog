---
title: Streamlining Login Security: Using Passkeys with Bitwarden
description: Learn how to enhance your login security with passkeys in Bitwarden, including setup, usage, and best practices for passwordless authentication.
pubDate: 2024-06-20
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# Introduction

Passkeys are the next evolution in secure, passwordless authentication. Based on the FIDO2 and WebAuthn standards, they replace traditional passwords with cryptographic key pairs tied to your device. Bitwarden now supports passkeys, allowing users to log in with a simple biometric or device PIN—without compromising security.

# What Are Passkeys?

- **Asymmetric key pairs**  
  A public key stored on the server and a private key kept securely on your device.
- **Standards-based**  
  Built on FIDO2/WebAuthn, providing phishing-resistant, hardware-backed authentication.
- **User-friendly**  
  Authenticate with Touch ID, Windows Hello, Android fingerprint, or a device PIN.

# Benefits of Passkeys

- Phishing-resistant: Keys are origin-bound, so attackers can’t intercept or replay them on a fake site.
- No password reuse: Eliminates weak or reused passwords across services.
- Seamless UX: Quick biometric or PIN-based login without typing complex passwords.
- Multi-device support: Sync passkeys via a trusted device ecosystem (iCloud Keychain, Google Password Manager, etc.).

# Bitwarden Passkey Support

Bitwarden’s Web Vault and desktop/mobile apps support passkeys for primary login. Here’s what you need:

- A Bitwarden account (Free or Premium).
- A modern browser or OS with WebAuthn support:
  - Chrome, Edge, Safari, or Firefox.
  - Windows Hello, macOS Touch ID, or Android/iOS biometrics.
- Bitwarden Web Vault v2024.1 or later (desktop/mobile apps are auto-updated).

# Setting Up Passkeys in Bitwarden

Follow these steps to register a passkey for your Bitwarden account:

1. **Log In to Web Vault**  
   Open vault.bitwarden.com and authenticate with your existing credentials.

2. **Navigate to Account Settings**  
   Click your profile icon → **Account Settings** → **Security** tab.

3. **Add a New Passkey**  
   Under **Two-step login**, choose **Passkeys** → **Add passkey**.

4. **Register the Passkey**  
   - Enter a friendly name (e.g., “Work Laptop Touch ID”).
   - Your browser/OS will prompt for biometric or PIN authentication.
   - Confirm the prompt to generate and register the key pair.

5. **Verify and Save**  
   - Once the passkey is registered, it appears in your list of two-step methods.
   - You can register multiple passkeys for different devices.

6. **Test the Login Flow**  
   - Sign out of Bitwarden.
   - On the login page, enter your email and click **Use passkey**.
   - Select the registered passkey and complete the biometric/PIN challenge.
   - You’re logged in—no master password required at this stage.

# Best Practices

- Register multiple passkeys across devices (desktop, laptop, mobile).
- Keep your master password safe as a fallback.
- Enable traditional 2FA (TOTP or email) in addition to passkeys for layered security.
- Regularly review and remove stale or lost-device passkeys in your **Security** settings.
- Back up recovery codes securely in case you lose all passkey-enabled devices.

# Conclusion

Passkeys represent a major step toward phishing-resistant, user-friendly authentication. With Bitwarden’s seamless integration, you can reduce reliance on passwords and strengthen your account security across all your devices. Follow the steps above to enable passkeys today and experience frictionless, robust login protection.
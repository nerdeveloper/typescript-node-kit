import passport from "passport";

import config from "../config";

import {User} from "../models/User";
import passportLocal from "passport-local";
import { Strategy as googleStrategy } from 'passport-google-oauth20';
import { Strategy as githubStrategy } from 'passport-github2';
import { Strategy as twitterStrategy } from 'passport-twitter';
import { Strategy as facebookStrategy } from 'passport-facebook';
import { Strategy as linkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as slackStrategy } from 'passport-slack-oauth2';
import { Strategy as discordStrategy } from 'passport-discord';
import { Strategy as dropboxStrategy } from 'passport-dropbox-oauth2';
// Local Authentication strategy
const LocalStrategy = passportLocal.Strategy;

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        User.authenticate(),
    ),
);

// Google Authentication strategy
passport.use(
    new googleStrategy(
        {
            clientID: `${process.env.GOOGLE_CLIENT_ID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Extract email and Google ID from the profile
            const email = profile._json?.email;
            const googleId = profile.id;

            if (!email) {
              return done(new Error('No email found in Google profile'));
            }

            // Check if the user already exists
            let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                  googleId,
                  email,
                  token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
              return done(err);
            }
        }
    )
);

// Github Authentication strategy
passport.use(
    new githubStrategy(
        {
            clientID: `${process.env.GITHUB_CLIENT_ID}`,
            clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/github/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              // Extract email and GitHub ID from the profile
              const email = profile._json?.email;
              const githubId = profile.id;

              if (!email) {
                return done(new Error('No email found in GitHub profile'));
              }

              // Check if the user already exists
              let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                  githubId,
                  email,
                  token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
              return done(err);
            }
        }
    )
);

// Twitter Authentication strategy
passport.use(
    new twitterStrategy(
        {
            consumerKey: `${process.env.TWITTER_CONSUMER_KEY}`,
            consumerSecret: `${process.env.TWITTER_CONSUMER_SECRET}`,
            callbackURL: `${config.site}/auth/twitter/callback`,
            includeEmail: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              // Extract email and Twitter ID from the profile
              const email = profile._json?.email;
              const twitterId = profile.id;

              if (!email) {
                return done(new Error('No email found in Twitter profile'));
              }

              // Check if the user already exists
              let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                  twitterId,
                  email,
                  token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
              return done(err);
            }
        }
    )
);

// Facebook Authentication strategy
passport.use(
    new facebookStrategy(
        {
            clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
            clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/facebook/callback`,
            profileFields: ["emails"], // email should be in the scope.
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              // Extract email and Facebook ID from the profile
              const email = profile._json?.email;
              const facebookId = profile.id;

              if (!email) {
                return done(new Error('No email found in Facebook profile'));
              }

              // Check if the user already exists
              let user = await User.findOne({ email });

                if (user) {
                  // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                  facebookId,
                  email,
                  token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
              return done(err);
            }
        }
    )
);

// LinkedIn Authentication strategy
passport.use(
    new linkedInStrategy(
        {
            clientID: `${process.env.LINKEDIN_CLIENT_ID}`,
            clientSecret: `${process.env.LINKEDIN_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/linkedin/callback`,
            //@ts-ignore
            scope: ["r_emailaddress", "r_liteprofile"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract the email and LinkedIn ID from the profile
                const email = profile.emails?.[0]?.value;
                const linkedinId = profile.id;

                if (!email) {
                    return done(new Error('No email found in LinkedIn profile'));
                }

                // Check if the user already exists
                let user = await User.findOne({ email });

                if (user) {
                    // If the user exists, return the existing user
                    return done(null, user);
                }

                // If the user doesn't exist, create a new user
                user = new User({
                    linkedinId,
                    email,
                    token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Dropbox Authentication strategy
passport.use(
    new dropboxStrategy(
        {
            apiVersion: "2",
            clientID: `${process.env.DROPBOX_CLIENT_ID}`,
            clientSecret: `${process.env.DROPBOX_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/dropbox/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email and Dropbox ID from the profile
                const email = profile.emails?.[0]?.value;
                const dropboxId = profile.id;

                if (!email) {
                    return done(new Error('No email found in Dropbox profile'));
                }

                // Check if the user already exists
                let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                    dropboxId,
                    email,
                    token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Discord Authentication strategy
passport.use(
    new discordStrategy(
        {
            clientID: `${process.env.DISCORD_CLIENT_ID}`,
            clientSecret: `${process.env.DISCORD_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/discord/callback`,
            scope: "identify email",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email and Discord ID from the profile
                const email = profile.email;
                const discordId = profile.id;

                if (!email) {
                    return done(new Error('No email found in Discord profile'));
                }

                // Check if the user already exists
                let user = await User.findOne({ email });

                if (user) {
                    // User exists, return the existing user
                    return done(null, user);
                }

                // User doesn't exist, create a new user
                user = new User({
                    discordId,
                    email,
                    token: accessToken,
                });

                // Save the new user
                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Slack Authentication strategy
passport.use(
    new slackStrategy(
        {
            clientID: `${process.env.SLACK_CLIENT_ID}`,
            clientSecret: `${process.env.SLACK_CLIENT_SECRET}`,
            callbackURL: `${config.site}/auth/slack/callback`,
            scope: "identity.basic identity.email",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email and Slack ID from the profile
                const email = profile.user?.email;
                const slackId = profile.user?.id;

                if (!email) {
                    return done(new Error('No email found in Slack profile'));
                }

                // Check if the user already exists in the database
                let user = await User.findOne({ email });

                if (user) {
                    // If the user exists, return the existing user
                    return done(null, user);
                }

                // If the user doesn't exist, create a new user
                user = new User({
                    slackId,
                    email,
                    token: accessToken,
                });

                // Save the new user to the database
                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

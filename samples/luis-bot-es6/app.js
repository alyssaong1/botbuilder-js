const { BotFrameworkAdapter, MemoryStorage, BatchOutput, BotContext, ConversationState } = require('botbuilder');
const {
    DialogSet,
    TextPrompt,
    ChoicePrompt,
    ConfirmPrompt,
    DatetimePrompt,
    FoundChoice,
    FoundDatetime,
    ListStyle
} = require('botbuilder-dialogs');
const BotStateManager = require('./botStateManager');

const restify = require('restify');
const moment = require('moment');
const _ = require('lodash');

const { LuisRecognizer } = require('botbuilder-ai');

const appId = 'b34b5b00-c8b3-422e-93cd-17894667426d';
const subscriptionKey = 'dc626873ccfd4e15b54bfef95a8012d9';
// Default is westus
const serviceEndpoint = 'https://westus.api.cognitive.microsoft.com';

const model = new LuisRecognizer({
    appId: appId,
    subscriptionKey: subscriptionKey,
    serviceEndpoint: serviceEndpoint
});

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Add state middleware
const state = new BotStateManager(new MemoryStorage());
adapter.use(state);

// Add batch output middleware
adapter.use(new BatchOutput());

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, async context => {
        if (context.request.type === 'conversationUpdate' && context.request.membersAdded[0].name === 'Bot') {
            // Welcome message here, bot will message you first
            return context.sendActivity(`Hi! I'm a simple reminder bot. I can help add reminders, delete and show them.`);
        } else if (context.request.type === 'message') {
            const utterance = (context.request.text || '').trim().toLowerCase();

            // Create dialog context
            const dc = dialogs.createContext(context, state);

            // Call LUIS model
            await model
                .recognize(context)
                .then(res => {
                    // Resolve intents returned from LUIS
                    let topIntent = res.topScoringIntent.intent;
                    state.intent = topIntent;

                    // Start addReminder dialog
                    if (topIntent === 'Calendar.Add') {
                        // Resolve entities returned from LUIS, and save these to state
                        let title = (state.title = _.find(res.entities, ['type', 'Calendar.Subject']));

                        let date = _.find(res.entities, ['type', 'builtin.datetimeV2.date']);
                        let time = _.find(res.entities, ['type', 'builtin.datetimeV2.time']);
                        let datetime = _.find(res.entities, ['type', 'builtin.datetimeV2.datetime']);

                        if (datetime) {
                            let dtvalue = datetime.resolution.values[0].value;
                            state.date = moment(dtvalue).format('DD-MM-YYYY');
                            state.time = moment(dtvalue).format('hh:mm a');
                        } else if (date) {
                            let datevalue = date.resolution.values[0].value;
                            state.date = moment(datevalue).format('DD-MM-YYYY');
                        } else if (time) {
                            let timevalue = time.resolution.values[0].value;
                            // Assume user is talking about today
                            let datetime = moment(timevalue, 'hh:mm a');
                            state.date = datetime.format('DD-MM-YYYY');
                            state.time = datetime.format('hh:mm a');
                        }

                        let reminder = (state.reminder = {
                            title: title ? title.entity : null,
                            date: state.date ? state.date : null,
                            time: state.time ? state.time : null
                        });

                        return dc.begin('addReminder');

                        // Start deleteReminder dialog
                    } else if (topIntent === 'Calendar.Delete') {
                        return dc.begin('deleteReminder');

                        // Start showReminders
                    } else if (topIntent === 'Calendar.Find') {
                        return dc.begin('showReminders');

                        // Check for cancel
                    } else if (utterance === 'cancel') {
                        if (dc.instance) {
                            return context.sendActivity(`Ok... Cancelled.`).then(res => {
                                dc.endAll();
                            });
                        } else {
                            return context.sendActivity(`Nothing to cancel.`);
                        }

                        // Continue current dialog
                    } else {
                        return dc.continue().then(res => {
                            // Return default message if nothing replied.
                            if (!context.responded) {
                                return context.sendActivity(
                                    `Hi! I'm a simple reminder bot. I can help add reminders, delete and show them.`
                                );
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });
});

const dialogs = new DialogSet();

//-----------------------------------------------
// Add Reminder
//-----------------------------------------------

dialogs.add('addReminder', [
    async function(dc) {
        // Initialize temp reminder and prompt for title
        dc.instance.state = {
            title: state.title ? state.title.entity : null,
            date: state.date,
            time: state.time
        };
        if (dc.instance.state.title) {
            await dc.continue();
        } else {
            await dc.prompt('titlePrompt', `What would you like to call your reminder?`);
        }
    },
    async function(dc, title) {
        // Save reminder title and prompt for time
        const reminder = dc.instance.state;
        if (!reminder.title) {
            reminder.title = title;
        }
        
        if (reminder.time) {
            await dc.continue();
        } else {
            await dc.prompt('timePrompt', `What time would you like to set the "${reminder.title}" reminder for?`);
        }
    },
    async function(dc, time) {
        // Save reminder time
        const reminder = dc.instance.state;
        if (!reminder.time) {
            reminder.time = moment(time, 'hh:mm a').format('hh:mm a');
        }
        if (!reminder.date) {
            reminder.date = moment(time, 'hh:mm a').format('DD-MM-YYYY');
        }

        // Reminder completed so set reminder.
        const user = state.user(dc.context);
        user.reminders.push(reminder);

        // Confirm to user
        await dc.context.sendActivity(`Your reminder named "${reminder.title}" is set for ${reminder.date} on ${reminder.time}.`);
        state.date = null;
        state.time = null;
        state.title = null;
        await dc.end();
    }
]);

dialogs.add(
    'titlePrompt',
    new TextPrompt(async (dc, value) => {
        if (!value || value.length < 3) {
            await dc.context.sendActivity(`Title should be at least 3 characters long.`);
            return undefined;
        } else {
            return value.trim();
        }
    })
);

dialogs.add(
    'timePrompt',
    new DatetimePrompt(async (dc, values) => {
        try {
            if (!Array.isArray(values) || values.length < 0) {
                throw new Error('missing time');
            }
            const value = moment(values[0].value, 'hh:mm a');

            if (value.toDate().getTime() < new Date().getTime()) {
                throw new Error('in the past');
            }
            return value;
        } catch (err) {
            await dc.context.sendActivity(`Please enter a valid time in the future like "tomorrow at 9am" or say "cancel".`);
            return undefined;
        }
    })
);

//-----------------------------------------------
// Delete Reminder
//-----------------------------------------------

dialogs.add('deleteReminder', [
    async function(dc) {
        // Divert to appropriate dialog
        const user = state.user(dc.context);
        if (user.reminders.length > 1) {
            await dc.begin('deleteReminderMulti');
        } else if (user.reminders.length === 1) {
            await dc.begin('deleteReminderSingle');
        } else {
            await dc.context.sendActivity(`No reminders set to delete.`);
            await dc.end();
        }
    }
]);

dialogs.add('deleteReminderMulti', [
    async function(dc) {
        // Compute list of choices based on reminder titles
        const user = state.user(dc.context);
        const choices = user.reminders.map(value => value.title);

        // Prompt user for choice (force use of "list" style)
        const prompt = `Which reminder would you like to delete? Say "cancel" to quit.`;
        await dc.prompt('choicePrompt', prompt, choices);
    },
    async function(dc, choice) {
        // Delete reminder by position
        const user = state.user(dc.context);
        if (choice.index < user.reminders.length) {
            user.reminders.splice(choice.index, 1);
        }

        // Notify user of delete
        await dc.context.sendActivity(`Deleted "${choice.value}" reminder.`);
        await dc.end();
    }
]);

dialogs.add('deleteReminderSingle', [
    async function(dc) {
        const user = state.user(dc.context);
        const reminder = user.reminders[0];
        await dc.prompt('confirmPrompt', `Are you sure you want to delete the "${reminder.title}" reminder?`);
    },
    async function(dc, confirm) {
        if (confirm) {
            const user = state.user(dc.context);
            user.reminders = [];
            await dc.context.sendActivity(`reminder deleted...`);
        } else {
            await dc.context.sendActivity(`ok...`);
        }
    }
]);

dialogs.add('choicePrompt', new ChoicePrompt());
dialogs.add('confirmPrompt', new ConfirmPrompt());

//-----------------------------------------------
// Show Reminders
//-----------------------------------------------

dialogs.add('showReminders', [
    async function(dc) {
        let msg = `No reminders found.`;
        const user = state.user(dc.context);
        if (user.reminders.length > 0) {
            msg = `**Current Reminders**\n\n`;
            let connector = '';
            user.reminders.forEach(reminder => {
                msg += connector + `- ${reminder.title} (${reminder.time})`;
                connector = '\n';
            });
        }
        await dc.context.sendActivity(msg);
        await dc.end();
    }
]);

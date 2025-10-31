type World = "world";
type Greeting = `hello ${World}`; // "hello world"

type EmailLocaleID = "welcome_email" | "email_heading";
type FooterLocaleID = "footer_title" | "footer_sendoff";
type AllLocaleID = `${EmailLocaleID | FooterLocaleID}_id`;// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

type Lang = "en" | "ja" | "zh";
type LocaleMessageID = "hello" | "goodbye" | "welcome" | "farewell";
type LocaleMessage = `${LocaleMessageID}_${Lang}`; 


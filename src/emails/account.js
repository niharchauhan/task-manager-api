const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'niharchauhan9@gmail.com',
//     from: 'niharchauhan9@gmail.com',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually get to you.'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'niharchauhan9@gmail.com',
        subject: 'Thanks for joining in!',
        text: 'Welcome to the app, ' + name + '. Let me know how you get along with the app.'
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'niharchauhan9@gmail.com',
        subject: 'Sorry to see you go!',
        text: 'Goodbye, ' + name + '. I hope to see you back sometime soon.'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
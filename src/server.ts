import express, { json, type Request, type Response } from 'express'
import { google } from 'googleapis';

// Environment Variables
const port = Bun.env.PORT
const clientId = Bun.env.CLIENT_ID
const ClientSecret = Bun.env.CLIENT_SECRET
const redirectURL = Bun.env.REDIRECT_URL

// Assests
const app = express();
const OAuthClient = new google.auth.OAuth2(
    clientId,
    ClientSecret,
    redirectURL
)
const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.readonly'
];

// Midleware
app.use(json())

// Routes
app.post('/ali/test', (req: Request, res: Response) => {
    const content = req.body;
    res.status(200).json({ "your data": content })
})

app.get('/ali/auth', (req: Request, res: Response) => {
    const url = OAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    })
    console.log(url);
    res.redirect(url)
})

app.get('/ali/authcallback', async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) res.status(400).json("Auth Faild");

    const { tokens } = await OAuthClient.getToken(code);
    OAuthClient.setCredentials(tokens);

    console.log(tokens)

    res.json({
        message: 'Authentication successful!',
        tokens: tokens
    });
})

// Web Server
app.listen(port, (err) => {
    if (err) console.log("server didn't start")
    else console.log(`server listening on port ${port}`)
})
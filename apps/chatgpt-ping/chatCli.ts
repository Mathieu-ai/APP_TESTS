import { Configuration, OpenAIApi } from "openai";
import { config as getEnv } from "dotenv";
import inquirer from "inquirer";
import { env } from 'process';
import { colorize } from "./utils";

getEnv({ path: './config/.env' });

const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function checkChatGPTApi() {
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
        });
        console.log(completion.data.choices[0].message?.content);
        console.log(colorize('Everything works!', 'bgGreen,white,bold'));
    } catch (e: any) {
        const { response: { status, statusText, config: { data, url, headers: { Authorization } }, request: { host }, data: { error: { message, type } } } } = e;
        console.error(
            'status: ', colorize(status, 'red,bold'),
            '\n',
            'statusText: ', colorize(statusText, 'bold'),
            '\n',
            'data: ', colorize(data, 'grey,bold'),
            '\n',
            'url: ', colorize(url, 'cyan,bold'),
            '\n',
            'host: ', colorize(host, 'cyan,bold'),
            '\n',
            'message: ', colorize(message, 'red,bold,italic'),
            '\n',
            'type: ', colorize(type, 'yellow,bold'),
            '\n',
            'token: ', colorize(Authorization?.split(' ')[1] ?? null, 'white,bold,italic')
        );
    }
}

async function main() {
    await inquirer.prompt([
        {
            type: "confirm",
            name: "check",
            message: "Do you want to check if the ChatGPT API is working?",
            default: true,
        },
    ]).then(async (answers) => {
        if (answers.check) {
            await checkChatGPTApi();
        } else {
            console.log("Cancelled.");
        }
    });
}

main();
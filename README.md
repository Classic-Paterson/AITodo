# AI Todo
AI todo is a generic todo app that uses GPT as the back end. 

## How to run

### Server:

Add your Open Ai API key to .env as `OPEN_AI_API_KEY`

```
cd server
npm i
node server/api.js 
```

### App:

```
cd app
npm i
npm start
```

Now you can try a prompt like:
 ```
 Add a todo for each sport in the olympics
 ```
or
```
Add a property called 'important' and make it true for every second item
```
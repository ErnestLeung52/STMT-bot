# STMT-bot

- Retrieve emails data with Gmail API
- Browser automation with Puppeteer

## OAuth Node.js Setup

1. Create a project on Google Console <br/> [https://console.developers.google.com/](https://console.developers.google.com/)
2. Enable Gmail API via search bar
3. Configure Project
   - OAuth consent screen -> External
   - Fill in app information; ignore scope page
   - Add Test users ( the corresponding email receving access )
4. Create Credential -> Desktop App for Node.js

## Gmail API

- REST documentation and testing <br/> https://developers.google.com/gmail/api/reference/rest/

## Puppeteer

- When you run page.$$, you get back an array of ElementHandle. From Puppeteer's documentation: <br/> https://devdocs.io/puppeteer/index#class-elementhandle

- This means you can iterate over them, but you also have to run evaluate() or $eval() over each element to access the DOM element.

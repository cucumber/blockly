# @cucumber/blockly

This is a beginner-friendly Gherkin editor based on [Blockly](https://developers.google.com/blockly).

You can [try a live demo here](https://cucumber.github.io/blockly/).

**The editor is experimental and not ready for production use.**

Users can drag in a generic Step block where they can change the keyword and type
to see an auto-complete of available steps.

![Screenhot](images/autocomplete.png)

When a step is selected from the auto-complete, the step block changes to include
smaller input fields for step parameters.

![Screenhot](images/dynamic-step.png)

## Try it out

    npm install

With Vanilla JavaScript (no UI toolkit)

    npm run start:vanilla

With React

    npm run start:react

## API

The editor is exposed as a React component. See [example/app.tsx](example/main-react.tsx) for sample usage.

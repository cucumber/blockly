import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { buildSuggestions } from '@cucumber/language-service'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { CucumberBlockly, CucumberBlocklyProps } from './CucumberBlockly.js'

// Build some sample step texts and cucumber expressions.
const registry = new ParameterTypeRegistry()
const ef = new ExpressionFactory(registry)

const expressions: Expression[] = [
  ef.createExpression('I have {int} cukes in my {word}'),
  ef.createExpression('there are {int} blind mice'),
]
const suggestions = buildSuggestions(
  registry,
  ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
  expressions
)

const CucumberBlocklyWithBlocks: React.FunctionComponent<
  Pick<CucumberBlocklyProps, 'setError' | 'setGherkinSource' | 'setWorkspaceXml'>
> = ({ setError, setGherkinSource, setWorkspaceXml }) => {
  const initialGherkinSource = `
    Feature: Hello
      Scenario: the hungry one
        Given I have 37 cukes in my basket
        And there are 13 blind mice
        And some other gibberish
  `
  return (
    <CucumberBlockly
      initialGherkinSource={initialGherkinSource}
      suggestions={suggestions}
      expressions={expressions}
      setError={setError}
      setGherkinSource={setGherkinSource}
      setWorkspaceXml={setWorkspaceXml}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $error = document.getElementById('error')!
const errorRoot = createRoot($error)
function setError(error: string) {
  // errorRoot.unmount()
  errorRoot.render(<pre>{error}</pre>)
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $gherkinSource = document.getElementById('gherkinSource')!
const gherkinSourceRoot = createRoot($gherkinSource)
function setGherkinSource(gherkinSource: string) {
  // gherkinSourceRoot.unmount()
  gherkinSourceRoot.render(<pre>{gherkinSource}</pre>)
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $workspaceXml = document.getElementById('workspaceXml')!
const workspaceXmlRoot = createRoot($workspaceXml)
function setWorkspaceXml(workspaceXml: string) {
  // workspaceXmlRoot.unmount()
  workspaceXmlRoot.render(<pre>{workspaceXml}</pre>)
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $cucumberBlockly = document.getElementById('cucumberBlockly')!
const cucumberBlocklyRoot = createRoot($cucumberBlockly)
cucumberBlocklyRoot.render(
  <CucumberBlocklyWithBlocks
    setError={setError}
    setGherkinSource={setGherkinSource}
    setWorkspaceXml={setWorkspaceXml}
  />
)

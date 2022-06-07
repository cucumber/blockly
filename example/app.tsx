import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildSuggestions, parseGherkinDocument } from '@cucumber/language-service'
import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

import BlocklyComponent from './BlocklyComponent.js'

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

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaceXml] = useState(`
    <xml xmlns="https://developers.google.com/blockly/xml">
    </xml>
  `)
  const initialGherkinSource = `
    Feature: Hello
      Scenario: the hungry one
        Given I have 37 cukes in my basket
        And there are 13 blind mice
        And some other gibberish
  `
  const [gherkinSource, setGherkinSource] = useState<string>(initialGherkinSource)
  const [error, setError] = useState<string | undefined>()

  const prettyGherkinSource = useMemo(() => {
    const parseResult = parseGherkinDocument(gherkinSource)
    return parseResult.gherkinDocument ? pretty(parseResult.gherkinDocument) : gherkinSource
  }, [gherkinSource])

  return (
    <div className="flex-container">
      <div className="flex-child">
        <BlocklyComponent
          initialGherkinSource={initialGherkinSource}
          suggestions={suggestions}
          expressions={expressions}
          setWorkspaceXml={setWorkspaceXml}
          setGherkinSource={setGherkinSource}
          setError={setError}
        />
      </div>

      <div className="flex-child">
        {error && <pre className="border">{error}</pre>}
        <pre className="border">{prettyGherkinSource}</pre>
        <pre className="border">{workspaceXml}</pre>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)

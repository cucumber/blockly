import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildSuggestions, parseGherkinDocument } from '@cucumber/language-service'
import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

import BlocklyComponent from '../src/BlocklyComponent'
import { defineBlocks } from '../src/defineBlocks.js'

// Build some sample step texts and cucumber expressions. These would typically come from a stream
// of Cucumber Messages.
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
defineBlocks(suggestions)

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaceXml] = useState(`
    <xml xmlns="https://developers.google.com/blockly/xml">
    </xml>
  `)
  const [gherkinSources, setGherkinSources] = useState<readonly string[]>([])
  const [error, setError] = useState<string | undefined>()

  const prettyGherkinSources = useMemo(() => {
    return gherkinSources.map((gherkinSource) => {
      const parseResult = parseGherkinDocument(gherkinSource)
      return parseResult.gherkinDocument ? pretty(parseResult.gherkinDocument) : gherkinSource
    })
  }, [gherkinSources])

  return (
    <div className="flex-container">
      <div className="flex-child">
        <BlocklyComponent
          suggestions={suggestions}
          workspaceXml={workspaceXml}
          setWorkspaceXml={setWorkspaceXml}
          setGherkinSources={setGherkinSources}
          setError={setError}
          options={{
            readOnly: false,
            trashcan: true,
            media: 'media/',
            move: {
              scrollbars: true,
              drag: true,
              wheel: true,
            },
          }}
        />
      </div>

      <div className="flex-child">
        {error && <pre className="border">{error}</pre>}
        {prettyGherkinSources.map((prettyGherkinSource, i) => (
          <pre key={i} className="border">
            {prettyGherkinSource}
          </pre>
        ))}
        <pre className="border">{workspaceXml}</pre>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)

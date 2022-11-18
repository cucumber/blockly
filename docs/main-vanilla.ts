import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { buildSuggestions } from '@cucumber/language-service'

import { mount } from '../src/index.js'

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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $cucumberBlockly = document.querySelector('#cucumberBlockly')!

const gherkinSource = `
    Feature: Hello
      Scenario: the hungry one
        Given I have 37 cukes in my basket
        And there are 13 blind mice
        And some other gibberish
  `

mount(
  $cucumberBlockly,
  gherkinSource,
  suggestions,
  expressions,
  'media',
  (err, gherkinSource, workspaceXml) => {
    let $e: Element | null
    if (err && ($e = document.querySelector('#error'))) {
      $e.innerHTML = err.stack || ''
    }
    if (gherkinSource && ($e = document.querySelector('#gherkinSource'))) {
      $e.innerHTML = gherkinSource || ''
    }
    if (workspaceXml && ($e = document.querySelector('#workspaceXml'))) {
      $e.innerHTML = escapeHtml(workspaceXml) || ''
    }
  }
)

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildSuggestions, parseGherkinDocument, Suggestion } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'
import formatXml from 'xml-formatter'

import { defineBlocks } from '../src/defineBlocks.js'
import { gherkinDocumentToBlocklyXml } from '../src/gherkinDocumentToBlocklyXml.js'
import { makeGenerator } from '../src/makeGenerator.js'

describe('codec', () => {
  let suggestions: readonly Suggestion[]

  beforeEach(() => {
    const registry = new ParameterTypeRegistry()
    const ef = new ExpressionFactory(registry)
    const expressions: Expression[] = [
      ef.createExpression('I have {int} cukes in my belly'),
      ef.createExpression('there are {int} blind mice'),
    ]
    suggestions = buildSuggestions(
      registry,
      ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
      expressions
    )
    defineBlocks(suggestions)
  })

  it('roundtrips scenario', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="Ac|u]rJ6HOG;W@^7@w?A" x="70" y="36">
          <field name="NAME">F</field>
          <statement name="CHILDREN">
            <block type="scenario" id="uauY^\`5[Xm+/SND.h1]E">
              <field name="NAME">1</field>
              <next>
                <block type="scenario" id="I?+=Ap\`W0SDlk3r4V2m7">
                  <field name="NAME">2</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `Feature: F
Scenario: 1
Scenario: 2
`
    assertRoundtrip(xml, expectedCode, suggestions)
  })
})

function assertRoundtrip(xml: string, expectedCode: string, suggestions: readonly Suggestion[]) {
  const generator = makeGenerator(suggestions)
  const gherkinDocument = assertCode(Blockly.Xml.textToDom(xml), generator, expectedCode)
  // Now verify that the GherkinDocument can be turned into XML, loaded into workspace and out, and back to Gherkin again
  const xmlElement = gherkinDocumentToBlocklyXml(gherkinDocument)
  assertCode(xmlElement, generator, expectedCode)
}

function assertCode(
  element: Element,
  generator: Blockly.Generator,
  expectedCode: string
): GherkinDocument {
  const workspace = new Blockly.Workspace()
  if (process.env.PRINT_XML) console.log(formatXml(element.outerHTML))
  Blockly.Xml.domToWorkspace(element, workspace)
  const blocks = workspace.getTopBlocks(true)
  assert.strictEqual(blocks.length, 1)
  const generatedCode = generator.workspaceToCode(workspace)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const gherkinDocument = parseGherkinDocument(generatedCode).gherkinDocument!
  assert.strictEqual(
    pretty(gherkinDocument),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pretty(parseGherkinDocument(expectedCode).gherkinDocument!)
  )
  return gherkinDocument
}

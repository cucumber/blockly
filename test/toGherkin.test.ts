import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildStepDocuments } from '@cucumber/suggest'
import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'

import { defineBlocks } from '../src/defineBlocks.js'
import { toGherkinDocument } from '../src/toGherkin.js'

describe('gherkinGenerator', () => {
  beforeEach(() => {
    const ef = new ExpressionFactory(new ParameterTypeRegistry())
    const expressions: Expression[] = [
      ef.createExpression('I have {int} cukes in my belly'),
      ef.createExpression('there are {int} blind mice'),
    ]
    const stepDocuments = buildStepDocuments(
      ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
      expressions
    )
    defineBlocks(stepDocuments)
  })

  it('generates code for scenario', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="scenario" id="H]D);F2kYo=xCdjp;[,}" x="78" y="-25">
          <field name="SCENARIO_NAME">The one where...</field>
          <statement name="STEPS">
            <block type="step" id="7n3=OA!N#Yx.cyUYC^y5">
              <field name="STEP_KEYWORD">GIVEN</field>
              <field name="STEP_TEXT">this is an undefined step</field>
              <next>
                <block type="_cucumber_0" id="/fSm?XET8tbqrFUS24WH">
                  <field name="STEP_KEYWORD">WHEN</field>
                  <field name="STEP_FIELD_1">I have </field>
                  <field name="STEP_FIELD_2">8899</field>
                  <field name="STEP_FIELD_3"> cukes in my belly</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `Feature: TODO

  Scenario: The one where...
    Given this is an undefined step
    When I have 8899 cukes in my belly
`
    assertCode(xml, expectedCode)
  })
})

function assertCode(xml: string, expectedCode: string) {
  const workspace = new Blockly.Workspace()
  const element = Blockly.Xml.textToDom(xml)
  Blockly.Xml.domToWorkspace(element, workspace)
  const blocks = workspace.getTopBlocks(true)
  const code = blocks
    .map((block) => {
      const gherkinDocument = toGherkinDocument(block)
      return pretty(gherkinDocument)
    })
    .join('\n')
  assert.strictEqual(code, expectedCode)
}

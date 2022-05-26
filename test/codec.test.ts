import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty, walkGherkinDocument } from '@cucumber/gherkin-utils'
import { buildSuggestions, Suggestion } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'

import { defineBlocks } from '../src/defineBlocks.js'
import { toGherkinDocument } from '../src/toGherkin.js'

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
        <block type="scenario" id="H]D);F2kYo=xCdjp;[,}" x="78" y="-25">
          <field name="SCENARIO_NAME">The one where...</field>
          <statement name="STEPS">
            <block type="step" id="7n3=OA!N#Yx.cyUYC^y5">
              <field name="STEP_KEYWORD">GIVEN</field>
              <field name="STEP_TEXT">this is an undefined step</field>
              <next>
                <block type="there are {int} blind mice" id="@}nG:J{47KEaPV.uV2P\`">
                  <field name="STEP_KEYWORD">GIVEN</field>
                  <field name="STEP_FIELD_1">there are </field>
                  <field name="STEP_FIELD_2">38</field>
                  <field name="STEP_FIELD_3"> blind mice</field>
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
    Given there are 38 blind mice
`
    assertRoundtrip(xml, expectedCode, suggestions)
  })
})

function fromGherkinDocument(
  gherkinDocument: GherkinDocument,
  suggestions: readonly Suggestion[]
): Element {
  const doc = Blockly.utils.xml.document()
  const xml = doc.documentElement

  let stepBlockParent: Element

  walkGherkinDocument(gherkinDocument, undefined, {
    scenario(scenario) {
      const scenarioBlock = Blockly.utils.xml.createElement('block')
      scenarioBlock.setAttribute('type', 'scenario')
      scenarioBlock.setAttribute('id', scenario.id)

      const scenarioField = Blockly.utils.xml.createElement('field')
      scenarioField.setAttribute('name', 'SCENARIO_NAME')
      scenarioField.innerHTML = scenario.name
      scenarioBlock.appendChild(scenarioField)

      const statement = Blockly.utils.xml.createElement('statement')
      statement.setAttribute('name', 'STEPS')
      scenarioBlock.appendChild(statement)

      stepBlockParent = statement

      xml.appendChild(scenarioBlock)
    },
    step(step) {
      const stepBlock = Blockly.utils.xml.createElement('block')

      const keywordField = Blockly.utils.xml.createElement('field')
      keywordField.setAttribute('name', 'STEP_KEYWORD')
      keywordField.innerHTML = 'GIVEN'
      stepBlock.appendChild(keywordField)

      // for (const suggestion of suggestions) {
      //   const args = suggestion.expression.match(step.text)
      //   if (args != null) {
      //     let offset = 0
      //     let fieldCounter = 1
      //     for (const arg of args) {
      //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //       if (arg.group.start! > 0) {
      //         const textField = Blockly.utils.xml.createElement('field')
      //         textField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
      //         textField.innerHTML = step.text.substring(0, arg.group.start)
      //         stepBlock.appendChild(textField)
      //       }
      //
      //       const argField = Blockly.utils.xml.createElement('field')
      //       argField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
      //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //       argField.innerHTML = arg.group.value!
      //       stepBlock.appendChild(argField)
      //
      //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      //       offset = arg.group.end!
      //     }
      //     const suffix = step.text.substring(offset)
      //     if (suffix !== '') {
      //       const textField = Blockly.utils.xml.createElement('field')
      //       textField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
      //       textField.innerHTML = suffix
      //       stepBlock.appendChild(textField)
      //     }
      //     stepBlock.setAttribute('type', suggestion.label)
      //     break
      //   }
      // }
      if (stepBlock.getAttribute('type') === null) {
        stepBlock.setAttribute('type', 'step')

        const textField = Blockly.utils.xml.createElement('field')
        textField.setAttribute('name', `STEP_TEXT`)
        textField.innerHTML = step.text
        stepBlock.appendChild(textField)
      }

      stepBlock.setAttribute('id', step.id)
      stepBlockParent.appendChild(stepBlock)

      const next = Blockly.utils.xml.createElement('next')
      stepBlock.appendChild(next)
      stepBlockParent = next
    },
  })

  return xml
}

function assertRoundtrip(xml: string, expectedCode: string, suggestion: readonly Suggestion[]) {
  const gherkinDocument = assertCode(Blockly.Xml.textToDom(xml), expectedCode)
  // Now verify that the GherkinDocument can be turned into XML, loaded into workspace and out, and back to Gherkin again
  const xmlElement = fromGherkinDocument(gherkinDocument, suggestion)
  assertCode(xmlElement, expectedCode)
}

function assertCode(element: Element, expectedCode: string): GherkinDocument {
  const workspace = new Blockly.Workspace()
  Blockly.Xml.domToWorkspace(element, workspace)
  const blocks = workspace.getTopBlocks(true)
  assert.strictEqual(blocks.length, 1)
  const gherkinDocument = toGherkinDocument(blocks[0])
  const code = pretty(gherkinDocument)
  assert.strictEqual(code, expectedCode)
  return gherkinDocument
}

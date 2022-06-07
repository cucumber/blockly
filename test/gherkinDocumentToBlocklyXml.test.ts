import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { parseGherkinDocument } from '@cucumber/language-service'
import assert from 'assert'
import Blockly from 'blockly'

//import formatXml from 'xml-formatter'
import { gherkinDocumentToBlocklyXml } from '../src/gherkinDocumentToBlocklyXml.js'

describe('gherkinDocumentToBlocklyXml', () => {
  it('generates a parameterised step block', () => {
    const registry = new ParameterTypeRegistry()
    const ef = new ExpressionFactory(registry)
    const expressions: Expression[] = [
      ef.createExpression('I have {int} cukes in my {word}'),
      ef.createExpression('there are {int} blind mice'),
    ]

    const gherkin = `
      Feature: A
        Scenario: B
          Given I have 38 cukes in my belly
    `
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gherkinDocument = parseGherkinDocument(gherkin).gherkinDocument!

    const xmlDocument = Blockly.utils.xml.textToDomDocument(
      `<xml xmlns="${Blockly.utils.xml.NAME_SPACE}"></xml>`
    )
    Blockly.utils.xml.setDocument(xmlDocument)
    const doc = Blockly.utils.xml.getDocument()
    const xmlElement = doc.documentElement

    gherkinDocumentToBlocklyXml(expressions, gherkinDocument, xmlElement)
    // console.log(formatXml(xmlElement.outerHTML, { collapseContent: true, indentation: '  ' }))
    const stepBlock = xmlElement.querySelectorAll('block').item(2)
    // console.log(formatXml(stepBlock.outerHTML, { collapseContent: true, indentation: '  ' }))
    const type = stepBlock.getAttribute('type')
    assert.strictEqual(type, 'I have {int} cukes in my {word}')
    const fieldValues = [...stepBlock.querySelectorAll('field')].map((field) => field.innerHTML)
    assert.deepStrictEqual(fieldValues, ['Given', 'I have ', '38', ' cukes in my ', 'belly'])
  })
})

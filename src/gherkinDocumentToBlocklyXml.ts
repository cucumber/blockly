import { Argument, Expression } from '@cucumber/cucumber-expressions'
import { walkGherkinDocument } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'

type Parents = {
  featureParent?: Element
  ruleParent?: Element
  scenarioParent?: Element
  stepParent?: Element
}

export function gherkinDocumentToBlocklyXml(
  expressions: readonly Expression[],
  gherkinDocument: GherkinDocument,
  xml: Element
): void {
  walkGherkinDocument<Parents>(
    gherkinDocument,
    { featureParent: xml },
    {
      feature(feature, parents) {
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', 'feature')
        block.setAttribute('id', feature.name) // TODO: Use uuid()
        parents.featureParent?.appendChild(block)

        const nameField = Blockly.utils.xml.createElement('field')
        nameField.setAttribute('name', 'NAME')
        nameField.innerHTML = feature.name
        block.appendChild(nameField)

        const childrenStatement = Blockly.utils.xml.createElement('statement')
        childrenStatement.setAttribute('name', 'CHILDREN')
        block.appendChild(childrenStatement)

        return { ...parents, scenarioParent: childrenStatement, ruleParent: childrenStatement }
      },
      rule(rule, parents) {
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', 'rule')
        block.setAttribute('id', rule.id)
        parents.ruleParent?.appendChild(block)

        const nameField = Blockly.utils.xml.createElement('field')
        nameField.setAttribute('name', 'NAME')
        nameField.innerHTML = rule.name
        block.appendChild(nameField)

        const childrenStatement = Blockly.utils.xml.createElement('statement')
        childrenStatement.setAttribute('name', 'CHILDREN')
        block.appendChild(childrenStatement)

        const next = Blockly.utils.xml.createElement('next')
        block.appendChild(next)

        return { ...parents, scenarioParent: childrenStatement, ruleParent: next }
      },
      scenario(scenario, parents) {
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', 'scenario')
        block.setAttribute('id', scenario.id)
        parents.scenarioParent?.appendChild(block)

        const nameField = Blockly.utils.xml.createElement('field')
        nameField.setAttribute('name', 'NAME')
        nameField.innerHTML = scenario.name
        block.appendChild(nameField)

        const stepsStatement = Blockly.utils.xml.createElement('statement')
        stepsStatement.setAttribute('name', 'STEPS')
        block.appendChild(stepsStatement)

        const next = Blockly.utils.xml.createElement('next')
        block.appendChild(next)

        return { ...parents, ruleParent: next, scenarioParent: next, stepParent: stepsStatement }
      },
      background(background, parents) {
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', 'background')
        block.setAttribute('id', background.id)
        parents.scenarioParent?.appendChild(block)

        const nameField = Blockly.utils.xml.createElement('field')
        nameField.setAttribute('name', 'NAME')
        nameField.innerHTML = background.name
        block.appendChild(nameField)

        const stepsStatement = Blockly.utils.xml.createElement('statement')
        stepsStatement.setAttribute('name', 'STEPS')
        block.appendChild(stepsStatement)

        const next = Blockly.utils.xml.createElement('next')
        block.appendChild(next)

        return { ...parents, ruleParent: next, scenarioParent: next, stepParent: stepsStatement }
      },
      step(step, parents) {
        let args: readonly Argument[] | null = null
        let expression: Expression | null = null
        for (const expr of expressions) {
          const a = expr.match(step.text)
          if (a) {
            args = a
            expression = expr
            break
          }
        }
        const type = expression === null ? 'step' : expression.source
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', type)
        block.setAttribute('id', step.id)
        parents.stepParent?.appendChild(block)

        const keywordField = Blockly.utils.xml.createElement('field')
        keywordField.setAttribute('name', 'KEYWORD')
        keywordField.innerHTML = step.keyword.trim() // TODO: Deal with (non)-spaces somehow
        block.appendChild(keywordField)

        if (args === null) {
          const textField = Blockly.utils.xml.createElement('field')
          textField.setAttribute('name', `TEXT`)
          textField.innerHTML = step.text
          block.appendChild(textField)
        } else {
          let offset = 0
          let fieldCounter = 1
          for (const arg of args) {
            if (arg.group.start || 0 > 0) {
              const textField = Blockly.utils.xml.createElement('field')
              textField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
              textField.innerHTML = step.text.substring(offset, arg.group.start)
              block.appendChild(textField)
            }

            const argField = Blockly.utils.xml.createElement('field')
            argField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            argField.innerHTML = arg.group.value!
            block.appendChild(argField)

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            offset = arg.group.end!
          }
          const suffix = step.text.substring(offset)
          if (suffix !== '') {
            const textField = Blockly.utils.xml.createElement('field')
            textField.setAttribute('name', `STEP_FIELD_${fieldCounter++}`)
            textField.innerHTML = suffix
            block.appendChild(textField)
          }
        }

        const next = Blockly.utils.xml.createElement('next')
        block.appendChild(next)

        return { ...parents, stepParent: next }
      },
    }
  )
}

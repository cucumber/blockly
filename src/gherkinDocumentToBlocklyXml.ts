import { walkGherkinDocument } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'

type Parents = {
  featureParent?: Element
  ruleParent?: Element
  scenarioParent?: Element
  stepParent?: Element
}

export function gherkinDocumentToBlocklyXml(gherkinDocument: GherkinDocument, xml: Element): void {
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
      // background(background, parents) {
      //   const block = Blockly.utils.xml.createElement('block')
      //   block.setAttribute('type', 'background')
      //   block.setAttribute('id', background.id)
      //   parents.scenarioParent?.appendChild(block)
      //
      //   const nameField = Blockly.utils.xml.createElement('field')
      //   nameField.setAttribute('name', 'NAME')
      //   nameField.innerHTML = background.name
      //   block.appendChild(nameField)
      //
      //   const stepsStatement = Blockly.utils.xml.createElement('statement')
      //   stepsStatement.setAttribute('name', 'STEPS')
      //   block.appendChild(stepsStatement)
      //
      //   const next = Blockly.utils.xml.createElement('next')
      //   block.appendChild(next)
      //
      //   return { ...parents, scenarioParent: next, stepParent: stepsStatement }
      // },
      step(step, parents) {
        const block = Blockly.utils.xml.createElement('block')
        block.setAttribute('type', 'step')
        block.setAttribute('id', step.id)
        parents.stepParent?.appendChild(block)

        const nameField = Blockly.utils.xml.createElement('field')
        nameField.setAttribute('name', 'KEYWORD')
        nameField.innerHTML = step.keyword.trim() // TODO: Deal with (non)-spaces somehow
        block.appendChild(nameField)

        const textField = Blockly.utils.xml.createElement('field')
        textField.setAttribute('name', `TEXT`)
        textField.innerHTML = step.text
        block.appendChild(textField)

        const next = Blockly.utils.xml.createElement('next')
        block.appendChild(next)

        return { ...parents, stepParent: next }
      },
    }
  )
}

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

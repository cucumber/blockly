import { walkGherkinDocument } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'

export function gherkinDocumentToBlocklyXml(gherkinDocument: GherkinDocument): Element {
  const doc = Blockly.utils.xml.getDocument()
  const xml = doc.documentElement

  let parent = xml

  walkGherkinDocument(gherkinDocument, undefined, {
    feature(feature) {
      const block = Blockly.utils.xml.createElement('block')
      block.setAttribute('type', 'feature')
      block.setAttribute('id', feature.name) // TODO: Use uuid()

      const field = Blockly.utils.xml.createElement('field')
      field.setAttribute('name', 'NAME')
      field.innerHTML = feature.name
      block.appendChild(field)

      const statement = Blockly.utils.xml.createElement('statement')
      statement.setAttribute('name', 'CHILDREN')
      block.appendChild(statement)

      parent.appendChild(block)
      parent = statement
    },
    scenario(scenario) {
      const block = Blockly.utils.xml.createElement('block')
      block.setAttribute('type', 'scenario')
      block.setAttribute('id', scenario.id)

      const field = Blockly.utils.xml.createElement('field')
      field.setAttribute('name', 'NAME')
      field.innerHTML = scenario.name
      block.appendChild(field)

      // const statement = Blockly.utils.xml.createElement('statement')
      // statement.setAttribute('name', 'STEPS')
      // block.appendChild(statement)
      const next = Blockly.utils.xml.createElement('next')
      block.appendChild(next)

      parent.appendChild(block)
      parent = next
    },
    step(step) {
      const block = Blockly.utils.xml.createElement('block')

      const field = Blockly.utils.xml.createElement('field')
      field.setAttribute('name', 'STEP_KEYWORD')
      field.innerHTML = 'GIVEN'
      block.appendChild(field)

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
      if (block.getAttribute('type') === null) {
        block.setAttribute('type', 'step')

        const textField = Blockly.utils.xml.createElement('field')
        textField.setAttribute('name', `STEP_TEXT`)
        textField.innerHTML = step.text
        block.appendChild(textField)
      }

      block.setAttribute('id', step.id)
      parent.appendChild(block)

      const next = Blockly.utils.xml.createElement('next')
      block.appendChild(next)
      parent = next
    },
  })

  return xml
}

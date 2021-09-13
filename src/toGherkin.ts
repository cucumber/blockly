import { FeatureChild, GherkinDocument, Location, Scenario, Step } from '@cucumber/messages'
import Blockly from 'blockly'

const location: Location = {
  line: -1,
  column: -1,
}

export function toGherkinDocument(block: Blockly.Block): GherkinDocument {
  const children: FeatureChild[] = []

  const scenario = toScenario(block)
  children.push({ scenario })

  return {
    comments: [],
    feature: {
      location,
      language: 'en',
      tags: [],
      keyword: 'Feature',
      name: 'TODO',
      description: '',
      children,
    },
  }
}

export function toScenario(block: Blockly.Block): Scenario {
  const steps: Step[] = []

  let stepBlock = (block.childBlocks_ || [])[0]
  while (stepBlock) {
    const step = toStep(stepBlock)
    if (!step) {
      break
    }
    steps.push(step)
    stepBlock = stepBlock.getNextBlock()
  }

  return {
    keyword: 'Scenario',
    name: block.getFieldValue('SCENARIO_NAME'),
    location,
    tags: [],
    description: '',
    id: '111',
    examples: [],
    steps: steps,
  }
}

export function toStep(block: Blockly.Block): Step | null {
  const keyword = { given: 'Given ', when: 'When ', then: 'Then ' }[block.type] || '* '
  const nameBlock = block.childBlocks_[0]
  if (!nameBlock) return null
  const id = nameBlock.id
  const input = nameBlock.inputList[0]
  const text = input.fieldRow.map((field) => field.getValue()).join('')
  return {
    keyword,
    text,
    id,
    location,
  }
}

import { FeatureChild, GherkinDocument, Location, Scenario, Step } from '@cucumber/messages'
import Blockly from 'blockly'
import { Field } from 'core/field'

const location: Location = {
  line: -1,
  column: -1,
}

const StepKeywordByType: Record<string, string> = {
  GIVEN: 'Given ',
  WHEN: 'When ',
  THEN: 'Then ',
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
    steps.push(toStep(stepBlock))
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

export function toStep(block: Blockly.Block): Step {
  const id = block.id
  const dummyInput = block.inputList[0]
  const keyword = StepKeywordByType[dummyInput.fieldRow[0].getValue()]
  const text = dummyInput.fieldRow
    .slice(1)
    .map((field: Field) => field.getValue())
    .join('')

  return {
    id,
    keyword,
    text,
    location,
  }
}

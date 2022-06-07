import { Expression } from '@cucumber/cucumber-expressions'
import { parseGherkinDocument, Suggestion } from '@cucumber/language-service'
import Blockly from 'blockly'
import { BlocklyOptions } from 'core/blockly_options'

import { defineBlocks } from './defineBlocks.js'
import { gherkinDocumentToBlocklyXml } from './gherkinDocumentToBlocklyXml.js'
import { makeGenerator } from './makeGenerator.js'
import { toolbox } from './toolbox.js'

/**
 * Mounts a Cucumber Blockly editor under div
 *
 * @param $parent the DOM element where the Blockly UI is added
 * @param $xml the DOM element where temporary Blockly XML is added
 * @param suggestions suggestions built by @cucumber/language-service
 * @param expressions all the expressions from step definitions
 * @param gherkinSource the gherkin source used to build the initial blocks
 * @param onBlocklyChanged called with an error, new generated Gherkin source and the Blockly XML whenever the blockly
 * editor has changed. All parameteers may be undefined
 */
export function mount(
  $parent: Element,
  $xml: Element,
  gherkinSource: string,
  suggestions: readonly Suggestion[],
  expressions: readonly Expression[],
  onBlocklyChanged: (
    error: Error | undefined,
    blocklyXml: string | undefined,
    gherkinSource: string | undefined
  ) => void
): () => void {
  defineBlocks(suggestions)
  const options: BlocklyOptions = {
    readOnly: false,
    trashcan: true,
    media: 'media/',
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
    toolbox: toolbox(suggestions),
  }
  const blocklyWorkspace = Blockly.inject($parent, options)
  const generator = makeGenerator(suggestions)
  generator.init(blocklyWorkspace)

  let err: Error | undefined

  const { gherkinDocument, error } = parseGherkinDocument(gherkinSource)
  if (error) {
    err = error
  }
  if (gherkinDocument) {
    gherkinDocumentToBlocklyXml(expressions, gherkinDocument, $xml)
    Blockly.Xml.domToWorkspace($xml, blocklyWorkspace)
  }

  blocklyWorkspace.addChangeListener(() => {
    let workspaceXml: string | undefined
    let gherkinSource: string | undefined
    try {
      workspaceXml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(blocklyWorkspace))
      gherkinSource = generator.workspaceToCode(blocklyWorkspace)
    } catch (error) {
      err = error
    }
    onBlocklyChanged(err, workspaceXml, gherkinSource)
  })

  return () => blocklyWorkspace.dispose()
}

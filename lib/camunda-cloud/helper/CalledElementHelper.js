import { has } from 'min-dash';

import { getOutputParameters } from './InputOutputHelper';

import { getExtensionElementsList } from '../../util/ExtensionElementsUtil';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';


/**
 * Get default value for zeebe:propagateAllChildVariables.
 *
 * @param {djs.model.Base|ModdleElement} element
 *
 * @returns {boolean}
 */
function getPropagateAllChildVariablesDefault(element) {
  if (!is(element, 'bpmn:CallActivity')) {
    return false;
  }

  const outputParameters = getOutputParameters(element);

  if (outputParameters) {
    return !outputParameters.length;
  }
}

/**
 * Get zeebe:CalledElement of an element.
 *
 * @param {djs.model.Base|ModdleElement} element
 *
 * @returns {ModdleElement}
 */
export function getCalledElement(element) {
  const calledElements = getCalledElements(element);

  return calledElements[ 0 ];
}

export function getCalledElements(element) {
  const businessObject = getBusinessObject(element);

  return getExtensionElementsList(businessObject, 'zeebe:CalledElement');
}

/**
 * Check whether zeebe:propagateAllChildVariables is set on an element.
 * Fall back to default if zeebe:propagateAllChildVariables not set.
 *
 * @param {djs.model.Base|ModdleElement} element
 *
 * @returns {boolean}
 */
export function isPropagateAllChildVariables(element) {
  if (!is(element, 'bpmn:CallActivity')) {
    return false;
  }

  const businessObject = getBusinessObject(element),
        calledElement = getCalledElement(businessObject);

  if (calledElement && has(calledElement, 'propagateAllChildVariables')) {
    return calledElement.get('propagateAllChildVariables') || false;
  } else {
    return getPropagateAllChildVariablesDefault(element);
  }
}

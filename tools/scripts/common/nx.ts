import {
  readCachedProjectGraph,
  ProjectGraphProjectNode,
} from '@nx/devkit';
import { assert } from './index';

export function getProject(name: string): ProjectGraphProjectNode {
  const graph = readCachedProjectGraph();
  const project = graph.nodes[name];
  
  assert(
    !!project,
    `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
    );

  return project;
}

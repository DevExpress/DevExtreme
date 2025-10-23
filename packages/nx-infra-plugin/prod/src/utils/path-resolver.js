"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFromWorkspace = exports.resolveFromProject = exports.resolveProjectPath = void 0;
const path = __importStar(require("path"));
const ERROR_CONFIGURATIONS_NOT_FOUND = 'Project configurations not found in executor context';
const ERROR_PROJECT_NAME_NOT_FOUND = 'Project name not found in executor context';
const ERROR_PROJECT_NOT_FOUND = 'Project "{0}" not found in workspace';
function resolveProjectPath(context) {
    if (!context.projectsConfigurations) {
        throw new Error(ERROR_CONFIGURATIONS_NOT_FOUND);
    }
    if (!context.projectName) {
        throw new Error(ERROR_PROJECT_NAME_NOT_FOUND);
    }
    const project = context.projectsConfigurations.projects[context.projectName];
    if (!project) {
        throw new Error(ERROR_PROJECT_NOT_FOUND.replace('{0}', context.projectName));
    }
    return path.resolve(context.root, project.root);
}
exports.resolveProjectPath = resolveProjectPath;
function resolveFromProject(context, relativePath) {
    const projectRoot = resolveProjectPath(context);
    return path.join(projectRoot, relativePath);
}
exports.resolveFromProject = resolveFromProject;
function resolveFromWorkspace(context, relativePath) {
    return path.join(context.root, relativePath);
}
exports.resolveFromWorkspace = resolveFromWorkspace;

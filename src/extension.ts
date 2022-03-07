'use strict';

import * as vscode from 'vscode';

import { DepNodeProvider, Dependency } from './nodeDependencies';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	// Samples of `window.registerTreeDataProvider`
	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('vscode-diary', nodeDependenciesProvider);
	vscode.commands.registerCommand('vscode-diary.refreshEntry', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('vscode-diary.addEntry', () => nodeDependenciesProvider.createANewFileForTodaysDiary());
	vscode.commands.registerCommand('vscode-diary.takeNotesEntry', () => nodeDependenciesProvider.takeNotesEntry());

	vscode.commands.registerCommand('vscode-diary.addNewFileEntry', (node: Dependency) => nodeDependenciesProvider.createAFileByUserInput(node));
	vscode.commands.registerCommand('vscode-diary.renameEntry', (node: Dependency) => nodeDependenciesProvider.rename(node));
	vscode.commands.registerCommand('vscode-diary.deleteEntry', (node: Dependency) => nodeDependenciesProvider.deleteAFileByClick(node));

	// Test View
	// new TestView(context);
}
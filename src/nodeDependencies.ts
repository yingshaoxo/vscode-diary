import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const getTodayDateObject = () => {
	const today = new Date();
	return {
		year: today.getFullYear(),
		month: today.getMonth() + 1,
		day: today.getDate(),
	};
};

const getAllFoldersInPath = (rootPath: string) => {
	const folders = [];
	if (rootPath) {
		const folderNames = fs.readdirSync(rootPath);
		folderNames.forEach(folderName => {
			const folderPath = path.join(rootPath, folderName);
			if (fs.statSync(folderPath).isDirectory()) {
				folders.push(folderPath);
			}
		});
	}
	return folders;
};

const getAllFilesInPath = (rootPath: string) => {
	const files = [];
	if (rootPath) {
		const fileNames = fs.readdirSync(rootPath);
		fileNames.forEach(fileName => {
			const filePath = path.join(rootPath, fileName);
			if (fs.statSync(filePath).isFile()) {
				files.push(filePath);
			}
		});
	}
	return files;
};

const getFileAndFoldersUnderAPath = (rootPath: string) => {
	const filesAndFolders = [];
	if (rootPath) {
		const fileNames = fs.readdirSync(rootPath);
		fileNames.forEach(fileName => {
			filesAndFolders.push(fileName);
		});
	}
	return filesAndFolders;
};

const getPathSeperator = () => {
	if (process.platform === 'win32') {
		return '\\';
	} else {
		return '/';
	}
};

const getParentFolder = (path: string) => {
	const pathSeperator = getPathSeperator();
	const pathArray = path.split(pathSeperator);
	pathArray.pop();
	return pathArray.join(pathSeperator);
};

const getLastPartOfAPath = (path: string) => {
	const parts = path.split(getPathSeperator());
	return parts[parts.length - 1];
};

const createANewFolder = (rootPath: string, folderName: string) => {
	if (rootPath) {
		const folderPath = path.join(rootPath, folderName);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}
	}
};

const createAFile = (rootPath: string, fileName: string, content: string) => {
	if (rootPath) {
		const filePath = path.join(rootPath, fileName);
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, content);
		}
	}
};

const checkIfStringIsNumber = (str: string) => {
	return /^-?[0-9]+(?:\.[0-9]+)?$/.test(str);
};

const isMarkDownFile = (fileName: string) => {
	return /\.md$/.test(fileName);
};

const checkIfPathIsFile = (path: string) => {
	if (fs.statSync(path).isFile()) {
		return true;
	}
	return false;
};

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	openAfile(filePath: string) {
		if (checkIfPathIsFile(filePath)) {
			vscode.window.showTextDocument(vscode.Uri.file(filePath));
		}
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	createANewFileForTodaysDiary(): void {
		if (this.workspaceRoot) {
			// create year folder
			const today = getTodayDateObject();

			const yearFolders = getAllFoldersInPath(this.workspaceRoot);
			let found = false;
			for (let i = 0; i < yearFolders.length; i++) {
				const folder = yearFolders[i];
				if (folder === String(today.year)) {
					found = true;
				}
			}
			if (found === false) {
				createANewFolder(this.workspaceRoot, String(today.year));
			}

			// create month folder
			const yearFolderPath = path.join(this.workspaceRoot, String(today.year));
			const monthFolders = getAllFoldersInPath(yearFolderPath);
			found = false;
			for (let i = 0; i < monthFolders.length; i++) {
				const folder = monthFolders[i];
				if (folder === String(today.month)) {
					found = true;
				}
			}
			if (found === false) {
				createANewFolder(yearFolderPath, String(today.month));
			}

			// create day file
			const monthFolderPath = path.join(yearFolderPath, String(today.month));
			const dayFilePath = path.join(monthFolderPath, String(today.day) + '.md');
			createAFile(monthFolderPath, String(today.day) + '.md', `# ${String(today.year)}.${String(today.month)}.${String(today.day)}\n\n`);

			// show file
			vscode.commands.executeCommand('vscode.open', vscode.Uri.file(dayFilePath));

			// refresh
			this.refresh();

			// vscode.window.showInformationMessage(this.workspaceRoot);
			// vscode.window.showInformationMessage("yingshaoxo is the best!");
		}
	}

	takeNotesEntry() {
		if (this.workspaceRoot) {
			// create year folder
			const today = getTodayDateObject();

			const yearFolders = getAllFoldersInPath(this.workspaceRoot);
			let found = false;
			for (let i = 0; i < yearFolders.length; i++) {
				const folder = yearFolders[i];
				if (folder === String(today.year)) {
					found = true;
				}
			}
			if (found === false) {
				createANewFolder(this.workspaceRoot, String(today.year));
			}

			// create month folder
			const yearFolderPath = path.join(this.workspaceRoot, String(today.year));
			const monthFolders = getAllFoldersInPath(yearFolderPath);
			found = false;
			for (let i = 0; i < monthFolders.length; i++) {
				const folder = monthFolders[i];
				if (folder === String(today.month)) {
					found = true;
				}
			}
			if (found === false) {
				createANewFolder(yearFolderPath, String(today.month));
			}

			// create day file
			const monthFolderPath = path.join(yearFolderPath, String(today.month));
			createANewFolder(monthFolderPath, String(today.day));

			const dayFolderPath = path.join(monthFolderPath, String(today.day));
			createAFile(dayFolderPath, 'README.md', `# ${String(today.year)}.${String(today.month)}.${String(today.day)}\n\n`);

			// show file
			vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path.join(dayFolderPath, 'README.md')));

			// refresh
			this.refresh();
		}
	}

	createAFileByUserInput(element: Dependency) {
		vscode.window.showInputBox({
			placeHolder: 'Enter file name',
			ignoreFocusOut: true,
		}).then(fileName => {
			if (fileName) {
				if (!fileName.endsWith('.md')) {
					fileName = fileName + '.md';
				}
				createAFile(element.parentFolder, fileName, '');
				this.refresh();
				this.openAfile(path.join(element.parentFolder, fileName));
			}
		});
	}

	rename(element: Dependency) {
		vscode.window.showInputBox({
			placeHolder: 'Enter new name',
			ignoreFocusOut: true,
			value: element.label,
		}).then(newName => {
			if (newName) {
				if (element.isFolder) {
					if (!checkIfStringIsNumber(newName)) {
						vscode.window.showInformationMessage(`You can only rename folder to a number.`);
						return;
					} else {
						const realParentFolder = getParentFolder(element.parentFolder);
						const oldFolderPath = path.join(realParentFolder, element.label);
						const newFolderPath = path.join(realParentFolder, newName);
						fs.renameSync(oldFolderPath, newFolderPath);
						this.refresh();
						return;
					}
				}

				if (!newName.endsWith('.md')) {
					newName = newName + '.md';
				}
				const fileOrFolderPath = path.join(element.parentFolder, element.label);

				const oldPath = fileOrFolderPath;
				const newPath = element.parentFolder + getPathSeperator() + newName;

				fs.renameSync(oldPath, newPath);
				this.refresh();
				this.openAfile(newPath);
			}
		});
	}

	convertFileToFolder(element: Dependency) {
		if (!checkIfStringIsNumber(element.label)) {
			vscode.window.showInformationMessage(`${element.label} is not a number`);
			return;
		}

		if (!element.isFolder) {
			const fileOrFolderPath = path.join(element.parentFolder, element.label);
			fs.unlinkSync(fileOrFolderPath);
			createANewFolder(element.parentFolder, element.label);
			this.refresh();
		}
	}

	deleteAFileByClick(element: Dependency) {
		const fileOrFolderPath = path.join(element.parentFolder, element.label);
		if (element.isFolder) {
			// fs.rmdirSync(element.parentFolder);
			// this.refresh();

			// vscode.window.showQuickPick(['Yes', 'No'], {
			// 	placeHolder: 'Are you sure you want to delete this folder?',
			// 	ignoreFocusOut: true,
			// }).then(answer => {
			// 	if (answer === 'Yes') {
			// 		fs.rmdirSync(fileOrFolderPath);
			// 		this.refresh();
			// 	}
			// });
		} else {
			fs.unlinkSync(fileOrFolderPath);
			this.refresh();

			// vscode.window.showQuickPick(['Yes', 'No'], {
			// 	placeHolder: 'Are you sure you want to delete this file?',
			// 	ignoreFocusOut: true,
			// }).then(answer => {
			// 	if (answer === 'Yes') {
			// 		fs.unlinkSync(fileOrFolderPath);
			// 		this.refresh();
			// 	}
			// });
		}

	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}

		if (element) {
			if (!element.isFolder) {
				return Promise.resolve([]);
			}
			return Promise.resolve(this.getTreeItems(element.parentFolder));
		} else {
			if (this.pathExists(this.workspaceRoot)) {
				return Promise.resolve(this.getTreeItems(this.workspaceRoot));
			} else {
				vscode.window.showInformationMessage('Workspace has markdown files');
				return Promise.resolve([]);
			}
		}

	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getTreeItems(parentFolderPath: string): Dependency[] {
		if (this.pathExists(parentFolderPath)) {
			const fileAndFolders = getFileAndFoldersUnderAPath(parentFolderPath).filter(fileOrFolder => {
				return checkIfStringIsNumber(fileOrFolder) === true || isMarkDownFile(fileOrFolder) === true;
			});

			const treeItems: Dependency[] = fileAndFolders.map(label => {
				const absolutePath = path.join(parentFolderPath, label);
				if (checkIfPathIsFile(absolutePath)) {
					return new Dependency(false, parentFolderPath, label, vscode.TreeItemCollapsibleState.None, {
						command: 'vscode.open',
						title: '',
						arguments: [vscode.Uri.file(absolutePath)]
					});
				} else {
					return new Dependency(true, path.join(parentFolderPath, label), label, vscode.TreeItemCollapsibleState.Collapsed);
				}
			});

			return treeItems;
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly isFolder: boolean,
		public readonly parentFolder: string,
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		// this.tooltip = `${this.label}`;
		// this.description = this.label;
	}

	// iconPath = {
	// 	light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
	// 	dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	// };

	contextValue = 'dependency';
}

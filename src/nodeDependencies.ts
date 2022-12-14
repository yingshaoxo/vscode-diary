import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const get_today_date_object = () => {
	const today = new Date();
	return {
		year: today.getFullYear(),
		month: today.getMonth() + 1,
		day: today.getDate(),
	};
};

const get_all_folders_under_a_path = (rootPath: string) => {
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

const get_all_files_under_a_path = (rootPath: string) => {
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

const get_files_and_folders_under_a_path = (rootPath: string) => {
	const filesAndFolders = [];
	if (rootPath) {
		const fileNames = fs.readdirSync(rootPath);
		fileNames.forEach(fileName => {
			filesAndFolders.push(fileName);
		});
	}
	return filesAndFolders;
};

const get_path_seperator = () => {
	if (process.platform === 'win32') {
		return '\\';
	} else {
		return '/';
	}
};

const get_parent_folder = (path: string) => {
	const pathSeperator = get_path_seperator();
	const pathArray = path.split(pathSeperator);
	pathArray.pop();
	return pathArray.join(pathSeperator);
};

const get_last_part_of_a_path = (path: string) => {
	const parts = path.split(get_path_seperator());
	return parts[parts.length - 1];
};

const create_a_new_folder = (rootPath: string, folderName: string) => {
	if (rootPath) {
		const folderPath = path.join(rootPath, folderName);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath);
		}
	}
};

const create_a_file = (rootPath: string, fileName: string, content: string) => {
	if (rootPath) {
		const filePath = path.join(rootPath, fileName);
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, content);
		}
	}
};

const check_if_string_is_number = (str: string) => {
	return /^-?[0-9]+(?:\.[0-9]+)?$/.test(str);
};

const is_markdown_file = (fileName: string) => {
	return /\.md$/.test(fileName);
};

const check_if_it_is_a_file = (path: string) => {
	if (fs.statSync(path).isFile()) {
		return true;
	}
	return false;
};

const delete_a_folder_and_its_files_recursively = function (path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			const curPath = path + get_path_seperator() + file;
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				delete_a_folder_and_its_files_recursively(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	open_a_file(filePath: string) {
		if (check_if_it_is_a_file(filePath)) {
			vscode.window.showTextDocument(vscode.Uri.file(filePath));
		}
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	create_a_new_file_for_todays_diary(): void {
		if (this.workspaceRoot) {
			// create year folder
			const today = get_today_date_object();

			const yearFolders = get_all_folders_under_a_path(this.workspaceRoot);
			let found = false;
			for (let i = 0; i < yearFolders.length; i++) {
				const folder = yearFolders[i];
				if (folder === String(today.year)) {
					found = true;
				}
			}
			if (found === false) {
				create_a_new_folder(this.workspaceRoot, String(today.year));
			}

			// create month folder
			const yearFolderPath = path.join(this.workspaceRoot, String(today.year));
			const monthFolders = get_all_folders_under_a_path(yearFolderPath);
			found = false;
			for (let i = 0; i < monthFolders.length; i++) {
				const folder = monthFolders[i];
				if (folder === String(today.month)) {
					found = true;
				}
			}
			if (found === false) {
				create_a_new_folder(yearFolderPath, String(today.month));
			}

			// create day file
			const monthFolderPath = path.join(yearFolderPath, String(today.month));
			const dayFilePath = path.join(monthFolderPath, String(today.day) + '.md');
			create_a_file(monthFolderPath, String(today.day) + '.md', `# ${String(today.year)}.${String(today.month)}.${String(today.day)}\n\n`);

			// show file
			vscode.commands.executeCommand('vscode.open', vscode.Uri.file(dayFilePath));

			// refresh
			this.refresh();

			// vscode.window.showInformationMessage(this.workspaceRoot);
			// vscode.window.showInformationMessage("yingshaoxo is the best!");
		}
	}

	take_notes_entry() {
		if (this.workspaceRoot) {
			// create year folder
			const today = get_today_date_object();

			const yearFolders = get_all_folders_under_a_path(this.workspaceRoot);
			let found = false;
			for (let i = 0; i < yearFolders.length; i++) {
				const folder = yearFolders[i];
				if (folder === String(today.year)) {
					found = true;
				}
			}
			if (found === false) {
				create_a_new_folder(this.workspaceRoot, String(today.year));
			}

			// create month folder
			const yearFolderPath = path.join(this.workspaceRoot, String(today.year));
			const monthFolders = get_all_folders_under_a_path(yearFolderPath);
			found = false;
			for (let i = 0; i < monthFolders.length; i++) {
				const folder = monthFolders[i];
				if (folder === String(today.month)) {
					found = true;
				}
			}
			if (found === false) {
				create_a_new_folder(yearFolderPath, String(today.month));
			}

			// create day file
			const monthFolderPath = path.join(yearFolderPath, String(today.month));
			create_a_new_folder(monthFolderPath, String(today.day));

			const dayFolderPath = path.join(monthFolderPath, String(today.day));

			vscode.window.showInputBox({
				placeHolder: 'Note Name',
				ignoreFocusOut: true,
			}).then(fileName => {
				if (fileName) {
					if (!fileName.endsWith('.md')) {
						fileName = fileName + '.md';
					}
					const pureFileName = fileName.slice(0, fileName.length - 3);

					create_a_file(dayFolderPath, fileName, `# ${String(pureFileName)}\n\n`);

					// show file
					vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path.join(dayFolderPath, fileName)));

					// refresh
					this.refresh();
				}
			});
		}
	}

	create_a_file_by_taking_userinput_filename(element: Dependency) {
		vscode.window.showInputBox({
			placeHolder: 'Enter file name',
			ignoreFocusOut: true,
		}).then(fileName => {
			if (fileName) {
				if (!fileName.endsWith('.md')) {
					fileName = fileName + '.md';
				}
				const pureFileName = fileName.slice(0, fileName.length - 3);
				create_a_file(element.parentFolder, fileName, `# ${String(pureFileName)}\n\n`);
				this.refresh();
				this.open_a_file(path.join(element.parentFolder, fileName));
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
					if (!check_if_string_is_number(newName)) {
						vscode.window.showInformationMessage(`You can only rename folder to a number.`);
						return;
					} else {
						const realParentFolder = get_parent_folder(element.parentFolder);
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
				const newPath = element.parentFolder + get_path_seperator() + newName;

				fs.renameSync(oldPath, newPath);
				this.refresh();
				this.open_a_file(newPath);
			}
		});
	}

	convertFileToFolder(element: Dependency) {
		if (!check_if_string_is_number(element.label)) {
			vscode.window.showInformationMessage(`${element.label} is not a number`);
			return;
		}

		if (!element.isFolder) {
			const fileOrFolderPath = path.join(element.parentFolder, element.label);
			fs.unlinkSync(fileOrFolderPath);
			create_a_new_folder(element.parentFolder, element.label);
			this.refresh();
		}
	}

	delete_a_file_when_user_click_it(element: Dependency) {
		const fileOrFolderPath = path.join(element.parentFolder, element.label);
		if (element.isFolder) {
			delete_a_folder_and_its_files_recursively(element.parentFolder);
			this.refresh();
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
			if (this.is_path_exists(this.workspaceRoot)) {
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
		if (this.is_path_exists(parentFolderPath)) {
			const fileAndFolders = get_files_and_folders_under_a_path(parentFolderPath).filter(fileOrFolder => {
				return check_if_string_is_number(fileOrFolder) === true || is_markdown_file(fileOrFolder) === true;
			});

			fileAndFolders.sort((a, b) => {
				return a.localeCompare(b, undefined, {
					numeric: true,
					sensitivity: 'base'
				});
			});

			const treeItems: Dependency[] = fileAndFolders.map(label => {
				const absolutePath = path.join(parentFolderPath, label);
				if (check_if_it_is_a_file(absolutePath)) {
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

	private is_path_exists(p: string): boolean {
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

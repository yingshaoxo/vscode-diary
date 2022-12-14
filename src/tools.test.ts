import { expect, test } from 'vitest' 

import * as fs from 'fs';

import * as tools from './tools';

const the_diary_directory = "/Users/yingshaoxo/CS/MyDiary"

test('hello vitest', () => { 
    expect(1).toBe(1) 
})

test('readdirSync', () => {
    let files_and_folders = fs.readdirSync(the_diary_directory);
    // tools.print(files_and_folders)
    expect(files_and_folders.length).toBeGreaterThan(2)
})

test('get_folder_and_files_tree', () => {
    let node = tools.get_folder_and_files_tree(
        the_diary_directory, 
        false, 
        [".md"], 
        [".git"]
    )

    expect(node.children.length).toBeGreaterThan(0)
})


test('generate_summary_readme_file', () => {
    tools.generate_summary_readme_file(the_diary_directory, "SUMMARY.md")
    let the_generated_file = tools.path_join(the_diary_directory, "SUMMARY.md")
    expect(tools.is_path_exists(the_generated_file)).toBe(true)
})
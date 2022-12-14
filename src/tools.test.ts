import { privateEncrypt } from 'crypto';
import { describe, expect, it, test } from 'vitest' 

import * as fs from 'fs';

import * as tools from './tools';

test('hello vitest', () => { 
    let files_and_folders = tools.get_files_and_folders_under_a_path("/Users/yingshaoxo/CS/MyDiary")
    files_and_folders = tools.get_files_after_gitignore_filtering(files_and_folders, [
        ".git",
        ".gitignore",
        "*.py",
        "*.ipynb",
    ])
    files_and_folders.forEach((value, index) => {
        tools.print(value)
    })
    // expect(1).toBe(1) 
})

test('readdirSync', () => {
    let files_and_folders = fs.readdirSync(".");
    // tools.print(files_and_folders)
    expect(files_and_folders.length).toBeGreaterThan(2)
})

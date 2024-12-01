export const CODES_DIR = process.env.CODES_DIR || "/tmp/codes";
export const OUTPUTS_DIR = process.env.OUTPUTS_DIR || "/tmp/outputs";


export type Language = 'java' | 'cpp' | 'py' | 'c' | 'js' | 'go' | 'cs';


export const languages = ['java', 'cpp', 'py', 'c', 'js', 'go', 'cs'] as Language[];


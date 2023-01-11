import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import err from './err.js';

/**
 * Return the yaml parsed for a given string
 * 
 * @param {string} str 
 */
const loadString = async (str) =>
  yaml.parse(str)

/**
 * Return the yaml parsed for a given file's contents
 * 
 * @param {string} file 
 */
const loadFile = async (file) => {
  const defRaw = await fs.readFileSync(
    path.join(process.cwd(), file),
    'utf-8'
  )
  return loadString(defRaw)
}

/**
 * Validate a yaml definition
 * 
 * @param {object} def The parsed yaml definition
 */
const validate = async (def) => {
  if (!def.jobs) err.fatal('No jobs found')
  if (!def.jobs.main) err.fatal('No main job found')
  if (!def.jobs.main.steps) err.fatal('No main job found')
}

/**
 * Returns a key's value from a job.
 * 
 * @param {object} def The parsed yaml definition
 * @param {string} jobName Job's name to filter by
 * @param {string} key Optional. The key to return
 * @param {string} value Optional. The property within the key to return
 */
const cfg = (def, jobName, key, value) => {
  if (!jobName) throw new Error('no jobname specified')
  return value ? def.jobs[jobName][key][value] :
    key ? def.jobs[jobName][key] :
    def.jobs[jobName]
}

export default {loadString, loadFile, validate, cfg}

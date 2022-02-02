const core = require('@actions/core');
const github = require('@actions/github');
const asana = require('asana')

ASANA_URL = 'https://app.asana.com'
ASANA_TASK_REGEX = RegExp(`${ASANA_URL}/[0-9]/[0-9]*/([0-9]*)/.*`)

const extractAsanaTaskIds = (prDescription) => {
  if (!prDescription) return []
  const taskIds = []
  const lines = prDescription.split('\n')
  while (lines.length > 0) {
    const line = lines.shift()
    const possibleMatch = ASANA_TASK_REGEX.exec(line)
    if (possibleMatch) {
      taskIds.push(possibleMatch[1])
    }
  }
  return taskIds
}

const main = async () => {
  try {
    const asanaToken = core.getInput('asana_token', { required: true })
    const client = asana.Client.create().useAccessToken(asanaToken)
    const pr = github.context.payload.pull_request
    const isMerged = github.context.payload.pull_request.merged
    core.info(`Running action for PR #${pr.number}: ${pr.body}`)
    core.info(`Is merged: ${isMerged}`)
    // if (!isMerged) return

    const taskIds = extractAsanaTaskIds(pr.body)
    for (const taskId of taskIds) {
      core.info(`Updating task: ${taskId} to be completed`)
      await client.tasks.updateTask(taskId, {
        completed: true
      })
    }
  } catch (error) {
    core.setFailed(error.payload);
  }
}

main();

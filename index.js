const core = require('@actions/core');
const github = require('@actions/github');
const asana = require('asana')

ASANA_URL = 'https://app.asana.com'
ASANA_TASK_REGEX = RegExp(`${ASANA_URL}/[0-9]/[0-9]*/([0-9]*)/.*`)

const getAsanaShortIds = (body) => {
  if (!body) return null
  const taskIds = []
  const lines = body.split('\n')
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
    core.info(
        `Running action for PR #${pr.number}: ${pr.body}. Is merged: ${isMerged}.`,
    )
    core.info('before')
    try {
      const ids = getAsanaShortIds(pr.body)
      core.info(ids.toString())
    } catch (e) {
      console.error(e.payload)
    }

    const me = await client.users.me()
    core.info(`My name is: ${me.name}`)

  } catch (error) {
    core.setFailed(error.payload);
  }
}

main();

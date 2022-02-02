const core = require('@actions/core');
const github = require('@actions/github');
const asana = require('asana')

const getAsanaShortIds = (body) => {
  if (!body) return null

  body = body.replace(/ /g, '') // raw body

  const lines = body.split('\n')
  while (lines.length > 0) {
    const line = lines.shift()
    if (startsWithAnyPrefix(line, commentPrefixes)) {
      const resp = []
      let matches
      const reg = RegExp('https://app.asana.com/[0-9]/[0-9]*/[0-9]*', 'g')
      while ((matches = reg.exec(line)) !== null) {
        resp.push(...matches[0].split('/').slice(-1))
      }
      return resp
    }
  }
  return []
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
    const shortIds = getAsanaShortIds(pr.body)
    core.info(shortIds.toString())

    const me = await client.users.me()
    core.info(`My name is: ${me.name}`)

  } catch (error) {
    core.setFailed(error.payload);
  }
}

main();

const core = require('@actions/core');
const github = require('@actions/github');
const asana = require('asana')

const main = async () => {
  try {
    const asanaToken = core.getInput('asana_token', { required: true })
    const pr = github.context.payload.pull_request
    const isMerged = github.context.payload.pull_request.merged
    const client = asana.Client.create().useAccessToken(asanaToken)
    core.info(
        `Running action for PR' #${pr.number}: ${pr.body}`,
    )
    core.info(`is merged: ${isMerged}`)
    const me = await client.users.me()
    core.info(`My name is: ${me.name}`)

  } catch (error) {
    core.setFailed(error.payload);
  }
}

main();

const core = require('@actions/core');
const github = require('@actions/github');
const asana = require('asana')

const main = async () => {
  try {
    const asanaToken = core.getInput('asana_token', { required: true })
    const pr = github.context.payload.pull_request
    core.info(
        `Running action for PR' #${pr.number}: ${pr.title}`,
    )
    const client = asana.Client.create().useAccessToken(asanaToken)
    const me = await client.users.me()
    core.info(`My name is: ${me.name}`)

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();

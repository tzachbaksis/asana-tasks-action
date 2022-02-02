# asana-tasks-action
This actions marks your linked Asana task as completed when the PR gets merged.

# usage
0. Enable Asana-Github integration for your project. Follow steps 1-3 from [create-app-attachment-github-action](https://github.com/Asana/create-app-attachment-github-action).
1. Write amazing code.
2. Open PR and attach Asana link (i.e: https://app.asana.com/0/1201712345678970/1201345678270987/f) in the description (you can have more than one).
3. When the PR gets merged, the Asana task will be automatically marked as completed.

# installation
Add a file named `update-asana-task.yaml` to your `.github/workflows` directory with the code below:
```yaml
name: Update Asana Task

on:
  pull_request:
    types: [ closed ]

jobs:
  update-asana-task:
    runs-on: ubuntu-latest
    steps:
      - name: Update Asana task
        uses: tzachbaksis/asana-tasks-action@v1.1
        with:
          asana_token: ${{ secrets.ASANA_SECRET }}
```
